/**
 * Usage:
 *	var variable = assistiveTech({
 *		flashLocale: "flash/assistiveTech.swf",
 *		callBack: "variable",
 *		cookieName: "assistiveTech",
 *		debug: "false",
 *		flashVersion: "9",
 *		replacementDiv: "assistiveTech",
 *		writeAnalytics = function (enabledFlag) { alert("Some Analytic data goes here"); }
 *	});
 */
var assistiveTech = (function () {
	var options = {
		version = 0.1,
		callBack,
		cookieName = "assistiveTech",
		debug = false,
		divId,
		flashLocale = "/flash/assistiveTech.swf",
		flashVersion = "9",
		success,
		techAssist = false,
		writeAnalytics
	},
		self = this,

//Public Methods
	getVersion = function () {
		return version;
	},

	getCookieName = function () {
		return cookieName;
	},
	
	getCookieValue = function () {
		var cookieInformation = self.getCookie();
		return cookieInformation[1];
	},

	setCallback = function (cB) {
		self.callBack = cB;
	},
	
	setWriteAnalytics = function (anonymousFunction) {
		self.writeAnalytics = anonymousFunction;
	},
	
	setDebug = function (value) {
		self.debug = value;
	},

	init = function (options) {
		if (self.typeOf(options) === 'object') {
			for (var key in (options || {})) {
				self.options[key] = options[key];
			}
		}
		
		// Test to see if SWFObject is loaded and if not, load it dynamically from Google APIs
		//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js
		
		if (!self.cookieExists() && !(typeof swfobject.embedSWF === "function") {
			self.loadSwfObject();
		} else if (!self.cookieExists()) {
			self.generateFlash();
		}
	},
	
// Private Methods
	loadSwfObject = function () {
		var that = this,
			body = document.getElementsByTagName("body")[0],
			script = document.createElement("script");
		
		script.type = "text/javascript";
		script.src = "//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js";
		// Mozilla, Safari, Opera, etc
		script.onload = that.generateFlash;
		// IE
		script.onreadystatechange = function () {
			if (this.readyState === "complete") {
				self.generateFlash();
			}
		};
		
		body.appendChild(script);
	},
	
	generateFlash = function () {
		var that = this;
		that.flashVars = {callback:self.options.callBack + ".flashSuccess"};
		that.flashParams = {quality:"low",allowScriptAccess:"all"};
		
		// Write out the SWFObject
		swfobject.embedSWF(self.options.flashLocale, self.options.divID, 1, 1, self.options.flashVersion, false, that.flashVars, that.flashParams, false, self.checkFlashInclusion());
	},
	
	checkFlashInclusion = function () {
		if (document.getElementById(self.options.divID).type.indexOf("application/x-shockwave-flash") !== -1) {
			document.getElementById(self.options.divID).focus();
		}
		else {
			this.flashFailure();
		}
	},
	
	/**
	 * Embedding the Flash application failed.
	 * Display the version message in the assistiveTech div only
	 * if we've been asked to do so.
	 */
	flashFailure = function () {
		var that = this,
			flashVersion = swfobject.getFlashPlayerVersion();
		if (self.options.debug === "true") {
			if (flashVersion && (document.getElementById && (flashVersion.major > 0))) {
				document.getElementById(self.options.replacementDiv).innerHTML = "<p>This sample requires Flash Player version " +
					self.options.flashVersion + ". You have Flash player " +
					flashVersion.major + "." + flashVersion.minor + "." + flashVersion.rev +
					" installed. <a href='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash'>" +
					" Download the latest Flash Player</a> to run the sample.</p>";
			}
		}
	},
	
	typeOf = function (value) {
		var s = 'null';
		if (value) {
			if (typeof value === 'object' && typeof value.length === 'number' &&
				!(value.propertyIsEnumerable('length')) &&
				typeof value.splice === 'function') {
				s = 'array';
			}
		}
		return s;
	},
	
	getCookie = function () {
		var cookies = document.cookie.split(';'),
			i = 0,
			cookieData,
			cookieName;
		for ( ; i < cookies.length; i = i + 1) {
			cookieData = cookieName = null;
			cookieData = cookies[i].split('=');
			cookieName = cookieData[0].replace(/^\s+|\s+$/g, '');
			if (cookieName === self.options.cookieName) {
				return cookieData;
			}
		}
		return false;
	},

	/**
	 *
	 * return true/false if cookie exists
	 */
	cookieExists = function () {
		var cookieInformation = self.getCookie(),
			existsFlag = false;
		if (self.options.debug === "true") {
			existsFlag = false;
		} else if (cookieInformation && cookieInformation.length > 1) {
			existsFlag = true;
		}
		return existsFlag;
	},

	setCookie = function () {
		var nextMonth = expiresDate = new Date();
		nextMonth.setSeconds(0);
		nextMonth.setMinutes(0);
		nextMonth.setHours(0);
		nextMonth.setMonth(nextMonth.getMonth() + 1);
		nextMonth.setDate(1);
		expiresDate = new Date(nextMonth);
		document.cookie = self.options.cookieName + "=" +
				escape(self.options.techAssist) + "; expires=" +
				expiresDate.toGMTString() + "; path=/";
	};

	return {
		init: init,
		getCookieName: getCookieName,
		getCookieValue: getCookieValue,
		getVersion: getVersion,
		setCallBack: setCallBack,
		setWriteAnalytics: setWriteAnalytics,
		setDebug: setDebug;
	}
	
}());