' use strict' ;

angular
  .module('SDLMSys')
  .controller('DocumentCtrl', ['$scope', '$localStorage', 'Upload', '$timeout', 'DocumentSvc', 'UserActSvc', 'ngDialog', 'PAGINATION', DocumentCtrl]);
  
function DocumentCtrl($scope, $localStorage, Upload, $timeout, DocumentSvc, UserActSvc, ngDialog, PAGINATION) {
	console.log("Constructing DocumentCtrl...");

	// list of uploaded documents
	$scope.uploadedDocs = [];
	$scope.myid = $localStorage.myDetail._id; // user for recognize read, like activity in uploadeddocumentlist.html
    // document information parts
	$scope.title = '';
	$scope.authors  = '';
	$scope.abstract  = '';
	$scope.publisher  = '';
	$scope.publishedDate  = '';	
	$scope.privacy 	= '';
	$scope.category = '';
	$scope.demomode = '';
	
	// other working variables
	$scope.log = '';
	$scope.isSucceedUpload = 0;
	
	$scope.isEditing = false;
	isLoading = false;
	
	$scope.peakUploaded = 0;
	$scope.averageTimePerDay = 0;
	
	$scope.selectFile = function(file) {   
		$scope.file = file;
		console.log("play here");
	}

	// upload later on form submit or something similar
    $scope.uploadDocument = function() {    
		//console.log("come here 1!");
		$scope.uploadFile($scope.file);
    }
	
	$scope.clearLog = function()
	{
		//console.log("come here 2!");
		$scope.log = '';
		$scope.isSucceedUpload = 0;		
	}
	
	$scope.submit = function() {
		$scope.uploadDocument();
	}
	
	function cleanup() {
		$scope.file = undefined;
	}
	
	$scope.uploadFile = function(file) {
		//console.log("come here 3!");
        if (file) {
			$scope.clearLog();
			console.log("come here 3 - 1!");
			// console.log($scope);
            file.upload = Upload.upload({
                url: 'http://localhost:3001/uploadDoc',
                data: {
					username: 	$scope.username,
					title: 		$scope.title,
					authors: 	$scope.authors,
					abstract: 	$scope.abstract,
					publisher: 	$scope.publisher,
					publishedDate: 	$scope.publishedDate,
					privacy: 		$scope.privacy,
					category: 		$scope.category,
					demomode:		$scope.demomode,
					file: file  
                }
            })
			.then(function (resp) {
                console.log("Running here!");
				
				$timeout(function() {
					var log = 'file: ' +
					resp.config.data.file.name +
					', Response: ' + JSON.stringify(resp.data);					
					$scope.log = log;
					file.result = resp.data;
					//console.log("Running here out! 2");	
					$scope.isSucceedUpload = $scope.isSucceedUpload + 1;					
				});				
				$scope.isSucceedUpload = $scope.isSucceedUpload + 1;
				console.log("Running here out! 1");
				cleanup();
            }, function (resp) {
				//console.log("Running error!");
                if (resp.status > 0)
                    $scope.log = resp.status + ': ' + resp.data;
            }, function (evt) {
					//console.log("Running succeed!");
				
                    var progressPercentage = parseInt(100.0 *
                    		evt.loaded / evt.total);
					// Math.min is to fix IE which reports 200% sometimes
					file.progress = Math.min(progressPercentage);
                    $scope.log = 'progress: ' + progressPercentage + 
                    	'% ' + evt.config.data.file.name;
					$scope.isSucceedUpload = $scope.isSucceedUpload + 1;
			});			
        }
		else{
			$scope.log = "$scope.file is null";
			console.log($scope.log);
			console.log($scope);
		}
    }
		 
    function activate(DocumentSvc) {
		//console.log("Activated Controller");
		DocumentSvc.getMines(function(res){
			$scope.uploadedDocs = (res.data);		
			$scope.numberOfDocs = $scope.uploadedDocs.length;
			
			var timeADays = {};
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
			}
		}, function() {
			$rootScope.error = 'Failed to fetch documents information';
		});
			
    }
	
	
	function updateDocument(doc){
		//console.log("come here 5!");
		DocumentSvc.updateInfo(doc, function(res){			
			//console.log("update document result: ", res);
			$scope.editingDoc = null;
			
			activate(DocumentSvc);
			// exit the editing process
			$scope.exitEditing();
		}, function(err) {
			//console.log("Error when updatedocument: ", err);
			$scope.editingDoc = null;
		});
		
		
	}
	
	$scope.editDocument = function(doc){
		//console.log("come here 6!");
		//console.log("select document : " + doc);
		$scope.isEditing = true;
		$scope.editingDoc = doc;
		
		$scope.title 	= doc.title;
		$scope.authors 	= doc.authors;
		$scope.abstract = doc.abstract;
		$scope.publisher 	 = doc.publisher;
		$scope.publishedDate = doc.publishedDate;
		$scope.privacy 	 	 = doc.privacy;
		$scope.category 	 = doc.category;
	}
	
	$scope.saveEditedDoc = function(){
		$scope.editingDoc.title 	= $scope.title;
		$scope.editingDoc.authors 	= $scope.authors;
		$scope.editingDoc.abstract	= $scope.abstract;
		$scope.editingDoc.publisher 	= $scope.publisher;
		$scope.editingDoc.publishedDate = $scope.publishedDate;
		$scope.editingDoc.privacy 		= $scope.privacy;
		$scope.editingDoc.category	 	= $scope.category;
		updateDocument($scope.editingDoc);
	}
	
	$scope.exitEditing = function(){
		$scope.editingDoc = null;
		
		$scope.title 	= '';
		$scope.authors 	= '';
		$scope.abstract = '';
		$scope.publisher 	 = '';
		$scope.publishedDate = '';
		$scope.isEditing 	 = false;

		$scope.privacy	 	 = '';
		$scope.category 	 = '';
		$scope.demomode 	 = '';		
	}
	
	
	$scope.deleteDocument = function (index, doc) {
		//console.log("come here 7!");
		
		//console.log("delete Document : " + JSON.stringify(doc));
		DocumentSvc.removeDoc(doc, function(res){			
			console.log("delete document result: ", res);
		}, function(err) {
			console.log("Error when delete document: ", err);
		});
		
		$scope.uploadedDocs.slice(index, 1);
		activate(DocumentSvc);
	}
		
	$scope.getServerDocumentPath = function(path){
		// console.log("come here 8!");
		return DocumentSvc.getDocPath(path);
	}
	
	$scope.downloadDocument = function(doc){
		console.log("come here 9!");
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		a.href = DocumentSvc.getDocPath(doc.uploadedPath);;
		a.download = doc.fileName;
		a.click();
		document.body.removeChild(a);
	}
	
	// Register watch the variable
	$scope.$watch('isSucceedUpload', function () {
		//console.log("come here 10!");
		$scope.isLoading = true;
		activate(DocumentSvc);
		$scope.isLoading = false;
	});
	
	$scope.currentPage = 0;
    $scope.pageSize = PAGINATION.ITEMS_PER_PAGE;
	$scope.numberOfPages = function(){
        return Math.ceil($scope.uploadedDocs / $scope.pageSize);                
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