var session_data;

var session;

$(document).ready(function(){

    
    session_data = JSON.parse(localStorage.getItem("datosSession"));
    
    if(session_data){
        initializeSession();
        
        $("#nombre_session").text(session_data.session_name);
        $("#session_id").val(session_data.session_id);
    }
});

// Funcion de inicializaciòn
function initializeSession(){
    
    if(!validateSupportWebRTC()){return false;}
    

    session = OT.initSession(session_data.api_key, session_data.session_id)
    
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