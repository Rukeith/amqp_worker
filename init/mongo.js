const { MongoClient } = require('mongodb');
const config = require('../config.js');
const { logger } = require('../model/util.js');

let instance;
class Mongo {
  static async connect() {
    try {
      await MongoClient.connect(config.mongoUrl, (error, db) => {
        if (error) {
          logger('connect mongodb fail', error);
          return;
        }
        logger('connected mongodb');
        process.once('SIGINT', () => {
          logger('process close');
          db.close();
        });
        db.on('close', () => {
          logger('connect mongodb fail');
          setTimeout(Mongo.connect, 3000);
        });
        db.on('reconnect', () => {
          logger('reconnect mongodb');
        });
        instance = db;
      });
      return instance;
    } catch (error) {
      logger('connect mongodb fail', error);
    }
  }

  constructor() {
    (async () => {
      const db = await Mongo.connect();
      return db;
    })();
  }

  getInstance() {
    return instance;
  }
}

module.exports = new Mongo();
