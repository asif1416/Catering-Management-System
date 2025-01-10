import { Inject, Injectable } from '@nestjs/common';
import * as fetch from 'node-fetch';
import * as FormData from 'form-data';
import { PAYMENT_CONFIG } from './payment.constants';
import { PaymentConfig } from './payment.config';
import { Payment } from './payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/order/order.entity';

const paymentInitDataProcess = (data) => {
  const postData = {};

  postData['store_id'] = 'test676803ef858ea';
  postData['store_passwd'] = 'test676803ef858ea@ssl';
  postData['product_category'] = data.product_category;
  postData['tran_id'] = data.tran_id;
  postData['total_amount'] = data.total_amount;
  postData['currency'] = data.currency;
  postData['success_url'] = 'http://localhost:3000/payment/success';
  postData['fail_url'] = 'http://localhost:3000/payment/fail';
  postData['cancel_url'] = 'http://localhost:3000/payment/cancel';

  postData['emi_option'] = data.emi_option;
  postData['emi_max_inst_option'] = data.emi_max_inst_option;
  postData['emi_selected_inst'] = data.emi_selected_inst;

  postData['cus_name'] = data.cus_name;
  postData['order_id'] = data.product_profile;
  postData['cus_email'] = data.cus_email;
  postData['cus_add1'] = data.cus_add1;
  postData['cus_add2'] = data.cus_add2;
  postData['cus_city'] = data.cus_city;
  postData['cus_state'] = data.cus_state;
  postData['cus_postcode'] = data.cus_postcode;
  postData['cus_country'] = data.cus_country;
  postData['cus_phone'] = data.cus_phone;

  postData['shipping_method'] = data.shipping_method;
  postData['num_of_item'] = data.num_of_item;
  postData['weight_of_items'] = data.weight_of_items;
  postData['logistic_pickup_id'] = data.logistic_pickup_id;
  postData['logistic_delivery_type'] = data.logistic_delivery_type;

  postData['product_name'] = data.product_name;
  postData['product_category'] = data.product_category;
  postData['product_profile'] = data.product_profile;

  const fdata = new FormData();
  for (const key in postData) {
    fdata.append(key, postData[key] || '');
  }

  return fdata;
};

@Injectable()
export class PaymentService {
  private readonly baseURL: string;
  private readonly initURL: string;
  private readonly validationURL: string;
  //private readonly refundURL: string;
  //private readonly refundQueryURL: string;
  //private readonly transactionQueryBySessionIdURL: string;
  //private readonly transactionQueryByTransactionIdURL: string;
  private readonly store_id: string;
  private readonly store_passwd: string;

  constructor(
    @Inject(PAYMENT_CONFIG) config: PaymentConfig,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    const PAYMENT_LIVE_MODE = config.PAYMENT_LIVE_MODE;
    this.store_id = config.storeId;
    this.store_passwd = config.storePassword;

    this.baseURL = `https://${PAYMENT_LIVE_MODE ? 'securepay' : 'sandbox'}.sslcommerz.com`;
    this.initURL = `${this.baseURL}/gwprocess/v4/api.php`;
    this.validationURL = `${this.baseURL}/validator/api/validationserverAPI.php?`;
    //this.refundURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    //this.refundQueryURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    //this.transactionQueryBySessionIdURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    //this.transactionQueryByTransactionIdURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
  }

  async init(data: any, url: string = this.initURL): Promise<any> {
    data.store_id = this.store_id;
    data.store_passwd = this.store_passwd;
    const formData = paymentInitDataProcess(data);

    return fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .catch((err) => err);
  }

  async validate(data: any, url: string = this.validationURL): Promise<any> {
    const validationURL = `${url}val_id=${data.val_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`;

    return fetch(validationURL, {
      method: 'GET',
    })
      .then((response) => {
        console.log("Testing: ",response.json());
      })
      .catch((err) => err);
  }

  async savePayment(data: any) {
    //console.log("Data: ",data.amount);
    
    const payment = new Payment();
    payment.tran_id = data.tran_id;
    payment.total_amount = parseFloat(data.amount);
    payment.currency = data.currency;
    payment.paymentStatus = data.status;
    payment.paymentMethod = data.payment_method || 'N/A';
    payment.cardIssuer = data.card_issuer || 'N/A';
    payment.customerName = data.cus_name || 'Anonymous';
    payment.customerEmail = data.cus_email || 'no-email@example.com';
    payment.customerPhone = data.cus_phone || '0000000000';

    const savedPayment = await this.paymentRepository.save(payment);
    console.log('Payment Saved:', savedPayment);

    // if (data.order_id) {
    //   const order = await this.orderRepository.findOne({
    //     where: { id: data.order_id },
    //   });
  
    //   if (order) {
    //     payment.order = order; // Associate order with payment
    //     order.status = 'active'; // Update order status
    //     await this.orderRepository.save(order);
    //   } else {
    //     console.warn(`Order ID ${data.order_id} not found.`);
    //   }
    // } else {
    //   console.warn('No order_id provided in payment data.');
    // }
  }

   async paymentSuccess(data: any) {
    //console.log('Payment Success Data:', data);

    const savedPayment = await this.savePayment(data);

    return {
      message: 'Payment Data Saved Successfully',
      data: savedPayment,
    };
  }

}
