
export class LedAnimation {
    name: string;
    animation=0;
    fps=120;
    timer=2000;
    colors: HSV[]= [];
    constructor(name:string) {
      this.name=name;  
    }

    setFPS(fps:number)
    {
        this.fps=fps;
        return this;
    }
    setAnimation(anim:number)
    {
        this.animation=anim;
        return this;
    }
    setTimer(timer:number)
    {
        this.timer=timer;
        return this;
    }
    addColors(...colors: HSV[])
    {
        this.colors=[...colors];
        return this;
    }
    addHtmlColors(...colors: string[])
    {
        for(var k in colors)
        {
            var rgb=hexToRgb(colors[k])
            var hsv =rgb2hsv(rgb);
            this.colors.push(hsv);
        }
        return this;
    }
    getHTMLColors()
    {
        var res:string[]=[];
        for(var k in this.colors)
        {
            var rgb=HSVtoRGB(this.colors[k]);
            res.push(rgbToHex(rgb.r,rgb.g,rgb.b));
            
        }
        return res;
    }
    getCommand()
    {
        var cols="";
        for(var k in this.colors)
        {
            var col= this.colors[k];
            cols+=col.hue+"/"+col.saturation+"/"+col.value+",";
        }
        cols=cols.substring(0,cols.length-2);
        return `/argb a:${this.animation};f:${this.fps};t:${this.timer};c:${cols};`
    }
    formJson(jsonStr:string )
    {
            var ob=JSON.parse(jsonStr)   ;
            Object.assign(this,ob);
            return this;
    }
    toJson()
    {
        return JSON.stringify(this);
    }
}
export type HSV={
    hue : number,
    saturation:number,
    value:number,
}


type RGB ={
    r:number;       // a fraction between 0 and 1
    g:number;       // a fraction between 0 and 1
    b:number;       // a fraction between 0 and 1
};

function rgb2hsv (rgb:RGB) {
    let rabs, gabs, babs, rr, gg, bb, s,  diff:number=0;
    var h=0;
    var v=0;
    rabs = rgb.r / 255;
    gabs = rgb.g / 255;
    babs = rgb.b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    var diffc = (c:number) => {return (v - c) / 6 / diff + 1 / 2};
   var percentRoundFn = (num:number) => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        hue: Math.round(h * 255),
        saturation: Math.round(percentRoundFn(s * 255)),
        value: Math.round(percentRoundFn(v * 255))
    };
}
function hexToRgb(hex:string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var res:RGB= {b:0,g:0,r:0};
    if(result)
    res={
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    return res;
  }
  function componentToHex(c:number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r:number, g:number, b:number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  function HSVtoRGB(hsv:HSV) {
    hsv = {value:hsv.value/255,hue:hsv.hue/255,saturation:hsv.saturation/255};
    var i, f, p, q, t;
 var r=0;
 var g=0;
 var b=0;
    i = Math.floor(hsv.hue * 6);
    f = hsv.hue * 6 - i;
    p = hsv.value * (1 - hsv.saturation);
    q = hsv.value * (1 - f * hsv.saturation);
    t = hsv.value * (1 - (1 - f) * hsv.saturation);
    switch (i % 6) {
        case 0: r = hsv.value, g = t, b = p; break;
        case 1: r = q, g = hsv.value, b = p; break;
        case 2: r = p, g = hsv.value, b = t; break;
        case 3: r = p, g = q, b = hsv.value; break;
        case 4: r = t, g = p, b = hsv.value; break;
        case 5: r = hsv.value, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}