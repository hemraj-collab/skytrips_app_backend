import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from '../../../src/admin/admin.module';
import { CustomerModule } from '../../../src/customer/customer.module';
import { ManualBookingModule } from '../../../src/manual-booking/manual-booking.module';
import { CurrencyConverterModule } from '../../../src/currency-converter/currency-converter.module';

export class SwaggerService {
  static setup(app: INestApplication): void {
    // Admin API Documentation - Only includes AdminModule controllers
    const adminConfig = new DocumentBuilder()
      .setTitle('SkyTrips Admin API')
      .setDescription('SkyTrips Admin API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
      include: [AdminModule],
    });
    SwaggerModule.setup('admin/docs', app, adminDocument);

    // Regular API Documentation - Excludes AdminModule controllers
    const config = new DocumentBuilder()
      .setTitle('SkyTrips API')
      .setDescription('SkyTrips API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: [CustomerModule, ManualBookingModule, CurrencyConverterModule],
    });

    SwaggerModule.setup('docs', app, document);
  }
}
