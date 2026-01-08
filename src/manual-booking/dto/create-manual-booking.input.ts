import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BookingStatus, PaymentStatus, PaymentMethod } from '../enum';

export class CreateManualBookingInput {
  @ApiProperty({
    description: 'Customer ID (foreign key reference to customers table)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({
    description: 'Is this booking linked to an existing customer?',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isExistingCustomer?: boolean;

  @ApiProperty({
    description: 'Is the traveller selected from existing traveller records?',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isExistingTraveller?: boolean;

  @ApiProperty({
    description: 'Traveller details',
    example: {
      fullName: 'John Doe',
      passportNumber: 'AB1234567',
      passportExpiryDate: '2030-12-31',
      nationality: 'USA',
      dateOfBirth: '1990-01-01',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  traveller?: {
    fullName: string;
    passportNumber: string;
    passportExpiryDate: string;
    nationality: string;
    dateOfBirth: string;
  };

  @ApiProperty({
    description: 'Trip type',
    example: 'round-trip',
    enum: ['one-way', 'round-trip', 'multi-city'],
    required: false,
  })
  @IsOptional()
  @IsString()
  tripType?: string;

  @ApiProperty({
    description: 'Travel date',
    example: '2026-06-15',
    required: false,
  })
  @IsOptional()
  @IsString()
  travelDate?: string;

  @ApiProperty({
    description: 'Origin (city / airport code)',
    example: 'JFK',
    required: false,
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiProperty({
    description: 'Destination (city / airport code)',
    example: 'LAX',
    required: false,
  })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({
    description: 'Stopover location',
    example: 'ORD',
    required: false,
  })
  @IsOptional()
  @IsString()
  stopoverLocation?: string;

  @ApiProperty({
    description: 'Stopover arrival date',
    example: '2026-06-15',
    required: false,
  })
  @IsOptional()
  @IsString()
  stopoverArrivalDate?: string;

  @ApiProperty({
    description: 'Stopover departure date',
    example: '2026-06-16',
    required: false,
  })
  @IsOptional()
  @IsString()
  stopoverDepartureDate?: string;

  @ApiProperty({
    description: 'Airline',
    example: 'American Airlines',
    required: false,
  })
  @IsOptional()
  @IsString()
  airline?: string;

  @ApiProperty({
    description: 'Flight number',
    example: 'AA123',
    required: false,
  })
  @IsOptional()
  @IsString()
  flightNumber?: string;

  @ApiProperty({
    description: 'Class',
    example: 'economy',
    enum: ['economy', 'premium economy', 'business', 'first'],
    required: false,
  })
  @IsOptional()
  @IsString()
  class?: string;

  @ApiProperty({
    description: 'System-generated booking reference',
    example: 'BK-2026-001234',
    required: false,
  })
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiProperty({
    description: 'PNR reference code',
    example: 'ABC123',
    required: false,
  })
  @IsOptional()
  @IsString()
  pnr?: string;

  @ApiProperty({
    description: 'Agency name or ID that issued the booking',
    example: 'Sky Trips Agency',
    required: false,
  })
  @IsOptional()
  @IsString()
  issuedThroughAgency?: string;

  @ApiProperty({
    description: 'Agent or staff name/ID who handled the booking',
    example: 'John Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  handledBy?: string;

  @ApiProperty({
    description: 'Booking status',
    example: BookingStatus.PENDING,
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  bookingStatus?: BookingStatus;

  @ApiProperty({
    description: 'Cost price of the booking',
    example: 500.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @ApiProperty({
    description: 'Selling price of the booking',
    example: 650.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @ApiProperty({
    description: 'Payment status',
    example: 'PAID',
    enum: PaymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({
    description: 'Currency used for the booking',
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'CREDIT_CARD',
    enum: PaymentMethod,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Transaction ID from payment gateway',
    example: 'txn_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({
    description: 'Date of payment',
    example: '2026-01-08',
    required: false,
  })
  @IsOptional()
  @IsString()
  dateOfPayment?: string;

  @ApiProperty({
    description: 'Additional notes or comments about the booking',
    example: 'Special meal requested',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
