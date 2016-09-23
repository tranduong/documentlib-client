'use strict';
angular
    .module('SDLMSys')
    .factory('CategorySvc', ['$http', '$localStorage', 'DEPLOYED_HOST', CategorySvc]);
	
function CategorySvc($http, $localStorage, DEPLOYED_HOST){
	var baseUrl = DEPLOYED_HOST.URL; 
	return {
		getCategories: function(success, error) {
			console.log("getCategories");
			$http.get(baseUrl + '/getDocumentCategories').success(success).error(error);
		}
	};
}