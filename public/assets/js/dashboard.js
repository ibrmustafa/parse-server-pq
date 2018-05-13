function Dashboard(){
	
}
var Config = new Config();
Dashboard.init = function() {
	Parse.initialize(Config.PARSE_APP_ID);
  Parse.serverURL = Config.PARSE_SERVER_URL;
	var currentUser = Parse.User.current();
  if (currentUser) {
      console.log(JSON.stringify(currentUser))
      $("#usernameLabel").text(currentUser.get("username"));
  } else {
     window.location.href = "/";
  }
	$('#logoutLink').click(Dashboard.clickLogoutLink);
}

Dashboard.clickLogoutLink = function(){
    Parse.User.logOut().then(() => {
       var currentUser = Parse.User.current();  // this will now be null
       console.log(currentUser);
       window.location.href = "/";
    });
}