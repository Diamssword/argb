// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort } = require('serialport')
const tableify = require('tableify')

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if(err) {
      document.getElementById('error').textContent = err.message
      return
    } else {
      document.getElementById('error').textContent = ''
    }

    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered'
    }

    tableHTML = tableify(ports)
    document.getElementById('ports').innerHTML = tableHTML
    
    const port = new SerialPort({ path: 'COM5', baudRate: 9600 },function (err) {
      if (err) {
        if(port.isOpen)
        port.close();
        if(port.isPaused)
        port.resume();
        return console.log('Error: ', err.message)
      }
    })
    setInterval(()=>{
      port.write('/argb SALUT\n', function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log('message written')
      })
    },5000)
    port.on('data', function (data) {
      console.log('Data:', data.toString())
    })
    
   

  })
}

function listPorts() {
  listSerialPorts();
 //setTimeout(listPorts, 2000);
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
//setTimeout(listPorts, 2000);

listSerialPorts()
