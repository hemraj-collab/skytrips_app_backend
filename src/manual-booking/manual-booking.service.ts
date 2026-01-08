import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '@app/database';
import { PaginationInput } from 'src/common/pagination';
import { ManualBookingEntity } from './entity/manual-booking.entity';
import { DynamicSchemaService } from 'src/common/table-service/dynamic-schema.service';

@Injectable()
export class ManualBookingService {
  private readonly tableName = 'manual_bookings';
  private schemaInitialized = false;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly dynamicSchemaService: DynamicSchemaService,
  ) {}

  /**
   * Ensure all required columns exist in the table
   */
  private async ensureSchema(): Promise<void> {
    if (this.schemaInitialized) {
      return;
    }

    const columns = [
      { name: 'id', type: 'UUID' },
      { name: 'customerId', type: 'UUID' },
      { name: 'isExistingCustomer', type: 'BOOLEAN', default: false },
      { name: 'isExistingTraveller', type: 'BOOLEAN', default: false },
      { name: 'traveller', type: 'JSONB' },
      { name: 'tripType', type: 'VARCHAR(50)' },
      { name: 'travelDate', type: 'DATE' },
      { name: 'origin', type: 'VARCHAR(100)' },
      { name: 'destination', type: 'VARCHAR(100)' },
      { name: 'stopoverLocation', type: 'VARCHAR(100)' },
      { name: 'stopoverArrivalDate', type: 'DATE' },
      { name: 'stopoverDepartureDate', type: 'DATE' },
      { name: 'airline', type: 'VARCHAR(255)' },
      { name: 'flightNumber', type: 'VARCHAR(50)' },
      { name: 'class', type: 'VARCHAR(50)' },
      { name: 'bookingId', type: 'VARCHAR(100)' },
      { name: 'pnr', type: 'VARCHAR(50)' },
      { name: 'issuedThroughAgency', type: 'VARCHAR(255)' },
      { name: 'handledBy', type: 'VARCHAR(255)' },
      { name: 'bookingStatus', type: 'VARCHAR(50)', default: 'PENDING' },
      { name: 'costPrice', type: 'DECIMAL(10, 2)' },
      { name: 'sellingPrice', type: 'DECIMAL(10, 2)' },
      { name: 'paymentStatus', type: 'VARCHAR(50)', default: 'pending' },
      { name: 'currencyCode', type: 'VARCHAR(10)' },
      { name: 'paymentMethod', type: 'VARCHAR(50)' },
      { name: 'transactionId', type: 'VARCHAR(255)' },
      { name: 'dateOfPayment', type: 'DATE' },
      { name: 'notes', type: 'TEXT' },
      { name: 'createdAt', type: 'TIMESTAMPTZ' },
      { name: 'updatedAt', type: 'TIMESTAMPTZ' },
    ];

    const result = await this.dynamicSchemaService.ensureColumnsExist(
      this.tableName,
      columns,
    );

    if (result.success) {
      this.schemaInitialized = true;
      if (result.addedColumns.length > 0) {
        console.log(
          `Added missing columns to ${this.tableName}:`,
          result.addedColumns,
        );
      }
    }
  }

  async getManualBookings(
    whereParams?: Partial<ManualBookingEntity>,
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

  async getManualBooking(
    whereParams: Partial<ManualBookingEntity>,
  ): Promise<ManualBookingEntity> {
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

  async createManualBooking(bookingInput: Partial<ManualBookingEntity>) {
    try {
      // Ensure schema is up to date before creating
      await this.ensureSchema();

      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(bookingInput)
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

  async updateManualBooking(
    id: string,
    bookingInput: Partial<ManualBookingEntity>,
  ) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .update(bookingInput)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async deleteManualBooking(id: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from(this.tableName).delete().eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { deleted: true };
  }
}
