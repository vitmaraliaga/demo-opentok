var session_data;

var session;

$(document).ready(function(){
    $("#stop").hide();

    session_data = JSON.parse(localStorage.getItem("datosSession"));

    if(session_data){
        initializeSession();

        $("#nombre_session").text(session_data.session_name);
        $("#session_id").val(session_data.session_id);
    }
});

/**
 * Función de Inicialización
 */
function initializeSession(){

    session = OT.initSession(session_data.api_key, session_data.session_id)

    session.connect(session_data.token, function(error){
        if(!error){
            
            let publisherOptions = {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            };
            
            let publisher = OT.initPublisher('div-publisher', publisherOptions, function(error){
                if(error){
                    console.log("Se ha producido un error al inicializar el editor:", error.name, error.message)
                    return;
                }
                session.publish(publisher, function(error){
                    if(!error){
                        console.log("Se publico! con exito");
                        //screenshare();
                    }else{
                        console.log("Se ha producido un error al publicar:", error.name, error.message)
                    }
                });
            });
            
        }else{
            console.log("Se produjo un error al conectarse a la sesión:", error.name, error.message)
        }
    });

    session.on({
        streamCreated: function(event){
            console.log("se creo un stream")
        },
        sessionDisconnected:function(event){
            console.log('Se ha desconectado de la sesión.', event.reason);
        },
    })

}