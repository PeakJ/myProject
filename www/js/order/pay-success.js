/********************************

 creater:maliwei@cdfg.com.cn
 create time:2015/08/1
 describe：订单提交成功
 modify time:2015/06/19

 ********************************/

/**
 *   controller 控制器信息
 *
 * **/

cdfgApp.controller('PaySuccessController', ['$scope', '$stateParams', function ($scope, $stateParams) {

    $scope.order={
       orderId:$stateParams.orderId,
        orderTotal:$stateParams.orderTotal
    };

    console.log($scope.order);
}]);


























