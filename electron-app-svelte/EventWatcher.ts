import os from 'os';
import fs from 'fs';
import path from 'path';

const file = path.join(os.tmpdir(),"ARGBLedSync.txt");
export function init()
{
    loadAllPlugins();
function readEvents(file:string) {

const data = fs.readFileSync(file, 'utf-8');
if(data && data.length>0)
{
    fs.writeFileSync(file,"",{encoding:'utf-8'});
    let d=data.split("\n")
    for(var s in d)
    {
        var line= d[s];
        var i =line.indexOf(":");
        if(i>0)
        {
            var ev=line.substring(0,i);
            var parsed ={};
            try{
            parsed=JSON.parse(line.substring(i+1));
            }catch{
            }
            for(var l in plugins)
            {
                if(plugins[l].getEvent()==ev)
                {
                    plugins[l].onEvent(parsed,ev);
                    break;
                }
            }
             
        }
     
        
    }
}
}

if(!fs.existsSync(file))
{
    fs.writeFileSync(file,"",{encoding:'utf-8'});
}

readEvents(file);
fs.watch (file, (event, filename) => {
if (filename && event ==='change') {

   readEvents(file);
  }
 });
}
type Plugin ={
    getEvent: ()=>string,
    onEvent: (data:any,event:string)=>void
}
var plugins:Plugin[]=[];
function loadAllPlugins()
{
        var files=fs.readdirSync("./plugins");
        for(var f in files)
        {
            var f1=files[f];
            if(f1.endsWith('.ts'))
            {
                f1= f1.replace('.ts','.js')
            }
           var imp=require('./plugins/'+f1)
           if(imp.getEvent && imp.onEvent)
            plugins.push(imp);
            else
            {
                console.error("Plugin is missing getEvent or onEvent :"+f1)
            }
        }
}