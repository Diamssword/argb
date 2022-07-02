const path = require("path");
const fs = require('fs');
(global as any).__store = {
    create:create,
    get: get,
    set: set,
}

function create(file:string,storageDir:string)
{
    return new StorageInstance(file,storageDir);
}

var settings:StorageInstance;
export function initDefault(launcherdir:string)
{
    settings=create("settings",launcherdir);
}
function get(key:string) {
    return settings.get(key);
}
function set(key:string, value:any) {
    settings.set(key,value);
}
export class StorageInstance {
    storage:any;
    file :string;
    constructor(file:string,launcherDir?:string) {
    this.storage={};
    this.file=this.load(launcherDir?launcherDir:(global as any).__software,file);
    }
    load(launcherdir:string,file:string) {
            let f1 = path.join(launcherdir, file+".json")
        if (!fs.existsSync(launcherdir))
            fs.mkdirSync(launcherdir);
        if (fs.existsSync(f1)) {
            var res = fs.readFileSync(f1);
            this.storage = JSON.parse(res);
        }
        return f1;
    }

    save()
    {
        fs.writeFileSync(this.file, JSON.stringify(this.storage,undefined,3));
    }
    get(key:string)
    {
        return this.storage[key];
    }
    getAll()
    {
        return this.storage;
    }
    set(key:string,value:any)
    {
        this.storage[key]=value;
        this.save();
    }
}
