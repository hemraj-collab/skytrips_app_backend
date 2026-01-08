-- Add new columns to manual_bookings table
ALTER TABLE manual_bookings 
  ADD COLUMN IF NOT EXISTS "costPrice" DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS "sellingPrice" DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS "paymentStatus" VARCHAR(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "currencyCode" VARCHAR(10),
  ADD COLUMN IF NOT EXISTS "paymentMethod" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "transactionId" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "dateOfPayment" DATE,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Remove old currency column if it exists
ALTER TABLE manual_bookings DROP COLUMN IF EXISTS currency;
