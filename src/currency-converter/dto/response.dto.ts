import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConvertCurrencyResponseDto {
  @ApiProperty({
    description: 'The amount after conversion',
    example: 85.5,
  })
  convertedAmount: number;

  @ApiProperty({
    description: 'The source Currency code (e.g., USD)',
    example: 'USD',
  })
  fromCurrency: string;

  @ApiProperty({
    description: 'The target Currency code (e.g., EUR)',
    example: 'EUR',
  })
  toCurrency: string;

  @ApiProperty({
    description: 'The original amount before conversion',
    example: 100.0,
  })
  @IsNotEmpty()
  amount: number;
}

export class ExchangeRateResponseDto {
  @ApiProperty({
    description: 'The source Currency code (e.g., USD)',
    example: 'USD',
  })
  exchangeRate: number;
}
