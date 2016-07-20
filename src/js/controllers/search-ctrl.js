' use strict' ;

angular
  .module('SDLMSys')
  .controller('SearchCtrl', ['$scope', '$localStorage', 'SearchSvc', 'DocumentSvc', 'UserActSvc', 'MainSvc', 'ngDialog', 'PAGINATION', SearchCtrl]);
  
function SearchCtrl($scope, $localStorage, SearchSvc, DocumentSvc, UserActSvc, MainSvc, ngDialog, PAGINATION ) {

	console.log("Constructing SearchCtrl...");
	$scope.resultDocs = [];
	
	$scope.errorLog = "";
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
	
	$scope.$watch('demomode',function(value)
	{
		$scope.isLoading = true;

		fetch($scope.query);
				
		$scope.isLoading = false;
	});
	
	$scope.$watch('category',function(value)
	{
		$scope.isLoading = true;

		fetch($scope.query);
				
		$scope.isLoading = false;
	});
	
	$scope.$watch('privacy',function(value)
	{
		$scope.isLoading = true;

		fetch($scope.query);
				
		$scope.isLoading = false;
	});
	function clearPreviousResult()
	{
		$scope.errorLog = "";
		$scope.resultLog = "";		
		$scope.totalDocs = 0;
		$scope.resultDocs = [];
	}
	
    function fetch(query) {
		
		clearPreviousResult();
		
		SearchSvc.searchData(query, $scope.privacy, $scope.category, $scope.demomode, 0, $scope.pageSize, function(response){
			console.log(response);
			if ( response.status == 200 ) // successful 
			{
				if (response.data)
				{
					$scope.resultDocs = [];
					var numbers = response.data.responses.length;
					var totalCount = 0;

					for (i = 0; i < numbers; i++)
					{
						if (response.data.responses[i].error)
						{
							$scope.errorLog = $scope.errorLog + response.data.responses[i].error.index + " - " + response.data.responses[i].error.reason;
							$scope.resultLog = "There is no document found";
						}
						else{
							$scope.resultDocs = $scope.resultDocs.concat(response.data.responses[i].hits.hits);
							totalCount = totalCount + response.data.responses[i].hits.total;					
						}
					}
					$scope.totalDocs = totalCount;
				}
			}
			else{
				console.log(response.statusText);
				$scope.errorLog = response.statusText;
			}
		}, function(err){
			$scope.errorLog = err;
		});		
    }
	
	$scope.pageChanged = function(newPage) {
        getPageData(newPage);
    };
	
	function getPageData(thePage)
	{
		$scope.isLoading = true;
		SearchSvc.searchData($scope.query, $scope.privacy, $scope.category, $scope.demomode,(thePage - 1)*$scope.pageSize, $scope.pageSize, function(response){
			console.log(response);
			if ( response.status == 200 ) // successful 
			{
				if (response.data)
				{
					$scope.resultDocs = [];
					var numbers = response.data.responses.length;
					var totalCount = 0;

					for (i = 0; i < numbers; i++)
					{
						if (response.data.responses[i].error)
						{
							$scope.errorLog = $scope.errorLog + response.data.responses[i].error.index + " - " + response.data.responses[i].error.reason;
							$scope.resultLog = "There is no document found";
						}
						else{
							$scope.resultDocs = $scope.resultDocs.concat(response.data.responses[i].hits.hits);
							totalCount = totalCount + response.data.responses[i].hits.total;					
						}			
					}
					$scope.totalDocs = totalCount;
					
					$scope.isLoading = false;
				}
			}
			else{
				console.log(response.statusText);
				$scope.errorLog = response.statusText;
			}
		}, function(err){
			$scope.errorLog = err;
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
	

	
	$scope.me = function(){		
		MainSvc.me(function(res){
			console.log(res);
			$localStorage.myDetail = res.data;
			$scope.myDetail = $localStorage.myDetail;
			console.log($localStorage.myDetail);
		}, function() {
			$rootScope.error = 'Failed to fetch details';
		});
	};
	
	$scope.userInteract = function(id, action, data){
		console.log("Document Id: " + id + " - with user action : " + action + " - data : " + data);
		var theData = { doc_id : id, the_action : action, the_data : data};
		UserActSvc.interactDocument(theData, function(success){
			console.log(success);
			setTimeout(function(){
					$scope.$apply(function(){					
						$scope.me();
					})
				}, 500);			
		}, function(err){
			console.log(err);
		});;
	}
	
	$scope.openShare = function (docid) {
		$scope.doc_id = docid;
		ngDialog.open({
			template: 'firstDialog',
			controller: 'PopupShareCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-custom',
			scope: $scope
		});
	};	
	
	$scope.me();
}



