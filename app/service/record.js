// app/service/topics.js
const Service = require('egg').Service;
const { aesEncrypt } = require('../util');

class TopicService extends Service {
  async create(params) {
    debugger;
    const sql = `
        INSERT INTO record(address, value, cause, wechat, mobile, supply, hash, create_time, name, add_from)
        VALUES (
          '${params.address}',
          '${params.value}',
          '${params.cause || ''}',
          '${params.wechat || ''}',
          '${params.mobile || ''}',
          '${params.supply || ''}',
          '${params.hash || ''}',
          '${+new Date() || ''}',
          '${params.name || ''}',
          '${params.from || ''}'
        )
      `;
      console.log(sql);

    const result = await this.app.mysql.get('db2').query(sql);
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