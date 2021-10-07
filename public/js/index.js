$(document).ready(function () {
    $("#logout").click(function (e) { 
        e.preventDefault();
        
        let refreshToken = localStorage.getItem("refreshToken")
        console.log(refreshToken)
        $.ajax({
            type: "DELETE",
            url: "/api/user/logout",
            data:{token:refreshToken},
            success: function (response) {
                localStorage.clear();
                window.location.href = "/login"
            },
            error:function (error){
                console.log(error)
               alert("something went wrong try again")
            },
        });
        
    });
});