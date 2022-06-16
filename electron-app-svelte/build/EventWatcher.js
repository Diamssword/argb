"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var os_1 = __importDefault(require("os"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var file = path_1.default.join(os_1.default.tmpdir(), "ARGBLedSync.txt");
function init() {
    loadAllPlugins();
    function readEvents(file) {
        var data = fs_1.default.readFileSync(file, 'utf-8');
        if (data && data.length > 0) {
            fs_1.default.writeFileSync(file, "", { encoding: 'utf-8' });
            var d = data.split("\n");
            for (var s in d) {
                var line = d[s];
                var i = line.indexOf(":");
                if (i > 0) {
                    var ev = line.substring(0, i);
                    var parsed = {};
                    try {
                        parsed = JSON.parse(line.substring(i + 1));
                    }
                    catch (_a) {
                    }
                    for (var l in plugins) {
                        if (plugins[l].getEvent() == ev) {
                            plugins[l].onEvent(parsed, ev);
                            break;
                        }
                    }
                }
            }
        }
    }
    if (!fs_1.default.existsSync(file)) {
        fs_1.default.writeFileSync(file, "", { encoding: 'utf-8' });
    }
    readEvents(file);
    fs_1.default.watch(file, function (event, filename) {
        if (filename && event === 'change') {
            readEvents(file);
        }
    });
}
exports.init = init;
var plugins = [];
function loadAllPlugins() {
    var files = fs_1.default.readdirSync("./plugins");
    for (var f in files) {
        var f1 = files[f];
        if (f1.endsWith('.ts')) {
            f1 = f1.replace('.ts', '.js');
        }
        var imp = require('./plugins/' + f1);
        if (imp.getEvent && imp.onEvent)
            plugins.push(imp);
        else {
            console.error("Plugin is missing getEvent or onEvent :" + f1);
        }
    }
}
