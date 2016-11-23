'use strict';

const { createStore } = require('redux');

//ActionCreate
function selectVideo(index) {
  return {
    type: 'SELECT_VIDEO',
    index: index
  };
}

//Reducer
function videoState(state = {datas: [], index: 0}, action) {
  switch(action.type) {
  case 'SELECT_VIDEO':
    const resetDatas = [
      ...state.datas.slice(0, state.index),
      Object.assign({}, state.datas[state.index], {
        isActive: false
      }),
      ...state.datas.slice(state.index + 1)
    ];
    return Object.assign({}, state, {
      index: action.index,
      datas: [
        ...resetDatas.slice(0, action.index),
        Object.assign({}, resetDatas[action.index], {
          isActive: true
        }),
        ...resetDatas.slice(action.index + 1)
      ]
    });
  default:
    return state;
  }
}

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
        src: ''
      }
    });

    var listItem = Vue.extend({
      name: 'list-item',
      template: '<li' +
          '@click="clickHandler(index)"' +
          'v-bind:class="[item.listClass, {active : item.isActive}]">' +
          '{{ item.title }}' +
        '</li>',
      props: ['item', 'index', 'store'],
      data: function() {
        console.log(this);
        return {
          item: this.item,
          index: this.index
        };
      },
      methods: {
        clickHandler: function(index, event) {
          this.store.dispatch(selectVideo(index));
        }
      }
    });

    var listVue = new Vue({
      el: '#play-list',
      data: {
        store: createStore(videoState, {index: 0,  datas: items})
      },
      components: {
        'list-item' : listItem
      }
    });
    listVue.store.subscribe(() => {
      const state = listVue.store.getState();
      var url = state.datas[state.index].url;
      contentVue.src = url;
      listVue.$forceUpdate();
    });
    listVue.store.dispatch(selectVideo(0));
  });
}

window.onload = function() {
  var ipcRenderer = require('electron').ipcRenderer;
  ipcRenderer.send('getUrl', 'get');
  ipcRenderer.on('responseMessage', function(e, url) {
    buildHtml(url);
  });
};
