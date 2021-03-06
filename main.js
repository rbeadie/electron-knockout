const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')

const path = require('path')
const menu = require('./menu')
const url = require('url')
const pug = require('electron-pug')({pretty: true})

//-----------------------------------------------------------------------------
// Get the configuration values and determine the application mode
//-----------------------------------------------------------------------------

const pkgconfig = require('pkgconfig')
const config = pkgconfig()
const development = config.app.mode.development

//-----------------------------------------------------------------------------
// Initialize the logger and indicate application start up.
//-----------------------------------------------------------------------------

const pkglogger = require('pkglogger')
const appdir = require('./lib/appdir')
pkglogger.dir(appdir.resolve('logs'))
const log = pkglogger(module)
const devString = development ? 'development' : 'production'
log.info('Started the application ({0}).', devString)

//-----------------------------------------------------------------------------
// Turn on automatic reload on file changes if in development mode.
//-----------------------------------------------------------------------------

if (development) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.exe'),
        ignored: /node_modules|[\/\\]\.|logs/
    })
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800, 
    height: 800,
    title: 'Electron-Knockout'
  })

  win.setMenu(null);
  menu.createMainMenu(app, win)

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.pug'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('ready-to-show', _ => {
    console.log('ready to show')
  })
  // Emitted when the window is closed.
  win.on('closed', _ =>{
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', _ =>{
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', _ =>{
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

