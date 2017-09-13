
$(document).ready(function(){
    init();  
});

var setEscucharEventos = function(session){
    session.on('streamCreated', function (event) {

    });
    session.on('streamDestroyed', function () {

    });
    session.on('signal:broadcast', function (event) {
        if (event.data === 'status') {
            // signal(session, broadcast.status, event.from);
        }
    });
}

// var checkBroadcastStatus = function(session){
    
// }

let insertOptions = {
    width: '100%',
    height: '100%',
    showControls: false
};

var initPublisher = function(){
    var properties = Object.assign({ name: 'Host', insertMode: 'before' }, insertOptions);
    return OT.initPublisher('div-publisher', properties);
}

var getCredenciales = function(){
    $("#stop").hide();
    
    let session_data = JSON.parse(localStorage.getItem("datosSession"));
    if(!session_data.token){
        //CrearToken
        $.ajax({
            url: SAMPLE_SERVER_BASE_URL+'/session/'+session_data.session_id+'/token',
            async: false
        }).done(function(data){
            session_data.token=data.token;            
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
    let publisher = initPublisher();

    console.log(credenciales);

    session.connect(credenciales.token, function (error) {
        if (error) {
            console.log("Se produjo un error al conectarse a la sesión:", error.name, error.message)
        } else {
            setPublicarYSuscribir(session, publisher);
            //setEscucharEventos(session);
            // checkBroadcastStatus(session);
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