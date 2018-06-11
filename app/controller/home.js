'use strict';

const Controller = require('egg').Controller;
const qiniu = require('qiniu');
const path = require('path');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
const FormStream = require('formstream');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
class HomeController extends Controller {
  async index() {
    this.ctx.body = {
      code: 0,
      message: 'hi, egg',
      data: null
    };
  }
  async test() {
    const parts = this.ctx.multipart({ autoFields: true });
    const thisFile = await parts();
    // console.log(sss);
    const { ctx, app, config:{ qiniuUpload: { accessKey, secretKey } } } = this
    // const { accessKey, secretKey } = this.config;
    const config       = new qiniu.conf.Config();
    const options      = {
      scope: 'photo',
    };

    config.zone        = qiniu.zone.Zone_z2;
    const putPolicy    = new qiniu.rs.PutPolicy(options);
    const mac          = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const uploadToken  = putPolicy.uploadToken(mac);
    const localFile    = "/Users/baixiaojian/Desktop/fun/v2-17586bb5ff34ad3d9097c42658a53ad8_r.jpg";

    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra     = new qiniu.form_up.PutExtra();
    const key          = md5.update(`${ +new Date() }`).digest('hex');
    const postfix      = thisFile.filename.match(/\.\w+$/)[0];
    const imgSrc       = `http: //oo0yvx4fd.bkt.clouddn.com/${ key + postfix }`;

    if(!(['.jpg','.png'].includes(postfix))) {
      ctx.status = 402;
      ctx.body = {
        code: 402,
        message: '不支持该文件格式',
        data: null
      }
      return;
    }

    formUploader.putFile(uploadToken, `${key + postfix}` , localFile, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
    });
    ctx.body = {
      code: 0,
      message: '成功',
      data: {
        imgSrc
      }
    }

  }
}

module.exports = HomeController;