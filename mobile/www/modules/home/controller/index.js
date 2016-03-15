/**
 * Created by 11150421050181 on 2015/7/15.
 */
bomApp.controller('HomeCtrl', ['$scope', '$ionicNavBarDelegate', 'MessageService', 'userService', 'businessTripCountService',
    function ($scope, $ionicNavBarDelegate, MessageService, userService, businessTripCountService) {
        //$ionicNavBarDelegate.showBar=false;
        //$ionicNavBarDelegate.showBackButton=false;
        $scope.name = '';
        $scope.src = "img/2.png";
        var userId = userService.getUserId();
        var userLevel = userService.getUserLevel();
        $scope.noMessageAmount = true;
        MessageService.get("userId=" + userId).then(function (data) {
            if (data == 0) {
                $scope.noMessageAmount = false;
            }
            $scope.messageAmount = data;
        });

        $scope.noBusinessTripMessageAmount = true;
        businessTripCountService.get("userId=" + userId + "&userLevel=" + userLevel).then(function (data) {
            if (data == 0) {
                $scope.noBusinessTripMessageAmount = false;
            }
            $scope.businessTripMessageAmount = data;
        });
    }]);