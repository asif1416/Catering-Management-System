import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthDto } from 'src/auth/auth.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/customers')
  async getAllUsers() {
    return this.customerService.getUsers();
  }

  @Get('/customers/:id')
  async getCustomerById(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.getCustomerById(id);
  }

  @Patch('/customers/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<AuthDto>,
  ) {
    return this.customerService.updateUser(id, updateData);
  }
}
