'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mongo',
  log_sql: true,
  log_connect: true,
  adapter: {
   mongo: {
    host: "127.0.0.1",
    port: "27017",
    database: "hawk-eye", //数据库名称
    user: "", //数据库帐号
    password: "", //数据库密码
   }
  }
};
