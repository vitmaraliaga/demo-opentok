$(document).ready(function(){

    $("#btnNewSession").on("click", function(){
        $("#modalNewSession").addClass("is-active");
    })
    
    $("#backgroundNewSession").on("click", function(){
        $("#modalNewSession").removeClass("is-active");
    });
    
    $("#btnCloseNewSession").on("click", function(){
        $("#modalNewSession").removeClass("is-active");
    });

    // join session
    $("#btnJoinSession").on("click", function(){
        $("#modalJoinSession").addClass("is-active");
    })
    
    $("#backgroundJoinSession").on("click", function(){
        $("#modalJoinSession").removeClass("is-active");
    });
    
    $("#btnCloseJoinSession").on("click", function(){
        $("#modalJoinSession").removeClass("is-active");
    });

    
    $("#aIniciarSession").on("click", function(){
        let session_name = $("#nombreSession").val();
        // console.log(session_name);
        if(session_name != ""){
            
            let data = {
                session_name: session_name
            }
            
            // $.get(SAMPLE_SERVER_BASE_URL + "/session", function(res){
                
            //     CONFIG.apiKey=res.api_key;
            //     CONFIG.sessionId=res.session_id;
            //     // CONFIG.token=res.token;
    
            //     initializeSession();
            // });

            $.ajax({
                url: SAMPLE_SERVER_BASE_URL + "/session",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                complete: function(){
                    console.log("Create Complete");
                    window.location.href = "./templates/session.html";
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

                    localStorage.setItem("datosSession", JSON.stringify(sessionData));
                },
                error: function(err){
                    console.log(err);
                    console.log("Create error");
                }
            });
        }
    });

    $("#formJoinSession").on("submit", function(e){
        e.preventDefault();
        let form = getFormData($(this));

        console.log(form.session_id);

        $.ajax({
            url: SAMPLE_SERVER_BASE_URL+'/session/'+form.session_id+'/token',
            async: false
        }).done(function(data){
            // session_data.token=data.token;
            // session_data.username=data.username;

            // datos de session de un invitado.
            let sessionData = {
                api_key: data.api_key,
                session_id: form.session_id,
                session_name: "___",
                token: data.token,
                username: data.username,
            }

            localStorage.setItem("datosSession", JSON.stringify(sessionData));      
        }).always(function(){
            window.location.href = "./templates/join_session.html";
        });
        

    });


    var getFormData = function($form){
        let indexed_array = {};
        $.map($form.serializeArray(), function(n, i){
            indexed_array[n['name']] = n['value'];
        });
        return indexed_array;
    }

});
    
    