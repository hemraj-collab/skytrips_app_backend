import { PartialType } from '@nestjs/swagger';
import { CreateManualBookingInput } from './create-manual-booking.input';

export class UpdateManualBookingInput extends PartialType(
  CreateManualBookingInput,
) {}
