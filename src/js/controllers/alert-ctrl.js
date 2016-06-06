/**
 * Alerts Controller
 */

angular
    .module('SDLMSys')
    .controller('AlertsCtrl', ['$scope', AlertsCtrl]);

function AlertsCtrl($scope) {
    $scope.alerts = [{
        type: 'success',
        msg: 'It is a successful process'
    }, {
        type: 'danger',
        msg: 'There is a problem occured, please ask your administration to diagnostic and to fix it.'
    }];

    $scope.addAlert = function() {
        $scope.alerts.push({
            msg: 'Oh la la, There is a new thing pop up!'
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}