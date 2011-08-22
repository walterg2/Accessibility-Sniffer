/*!
 * Accessibility Sniffer
 * Version: 0.1
 *
 * Copyright 2011, George Walters II
 * Licensed under MIT Version 2
 *
 * Date: Fri Aug 19 2011 8:58 AM -0500
 *
 * Usage:
 *	assistiveTech.init({
 *		flashLocale: "flash/assistiveTech.swf",
 *		cookieName: "assistiveTech",
 *		debug: "false",
 *		divId: "assistiveTech",
 *		flashVersion: "9",
 *		flashLocale: "/media/assistiveTech.swf",
 *		success: function () { //some function here },
 *		callBack: function (enabledFlag) { alert("Some Analytic data goes here"); }
 *	});
 */
var assistiveTech = (function () {
	"use strict";
	var self = this,
		appVersion = 0.1,
		cookieName = "assistiveTech",
		defaults = {
			debug: false,
			divId: "assistiveTech",
			flashLocale: "/flash/assistiveTech.swf",
			flashVersion: "9",
			techAssist: false,
			callBack: null
		},

// Private Methods
		getCookie = function () {
			var cookies = document.cookie.split(';'),
				i = 0,
				cookieData,
				myCookieName;
			for (i; i < cookies.length; i = i + 1) {
				cookieData = myCookieName = null;
				cookieData = cookies[i].split('=');
				myCookieName = cookieData[0].replace(/^\s+|\s+$/g, '');
				if (myCookieName === cookieName) {
					return cookieData;
				}
			}
			return false;
		},

		setCookie = function () {
			var nextMonth = new Date(), expiresDate;
			nextMonth.setSeconds(0);
			nextMonth.setMinutes(0);
			nextMonth.setHours(0);
			nextMonth.setMonth(nextMonth.getMonth() + 1);
			nextMonth.setDate(1);
			expiresDate = new Date(nextMonth);
			document.cookie = cookieName + "=" +
				escape(defaults.techAssist) + "; expires=" +
				expiresDate.toGMTString() + "; path=/";
		},
		
		translateBoolean = function (bool) {
			return (bool === true) ? 'Yes' : 'No';
		},
		
		executeCallback = function (flag) {
			if (typeof defaults.callBack === "function") {
				defaults.callBack(translateBoolean(flag));
			}
		},

		flashSuccess = function (accessibilityFlag) {
			defaults.techAssist = (defaults.debug === true) ? true : accessibilityFlag;
			setCookie();
			executeCallback(defaults.techAssist);
		},
	
		/**
		 * Embedding the Flash application failed.
		 * Display the version message in the assistiveTech div only
		 * if we've been asked to do so.
		 */
		flashFailure = function () {
			var that = this,
				flashVersion = swfobject.getFlashPlayerVersion();
			if (defaults.debug === "true") {
				if (flashVersion && (document.getElementById && (flashVersion.major > 0))) {
					document.getElementById(defaults.replacementDiv).innerHTML = "<p>This sample requires Flash Player version " +
						defaults.flashVersion + ". You have Flash player " +
						flashVersion.major + "." + flashVersion.minor + "." + flashVersion.rev +
						" installed. <a href='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash'>" +
						" Download the latest Flash Player</a> to run the sample.</p>";
				}
			}
		},

		checkFlashInclusion = function (flag) {
			var flashDiv = document.getElementById(defaults.divId);
			if (flashDiv.type.indexOf("application/x-shockwave-flash") !== -1) {
				flashDiv.focus();
			} else {
				flashFailure();
			}
		},

		generateFlash = function () {
			var flashVars = {callback: "assistiveTech.flashSuccess"},
				flashParams = {quality: "low", allowScriptAccess: "all"};

			// Write out the SWFObject
			swfobject.embedSWF(defaults.flashLocale, defaults.divId, 1, 1, defaults.flashVersion, false, flashVars, flashParams, false, checkFlashInclusion);
		},

		loadSwfObject = function () {
			var that = this,
				body = document.getElementsByTagName("body")[0],
				script = document.createElement("script");

			script.type = "text/javascript";
			script.src = "//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js";
			// Mozilla, Safari, Opera, etc
			script.onload = generateFlash;
			// IE
			script.onreadystatechange = function () {
				if (this.readyState === "complete") {
					generateFlash();
				}
			};

			body.appendChild(script);
		},
	

//Public Methods
		getVersion = function () {
			return appVersion;
		},

		getCookieName = function () {
			return cookieName;
		},

		getCookieValue = function () {
			var cookieInformation = getCookie();
			return cookieInformation[1];
		},

		/**
		 *
		 * return true/false if cookie exists
		 */
		cookieExists = function () {
			var cookieInformation = getCookie(),
				existsFlag = false;
			if (defaults.debug === "true") {
				existsFlag = false;
			} else if (cookieInformation && cookieInformation.length > 1) {
				existsFlag = true;
			}
			return existsFlag;
		},

		init = function (options) {
			var key;
			if (typeof options === 'object') {
				for (key in (options || {})) {
					defaults[key] = options[key];
				}
			}

			// Test to see if SWFObject is loaded and if not, load it dynamically from Google APIs
			//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js

			if (!cookieExists()) {
				if (!window.swfobject) {
					loadSwfObject();
				} else {
					generateFlash();
				}
			} else if (defaults.debug === true) {
				loadSwfObject();
			} else {
				executeCallback(getCookieValue());
			}
		};

	return {
		init: init,
		cookieExists: cookieExists,
		flashSuccess: flashSuccess,
		getCookieName: getCookieName,
		getCookieValue: getCookieValue,
		getVersion: getVersion
	};
}());