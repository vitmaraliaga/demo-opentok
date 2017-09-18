
$(document).ready(function(){
    init();  
});
/** The state of things */
var broadcast = { status: 'waiting', streams: 1, rtmp: false };

/**
 * Options for adding OpenTok publisher and subscriber video elements
 */
let insertOptions = {
    width: '100%',
    height: '100%',
    showControls: true
};

/**
 * Subscribe to a stream
 */
var subscribe = function(session, stream){
    var properties = Object.assign({ name: 'Invitado', insertMode: 'after' }, insertOptions);
    console.log("heyyy")
    // hostDivider
    session.subscribe(stream, 'div-subscriber', properties, function (error) {
      if (error) {
        console.log("Error: ", error);
      }
    });
}

var updateBroadcastLayout = function () {
    http.post('/broadcast/layout', { streams: broadcast.streams })
      .then(function (result) { console.log(result); })
      .catch(function (error) { console.log(error); });
};

/**
 * Send the broadcast status to everyone connected to the session using
 * the OpenTok signaling API
 * @param {Object} session
 * @param {String} status
 * @param {Object} [to] - An OpenTok connection object
 */
var signal = function (session, status, to) {
    var signalData = Object.assign({}, { type: 'broadcast', data: status }, to ? { to } : {});
    session.signal(signalData, function (error) {
      if (error) {
        console.log(['signal error (', error.code, '): ', error.message].join(''));
      } else {
        console.log('signal sent');
      }
    });
};

/**
 * Listen for events on the OpenTok session
 */
var setEscucharEventos = function(session, publisher){

    let streams = [];
    let subscribers = [];
    let broadcastActive = false;

    // console.log("setEscucharEventos");
    // console.log(session);
    
    // Subscribe to new streams as they're published
    session.on('streamCreated', function (event) {
        // console.log("streamCreated");
        let currentStreams = broadcast.streams;
        subscribe(session, event.stream);
        broadcast.streams++;
        // console.log(broadcast.streams);
        if (broadcast.streams > 3) {
        console.log("streamCreated mas 3");        
          document.getElementById('div-subscriber').classList.add('wrap');
          if (broadcast.status === 'active' && currentStreams <= 3) {
            console.log("streamCreated mas ");        
            updateBroadcastLayout();
          }
        }
    });

    session.on('streamDestroyed', function () {
        var currentStreams = broadcast.streams;
        broadcast.streams--;
        if (broadcast.streams < 4) {
          document.getElementById('div-subscriber').classList.remove('wrap');
          if (broadcast.status === 'active' && currentStreams >= 4) {
            updateBroadcastLayout();
          }
        }      
    });
    session.on('signal:broadcast', function (event) {
        console.log("Hola de broadcast");
        
        if (event.data === 'status') {
            signal(session, broadcast.status, event.from);
        }
    });
    session.on('signal:msg', function(event){
        // recibir un mensage y agregar en el historial.
        let msgHistory = document.querySelector("#history");
        let data = event.data;
            
        
        let li = document.createElement("li");
        li.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
        let div = document.createElement("div");
        let div1 = document.createElement("div");
            
        // div avatar
        let img = document.createElement("img");
        img.src = "http://bulma.io/images/placeholders/128x128.png";
        let avatar = div1;
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

var setEscucharSeñales = function(session){

    // https://codepen.io/Varo/pen/gbZzgr

    //Text chat
    var form = document.querySelector("#formChatText");
    var msgText = document.querySelector("#msgTxt");

    //Enviar una señal una vez que el usuario ingrese datos en el formulario.
    form.addEventListener("submit", function(event){
        event.preventDefault();
    
        if(msgTxt.value == ""){
            return;
        }
    
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
    });
}


// var checkBroadcastStatus = function(session){
    
// }

/**
 * Create an OpenTok publisher object
 */
var initPublisher = function(username){
    console.log("init Publisher");
    let properties = Object.assign({ name: username, insertMode: 'append' }, insertOptions);
    return OT.initPublisher('div-publisher', properties);
}

var getCredenciales = function(){
    $("#stop").hide();
    
    let session_data = JSON.parse(localStorage.getItem("datosSession"));
    if(!session_data){
        alert("Usted debe crear una session para Ingresar a esta pagina.");
        window.location.href = "../index.html";
    }
    if(!session_data.token){
        //console.log("Crear nuevo token, es una nueva persona.")
        //CrearToken
        $.ajax({
            url: SAMPLE_SERVER_BASE_URL+'/session/'+session_data.session_id+'/token-host',
            async: false
        }).done(function(data){

            session_data.token=data.token;
            session_data.username=data.username;
            setSessionData(session_data);  
            setTokenFire(session_data);
        });
    }

    $("#nombre_session").text(session_data.session_name);
    $("#session_id").val(session_data.session_id);

    return session_data;
}

var setTokenFire = function(sessionData){
    
     let db = firebase.database();
     var tokens = db.ref("tokens");
     return tokens.push({
        token: sessionData.token,
        username: sessionData.username,
        session_id: sessionData.session_id
      });
 }

var setSessionData = function(sessionData){
    localStorage.setItem("datosSession", JSON.stringify(sessionData));
}

var setPublicarYSuscribir = function(session, publisher){
    session.publish(publisher);
    addPublisherControls(publisher);
    setEscucharEventos(session, publisher);
    setEscucharSeñales(session);
}

var addPublisherControls = function (publisher) {
    var publisherContainer = document.getElementById(publisher.element.id);
    var el = document.createElement('div');
    var controls = [
      '<div class="publisher-controls-container">',
      '<div id="publishVideo" class="control video-control"></div>',
      '<div id="publishAudio" class="control audio-control"></div>',
      '</div>',
    ].join('\n');
    el.innerHTML = controls;
    publisherContainer.appendChild(el.firstChild);
};

var init = function(){
    firebase.initializeApp(FIREBASE_CONFIG);
    let credenciales = getCredenciales();
    let props = { connectionEventsSuppressed: true };
    let session = OT.initSession(credenciales.api_key, credenciales.session_id, props);

    let publisher = initPublisher(credenciales.username);

    session.connect(credenciales.token, function (error) {
        if (error) {
            console.log("Se produjo un error al conectarse a la sesión:", error.name, error.message)
        } else {
            setPublicarYSuscribir(session, publisher);
            // setEscucharEventos(session);
            // checkBroadcastStatus(session);
            //console.log("Se connecto el primero");
        }
    });
}

var AddZero = function (i){
    if(i < 10){
        i = "0" + i;
    }
    return i;
}
// traer la hora actual. de la computadora
var GetCurrentHour = function (){
    let date = new Date();
    let hora = AddZero(date.getHours());
    let minuto = AddZero(date.getMinutes());
    let segundo = AddZero(date.getSeconds());
    return hora + ":" + minuto + ":" + segundo;
}




$(".tabs ul").on("click", "li", function(){
    var ContentId = $(this).data("content-id");
    $(".tabs li").removeClass("is-active");
    $(this).addClass("is-active");
    $(".content-tabs>.content-tab").removeClass("is-active");
    $("#" + ContentId).addClass("is-active");

})