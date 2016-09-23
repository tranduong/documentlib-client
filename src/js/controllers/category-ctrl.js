'use strict';

angular
  .module('SDLMSys')
  .controller('CategoryCtrl', ['$rootScope', '$scope', '$localStorage', 'CategorySvc', CategoryCtrl]);
  
function CategoryCtrl($rootScope, $scope, $localStorage, CategorySvc) {
	
	$scope.initialize = function(){
		console.log("Initialize CategoryCtrl");
		CategorySvc.getCategories(function(success){
			console.log("result from getCategories");
			console.log(success.data);
			$scope.categories = success.data;
			
		}, function(err){
			console.log("get Categories failed");
			console.log(err);
		});
	}
	
	$scope.$watch('category',function(value)
	{
		$rootScope.category = value;
	});
	
	$scope.initialize();
}