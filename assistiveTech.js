/**
 * Usage:
 *	var variable = assistiveTech({
 *		flashLocale: "flash/assistiveTech.swf",
 *		callBack: "variable",
 *		cookieName: "assistiveTech",
 *		debug: "false",
 *		flashVersion: "9",
 *		replacementDiv: "assistiveTech",
 *		writeAnalytics: function(enabledFlag) { alert("Some Analytic data goes here"); }
 *	});
 */
/*globals SWFObject deconcept escape getCookie window*/
( function() {
	var assistiveTech = window.assistiveTech = function(options) {
		return new assistiveTechConstructor(options);
	}

	function assistiveTechConstructor(options) {
		if(options.length <= 1) {
		 this.initialize(options[0]);
		}

		return this;
	}

	assistiveTechConstructor.prototype = {
		version: "1.0",
		// default options
		// swfobject could be pulled in better :-/
		// using test options to verify they're overwriting
		options: {
			callBack: "this-variable",				// string callback variable
			cookieName: "assistiveTech",			// string cookie name
			debug: "false",							// boolean debug
			divID: "some-div",						// string
			flashLocale: "flash/test.swf", 			// string flash to be embedded
			flashVersion: "9",						// int as string flash version req.
			success: null,							// null
			techAssist: false,						// boolean 
			version: null,							// overwritten with swfobject
			writeAnalytics: null					// function call for analytics
		},

		// Initialization code
		initialize: function(options) {
			this.so = this.options.so;
			this.success = this.options.success;
			this.version = this.options.version;

			if (this.typeOf(options) === 'object') {
				for (var key in (options || {})) {
					this.options[key] = options[key];
				}
			}
			
			if (!this.cookieExists()) {
				this.generateFlash();
			}
		},

		//SWFObject 2.2 (due to need for callback function)
		generateFlash: function() {
			this.flashVars = {callback:this.options.callBack + ".flashSuccess"};
			this.flashParams = {quality:"low",allowScriptAccess:"all"};

			// Try and write out the SWFObject
			swfobject.embedSWF(this.options.flashLocale, this.options.divID, 1, 1, this.options.flashVersion,false,this.flashVars,this.flashParams,false,null);
			if (document.getElementById(this.options.divID).type.indexOf("application/x-shockwave-flash") !== -1) {
				//this.flashGenerateSuccess();
				document.getElementById(this.options.divID).focus();
			}
			else {
				this.flashFailure();
			}
		},

		/**
		 * Successfully embedded. Now give the Flash movie focus
		 * or else it will be ignored by the screen reader and not
		 * get an update on isActive.
		 */
		flashGenerateSuccess: function() {
			document.getElementById(this.options.divID).focus();
			if (this.options.debug) {
				// Need to figure out what we want to do if debug is
				// turned on and the flash piece succeeds
			}
		},

		typeOf: function(value) {
			var s = typeof value;
			if (s === 'object') {
				if (value) {
					if (typeof value.length === 'number' &&
							!(value.propertyIsEnumerable('length')) &&
							typeof value.splice === 'function') {
						s = 'array';
					}
				} else {
					s = 'null';
				}
			}
			return s;
		},

		getCookie: function() {
			var cookies = document.cookie.split(';'),
			i = 0,
			cookieData,
			cookieName;
			for ( ; i < cookies.length; i = i + 1) {
				cookieData = cookieName = null;
				cookieData = cookies[i].split('=');
				cookieName = cookieData[0].replace(/^\s+|\s+$/g, '');
				if (cookieName === this.options.cookieName) {
					return cookieData;
				}
			}
			return false;
		},

		/**
		 *
		 * return true/false if cookie exists
		 */
		cookieExists: function() {
			var cookieInformation = this.getCookie(),
			existsFlag = false;
			if (this.options.debug === "true") {
				existsFlag = false;
			} else if (cookieInformation && cookieInformation.length > 1) {
				existsFlag = true;
			}
			return existsFlag;
		},

		setCookie: function() {
			var nextMonth = expiresDate = new Date();
			nextMonth.setSeconds(0);
			nextMonth.setMinutes(0);
			nextMonth.setHours(0);
			nextMonth.setMonth(nextMonth.getMonth() + 1);
			nextMonth.setDate(1);
			expiresDate = new Date(nextMonth);
			document.cookie = this.options.cookieName + "=" +
					escape(this.options.techAssist) + "; expires=" +
					expiresDate.toGMTString() + "; path=/";
		},

		getCookieValue: function() {
			var cookieInformation = this.getCookie();
			return cookieInformation[1];
		},

		flashSuccess: function(accessibilityFlag) {
			this.options.techAssist = (this.options.debug && this.options.debugFlag === "on") ? true
					: ((this.options.debug && this.options.debugFlag === "off") ? false
							: accessibilityFlag);
			this.setCookie();
			var ATEnabled = this.options.techAssist ? 'Yes' : 'No';
			if (this.typeOf(this.options.writeAnalytics) === "function") {
				this.options.writeAnalytics(ATEnabled);
			}
		},

		/**
		 * Embedding the Flash application failed.
		 * Display the version message in the assistiveTech div only
		 * if we've been asked to do so.
		 */
		flashFailure: function() {
			if (this.options.debug === "true") {
				this.version = swfobject.getFlashPlayerVersion();
				if (this.version && (document.getElementById && (this.version.major > 0))) {
					document.getElementById(this.options.replacementDiv).innerHTML = "<p>This sample requires Flash Player version " +
						this.options.flashVersion + ". You have Flash player " +
						this.version.major + "." + this.version.minor + "." + this.version.rev +
						" installed. <a href='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash'>" +
						" Download the latest Flash Player</a> to run the sample.</p>";
				}
			}

		}
	};
})();

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

//Public Methods
	getVersion = function() {
		return version;
	},

	setCallback = function(callBack) {
		callBack = this.callBack;
	},
	
	getCookieName = function() {
		return cookieName;
	},
	
	init = function(options) {
		if (this.typeOf(options) === 'object') {
			for (var key in (options || {})) {
				this.options[key] = options[key];
			}
		}
		
		// Test to see if SWFObject is loaded and if not, load it dynamically from Google APIs
		//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js
		
		if (!this.cookieExists() && !(typeof swfobject.embedSWF === "function") {
			this.loadSwfObject();
		} else if (!this.cookieExists()) {
			this.generateFlash();
		}
	},
	
// Private Methods
//SWFObject 2.2 (due to need for callback function)
	loadSwfObject = function() {
		var body = document.getElementsByTagName("body")[0],
			script = document.createElement("script");
		
		script.type = "text/javascript";
		script.src = "//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js";
		script.onload = this.generateFlash;
		script.onreadystatechange = function () {
			if (this.readyState === "complete") {
				this.generateFlash();
			}
		};
		
		body.appendChild(script);
	},
	
	generateFlash = function() {
		this.flashVars = {callback:this.options.callBack + ".flashSuccess"};
		this.flashParams = {quality:"low",allowScriptAccess:"all"};
		
		// Write out the SWFObject
		swfobject.embedSWF(this.options.flashLocale, this.options.divID, 1, 1, this.options.flashVersion, false, this.flashVars, this.flashParams, false, this.checkFlashInclusion());
	},
	
	checkFlashInclusion = function() {
		if (document.getElementById(this.options.divID).type.indexOf("application/x-shockwave-flash") !== -1) {
			document.getElementById(this.options.divID).focus();
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
	flashFailure = function() {
		if (this.options.debug === "true") {
			this.version = swfobject.getFlashPlayerVersion();
			if (this.version && (document.getElementById && (this.version.major > 0))) {
				document.getElementById(this.options.replacementDiv).innerHTML = "<p>This sample requires Flash Player version " +
					this.options.flashVersion + ". You have Flash player " +
					this.version.major + "." + this.version.minor + "." + this.version.rev +
					" installed. <a href='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash'>" +
					" Download the latest Flash Player</a> to run the sample.</p>";
			}
		}
	},
	
	typeOf = function(value) {
		var s = typeof value;
		if (s === 'object') {
			if (value) {
				if (typeof value.length === 'number' &&
						!(value.propertyIsEnumerable('length')) &&
						typeof value.splice === 'function') {
					s = 'array';
				}
			} else {
				s = 'null';
			}
		}
		return s;
	},
	
	setDebug = function(debug) {
		debug = this.debug;
	};
	
	return {
		init: init,
		getVersion: getVersion,
		getCookieName: getCookieName,
		setCallBack: setCallBack;
	}
	
})();