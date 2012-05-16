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
