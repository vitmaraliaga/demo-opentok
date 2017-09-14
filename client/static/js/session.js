
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
        if (event.data === 'status') {
            signal(session, broadcast.status, event.from);
        }
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
            url: SAMPLE_SERVER_BASE_URL+'/session/'+session_data.session_id+'/token',
            async: false
        }).done(function(data){
            session_data.token=data.token;
            session_data.username=data.username;
            localStorage.setItem("datosSession", JSON.stringify(session_data));      
        })
    }

    $("#nombre_session").text(session_data.session_name);
    $("#session_id").val(session_data.session_id);

    return session_data;
}

var setPublicarYSuscribir = function(session, publisher){
    session.publish(publisher);
    addPublisherControls(publisher);
    setEscucharEventos(session, publisher);
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
    let credenciales = getCredenciales();
    let props = { connectionEventsSuppressed: true };
    let session = OT.initSession(credenciales.api_key, credenciales.session_id, props);

    let publisher = initPublisher(credenciales.username);

    // console.log(credenciales);

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

$(".tabs ul").on("click", "li", function(){
    var ContentId = $(this).data("content-id");
    $(".tabs li").removeClass("is-active");
    $(this).addClass("is-active");
    $(".content-tabs>.content-tab").removeClass("is-active");
    $("#" + ContentId).addClass("is-active");

})