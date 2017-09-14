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
    showControls: false
};

/**
 * Create an OpenTok publisher object
 */
var initPublisher = function () {
    var properties = Object.assign({ name: 'Guest', insertMode: 'after' }, insertOptions);
    return OT.initPublisher('hostDivider', properties);
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
};

/**
 * Start publishing our audio and video to the session. Also, start
 * subscribing to other streams as they are published.
 * @param {Object} session The OpenTok session
 * @param {Object} publisher The OpenTok publisher object
 */
var publishAndSubscribe = function (session, publisher) {
    
    var streams = 1;
    
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
    
    // document.getElementById('publishVideo').addEventListener('click', function () {
    //     toggleMedia(publisher, this);
    // });
    
    // document.getElementById('publishAudio').addEventListener('click', function () {
    //     toggleMedia(publisher, this);
    // });
    
};


var init = function(){

    let credentials = getCredentials();
    let props = { connectionEventsSuppressed: true };
    let session = OT.initSession(credentials.apiKey, credentials.sessionId, props);
    let publisher = initPublisher();

    session.connect(credentials.token, function (error) {
      if (error) {
        // console.log(error);
        // analytics.init(session);
        // analytics.log('initialize', 'variationAttempt');
        // analytics.log('initialize', 'variationError');
      } else {
        publishAndSubscribe(session, publisher);
        // analytics.init(session);
        // analytics.log('initialize', 'variationAttempt');
        // analytics.log('initialize', 'variationSuccess');
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