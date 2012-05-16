

//
//Online Users
//
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   			
  localStorage.file = "http://mcrafters.tk/online_users_dev.json";
  localStorage.isInitialized = true; 

}
var onlineUsers = new OnlineUsers();
onlineUsers.checkNotification();
setInterval(function() {
	onlineUsers.checkNotification()
}, 20000);

