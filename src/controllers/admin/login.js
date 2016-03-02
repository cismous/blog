/**
 * Module dependencies.
 */

const moment = require('moment');

import Articles from '../../model/articles';

const stats = require("../../../build/stats.json");
const publicPath = stats.publicPath;
const hash = '?' + stats.hash;
const STYLE_URL_APP = publicPath + 'app.css' + hash;
const WEBP_STYLE_URL_APP = publicPath + 'app.webp.css' + hash;
const resource = {};

const loginController = async ctx => {
  const supportWebp = ctx.request.header.accept.indexOf('image/webp') !== -1;
  resource.style = supportWebp ? WEBP_STYLE_URL_APP : STYLE_URL_APP;
  const articles = [];
  await Articles.find().sort({created: -1}).limit(15).exec((err, _articles) => {
    if (err)
      return console.log(err);

    if (_articles.length) {
      _articles.map(article => {
        const created = moment(article.created * 1000).format('YYYY-MM-DD');
        return articles.push({created: created, title: article.title, slug: article.slug});
      });
    }
  });
  await ctx.render('./admin/login', {articles: articles, resource: resource});
};

export default loginController;
