import { Configuration } from 'log4js';
import SecretConfig from './secret.config';

const log4jsConfig: Configuration = {
  appenders: {
    console: {
      type: 'console'
    },
    dateFile: {
      type: 'dateFile',
      filename: '/var/log/server/error-',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true
    },
    slack: {
      type: 'slack',
      webhook: SecretConfig.slack.webHook
    },
    slackDebug: {
      type: 'logLevelFilter',
      appender: 'slack',
      level: 'debug'
    }
  },
  categories: {
    debug: {
      appenders: ['dateFile', 'slack', 'console'],
      level: 'all',
    },
    default: {
      appenders: ['dateFile', 'slackDebug'],
      level: 'all',
    },
  },
  pm2: true
};

export default log4jsConfig;