'use strict';
/* Authentication Controller */

angular
  .module('SDLMSys')
  .controller('MainCtrl', ['$rootScope', '$scope', '$route', '$stateParams', '$location', '$localStorage', 'MainSvc', 'DocumentSvc', 'ngDialog', 'PAGINATION',  MainCtrl]);
  
 function MainCtrl($rootScope, $scope, $route, $stateParams, $location, $localStorage, MainSvc, DocumentSvc, ngDialog, PAGINATION) {
	console.log("Constructing MainCtrl...");
		
	$scope.me = function(){
		console.log("Me called");
		MainSvc.me(function(res){
			console.log(res);
			$localStorage.myDetail = res.data;
		}, function() {
			$rootScope.error = 'Failed to fetch details';
		});
	};
	
	// statistics and user information display on control panel page
	$scope.stats = {};
	$scope.currentUser = {};
	$scope.userReadDocs = [];
	$scope.numberOfUserReadDocs = 0;
	$scope.currentPage = 0;
	
    $scope.pageSize = PAGINATION.ITEMS_PER_PAGE * 2;
	$scope.numberOfPages = function(){
        return Math.ceil($scope.userReadDocs / $scope.pageSize);                
    }
	
	$scope.getUserReadingDocuments = function(user_id){		
		DocumentSvc.getUserReadingDocs(user_id, function(res){
			console.log(res.data);
			if ( res.type )
			{
				$scope.userReadDocs = res.data;		
				$scope.numberOfUserReadDocs = $scope.userReadDocs.length;
			}
			else{
				$scope.userReadDocs = [];		
				$scope.numberOfUserReadDocs = 0;
			}			
		}, function() {
			$scope.userReadDocs = [];		
			$scope.numberOfUserReadDocs = 0;
			$rootScope.error = 'Failed to fetch documents information';
		});
	}
	
	$scope.getStatistic = function(){
		console.log("=======GET STATISTICS=======");
		console.log($localStorage.myDetail);
		console.log("=====END GET STATISTICS=====");
		// If the information is lacked
		if ( $localStorage.myDetail == null )
		{
			$scope.me();
		}
		
		if ( $localStorage.myDetail != null )
		{
			var statistic_user_id = $localStorage.myDetail._id;
			$scope.strViewingUser = $localStorage.myDetail.username;
			$scope.bFriendRequestSent 		= false;
			$scope.bSendFriendRequest 		= false; // false 
			$scope.bResponseFriendRequest	= false; // false 
			$scope.bRequestFollowRequest 	= false; // false 
			$scope.bBeFriend		 		= false; // false 
			console.log("=====Main=====");
			console.log($localStorage.myDetail);
			console.log($stateParams);
			console.log("=====End Main=====");
			if ( $stateParams.userid !== "" && $localStorage.myDetail._id !== "" ){
				// If you are viewing the control panel view of others
				if ( $stateParams.userid !== $localStorage.myDetail._id )
				{
					statistic_user_id = $stateParams.userid;					
					// If the user has not been your friend
					if ($localStorage.myDetail.friends.length >= 0 &&
						$localStorage.myDetail.friends.indexOf($stateParams.userid) === -1 )
					{
						// If you has sent a request to the user					
						if ( $localStorage.myDetail.wait_response_friends.indexOf($stateParams.userid) !== -1 )
						{
							console.log("Waiting for response friends");
							$scope.bFriendRequestSent = true;
						}
						else if ( // if you received a friend request from user
								 $localStorage.myDetail.request_friends.indexOf($stateParams.userid) !== -1 )
						{
							console.log("Received a friend request");
							$scope.bResponseFriendRequest = true;
						} 
						else
						{
							console.log("Received a friend request");
							$scope.bSendFriendRequest 	= true;
							
							// If you haven't sent a friend request, you can request to follow a user
							if ( $localStorage.myDetail.followers.indexOf($stateParams.userid) === -1)
							{
								$scope.bRequestFollowRequest = true;
							}
						}
					}
					else
					{
						$scope.bBeFriend = true;
					}
				}								
			}
			else if ( $stateParams.userid === "" && $localStorage.myDetail._id !== "" ){
				statistic_user_id = $localStorage.myDetail._id;
			}
			else {
				$location.path("/");
			}
			
			$scope.myid = statistic_user_id;
			console.log(statistic_user_id + " - " + $localStorage.myDetail._id + " or " + $stateParams.userid);
			$scope.getUserReadingDocuments(statistic_user_id);
			
			MainSvc.getStatistic(statistic_user_id, function(success){
				console.log(success);
				$scope.stats = success;			
			}, function(err){
				console.log(err);
			});
			
			MainSvc.getUserInformation(statistic_user_id, function(res){
				console.log(res);
				if ( res.type ){
					$scope.currentUser = res.data;			
				}
				else
				{
					$scope.currentUser = $localStorage.myDetail;			
				}
				
				$scope.strViewingUser = $scope.currentUser.username;
			}, function(err){
				console.log(err);
			});
		}
	}
	
	// Init get statistic information
	$scope.getStatistic();
	
	$scope.sendFriendRequest = function(){
		console.log("Send Friend Request");
		if ($scope.bSendFriendRequest)
		{
			var data = {friend_id : $stateParams.userid};
			console.log($stateParams);
			
			MainSvc.sendFriendRequest(data, function(success){
				console.log("SendRequestSuccess");
				console.log(success);
				$scope.me();
				setTimeout(function(){
					$scope.$apply(function(){					
						$scope.getStatistic();
					})
				}, 500);	
			}, function(err){
				console.log("SendRequestFailed");
				console.log(err);
			});
		}
	}
	
	$scope.sendFriendResponse = function(){
		console.log("Send Friend Response");
		if ($scope.bResponseFriendRequest)
		{
			var data = {friend_id : $stateParams.userid};
			console.log($stateParams);
			MainSvc.sendFriendResponse(data, function(success){
				console.log("SendResponseSuccess");
				console.log(success);
				$scope.me();
				setTimeout(function(){
					$scope.$apply(function(){					
						$scope.getStatistic();
					})
				}, 500);	
			}, function(err){
				console.log("SendResponseFailed");
				console.log(err);
			});
		}
	}
	
	$scope.confirmFollow = function(){
		console.log("confirm follow Response");
		if ($scope.bRequestFollowRequest)
		{
			console.log($stateParams);
			var data = {follower_id : $stateParams.userid};
			MainSvc.sendConfirmFollow(data, function(success){
				console.log("sendConfirmFollowSuccess");
				console.log(success);
				$scope.me();
				setTimeout(function(){
					$scope.$apply(function(){					
						$scope.getStatistic();
					})
				}, 500);	
			}, function(err){
				console.log("sendConfirmFollowFailed");
				console.log(err);
			});
		}
	}
	
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
					$scope.me();
					$scope.$apply(function(){					
						$scope.getStatistic();
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
