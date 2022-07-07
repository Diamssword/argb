"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = exports.getCommand = exports.VirtualHardware = exports.Simulation = exports.Hardware = void 0;
var Hardware = /** @class */ (function () {
    function Hardware(id, name, ledcount, type, simulation) {
        this.linkedBefore = false;
        this.id = id;
        this.name = name;
        if (ledcount <= 0 && type)
            this.ledcount = type.ledcount;
        else
            this.ledcount = ledcount;
        this.type = type;
        this.simulation = type ? type.simulation : (simulation ? simulation : Simulation.round);
    }
    return Hardware;
}());
exports.Hardware = Hardware;
var Simulation;
(function (Simulation) {
    Simulation["round"] = "round";
    Simulation["strip"] = "strip";
})(Simulation = exports.Simulation || (exports.Simulation = {}));
var VirtualHardware = /** @class */ (function () {
    function VirtualHardware(name, port) {
        this.enabled = true;
        this.composition = [];
        this.name = name;
        this.port = port;
    }
    VirtualHardware.prototype.fromObject = function (obj) {
        Object.assign(this, obj);
        return this;
    };
    VirtualHardware.prototype.addHardware = function (hardware) {
        this.composition.push(hardware);
    };
    VirtualHardware.prototype.getLastPos = function () {
        var res = 0;
        for (var k in this.composition) {
            res += this.composition[k].ledcount;
        }
        return res;
    };
    return VirtualHardware;
}());
exports.VirtualHardware = VirtualHardware;
function getCommand(hardlist) {
    var res = "/hrgb ";
    for (var d in hardlist) {
        res += hardlist[d].getLastPos() + ";";
    }
    return res;
}
exports.getCommand = getCommand;
exports.TYPES = {
    fan: new Hardware(0, "fan", 17, undefined, Simulation.round),
    strip: new Hardware(0, "strip", 20, undefined, Simulation.strip)
};
