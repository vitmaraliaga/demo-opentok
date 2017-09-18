$(document).ready(function(){
    init();
});

var addEscuchadorEventosNuevo = function(){
    // events new session
    $("#btnNewSession").on("click", function(){
        $("#modalNewSession").addClass("is-active");
    })
    
    $("#backgroundNewSession").on("click", function(){
        $("#modalNewSession").removeClass("is-active");
    });
    
    $("#btnCloseNewSession").on("click", function(){
        $("#modalNewSession").removeClass("is-active");
    });
    $("#formIniciarSession").on("submit", function(e){
        e.preventDefault();
        let session_name = $("#nombreSession").val();
        if(session_name != ""){
            crearSessionAPI({session_name: session_name});
        }
    });
}

var addEscuchadorEventosJoin = function(){

    // events join session
    $("#btnJoinSession").on("click", function(){
        $("#modalJoinSession").addClass("is-active");
    })
    
    $("#backgroundJoinSession").on("click", function(){
        $("#modalJoinSession").removeClass("is-active");
    });
    
    $("#btnCloseJoinSession").on("click", function(){
        $("#modalJoinSession").removeClass("is-active");
    });

    $("#formJoinSession").on("submit", function(e){
        e.preventDefault();
        let form = getFormData($(this));
        if(form.session_id != ""){
            crearTokenAPI(form.session_id);
        }
    });
}

var addEscuchadorEventosView = function(){
    
        // events join session
        $("#btnViewSession").on("click", function(){
            $("#modalViewSession").addClass("is-active");
        })
        
        $("#backgroundViewSession").on("click", function(){
            $("#modalViewSession").removeClass("is-active");
        });
        
        $("#btnCloseViewSession").on("click", function(){
            $("#modalViewSession").removeClass("is-active");
        });
    
        $("#formViewSession").on("submit", function(e){
            e.preventDefault();
            let form = getFormData($(this));
            crearTokenViewerAPI(form.session_id);
        });
    }

var crearTokenAPI = function(session_id){
    $.ajax({
        url: SAMPLE_SERVER_BASE_URL+'/session/'+session_id+'/token-guest',
        async: false
    }).done(function(data){

        getSessionDataFire(session_id)
            .then(function(fireData){
                // console.log("fireData===>>");
                // console.log(fireData)
                fireData.forEach(function(session) {
                    
                    let sessionData = {
                        api_key: session.val().api_key,
                        session_id: session.val().session_id,
                        session_name: session.val().session_name,
                        token: data.token,
                        username: data.username,
                    }
                    setTokenFire(sessionData).then(function(d){
                        setSessionData(sessionData);
                        window.location.href = "./templates/join_session.html";
                    }, function(e){
                        console.log("errror: ", e)
                    });
                });
            })
    }).always(function(){
    });
}

var crearTokenViewerAPI = function(session_id){
    $.ajax({
        url: SAMPLE_SERVER_BASE_URL+'/session/'+session_id+'/token-viewer',
        async: false
    }).done(function(data){

        getSessionDataFire(session_id)
            .then(function(fireData){
                // console.log("fireData===>>");
                // console.log(fireData)
                fireData.forEach(function(session) {
                    
                    let sessionData = {
                        api_key: session.val().api_key,
                        session_id: session.val().session_id,
                        session_name: session.val().session_name,
                        token: data.token,
                        username: data.username,
                    }
                    setTokenFire(sessionData).then(function(d){
                        setSessionData(sessionData);
                        window.location.href = "./templates/view_session.html";
                    }, function(e){
                        console.log("errror: ", e)
                    });
                });
            })
    }).always(function(){
    });
}

var setTokenFire = function(sessionData){
    
    console.log(sessionData);
    let db = firebase.database();
    let tokens = db.ref("tokens");
    return tokens.push({
        token: sessionData.token,
        username: sessionData.username,
        session_id: sessionData.session_id
    });
 }

var crearSessionAPI = function(data){

    $.ajax({
        url: SAMPLE_SERVER_BASE_URL + "/session",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        complete: function(){
            console.log("Create Complete");
            //window.location.href = "./templates/session.html";
        },
        success: function(data){
            console.log(data);
            console.log("Create successfully");
            
            let sessionData = {
                api_key: data.api_key,
                session_id: data.session_id,
                session_name: data.session_name,
                token: '',
                username: '',
            }
            setSessionData(sessionData);
            setSessionDataFire(sessionData).then(function(d){
                console.log("guardo: ", d);
                window.location.href = "./templates/session.html";

            }, function(e){
                console.log("errror: ", e)
            })
        },
        error: function(err){
            console.log(err);
            console.log("Create error");
        }
    });
}

var setSessionDataFire = function(sessionData){
   
    let db = firebase.database();
    var sessions = db.ref("sessions");
    return sessions.push({
        api_key: sessionData.api_key,
        session_id: sessionData.session_id,
        session_name: sessionData.session_name
     });
}

var getSessionDataFire = function(session_id){
    console.log(session_id);
    let db = firebase.database();
    return db.ref("/sessions").orderByChild("session_id").equalTo(session_id).once("value");
}

var setSessionData = function(sessionData){
    localStorage.setItem("datosSession", JSON.stringify(sessionData));
}

var getSessionData = function(){
    return JSON.parse(localStorage.getItem("datosSession"));
}

var getFormData = function($form){
    let indexed_array = {};
    $.map($form.serializeArray(), function(n, i){
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}

var init = function(){

    firebase.initializeApp(FIREBASE_CONFIG);
    addEscuchadorEventosNuevo();
    addEscuchadorEventosJoin();
}
    