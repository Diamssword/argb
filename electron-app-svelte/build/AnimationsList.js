"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emulation = exports.LIST = exports.animations = void 0;
exports.animations = [
    { code: 1, name: "Rainbow", id: "rainbow", func: "rainbow" },
    { code: 2, name: "Cylon", id: "cylon", func: "cylon" },
    { code: 3, name: "Odd-Even", id: "oddeven", func: "oddeven" },
    { code: 4, name: "Pulse", id: "pulse", func: "pulse" },
    { code: 5, name: "Cable", id: "cable", func: "cable" }
];
exports.LIST = {
    Rainbow: exports.animations[0],
    Cylon: exports.animations[1],
    OddEven: exports.animations[2],
    Pulse: exports.animations[3],
    Cable: exports.animations[4],
};
var Emulation = /** @class */ (function () {
    function Emulation() {
        this.emulVars = {
            hue: 0,
            timer: 0,
            pos: 0,
            reverse: false,
            reverse1: false,
            colors: []
        };
    }
    Emulation.prototype.rainbow = function (leds) {
        this.emulVars.hue++;
        var hsv = { hue: this.emulVars.hue, value: 255, saturation: 240 };
        for (var i in leds) {
            leds[i] = { hue: hsv.hue, saturation: hsv.saturation, value: hsv.value };
            hsv.hue += 7; //value taken from the arduino lib
        }
    };
    Emulation.prototype.IndexChangeReverse = function (size) {
        if (this.emulVars.reverse)
            this.emulVars.pos--;
        else
            this.emulVars.pos++;
        if (this.emulVars.pos >= size) {
            this.emulVars.reverse = true;
            this.emulVars.pos = size - 1;
        }
        else if (this.emulVars.pos < 0) {
            this.emulVars.reverse = false;
            this.emulVars.pos = 0;
        }
    };
    Emulation.prototype.cylon = function (leds) {
        this.IndexChangeReverse(leds.length);
        leds[this.emulVars.pos] = { hue: this.emulVars.hue++, saturation: 255, value: 255 };
        for (var i = 0; i < leds.length; i++) {
            // leds[i].nscale8(250);
        }
    };
    Emulation.prototype.clear = function (leds) {
        for (var k in leds) {
            leds[k] = { hue: 0, saturation: 0, value: 0 };
        }
    };
    Emulation.prototype.oddeven = function (leds) {
        if (!this.emulVars.colors[0])
            this.emulVars.colors[0] = { hue: 255, value: 255, saturation: 255 };
        if (!this.emulVars.colors[1])
            this.emulVars.colors[1] = { hue: 255, value: 255, saturation: 255 };
        this.emulVars.colors[0].value = 255;
        this.emulVars.colors[1].value = 255;
        this.clear(leds);
        this.emulVars.hue += this.emulVars.reverse1 ? -1 : +1;
        if (this.emulVars.hue >= 255) {
            this.emulVars.reverse1 = true;
            this.emulVars.reverse = !this.emulVars.reverse;
        }
        if (this.emulVars.hue <= 0) {
            this.emulVars.reverse1 = false;
        }
        for (var k = (this.emulVars.reverse ? 0 : 2); k < leds.length; k += 4) {
            var col = this.emulVars.colors[this.emulVars.reverse ? 0 : 1];
            leds[k] = col;
            leds[k] = this.fadeBy(leds[k], this.emulVars.hue);
        }
    };
    Emulation.prototype.cable = function (leds) {
        if (!this.emulVars.colors[0])
            this.emulVars.colors[0] = { hue: 255, value: 255, saturation: 255 };
        if (!this.emulVars.colors[1])
            this.emulVars.colors[1] = { hue: 255, value: 255, saturation: 0 };
        this.clear(leds);
        this.emulVars.pos;
        for (var k = 0; k < leds.length; k++) {
            leds[k] = this.emulVars.colors[0];
        }
        leds[this.emulVars.pos] = this.emulVars.colors[1];
        this.IndexChangeReverse(leds.length);
    };
    Emulation.prototype.fadeBy = function (color, val) {
        var res = { hue: color.hue, value: color.value, saturation: color.saturation };
        res.value = 255 - val;
        return res;
    };
    return Emulation;
}());
exports.Emulation = Emulation;
