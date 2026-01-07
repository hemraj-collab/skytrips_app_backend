import { Module } from '@nestjs/common';
import { ManualBookingService } from './manual-booking.service';

@Module({
  providers: [ManualBookingService],
  exports: [ManualBookingService],
})
export class ManualBookingModule {}
