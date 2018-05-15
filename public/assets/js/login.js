function Login(){
	
}

Login.init = function() {
	$("#signUpDiv").hide();
	$("#newSignUp").click(function() {		    
			console.log("clicked");
			$("#loginDiv").hide();
			$("#signUpDiv").show();
	});
	$("#newLogin").click(function() {				
			$("#signUpDiv").hide();
			$("#loginDiv").show();
	});

	$('#signInButton').click(Login.clickSignInButton);
    $('#signUpButton').click(Login.clickSignUpButton);
    $('#forgotPasswordLink').click(Login.clickForgotPasswordLink);

	//initialize parse
	Parse.initialize(Config.PARSE_APP_ID);
    Parse.serverURL = Config.PARSE_SERVER_URL;
	
	$('#signInForm').validator();
	$('#signUpForm').validator();
	
	$("#loader").css("display","none");
	$("#signUpLoader").css("display","none");
	
}

Login.clickSignUpButton = function(){
	var email = $("#signUpEmail").val();
	var phone = $("#signUpPhone").val();
	var password = $("#signUpPassword").val();

    var user = new Parse.User();
    user.set("username", email);
    user.set("password", password);
    user.set("email", email);

    // other fields can be set just like with Parse.Object
    user.set("phone", phone);
	$("#signUpLoader").css("display","block");

    user.signUp(null, {
        success: function(user) {
    
        console.log("user successfully signed in" + user.id); 
		$("#signUpMessage").text("User created successfully.Please Sign In to continue.");
		$("#signUpLoader").css("display","none");
        setTimeout(function() { 
             $("#signUpDiv").hide();
		     $("#loginDiv").show();
        }, 2000);      
       
       
       },
       error: function(user, error) {
       $("#signUpLoader").css("display","none");
       console.log("Error: " + error.code + " " + error.message);
       $("#signUpMessage").text(error.message);
       
       }
    });
}

Login.signIn = function() {
	window.location.href = "../User/Login";
}

Login.clickSignInButton = function(){    
    var email = $("#signInEmail").val();
	var password = $("#signInPassword").val();
	$("#loader").css("display","block");
    Parse.User.logIn(email, password, {
      success: function(user) {
		 $("#loader").css("display","none");
         window.location.href = "/dashboard";
		 
      },
      error: function(user, error) {
		$("#loader").css("display","none");
		$("#signInMessage").text(error.message);
        console.log("Error: " + error.code + " " + error.message);
        //swal("", error.message, "error");
      }
    });
	
	
}

Login.clickForgotPasswordLink = function(){    
    var email = $("#signUpEmail").val();
	Parse.User.requestPasswordReset(email, {
       success: function() {
        alert("success");
       },
        error: function(error) {
    // Show the error message somewhere
        alert("Error: " + error.code + " " + error.message);
       }
   });
	
	
}


