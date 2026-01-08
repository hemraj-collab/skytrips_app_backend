import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '@app/database';
import { PaginationInput } from 'src/common/pagination';
import { ManualBookingEntity } from './entity/manual-booking.entity';

@Injectable()
export class ManualBookingService {
  private readonly tableName = 'manual_bookings';

  constructor(private readonly supabaseService: SupabaseService) {}

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
