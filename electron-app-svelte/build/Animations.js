"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedAnimation = void 0;
var ColorsUtil_1 = require("./ColorsUtil");
var LedAnimation = /** @class */ (function () {
    function LedAnimation(name) {
        this.animation = 0;
        this.fps = 120;
        this.timer = 2000;
        this.colors = [];
        this.save = false;
        this.name = name;
    }
    LedAnimation.prototype.setFPS = function (fps) {
        this.fps = fps;
        return this;
    };
    LedAnimation.prototype.setAnimation = function (anim) {
        this.animation = anim;
        return this;
    };
    LedAnimation.prototype.setTimer = function (timer) {
        this.timer = timer;
        return this;
    };
    LedAnimation.prototype.setSave = function (save) {
        this.save = save;
        return this;
    };
    LedAnimation.prototype.addColors = function () {
        var colors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            colors[_i] = arguments[_i];
        }
        this.colors = __spreadArray([], colors, true);
        return this;
    };
    LedAnimation.prototype.addHtmlColors = function () {
        var colors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            colors[_i] = arguments[_i];
        }
        for (var k in colors) {
            var rgb = (0, ColorsUtil_1.hexToRgb)(colors[k]);
            var hsv = (0, ColorsUtil_1.rgb2hsv)(rgb);
            this.colors.push(hsv);
        }
        return this;
    };
    LedAnimation.prototype.getHTMLColors = function () {
        var res = [];
        for (var k in this.colors) {
            var rgb = (0, ColorsUtil_1.HSVtoRGB)(this.colors[k]);
            res.push((0, ColorsUtil_1.rgbToHex)(rgb.r, rgb.g, rgb.b));
        }
        return res;
    };
    LedAnimation.prototype.getCommand = function () {
        var cols = "";
        for (var k in this.colors) {
            var col = this.colors[k];
            cols += col.hue + "/" + col.saturation + "/" + col.value + ",";
        }
        cols = cols.substring(0, cols.length - 2);
        return "/argb a:".concat(this.animation, ";f:").concat(this.fps, ";t:").concat(this.timer, ";c:").concat(cols, ";").concat(this.save ? "s:1;" : "");
    };
    LedAnimation.prototype.formJson = function (jsonStr) {
        var ob = JSON.parse(jsonStr);
        Object.assign(this, ob);
        return this;
    };
    LedAnimation.prototype.toJson = function () {
        return JSON.stringify(this);
    };
    return LedAnimation;
}());
exports.LedAnimation = LedAnimation;
/* commandes:
    a: int > id de l'animation
    f: int > fps
    t: int > timer
    c: HSV > couleurs sous form de liste formaé comme ça : h1/s1/v1,h2/s2/v2,...
    s: any > commande a mettre en dernier pour tenter de sauvegardé l'animation sur l'arduino


*/
