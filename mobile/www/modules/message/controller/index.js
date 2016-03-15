/**
 * Created by 11150421050181 on 2015/8/3.
 */
bomApp.controller('messageCtrl', ['$scope', 'userService','$state', 'MessageService',
    function ($scope,userService, $state, MessageService) {
        $scope.messageAmount = '';
        $scope.noMessageAmount = true;
        var userId = userService.getUserId();
        //未审核任务
        $scope.outMessage = function () {
            $state.go('outMessage');
        };
        console.log(userId);
        MessageService.get("userId="+userId).then(function (data) {
            if(data == 0){
                $scope.noMessageAmount=false;
            }
            $scope.messageAmount = data;
        });


    }]);