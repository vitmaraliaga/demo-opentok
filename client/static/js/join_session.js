$(document).ready(function(){
    init();
});

// Funcion de inicializaciòn
function initializeSession(){
    
    if(!validateSupportWebRTC()){return false;}
    session = OT.initSession(session_data.api_key, session_data.session_id)
    
};

/**
 * Options for adding OpenTok publisher and subscriber video elements
 */
var insertOptions = {
    width: '100%',
    height: '100%',
    showControls: true
};

/**
 * Create an OpenTok publisher object
 */
var initPublisher = function () {
    // var properties = Object.assign({ name: 'Guest', insertMode: 'after' }, insertOptions);
    var properties = Object.assign({ name: 'Me', insertMode: 'append' }, insertOptions);
    return OT.initPublisher('div-publisher', properties);
};


/**
 * Validar que el navegador soporte WebRTC.
 */
function validateSupportWebRTC(){
    if (OT.checkSystemRequirements() == 1) {
        // let session = OT.initSession(apiKey, sessionId);
        return true;
    } else {
        console.log("The client does not support WebRTC.")
        return false;
    }
}

/**
 * Get our OpenTok API Key, Session ID, and Token from the JSON embedded
 * in the HTML.
 */
var getCredentials = function () {
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
            url: SAMPLE_SERVER_BASE_URL+'/session/'+session_data.session_id+'/token-guest',
            async: false
        }).done(function(data){
            session_data.token=data.token;
            session_data.username=data.username;
            localStorage.setItem("datosSession", JSON.stringify(session_data));      
        });
    }

    $("#nombre_session").text(session_data.session_name);
    $("#session_id").val(session_data.session_id);

    return session_data;
};

/**
 * Start publishing our audio and video to the session. Also, start
 * subscribing to other streams as they are published.
 * @param {Object} session The OpenTok session
 * @param {Object} publisher The OpenTok publisher object
 */
var publishAndSubscribe = function (session, publisher) {
    
    var streams = 1;
    console.log("hi")
    session.publish(publisher);
    // addPublisherControls(publisher);
    
    session.on('streamCreated', function (event) {
        subscribe(session, event.stream);
        streams++;
        if (streams > 3) {
            document.getElementById('videoContainer').classList.add('wrap');
        }
    });
    
    session.on('streamDestroyed', function (event) {
        subscribe(session, event.stream);
        streams--;
        if (streams < 4) {
            document.getElementById('videoContainer').classList.remove('wrap');
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
    

    // document.getElementById('publishVideo').addEventListener('click', function () {
    //     toggleMedia(publisher, this);
    // });
    
    // document.getElementById('publishAudio').addEventListener('click', function () {
    //     toggleMedia(publisher, this);
    // });
    
};

/**
 * Subscribe to a stream.
 */
var subscribe = function (session, stream) {
    var name = stream.name;
    var divContentId = name === '@vitmaraliaga' ? 'div-subscriber' : 'div-publisher';
    console.log("subscribe :" + name); 
    // var insertMode = name === 'Host' ? 'before' : 'after';
    // var insertMode = name === 'Host' ? 'before' : 'after';
    var properties = Object.assign({ name: name, insertMode: 'append' }, insertOptions);
    session.subscribe(stream, divContentId, properties, function (error) {
      if (error) {
        console.log(error);
      }
    });
};


var setListenSignals = function(session){
    
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
    

var init = function(){
    if(!validateSupportWebRTC()){return false;}
    console.log("init")
    let credentials = getCredentials();
    let props = { connectionEventsSuppressed: true };
    console.log(credentials);
    let session = OT.initSession(credentials.api_key, credentials.session_id, props);
    let publisher = initPublisher();

    session.connect(credentials.token, function (error) {
      if (error) {
        // console.log(error);
        // analytics.init(session);
        // analytics.log('initialize', 'variationAttempt');
        // analytics.log('initialize', 'variationError');
      } else {
        publishAndSubscribe(session, publisher);
        setListenSignals(session);
        // analytics.init(session);
        // analytics.log('initialize', 'variationAttempt');
        // analytics.log('initialize', 'variationSuccess');
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
});
