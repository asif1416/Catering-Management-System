import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  menuItemId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsDateString()
  startTime?: string; 

  @IsOptional()
  @IsDateString()
  endTime?: string; 
}
