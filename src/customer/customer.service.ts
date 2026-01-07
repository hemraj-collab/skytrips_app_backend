import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '@app/database';
import { PaginationInput } from 'src/common/pagination';
import { CustomerEntity } from './entity/customer.entity';

@Injectable()
export class CustomerService {
  private readonly tableName = 'customers';

  constructor(private readonly supabaseService: SupabaseService) {}

  async getCustomers(
    whereParams?: Partial<CustomerEntity>,
    orderBy?: { column: string; ascending?: boolean },
    paginationInput?: PaginationInput,
  ) {
    const supabase = this.supabaseService.getClient();
    const page = paginationInput?.page || 1;
    const limit = paginationInput?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from(this.tableName).select('*', { count: 'exact' });

    // Apply filters
    if (whereParams) {
      Object.entries(whereParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy.column, {
        ascending: orderBy.ascending ?? false,
      });
    } else {
      query = query.order('createdAt', { ascending: false });
    }

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new BadRequestException(error.message);
    }

    return [data, count];
  }

  async getCustomer(
    whereParams: Partial<CustomerEntity>,
  ): Promise<CustomerEntity> {
    const supabase = this.supabaseService.getClient();
    let query = supabase.from(this.tableName).select('*');

    // Apply filters
    Object.entries(whereParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async createCustomer(customerInput: Partial<CustomerEntity>) {
    try {
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(customerInput)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateCustomer(id: string, customerInput: Partial<CustomerEntity>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .update(customerInput)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async deleteCustomer(id: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from(this.tableName).delete().eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { deleted: true };
  }

  /**
   * Creates the user_customers table programmatically if it doesn't exist
   * Uses raw SQL executed via Supabase service-role key
   * @returns Promise with success/error message
   */
  async createUserCustomersTable(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const supabase = this.supabaseService.getClient();

      // Check if table exists by trying to query it
      const { error: checkError } = await supabase
        .from(this.tableName)
        .select('id')
        .limit(1);

      // If no error or error is not "relation does not exist", table exists
      if (!checkError || !checkError.message.includes('does not exist')) {
        return {
          success: true,
          message: 'user_customers table already exists',
        };
      }

      // SQL to create the table with all required columns
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS user_customers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          "firstName" VARCHAR(100) NOT NULL,
          "lastName" VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20),
          "passportNumber" VARCHAR(50),
          "passportExpiry" DATE,
          nationality VARCHAR(50),
          "dateOfBirth" DATE,
          "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_user_customers_email ON user_customers(email);

        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW."updatedAt" = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_user_customers_updated_at ON user_customers;
        CREATE TRIGGER update_user_customers_updated_at 
        BEFORE UPDATE ON user_customers
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();

        ALTER TABLE user_customers ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Enable all access for authenticated users" ON user_customers;
        CREATE POLICY "Enable all access for authenticated users" ON user_customers
        FOR ALL USING (true) WITH CHECK (true);
      `;

      // Execute SQL using Supabase REST API with service role key
      const supabaseUrl = this.supabaseService.getClient()['supabaseUrl'];
      const supabaseKey = this.supabaseService.getClient()['supabaseKey'];

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ query: createTableSQL }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        message: 'user_customers table created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create user_customers table: ${error.message}`,
      };
    }
  }
}
