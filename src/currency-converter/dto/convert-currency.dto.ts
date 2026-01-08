import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { from } from 'rxjs';

export class ConvertCurrencyDto {
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

  @ApiProperty({
    description: 'The amount to be converted',
    example: 100.0,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}
