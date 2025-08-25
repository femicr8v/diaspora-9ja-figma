# Database Migrations

This directory contains database migration files for the duplicate email prevention feature.

## Migration 001: Case-Insensitive Email Indexes

**File:** `001_add_case_insensitive_email_indexes.sql`

**Purpose:** Adds case-insensitive indexes on email columns for both clients and leads tables to improve performance of email validation queries.

### What this migration does:

1. **Removes old basic email indexes** - Drops the existing simple email indexes
2. **Creates case-insensitive indexes** - Adds indexes using `LOWER(email)` for both tables
3. **Adds unique constraint** - Ensures no duplicate active clients with same email (case-insensitive)
4. **Creates composite indexes** - Optimizes queries that filter by both email and status
5. **Adds documentation** - Comments on indexes for future reference

### Indexes Created:

- `clients_email_lower_idx` - Case-insensitive email index for clients
- `leads_email_lower_idx` - Case-insensitive email index for leads
- `clients_email_unique_lower_idx` - Unique constraint for active client emails
- `clients_active_email_idx` - Composite index for active client lookups
- `leads_status_email_idx` - Composite index for lead status and email queries

### Performance Benefits:

- **Faster email lookups** - Case-insensitive queries use indexes efficiently
- **Reduced query time** - Composite indexes optimize common query patterns
- **Prevents table scans** - Indexed queries avoid full table scans
- **Concurrent query support** - Indexes handle multiple simultaneous lookups

## How to Apply the Migration

### Option 1: Supabase SQL Editor (Recommended)

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `001_add_case_insensitive_email_indexes.sql`
4. Paste and execute the SQL statements
5. Verify the indexes were created successfully

### Option 2: Using the Migration Script

1. Ensure your environment variables are set in `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the migration script:

   ```bash
   node scripts/apply-email-indexes.js
   ```

3. The script will:
   - Apply the migration
   - Verify indexes were created
   - Test query performance

### Verification

After applying the migration, you can verify it worked by:

1. **Check indexes exist:**

   ```sql
   SELECT indexname, indexdef
   FROM pg_indexes
   WHERE tablename IN ('clients', 'leads')
     AND indexname LIKE '%email%';
   ```

2. **Test query performance:**

   ```sql
   EXPLAIN ANALYZE
   SELECT id FROM clients
   WHERE LOWER(email) = 'test@example.com'
     AND status = 'active';
   ```

3. **Run the test suite:**
   ```bash
   npm test database-performance --run
   ```

## Code Changes Required

After applying the migration, ensure your application code uses normalized emails:

```typescript
// ✅ Good - Uses normalized email for index optimization
const normalizedEmail = email.toLowerCase().trim();
const { data } = await supabase
  .from("clients")
  .select("id")
  .eq("email", normalizedEmail)
  .eq("status", "active");

// ❌ Bad - Uses case-insensitive operator (slower)
const { data } = await supabase
  .from("clients")
  .select("id")
  .ilike("email", email)
  .eq("status", "active");
```

## Rollback

If you need to rollback this migration:

```sql
-- Drop the new indexes
DROP INDEX IF EXISTS clients_email_lower_idx;
DROP INDEX IF EXISTS leads_email_lower_idx;
DROP INDEX IF EXISTS clients_email_unique_lower_idx;
DROP INDEX IF EXISTS clients_active_email_idx;
DROP INDEX IF EXISTS leads_status_email_idx;

-- Recreate the original simple indexes
CREATE INDEX IF NOT EXISTS clients_email_idx ON clients (email);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (email);
```

## Performance Monitoring

Monitor these metrics after applying the migration:

- **Query response times** - Should decrease for email validation queries
- **Database CPU usage** - Should remain stable or decrease
- **Index usage** - Verify new indexes are being used in query plans
- **Duplicate detection rate** - Track how often duplicates are found

## Troubleshooting

**Migration fails with "relation already exists":**

- Some indexes may already exist, this is normal
- The migration uses `IF NOT EXISTS` to handle this safely

**Queries still slow after migration:**

- Verify your code uses `eq()` with normalized emails instead of `ilike()`
- Check query plans with `EXPLAIN ANALYZE`
- Ensure environment variables are correct

**Unique constraint violations:**

- Existing duplicate active clients may prevent the unique index creation
- Clean up duplicates before applying the migration
- Or modify the migration to handle existing duplicates

## Related Files

- `src/lib/email-validation.ts` - Updated to use normalized emails
- `src/test/database-performance.test.ts` - Tests for email validation logic
- `scripts/apply-email-indexes.js` - Automated migration script
