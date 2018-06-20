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
  router.get('/articleList', controller.main.index);
  router.get('/articleDetail', controller.main.detail);
  router.post('/uploaad', controller.home.uploaad);
  router.resources('topics', '/api/v2/topics', controller.topics);
};