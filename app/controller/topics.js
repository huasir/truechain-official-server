// app/controller/topics.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  title: 'string',
  content: 'string',
  create_time: 'string',
  theme: 'string',
  language: 'string'
};


class TopicController extends Controller {
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule);
    //校验登录密码
    if( this.app.config.webUserPwd != ctx.get('password') ){
      ctx.status = 422;
    }
    else{
      // 调用 service 创建一个 topic
      const topic_id = await ctx.service.topics.create(ctx.request.body);
      // // 设置响应体和状态码
      ctx.body = {
        topic_id,
      };
      ctx.status = 201;
    }
    
  }
}
module.exports = TopicController;