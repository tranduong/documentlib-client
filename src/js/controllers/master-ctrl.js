' use strict' ;
/**
 * Master Controller
 */

angular.module('SDLMSys')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$localStorage', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $localStorage) {
	console.log("Constructing MasterCtrl...");	
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
	console.log($scope);
	
	$scope.myDetail = $localStorage.myDetail;
	$scope.token = $localStorage.token;
}