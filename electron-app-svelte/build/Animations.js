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
var LedAnimation = /** @class */ (function () {
    function LedAnimation(name) {
        this.animation = "none";
        this.fps = 120;
        this.timer = 2000;
        this.colors = [];
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
            var rgb = hexToRgb(colors[k]);
            var hsv = rgb2hsv(rgb);
            this.colors.push(hsv);
        }
        return this;
    };
    LedAnimation.prototype.getHTMLColors = function () {
        var res = [];
        for (var k in this.colors) {
            var rgb = HSVtoRGB(this.colors[k]);
            res.push(rgbToHex(rgb.r, rgb.g, rgb.b));
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
        return "a:".concat(this.animation, ";f:").concat(this.fps, ";t:").concat(this.timer, ";c:").concat(cols, ";");
    };
    return LedAnimation;
}());
exports.LedAnimation = LedAnimation;
function rgb2hsv(rgb) {
    var rabs, gabs, babs, rr, gg, bb, s, diff = 0;
    var h = 0;
    var v = 0;
    rabs = rgb.r / 255;
    gabs = rgb.g / 255;
    babs = rgb.b / 255;
    v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
    var diffc = function (c) { return (v - c) / 6 / diff + 1 / 2; };
    var percentRoundFn = function (num) { return Math.round(num * 100) / 100; };
    if (diff == 0) {
        h = s = 0;
    }
    else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);
        if (rabs === v) {
            h = bb - gg;
        }
        else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        }
        else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }
        else if (h > 1) {
            h -= 1;
        }
    }
    return {
        hue: Math.round(h * 255),
        saturation: Math.round(percentRoundFn(s * 255)),
        value: Math.round(percentRoundFn(v * 255))
    };
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var res = { b: 0, g: 0, r: 0 };
    if (result)
        res = {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    return res;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function HSVtoRGB(hsv) {
    hsv = { value: hsv.value / 255, hue: hsv.hue / 255, saturation: hsv.saturation / 255 };
    var i, f, p, q, t;
    var r = 0;
    var g = 0;
    var b = 0;
    i = Math.floor(hsv.hue * 6);
    f = hsv.hue * 6 - i;
    p = hsv.value * (1 - hsv.saturation);
    q = hsv.value * (1 - f * hsv.saturation);
    t = hsv.value * (1 - (1 - f) * hsv.saturation);
    switch (i % 6) {
        case 0:
            r = hsv.value, g = t, b = p;
            break;
        case 1:
            r = q, g = hsv.value, b = p;
            break;
        case 2:
            r = p, g = hsv.value, b = t;
            break;
        case 3:
            r = p, g = q, b = hsv.value;
            break;
        case 4:
            r = t, g = p, b = hsv.value;
            break;
        case 5:
            r = hsv.value, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
