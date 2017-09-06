


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
    let nombreSession = $("#nombreSession").val();
    console.log(nombreSession);
    if(nombreSession != ""){
        localStorage.setItem("nombre_session", nombreSession);
        window.location.href = "./templates/session.html"
    }
});

