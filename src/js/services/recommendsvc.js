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
			$http.post(baseUrl + '/recommend/recommendTopN', data).success(success).error(error);
		},
		recommendSimple: function(uid, thres, K, success, error) // uid : user id, thres : threshold, K : top K items
		{
			var data = {};
			data.user_id = uid; 	// User u
			data.threshold = thres; 	// Threshold δ, 
			data.K_value = K; 	// number of Recommendations K	
			$http.post(baseUrl + '/recommend/simpleTopN', data).success(success).error(error);
		},
		recommendSocial: function(uid, thres, K, success, error) // uid : user id, thres : threshold, K : top K items
		{
			var data = {};
			data.user_id = uid; 	// User u
			data.threshold = thres; 	// Threshold δ, 
			data.K_value = K; 	// number of Recommendations K
			$http.post(baseUrl + '/recommend/socialTopN', data).success(success).error(error);
		},
		recommendSimpleDebug: function(uid, thres, K, success, error) // uid : user id, thres : threshold, K : top K items
		{
			var data = {};
			data.user_id = uid; 	// User u
			data.threshold = thres; 	// Threshold δ, 
			data.K_value = K; 	// number of Recommendations K	
			$http.post(baseUrl + '/recommend/simpleTopNDebug', data).success(success).error(error);
		}
	};
}