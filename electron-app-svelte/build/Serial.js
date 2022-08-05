"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = exports.init = exports.close = void 0;
var serialport_1 = require("serialport");
var electron_1 = require("electron");
var Animations_1 = require("./Animations");
var Profiles_1 = require("./Profiles");
var storage_1 = require("./storage");
var currentPort;
function close() {
    if (currentPort && currentPort.isOpen) {
        currentPort.close();
        currentPort.destroy();
    }
}
exports.close = close;
function init(main) {
    var store = new storage_1.StorageInstance("serial");
    var p = store.get("lastPort");
    if (p && typeof p == 'string' && p.length > 1) {
        currentPort = new serialport_1.SerialPort({ path: p, baudRate: 9600 }, function (err) {
            if (err) {
                currentPort = undefined;
            }
        });
        openPort(currentPort, main);
        main.webContents.send("Serial.state", { connected: currentPort.path });
    }
    electron_1.ipcMain.on("Animaion.setCurrent", function (ev) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, Profiles_1.setCurrent)(new Animations_1.LedAnimation("").formJson(args[0]));
    });
    electron_1.ipcMain.on("Serial.ports", function (ev) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        serialport_1.SerialPort.list().then(function (ports) {
            if (ports) {
                if (currentPort && currentPort.path)
                    ev.reply("Serial.ports", { ports: ports, selected: currentPort.path });
                else
                    ev.reply("Serial.ports", { ports: ports });
            }
        }, function (err) {
            ev.reply("error", err.message);
        });
    });
    electron_1.ipcMain.on("Serial.connect", function (ev) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (currentPort && currentPort.path == args[0]) {
            ev.reply("Serial.state", { connected: currentPort.path });
        }
        else {
            if (currentPort && currentPort.isOpen)
                currentPort.close();
            currentPort = new serialport_1.SerialPort({ path: args[0], baudRate: 9600 }, function (err) {
                if (err) {
                    ev.reply("Serial.error", { error: "open", port: args[0] });
                    currentPort = undefined;
                }
            });
            if (currentPort && currentPort.path) {
                store.set("lastPort", args[0]);
                store.save();
                openPort(currentPort, main);
                ev.reply("Serial.state", { connected: currentPort.path });
            }
            else {
                ev.reply("Serial.error", { error: "open", port: args[0] });
            }
        }
    });
}
exports.init = init;
function openPort(port, window) {
    port.on('data', function (data) {
        window.webContents.send("Serial.receive", data.toString());
    });
    electron_1.ipcMain.removeAllListeners("Serial.send");
    electron_1.ipcMain.on("Serial.send", function (ev, args) {
        port.write(args + '\n', function (err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
        });
    });
}
function send(str) {
    if (currentPort === null || currentPort === void 0 ? void 0 : currentPort.isOpen) {
        currentPort.write(str + '\n', function (err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
        });
    }
}
exports.send = send;
