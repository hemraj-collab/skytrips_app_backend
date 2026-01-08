import { ApiProperty } from '@nestjs/swagger';
import { CommonAttribute } from 'src/common/attribute/common.attribute';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CustomerEntity } from 'src/customer/entity/customer.entity';
import { BookingStatus } from '../enum';

@Entity('manual_bookings')
export class ManualBookingEntity extends CommonAttribute {
  @ApiProperty({
    description: 'Manual booking unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Customer ID (foreign key reference to customers table)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  customerId?: string;

  @ManyToOne(() => CustomerEntity, { nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer?: CustomerEntity;

  @ApiProperty({
    description: 'Is this booking linked to an existing customer?',
    example: true,
    required: false,
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  isExistingCustomer?: boolean;

  @ApiProperty({
    description: 'Is the traveller selected from existing traveller records?',
    example: true,
    required: false,
  })
  @Column({ type: 'boolean', default: false, nullable: true })
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
  @Column({ type: 'jsonb', nullable: true })
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
  @Column({ type: 'varchar', length: 50, nullable: true })
  tripType?: string;

  @ApiProperty({
    description: 'Travel date',
    example: '2026-06-15',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  travelDate?: Date;

  @ApiProperty({
    description: 'Origin (city / airport code)',
    example: 'JFK',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  origin?: string;

  @ApiProperty({
    description: 'Destination (city / airport code)',
    example: 'LAX',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  destination?: string;

  @ApiProperty({
    description: 'Stopover location',
    example: 'ORD',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  stopoverLocation?: string;

  @ApiProperty({
    description: 'Stopover arrival date',
    example: '2026-06-15',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  stopoverArrivalDate?: Date;

  @ApiProperty({
    description: 'Stopover departure date',
    example: '2026-06-16',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  stopoverDepartureDate?: Date;

  @ApiProperty({
    description: 'Airline',
    example: 'American Airlines',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  airline?: string;

  @ApiProperty({
    description: 'Flight number',
    example: 'AA123',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  flightNumber?: string;

  @ApiProperty({
    description: 'Class',
    example: 'economy',
    enum: ['economy', 'premium economy', 'business', 'first'],
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  class?: string;

  @ApiProperty({
    description: 'System-generated booking reference',
    example: 'BK-2026-001234',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  bookingId?: string;

  @ApiProperty({
    description: 'PNR reference code',
    example: 'ABC123',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  pnr?: string;

  @ApiProperty({
    description: 'Agency name or ID that issued the booking',
    example: 'Sky Trips Agency',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  issuedThroughAgency?: string;

  @ApiProperty({
    description: 'Agent or staff name/ID who handled the booking',
    example: 'John Smith',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  handledBy?: string;

  @ApiProperty({
    description: 'Booking status',
    example: 'confirmed',
    enum: BookingStatus,
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 50,
    default: BookingStatus.PENDING,
    nullable: true,
  })
  bookingStatus?: BookingStatus;
}
