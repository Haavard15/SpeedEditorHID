var HID = require('node-hid');
var http = require('http');
var robot = require("robotjs");
var devices = HID.devices();
console.log(devices)
var device = new HID.HID(7899,55822);

function hexToBinary(hexArray){
  var binaryArray = []
  hexArray.forEach(hexNumber => {
    binaryArray.push(parseInt(hexNumber, 16))
  })
  return binaryArray
}

console.log("Feature Report 1:", device.getFeatureReport(1, 8))
console.log("Feature Report 8:", device.getFeatureReport(8, 33))

device.write(Buffer.from([3,2,0,0,0,0,255]))
device.write(Buffer.from([4,1]))
device.write(Buffer.from([2,32,0,0,0]))
device.sendFeatureReport(Buffer.from([6,0,0,0,0,0,0,0,0,0]))

console.log("Feature Report 6:", device.getFeatureReport(6, 10))

device.write(Buffer.from([3,2,0,0,0,0,255]))
device.write(Buffer.from([4,1]))
device.write(Buffer.from([2,32]))

device.sendFeatureReport(Buffer.from(hexToBinary(["06","01","B0","DD","AF","58","39","E1","89","86"])))
device.sendFeatureReport(Buffer.from(hexToBinary(["06","03","68","06","57","9D","01","76","4C","1D"])))
device.sendFeatureReport(Buffer.from(hexToBinary(["06","00","00","00","00","00","00","00","00","00"])))
device.sendFeatureReport(Buffer.from(hexToBinary(["06","01","C9","86","49","19","1A","36","03","C5"])))
device.sendFeatureReport(Buffer.from(hexToBinary(["06","03","C0","A3","15","4D","F7","DE","DE","76"])))

var buttons = [
  "Smart Insert",
  "Append",
  "Ripple",
  "Close Up",
  "Place On Top",
  "Source",
  "In",
  "Out",
  "Trim In",
  "Trim Out",
  "Roll",
  "Slip Source",
  "Slip Destination",
  "Transistion Duration",
  "Cut",
  "Dissolve",
  "Smooth Cut",
  "Smooth Cut",
]

var otherButtons = {
  49: "Escape",
  31: "Sync Bin",
  44: "Audio Level",
  45: "Full View",
  34: "Transistion",
  47: "Split",
  46: "Snap",
  43: "Ripple Delete",
  51: "Camera 1",
  52: "Camera 2",
  53: "Camera 3",
  54: "Camera 4",
  55: "Camera 5",
  56: "Camera 6",
  57: "Camera 7",
  58: "Camera 8",
  59: "Camera 9",
  48: "Live",
  37: "Video Only",
  38: "Audio Only",
  60: "Play / Pause",
  26: "Source",
  27: "Timeline",
}

Object.keys(otherButtons).forEach(buttonNumber => {
  buttons[buttonNumber - 1] = otherButtons[buttonNumber];
});

buttons.forEach((button, i) => {
  console.log(i, button)
});

//console.log(buttons)

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

var previousButtons = []

device.on("data", function(data) {
  console.log(data)
  var dataArray = [...data];
  if(dataArray[0] == 4){
    
    var buttonsPressed = []
    if(dataArray[1] != 0){
      buttonsPressed.push(dataArray[1])
    }
    if(dataArray[3] != 0){
      buttonsPressed.push(dataArray[3])
    }
    if(dataArray[5] != 0){
      buttonsPressed.push(dataArray[5])
    }
    if(dataArray[7] != 0){
      buttonsPressed.push(dataArray[7])
    }
    if(dataArray[9] != 0){
      buttonsPressed.push(dataArray[9])
    }
    if(dataArray[11] != 0){
      buttonsPressed.push(dataArray[11])
    }
    console.log(previousButtons)
    console.log(buttonsPressed)
    buttonsPressed.forEach(button => {
      if(previousButtons.indexOf(button) == -1){
        console.log("Pressed ", buttons[button - 1])
        if(buttons[button - 1] == "Cut"){
          console.log("cut");
          //robot.typeString("Hello World");
        }

      }
      //console.log(buttons[button - 1])
    });
    previousButtons.forEach(button => {
      if(buttonsPressed.indexOf(button) == -1){
        console.log("Unpressed ", buttons[button - 1])
        if(buttons[button - 1] == "Cut"){
          console.log("cut");
        }
      }
      //console.log(buttons[button - 1])
    });
    previousButtons = buttonsPressed;
    //console.log(buttonsPressed);
  }

});

