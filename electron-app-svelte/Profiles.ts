import { LedAnimation } from './Animations';
import { Hardware ,VirtualHardware} from './Hardwares';
import {StorageInstance} from './storage'
import {BrowserWindow,ipcMain,IpcMain} from 'electron'
var store:StorageInstance;
var hardwareStore:StorageInstance;
var animationStore:StorageInstance;
export function init(window:BrowserWindow)
{
 store= new StorageInstance("profile");
 hardwareStore = new StorageInstance("hardwares");
 animationStore = new StorageInstance("animations");
 
ipcMain.on("hardware.save",(ev,args)=>{
    hardwareStore.set(args.name,getVHardwareList(args.port,args.hard))
})
ipcMain.on("hardware.request",(ev,args)=>{
    var d= hardwareStore.get(args);
    if(!d)
    d=[];
        ev.reply("hardware.request",d);
 })
 ipcMain.on("hardware.profiles",(ev,args)=>{
    var d= hardwareStore.getAll()
    if(!d)
    d={};
        ev.reply("hardware.profiles", Object.keys(d));
 })
 ipcMain.on("hardware.editProfile",(ev,args)=>{
    let pr = args.name;
    let op = args.operation
    if(op =="new")
    {
        
        let i=1;
        while(hardwareStore.get(pr+""+i))
        {
        i++
        }   
        hardwareStore.set(pr+""+i,[]);   
        ev.reply("hardware.editProfile",{operation:"new",name:pr+""+i});  
    }
    else if(op == "rename")
    {
        let a=hardwareStore.get(pr);
        let b=hardwareStore.get(args.rename);
        if(a && !b)
        {
            hardwareStore.delete(pr);
            hardwareStore.set(args.rename,a);
            ev.reply("hardware.editProfile",{operation:"rename",from:pr,to:args.rename});  
        }
        else
        {
            ev.reply("hardware.editProfile",{operation:"rename",error:"CANT"});  
        }
    }
    else if(op == "delete")
    {
        hardwareStore.delete(pr);
    }
 })
  


ipcMain.on("animation.save",(ev,args)=>{
    animationStore.set(args.name,args.animation)
})
ipcMain.on("animation.request",(ev,args)=>{
    var d= animationStore.get(args);
    if(!d)
    d=new LedAnimation(args);
        ev.reply("animation.request",d);
 })
 ipcMain.on("animation.profiles",(ev,args)=>{
    var d= animationStore.getAll()
    if(!d)
    d={};
        ev.reply("animation.profiles", Object.keys(d));
 })
 ipcMain.on("animation.editProfile",(ev,args)=>{
    let pr = args.name;
    let op = args.operation
    if(op =="new")
    {
        
        let i=1;
        while(animationStore.get(pr+""+i))
        {
        i++
        }   
        animationStore.set(pr+""+i,{});   
        ev.reply("animation.editProfile",{operation:"new",name:pr+""+i});  
    }
    else if(op == "rename")
    {
        let a=animationStore.get(pr);
        let b=animationStore.get(args.rename);
        if(a && !b)
        {
            animationStore.delete(pr);
            animationStore.set(args.rename,a);
            ev.reply("animation.editProfile",{operation:"rename",from:pr,to:args.rename});  
        }
        else
        {
            ev.reply("animation.editProfile",{operation:"rename",error:"CANT"});  
        }
    }
    else if(op == "delete")
    {
        animationStore.delete(pr);
    }
 })
 ipcMain.on("vhardware.request",(ev,args)=>{
        ev.reply("vhardware.request",getVHardwareList(args.port,args.hard));
 })


}
export function getVHardwareList(port:string,hards:Hardware[])
{
var d = hards;

let res:VirtualHardware[]= [] ;
if(d != null)
{
    let h = d as Hardware[];
    var lastIndex=-1;
    for(var k=0;k< h.length;k++)
    {
        if(h[k].linkedBefore==true)
        {
            if(!res[lastIndex])
            {
            res[lastIndex]= new VirtualHardware(h[k].name,port);
            }
            res[lastIndex].addHardware(h[k])
        }
        else
        { 
            lastIndex++;
            res[lastIndex] = new VirtualHardware(h[k].name,port);
            res[lastIndex].addHardware(h[k]);
           
        }
    
    }
}
    return res;
}


export function getCurrent()
{
    var str=store.get("current")
        return new LedAnimation("d").formJson(str);
}
export function setCurrent(animation:LedAnimation)
{
    store.set("current",animation);
}
