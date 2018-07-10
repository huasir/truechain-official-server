'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller
  } = app;
  router.get('/', controller.home.index);
  router.get('/test', controller.test.index);
  router.post('/uploaad', controller.home.uploaad);
  router.get('/api2/articleList', controller.main.index);
  router.get('/api2/articleDetail', controller.main.detail);
  router.get('/api2/getIpInfo', controller.main.getIpInfo);
  router.resources('topics', '/api/v2/topics', controller.topics);
  router.resources('record', '/api/v2/record', controller.record);
};