import { Module } from '@nestjs/common';
import { CurrencyConverterModule as CurrencyConverterLibModule } from '@app/currency-converter';
import { CurrencyConverterController } from './currency-converter.controller';

@Module({
  imports: [CurrencyConverterLibModule],
  controllers: [CurrencyConverterController],
})
export class CurrencyConverterModule {}
