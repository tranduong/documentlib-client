'use strict';

angular
  .module('SDLMSys')
  .controller('PopupShareCtrl', ['$scope', '$localStorage', 'UserSvc', 'ngDialog', PopupShareCtrl]);
  
function PopupShareCtrl($scope, $localStorage, UserSvc, ngDialog) {
	console.log("Constructing PopupShareCtrl...");

	//console.log($scope.doc_id);
	$scope.friends = [];
	
	$scope.init = function () {
		UserSvc.getMyFriendList(function(res)
		{	
			console.log(res);
			if ( res.type )
			{
				$scope.friends = res.data;
			}
			else
			{
				$scope.friends = [];
			}

		}, function(err){
			$scope.friends = [];
			console.log(err);
		});
	}

	$scope.init();

	
	$scope.shareText 	   = "";
	$scope.selectedFriends = [];

    $scope.compareFn = function(obj1, obj2){
        return obj1._id === obj2._id;
    };

    $scope.checkAll = function() {
        $scope.selectedFriends.splice(0, $scope.selectedFriends.length);
        for (var i in $scope.friends) {
             $scope.selectedFriends.push($scope.friends[i]);
        }
    };

    $scope.uncheckAll = function() {
        $scope.selectedFriends.splice(0, $scope.selectedFriends.length);
    }
	
	$scope.submit = function(){
		var data = {};
		console.log($scope.shareText);
		console.log($scope.selectedFriends);
		data.toFriends = $scope.selectedFriends;
		data.shareText = $scope.shareText;
		$scope.userInteract($scope.doc_id, 'share', data);
		ngDialog.close();
	}
	

}