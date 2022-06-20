import {HSV} from './ColorsUtil'
export type Anim={
    code:Number,
    name:string,
    id : String,
    func : (leds:HSV[])=>void
}

export var emulVars = {
    hue:0,
    timer:0,
    pos:0,
    reverse:false,
    reverse1:false,
    colors:[] as HSV[]
}
export var animations:Anim[]= [
    {code:1,name:"Rainbow",id:"rainbow",func:rainbow},
    {code:2,name:"Cylon",id:"cylon",func:cylon},
    {code:3,name:"Odd-Even",id:"oddeven",func:oddeven}
]


function rainbow(leds:HSV[])
{
    emulVars.hue++;
    var hsv:HSV={hue:emulVars.hue,value:255,saturation:240};
    for(var i in leds) {
        leds[i] = {hue:hsv.hue,saturation:hsv.saturation,value:hsv.value};
        hsv.hue += 7; //value taken from the arduino lib
    }
}
function IndexChangeReverse(size:number)
{
  if (emulVars.reverse)
  emulVars.pos--;
  else
  emulVars.pos++;
  if (emulVars.pos >= size)
  {
    emulVars.reverse = true;
    emulVars.pos = size - 1;
  }
  else if (emulVars.pos < 0)
  {
    emulVars.reverse = false;
    emulVars.pos = 0;
  }
}
function cylon(leds:HSV[])
{
  IndexChangeReverse(leds.length);
  leds[emulVars.pos] = {hue:emulVars.hue++, saturation:255, value:255}
  for (var i = 0; i < leds.length; i++)
  {
   // leds[i].nscale8(250);
  }
}
function clear(leds:HSV[])
{
    for(var k in leds)
    {
        leds[k]= {hue:0,saturation:0,value:0}
    }
}
function oddeven(leds:HSV[])
{
    if(!emulVars.colors[0])
    emulVars.colors[0]={hue:255,value:255,saturation:255}
    if(!emulVars.colors[1])
    emulVars.colors[1]={hue:255,value:255,saturation:255}
    emulVars.colors[0].value=255;
    emulVars.colors[1].value=255;
    clear(leds);
  emulVars.hue += emulVars.reverse1 ? -1 : +1;
  if (emulVars.hue >= 255)
  {
    emulVars.reverse1 = true;
    emulVars.reverse=!emulVars.reverse;
  }
  if(emulVars.hue<=0)
  {
    emulVars.reverse1=false;
  }
  for (var k = (emulVars.reverse ? 0 : 2); k < leds.length; k += 4)
  {

    var col = emulVars.colors[emulVars.reverse ? 0:1];
    leds[k] = col;
    leds[k] = fadeBy(leds[k],emulVars.hue);
  }
}
function fadeBy(color:HSV,val : number)
{
    var res= {hue:color.hue,value:color.value,saturation:color.saturation}
    res.value = 255-val;
    return res
}