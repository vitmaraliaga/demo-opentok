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
                    
                    localStorage.setItem("datosSession", JSON.stringify(data));
                },
                error: function(err){
                    console.log(err);
                    console.log("Create error");
                }
            });
        }
    });
});
    
    