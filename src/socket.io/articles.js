/**
 * Module dependencies.
 */

const nunjucks = require('nunjucks');
import Articles from '../model/articles';
import { getArticlePage, getArticleList } from '../controllers/article';

// app config
const config = require('../config/config');

// config template path
nunjucks.configure(config.app.templatePath, {
  watch: config.app.env === 'development'
});

export default socket => {
  socket.on('article page', async options => {
    const curPage = options && options.curPage && Number.parseInt(options.curPage);
    if (!curPage) return;

    const articles = await getArticleList(curPage);
    const page = await getArticlePage(curPage);
    const data = {curPage: curPage};
    nunjucks.render('index/list.html', {articles: articles, page: page}, (err, content) => {
      if (err)
        return console.log(err);
      data.article = content;

      nunjucks.render('index/page.html', {page: page, curPage: curPage}, (err, content) => {
        if (err)
          return console.log(err);
        data.page = content;

        socket.emit('article page', data);
      });
    });
  });
};
