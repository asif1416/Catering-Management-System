import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto, RemoveFromCartDto } from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async addToCart(@Req() request: any, @Body() addToCartDto: AddToCartDto) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('Access token is required.');
    }

    const customer = await this.cartService.getCustomer(token);

    const cartItem = await this.cartService.addToCart(
      customer.id,
      addToCartDto.menuId,
      addToCartDto.quantity,
    );

    return {
      message: 'Item added to cart',
      cartItem,
    };
  }

  @Delete('/remove')
  async removeFromCart(
    @Req() request: any,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('Access token is required.');
    }

    const customer = await this.cartService.getCustomer(token);

    await this.cartService.removeFromCart(
      customer.id,
      removeFromCartDto.menuId,
    );

    return {
      message: 'Item removed from cart',
    };
  }

  @Get()
  async getCart(@Req() request: any) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('Access token is required.');
    }

    const customer = await this.cartService.getCustomer(token);

    const cart = await this.cartService.getCart(customer.id);

    if (!cart || cart.items.length === 0) {
      return {
        message: 'Cart is empty',
        cart: null,
      };
    }

    return {
      message: 'Cart retrieved successfully',
      cart,
    };
  }

  @Delete('/clear')
  async clearCart(@Req() request: any) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('Access token is required.');
    }

    const customer = await this.cartService.getCustomer(token);

    await this.cartService.clearCart(customer.id);

    return {
      message: 'Cart cleared successfully',
    };
  }

  @Patch('/update')
  async updateCart(@Req() request: any, @Body() updateCartDto: UpdateCartDto) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('Access token is required.');
    }

    const customer = await this.cartService.getCustomer(token);

    const updatedCart = await this.cartService.updateCart(
      customer.id,
      updateCartDto.menuId,
      updateCartDto.quantity,
    );

    return {
      message: 'Cart updated successfully',
      updatedCart,
    };
  }
}
