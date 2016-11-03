'use strict';

function buildHtml(url) {
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(json) {
    var items = [];
    json.items.forEach(function(item) {
      var data = {};
      data.url = 'https://www.youtube.com/embed/' +
        item.snippet.resourceId.videoId +
        '?autoplay=1&loop=1&controls=0';
      data.title = item.snippet.title;
      data.listClass = 'list-group-item';
      data.isActive = false;
      items.push(data);
    });



    var contentVue = new Vue({
      el: '#play-content',
      data: {
        src: 'https://www.youtube.com/embed/b8Bh7kprqOI?autoplay=1&loop=1&controls=0'
      }
    });

    var listVue = new Vue({
      el: '#play-list',
      data: {
        items: items
      },
      methods: {
        clickHandler: function(index, event) {
          var url = listVue.items[index].url;
          contentVue.src = url;
          this.items.forEach(function(item, i) {
            item.isActive = i === index ? true : false;
          });
        }
      }
    });

    listVue.items[0].isActive = true;

  });
}

window.onload = function() {
  var ipcRenderer = require('electron').ipcRenderer;
  ipcRenderer.send('getUrl', 'get');
  ipcRenderer.on('responseMessage', function(e, url) {
    buildHtml(url);
  });
};
