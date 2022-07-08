import {HSV} from './ColorsUtil'
export type Anim={
    code:number,
    name:string,
    id : String,
    func : String
}

export var animations:Anim[]= [
    {code:1,name:"Rainbow",id:"rainbow",func:"rainbow"},
    {code:2,name:"Cylon",id:"cylon",func:"cylon"},
    {code:3,name:"Odd-Even",id:"oddeven",func:"oddeven"},
    {code:4,name:"Pulse",id:"pulse",func:"pulse"},
    {code:5,name:"Cable",id:"cable",func:"cable"}
]
export var LIST={
  Rainbow:animations[0],
  Cylon:animations[1],
  OddEven:animations[2],
  Pulse:animations[3],
  Cable:animations[4],

}
export class Emulation {
 emulVars = {
    hue:0,
    timer:0,
    pos:0,
    reverse:false,
    reverse1:false,
    colors:[] as HSV[]
}
  constructor() {
    
  }
   rainbow(leds:HSV[])
{
    this.emulVars.hue++;
    var hsv:HSV={hue:this.emulVars.hue,value:255,saturation:240};
    for(var i in leds) {
        leds[i] = {hue:hsv.hue,saturation:hsv.saturation,value:hsv.value};
        hsv.hue += 7; //value taken from the arduino lib
    }
}
 IndexChangeReverse(size:number)
{
  if (this.emulVars.reverse)
  this.emulVars.pos--;
  else
  this.emulVars.pos++;
  if (this.emulVars.pos >= size)
  {
    this.emulVars.reverse = true;
    this.emulVars.pos = size - 1;
  }
  else if (this.emulVars.pos < 0)
  {
    this.emulVars.reverse = false;
    this.emulVars.pos = 0;
  }
}
cylon(leds:HSV[])
{
  this.IndexChangeReverse(leds.length);
  leds[this.emulVars.pos] = {hue:this.emulVars.hue++, saturation:255, value:255}
  for (var i = 0; i < leds.length; i++)
  {
   // leds[i].nscale8(250);
  }
}
 clear(leds:HSV[])
{
    for(var k in leds)
    {
        leds[k]= {hue:0,saturation:0,value:0}
    }
}
oddeven(leds:HSV[])
{
    if(!this.emulVars.colors[0])
    this.emulVars.colors[0]={hue:255,value:255,saturation:255}
    if(!this.emulVars.colors[1])
    this.emulVars.colors[1]={hue:255,value:255,saturation:255}
    this.emulVars.colors[0].value=255;
    this.emulVars.colors[1].value=255;
    this.clear(leds);
  this.emulVars.hue += this.emulVars.reverse1 ? -1 : +1;
  if (this.emulVars.hue >= 255)
  {
    this.emulVars.reverse1 = true;
    this.emulVars.reverse=!this.emulVars.reverse;
  }
  if(this.emulVars.hue<=0)
  {
    this.emulVars.reverse1=false;
  }
  for (var k = (this.emulVars.reverse ? 0 : 2); k < leds.length; k += 4)
  {

    var col = this.emulVars.colors[this.emulVars.reverse ? 0:1];
    leds[k] = col;
    leds[k] = this.fadeBy(leds[k],this.emulVars.hue);
  }
}
cable(leds:HSV[])
{
    if(!this.emulVars.colors[0])
    this.emulVars.colors[0]={hue:255,value:255,saturation:255}
    if(!this.emulVars.colors[1])
    this.emulVars.colors[1]={hue:255,value:255,saturation:0}
    this.clear(leds);
    this.emulVars.pos;
  for (var k = 0; k < leds.length; k++)
  {
    leds[k] = this.emulVars.colors[0];
  
  }
  leds[this.emulVars.pos] = this.emulVars.colors[1];
  this.IndexChangeReverse(leds.length);
}
fadeBy(color:HSV,val : number)
{
    var res= {hue:color.hue,value:color.value,saturation:color.saturation}
    res.value = 255-val;
    return res
}
}
