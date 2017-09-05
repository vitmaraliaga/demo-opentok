// Datos de inicializaciòn
var CONFIG = {
    apiKey: "",
    apiSecret: "",
    sessionId: "",
    token: ""
}

var session;
var archiveId;

$(document).ready(function(){
    $("#stop").hide();
    archiveId = null;

    // Revisar el archivo config.js
    if(API_KEY && TOKEN && SESSION_ID){
        
        CONFIG.apiKey=API_KEY;
        CONFIG.sessionId=SESSION_ID;
        CONFIG.token=TOKEN;
        
        initializeSession();

    }else if(SAMPLE_SERVER_BASE_URL){
    
        $.get(SAMPLE_SERVER_BASE_URL + "/session", function(res){
        
            CONFIG.apiKey=res.apiKey;
            CONFIG.sessionId=res.sessionId;
            CONFIG.token=res.token;

            initializeSession();
        });
    }
})



// Funcion de inicializaciòn
function initializeSession(){
    
    session = OT.initSession(CONFIG.apiKey, CONFIG.sessionId);
    
    // El connect retorna una promesa
    session.connect(CONFIG.token, function(error){
        // Si la conexión es correcta, inicialice un editor y publique en la sesión
        if(!error){
            
            //Configuraciòn basica para inciaar una publicaciòn.
            let publisherOptions = {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            };
            
            // El initPublisher retorna una promesa.
            let publisher = OT.initPublisher('div-publisher', publisherOptions, function(error){
                if(error){
                    console.log("Se ha producido un error al inicializar el editor:", error.name, error.message)
                    return;
                }

                // El publisher retorna un promesa.
                session.publish(publisher, function(error){
                    if(!error){
                        screenshare();
                    }else{
                        console.log("Se ha producido un error al publicar:", error.name, error.message)
                    }
                });
            });
            
        }else{
            console.log("Se produjo un error al conectarse a la sesión:", error.name, error.message)
            //handleError(error);
        }
    });

    session.on({
        streamCreated: function(event){
            let subscriberOptions = {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            };
            session.subscribe(event.stream, 'div-subscriber', subscriberOptions, function(error){
                if (error) {
                    console.log('Se ha producido un error al publicar-subscriber: ', error.name, error.message);
                  }
            });
        },
        sessionDisconnected:function(event){
            //evento que se lanza cuando alquien se desconecta.
            console.log('Se ha desconectado de la sesión.', event.reason);
        } 
    });

    // recibir un mensage y agregar en el historial.
    let msgHistory = document.querySelector("#history");
    session.on('signal:msg', function(event){
        let data = event.data;
        // console.log(data)
        let li = document.createElement("li");
        li.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
        let div = document.createElement("div");
        
        // div avatar
        let img = document.createElement("img");
        let avatar = div;
        avatar.className = "avatar";
        avatar.appendChild(img);
        
        // div msg
        let p = document.createElement("p");
        p.textContent = data.msgText;
        let time = document.createElement("time");
        let hora = document.createTextNode(data.hora);
        time.appendChild(hora);
        let msg = div;
        msg.className = "msg";
        msg.appendChild(p);
        msg.appendChild(time);

        li.appendChild(avatar);
        li.appendChild(msg);
        
        msgHistory.appendChild(li);
        li.scrollIntoView();
    });
} 
    
OT.registerScreenSharingExtension('chrome', 'dlcgbghloidbinffeepimoifajmjelfp', 2);
    
function screenshare() {
    OT.checkScreenSharingCapability(function(response) {
        console.log(response);

        if (!response.supported || response.extensionRegistered === false) {
            alert('This browser does not support screen sharing.');
        } else if (response.extensionInstalled === false) {
            alert('Please install the screen sharing extension and load your app over https.');
        } else {
            // Screen sharing is available. Publish the screen.
            var screenSharingPublisher = OT.initPublisher('screen-preview', {videoSource: 'screen'});
            session.publish(screenSharingPublisher, function(error) {
                if (error) {
                    alert('Could not share the screen: ' + error.message);
                }
            });
        }
    });
}

//  https://codepen.io/Varo/pen/gbZzgr

// Text chat
var form = document.querySelector("form");
var msgText = document.querySelector("#msgTxt");

//Enviar una señal una vez que el usuario ingrese datos en el formulario.
form.addEventListener("submit", function(event){
    event.preventDefault();
    console.log(GetCurrentHour())
    var Data = {
        msgText: msgTxt.value,
        hora: GetCurrentHour()
    }
    
    session.signal({type: 'msg', data: Data }, function(error){
        if (error){
            console.log("Error enviando la señal: ", error.name, error.message);
        }else {
            msgText.value = "";
        }
    })
}) 
var url = "http://127.0.0.1:8887/videos"

function onStartGrabacion(){
    console.log(">>> Start")
    $.ajax({
        url: url + "/archive/start",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({"sessionId": CONFIG.sessionId}),
        complete: function(){
            console.log("onStartGrabacion() complete");
        },
        success: function(){
            console.log("onStartGrabacion() successfully");
        },
        error: function(err){
            console.log(err);
            console.log("onStartGrabacion() error");
        }
    });

    $("#start").hide();
    $("#stop").show();
}

function onStopGrabacion(){
    $.post(url + "/archive/" + archiveId + "/stop");
    $("#stop").hide();
    $("#start").prop("disabled", false);
    $("#stop").show();
}

function onViewGrabacion(){
    $("#view").prop("disabled", true);
    window.location = url + /archive/ + archiveId + "view";
}

$("#start").show();
$("#view").hide();

//Manejador de errores
function handleError(error){
    if(error){
        alert("ERROR: ", error.message)
    }
}



function AddZero(i){
    if(i < 10){
        i = "0" + i;
    }
    return i;
}

// traer la hora actual. de la computadora
function GetCurrentHour(){
    let date = new Date();
    let hora = AddZero(date.getHours());
    let minuto = AddZero(date.getMinutes());
    let segundo = AddZero(date.getSeconds());
    return hora + ":" + minuto + ":" + segundo;
}
