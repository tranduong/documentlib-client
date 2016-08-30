' use strict' ;

angular
  .module('SDLMSys')
  .controller('ShareForMeCtrl', ['$scope',  '$timeout', '$localStorage', 'DocumentSvc', 'UserActSvc', 'ngDialog', 'PAGINATION', ShareForMeCtrl]);
  
function ShareForMeCtrl($scope,  $timeout, $localStorage, DocumentSvc, UserActSvc, ngDialog, PAGINATION) {
	console.log("Constructing ShareForMeCtrl...");

	// list of downloaded documents
	$scope.sharedTransactions = [];
	$scope.myid = $localStorage.myDetail._id; // user for recognize read, like activity
	// other working variables
	$scope.log = '';
	
	$scope.clearLog = function()
	{
		//console.log("come here 2!");
		$scope.log = '';
	}
	
    function activate(DocumentSvc) {
		//console.log("Activated Controller");
		DocumentSvc.getSharedForMeDocuments(function(res){
			console.log(res.data);
			if ( res.type )
			{
				$scope.sharedTransactions = res.data;		
				if ( typeof res.data !== 'undefined')
					$scope.numberOfDocs = $scope.sharedTransactions.length;
				else
					$scope.numberOfDocs = 0;
				
			}
			else
			{
				$scope.sharedTransactions = [];		
				$scope.numberOfDocs = 0;
			}
		}, function() {
			$rootScope.error = 'Failed to fetch documents information';
		});
			
    }
	
	// activate the list;
	activate(DocumentSvc);
	
	$scope.getServerDocumentPath = function(path, bDownload){
		// console.log("come here 8!");
		return DocumentSvc.getDocPath(path, bDownload);
	}
	
	$scope.currentPage = 0;
    $scope.pageSize = PAGINATION.ITEMS_PER_PAGE;
	$scope.numberOfPages = function(){
        return Math.ceil($scope.sharedTransactions / $scope.pageSize);                
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