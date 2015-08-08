var socket;
window.onload = function() {
  var ipHost = document.location.hostname;
  socket = new WebSocket("ws://"+ipHost+":6969");
  init();
}
            
function init(){

  socket.onclose = function()
  {
    console.error("web channel closed");
    promt();
  };
  socket.onerror = function(error)
  {
    console.error("web channel error: " + error);
  };
  socket.onopen = function()
  {
    new sharkIO(socket, function(channel) {
      window.fs = channel.objects.fs;
      window.gpio = channel.objects.gpio;
    });
  }
}

function promt(){
    var ipPromt,ip,ipSplit;
    ipPromt = prompt("Input IP address, ex: 192.168.1.1 or 192.168.1.1:6969");
    ipSplit = ipPromt.split(":");
    if(ipSplit.length == 1){
      ip = ipSplit[0]+":6969";
    }
    else{
      ip = ipSplit[0]+":"+ipSplit[1];
    }
    if(ip !== null){
      socket = new WebSocket("ws://"+ip);
      init();
    }
}