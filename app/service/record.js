// app/service/topics.js
const Service = require('egg').Service;
const { aesEncrypt } = require('../util');

class TopicService extends Service {
  async create({ address, value, cause, wechat, mobile, supply, hash, name, from }) {
    const result = await this.app.mysql.get('db2').insert('record', {
      address,
      value,
      cause,
      wechat,
      mobile,
      supply,
      hash,
      create_time: +new Date(),
      name,
      add_from: from
    });
    if(result.affectedRows === 1) {
      return {
        code: 201,
        message: '数据插入成功',
        data: null
      }
    } else {
      this.ctx.status(500);
      ctx.body = {
        code: 500,
        message: '数据库插入错误',
        data: null
      }
    }
  }
}

module.exports = TopicService;