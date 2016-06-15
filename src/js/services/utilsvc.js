'use strict';
angular
    .module('SDLMSys')
    .factory('Utils', [Utils]);
	
function Utils(){	
	function convertStringToUintArray(string) {
		var string = btoa(unescape(encodeURIComponent(string))),
			charList = string.split(''),
			uintArray = [];
		for (var i = 0; i < charList.length; i++) {
			uintArray.push(charList[i].charCodeAt(0));
		}
		return new Uint8Array(uintArray);
	}

	function convertUintArrayToString(uintArray) {
		var encodedString = String.fromCharCode.apply(null, uintArray),
			decodedString = decodeURIComponent(escape(atob(encodedString)));
		return decodedString;
	}	
	
	return {
		convertStringToBinary: function(data, responseBack) {
			var ret = convertStringToUintArray(data);
			if (typeof responseBack === "function")
			{
				responseBack(ret);
			}
		},
		convertBinaryToString: function(data, responseBack) {
			var ret = convertUintArrayToString(data);
			if (typeof responseBack === "function")
			{
				responseBack(ret);
			}
		}
    };
}