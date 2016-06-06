' use strict' ;

angular
  .module('SDLMSys')
  .filter('startFrom', function() {
		//We already have a limitTo filter built-in to angular,
		//let's make a startFrom filter
		return function(input, start) {
			start = +start; //parse to int
			return input.slice(start);
		}
	});