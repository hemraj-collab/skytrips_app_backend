import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CommonAttribute {
  @ApiProperty({
    description: 'Created date of the service fee',
    example: '2021-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated date of the service fee',
    example: '2021-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
