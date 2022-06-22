"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = exports.VirtualHardware = exports.Animation = exports.Hardware = void 0;
var Hardware = /** @class */ (function () {
    function Hardware(name, ledcount, type, animation) {
        this.name = name;
        this.ledcount = ledcount;
        this.type = type;
        this.animation = type ? type.animation : (animation ? animation : Animation.round);
    }
    return Hardware;
}());
exports.Hardware = Hardware;
var Animation;
(function (Animation) {
    Animation[Animation["round"] = 0] = "round";
    Animation[Animation["strip"] = 1] = "strip";
})(Animation = exports.Animation || (exports.Animation = {}));
var VirtualHardware = /** @class */ (function () {
    function VirtualHardware(name) {
        this.composition = [];
        this.name = name;
    }
    VirtualHardware.prototype.addHardware = function (hardware, from, to) {
        if (!from) {
            from = 0;
        }
        if (!to) {
            to = hardware.ledcount - 1;
        }
        this.composition.push({ hardware: hardware, from: from, to: to });
    };
    return VirtualHardware;
}());
exports.VirtualHardware = VirtualHardware;
exports.TYPES = {
    fan: new Hardware("fan", 17),
    strip: new Hardware("strip", 20)
};
