
window.jQuery = window.$ = require('./js/jquery-3.1.1.js');

function buildHtml(url) {
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json.items);
    json.items.forEach(function(item) {
      var url = 'https://www.youtube.com/embed/' +
        item.snippet.resourceId.videoId +
        '?autoplay=1&loop=1';
      var listItem = $('<li>')
          .addClass('list-group-item')
          .attr('data-data', url)
          .text(item.snippet.title);
      listItem.on('click', function(e) {
        $('.list-group-item').removeClass('active');
        var url = $(e.target).attr('data-data');
        console.log(url);
        $('#player').attr('src', url);
        $(e.target).addClass('active');
      });
      $('#play-list').append(listItem);
    });
    $('li').eq(0).addClass('active');
  });
}

$(document).ready(function() {
  var ipcRenderer = require( 'electron' ).ipcRenderer;
  ipcRenderer.send('getUrl', 'get');
  ipcRenderer.on('responseMessage', function(e, url) {
    buildHtml(url);
  });
});
