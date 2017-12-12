const conn = require('./init/amqp.js');
const mongo = require('./init/mongo.js');

console.log('conn =', conn);
console.log('mongo =', mongo);
// const _ = require('lodash');
// const amqp = require('amqplib');
// const { MongoClient } = require('mongodb');
// const util = require('./model/util.js');

// // Connection URL
// const url = process.env.MONGO_URL || 'mongodb://localhost:27017/demo';

// // Use connect method to connect to the Server
// MongoClient.connect(url, async (err, db) => {
//   console.info('####### Worker connected mongodb #######');

//   const conn = await amqp.connect('amqp://localhost');
//   console.info('####### Worker connected rabbitmq #######');
//   process.once('SIGINT', () => conn.close());

//   const ch = await conn.createChannel();
//   await Promise.all([
//     ch.assertQueue('proxyConversation', { durable: true }),
//     ch.assertExchange('fromSocial', 'fanout', { durable: false }),
//   ]);

//   // Send message to exchange and rpc reply
//   async function sendExchange(msg) {
//     const reqId = util.genId();
//     msg.reqId = reqId;

//     try {
//       if (msg.fields.redelivered) {
//         await ch.publish('fromSocial', '', msg.content, { deliveryMode: 2 });
//         ch.sendToQueue(msg.properties.replyTo, { status: 'OK', reqId: msg.reqId }, { correlationId: msg.properties.correlationId });
//         ch.ack(msg);
//         return;
//       }

//       const body = msg.content.toSting();
//       const params = JSON.parse(body);

//       if (!_.has(params, 'unpublish') || params.unpublish === false) {
//         await ch.publish('fromSocial', '', msg.content, { deliveryMode: 2 });
//         ch.sendToQueue(msg.properties.replyTo, { status: 'OK', reqId }, { correlationId: msg.properties.correlationId });
//       }
//       ch.ack(msg);
//     } catch (error) {
//       console.info('####### Worker [x] error #######', error);
//       ch.nack(msg);
//     }
//   }
//   ch.consume('proxyConversation', sendExchange, { noAck: false });
//   console.info(' [*] Waiting for messages. To exit press CTRL+C');
// });
