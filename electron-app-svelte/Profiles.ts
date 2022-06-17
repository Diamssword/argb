import { LedAnimation } from './Animations';
import {StorageInstance} from './storage'
var store= new StorageInstance("temp","temp");
export function init()
{
 store= new StorageInstance("animations");
}



export function getCurrent()
{
    var str=store.get("current")
        if(str && str.length>1)
        return new LedAnimation("d").formJson(str);
}
export function setCurrent(animation:LedAnimation)
{
    store.set("current",animation.toJson());
    store.save();
}
