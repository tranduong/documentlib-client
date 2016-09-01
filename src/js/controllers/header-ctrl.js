'use strict';
/* Authentication Controller */

angular
  .module('SDLMSys')
  .controller('HeaderCtrl', ['$rootScope', '$scope', '$localStorage', HeaderCtrl]);
  
 function HeaderCtrl($rootScope, $scope, $localStorage) {
	console.log("Constructing HeaderCtrl...");
	$scope.myDetail = $localStorage.myDetail;
}
