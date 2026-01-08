import { registerAs } from '@nestjs/config';

export interface CurrencyConverterConfig {
  apiKey: string;
}
export const CURRENCY_CONVERTER_CONFIG_NAME = 'currency-converter';

export default registerAs(
  CURRENCY_CONVERTER_CONFIG_NAME,
  (): CurrencyConverterConfig => ({
    apiKey:
      process.env['CURRENCY_CONVERTER_API_KEY'] || '917b766a2a716ac6eb5b0cb3',
  }),
);
