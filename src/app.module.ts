import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManualBookingModule } from './manual-booking/manual-booking.module';
import { CustomerModule } from './customer/customer.module';
import { AdminModule } from './admin/admin.module';
import { CurrencyConverterModule } from './currency-converter/currency-converter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ManualBookingModule,
    CustomerModule,
    AdminModule,
    CurrencyConverterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
