export class Hardware {
    name:string
    type:Hardware|undefined
    ledcount:number
    animation:Animation
    constructor(name:string,ledcount:number,type?:Hardware,animation?:Animation)
    {
        this.name=name;
        this.ledcount=ledcount;
        this.type=type;
        this.animation= type? type.animation:(animation?animation:Animation.round);

    }
}
export enum Animation{
    'round',
    'strip'
}
export type HarwarePart={
    hardware:Hardware,
    from :number,
    to : number
}
export class VirtualHardware{
    name:string
    composition:HarwarePart[]=[]
    constructor (name:string)
    {
    this.name=name;
    }
    addHardware(hardware:Hardware,from?:number,to?:number)
    {
        if(!from)
        {
            from = 0;
        }
        if(!to)
        {
            to = hardware.ledcount-1;
        }
        this.composition.push({hardware:hardware,from:from,to:to})
    }
 
}


export var TYPES ={
    fan:new Hardware("fan",17),
    strip:new Hardware("strip",20)
}