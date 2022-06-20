"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animations = exports.emulVars = void 0;
exports.emulVars = {
    hue: 0,
    timer: 0,
    pos: 0,
    reverse: false,
    reverse1: false,
    colors: []
};
exports.animations = [
    { code: 1, name: "Rainbow", id: "rainbow", func: rainbow },
    { code: 2, name: "Cylon", id: "cylon", func: cylon },
    { code: 3, name: "Odd-Even", id: "oddeven", func: oddeven }
];
function rainbow(leds) {
    exports.emulVars.hue++;
    var hsv = { hue: exports.emulVars.hue, value: 255, saturation: 240 };
    for (var i in leds) {
        leds[i] = { hue: hsv.hue, saturation: hsv.saturation, value: hsv.value };
        hsv.hue += 7; //value taken from the arduino lib
    }
}
function IndexChangeReverse(size) {
    if (exports.emulVars.reverse)
        exports.emulVars.pos--;
    else
        exports.emulVars.pos++;
    if (exports.emulVars.pos >= size) {
        exports.emulVars.reverse = true;
        exports.emulVars.pos = size - 1;
    }
    else if (exports.emulVars.pos < 0) {
        exports.emulVars.reverse = false;
        exports.emulVars.pos = 0;
    }
}
function cylon(leds) {
    IndexChangeReverse(leds.length);
    leds[exports.emulVars.pos] = { hue: exports.emulVars.hue++, saturation: 255, value: 255 };
    for (var i = 0; i < leds.length; i++) {
        // leds[i].nscale8(250);
    }
}
function clear(leds) {
    for (var k in leds) {
        leds[k] = { hue: 0, saturation: 0, value: 0 };
    }
}
function oddeven(leds) {
    if (!exports.emulVars.colors[0])
        exports.emulVars.colors[0] = { hue: 255, value: 255, saturation: 255 };
    if (!exports.emulVars.colors[1])
        exports.emulVars.colors[1] = { hue: 255, value: 255, saturation: 255 };
    exports.emulVars.colors[0].value = 255;
    exports.emulVars.colors[1].value = 255;
    clear(leds);
    exports.emulVars.hue += exports.emulVars.reverse1 ? -1 : +1;
    if (exports.emulVars.hue >= 255) {
        exports.emulVars.reverse1 = true;
        exports.emulVars.reverse = !exports.emulVars.reverse;
    }
    if (exports.emulVars.hue <= 0) {
        exports.emulVars.reverse1 = false;
    }
    for (var k = (exports.emulVars.reverse ? 0 : 2); k < leds.length; k += 4) {
        var col = exports.emulVars.colors[exports.emulVars.reverse ? 0 : 1];
        leds[k] = col;
        leds[k] = fadeBy(leds[k], exports.emulVars.hue);
    }
}
function fadeBy(color, val) {
    var res = { hue: color.hue, value: color.value, saturation: color.saturation };
    res.value = 255 - val;
    return res;
}
