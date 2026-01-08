import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyConverterService } from '@app/currency-converter';
import {
  BaseCurrencyDto,
  ConvertCurrencyDto,
  ConvertCurrencyResponseDto,
  ExchangeRateDto,
  ExchangeRateResponseDto,
} from './dto';

@ApiTags('Currency Converter')
@Controller('currency-converter')
export class CurrencyConverterController {
  constructor(
    private readonly currencyConverterService: CurrencyConverterService,
  ) {}

  @ApiOperation({ summary: 'Convert an amount from one currency to another' })
  @ApiResponse({
    status: 200,
    description: 'The converted amount',
    type: ConvertCurrencyResponseDto,
  })
  @Post('convert')
  async convertCurrency(
    @Body() convertCurrencyDto: ConvertCurrencyDto,
  ): Promise<ConvertCurrencyResponseDto> {
    const { fromCurrency, toCurrency, amount } = convertCurrencyDto;
    const convertedAmount = await this.currencyConverterService.convertCurrency(
      fromCurrency,
      toCurrency,
      amount,
    );

    return { convertedAmount, fromCurrency, toCurrency, amount };
  }

  @ApiOperation({ summary: 'Get the exchange rate between two currencies' })
  @ApiResponse({
    status: 200,
    description: 'The exchange rate',
    type: ExchangeRateResponseDto,
  })
  @Get('exchange-rate')
  async getExchangeRate(
    @Query() exchangeRateDto: ExchangeRateDto,
  ): Promise<ExchangeRateResponseDto> {
    const { fromCurrency, toCurrency } = exchangeRateDto;
    const rate = await this.currencyConverterService.getExchangeRate(
      fromCurrency,
      toCurrency,
    );

    return { exchangeRate: rate };
  }

  @ApiOperation({
    summary: 'Get all available exchange rates for a base currency',
  })
  @ApiResponse({
    status: 200,
    description: 'All exchange rates',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
      example: {
        EUR: 0.925,
        GBP: 0.79,
        JPY: 110.25,
      },
    },
  })
  @Get('all-rates')
  async getAllExchangeRates(
    @Query() baseCurrencyDto: BaseCurrencyDto,
  ): Promise<Record<string, number>> {
    const { baseCurrency } = baseCurrencyDto;
    const rates =
      await this.currencyConverterService.getAllExchangeRates(baseCurrency);

    return rates;
  }
}
