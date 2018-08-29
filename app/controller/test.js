
// app/service/topics.js
const Service = require('egg').Service;

class Test extends Service {
  async index() {
    const { ctx, app } = this;
    // const { pageIndex = 0, pageNumber = 300 } = ctx.query;
    // const result = await app.mysql.get('db3').query(`
    //   SELECT * FROM add_d
    //   LIMIT ${pageIndex}, ${pageNumber}
    // `)
    this.ctx.body = {
      code: 0,
      message: '成功',
      data: null
    }
  }
}

module.exports = Test;