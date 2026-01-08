import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ManualBookingService } from './manual-booking.service';
import { TableMigrationService } from 'src/common/table-service/table-migration.service';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [ManualBookingService, TableMigrationService, CustomerService],
  exports: [ManualBookingService, TableMigrationService],
})
export class ManualBookingModule {}
