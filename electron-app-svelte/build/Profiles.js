"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrent = exports.getCurrent = exports.getVHardwareList = exports.init = void 0;
var Animations_1 = require("./Animations");
var Hardwares_1 = require("./Hardwares");
var storage_1 = require("./storage");
var electron_1 = require("electron");
var store;
var hardwareStore;
var animationStore;
function init(window) {
    store = new storage_1.StorageInstance("profile");
    hardwareStore = new storage_1.StorageInstance("hardwares");
    animationStore = new storage_1.StorageInstance("animations");
    electron_1.ipcMain.on("hardware.save", function (ev, args) {
        hardwareStore.set(args.name, getVHardwareList(args.port, args.hard));
    });
    electron_1.ipcMain.on("hardware.request", function (ev, args) {
        var d = hardwareStore.get(args);
        if (!d)
            d = [];
        ev.reply("hardware.request", d);
    });
    electron_1.ipcMain.on("hardware.profiles", function (ev, args) {
        var d = hardwareStore.getAll();
        if (!d)
            d = {};
        ev.reply("hardware.profiles", Object.keys(d));
    });
    electron_1.ipcMain.on("hardware.editProfile", function (ev, args) {
        var pr = args.name;
        var op = args.operation;
        if (op == "new") {
            var i = 1;
            while (hardwareStore.get(pr + "" + i)) {
                i++;
            }
            hardwareStore.set(pr + "" + i, []);
            ev.reply("hardware.editProfile", { operation: "new", name: pr + "" + i });
        }
        else if (op == "rename") {
            var a = hardwareStore.get(pr);
            var b = hardwareStore.get(args.rename);
            if (a && !b) {
                hardwareStore.delete(pr);
                hardwareStore.set(args.rename, a);
                ev.reply("hardware.editProfile", { operation: "rename", from: pr, to: args.rename });
            }
            else {
                ev.reply("hardware.editProfile", { operation: "rename", error: "CANT" });
            }
        }
        else if (op == "delete") {
            hardwareStore.delete(pr);
        }
    });
    electron_1.ipcMain.on("animation.save", function (ev, args) {
        animationStore.set(args.name, args.animation);
    });
    electron_1.ipcMain.on("animation.request", function (ev, args) {
        var d = animationStore.get(args);
        if (!d)
            d = new Animations_1.LedAnimation(args);
        ev.reply("animation.request", d);
    });
    electron_1.ipcMain.on("animation.profiles", function (ev, args) {
        var d = animationStore.getAll();
        if (!d)
            d = {};
        ev.reply("animation.profiles", Object.keys(d));
    });
    electron_1.ipcMain.on("animation.editProfile", function (ev, args) {
        var pr = args.name;
        var op = args.operation;
        if (op == "new") {
            var i = 1;
            while (animationStore.get(pr + "" + i)) {
                i++;
            }
            animationStore.set(pr + "" + i, {});
            ev.reply("animation.editProfile", { operation: "new", name: pr + "" + i });
        }
        else if (op == "rename") {
            var a = animationStore.get(pr);
            var b = animationStore.get(args.rename);
            if (a && !b) {
                animationStore.delete(pr);
                animationStore.set(args.rename, a);
                ev.reply("animation.editProfile", { operation: "rename", from: pr, to: args.rename });
            }
            else {
                ev.reply("animation.editProfile", { operation: "rename", error: "CANT" });
            }
        }
        else if (op == "delete") {
            animationStore.delete(pr);
        }
    });
    electron_1.ipcMain.on("vhardware.request", function (ev, args) {
        ev.reply("vhardware.request", getVHardwareList(args.port, args.hard));
    });
}
exports.init = init;
function getVHardwareList(port, hards) {
    var d = hards;
    var res = [];
    if (d != null) {
        var h = d;
        var lastIndex = -1;
        for (var k = 0; k < h.length; k++) {
            if (h[k].linkedBefore == true) {
                if (!res[lastIndex]) {
                    res[lastIndex] = new Hardwares_1.VirtualHardware(h[k].name, port);
                }
                res[lastIndex].addHardware(h[k]);
            }
            else {
                lastIndex++;
                res[lastIndex] = new Hardwares_1.VirtualHardware(h[k].name, port);
                res[lastIndex].addHardware(h[k]);
            }
        }
    }
    return res;
}
exports.getVHardwareList = getVHardwareList;
function getCurrent() {
    var str = store.get("current");
    return new Animations_1.LedAnimation("d").formJson(str);
}
exports.getCurrent = getCurrent;
function setCurrent(animation) {
    store.set("current", animation);
}
exports.setCurrent = setCurrent;
