-- Drop existing table if it exists
DROP TABLE IF EXISTS manual_bookings CASCADE;

-- Create manual_bookings table
CREATE TABLE manual_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "customerId" UUID,
  "isExistingCustomer" BOOLEAN DEFAULT false,
  "isExistingTraveller" BOOLEAN DEFAULT false,
  traveller JSONB,
  "tripType" VARCHAR(50),
  "travelDate" DATE,
  origin VARCHAR(100),
  destination VARCHAR(100),
  "stopoverLocation" VARCHAR(100),
  "stopoverArrivalDate" DATE,
  "stopoverDepartureDate" DATE,
  airline VARCHAR(255),
  "flightNumber" VARCHAR(50),
  class VARCHAR(50),
  "bookingId" VARCHAR(100) UNIQUE,
  pnr VARCHAR(50),
  "issuedThroughAgency" VARCHAR(255),
  "handledBy" VARCHAR(255),
  "bookingStatus" VARCHAR(50) DEFAULT 'pending',
  "costPrice" DECIMAL(10, 2),
  "sellingPrice" DECIMAL(10, 2),
  "paymentStatus" VARCHAR(50) DEFAULT 'pending',
  "currencyCode" VARCHAR(10),
  "paymentMethod" VARCHAR(50),
  "transactionId" VARCHAR(255),
  "dateOfPayment" DATE,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Foreign key constraint to customers table
  CONSTRAINT fk_manual_bookings_customer
    FOREIGN KEY ("customerId")
    REFERENCES customers(id)
    ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_manual_bookings_customer_id ON manual_bookings("customerId");
CREATE INDEX IF NOT EXISTS idx_manual_bookings_booking_id ON manual_bookings("bookingId");
CREATE INDEX IF NOT EXISTS idx_manual_bookings_pnr ON manual_bookings(pnr);
CREATE INDEX IF NOT EXISTS idx_manual_bookings_status ON manual_bookings("bookingStatus");
CREATE INDEX IF NOT EXISTS idx_manual_bookings_travel_date ON manual_bookings("travelDate");

-- Create a function to automatically update updatedAt timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt on row update
DROP TRIGGER IF EXISTS update_manual_bookings_updated_at ON manual_bookings;
CREATE TRIGGER update_manual_bookings_updated_at 
BEFORE UPDATE ON manual_bookings
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE manual_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this later)
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON manual_bookings;
CREATE POLICY "Enable all access for authenticated users" ON manual_bookings
FOR ALL
USING (true)
WITH CHECK (true);
