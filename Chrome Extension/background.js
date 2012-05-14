Array.prototype.diff = function(a) {
    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
};

//
//Online Users
//
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   			
  localStorage.file = "http://mcrafters.tk/online_users_dev.json";
  localStorage.isInitialized = true; 

}
checkNoti();
setInterval(function() {
	checkNoti()
}, 20000);

var onlineUsers = [];
function checkNoti() {
	if(JSON.parse(localStorage.isActivated)) {
		var json = localStorage.file;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", json, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				// JSON.parse does not evaluate the attacker's scripts.
				var data = JSON.parse(xhr.responseText);
				if (window.webkitNotifications) {
					var diff = data.online_users.diff(onlineUsers)
					onlineUsers = data.online_users.sort();		
					if(diff.length > 0) {
						if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
							var noti = window.webkitNotifications.createNotification('icon.png', 'New user online', diff.toString());
							noti.show();
							onlineUsers = data.online_users.sort();							
						} else {
							window.webkitNotifications.requestPermission();
						}
					}
				}
			}
		}
		xhr.send();
	}
	
	
}