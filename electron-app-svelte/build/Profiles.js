"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrent = exports.getCurrent = exports.getHardwareList = exports.init = void 0;
var Animations_1 = require("./Animations");
var Hardwares_1 = require("./Hardwares");
var storage_1 = require("./storage");
var electron_1 = require("electron");
var store = new storage_1.StorageInstance("temp", "temp");
function init(window) {
    store = new storage_1.StorageInstance("profile");
    electron_1.ipcMain.on("hardware.save", function (ev, args) {
        store.set("hardware", args);
    });
    electron_1.ipcMain.on("hardware.request", function (ev, args) {
        var d = store.get("hardware");
        if (!d)
            d = [];
        ev.reply("hardware.request", d);
    });
    electron_1.ipcMain.on("vhardware.request", function (ev, args) {
        ev.reply("vhardware.request", getHardwareList());
    });
    electron_1.ipcMain.on("animation.save", function (ev, args) {
        var anim = store.get("animations");
        if (anim == undefined)
            anim = {};
        anim[args.hardware] = args.anim;
        store.set("animations", anim);
        store.save();
    });
    electron_1.ipcMain.on("animations.request", function (ev, args) {
        var d = store.get("animations");
        if (!d) {
            d = {};
        }
        ev.reply("animations.request", d);
    });
}
exports.init = init;
function getHardwareList() {
    var d = store.get("hardware");
    var res = [];
    if (d != null) {
        var h = d;
        var lastIndex = -1;
        for (var k = 0; k < h.length; k++) {
            if (h[k].linkedBefore == true) {
                if (!res[lastIndex]) {
                    res[lastIndex] = new Hardwares_1.VirtualHardware(h[k].name);
                }
                res[lastIndex].addHardware(h[k]);
            }
            else {
                lastIndex++;
                res[lastIndex] = new Hardwares_1.VirtualHardware(h[k].name);
                res[lastIndex].addHardware(h[k]);
            }
        }
    }
    return res;
}
exports.getHardwareList = getHardwareList;
function getCurrent() {
    var str = store.get("current");
    return new Animations_1.LedAnimation("d").formJson(str);
}
exports.getCurrent = getCurrent;
function setCurrent(animation) {
    store.set("current", animation);
    store.save();
}
exports.setCurrent = setCurrent;
