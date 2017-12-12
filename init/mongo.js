const mongodb = require('mongodb');
const config = require('../config.js');
const { logger } = require('../model/util.js');

class Mongo {
  static async connect() {
    const db = await mongodb.MongoClient.connect(config.mongoUrl);
    console.info('####### Worker connected mongodb #######');
    process.once('SIGINT', () => {
      logger('process close');
      db.close();
    });
    db.on('close', () => {
      logger('connect mongodb fail');
      process.exit(1);
    });
    return db;
  }

  constructor() {
    (async () => {
      try {
        this.db = await Mongo.connect();
      } catch (error) {
        logger('connect mongodb fail', error);
        process.exit(1);
      }
    })();
  }
}

module.exports = new Mongo();
