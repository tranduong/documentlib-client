' use strict' ;
/* Authentication Controller */

angular
  .module('SDLMSys')
  .controller('AuthCtrl', ['$rootScope', '$scope', '$route', '$stateParams', '$location', '$localStorage', 'MainSvc', 'DocumentSvc', 'ngDialog', 'PAGINATION',  AuthCtrl]);
  
 function AuthCtrl($rootScope, $scope, $route, $stateParams, $location, $localStorage, MainSvc, DocumentSvc, ngDialog, PAGINATION) {
	console.log("Constructing AuthCtrl...");
		
	$scope.login = function() {
		var datetime = new Date();
		if ($scope.password)
		{
			var hashedPassword = CryptoJS.SHA1($scope.password).toString();
			var formData = {
				email : $scope.email,
				password : hashedPassword
			};
			console.log("Login called");
			MainSvc.login(formData, function(res){
				if (res.type === false){
					if ($localStorage.wrongCount)
					{
						$localStorage.wrongCount = $localStorage.wrongCount + 1;
						console.log( "number of Count : " + $localStorage.wrongCount );
					}
					else
					{
						$localStorage.wrongCount = 1;
					}					
					alert(res.data);
				} else {
					$localStorage.wrongCount = 0;
					console.log(res.data);
					$localStorage.myDetail = res.data;
					$scope.myDetail = $localStorage.myDetail;
					$localStorage.token = res.data.token;
					$localStorage.expiretime = datetime.now  + 86400000; // 1 minutes to test, after 24 hours - 86400000
					$location.path("/controlpanel/" + $localStorage.myDetail._id);
				}
			}, function() {
				$rootScope.error = "Failed to Login!";
			});
		}
		else
		{
			alert("Password must not be empty! Please provide us your identified password!");
		}
	};
			  
	$scope.register = function() {
		if ($scope.password)
		{
			if ( $scope.retypepwd == $scope.password )
			{
				var datetime = new Date();
				var hashedPassword = CryptoJS.SHA1($scope.password).toString();
				var formData = {
					username : $scope.username,
					email : $scope.email,
					password : hashedPassword
				};
				console.log("Register called");
				MainSvc.save(formData, function(res){
					if (res.type === false){
						alert(res.data);
					} else {
						console.log(res.data);
						$localStorage.myDetail = res.data.data;
						$scope.myDetail = $localStorage.myDetail;
						$localStorage.token = res.data.token;
						$localStorage.expiretime = datetime.now + 86400000; // 1 minutes to test, after 24 hours - 86400000
						$location.path("/registersuccessful");
					}				
				}, function() {
					$rootScope.error = 'Failed to Register';
					$location.path("/registerfailed");
				});
			}
			else
			{
				alert("Your password and its retype confirmation are not identical. Please retype them!");
			}
		}
		else
		{
			alert("The password and the retyped one must not be empty for verification purpose! Please input them!");
		}
	};
	
	$scope.me = function(){
		console.log("Me called");
		MainSvc.me(function(res){
			console.log(res);
			$localStorage.myDetail = res.data;
			$scope.myDetail = $localStorage.myDetail;
		}, function() {
			$rootScope.error = 'Failed to fetch details';
		});
	};
			  
	$scope.logout = function() {
		console.log("logout called");
		MainSvc.logout(function(){
			$location.path("/");
			$localStorage.myDetail = null;
			$scope.myDetail = null;
		}, function() {
			alert("Failed to logout!");
		});
	};
	
	$scope.checkForgotPassword = function(){
		console.log("It called wrongCount: " + $localStorage.wrongCount);
		if ($localStorage.wrongCount >= 3)
		{			
			$scope.isHideForgot = false;
		}
		else
		{
			$scope.isHideForgot = true;
		}
	};
		
	// Hide & show password function
	$scope.hideShowPassword = function(){
		if ($scope.inputType == 'password')
			$scope.inputType = 'text';
		else
			$scope.inputType = 'password';
	};
	
/* 	var currentTime = new Date();
	if (($localStorage.expiretime && $localStorage.expiretime > currentTime))
	{
		console.log("Clear token information from local storage");
		$localStorage.token = "";
	}
	else
	{
		$localStorage.expiretime = currentTime.now + 86400000;
	} */
	
	$scope.myDetail = $localStorage.myDetail;
	$scope.token 	= $localStorage.token;
	
	// Set the default value of inputType
	$scope.inputType = 'password';	 
	
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
		// If the information is lacked
		if ( $scope.myDetail != null )
		{
			var statistic_user_id = $scope.myDetail._id;
			$scope.strViewingUser = $scope.myDetail.username;
			$scope.bFriendRequestSent 		= false;
			$scope.bSendFriendRequest 		= false; // false 
			$scope.bResponseFriendRequest	= false; // false 
			$scope.bRequestFollowRequest 	= false; // false 
			$scope.bBeFriend		 		= false; // false 
			console.log($scope.myDetail);
			console.log($localStorage.lastSelectedItem);
			if ( $stateParams.userid !== "undefined" && $scope.myDetail._id !== "undefined" ){
				// If you are viewing the control panel view of others
				if ( $stateParams.userid !== $scope.myDetail._id )
				{
					if ( $localStorage.lastSelectedItem.id == $stateParams.userid ){
						statistic_user_id = $stateParams.userid;
						$scope.strViewingUser = $localStorage.lastSelectedItem.username;
						// If the user has not been your friend
						if ($scope.myDetail.friends.length >= 0 &&
							$scope.myDetail.friends.indexOf($stateParams.userid) === -1 )
						{
							// If you has sent a request to the user					
							if ( $scope.myDetail.wait_response_friends.indexOf($stateParams.userid) !== -1 )
							{
								console.log("Waiting for response friends");
								$scope.bFriendRequestSent = true;
							}
							else if ( // if you received a friend request from user
									 $scope.myDetail.request_friends.indexOf($stateParams.userid) !== -1 )
							{
								console.log("Received a friend request");
								$scope.bResponseFriendRequest = true;
							} 
							else
							{
								console.log("Received a friend request");
								$scope.bSendFriendRequest 	= true;
								
								// If you haven't sent a friend request, you can request to follow a user
								if ( $scope.myDetail.followers.indexOf($stateParams.userid) === -1)
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
			}
			
			$scope.myid = statistic_user_id;
			console.log(statistic_user_id + " - " + $scope.myDetail._id + " or " + $stateParams.userid);
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
					$scope.currentUser = $scope.myDetail;			
				}
			}, function(err){
				console.log(err);
			});
		}
	}
	
	// Init get statistic information
	$scope.me();
	$scope.getStatistic();
	
	$scope.sendFriendRequest = function(){
		console.log("Send Friend Request");
		//console.log($scope.myDetail);
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
		//console.log($scope.myDetail);
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
		//console.log($scope.myDetail);
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
	
	$scope.getServerDocumentPath = function(path){
		// console.log("come here 8!");
		return DocumentSvc.getDocPath(path);
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
