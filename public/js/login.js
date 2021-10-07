$(document).ready(function () {
    // hide some elements
    $("#server-error-box").hide();
    $("#spinner-sign").hide();
    $("#email-error").hide();
    $("#password-error").hide();


    $("#login-form").submit(function (e) { 
        e.preventDefault();
        // start validation 
        $("#email-error").hide();
        $("#password-error").hide();

        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var email = $("#email").val();
        var password = $("#password").val();
        var validationError = false;
        
        // validate email
        if(!regexEmail.test(email)){
            validationError = true;
            $("#email-error").show();
        }else{
            validationError = false;
            $("#email-error").hide();
        }
        
        // validate password
        if(password.length<=0){
            validationError = true;
            $("#password-error").show();
        }else{
            validationError = false;
            $("#password-error").hide();
        }

        // on successful validation 
        if(!validationError){
           $("#spinner-sign").show();
           $("#btn-login").hide();
           
           $("#server-error-box").hide();
          // call api
          $.ajax({
              type: "POST",
              url: "/api/user/login",
              data:{email:email,password:password},
              success: function (response) {
                $("#server-error-box").hide();
                $("#btn-login").show();
                $("#spinner-sign").hide();

                //navigate to home screen 
                let id = response.data.id
                let name = response.data.name
                let refreshToken = response.data.refreshToken
                let userType = response.data.userType
                
                localStorage.setItem("id",id)
                localStorage.setItem("name",name)
                localStorage.setItem("refreshToken",refreshToken)
                localStorage.setItem("userType",userType)
                window.location.href ="/"; 
              },
              error:function (error) {
                $("#btn-login").show();
                $("#spinner-sign").hide();
                let response = error.responseJSON;
                $("#server-error-box").show();
                $("#server-error").text(response.message);
              },
              
          });

        }
        

    });

   
});



