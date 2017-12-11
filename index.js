const amqp = require('amqplib');

(async () => {
  const conn = await amqp.connect('amqp://localhost');
  console.info('####### Worker connected rabbitmq #######');
  process.once('SIGINT', () => conn.close());

  const ch = await conn.createChannel();
  await Promise.all([
    ch.assertQueue('proxyConversation', { durable: true }),
    ch.assertExchange('fromSocial', 'fanout', { durable: true }),
  ]);

  // Send message to exchange and rpc reply
  async function sendExchange(msg) {
    console.info(' [x] Received ', msg);

    try {
      await ch.publish('fromSocial', '', msg.content, { deliveryMode: 2 });
      ch.sendToQueue(msg.properties.replyTo, 'OK', { correlationId: msg.properties.correlationId });
      ch.ack(msg);
    } catch (error) {
      console.error('####### Worker [x] error #######', error);
      ch.nack(msg);
    }
  }
  ch.consume('proxyConversation', sendExchange, { noAck: false });
  console.info(' [*] Waiting for messages. To exit press CTRL+C');
})();
