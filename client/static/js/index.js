


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
    window.location.href = "./templates/session.html"
});

$(".tabs ul").on("click", "li", function(){
    var ContentId = $(this).data("content-id");
    console.log("Orcuh")
    console.log(ContentId)
    
    $(".content-tabs>.content-tab").removeClass("is-active");
    $("#" + ContentId).addClass("is-active");

})