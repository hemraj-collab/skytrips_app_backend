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
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { CustomerEntity } from './entity/customer.entity';
import { PaginationInput } from 'src/common/pagination';
import { TableMigrationService } from '../common/table-service/table-migration.service';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Customer Management')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly tableMigrationService: TableMigrationService,
  ) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @ApiCreatedResponse({
    description: 'Customer created successfully',
    type: CreateCustomerDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid customer details or email already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Email already exists or invalid data',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @Post()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      // Check if table exists, create if not
      const tableExists =
        await this.tableMigrationService.checkTableExists('customers');

      if (!tableExists) {
        // Read and execute migration SQL
        const migrationPath = path.join(
          process.cwd(),
          'src',
          'customer',
          'migrations',
          '001_create_customers_table.sql',
        );
        const sqlContent = fs.readFileSync(migrationPath, 'utf-8');
        await this.tableMigrationService.executeSql(sqlContent);
      }

      // Create customer
      return await this.customerService.createCustomer(createCustomerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Get all customers with pagination' })
  @ApiOkResponse({
    description: 'List of customers',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CustomerEntity' },
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
    name: 'email',
    required: false,
    type: String,
    description: 'Filter by email',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'Filter by country',
  })
  @Get()
  async getCustomers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('email') email?: string,
    @Query('country') country?: string,
  ) {
    const paginationInput: PaginationInput = {
      page: page || 1,
      limit: limit || 10,
    };

    const whereParams: Partial<CustomerEntity> = {};
    if (email) whereParams.email = email;
    if (country) whereParams.country = country;

    const [data, total] = await this.customerService.getCustomers(
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

  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiOkResponse({
    description: 'Customer details',
    type: CreateCustomerDto,
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Customer not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    try {
      const customer = await this.customerService.getCustomer({ id });
      if (!customer) {
        throw new NotFoundException(`Customer with id ${id} not found`);
      }
      return customer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Update a customer' })
  @ApiNotFoundResponse({
    description: 'Customer not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Customer not found' },
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
    description: 'Customer ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Patch(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const updatedCustomer = await this.customerService.updateCustomer(
        id,
        updateCustomerDto,
      );
      return {
        message: `Customer with id ${id} updated successfully`,
        data: updatedCustomer,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Delete a customer' })
  @ApiOkResponse({
    description: 'Customer deleted successfully',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Customer not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Failed to delete customer',
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
    description: 'Customer ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    try {
      await this.customerService.deleteCustomer(id);
      return {
        message: `Customer with id ${id} deleted successfully`,
        deleted: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
