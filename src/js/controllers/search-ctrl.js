'use strict';

angular
  .module('SDLMSys')
  .controller('SearchCtrl', ['$scope', '$localStorage', 'SearchSvc', 'DocumentSvc', 'UserActSvc', 'MainSvc', 'RecommendSvc', 'CategorySvc','ngDialog', 'PAGINATION', SearchCtrl]);
  
function SearchCtrl($scope, $localStorage, SearchSvc, DocumentSvc, UserActSvc, MainSvc, RecommendSvc, CategorySvc, ngDialog, PAGINATION ) {

	console.log("Constructing SearchCtrl...");
	$scope.resultDocs = [];
	
	$scope.errorLog = "";
	$scope.submit = function()
	{
		$scope.isLoading = true;

		fetch($scope.query);
				
		$scope.isLoading = false;
	}
	
	$scope.category = "";
	
	$scope.$watch('query',function(value)
	{
		$scope.isLoading = true;

		fetch(value);
				
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
		$scope.me();
		//console.log(query);
		clearPreviousResult();
		// Compute the items from the query by applying tf-idf ( default in elastic search )
		SearchSvc.searchData(query, $scope.privacy, $scope.category, 0, $scope.pageSize, function(response){
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
    
		// From the current user, search by a breadth-first search in neo4j with max-deep 5
		// From the items, get their ids and searching them by a breadth-first search in neo4j with max-deep 5.
		// limit = 30; // Top-30 Items
		
		// SearchSvc.searchData(query, $scope.privacy, $scope.category, 0, limit, function(response){
			// console.log(response);
			// if ( response.status == 200 ) // successful 
			// {
				// if (response.data)
				// {
					// totalCount = 0;
					// var docs = [];
					// var numbers = response.data.responses.length;
					// for (i = 0; i < numbers; i++)
					// {
						// if (response.data.responses[i].error === 'undefined')
						// {
							// docs = docs.concat(response.data.responses[i].hits.hits);
							// totalCount = totalCount + response.data.responses[i].hits.total;					
						// }
					// }
					
					// if ( totalCount < limit)
					// {
						// limit = totalCount;
					// }
					
					// var topN = [];
					// for (j = 0; j < limit; j++)
					// {
						// var doc = {};
						// doc.mongo_id = docs[j]._source.id;
						// doc.score = docs[j]._score;
						// topN.push(doc);
					// }
					
					// console.log(topN);
					// RecommendSvc.recommendList(topN, false, function(res){
						// console.log(res);
					// }, function(err){
						// console.log(err);
					// });
				// }
			// }
		// }, function(err){
			// console.log(err);
		// });
	}
	
	$scope.pageChanged = function(newPage) {
        getPageData(newPage);
    };
	
	function getPageData(thePage)
	{
		$scope.isLoading = true;
		SearchSvc.searchData($scope.query, $scope.privacy, $scope.category, (thePage - 1)*$scope.pageSize, $scope.pageSize, function(response){
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
	
	$scope.getServerDocumentPath = function(path, bDownload){
		//console.log("come here 8 : " + path);
		return DocumentSvc.getDocPath(path, bDownload);
	}
	

	
	$scope.me = function(){		
		MainSvc.me(function(res){
			console.log("Result from me()");
			console.log(res);
			$localStorage.myDetail = res.data;
			$scope.myDetail = $localStorage.myDetail;
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
	
	$scope.rating = 0;    

    $scope.getSelectedRating = function (rating, doc_id, user_id) {
        console.log(rating);
    }
}



