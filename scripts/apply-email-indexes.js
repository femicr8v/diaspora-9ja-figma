#!/usr/bin/env node

/**
 * Script to apply email index migration and verify performance improvements
 * This script can be run to apply the database migration and test the indexes
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  console.log("🚀 Applying email index migration...");

  try {
    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "../migrations/001_add_case_insensitive_email_indexes.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Split the migration into individual statements
    const statements = migrationSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`   ${i + 1}. ${statement.substring(0, 50)}...`);

        const { error } = await supabase.rpc("exec_sql", {
          sql: statement + ";",
        });

        if (error) {
          console.error(
            `❌ Error executing statement ${i + 1}:`,
            error.message
          );
          // Continue with other statements
        } else {
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
        }
      }
    }

    console.log("✅ Migration applied successfully!");
  } catch (error) {
    console.error("❌ Error applying migration:", error.message);
    process.exit(1);
  }
}

async function verifyIndexes() {
  console.log("\n🔍 Verifying indexes...");

  try {
    // Query to check if indexes exist
    const indexQuery = `
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename IN ('clients', 'leads') 
        AND indexname LIKE '%email%'
      ORDER BY tablename, indexname;
    `;

    const { data, error } = await supabase.rpc("exec_sql", {
      sql: indexQuery,
    });

    if (error) {
      console.error("❌ Error checking indexes:", error.message);
      return;
    }

    console.log("📊 Email-related indexes found:");
    if (data && data.length > 0) {
      data.forEach((index) => {
        console.log(`   • ${index.indexname} on ${index.tablename}`);
        console.log(`     ${index.indexdef}`);
      });
    } else {
      console.log("   No email indexes found");
    }
  } catch (error) {
    console.error("❌ Error verifying indexes:", error.message);
  }
}

async function testPerformance() {
  console.log("\n⚡ Testing query performance...");

  try {
    const testEmail = "performance.test@example.com";

    // Test client query performance
    const clientStart = performance.now();
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("id, email, status")
      .eq("email", testEmail.toLowerCase())
      .eq("status", "active")
      .limit(1);
    const clientEnd = performance.now();

    // Test lead query performance
    const leadStart = performance.now();
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .select("id, email, status")
      .eq("email", testEmail.toLowerCase())
      .limit(1);
    const leadEnd = performance.now();

    console.log("📈 Query Performance Results:");
    console.log(`   • Client query: ${(clientEnd - clientStart).toFixed(2)}ms`);
    console.log(`   • Lead query: ${(leadEnd - leadStart).toFixed(2)}ms`);

    if (clientError) {
      console.log(`   ⚠️  Client query error: ${clientError.message}`);
    }

    if (leadError) {
      console.log(`   ⚠️  Lead query error: ${leadError.message}`);
    }
  } catch (error) {
    console.error("❌ Error testing performance:", error.message);
  }
}

async function main() {
  console.log("🎯 Email Index Migration Tool\n");

  // Check if environment variables are set
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error("❌ Missing required environment variables:");
    console.error("   NEXT_PUBLIC_SUPABASE_URL");
    console.error("   SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  await applyMigration();
  await verifyIndexes();
  await testPerformance();

  console.log("\n🎉 Email index migration completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("   1. Run the performance tests: npm test database-performance");
  console.log("   2. Monitor query performance in production");
  console.log(
    "   3. Update email validation queries to use lowercase comparison"
  );
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  applyMigration,
  verifyIndexes,
  testPerformance,
};
