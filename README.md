# Accessibility Sniffer

## More information:
http://walterg2.com
 
## License:
http://www.opensource.org/licenses/mit-license.php

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