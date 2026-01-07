import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsDate,
  IsBoolean,
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
    description: 'User type',
    example: 'USER',
    required: false,
  })
  @IsOptional()
  @IsString()
  userType?: string;

  @ApiProperty({
    description: 'Is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Is disabled',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDisabled?: boolean;

  @ApiProperty({
    description: 'Is verified',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({
    description: 'Address',
    example: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  @ApiProperty({
    description: 'Passport information',
    example: {
      passportNumber: 'RA2956787',
      passportExpiryDate: '2033-06-07',
      passportIssueCountry: 'Australia',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  passport?: {
    passportNumber?: string;
    passportExpiryDate?: string;
    passportIssueCountry?: string;
  };

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
