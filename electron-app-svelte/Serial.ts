import { SerialPort } from 'serialport';
import {app, BrowserWindow,ipcMain} from 'electron';
import {LedAnimation} from './Animations';
import {getCurrent,setCurrent} from './Profiles'

var currentPort: SerialPort|undefined;
export function init(main: BrowserWindow)
{

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
