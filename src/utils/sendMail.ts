import * as NodeMailer from 'nodemailer';
import * as log4js from 'log4js';
import SecretConfig from '../config/secret.config';
import Mail = require('nodemailer/lib/mailer');

const transporter = NodeMailer.createTransport({
  host: 'smtp.126.com',
  secure: true,
  auth: {
    user: SecretConfig.mail.user,
    pass: SecretConfig.mail.password
  }
});

const add: Mail.Address = {
  name: 'Yoshino-s Server Verify Service',
  address: 'yoshino_s_log@126.com'
};

const sendMail = async (option: Mail.Options): Promise<any> => {
  const res = await transporter.sendMail(Object.assign(option, { from: add }));
  log4js.getLogger().debug('Send mail.' + JSON.stringify(res));
  return res;
};

export default sendMail;