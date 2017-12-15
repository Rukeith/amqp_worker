const util = require('./util.js');

module.exports = class MessageController {
  constructor(database) {
    this.db = database.collection('Message');
  }

  create(params = {}) {
    const {
      data,
      platformId,
      conversationId,
      organizationId,
      sessionId,
      contentType,
      senderType,
      sender,
    } = params;

    const payload = {
      _id: util.genId(),
      data,
      sender,
      senderType,
      contentType,
      _acl: {},
      _wperm: [],
      _rperm: [`role:${conversationId}`],
      _created_at: new Date(),
      _updated_at: new Date(),
      _p_platform: `Platform$${platformId}`,
      _p_session: `ConversationSession$${sessionId}`,
      _p_conversation: `Conversation$${conversationId}`,
      _p_organization: `Organization$${organizationId}`,
    };
    payload._acl[`role:${conversationId}`] = { r: true };

    return this.db.findOneAndUpdate(payload, payload, { returnOriginal: false, upsert: true });
  }
};
