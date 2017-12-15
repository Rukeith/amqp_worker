const util = require('./util.js');

module.exports = class MessageController {
  constructor(database) {
    this.db = database.collection('Session');
  }

  create(conversationId) {
    const payload = {
      _id: util.genId(),
      _acl: {},
      _wperm: [],
      _rperm: [`role:${conversationId}`],
      expiredAt: new Date(),
      _created_at: new Date(),
      _updated_at: new Date(),
      _p_conversation: `Conversation$${conversationId}`,
    };
    payload._acl[`role:${conversationId}`] = { r: true };

    return this.db.insert(payload);
  }
};
