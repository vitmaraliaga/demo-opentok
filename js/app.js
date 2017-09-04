// Datos de inicializaciòn
var CONFIG = {
    apiKey: "",
    apiSecret: "",
    sessionId: "",
    token: ""
}

var session;

$(document).ready(function(){
    
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
                    if(error){
                        console.log("Se ha producido un error al publicar:", error.name, error.message)
                    }
                });
            });
            
        }else{
            console.log("Se produjo un error al conectarse a la sesión:", error.name, error.message)
            //handleError(error);
        }
    });

    session.on('streamCreated', function(event){

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
    });

    //evento que se lanza cuando alquien se desconecta.
    session.on('sessionDisconnected', function(event){
        console.log('Se ha desconectado de la sesión.', event.reason);
    });

    // recibir un mensage y agregar en el historial.
    let msgHistory = document.querySelector("#history");
    session.on('signal:msg', function(event){

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
        p.textContent = event.data;
        let time = document.createElement("time");
        let hora = document.createTextNode("20:18");
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
//  https://codepen.io/Varo/pen/gbZzgr

// Text chat
var form = document.querySelector("form");
var msgText = document.querySelector("#msgTxt");

//Enviar una señal una vez que el usuario ingrese datos en el formulario.
form.addEventListener("submit", function(event){
    event.preventDefault();

    session.signal({type: 'msg', data: msgTxt.value }, function(error){
        if (error){
            console.log("Error enviando la señal: ", error.name, error.message);
        }else {
            msgText.value = "";
        }
    })
}) 




//Manejador de errores
function handleError(error){
    if(error){
        alert("ERROR: ", error.message)
    }
}


