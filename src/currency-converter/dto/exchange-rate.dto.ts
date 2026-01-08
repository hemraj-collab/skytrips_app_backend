import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExchangeRateDto {
  @ApiProperty({
    description: 'The source Currency code (e.g., USD)',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @ApiProperty({
    description: 'The target Currency code (e.g., EUR)',
    example: 'EUR',
  })
  @IsString()
  @IsNotEmpty()
  toCurrency: string;
}
