const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    const { theme = 1, pageNumber = 10, pageIndex = 0 } = ctx.query;
    // debugger
    const result = await app.mysql.get('db1').query(`
      SELECT * FROM article
      WHERE theme='${theme}'
      ORDER BY
      create_time
      DESC
      LIMIT
      ${pageIndex}, ${pageNumber}
    `);
    ctx.body = {
      code: 0,
      message: '文章列表',
      data: result
    }
  }
  async detail() {
    const { ctx, app } = this;
    const { id  } = ctx.query;
    if(!id) {
      ctx.body = {
        code: 422,
        message: '参数不全',
        data: null
      }
      return;
    }
    // debugger
    const result = await app.mysql.get('db1').query(`
      SELECT a.*, c.content FROM content as c
      INNER JOIN article as a
      ON c.sid = '${id}'
      AND a.id = '${id}'
    `);
    ctx.body = {
      code: 0,
      message: '文章列表',
      data: result
    }
  }
  async getIpInfo() {
    const { ctx, app } = this;
    const { ip  } = ctx.query;
    if(!ip) {
      ctx.body = {
        code: 422,
        message: '参数不全',
        data: null
      }
      return;
    }
    // debugger
    const result = await app.curl(`http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`);
    // console.log(result);

    ctx.body = {
      code: 0,
      message: 'ip信息',
      data: result.data.toString()
    }
  }
}

module.exports = HomeController;