//Helpers
HTTP_GET_VARS=new Array();
 $(document).ready(function () {
	strGET=document.location.search.substr(1,document.location.search.length);
	if(strGET!='')
    {
		gArr=strGET.split('&');
		for(i=0;i<gArr.length;++i)
		{
			v='';vArr=gArr[i].split('=');
			if(vArr.length>1){v=vArr[1];}
			HTTP_GET_VARS[unescape(vArr[0])]=unescape(v);
        }
    }
});
function GET(v)
{
if(!HTTP_GET_VARS[v]){return 'undefined';}
return HTTP_GET_VARS[v];
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
};


//
//Notch Rss
//
$(document).ready(function () {
		//get_notch_rss();
		//setInterval("get_notch_rss()", 600000);
});
function get_notch_rss() {
	$('#notch_news').rssfeed('http://notch.tumblr.com/rss', {
			limit : 3,
			header : false,
			titletag : 'span',
			date : false,
			content : false,
			snippet : false,
			showerror : true,
			linktarget : '_blank'
		});
}
//
//MCForum RSS
//
$(document).ready(function () {
                get_mcforum_rss();
                setInterval("get_mcforum_rss()", 600000);
        });
function get_mcforum_rss() {
        $('#mcforum_news').rssfeed('http://www.minecraftforum.net/rss/writ/1-news', {
                          limit : 3,
                          header : false,
                          titletag : 'span',
                          date : false,
                          content : false,
                          snippet : false,
                          showerror : true,
                          linktarget : '_blank'
                });
}
//
//SlideShow
//

$(document).ready(function () {
		$("#slideshow").simpleSlide({json: "slides.json"});
	});


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
	var json = "online_users.json";
	if(GET('dev')=="true") {
		json = "online_users_dev.json";
	}
	$.getJSON(json, function (data) {
			if (window.webkitNotifications) {
				var diff = data.online_users.diff(onlineUsers)
				if(diff.length > 0) {
					if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
						if(!notiFirstLoad) {
							var noti = window.webkitNotifications.createNotification('favicon.ico', 'New user online', diff.toString());
							noti.show();	
						}
						notiFirstLoad = false;
					} else {
						window.webkitNotifications.requestPermission();
					}
				}
			}
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
							.append($('<a />')
								.attr("href", 'skin/?user=' + onlineUsers[i] + '&fancybox=true')
								.addClass('fancybox')
								.addClass('fancybox.ajax')
								.text(data.online_users[i])
								.fancybox()
								.fancybox({
									'afterClose': function() {
										clearInterval(rotation_loop);
									}
								})
							)
						))
					.appendTo("#online_users");
			
		});
}

//
//Update Countdown
//
 $(document).ready(function () {
		doCountdown();
		setInterval("doCountdown()", 60000);
});
function doCountdown() {
    var currentTime = new Date()
	var h = currentTime.getHours();
	var min = currentTime.getMinutes();
	var hLeft = 0;
	var minLeft = 60 - min;
	if(h < 6) {
		var hLeft = 6 - h - 1;
	} else if(h < 12) {
		var hLeft = 12 - h - 1;
	} else if(h < 18) {
		var hLeft = 18 - h - 1;
	} else if(h < 24) {
		var hLeft = 24 - h - 1;
	}
	$('#countdown').text("update in " + hLeft + ":" + minLeft + "h");
}


