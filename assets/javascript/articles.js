import socket from './socket';

const pageList = document.querySelector('.page-list');
pageList.addEventListener('click', function (e) {
  const button = e.target;//e就表示事件
  socket.emit('article page', {curPage: button.dataset.page});

  socket.on('article page', updateArticles);
});

// 更新页面文章列表
function updateArticles(data) {
  const articleNode = document.querySelector('.article-list');
  const pageNode = document.querySelector('.page-list');
  articleNode.innerHTML = data.article;
  pageNode.innerHTML = data.page;
  window.history.replaceState(null, '', '?page=' + data.curPage);
}
