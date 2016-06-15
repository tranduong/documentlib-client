'use strict';
angular
    .module('SDLMSys')	
    .config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push(['$q', '$location', '$localStorage', 'Utils', 'SEARCH_HOST', function($q, $location, $localStorage, Utils, SEARCH_HOST) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
					
                    if ($localStorage.token && !config.url.match(SEARCH_HOST.MULTI_API)) {
						//console.log("Add bearer: " + $localStorage.token);
						//console.log("Added Bearer");
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/');
                    }
                    return $q.reject(response);
                }
            };
        }]);
	}]);
