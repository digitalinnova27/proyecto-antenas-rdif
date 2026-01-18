const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow
let splashWindow

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 420,
    height: 300,
    frame: false,
    transparent: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    center: true,
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'assets/icon.png')
  })

  splashWindow.loadFile(path.join(__dirname, 'splash.html'))
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // ❌ Quitar menú superior (File, Edit, View…)
  mainWindow.removeMenu()

  // 🔥 CARGA TU APP REACT (VITE)
  mainWindow.loadURL('http://localhost:5173')

  mainWindow.once('ready-to-show', () => {
    splashWindow.destroy()
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  createSplash()
  setTimeout(createMainWindow, 2000)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
