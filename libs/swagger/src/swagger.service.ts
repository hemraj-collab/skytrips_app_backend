import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerService {
  static setup(app: INestApplication): void {
    // Regular API Documentation
    const config = new DocumentBuilder()
      .setTitle('SkyTrips API')
      .setDescription('SkyTrips API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // Admin API Documentation
    const adminConfig = new DocumentBuilder()
      .setTitle('SkyTrips Admin API')
      .setDescription('SkyTrips Admin API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const adminDocument = SwaggerModule.createDocument(app, adminConfig);
    SwaggerModule.setup('admin/docs', app, adminDocument);
  }
}
