module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/demo',
  amqpUrl: process.env.AMQP_URL || 'amqp://localhost',
};
