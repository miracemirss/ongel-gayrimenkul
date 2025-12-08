-- Fix roomCount column migration
-- This script updates existing null values and changes the column type

-- Step 1: Update all null roomCount values to a default value
UPDATE listings SET "roomCount" = '1+1' WHERE "roomCount" IS NULL;

-- Step 2: If roomCount is still a number type, convert it to string
-- First, add a temporary column
ALTER TABLE listings ADD COLUMN "roomCount_temp" VARCHAR(50);

-- Step 3: Copy and convert values
UPDATE listings SET "roomCount_temp" = CAST("roomCount" AS VARCHAR) WHERE "roomCount" IS NOT NULL;

-- Step 4: Drop old column and rename new one
ALTER TABLE listings DROP COLUMN "roomCount";
ALTER TABLE listings RENAME COLUMN "roomCount_temp" TO "roomCount";

-- Step 5: Add NOT NULL constraint if needed
ALTER TABLE listings ALTER COLUMN "roomCount" SET NOT NULL;

