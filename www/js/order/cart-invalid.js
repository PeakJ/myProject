/********************************

 creater:maliwei@cdfg.com.cn
 create time:2015/06/19
 describe：购物车
 modify time:2015/06/19

 ********************************/
/**
 State 模块路由
 **/

/**
 State 指令
 **/

/**
 State 过滤器
 **/

/**
 *  Service 模块服务
 **/


/**
 *  Service 指令
 **/

/**
 *   controller 控制器信息
 *
 * **/

cdfgApp.controller('cartInvalidController', ['$scope', '$http', '$location', '$state', 'CartService', function ($scope, $http, $location, $state, CartService) {
    //获取数据
    $scope.validProlist = CartService.getInvalidList();
    console.log($scope.validProlist);
    //返回购物车修改
    $scope.backToCart=function(){
        $state.go('cart');
    }
}]);


























