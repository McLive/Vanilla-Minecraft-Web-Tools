//Helpers


//
//Online Users
//
$(document).ready(function () {
		append_online_user();
		setInterval("append_online_user()", 20000);
});
var onlineUsers = [];
var notiFirstLoad = true;
function append_online_user() {
	var json = localStorage.file;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", json, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			// JSON.parse does not evaluate the attacker's scripts.
			var data = JSON.parse(xhr.responseText);
			onlineUsers = data.online_users.sort();
			$("#online_users").empty();
			if (onlineUsers.length < 1)
				$("<li />")
				.addClass("none")
				.text("no users online")
				.appendTo("#online_users");
			else
				for (var i = 0; i < onlineUsers.length; i++)
					$('<li />').addClass("user")
					.append($('<span />')
						.append($('<div />')
							.addClass('avatar')
							.css("background-image", "url(\"http://www.minecraft.net/skin/" + onlineUsers[i] + ".png\")"))
						.append($('<span />')
							.addClass('name')
							.append($('<span />')
							//	.attr("href", 'skin/?user=' + onlineUsers[i] + '&fancybox=true')
							//	.addClass('fancybox')
							//	.addClass('fancybox.ajax')
								.text(data.online_users[i])
							//	.fancybox()
							//	.fancybox({
							//		'afterClose': function() {
							//			clearInterval(rotation_loop);
							//		}
							//	})
							)
						))
					.appendTo("#online_users");
			
		}
	}
	xhr.send();

}