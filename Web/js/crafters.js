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
	var onlineUsers = new OnlineUsers();
	onlineUsers.appendOnlineUser();
	setInterval(function() {
		onlineUsers.appendOnlineUser();
	}, 20000);
});

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


