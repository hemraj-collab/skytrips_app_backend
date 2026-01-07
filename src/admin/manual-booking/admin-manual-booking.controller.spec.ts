import { Test, TestingModule } from '@nestjs/testing';
import { AdminManualBookingController } from './admin-manual-booking.controller';

describe('AdminManualBookingController', () => {
  let controller: AdminManualBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminManualBookingController],
    }).compile();

    controller = module.get<AdminManualBookingController>(AdminManualBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
