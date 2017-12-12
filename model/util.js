const _ = require('lodash');
const uuid = require('uuid/v4');
const { randomBytes } = require('crypto');

module.exports = {
  getDatabase: (database, collection) => database.adapter.database.collection(collection),

  genACL: (id, permission = 'rw', isRole = false) => {
    const _acl = {},
      _rperm = [],
      _wperm = [];

    const roleId = (isRole) ? `role$${id}` : id;
    if (permission.indexOf('r') > -1) {
      _acl[roleId] = { r: true };
      _rperm.push(roleId);
    }
    if (permission.indexOf('w') > -1) {
      if (_.has(_acl, roleId)) {
        _acl[roleId].w = true;
      } else {
        _acl[roleId] = { w: true };
      }
      _wperm.push(roleId);
    }

    return { _acl, _rperm, _wperm };
  },

  genId: (type = 'objectId', size = 10) => {
    let objectId = '';
    const bytes = randomBytes(size);
    const chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');

    for (let i = 0; i < bytes.length; ++i) {
      objectId += chars[bytes.readUInt8(i) % chars.length];
    }

    switch (type) {
      case 'id':
        return uuid();
      case 'objectId':
      default:
        return objectId;
    }
  },

  logger: (payload, error) => {
    console.info({
      error,
      payload,
      timestamps: new Date().getTime(),
    });
  },
};
