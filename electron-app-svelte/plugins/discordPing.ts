import {LedAnimation} from "../Animations"
import {send} from "../Serial"
module.exports={getEvent,onEvent}
import {getCurrent} from '../Profiles'

function getEvent()
{
    return "DiscordPings";
}
function onEvent(data:any,event:String )
{
    var fps = 512; // 255 fps fait un pulse complet en 1 sec, donc 512 en, 0,5;
    if(data.count && data.count>1)
    {
        fps - (data.count*10)
    }
    if(fps<128)
        fps=128;
    send(new LedAnimation("ping").addColors({hue:255,saturation:255,value:255},{hue:255,saturation:255,value:255}).setAnimation(4).setFPS(fps).getCommand());
    setTimeout(()=>{
        var d = getCurrent();
        if(d)
            send(d.getCommand());
    },(256/fps)*1000)

}