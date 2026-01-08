import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ManualBookingService } from 'src/manual-booking/manual-booking.service';
import {
  CreateManualBookingInput,
  UpdateManualBookingInput,
} from 'src/manual-booking/dto';
import { ManualBookingEntity } from 'src/manual-booking/entity/manual-booking.entity';
import { PaginationInput } from 'src/common/pagination';
import { TableMigrationService } from 'src/common/table-service/table-migration.service';
import { CustomerService } from 'src/customer/customer.service';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Admin - Manual Booking Management')
@Controller('admin/manual-booking')
export class AdminManualBookingController {
  constructor(
    private readonly manualBookingService: ManualBookingService,
    private readonly tableMigrationService: TableMigrationService,
    private readonly customerService: CustomerService,
  ) {}

  @ApiOperation({ summary: 'Create a new manual booking' })
  @ApiCreatedResponse({
    description: 'Manual booking created successfully',
    type: CreateManualBookingInput,
  })
  @ApiBadRequestResponse({
    description: 'Invalid booking details',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Invalid data',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @Post()
  async createManualBooking(
    @Body() createManualBookingDto: CreateManualBookingInput,
  ) {
    try {
      // Only check/create table in development mode
      if (process.env.NODE_ENV !== 'production') {
        const tableExists =
          await this.tableMigrationService.checkTableExists('manual_bookings');

        if (!tableExists) {
          // Read and execute migration SQL
          const migrationPath = path.join(
            process.cwd(),
            'src',
            'manual-booking',
            'migration',
            '001_create_manual_bookings_table.sql',
          );
          const sqlContent = fs.readFileSync(migrationPath, 'utf-8');
          await this.tableMigrationService.executeSql(sqlContent);
        }
      }

      // Validate customer exists if customerId is provided
      if (createManualBookingDto.customerId) {
        const customer = await this.customerService.getCustomer({
          id: createManualBookingDto.customerId,
        });
        if (!customer) {
          throw new NotFoundException(
            `Customer with id ${createManualBookingDto.customerId} not found`,
          );
        }
      }

      // Create manual booking
      return await this.manualBookingService.createManualBooking(
        createManualBookingDto as any,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Get all manual bookings with pagination' })
  @ApiOkResponse({
    description: 'List of manual bookings',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ManualBookingEntity' },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'bookingStatus',
    required: false,
    type: String,
    description: 'Filter by booking status',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: String,
    description: 'Filter by customer ID',
  })
  @Get()
  async getManualBookings(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('bookingStatus') bookingStatus?: string,
    @Query('customerId') customerId?: string,
  ) {
    const paginationInput: PaginationInput = {
      page: page || 1,
      limit: limit || 10,
    };

    const whereParams: Partial<ManualBookingEntity> = {};
    if (bookingStatus) whereParams.bookingStatus = bookingStatus as any;
    if (customerId) whereParams.customerId = customerId;

    const [data, total] = await this.manualBookingService.getManualBookings(
      whereParams,
      { column: 'createdAt', ascending: false },
      paginationInput,
    );

    return {
      data,
      total,
      page: paginationInput.page,
      limit: paginationInput.limit,
    };
  }

  @ApiOperation({ summary: 'Get a manual booking by ID' })
  @ApiOkResponse({
    description: 'Manual booking details',
    type: CreateManualBookingInput,
  })
  @ApiNotFoundResponse({
    description: 'Manual booking not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Manual booking not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Manual Booking ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id')
  async getManualBooking(@Param('id') id: string) {
    try {
      const booking = await this.manualBookingService.getManualBooking({ id });
      if (!booking) {
        throw new NotFoundException(`Manual booking with id ${id} not found`);
      }
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Update a manual booking' })
  @ApiNotFoundResponse({
    description: 'Manual booking not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Manual booking not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid data' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Manual Booking ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Patch(':id')
  async updateManualBooking(
    @Param('id') id: string,
    @Body() updateManualBookingDto: UpdateManualBookingInput,
  ) {
    try {
      // Validate customer exists if customerId is provided
      if (updateManualBookingDto.customerId) {
        const customer = await this.customerService.getCustomer({
          id: updateManualBookingDto.customerId,
        });
        if (!customer) {
          throw new NotFoundException(
            `Customer with id ${updateManualBookingDto.customerId} not found`,
          );
        }
      }

      const updatedBooking =
        await this.manualBookingService.updateManualBooking(
          id,
          updateManualBookingDto as any,
        );
      return {
        message: `Manual booking with id ${id} updated successfully`,
        data: updatedBooking,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Delete a manual booking' })
  @ApiOkResponse({
    description: 'Manual booking deleted successfully',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Manual booking not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Manual booking not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Failed to delete manual booking',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Delete failed' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Manual Booking ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Delete(':id')
  async deleteManualBooking(@Param('id') id: string) {
    try {
      await this.manualBookingService.deleteManualBooking(id);
      return {
        message: `Manual booking with id ${id} deleted successfully`,
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
