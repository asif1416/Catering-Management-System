import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';
import { AuthDto } from 'src/auth/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
     constructor(
         @InjectRepository(Customer)
         private readonly customerRepository: Repository<Customer>,
       ) {}

       async getUsers(): Promise<Customer[]> {
        return this.customerRepository.find();
      }

      async getCustomerById(id: number): Promise<Customer> {
        const customer = await this.customerRepository.findOne({ where: { id } });
        if (!customer) {
          throw new NotFoundException(`User with ID ${id} not found.`);
        }
        return customer;
      }
    
      async updateUser(
        id: number,
        updateData: Partial<AuthDto>,
      ): Promise<Customer> {
        const user = await this.customerRepository.findOne({ where: { id } });
      
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found.`);
        }
      
        /*if (updateData.password) {
          const saltRounds = 10;
          updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }*/
      
        Object.assign(user, updateData);
        return this.customerRepository.save(user);
      }
      
}
