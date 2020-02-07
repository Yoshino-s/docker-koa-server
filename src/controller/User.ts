import { Controller, Get, Post } from '../decorator';
import {login, logout} from '../decorator/LoginRequired';
import { Context } from '../decorator/types';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { PARAMS_FROM } from '../decorator/Parameter';
import * as joi from 'types-joi';

import { parameter, respond } from './utils';
import md5 = require('md5');
import * as crypto from 'crypto';
import sendMail from '../utils/sendMail';
import * as log4js from 'log4js';

@Controller('/user')
export default class UserController {
  repository: Repository<User>;
  constructor() {
    this.repository = getRepository(User);
  }

  @Get('/verify/:code')
  async verify(ctx: Context): Promise<object> {
    const params = parameter(joi.object({
      code: joi.string().required(),
    }).required(), PARAMS_FROM.path, ctx);
    const response = respond({ 0: 'success', 1: 'Not a valid code.', 2: 'Has been verified.'});
    
    const res = await this.repository.findOne({ verifyCode: params.code });
    if (!res) {
      return response(1);
    } else if(res.verified) {
      return response(2);
    } else {
      res.verified = true;
      await res.save();
      return response(0);
    }
  }

  @Post('/register')
  async register(ctx: Context): Promise<object> {
    const params = parameter(joi.object({
      name: joi.string().required(),
      email: joi.string().required().email(),
      password: joi.string().required(),
    }), PARAMS_FROM.body, ctx);
    const response = respond({ 0: 'Success.Please go to verify.', 1: 'Name existed.' });
    const res = await this.repository.findOne({ name: params.name });
    if (res) {
      return response(1);
    } else {
      const user = this.repository.create({
        name: params.name,
        email: params.email,
        password: md5(params.password),
        verified: false,
        verifyCode: crypto.createHmac('sha256', 'secret').update(JSON.stringify({ name: params.name, password: params.password })).digest('hex')
      });
      await user.save();
      await sendMail({
        to: params.email,
        subject: 'Please verify it.',
        text: user.verifyCode,
        html: `<b>${user.verifyCode}</b>`
      });
      return response(0);
    }    
  }

  @Post('/login')
  async login(ctx: Context): Promise<object> {
    const params = parameter(joi.object({
      name: joi.string().required(),
      password: joi.string().required(),
    }).required(), PARAMS_FROM.body, ctx);

    const response = respond({ 0: 'Login success.', 1: 'Login fail.Wrong username or password.', 2: 'The account has\'t been verified.' });

    const result = await this.repository.findOne({
      name: params.name,
      password: md5(params.password),
    });

    if (result) {
      if (!result.verified) {
        return response(2);
      }
      ctx.session.userId = result.id;
      login(ctx);
      log4js.getLogger().debug(ctx.session.inspect());
      return response(0);
    }

    return response(1);
  }

  @Get('/logout')
  async logout(ctx: Context): Promise<object> {
    const response = respond({ 0: 'Logout.' });
    logout(ctx);
    return response(0);
  }
}
