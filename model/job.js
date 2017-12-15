const { logger } = require('./util.js');
const MessageController = require('./message.js');
const SessionController = require('./session.js');

const jobModel = {};

jobModel.proxyConversation = async (database, msg) => {
  const body = msg.content.toString();
  const payload = JSON.parse(body);
  let routes = [
    {
      name: 'create-session',
      status: false,
    },
    {
      name: 'create-message',
      status: false,
    },
  ];

  if (payload.routes) {
    ({ routes } = payload);
  } else {
    payload.routes = routes;
    msg.content = Buffer.from(JSON.stringify(payload));
  }
  const messageController = new MessageController(database);
  const sessionController = new SessionController(database);

  try {
    let session;
    if (routes[0].status === 'false' || routes[0].status === false) {
      session = await sessionController.create(payload.conversation.objectId);
      payload.session = session;
      payload.routes[0].status = true;
      msg.content = Buffer.from(JSON.stringify(payload));
    } else {
      ({ session } = payload);
    }

    if (routes[1].status === 'false' || routes[1].status === false) {
      // throw new Error('for test');
      const msgParams = {
        platformId: 'facebook',
        data: payload.message.data,
        organizationId: '9sfeNxdSGG',
        sessionId: session.ops[0]._id,
        sender: payload.customer.objectId,
        senderType: payload.customer.className,
        contentType: payload.message.contentType,
        conversationId: payload.conversation.objectId,
      };

      await messageController.create(msgParams);
      payload.routes[1].status = true;
      msg.content = Buffer.from(JSON.stringify(payload));
    }
    return msg;
  } catch (error) {
    logger(payload, error);
    throw new Error(error);
  }
};

module.exports = jobModel;
