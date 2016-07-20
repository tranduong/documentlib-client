' use strict' ;

angular
  .module('SDLMSys')
  .controller('LikeCtrl', ['$scope', '$localStorage','DocumentSvc', 'UserActSvc', 'ngDialog', 'PAGINATION', LikeCtrl]);
  
function LikeCtrl($scope, $localStorage, DocumentSvc, UserActSvc, ngDialog, PAGINATION) {
	console.log("Constructing LikeCtrl...");

	// list of downloaded documents
	$scope.likeDocs = [];
	
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
		DocumentSvc.getMyLikedDocs(function(res){
			console.log(res.data);
			$scope.likeDocs = res.data;		
			$scope.numberOfDocs = $scope.likeDocs.length;
		}, function() {
			$rootScope.error = 'Failed to fetch documents information';
		});
			
    }
	
	// activate the list;
	activate(DocumentSvc);

	
	$scope.getServerDocumentPath = function(path){
		// console.log("come here 8!");
		return DocumentSvc.getDocPath(path);
	}
	
	$scope.currentPage = 0;
    $scope.pageSize = PAGINATION.ITEMS_PER_PAGE;
	$scope.numberOfPages = function(){
        return Math.ceil($scope.likeDocs / $scope.pageSize);                
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