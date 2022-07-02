export class Hardware {
    name:string
    id:number
    type:Hardware|undefined
    ledcount:number
    simulation:Simulation
    linkedBefore: boolean=false;
    constructor(id:number,name:string,ledcount:number,type?:Hardware,simulation?:Simulation)
    {
        this.id=id;
        this.name=name;
        if(ledcount<=0 && type)
        this.ledcount=type.ledcount;
        else
        this.ledcount=ledcount;
        this.type=type;
        this.simulation= type? type.simulation:(simulation?simulation:Simulation.round);
    }

}
export enum Simulation{
    'round'='round',
    'strip'='strip',
}
export type HardwarePart={
    hardware:Hardware,
    from :number,
    to : number
}
export class VirtualHardware{
    name:string
    composition:Hardware[]=[]
    constructor (name:string)
    {
    this.name=name;
    }
    fromObject(obj:any)
    {
        Object.assign(this,obj)
        return this;
    }
    addHardware(hardware:Hardware)
    {
      
        this.composition.push(hardware)
    }
    getLastPos()
    {
        let res=0;
        for(let k in this.composition)
        {
            res+=this.composition[k].ledcount;
        }
        return res;
    }
}
export function getCommand(hardlist:VirtualHardware[])
{
    let res= "/hrgb ";
    for(let d in hardlist)
    {
        res+= hardlist[d].getLastPos()+";"
    }
    return res;
}


export var TYPES ={
    fan:new Hardware(0,"fan",17,undefined,Simulation.round),
    strip:new Hardware(0,"strip",20,undefined,Simulation.strip)
}