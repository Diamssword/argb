"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageInstance = exports.initDefault = void 0;
var path = require("path");
var fs = require('fs');
global.__store = {
    create: create,
    get: get,
    set: set,
};
function create(file, storageDir) {
    return new StorageInstance(file, storageDir);
}
var settings;
function initDefault(launcherdir) {
    settings = create("settings", launcherdir);
}
exports.initDefault = initDefault;
function get(key) {
    return settings.get(key);
}
function set(key, value) {
    settings.set(key, value);
}
var StorageInstance = /** @class */ (function () {
    function StorageInstance(file, launcherDir) {
        this.storage = {};
        this.file = this.load(launcherDir ? launcherDir : global.__software, file);
    }
    StorageInstance.prototype.load = function (launcherdir, file) {
        var f1 = path.join(launcherdir, file + ".json");
        if (!fs.existsSync(launcherdir))
            fs.mkdirSync(launcherdir);
        if (fs.existsSync(f1)) {
            var res = fs.readFileSync(f1);
            this.storage = JSON.parse(res);
        }
        return f1;
    };
    StorageInstance.prototype.save = function () {
        fs.writeFileSync(this.file, JSON.stringify(this.storage, undefined, 3));
    };
    StorageInstance.prototype.get = function (key) {
        return this.storage[key];
    };
    StorageInstance.prototype.getAll = function () {
        return this.storage;
    };
    StorageInstance.prototype.set = function (key, value) {
        this.storage[key] = value;
        this.save();
    };
    StorageInstance.prototype.delete = function (key) {
        delete this.storage[key];
        this.save();
    };
    return StorageInstance;
}());
exports.StorageInstance = StorageInstance;
