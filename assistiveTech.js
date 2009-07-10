/**
 * Usage:
 *	var variable = assistiveTech({
 *		flashLocale: "flash/assistiveTech.swf",
 *		callBack: "variable",
 *		cookieName: "assistiveTech",
 *		debug: "false",
 *		flashID: "assistiveTechSwf",
 *		flashVersion: "9",
 *		replacementDiv: "assistiveTech",
 *		writeAnalytics: function(enabledFlag) { this.sendAlert("Some Analytic data goes here"); }
 *	});
 */
/*globals SWFObject deconcept escape getCookie window*/
( function() {
	function assistiveTechConstructor(options) {
		/**
		 * Need to pass in Name/Value pairs and associate them with Prototype If
		 * more than one argument is passed, nothing is set. May change later
		 * once a policy for determining what to do with multiple objects is
		 * determined named pairs should include:
		 * cookieName,flashLocale,replacementDiv,debug,callBack
		 */
		if(options.length <= 1) {
		 this.initialize(options[0]);
		}

		return this;
	}

	function assistiveTech() {
		return new assistiveTechConstructor(arguments);
	}

	assistiveTechConstructor.prototype = {
		// default options
		// swfobject could be pulled in better :-/
		// using test options to verify they're overwriting
		options: {
			callBack: "this-variable",				// string callback variable
			cookieName: "assistiveTech",			// string cookie name
			debug: "false",							// boolean debug
			divID: "some-div",						// string
			flashID: null,							// ID to be passed to SWFObject
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

		//SWFObject 1.5
		generateFlash: function() {
			this.so = new SWFObject(this.options.flashLocale,
					this.options.flashID, 1, 1, this.options.flashVersion);
			if (this.so) {
				this.so.addParam("quality", "low");
				this.so.addParam("allowScriptAccess", "all");

				// Pass the success handler's name to the Flash application.
				// Flash will call this handler using ExternalInterface.
				this.so.addVariable("callback", this.options.callBack + ".flashSuccess");

				// Try and write out the SWFObject
				this.success = this.so.write(this.options.divID);

				// If there's a problem in writing the tag, try to give the user more
				// information (probably got the wrong version of the player)
				if (this.success) {
					this.flashGenerateSuccess();
				}
				else {
					// Call the failure callback
					this.flashFailure();
				}
			}
		},
		//SWFObject 2.2 (due to need for callback function)
		generateFlash22: function() {
			this.flashVars = {callback:this.options.callBack + ".flashSuccess"};
			this.flashParams = {quality:"low",allowScriptAccess:"all"};
			this.embedCallback = function(e) {
				// If there's a problem in writing the tag, try to give the user more
				// information (probably got the wrong version of the player)
				if (e.success) {
					this.flashGenerateSuccess();
				}
				else {
					// Call the failure callback
					this.flashFailure();
				}
			};

			// Try and write out the SWFObject
			this.success = swfobject.embedSWF(this.options.flashLocale, this.options.divID, 1, 1, this.options.flashVersion,false,this.flashVars,this.flashParams,false,this.embedCallback);
		},

		/**
		 * Successfully embedded. Now give the Flash movie focus
		 * or else it will be ignored by the screen reader and not
		 * get an update on isActive.
		 */
		flashGenerateSuccess: function() {
			document.getElementById("assistiveTechSwf").focus();
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
			if (this.options.debug) {
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
			if (this.options.debug) {
				this.version = deconcept.SWFObjectUtil.getPlayerVersion();
				if (this.version && (document.getElementById && (this.version.major > 0))) {
					document.getElementById(this.options.replacementDiv).innerHTML = "<p>This sample requires Flash Player version " +
						this.options.flashVersion + ". You have Flash player " +
						this.version.major + "." + this.version.minor + "." + this.version.rev +
						" installed. <a href='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash'>" +
						" Download the latest Flash Player</a> to run the sample.</p>";
				}
			}

			if (this.options.debug === true) {
				this.sendAlert('Something went wrong in Flash, please review.');
			}
		},
		
		sendAlert: function(text) {
			if (window.console && window.console.log) {
				window.console.log(text);
			}
			else {
				alert(text);
			}
		}
	};

	window.assistiveTech = assistiveTech;
})();