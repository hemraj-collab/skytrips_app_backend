import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class TableMigrationService {
  private readonly logger = new Logger(TableMigrationService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {
    // Extract connection details from Supabase URL
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');

    // Parse Supabase URL to get database connection string
    // Format: https://[project-ref].supabase.co
    // Database connection: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
    const projectRef = supabaseUrl?.match(/https:\/\/(.+?)\.supabase\.co/)?.[1];

    if (!projectRef) {
      throw new Error('Invalid Supabase URL');
    }

    // You'll need to add SUPABASE_DB_PASSWORD to your .env file
    const dbPassword = this.configService.get<string>('SUPABASE_DB_PASSWORD');

    this.pool = new Pool({
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: dbPassword,
      ssl: { rejectUnauthorized: false },
    });
  }

  /**
   * Reusable function to execute any SQL query in Supabase
   * @param sql - The SQL query to execute
   * @param useTransaction - Whether to wrap the query in a transaction (default: true)
   * @returns Promise with success/error message and optional data
   */
  async executeSql(
    sql: string,
    useTransaction: boolean = true,
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    const client = await this.pool.connect();

    try {
      if (useTransaction) {
        await client.query('BEGIN');
      }

      const result = await client.query(sql);

      if (useTransaction) {
        await client.query('COMMIT');
      }

      this.logger.log('SQL executed successfully');
      return {
        success: true,
        message: 'SQL executed successfully',
        data: result.rows,
      };
    } catch (error) {
      if (useTransaction) {
        await client.query('ROLLBACK');
      }
      this.logger.error(`Failed to execute SQL: ${error.message}`);
      return {
        success: false,
        message: `Failed to execute SQL: ${error.message}`,
      };
    } finally {
      client.release();
    }
  }

  /**
   * Check if a table exists in the database
   * @param tableName - Name of the table to check
   * @returns Promise with boolean indicating if table exists
   */
  async checkTableExists(tableName: string): Promise<boolean> {
    const client = await this.pool.connect();

    try {
      const checkTableQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `;

      const { rows } = await client.query(checkTableQuery, [tableName]);
      return rows[0].exists;
    } catch (error) {
      this.logger.error(`Failed to check table existence: ${error.message}`);
      return false;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
