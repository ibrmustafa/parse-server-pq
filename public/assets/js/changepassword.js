function ChangePassword(){
	
}

ChangePassword.init = function() {
	$('#changePasswordForm').validator();
  $("#changePasswordLoader").css("display","none");

  $("#currentPassword").unbind('change');
  $("#currentPassword").change(ChangePassword.onCompleteCurrentPassword);

  $('#changePasswordButton').click(ChangePassword.clickChangePasswordButton);
}

ChangePassword.onCompleteCurrentPassword = function(){
  var currentUser = Parse.User.current();
  var email = currentUser.get('email');
  var password = $("#currentPassword").val();
  $("#changePasswordLoader").css("display","block");
  Parse.User.logIn(email, password, {
      success: function(user) {
         $("#changePasswordLoader").css("display","none");
         console.log(JSON.stringify(user));
         $("#changePasswordMessage").text("");  

      },
      error: function(user, error) {
         $("#changePasswordLoader").css("display","none");
         console.log("Error: " + error.code + " " + error.message);
         if(error.code == 101){
            $("#changePasswordMessage").text("Your current password is not matched");  
         }
               

      }
    });
}

ChangePassword.clickChangePasswordButton = function(){
  var currentUser = Parse.User.current();
  var email = currentUser.get('email');
  var password = $("#currentPassword").val();
  $("#changePasswordLoader").css("display","block");
  var currentPasswordVerified = false;
  Parse.User.logIn(email, password, {
      success: function(user) {
         $("#changePasswordLoader").css("display","none");
         console.log(JSON.stringify(user));
         $("#changePasswordMessage").text("");  
         currentPasswordVerified = true;

      },
      error: function(user, error) {
         $("#changePasswordMessage").css("color", "red");
         $("#changePasswordLoader").css("display","none");
         console.log("Error: " + error.code + " " + error.message);
         if(error.code == 101){
            $("#changePasswordMessage").text("Your current password is not matched");  
         }
               

      }
    });

    var newPassword = $("#newPassword").val();
    var repeatPassword = $("#repeatPassword").val();

    var errors = $('#changePasswordForm').validator('validate').has('.has-error').length;

    if(errors === 0){
      if((newPassword == repeatPassword) && currentPasswordVerified){
      currentUser.set('password',newPassword);
      currentUser.save(null,{success:function(obj){
               console.log(JSON.stringify(obj));
              $("#changePasswordMessage").css("color", "green");
              $("#changePasswordMessage").text("Password Changed Successfully."); 
         },error:function(obj,err){
              console.log(JSON.stringify(err));
              $("#changePasswordMessage").css("color", "red");
              $("#changePasswordMessage").text("Error changing password."); 
         }
    });
    }else{
        $("#changePasswordMessage").css("color", "red");
        $("#changePasswordMessage").text("Please enter required details."); 
    }
    }

    
    
}


