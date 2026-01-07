import { ApiProperty } from '@nestjs/swagger';
import { CommonAttribute } from 'src/common/attribute/common.attribute';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customers')
export class CustomerEntity extends CommonAttribute {
  @ApiProperty({
    description: 'Customer unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'First name of the customer',
    example: 'John',
  })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the customer',
    example: 'Doe',
  })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'john.doe@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
    required: false,
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @ApiProperty({
    description: 'Phone country code',
    example: '+1',
    required: false,
  })
  @Column({ type: 'varchar', length: 10, nullable: true })
  phoneCountryCode?: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Gender',
    example: 'male',
    required: false,
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string;

  @ApiProperty({
    description: 'User type',
    example: 'USER',
  })
  @Column({ type: 'varchar', length: 50, default: 'USER' })
  userType: string;

  @ApiProperty({
    description: 'Is active',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Country',
    example: 'USA',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

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
  @Column({ type: 'jsonb', nullable: true })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  @ApiProperty({
    description: 'Is disabled',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isDisabled: boolean;

  @ApiProperty({
    description: 'Is verified',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @ApiProperty({
    description: 'Passport information',
    example: {
      passportNumber: 'RA2956787',
      passportExpiryDate: '2033-06-07',
      passportIssueCountry: 'Australia',
    },
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
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
  @Column({ type: 'varchar', length: 50, nullable: true })
  socialProvider?: string;

  @ApiProperty({
    description: 'Social ID',
    example: '1234567890',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  socialId?: string;

  @ApiProperty({
    description: 'Referral code',
    example: 'REF123',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  referralCode?: string;
}
