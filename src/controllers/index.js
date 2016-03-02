/**
 * Module dependencies.
 */

import Articles from '../model/articles';
import { getArticlePage, getArticleList } from '../controllers/article';

const stats = require("../../build/stats.json");
const publicPath = stats.publicPath;
const hash = '?' + stats.hash;
const SCRIPT_URL_APP = publicPath + 'index.js' + hash;
const STYLE_URL_APP = publicPath + 'app.css' + hash;
const WEBP_STYLE_URL_APP = publicPath + 'app.webp.css' + hash;
const resource = {
  script: SCRIPT_URL_APP,
};

const indexController = async ctx => {
  const curPage = Number.parseInt(ctx.query.page) || 1;
  const supportWebp = ctx.request.header.accept.indexOf('image/webp') !== -1;
  resource.style = supportWebp ? WEBP_STYLE_URL_APP : STYLE_URL_APP;
  const articles = await getArticleList(curPage);
  const page = await getArticlePage(curPage);

  await ctx.render('index.html', {articles: articles, resource: resource, page: page, curPage: curPage});
};

export default indexController;
