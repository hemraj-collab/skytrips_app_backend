import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '@app/database';

@Injectable()
export class TableInitializationService {
  private readonly logger = new Logger(TableInitializationService.name);
  private readonly tableName = 'user_customers';

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Checks if the user_customers table exists and is accessible
   * This is a simpler approach that doesn't create the table programmatically
   * Instead, it validates that the table exists and returns helpful feedback
   *
   * Note: For production, you should use Supabase migrations or SQL scripts
   * to create tables, not programmatic creation from NestJS
   *
   * @returns Promise with success/error message
   */
  async validateUserCustomersTable(): Promise<{
    exists: boolean;
    message: string;
    suggestion?: string;
  }> {
    try {
      const supabase = this.supabaseService.getClient();

      // Try to query the table
      const { error } = await supabase
        .from(this.tableName)
        .select('id')
        .limit(1);

      if (!error) {
        this.logger.log('user_customers table exists and is accessible');
        return {
          exists: true,
          message: 'user_customers table exists and is accessible',
        };
      }

      // Check if error is "relation does not exist"
      if (
        error.message.includes('does not exist') ||
        error.message.includes('relation') ||
        error.code === 'PGRST204' ||
        error.code === '42P01'
      ) {
        this.logger.warn('user_customers table does not exist');
        return {
          exists: false,
          message: 'user_customers table does not exist',
          suggestion:
            'Please run the migration script at src/customer/migrations/001_create_customers_table.sql or use Supabase CLI: supabase db push',
        };
      }

      // Other errors (permissions, connection, etc.)
      throw error;
    } catch (error) {
      this.logger.error(
        `Error checking user_customers table: ${error.message}`,
      );
      return {
        exists: false,
        message: `Error checking user_customers table: ${error.message}`,
        suggestion: 'Check your Supabase connection and permissions',
      };
    }
  }

  /**
   * Alternative: Initialize table using Supabase REST API
   * This requires the service role key and direct PostgreSQL access
   */
  async initializeTableViaSupabaseCLI(): Promise<{
    success: boolean;
    message: string;
  }> {
    return {
      success: false,
      message:
        'Please use one of these methods to create the table:\n' +
        '1. Supabase Dashboard: SQL Editor > Run migration script\n' +
        '2. Supabase CLI: supabase db push\n' +
        '3. Direct PostgreSQL client: psql or pg library\n' +
        '4. Migration file: src/customer/migrations/001_create_customers_table.sql',
    };
  }
}
