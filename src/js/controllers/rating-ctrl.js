'use strict';

angular
  .module('SDLMSys')
  .controller('RatingCtrl', ['$scope',  RatingCtrl]);
  
function RatingCtrl($scope) {
	$scope.rating = 0;    

    $scope.getSelectedRating = function (rating, doc_id, user_id) {
        console.log(rating);
    }
}