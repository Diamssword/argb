"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animations_1 = require("../Animations");
var Serial_1 = require("../Serial");
module.exports = { getEvent: getEvent, onEvent: onEvent };
var Profiles_1 = require("../Profiles");
function getEvent() {
    return "DiscordPings";
}
function onEvent(data, event) {
    var fps = 512; // 255 fps fait un pulse complet en 1 sec, donc 512 en, 0,5;
    if (data.count && data.count > 1) {
        fps - (data.count * 10);
    }
    if (fps < 128)
        fps = 128;
    (0, Serial_1.send)(new Animations_1.LedAnimation("ping").addColors({ hue: 255, saturation: 255, value: 255 }, { hue: 255, saturation: 255, value: 255 }).setAnimation(4).setFPS(fps).getCommand());
    setTimeout(function () {
        var d = (0, Profiles_1.getCurrent)();
        if (d)
            (0, Serial_1.send)(d.getCommand());
    }, (256 / fps) * 1000);
}
