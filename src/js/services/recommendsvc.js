'use strict';
angular
    .module('SDLMSys')
    .factory('RecommendSvc', ['$http', '$localStorage', 'DEPLOYED_HOST', RecommendSvc]);
	
function RecommendSvc($http, $localStorage, DEPLOYED_HOST)
{	
	var baseUrl = DEPLOYED_HOST.URL; 
	return {
		recommendList: function(originalList, wowSky, success, error) // if wowSky : false - without skyline, wowSky: true - with skyline
		{
			var data = {};
			data.originList = originalList;
			data.wowSky = wowSky;
			$http.post(baseUrl + '/recommendTopN', data).success(success).error(error);
		}
	};
}