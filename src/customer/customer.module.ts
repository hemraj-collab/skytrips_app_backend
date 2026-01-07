import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TableMigrationService } from '../common/table-service/table-migration.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerController],
  providers: [CustomerService, TableMigrationService],
  exports: [CustomerService, TableMigrationService],
})
export class CustomerModule {}
