/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

 function Helper() {
	if(this.isExtension()) 
		this.getJSON = getJSONExtension;
	else
		this.getJSON = $.getJSON;
}

Helper.prototype.isExtension = function() {
	return typeof(chrome) != 'undefined' && typeof(chrome.extension) != 'undefined';
}
//Parameter
Helper.prototype.httpGetVars;
Helper.prototype.getParameters = function() {
	this.httpGetVars = new Array();
	strGET=document.location.search.substr(1,document.location.search.length);
	if(strGET!='')
    {
		gArr=strGET.split('&');
		for(i=0;i<gArr.length;++i)
		{
			v='';vArr=gArr[i].split('=');
			if(vArr.length>1){v=vArr[1];}
			this.httpGetVars[unescape(vArr[0])]=unescape(v);
        }
    }

}
Helper.prototype.getParameter = function(v) {
	if(typeof(this.httpGetVars) == 'undefined') {
		this.getParameters();
	}
	if(!this.httpGetVars[v]){return 'undefined';}
	return this.httpGetVars[v];

 }
 
 Helper.prototype.isParameter = function(v) {
 	if(typeof(this.httpGetVars) == 'undefined') {
		this.getParameters();
	}
	if(v in this.httpGetVars){return true;}
	return false;
 
 }

//Array diff
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
};

var Helper = new Helper();


function getJSONExtension(json, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", json, true);
	xhr.onreadystatechange =  function() {
		if (xhr.readyState == 4) {
			// JSON.parse does not evaluate the attacker's scripts.
			var data = JSON.parse(xhr.responseText);
			callback(data);
		}
	}
	xhr.send();
}

 
 function OnlineUsers(json) {
	this.onlineUsers = new Array();
	this.getPlayerUrl = getPlayerUrl;
	this.appendOnlineUsers = appendOnlineUsers;
	this.appendOnlineUser = appendOnlineUser;
	this.checkNotification = checkNotification;
	
	if(this.extension) {
		if(typeof(json) == 'undefined')
			this.json = localStorage.file;
		this.getJSON = getJSONExtension;
	}
	else {
		if(typeof(json) == 'undefined')
			if(!Helper.isParameter('dev'))
				this.json = 'online_users.json';
			else
				this.json = 'online_users_dev.json';
		this.getJSON = $.getJSON;
	}
}

function getPlayerUrl(player) {
	return 'http://www.minecraft.net/skin/' + player + '.png';
}

function appendOnlineUser(player, element) {
	var ele
	if(typeof(element) == 'undefined')
		ele = '#online_users'
	else
		ele = element;
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
		).appendTo(ele);
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
			.appendTo(ele);
	}	
}

function appendOnlineUsers(element) {
	var ele
	if(typeof(element) == 'undefined')
		ele = '#online_users'
	else
		ele = element;
	var $this = this;
	Helper.getJSON(this.json, function(data) {
		$this.onlineUsers = data.online_users.sort();
		$(ele).empty();
		if ($this.onlineUsers.length < 1)
			$("<li />")
				.addClass("none")
				.text("no users online")
				.appendTo(ele);
		else
			for (var i = 0; i < $this.onlineUsers.length; i++)
				$this.appendOnlineUser($this.onlineUsers[i], element);
	
	});
}

function checkNotification() {
	if(JSON.parse(localStorage.isActivated)) {
		Helper.getJSON(this.json, function(data) {
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

 
;(function ( $, window, document, undefined ) {

    var pluginName = 'onlineUsers',
        defaults = {
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

      
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }
	
	Plugin.prototype.onlineUsers;
    Plugin.prototype.init = function () {
        this.onlineUsers = new OnlineUsers();
		this.onlineUsers.appendOnlineUsers(this.element);
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );