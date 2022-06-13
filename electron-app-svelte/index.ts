import {app, BrowserWindow,ipcMain} from 'electron';
//const { app, BrowserWindow,ipcMain } = require("electron");
import path from "path";
import {init as SerialInit }from "./Serial";

app.on("ready", () => {
  const mainWindow = new BrowserWindow(
    {
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            preload:path.join(__dirname,'preload.js')
        }
    }
  );
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
  mainWindow.webContents.openDevTools();
  SerialInit(mainWindow);
  
});
