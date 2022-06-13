 const {ipcRenderer}= require('electron');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
 
   

})
window.send= ipcRenderer.send;
window.receive=(channel,fn)=>{ipcRenderer.on(channel,(ev,args)=>{fn(args)})};