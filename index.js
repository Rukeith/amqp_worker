const conn = require('./init/amqp.js');
const db = require('./init/mongo.js');
const { logger } = require('./model/util.js');
const jobModel = require('./model/job.js');

setTimeout(async () => {
  const database = db.getInstance();
  const ch = await conn.createChannel();
  await Promise.all([
    ch.assertQueue('proxyConversation', { durable: true }),
    ch.assertExchange('chat', 'fanout', { durable: false }),
  ]);

  async function proxyConversation(msg) {
    console.info('Worker receive message =', msg);
    const { properties, fields } = msg;
    const { replyTo, correlationId } = properties;

    try {
      if (!fields.redelivered) {
        await jobModel.proxyConversation(database, msg);
      }
      await ch.publish('chat', '', msg.content, { deliveryMode: 2 });
      if (replyTo && correlationId) {
        await ch.sendToQueue(replyTo, Buffer.from('OK'), { correlationId, deliveryMode: true });
      }
      logger(JSON.parse(msg.content.toString()));
      ch.ack(msg);
    } catch (error) {
      logger(JSON.parse(msg.content.toString()), error);
      await ch.sendToQueue('proxyConversation', msg.content);
      ch.ack(msg);
    }
  }

  await ch.consume('proxyConversation', proxyConversation, { noAck: false });
  logger('Worker start');
}, 2000);
