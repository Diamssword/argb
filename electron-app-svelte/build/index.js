"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
//const { app, BrowserWindow,ipcMain } = require("electron");
var path_1 = __importDefault(require("path"));
var Serial_1 = require("./Serial");
var EventWatcher_1 = require("./EventWatcher");
electron_1.app.on("ready", function () {
    var mainWindow = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path_1.default.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadFile(path_1.default.join(__dirname, "../public/index.html"));
    mainWindow.webContents.openDevTools();
    (0, Serial_1.init)(mainWindow);
    (0, EventWatcher_1.init)();
});
