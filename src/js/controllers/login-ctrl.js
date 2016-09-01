'use strict';
/* Authentication Controller */

angular
  .module('SDLMSys')
  .controller('LoginCtrl', ['$rootScope', '$scope', '$route', '$stateParams', '$location', '$localStorage', 'MainSvc', 'DocumentSvc', 'ngDialog', 'PAGINATION',  LoginCtrl]);
  
 function LoginCtrl($rootScope, $scope, $route, $stateParams, $location, $localStorage, MainSvc, DocumentSvc, ngDialog, PAGINATION) {
	console.log("Constructing LoginCtrl...");
		
	$scope.login = function() {
		var datetime = new Date();
		if ($scope.password)
		{
			var hashedPassword = CryptoJS.SHA1($scope.password).toString();
			var formData = {
				email : $scope.email,
				password : hashedPassword
			};
			
			$localStorage.myDetail = null;
			
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
					$location.path("/controlpanel/");
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
	
	$scope.logout = function() {
		console.log("logout called");		
		MainSvc.logout(function(){
			$localStorage.myDetail = null;
			$location.path("/");
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
	
	
	// Set the default value of inputType
	$scope.inputType = 'password';	
	
}
