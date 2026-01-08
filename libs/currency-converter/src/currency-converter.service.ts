import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import currencyConverterConfig from './config/currency-converter.config';
import type { ConfigType } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

interface CurrencyApiResponse {
  result: string;
  conversion_result?: number;
  conversion_rate?: number;
  conversion_rates?: Record<string, number>;
}

@Injectable()
export class CurrencyConverterService {
  private readonly logger = new Logger(CurrencyConverterService.name);
  private readonly apiKey: string;
  private readonly apiBaseUrl = 'https://v6.exchangerate-api.com/v6/';

  constructor(
    private httpService: HttpService,
    @Inject(currencyConverterConfig.KEY)
    private readonly currencyConfig: ConfigType<typeof currencyConverterConfig>,
  ) {
    this.apiKey = this.currencyConfig.apiKey;
  }

  /**
   * Convert an amount from one currency to another
   * @param fromCurrency The source currency code (e.g., USD)
   * @param toCurrency The target currency code (e.g., EUR)
   * @param amount The amount to convert
   * @returns The converted amount
   */
  async convertCurrency(
    fromCurrency: string,
    toCurrency: string,
    amount: number,
  ): Promise<number> {
    try {
      this.logger.debug(
        `Converting ${amount} from ${fromCurrency} to ${toCurrency}`,
      );

      const url = `${this.apiBaseUrl}${this.apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
      const response: AxiosResponse<CurrencyApiResponse> = await lastValueFrom(
        this.httpService.get<CurrencyApiResponse>(url),
      );

      if (!response.data || response.data.result !== 'success') {
        throw new InternalServerErrorException(
          'Invalid response from currency API',
        );
      }

      const convertedAmount = response.data.conversion_result!;
      const rate = response.data.conversion_rate!;

      this.logger.debug(
        `Successfully converted ${amount} ${fromCurrency} to ${convertedAmount} ${toCurrency} (rate: ${rate})`,
      );

      return convertedAmount;
    } catch (error) {
      this.logger.error(
        `Error converting currency: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to convert currency: ${error.message}`,
      );
    }
  }

  /**
   * Get the exchange rate between two currencies
   * @param fromCurrency The source currency code (e.g., USD)
   * @param toCurrency The target currency code (e.g., EUR)
   * @returns The exchange rate value
   */
  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    try {
      this.logger.debug(
        `Getting exchange rate from ${fromCurrency} to ${toCurrency}`,
      );

      // Use amount=1 to get the rate
      const url = `${this.apiBaseUrl}${this.apiKey}/pair/${fromCurrency}/${toCurrency}/1`;
      const response: AxiosResponse<CurrencyApiResponse> = await lastValueFrom(
        this.httpService.get<CurrencyApiResponse>(url),
      );

      if (!response.data || response.data.result !== 'success') {
        throw new InternalServerErrorException(
          'Invalid response from currency API',
        );
      }

      const rate = response.data.conversion_rate!;
      this.logger.debug(
        `Exchange rate from ${fromCurrency} to ${toCurrency}: ${rate}`,
      );

      return rate;
    } catch (error) {
      this.logger.error(
        `Error fetching exchange rate: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to get exchange rate: ${error.message}`,
      );
    }
  }

  /**
   * Get all available exchange rates for a base currency
   * @param baseCurrency The base currency code (e.g., USD)
   * @returns An object with all available exchange rates
   */
  async getAllExchangeRates(
    baseCurrency: string,
  ): Promise<Record<string, number>> {
    try {
      this.logger.debug(`Getting all exchange rates for ${baseCurrency}`);

      const url = `${this.apiBaseUrl}${this.apiKey}/latest/${baseCurrency}`;
      const response: AxiosResponse<CurrencyApiResponse> = await lastValueFrom(
        this.httpService.get<CurrencyApiResponse>(url),
      );

      if (!response.data || response.data.result !== 'success') {
        throw new InternalServerErrorException(
          'Invalid response from currency API',
        );
      }

      return response.data.conversion_rates!;
    } catch (error) {
      this.logger.error(
        `Error fetching all exchange rates: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to get all exchange rates: ${error.message}`,
      );
    }
  }
}
