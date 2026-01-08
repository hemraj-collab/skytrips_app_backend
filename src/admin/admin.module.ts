import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { AdminService } from './admin.service';
import { AdminManualBookingController } from './manual-booking/admin-manual-booking.controller';
import { ManualBookingService } from 'src/manual-booking/manual-booking.service';
import { TableMigrationService } from 'src/common/table-service/table-migration.service';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminManualBookingController],
  providers: [
    AdminService,
    ManualBookingService,
    TableMigrationService,
    CustomerService,
  ],
  exports: [AdminService],
})
export class AdminModule {}
