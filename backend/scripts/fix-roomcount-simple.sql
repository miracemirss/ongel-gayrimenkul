-- Simple fix: Update null values first, then the column will be updated by TypeORM
-- Run this in Supabase SQL Editor before starting the backend

-- Update all null roomCount values to a default value
UPDATE listings SET "roomCount" = '1+1' WHERE "roomCount" IS NULL;

-- If roomCount is a number, convert existing values to string format
-- This handles the case where roomCount is already a number column
UPDATE listings 
SET "roomCount" = CAST("roomCount" AS VARCHAR) 
WHERE "roomCount" IS NOT NULL 
AND "roomCount" !~ '^[0-9]+\+[0-9]+$'; -- Only update if not already in "1+1" format

