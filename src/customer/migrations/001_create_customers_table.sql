-- Drop existing table if it exists (to recreate with UUID)
DROP TABLE IF EXISTS customers CASCADE;

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  "phoneCountryCode" VARCHAR(10),
  "dateOfBirth" VARCHAR(50),
  gender VARCHAR(20),
  "userType" VARCHAR(50) DEFAULT 'USER',
  "isActive" VARCHAR(10) DEFAULT 'true',
  country VARCHAR(100),
  address JSONB,
  "isDisabled" VARCHAR(10) DEFAULT 'false',
  "isVerified" VARCHAR(10) DEFAULT 'false',
  "passportNumber" VARCHAR(50),
  "passportExpiryDate" DATE,
  "passportIssueCountry" VARCHAR(100),
  "socialProvider" VARCHAR(50),
  "socialId" VARCHAR(255),
  "referralCode" VARCHAR(50),
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Create a function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updatedAt on row update
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at 
BEFORE UPDATE ON customers
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this later)
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON customers;
CREATE POLICY "Enable all access for authenticated users" ON customers
FOR ALL
USING (true)
WITH CHECK (true);
