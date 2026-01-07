#!/bin/bash

# Script to create customers table in Supabase
# Run this once to set up your production database

echo "Creating customers table in Supabase..."
echo ""
echo "IMPORTANT: Run this SQL in your Supabase SQL Editor:"
echo "https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new"
echo ""
cat src/customer/migrations/001_create_customers_table.sql
echo ""
echo "After running the SQL in Supabase, you can deploy to Render."
