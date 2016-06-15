' use strict' ;
/* Authentication Controller */

angular
  .module('SDLMSys')
  .controller('AuthCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainSvc', AuthCtrl]);
  
 function AuthCtrl($rootScope, $scope, $location, $localStorage, MainSvc) {
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
					$localStorage.token = res.data.token;
					$localStorage.expiretime = datetime.now  + 86400000; // 1 minutes to test, after 24 hours - 86400000
					window.location = "#/controlpanel";
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
						$localStorage.token = res.data.token;
						$localStorage.expiretime = datetime.now + 86400000; // 1 minutes to test, after 24 hours - 86400000
						window.location = "#/registersuccessful";
					}				
				}, function() {
					$rootScope.error = 'Failed to Register';
					window.location = "#/registerfailed";
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
			$scope.myDetails = res;
		}, function() {
			$rootScope.error = 'Failed to fetch details';
		});
	};
			  
	$scope.logout = function() {
		console.log("logout called");
		MainSvc.logout(function(){
			window.location = "/";
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
	$scope.token = $localStorage.token;
	
	// Set the default value of inputType
	$scope.inputType = 'password';	 
	
	$scope.getStatistic = function(){
		MainSvc.getStatistic(function(success){
			$scope.stats = success;
			// console.log(success);
		}, function(err){
			console.log(err);
		});		
	}
	
	// Init get statistic information
	$scope.getStatistic();
}
