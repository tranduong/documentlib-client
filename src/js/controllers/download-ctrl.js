'use strict';

angular
  .module('SDLMSys')
  .controller('DownloadCtrl', ['$scope', '$localStorage', 'DocumentSvc', 'UserActSvc', 'ngDialog', 'PAGINATION', DownloadCtrl]);
  
function DownloadCtrl($scope, $localStorage, DocumentSvc, UserActSvc, ngDialog, PAGINATION) {
	console.log("Constructing DownloadCtrl...");

	// list of downloaded documents
	$scope.downloadedDocs = [];	
	// other working variables
	$scope.log = '';
	
	$scope.peakDownload = 0;
	$scope.averageTimePerDay = 0;
	
	
	$scope.clearLog = function()
	{
		//console.log("come here 2!");
		$scope.log = '';
	}
	
    function activate(DocumentSvc) {
		//console.log("Activated Controller");
		$scope.myid = $localStorage.myDetail._id; // user for recognize read, like activity
		
		DocumentSvc.getMyDownloadedDocs(function(res){
			console.log(res.data);
			$scope.downloadedDocs = res.data;		
			$scope.numberOfDocs = $scope.downloadedDocs.length;
			
			/* var timeADays = {};
			if ( $scope.numberOfDocs > 0 )
			{				
				for (i = 0; i < $scope.numberOfDocs; i++)
				{
					var uploadedTime = new Date($scope.uploadedDocs[i].uploadedDate);
					var n = uploadedTime.valueOf();
					var dateKey 	= Math.ceil( n  / 86400000);
					if ( timeADays[dateKey] )
						timeADays[dateKey] = timeADays[dateKey] + 1;
					else
						timeADays[dateKey] = 1;					
				}
				// find the peak uploaded value;
				
				for (date in timeADays)
				{
					if ( $scope.peakUploaded < timeADays[date] )
						$scope.peakUploaded = timeADays[date];
				}
				
				$scope.averageTimePerDay = ($scope.numberOfDocs / Object.keys(timeADays).length ).toFixed(2);
				console.log(timeADays);
			} */
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
        return Math.ceil($scope.downloadedDocs / $scope.pageSize);                
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