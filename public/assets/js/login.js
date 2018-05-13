function Login(){
	
}
var Config = new Config();
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

    user.signUp(null, {
        success: function(user) {
    // Hooray! Let them use the app now.
        console.log("user successfully signed in" + user.id); 
        setTimeout(function() { 
            swal("", "User Added Successfully. Please login to continue!", "success");
        }, 300);      
       
        $("#signUpDiv").hide();
		$("#loginDiv").show();
       },
       error: function(user, error) {
    // Show the error message somewhere and let the user try again.
       console.log("Error: " + error.code + " " + error.message);
       swal("", error.message, "error");
       
       }
    });
}

Login.signIn = function() {
	window.location.href = "../User/Login";
}

Login.clickSignInButton = function(){    
    var email = $("#signInEmail").val();
	var password = $("#signInPassword").val();
    Parse.User.logIn(email, password, {
      success: function(user) {
         window.location.href = "/dashboard";
      },
      error: function(user, error) {
        console.log("Error: " + error.code + " " + error.message);
        swal("", error.message, "error");
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


