const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    const { theme = 1, pageNumber = 10, pageIndex = 0, language = 1 } = ctx.query;
    const result = await app.mysql.get('db1').query(`
<<<<<<< HEAD
      SELECT * FROM article
      WHERE language = ?
      ORDER BY
      create_time
      DESC
      LIMIT
      ?, ?
    `,
    [language, Number( pageIndex ), Number( pageNumber ) ]
    );
=======
        SELECT * FROM article
        WHERE language='${language}'
        ORDER BY
        create_time
        DESC
        LIMIT
        ${pageIndex}, ${pageNumber}
    `);
>>>>>>> 1f06066358388e34a18d074d4d72ca53b77c75aa
    ctx.body = {
      code: 0,
      message: '文章列表',
      data: result
    }
  }

  async detail() {
    const { ctx, app } = this;
    const { id } = ctx.query;
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
      ON c.sid = ?
      AND a.id = ?
    `,
    [id,id]
    );
    ctx.body = {
      code: 0,
      message: '文章列表',
      data: result
    }
  }

  async webLogin(){
    const { ctx, app } = this;

    //校验登录密码
    if( app.config.webUserPwd === ctx.get('password') ){
      ctx.body = {
        code: 200,
        message: 'login success'
      }
    }
    else{
      ctx.status = 204;
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
    console.log(result);

    ctx.body = {
      code: 0,
      message: 'ip信息',
      data: result.data.toString()
    }
  }
}

module.exports = HomeController;