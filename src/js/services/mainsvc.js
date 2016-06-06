'use strict';
angular
    .module('SDLMSys')
	.constant("DEPLOYED_HOST", {"URL": "http://localhost:3001"}) // Change when you have a new 
	.constant("DOCUMENT_SEARCH", {"URL": "http://localhost:9200/documentlib/Document/_search?q="})
	.constant("PAGINATION", {"ITEMS_PER_PAGE": 10})
    .factory('MainSvc', ['$http', '$localStorage', 'DEPLOYED_HOST', MainSvc]);
	
function MainSvc($http, $localStorage, DEPLOYED_HOST){
	var baseUrl = DEPLOYED_HOST.URL; 
	
	function changeUser(user) {
		angular.extend(currentUser, user);
	}
	
	function urlBase64Decode(str) {		
		var output = '';
		if ( str )
		{
			str.replace('-', '+');
			output = output.replace('_', '/');
			switch (output.length % 4) {
				case 0:
					break;
				case 2:
					output += '==';
					break;
				case 3:
					output += '=';
					break;
				default:
					throw 'Illegal base64url string!';
			}
		}
		else
		{
			console.log("The token string is empty! A Guest User!");
		}
		return window.atob(output);
	}

	function getUserFromToken() {
		var token = $localStorage.token;
		var user = {};
		if (typeof token !== 'undefined') {
			//console.log('token: ' + token);
			var encoded = token.split('.')[1];
			var strToken = urlBase64Decode(encoded)
			if (strToken)
			{
				user = JSON.parse(strToken);
			}
		}
		return user;
	}

	var currentUser = getUserFromToken();

	return {
		save: function(data, success, error) {
			$http.post(baseUrl + '/signup', data).success(success).error(error);
		},
		login: function(data, success, error) {
			$http.post(baseUrl + '/authen', data).success(success).error(error);
		},
		me: function(success, error) {
			$http.get(baseUrl + '/me').success(success).error(error);
		},
		logout: function(success) {
			console.log("Logout has been called");
			changeUser({});
			delete $localStorage.token;
			success();
		}
	};
}