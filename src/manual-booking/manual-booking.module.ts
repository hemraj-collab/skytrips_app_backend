import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ManualBookingService } from './manual-booking.service';
import { TableMigrationService } from 'src/common/table-service/table-migration.service';
import { DynamicSchemaService } from 'src/common/table-service/dynamic-schema.service';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    ManualBookingService,
    TableMigrationService,
    DynamicSchemaService,
    CustomerService,
  ],
  exports: [ManualBookingService, TableMigrationService, DynamicSchemaService],
})
export class ManualBookingModule {}
