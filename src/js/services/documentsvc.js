'use strict';
angular
    .module('SDLMSys')
    .factory('DocumentSvc', ['$http', '$localStorage', 'DEPLOYED_HOST', DocumentSvc]);
	
function DocumentSvc($http, $localStorage, DEPLOYED_HOST){
	var baseUrl = DEPLOYED_HOST.URL; 
	return {
		getMines: function(success, error) {
			$http.get(baseUrl + '/mydocs').success(success).error(error);
		},
		updateInfo: function(data, success, error) {
			$http.post(baseUrl + '/document', data).success(success).error(error);
		},
		removeDoc: function(data, success, error){
			$http.post(baseUrl + '/deletedocument', data).success(success).error(error);
		},
		getDoc: function(data, success, error) {
			$http.get(baseUrl + '/' + data, {responseType : 'arraybuffer'}).success(success).error(error);
		},
		getDocPath: function(relative_path) {
			return baseUrl + '/' + relative_path;
		}
	};
}