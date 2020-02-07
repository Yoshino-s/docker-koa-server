/* eslint-disable */
const Slack = require('slack-node');

function slackAppender(config, layout) {
  return loggingEvent => {
    const slack = new Slack();
    slack.setWebhook(config.webhook);
    const data = {
      text: layout(loggingEvent),
    };
    slack.webhook(data, (err) => {
      if (err) {
        console.error('log4js:slack - Error sending log to slack: ', err);
      }
    });
  };
}

function configure(config, layouts) {
  console.log(config);
  let layout = layouts.basicLayout;

  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  return slackAppender(config, layout);
}

module.exports.configure = configure;