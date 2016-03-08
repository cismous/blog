/**
 * Module dependencies.
 */

const markdown = require("markdown").markdown;
const moment = require('moment');

import Articles from '../model/articles';

const stats = require("../../build/stats.json");
const publicPath = stats.publicPath;
const hash = '?' + stats.hash;
const STYLE_URL_APP = publicPath + 'app.css' + hash;
const WEBP_STYLE_URL_APP = publicPath + 'app.webp.css' + hash;
const resource = {};

/**
 * @param {String} text
 * @return {Boolean}
 * @api private
 */

function isMarkdown(text) {
  return text.indexOf('<!--markdown-->') !== -1;
}

/**
 * convert article content
 *
 * @param {String} text
 * @return {String}
 * @api private
 */

function convertText(text) {
  if (isMarkdown(text))
    return markdown.toHTML(text.replace(/<!--markdown-->/g, ''));
  else
    return text.replace(/(?:\r\n|\r|\n)/g, '<br />')
}

const articleController = async (ctx, next) => {
  const supportWebp = ctx.request.header.accept.indexOf('image/webp') !== -1;
  resource.style = supportWebp ? WEBP_STYLE_URL_APP : STYLE_URL_APP;
  const slug = ctx.params.slug;
  let article;
  await Articles.findOne({slug: slug}).exec((err, data) => {
    if (err)
      return console.log(err);
    if (data)
      return article = data;
  });

  if (!article) {
    ctx.response.status = 404;
    return await next();
  }
  const created = moment(article.created * 1000).format('YYYY-MM-DD');
  await ctx.render('./article', {
    markdown: isMarkdown(article.text),
    article: {
      title: article.title,
      text: convertText(article.text),
      created: moment(article.created * 1000).format('YYYY-MM-DD')
    },
    resource: resource
  });
};

const getArticlePage = async (curPage, nPerPage = 15) => {
  let count;
  await Articles.count().exec((err, _count) => count = _count);
  let page = [];
  let totalPage = Math.ceil(count / nPerPage);

  // 少于5页
  if (totalPage <= 5) {
    page.length = 0;
    for (let i = 1; i <= totalPage; i++) {
      page.push(i)
    }
  }
  // 大余5页，并且当前页面在第三页后
  else if (curPage > 3) {
    // 最后5页
    if (curPage + 2 >= totalPage)
      page = [totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
    // 中间5页
    else {
      page.length = 5;
      for (let i = 0; i < 5; i++) {
        page[i] = i + 1 + curPage - 3;
      }
    }
  }
  // 大于5页，并且当前页面在第四页前的时候，只显示前5页
  else
    page = [1, 2, 3, 4, 5];

  return page;
};

const getArticleList = async (pageNumber, nPerPage = 15) => {
  const articles = [];
  await Articles.find()
    .sort({created: -1})
    .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
    .limit(nPerPage).exec((err, _articles) => {
      if (err)
        return console.log(err);

      if (_articles.length) {
        _articles.map(article => {
          const created = moment(article.created * 1000).format('YYYY-MM-DD');
          return articles.push({created: created, title: article.title, slug: article.slug});
        });
      }
    });
  return articles;
};

export { getArticlePage, getArticleList }
export default articleController;
