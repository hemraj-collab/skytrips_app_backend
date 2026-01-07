import { Test, TestingModule } from '@nestjs/testing';
import { ManualBookingService } from './manual-booking.service';

describe('ManualBookingService', () => {
  let service: ManualBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManualBookingService],
    }).compile();

    service = module.get<ManualBookingService>(ManualBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
