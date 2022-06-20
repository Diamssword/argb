import { SerialPort } from 'serialport';
import {app, BrowserWindow,ipcMain} from 'electron';
import {LedAnimation} from './Animations';
import {getCurrent,setCurrent} from './Profiles'
import {StorageInstance} from './storage'

var currentPort: SerialPort|undefined;
export function close()
{
    if(currentPort && currentPort.isOpen)
    {
        
        currentPort.close()
        currentPort.destroy()
    }
}
export function init(main: BrowserWindow)
{
    var store = new StorageInstance("serial");
    var p = store.get("lastPort");
    if(p && typeof p == 'string' && p.length>1)
    {
        currentPort=new SerialPort({ path:p, baudRate: 9600 },err=>{
            if(err)
            {
            
            currentPort = undefined;
            }
        });
        openPort(currentPort,main);
       main.webContents.send("Serial.state",{connected:currentPort.path});
    }
    ipcMain.on("Animaion.setCurrent",(ev,...args)=>{
        setCurrent(new LedAnimation("").formJson(args[0]));
    });

    ipcMain.on("Serial.ports",(ev,...args)=>{
        SerialPort.list().then((ports)=>{
                if(ports)
                {
                    if(currentPort && currentPort.path)
                    ev.reply("Serial.ports",{ports:ports,selected:currentPort.path});
                    else
                    ev.reply("Serial.ports",{ports:ports});
                }
        },(err)=>{
            ev.sender.send("error",err.message);
        })
    })
    ipcMain.on("Serial.connect",(ev,...args)=>{
        if(currentPort&& currentPort.path==args[0])
        {
            ev.sender.send("Serial.state",{connected:currentPort.path});
        }
        else
        {
            if(currentPort && currentPort.isOpen)
            currentPort.close();
            currentPort=new SerialPort({ path: args[0], baudRate: 9600 },err=>{
                if(err)
                {
                ev.sender.send("error","Impossible d'ouvrir le port "+args[0]);
                currentPort = undefined;
                }
            });
          
   
            if(currentPort  && currentPort.path)
            {
                store.set("lastPort",args[0]);
                store.save();
                openPort(currentPort,main);
            ev.sender.send("Serial.state",{connected:currentPort.path});
            }
            ev.sender.send("Serial.state",{});
        }
    })
}

function openPort(port:SerialPort,window:BrowserWindow )
{
    port.on('data', function (data) {
        window.webContents.send("Serial.receive",data.toString());
      })
      ipcMain.on("Serial.send",(ev,args)=>{
        port.write(args+'\n', function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
          })
      })
      var led=getCurrent()
      if(led)
      send(led.getCommand());
}
export function send(str:string)
{
if(currentPort?.isOpen)
{
    currentPort.write(str+'\n', function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
      })
}
}
