import { Controller, Post, Body, Get, Query, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/auth/auth.decorators';

@Controller('payment')
export class PaymentController {
  constructor(private readonly sslCommerzPaymentService: PaymentService) {}

  @Post('init')
  async initPayment(@Body() data: any) {
    return await this.sslCommerzPaymentService.init(data);
  }

  @Get('validate')
  async validatePayment(@Query('val_id') val_id: string) {
    return await this.sslCommerzPaymentService.validate({ val_id });
  }

  @Public()
  @Post('success')
  async paymentSuccess(@Req() req: any, @Res() res: any) {
    const paymentData = req.body;
    //console.log('Received Payment Data:', paymentData);

    const { val_id, tran_id, status } = paymentData;

    if (status === 'VALID') {
      try {
        const validationResponse = await this.sslCommerzPaymentService.validate(
          { val_id },
        );

        const savedPayment =
          await this.sslCommerzPaymentService.paymentSuccess(paymentData);

        return res.status(200).json({
          message: 'Payment Successful!',
          savedPayment,
          validationData: validationResponse,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message });
      }
    } else {
      return res.status(400).json({ message: 'Payment Failed' });
    }
  }
}
