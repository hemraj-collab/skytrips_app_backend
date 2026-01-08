import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { AdminService } from './admin.service';
import { AdminManualBookingController } from './manual-booking/admin-manual-booking.controller';
import { ManualBookingModule } from 'src/manual-booking/manual-booking.module';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [DatabaseModule, ManualBookingModule],
  controllers: [AdminManualBookingController],
  providers: [AdminService, CustomerService],
  exports: [AdminService],
})
export class AdminModule {}
