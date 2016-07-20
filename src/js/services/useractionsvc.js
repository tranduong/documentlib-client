'use strict';
angular
    .module('SDLMSys')
    .factory('UserActSvc', ['$http', '$localStorage', 'DEPLOYED_HOST', UserActSvc]);
	
function UserActSvc($http, $localStorage, DEPLOYED_HOST){
	var baseUrl = DEPLOYED_HOST.URL; 
	return {
		interactDocument: function(data, success, error) {
			$http.post(baseUrl + '/userInteractDocument', data).success(success).error(error);
		}		
	};
}