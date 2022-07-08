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
    LedAnimation.prototype.fromObject = function (obj) {
        Object.assign(this, obj);
        return this;
    };
    LedAnimation.prototype.setFPS = function (fps) {
        this.fps = fps;
        return this;
    };
    LedAnimation.prototype.setAnimation = function (anim) {
        this.animation = anim;
        return this;
    };
    LedAnimation.prototype.setAnimationObj = function (anim) {
        this.animation = anim.code;
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
        this.checkColors();
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
        this.checkColors();
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
    LedAnimation.prototype.checkColors = function () {
        for (var c in this.colors) {
            this.colors[c] = (0, ColorsUtil_1.clampHSV)(this.colors[c]);
        }
    };
    LedAnimation.prototype.getCommand = function (index) {
        this.checkColors();
        var cols = "";
        for (var k in this.colors) {
            var col = this.colors[k];
            cols += Math.floor(col.hue) + "/" + Math.floor(col.saturation) + "/" + Math.floor(col.value) + ",";
        }
        cols = cols.substring(0, cols.length - 1);
        return "/argb h:".concat(index, ";a:").concat(this.animation, ";f:").concat(this.fps, ";t:").concat(this.timer, ";c:").concat(cols, ";").concat(this.save ? "s:1;" : "");
    };
    LedAnimation.prototype.formJson = function (jsonObj) {
        Object.assign(this, jsonObj);
        return this;
    };
    return LedAnimation;
}());
exports.LedAnimation = LedAnimation;
/* commandes:
    h: int > hardware id, l'orde ou assigner ce hardware |a mettre en premier
    p: int > led count |a mettre en second | ne pas inclure si aucun hardware n'a changé (evite de recalculer toute les positions de leds)
    a: int > id de l'animation
    f: int > fps
    t: int > timer
    c: HSV > couleurs sous form de liste formaé comme ça : h1/s1/v1,h2/s2/v2,...
    s: any > commande a mettre en dernier pour tenter de sauvegardé l'animation sur l'arduino


*/
