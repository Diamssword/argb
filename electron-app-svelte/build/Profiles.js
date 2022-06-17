"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrent = exports.getCurrent = exports.init = void 0;
var Animations_1 = require("./Animations");
var storage_1 = require("./storage");
var store = new storage_1.StorageInstance("temp", "temp");
function init() {
    store = new storage_1.StorageInstance("animations");
}
exports.init = init;
function getCurrent() {
    var str = store.get("current");
    if (str && str.length > 1)
        return new Animations_1.LedAnimation("d").formJson(str);
}
exports.getCurrent = getCurrent;
function setCurrent(animation) {
    store.set("current", animation.toJson());
    store.save();
}
exports.setCurrent = setCurrent;
