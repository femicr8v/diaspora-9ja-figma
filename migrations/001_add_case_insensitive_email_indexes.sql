-- Migration: Add case-insensitive email indexes for performance
-- Date: 2025-01-22
-- Description: Creates case-insensitive indexes on email columns for both clients and leads tables
-- to improve performance of email validation queries

-- Drop existing basic email indexes if they exist
DROP INDEX IF EXISTS clients_email_idx;
DROP INDEX IF EXISTS leads_email_idx;

-- Create case-insensitive email index for clients table
-- This index will improve performance for case-insensitive email lookups
CREATE INDEX IF NOT EXISTS clients_email_lower_idx 
ON clients (LOWER(email));

-- Create case-insensitive email index for leads table
-- This index will improve performance for case-insensitive email lookups
CREATE INDEX IF NOT EXISTS leads_email_lower_idx 
ON leads (LOWER(email));

-- Add a unique constraint on lowercase email for clients to prevent duplicates
-- This ensures no two clients can have the same email (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS clients_email_unique_lower_idx 
ON clients (LOWER(email)) 
WHERE status = 'active';

-- Create a partial index for active clients only to improve performance
-- This index will be used for checking existing active clients
CREATE INDEX IF NOT EXISTS clients_active_email_idx 
ON clients (LOWER(email), status) 
WHERE status = 'active';

-- Create an index for leads status and email combination
-- This will improve performance when checking lead conversion status
CREATE INDEX IF NOT EXISTS leads_status_email_idx 
ON leads (status, LOWER(email));

-- Add comments to document the indexes
COMMENT ON INDEX clients_email_lower_idx IS 'Case-insensitive email index for clients table';
COMMENT ON INDEX leads_email_lower_idx IS 'Case-insensitive email index for leads table';
COMMENT ON INDEX clients_email_unique_lower_idx IS 'Unique case-insensitive email constraint for active clients';
COMMENT ON INDEX clients_active_email_idx IS 'Composite index for active client email lookups';
COMMENT ON INDEX leads_status_email_idx IS 'Composite index for lead status and email queries';