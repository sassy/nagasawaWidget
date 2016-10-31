const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');

const fs = require('fs');
const path = require('path');

let win;

function createWindow () {
  win = new BrowserWindow({width: 700, height: 335});
  const loadUrl =  path.join('file://', app.getAppPath(), 'renderer/index.html');

  win.loadURL(loadUrl);
  win.setAlwaysOnTop(true);

  //win.webContents.openDevTools()

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('getUrl', (e, message) => {
  const string = fs.readFileSync('./main/info.json', 'utf-8');
  const json = JSON.parse(string);
  const url = 'https://www.googleapis.com/youtube/v3/' +
    'playlistItems?part=snippet' +
    '&playlistId=' + json.playlistId +
    '&key=' + json.key;

  e.sender.send('responseMessage', url);
});
