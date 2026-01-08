import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseCurrencyDto {
  @ApiProperty({
    description: 'Base currency code (ISO 4217)',
    example: 'USD',
  })
  @IsNotEmpty()
  @IsString()
  baseCurrency: string;
}
