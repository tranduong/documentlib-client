'use strict';

angular
  .module('SDLMSys')
  .controller('RatingCtrl', ['$scope',  RatingCtrl]);
  
function RatingCtrl($scope) {
	
	// user rate the document
	$scope.rate = function(user_id, doc_id, score)
	{
		
	}
	
	// get the self rating of user
	$scope.getMyRating = function(user_id)
	{
		
	}
	
}