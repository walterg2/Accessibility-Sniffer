# Accessibility Sniffer
A JavaScript/Flash shim to verify whether or not a given user has the need for various accessibility features.

## How it works
By using Flash, a check is made whether or not accessiblity has been enabled on the user's machine. The value is stored on the user's machine until the first of the next month, where the check is made again.

There is also the availability of executing a callback for each successful load of the page. This callback gives you access to the Accessibility flag stored in the cookie.

## More information:
http://walterg2.com

## Examples:
```javascript
assistiveTech.init({
	flashLocale: "flash/assistiveTech.swf",
	cookieName: "assistiveTech",
	debug: "false",
	divId: "assistiveTech",
	flashVersion: "9",
	flashLocale: "/media/assistiveTech.swf",
	success: function () { 
		//some function here
	},
	writeAnalytics: function (enabledFlag) {
		alert("Some Analytic data goes here");
	}
 
});
```

## License:
MIT Version 2 (see LICENSE.txt)