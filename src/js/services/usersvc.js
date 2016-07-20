'use strict';
angular
    .module('SDLMSys')
    .factory('UserSvc', ['$http', '$localStorage', 'DEPLOYED_HOST', UserSvc]);
	
function UserSvc($http, $localStorage, DEPLOYED_HOST){
	var baseUrl = DEPLOYED_HOST.URL; 
	return {
		getMyFriendList: function(success, error) {
			$http.get(baseUrl + '/myfriends').success(success).error(error);
		}
	};
}