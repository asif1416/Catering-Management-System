import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto, RemoveFromCartDto } from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    const { customerId, menuId, quantity } = addToCartDto;
    await this.cartService.addToCart(customerId, menuId, quantity);

    return {
      message: 'Item added to cart',
    };
  }

  @Delete('/remove')
  async removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
    const { customerId, menuId } = removeFromCartDto;
    await this.cartService.removeFromCart(customerId, menuId);

    return {
      message: 'Item removed from cart',
    };
  }

  @Get('/:customerId')
  async getCart(@Param('customerId') customerId: number) {
    const cart = await this.cartService.getCart(customerId);
    if(cart.items.length === 0) {
      return {
        message: 'Cart is empty',
      };
    }
    return {
      message: 'Cart retrieved successfully',
      cart,
    };
  }

  @Delete('/clear/:customerId')
  async clearCart(@Param('customerId') customerId: number) {
    await this.cartService.clearCart(customerId);

    return {
      message: 'Cart cleared',
    };
  }

  @Patch('/update')
  async updateCart(@Body() updateCartDto: UpdateCartDto) {
    const { customerId, menuId, quantity } = updateCartDto;
    const updatedCart = await this.cartService.updateCart(customerId, menuId, quantity);

    return {
      message: 'Cart updated successfully',
      updatedCart,
    };
  }
}
