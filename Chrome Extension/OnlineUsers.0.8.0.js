function OnlineUsers() {
	this.onlineUsers = new Array();
	this.getPlayerUrl = getPlayerUrl;
	this.appendOnlineUsers = appendOnlineUsers;
	this.appendOnlineUser = appendOnlineUser;
	this.checkNotification = checkNotification;
	
	if(this.extension)
		this.getJSON = getJSONExtension;
	else
		this.getJSON = $.getJSON;
}

function getPlayerUrl(player) {
	return 'http://www.minecraft.net/skin/' + player + '.png';
}

function appendOnlineUser(player) {
	if(Helper.isExtension()) {
		$('<li />').addClass("user")
		.append($('<span />')
			.append($('<div />')
				.addClass('avatar')
				.css("background-image", 'url("' + this.getPlayerUrl(player) + '")'))
					.append($('<span />')
						.addClass('name')
						.append($('<span />')
							.text(player)
						)
					)
		).appendTo("#online_users");
	} else {
		$('<li />').addClass("user")
			.append($('<span />')
				.append($('<div />')
					.addClass('avatar')
					.css("background-image", 'url("' + this.getPlayerUrl(player) + '")'))
				.append($('<span />')
					.addClass('name')
					.append($('<a />')
						.attr("href", 'skin/?user=' + player + '&fancybox=true')
						.addClass('fancybox')
						.addClass('fancybox.ajax')
						.text(player)
						.fancybox()
						.fancybox({
							'afterClose': function() {
								clearInterval(rotation_loop);
							}
						})
					)
				))
			.appendTo("#online_users");
	}	
}

function appendOnlineUsers() {
	var json = localStorage.file;
	Helper.getJSON(json, function(data) {
		this.onlineUsers = data.online_users.sort();
		$("#online_users").empty();
		if (this.onlineUsers.length < 1)
			$("<li />")
				.addClass("none")
				.text("no users online")
				.appendTo("#online_users");
		else
			for (var i = 0; i < this.onlineUsers.length; i++)
				this.appendOnlineUser(this.onlineUsers[i]);
	
	});
}

function checkNotification() {
	if(JSON.parse(localStorage.isActivated)) {
		var json = localStorage.file;
		var $this = this;
		Helper.getJSON(json, function(data) {
			if (window.webkitNotifications) {
							console.log(data);
				var diff = data.online_users.diff($this.onlineUsers)

				$this.onlineUsers = data.online_users.sort();		
				if(diff.length > 0) {
					if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
						var noti = window.webkitNotifications.createHTMLNotification('notification.html?onlineUsers=' + diff);
						noti.show();						
					} else {
						window.webkitNotifications.requestPermission();
					}
				}
			}
		})
	}
}

