//Helpers


//
//Online Users
//
$(document).ready(function () {
	var onlineUsers = new OnlineUsers();
	onlineUsers.appendOnlineUsers();
	setInterval(function() {
		onlineUsers.appendOnlineUsers();
	}, 20000);
});

