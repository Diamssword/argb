class Hardware {
    name:string
    type:Hardware|undefined
    ledcount:number
    constructor(name:string,ledcount:number,type?:Hardware)
    {
        this.name=name;
        this.ledcount=ledcount;
        this.type=type;

    }
}
type HarwarePart={
    hardware:Hardware,
    from :number,
    to : number
}
class VirtualHardware{
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
    strip:new Hardware("fan",20)
}