import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Customer } from '../customer/customer.entity';
import { Menu } from '../menu/menu.entity';
import { CartItem } from './cartItem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async addToCart(
    customerId: number,
    menuId: number,
    quantity: number,
  ): Promise<CartItem> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
  
    const menu = await this.menuRepository.findOne({
      where: { id: menuId },
    });
    if (!menu) {
      throw new NotFoundException('Menu item not found');
    }
  
    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { customer: { id: customerId } },
        menu: { id: menuId },
      },
      relations: ['cart', 'menu'],
    });
  
    if (cartItem) { // If the item is already in the cart
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * menu.price;
  
      await this.cartItemRepository.save(cartItem);
    } else { // If the item is not in the cart
      const newCart = await this.cartRepository.findOne({
        where: { customer: { id: customerId } },
      });
  
      if (!newCart) {
        throw new NotFoundException('Cart not found for customer');
      }
  
      cartItem = this.cartItemRepository.create({
        cart: newCart,
        menu,
        quantity,
        totalPrice: quantity * menu.price,
      });
  
      await this.cartItemRepository.save(cartItem);
    }
  
    return cartItem;
  }  
  

  async removeFromCart(customerId: number, menuId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { customer: { id: customerId } },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, menu: { id: menuId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async getCart(customerId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { customer: { id: customerId } },
      relations: ['items', 'items.menu'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async clearCart(customerId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { customer: { id: customerId } },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartItemRepository.remove(cart.items);
  }

  async updateCart(customerId: number, menuId: number, quantity: number): Promise<CartItem> {
    const cart = await this.cartRepository.findOne({
      where: { customer: { id: customerId } },
      relations: ['items', 'items.menu'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, menu: { id: menuId } },
      relations: ['menu'],
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * cartItem.menu.price;

    return this.cartItemRepository.save(cartItem);
  }
}
