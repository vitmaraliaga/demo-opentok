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
    
    $("#aIniciarSession").on("click", function(){
        let session_name = $("#nombreSession").val();
        // console.log(session_name);
        if(session_name != ""){
            
            let data = {
                session_name: session_name
            }
            
            $.get(SAMPLE_SERVER_BASE_URL + "/session", function(res){
                
                CONFIG.apiKey=res.api_key;
                CONFIG.sessionId=res.session_id;
                // CONFIG.token=res.token;
    
                initializeSession();
            });

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
});
    
    