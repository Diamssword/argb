import { LedAnimation } from './Animations';
import { Hardware ,VirtualHardware} from './Hardwares';
import {StorageInstance} from './storage'
import {BrowserWindow,ipcMain,IpcMain} from 'electron'
var store= new StorageInstance("temp","temp");
export function init(window:BrowserWindow)
{
 store= new StorageInstance("profile");
 
ipcMain.on("hardware.save",(ev,args)=>{
   store.set("hardware",args);
})
ipcMain.on("hardware.request",(ev,args)=>{
        ev.reply("hardware.request",store.get("hardware"));
 })
 ipcMain.on("vhardware.request",(ev,args)=>{
        ev.reply("vhardware.request",getHardwareList());
 })
 ipcMain.on("animation.save",(ev,args)=>{
    let anim:any=store.get("animations");
    if(anim == undefined)
        anim={};
        anim[args.hardware]=args.anim;
        store.set("animations",anim);
        store.save();
 })
 ipcMain.on("animations.request",(ev,args)=>{
    let d=store.get("animations")
    if(!d)
    {
        d={};
    }
         ev.reply("animations.request",d);
  })

}
export function getHardwareList()
{
var d : unknown =store.get("hardware");

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
            res[lastIndex]= new VirtualHardware(h[k].name);
            }
            res[lastIndex].addHardware(h[k])
        }
        else
        { 
            lastIndex++;
            res[lastIndex] = new VirtualHardware(h[k].name);
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
    store.save();
}
