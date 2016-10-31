
window.jQuery = window.$ = require('./js/jquery-3.1.1.js');

function buildHtml(url) {
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(json) {
    var items = [];
    json.items.forEach(function(item) {
      var data = {};
      data.url = 'https://www.youtube.com/embed/' +
        item.snippet.resourceId.videoId +
        '?autoplay=1&loop=1';
      data.title = item.snippet.title;
      data.listClass = 'list-group-item';
      data.isActive = false;
      items.push(data);
    });


    var vue = new Vue({
      el: '#play-list',
      data: {
        items: items
      },
      methods: {
        clickHandler: function(event) {
          $('.list-group-item').removeClass('active');
          var url = $(event.target).attr('data-data');
          console.log(url);
          $('#player').attr('src', url);
          $(event.target).addClass('active');
        }
      }
    });

    vue.items[0].isActive = true;
  });
}

$(document).ready(function() {
  var ipcRenderer = require( 'electron' ).ipcRenderer;
  ipcRenderer.send('getUrl', 'get');
  ipcRenderer.on('responseMessage', function(e, url) {
    buildHtml(url);
  });
});
