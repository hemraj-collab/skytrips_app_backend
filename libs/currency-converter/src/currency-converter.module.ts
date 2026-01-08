import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CurrencyConverterService } from './currency-converter.service';
import currencyConverterConfig from './config/currency-converter.config';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(currencyConverterConfig)],
  providers: [CurrencyConverterService],
  exports: [CurrencyConverterService],
})
export class CurrencyConverterModule {}
