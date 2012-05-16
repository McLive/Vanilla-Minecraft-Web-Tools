$(document).ready(function() {
	var online = Helper.getParameter('onlineUsers');
	var onlineUsers = new OnlineUsers();
	var onlineAr = online.split(',');
	for(var i = 0; i < onlineAr.length; i++) {
		onlineUsers.appendOnlineUser(onlineAr[i]);
	
	}

});