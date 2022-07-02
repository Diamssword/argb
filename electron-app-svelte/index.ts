import {app, BrowserWindow,ipcMain} from 'electron';
//const { app, BrowserWindow,ipcMain } = require("electron");
import path from "path";
import {init as SerialInit,close }from "./Serial";
import {init as EventInit} from './EventWatcher'
import {initDefault} from './storage'
import {init as ProfileInit} from './Profiles'
app.on("ready", () => {
  (global as any).__software= path.join(app.getPath('appData'),"argbled");
  const mainWindow = new BrowserWindow(
    {
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            preload:path.join(__dirname,'preload.js')
        }
    }
  );
  initDefault((global as any).__software);
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
  mainWindow.webContents.openDevTools();
  app.on("window-all-closed",()=>
  {
    close();
    app.quit();
    return;
  })
  SerialInit(mainWindow);
  EventInit();
  ProfileInit(mainWindow);
  
});
