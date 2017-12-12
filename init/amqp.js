const amqp = require('amqplib');
const config = require('../config.js');
const { logger } = require('../model/util.js');

class AmqpClient {
  static async connect() {
    const conn = await amqp.connect(config.amqpUrl);
    console.info('####### Worker connected rabbitmq #######');
    process.once('SIGINT', () => {
      logger('process close');
      conn.close();
    });
    conn.on('error', () => {
      logger('connect amqp fail');
      process.exit(1);
    });
    return conn;
  }

  constructor() {
    (async () => {
      try {
        this.conn = await AmqpClient.connect();
      } catch (error) {
        logger('connect amqp fail', error);
        process.exit(1);
      }
    })();
  }
}

module.exports = new AmqpClient();
