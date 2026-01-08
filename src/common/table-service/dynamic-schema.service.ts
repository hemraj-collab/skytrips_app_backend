import { Injectable, Logger } from '@nestjs/common';
import { TableMigrationService } from 'src/common/table-service/table-migration.service';

interface ColumnDefinition {
  name: string;
  type: string;
  nullable?: boolean;
  default?: any;
}

@Injectable()
export class DynamicSchemaService {
  private readonly logger = new Logger(DynamicSchemaService.name);
  private columnCache: Map<string, Set<string>> = new Map();

  constructor(private readonly tableMigrationService: TableMigrationService) {}

  /**
   * Get all columns for a table from the database
   */
  private async getTableColumns(tableName: string): Promise<Set<string>> {
    const sql = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = $1;
    `;

    const result = await this.tableMigrationService.executeSql(
      sql.replace('$1', `'${tableName}'`),
      false,
    );

    if (result.success && result.data) {
      return new Set(result.data.map((row: any) => row.column_name));
    }

    return new Set();
  }

  /**
   * Detect missing columns and add them to the table
   */
  async ensureColumnsExist(
    tableName: string,
    columns: ColumnDefinition[],
  ): Promise<{ success: boolean; addedColumns: string[] }> {
    try {
      // Get existing columns
      const existingColumns = await this.getTableColumns(tableName);
      this.logger.log(
        `Existing columns in ${tableName}: ${Array.from(existingColumns).join(', ')}`,
      );

      // Find missing columns
      const missingColumns = columns.filter(
        (col) => !existingColumns.has(col.name),
      );

      if (missingColumns.length === 0) {
        this.logger.log(`All columns exist in ${tableName}`);
        return { success: true, addedColumns: [] };
      }

      // Build ALTER TABLE query
      const alterStatements = missingColumns.map((col) => {
        let statement = `ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`;
        if (col.default !== undefined) {
          statement += ` DEFAULT '${col.default}'`;
        }
        if (col.nullable !== false) {
          statement += ` NULL`;
        }
        return statement;
      });

      const sql = `ALTER TABLE ${tableName} ${alterStatements.join(', ')};`;

      this.logger.log(`Adding missing columns to ${tableName}: ${sql}`);

      const result = await this.tableMigrationService.executeSql(sql);

      if (result.success) {
        const addedColumnNames = missingColumns.map((col) => col.name);
        this.logger.log(
          `Successfully added columns: ${addedColumnNames.join(', ')}`,
        );

        // Update cache
        addedColumnNames.forEach((name) => existingColumns.add(name));
        this.columnCache.set(tableName, existingColumns);

        return { success: true, addedColumns: addedColumnNames };
      }

      return { success: false, addedColumns: [] };
    } catch (error) {
      this.logger.error(
        `Failed to ensure columns exist: ${error.message}`,
        error.stack,
      );
      return { success: false, addedColumns: [] };
    }
  }

  /**
   * Clear the column cache for a table
   */
  clearCache(tableName?: string) {
    if (tableName) {
      this.columnCache.delete(tableName);
    } else {
      this.columnCache.clear();
    }
  }
}
