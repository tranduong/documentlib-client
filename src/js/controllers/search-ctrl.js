' use strict' ;

angular
  .module('SDLMSys')
  .controller('SearchCtrl', ['$scope', '$filter', '$timeout', '$localStorage', '$http', 'DocumentSvc', 'DOCUMENT_SEARCH', 'PAGINATION', SearchCtrl]);
  
function SearchCtrl($scope, $filter, $timeout, $localStorage, $http, DocumentSvc, DOCUMENT_SEARCH, PAGINATION ) {

	console.log("Constructing SearchCtrl...");
	$scope.resultDocs = [];
	
	$scope.submit = function()
	{
		$scope.isLoading = true;

		fetch($scope.query);
				
		$scope.isLoading = false;
	}
	
	$scope.$watch('query',function(value)
	{
		$scope.isLoading = true;

		fetch(value);
				
		$scope.isLoading = false;
	});
	
    function fetch(query) {
		$http.get(DOCUMENT_SEARCH.URL + query + "&pretty=true&size=" + $scope.pageSize)
			.then(function(response) {
				console.log(response);
				if ( response.status == 200 ) // successful 
				{
					var theData = response.data.hits;
					$scope.resultDocs = theData.hits;	
					$scope.totalDocs = theData.total;				
				}
				else{
					console.log(response.statusText);
				}
			});
    }
	
	$scope.pageChanged = function(newPage) {
        getPageData(newPage);
    };
	
	function getPageData(thePage)
	{
		$scope.isLoading = true;
		$http.get(DOCUMENT_SEARCH.URL + $scope.query + "&pretty=true&size=" + $scope.pageSize + "&from=" + (thePage - 1)*$scope.pageSize)
		.then(function(response) {
				console.log(response);
				if ( response.status == 200 ) // successful 
				{
					var theData = response.data.hits;
					$scope.resultDocs = theData.hits;	
					$scope.totalDocs = theData.total;								
				}
				else{
					console.log(response.statusText);
				}
				$scope.isLoading = false;
			});
	}
	

	$scope.pagination = {
        current: 1
    };

    $scope.pageSize = PAGINATION.ITEMS_PER_PAGE;
	$scope.totalDocs = 0;
	
	$scope.getServerDocumentPath = function(path){
		// console.log("come here 8!");
		return DocumentSvc.getDocPath(path);
	}
}



