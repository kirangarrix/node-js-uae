$(document).ready(function () {
   $("#server-error-box").hide();
   $("#password-error").hide();
   $("#confirm-password-error").hide();
   $("#spinner-sign").hide();
   $("#server-success-box").hide();


   $("#reset-password-form").submit(function (e) { 
       e.preventDefault();
       $("#password-error").hide();
       $("#confirm-password-error").hide();
       
       let password = $("#password").val();
       let confirmPassword = $("#confirm-password").val();
       var validationError = false;
        
       if(password.length <6){
          validationError = true;
          $("#password-error").show();
       }else{
          validationError = false;
          $("#password-error").hide();
       }

       if(password != confirmPassword){
          validationError = true;
          $("#confirm-password-error").show();
        }else{
            validationError = false;
            $("#confirm-password-error").hide();
        }
        
        if(!validationError){
            $("#spinner-sign").show();
            $("#btn-password-reset").hide();
            // get token already received from url query
            $.ajax({
                type: "PUT",
                url: "/api/user/reset-password",
                data:{token:token,password:password},
                success: function (response) {
                  $("#spinner-sign").hide();
                  $("#server-error-box").hide();
                  $("#btn-password-reset").show();
                  $("#server-success-box").show();

                  setTimeout(()=>{
                    window.location.href ="/login"; 
                  },1000)
                
                   
                },
                error:function (error) {
                  $("#spinner-sign").hide();
                  $("#btn-password-reset").show();
                  let response = error.responseJSON;
                  console.log(response)
                  $("#server-error-box").show();
                //   $("#server-error").text(response.message);

                },
                
            });
        }


   });
});