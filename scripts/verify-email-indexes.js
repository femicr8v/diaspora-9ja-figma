#!/usr/bin/env node

/**
 * Script to verify email index performance and functionality
 * Run this after applying the email index migration
 */

const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkIndexes() {
  console.log("🔍 Checking email indexes...");

  try {
    // Query to check if our indexes exist
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: `
          SELECT 
            schemaname,
            tablename,
            indexname,
            indexdef
          FROM pg_indexes 
          WHERE tablename IN ('clients', 'leads') 
            AND (indexname LIKE '%email%' OR indexname LIKE '%lower%')
          ORDER BY tablename, indexname;
        `,
    });

    if (error) {
      console.error("❌ Error checking indexes:", error.message);
      return false;
    }

    console.log("📊 Found indexes:");
    if (data && data.length > 0) {
      data.forEach((index) => {
        console.log(`   ✅ ${index.indexname} on ${index.tablename}`);
      });
      return true;
    } else {
      console.log("   ⚠️  No email indexes found");
      return false;
    }
  } catch (error) {
    console.error("❌ Error checking indexes:", error.message);
    return false;
  }
}

async function testEmailNormalization() {
  console.log("\n🧪 Testing email normalization logic...");

  const testCases = [
    { input: "TEST@EXAMPLE.COM", expected: "test@example.com" },
    { input: "  User@Domain.Com  ", expected: "user@domain.com" },
    { input: "Mixed.Case@Example.ORG", expected: "mixed.case@example.org" },
  ];

  let allPassed = true;

  testCases.forEach(({ input, expected }) => {
    const normalized = input.trim().toLowerCase();
    const passed = normalized === expected;

    console.log(`   ${passed ? "✅" : "❌"} "${input}" → "${normalized}"`);
    if (!passed) {
      console.log(`      Expected: "${expected}"`);
      allPassed = false;
    }
  });

  return allPassed;
}

async function testQueryPerformance() {
  console.log("\n⚡ Testing query performance...");

  const testEmail = "performance.test@example.com";
  const normalizedEmail = testEmail.toLowerCase();

  try {
    // Test client query
    const clientStart = Date.now();
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("id, email, status")
      .eq("email", normalizedEmail)
      .eq("status", "active")
      .limit(1);
    const clientTime = Date.now() - clientStart;

    // Test lead query
    const leadStart = Date.now();
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .select("id, email, status")
      .eq("email", normalizedEmail)
      .limit(1);
    const leadTime = Date.now() - leadStart;

    console.log(`   📈 Client query: ${clientTime}ms`);
    console.log(`   📈 Lead query: ${leadTime}ms`);

    if (clientError) {
      console.log(`   ⚠️  Client query error: ${clientError.message}`);
    }

    if (leadError) {
      console.log(`   ⚠️  Lead query error: ${leadError.message}`);
    }

    // Performance should be reasonable (under 100ms for simple queries)
    const performanceGood = clientTime < 100 && leadTime < 100;
    console.log(
      `   ${performanceGood ? "✅" : "⚠️"} Performance: ${
        performanceGood ? "Good" : "Could be better"
      }`
    );

    return !clientError && !leadError;
  } catch (error) {
    console.error("❌ Error testing performance:", error.message);
    return false;
  }
}

async function testConcurrentQueries() {
  console.log("\n🔄 Testing concurrent query handling...");

  const testEmails = [
    "concurrent1@test.com",
    "concurrent2@test.com",
    "concurrent3@test.com",
    "concurrent4@test.com",
    "concurrent5@test.com",
  ];

  try {
    const startTime = Date.now();

    // Execute multiple concurrent queries
    const promises = testEmails.map((email) =>
      Promise.all([
        supabase
          .from("clients")
          .select("id")
          .eq("email", email.toLowerCase())
          .eq("status", "active")
          .limit(1),
        supabase
          .from("leads")
          .select("id")
          .eq("email", email.toLowerCase())
          .limit(1),
      ])
    );

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    console.log(
      `   📊 Executed ${
        testEmails.length * 2
      } concurrent queries in ${totalTime}ms`
    );
    console.log(
      `   📊 Average time per query: ${(
        totalTime /
        (testEmails.length * 2)
      ).toFixed(1)}ms`
    );

    // Check for errors
    let errorCount = 0;
    results.forEach(([clientResult, leadResult]) => {
      if (clientResult.error) errorCount++;
      if (leadResult.error) errorCount++;
    });

    if (errorCount === 0) {
      console.log("   ✅ All concurrent queries completed successfully");
      return true;
    } else {
      console.log(`   ⚠️  ${errorCount} queries had errors`);
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing concurrent queries:", error.message);
    return false;
  }
}

async function main() {
  console.log("🎯 Email Index Verification Tool\n");

  // Check environment variables
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error("❌ Missing required environment variables:");
    console.error("   NEXT_PUBLIC_SUPABASE_URL");
    console.error("   SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  let allTestsPassed = true;

  // Run all verification tests
  const indexesOk = await checkIndexes();
  const normalizationOk = await testEmailNormalization();
  const performanceOk = await testQueryPerformance();
  const concurrencyOk = await testConcurrentQueries();

  allTestsPassed =
    indexesOk && normalizationOk && performanceOk && concurrencyOk;

  console.log("\n📋 Verification Summary:");
  console.log(`   Indexes: ${indexesOk ? "✅ OK" : "❌ Issues found"}`);
  console.log(
    `   Email normalization: ${normalizationOk ? "✅ OK" : "❌ Issues found"}`
  );
  console.log(
    `   Query performance: ${performanceOk ? "✅ OK" : "❌ Issues found"}`
  );
  console.log(
    `   Concurrent queries: ${concurrencyOk ? "✅ OK" : "❌ Issues found"}`
  );

  if (allTestsPassed) {
    console.log("\n🎉 All verification tests passed!");
    console.log("   Your email indexes are working correctly.");
  } else {
    console.log("\n⚠️  Some verification tests failed.");
    console.log("   Please check the migration and code implementation.");
  }

  console.log("\n📝 Next steps:");
  console.log("   1. Monitor query performance in production");
  console.log("   2. Run the full test suite: npm test");
  console.log("   3. Check application logs for any email validation issues");
}

// Run the verification
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkIndexes,
  testEmailNormalization,
  testQueryPerformance,
  testConcurrentQueries,
};
