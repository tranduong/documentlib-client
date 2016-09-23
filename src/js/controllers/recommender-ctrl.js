'use strict';

angular
  .module('SDLMSys')
  .controller('RecommenderCtrl', ['$scope', '$localStorage', 'DocumentSvc', 'UserActSvc', 'MainSvc', 'RecommendSvc', 'CategorySvc','ngDialog', 'PAGINATION', RecommenderCtrl]);
  
function RecommenderCtrl($scope, $localStorage, DocumentSvc, UserActSvc, MainSvc, RecommendSvc, CategorySvc, ngDialog, PAGINATION ) {
	console.log("Constructing ShareCtrl...");

	// list of downloaded documents
	$scope.recommendDocs = [];
	$scope.myid = $localStorage.myDetail._id; // user for recognize read, like activity
	// other working variables
	$scope.log = '';
	$scope.type = 'simple';
	
	$scope.$watch('type',function(value)
	{
		activate(RecommendSvc);
	});
	
	$scope.clearLog = function()
	{
		//console.log("come here 2!");
		$scope.log = '';
	}
	
	$scope.currentPage = 0;
    $scope.pageSize = PAGINATION.ITEMS_PER_PAGE;
	$scope.numberOfPages = function(){
        return Math.ceil($scope.numberOfDocs / $scope.pageSize);                
    }
	
    function activate(RecommendSvc) {
		//console.log("Activated Controller");
		if ( $scope.type == 'debug' )
		{
			RecommendSvc.recommendSimpleDebug($scope.myid, 0.1, $scope.pageSize, function(res){
				console.log(res.data);			
				$scope.recommendDocs = [];
				for (var i = 0; i < res.data.length; i++)
				{
					$scope.recommendDocs.push(res.data[i].doc);		
				}			
				$scope.numberOfDocs = $scope.recommendDocs.length;
			}, function() {
				$rootScope.error = 'Failed to fetch documents information';
			});
		}
		else if ( $scope.type == 'simple' )
		{
			RecommendSvc.recommendSimple($scope.myid, 0.1, $scope.pageSize, function(res){
				console.log(res.data);			
				$scope.recommendDocs = [];
				for (var i = 0; i < res.data.length; i++)
				{
					$scope.recommendDocs.push(res.data[i].doc);		
				}			
				$scope.numberOfDocs = $scope.recommendDocs.length;
			}, function() {
				$rootScope.error = 'Failed to fetch documents information';
			});
		}
		else {
			RecommendSvc.recommendSocial($scope.myid, 0.1, $scope.pageSize, function(res){
				console.log(res.data);			
				$scope.recommendDocs = [];
				for (var i = 0; i < res.data.length; i++)
				{
					$scope.recommendDocs.push(res.data[i].doc);		
				}			
				$scope.numberOfDocs = $scope.recommendDocs.length;
			}, function() {
				$rootScope.error = 'Failed to fetch documents information';
			});
		}
    }
	
	// activate the list;
	activate(RecommendSvc);
	
	$scope.getServerDocumentPath = function(path, bDownload){
		// console.log("come here 8!");
		return DocumentSvc.getDocPath(path, bDownload);
	}
	
	$scope.userInteract = function(id, action, data){
		console.log("Document Id: " + id + " - with user action : " + action + " - data : " + data);
		var theData = { doc_id : id, the_action : action, the_data : data};
		UserActSvc.interactDocument(theData, function(success){
			console.log(success);
			setTimeout(function(){
					$scope.$apply(function(){					
						activate(DocumentSvc);
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
}



