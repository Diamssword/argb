"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var serialport_1 = require("serialport");
var electron_1 = require("electron");
var currentPort;
function init(main) {
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
            ev.sender.send("error", err.message);
        });
    });
    electron_1.ipcMain.on("Serial.connect", function (ev) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (currentPort && currentPort.path == args[0]) {
            ev.sender.send("Serial.state", { connected: currentPort.path });
        }
        else {
            if (currentPort && currentPort.isOpen)
                currentPort.close();
            currentPort = new serialport_1.SerialPort({ path: args[0], baudRate: 9600 }, function (err) {
                if (err) {
                    ev.sender.send("error", "Impossible d'ouvrir le port " + args[0]);
                    currentPort = undefined;
                }
            });
            if (currentPort && currentPort.path) {
                openPort(currentPort, main);
                ev.sender.send("Serial.state", { connected: currentPort.path });
            }
            ev.sender.send("Serial.state", {});
        }
    });
}
exports.init = init;
function openPort(port, window) {
    port.on('data', function (data) {
        window.webContents.send("Serial.receive", data.toString());
    });
    electron_1.ipcMain.on("Serial.send", function (ev, args) {
        port.write(args + '\n', function (err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
        });
    });
}
