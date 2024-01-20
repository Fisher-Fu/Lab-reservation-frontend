/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  dev: {
    '/api/': {
      target: 'http://101.76.193.146:5555',
      // target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/user/': {
      target: 'http://101.76.193.146:5555',
      // target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/oauth_logout': {
      target: 'http://101.76.193.146:5555',
      // target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
};
