import { contextBridge, ipcRenderer } from 'electron'

// Это "мостик", который создает объект window.electron в браузере
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    send: (channel: string, data: any) => ipcRenderer.send(channel, data)
  }
})
