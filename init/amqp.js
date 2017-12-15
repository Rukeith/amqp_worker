const _ = require('lodash');
const amqp = require('amqplib');
const config = require('../config.js');
const { logger } = require('../model/util.js');

let amqpConn;
class AmqpClient {
  static async connect() {
    try {
      const conn = await amqp.connect(config.amqpUrl);
      logger('connected rabbitmq');
      process.once('SIGINT', () => {
        logger('process close');
        conn.close();
      });
      conn.on('error', (err) => {
        logger('connect amqp fail', err.message);
        if (err.message !== 'Connection closing') {
          return setTimeout(AmqpClient.connect, 3000);
        }
      });
      conn.on('close', (err) => {
        logger('connect amqp close', err.message);
        return setTimeout(AmqpClient.connect, 3000);
      });

      amqpConn = conn;
      return conn;
    } catch (error) {
      if (error) {
        logger('[AMQP] ERROR : ', error.message);
        return setTimeout(AmqpClient.connect, 3000);
      }
    }
  }

  constructor() {
    (async () => {
      try {
        this.conn = await AmqpClient.connect();
        return this.conn;
      } catch (error) {
        logger('connect amqp fail', error);
        setTimeout(AmqpClient.connect, 3000);
      }
    })();
  }

  getInstance() {
    return amqpConn;
  }

  async createChannel() {
    if (_.isNil(amqpConn)) {
      setTimeout(AmqpClient.connect, 3000);
      return;
    }

    const ch = await amqpConn.createChannel();
    ch.on('close', error => logger('[AMQP] channel closed', error));
    ch.on('error', error => logger('[AMQP] channel error', error.message));
    return ch;
  }
}

module.exports = new AmqpClient();
