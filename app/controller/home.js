'use strict';

const Controller = require('egg').Controller;
const qiniu = require('qiniu');
const path = require('path');
const crypto = require('crypto');
const md5 = crypto.createHash('md5');
const FormStream = require('formstream');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const toArray = require('stream-to-array');
class HomeController extends Controller {
  async promiseUploader (uploadToken, key, stream, putExtra, formUploader) {
    return new Promise(function(resolve, reject) {
      formUploader.putStream(uploadToken, key, stream, putExtra, function(respErr,
        respBody, respInfo) {
        if (respErr) {
          reject(respErr);
        } else {
          resolve(respBody, respInfo);
        }
      });
    });
  }
  async index() {
    this.ctx.body = {
      code: 0,
      message: '后飒飒色',
      data: null
    };

  }
  async uploaad() {
    debugger;
    const { ctx, app, config:{ qiniuUpload: { accessKey, secretKey } } } = this
    let stream         = await ctx.getFileStream();
    const config       = new qiniu.conf.Config();
    const options      = {
      scope: 'truechain-photo',
    };
    config.zone        = qiniu.zone.Zone_z1;
    const putPolicy    = new qiniu.rs.PutPolicy(options);
    const mac          = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const uploadToken  = putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra     = new qiniu.form_up.PutExtra();
    const current_date = (new Date()).valueOf().toString();
    const key = crypto.createHash('sha1').update(current_date + stream.filename).digest('hex');

    const postfix      = stream.filename.match(/\.\w+$/)[0];
    const imgSrc       = `https://qiniu.baixiaojian.com/${ key + postfix }`;
    // debugger

    if(!(['.jpg','.png'].includes(postfix))) {
      ctx.status = 402;
      ctx.body = {
        code: 402,
        message: '不支持该文件格式',
        data: null
      }
      return;
    }
    try {
      const { hash } = await this.promiseUploader(uploadToken, `${key + postfix}` , stream, putExtra, formUploader)
      if(hash) {
        ctx.body = {
          code: 0,
          message: '成功',
          data: {
            location: stream.filename,
            imgSrc
          }
        }
      } else {
        ctx.status = 502;
        ctx.body = {
          code: 502,
          message: '上传错误',
          data: null
        }
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = HomeController;