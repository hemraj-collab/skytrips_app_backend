import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsDate,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'First name of the customer',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the customer',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Phone country code',
    example: '+1',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneCountryCode?: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Gender',
    example: 'male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'Country',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Address',
    example: { street: '123 Main St', city: 'New York' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  address?: object;

  @ApiProperty({
    description: 'Passport number',
    example: 'A12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiProperty({
    description: 'Passport expiry date',
    example: '2030-12-31',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  passportExpiryDate?: Date;

  @ApiProperty({
    description: 'Passport issue country',
    example: 'USA',
    required: false,
  })
  @IsOptional()
  @IsString()
  passportIssueCountry?: string;

  @ApiProperty({
    description: 'Social provider',
    example: 'google',
    required: false,
  })
  @IsOptional()
  @IsString()
  socialProvider?: string;

  @ApiProperty({
    description: 'Social ID',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  socialId?: string;

  @ApiProperty({
    description: 'Referral code',
    example: 'REF123',
    required: false,
  })
  @IsOptional()
  @IsString()
  referralCode?: string;
}
