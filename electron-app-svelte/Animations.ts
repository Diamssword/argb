import {HSV,hexToRgb,rgb2hsv,rgbToHex,HSVtoRGB} from './ColorsUtil'
export class LedAnimation {
    name: string;
    animation=0;
    fps=120;
    timer=2000;
    colors: HSV[]= [];
    save:boolean=false;
    constructor(name:string) {
      this.name=name;  
    }
    fromObject(obj:any)
    {
        Object.assign(this,obj)
        return this;
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
    setSave(save :boolean)
    {
        this.save=save;
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
    getCommand(index:number)
    {
        var cols="";
        for(var k in this.colors)
        {
            var col= this.colors[k];
            cols+=col.hue+"/"+col.saturation+"/"+col.value+",";
        }
        cols=cols.substring(0,cols.length-2);
        return `/argb h:${index};a:${this.animation};f:${this.fps};t:${this.timer};c:${cols};${this.save?"s:1;":""}`
    }
    formJson(jsonObj:any )
    {
            
            Object.assign(this,jsonObj);
            return this;
    }
 
}

/* commandes:
    h: int > hardware id, l'orde ou assigner ce hardware |a mettre en premier
    p: int > led count |a mettre en second | ne pas inclure si aucun hardware n'a changé (evite de recalculer toute les positions de leds)
    a: int > id de l'animation
    f: int > fps
    t: int > timer
    c: HSV > couleurs sous form de liste formaé comme ça : h1/s1/v1,h2/s2/v2,...
    s: any > commande a mettre en dernier pour tenter de sauvegardé l'animation sur l'arduino 


*/
