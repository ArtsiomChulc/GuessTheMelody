import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { is } from '@electron-toolkit/utils'
import path from 'path'
import Store from 'electron-store'
import icon from '../../resources/icon.png?asset'
import pkg from 'electron-updater'
const { autoUpdater } = pkg

export const store = new Store()

autoUpdater.autoDownload = false

function checkUpdates(mainWindow: BrowserWindow): void {
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', () => {
    // Отправляем сигнал в React, что есть обновление
    mainWindow.webContents.send('update_available')
  })
}

ipcMain.on('save-game-state', (_event, data) => {
  store.set('categories', data)
})

ipcMain.on('save-teams', (_, teams) => {
  store.set('teams', teams)
})

ipcMain.handle('load-teams', () => {
  return store.get('teams') || []
})

ipcMain.handle('load-game-state', () => {
  return store.get('categories') || null
})

ipcMain.on('clear-entire-store', () => {
  store.clear()
  console.log('Хранилище полностью очищено')
})

ipcMain.handle('open-file-picker', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Выберите 4 мелодии (по одной на каждую категорию)',
    buttonLabel: 'Добавить ряд',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Аудиофайлы', extensions: ['mp3', 'wav', 'ogg', 'm4a'] }]
  })

  if (canceled) return []

  return filePaths.map((filePath) => ({
    path: filePath,
    title: path.basename(filePath, path.extname(filePath))
  }))
})

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: icon,
    title: 'Угадай мелодию',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      webSecurity: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  checkUpdates(mainWindow)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
