import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),

    // Добавьте этот метод:
    on: (channel: string, callback: (...args: any[]) => void) => {
      const subscription = (_event: any, ...args: any[]) => callback(...args)
      ipcRenderer.on(channel, subscription)

      // Рекомендуется возвращать функцию для отписки (cleanup)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
  }
})
