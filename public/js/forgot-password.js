$(document).ready(function () {
    $("#email-error").hide();
    $("#div-submit").hide();
    $("#server-error-box").hide();
    $("#server-success-box").hide();

    $("#reset-password-form").submit(function (e) { 
        e.preventDefault();
        
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var email = $("#email").val();
        
        if(!regexEmail.test(email)){
            $("#email-error").show();
        }else{
            // validation success proceed to send mail
            $("#email-error").hide();
            $("#div-submit").show();
            $("#btn-submit").hide();

            $.ajax({
                type: "GET",
                url:"/api/user/"+email+"/send-reset-mail",
                success: function (response) {
                    $("#server-error-box").hide();
                    $("#div-submit").hide();
                    $("#btn-submit").show();
                    $("#server-success-box").show();
                },
                error: function (error) {
                    let response = error.responseJSON
                    
                    $("#server-error-box").show();
                    $("#server-error").text(response.message);
                    $("#div-submit").hide();
                    $("#btn-submit").show();

                },
            });

        }


    });
});