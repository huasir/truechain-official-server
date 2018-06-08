// app/service/topics.js
const Service = require('egg').Service;
const { aesEncrypt } = require('../util');

class TopicService extends Service {
  async create(params) {
    const result = await this.app.mysql.query(`
      INSERT INTO truechain_admin.article(article_title, content, create_time, tag_list, theme)
      VALUES ('${params.article_title}', '${params.content}', '${params.create_time}', '${params.tag_list}', '${params.theme}');
    `);
    // 检查调用是否成功，如果调用失败会抛出异常
    // 返回创建的 topic 的 id
    // debugger;
    if(result.affectedRows === 1) {
      return aesEncrypt(`${result.insertId}`, this.app.config.secret);
    } else {
      this.ctx.throw(500, result);
    }
  }

  // 封装统一的调用检查函数，可以在查询、创建和更新等 Service 中复用
  checkSuccess(result) {
    if (result.status !== 200) {
      const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : 'unknown error';
      this.ctx.throw(result.status, errorMsg);
    }
    if (!result.data.success) {
      // 远程调用返回格式错误
      this.ctx.throw(500, 'remote response error', {
        data: result.data
      });
    }
  }
}

module.exports = TopicService;