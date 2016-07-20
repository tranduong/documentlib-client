' use strict' ;

angular
  .module('SDLMSys')
  .controller('UserSearchCtrl', ['$scope', '$http', '$location', '$localStorage', 'SEARCH_HOST', UserSearchCtrl]);
  
function UserSearchCtrl($scope, $http, $location, $localStorage, SEARCH_HOST ) {

	console.log("Constructing UserSearchCtrl...");
	$scope.resultUsers = [];
	
	$scope.limits = 10;	
	
	function clearPreviousResult()
	{
		$scope.errorLog = "";
		$scope.resultLog = "";		
		$scope.resultUsers.splice(0,$scope.resultUsers.length);
	}
	
	$scope.getUsers = function(query) 
	{	
		clearPreviousResult();
		//var response = SearchSvc.searchUserSync(query, 0, $scope.limits);
		
		var searchURL = SEARCH_HOST.URL + '/doclib_main/User/' +  SEARCH_HOST.SINGLE_API + '?q=' + query + '&from=' + 0 + '&size=' +  $scope.limits;

		return $http.get(searchURL)
		.then(function(response) {
			//console.log(response);
			console.log(response);
			if ( response.status == 200 ) // successful 
			{
				if (response.data)
				{
					var length = response.data.hits.hits.length;
					for (var i = 0; i < length; i++){
						$scope.resultUsers.push(response.data.hits.hits[i]._source);
					}
					//console.log($scope.resultUsers);				
				}
			}
			else
			{
				//console.log(response.statusText);
				$scope.errorLog = response.statusText;				
			}
			return $scope.resultUsers;
		});
    }

	$scope.selectUser = function($item, $model, $label, $event){		
		$localStorage.lastSelectedItem = $item;
		$location.path('/controlpanel/' + $item.id);		
	}
	
}



