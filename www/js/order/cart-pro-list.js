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
 *  Service 模块服务
 **/

/**
 *  Service 指令
 **/

/**
 *   controller 控制器信息
 *
 * **/

cdfgApp.controller('CartProListController', ['$scope', '$window', '$state','CartService','$stateParams', function ($scope, $window, $state,CartService,$stateParams) {
 var type=$stateParams.type;
 type=type=='freePro'?'freePro':'commPro';
console.log(type);
 $scope.orderList = CartService.getOrderProList()[type];
 console.log($scope.orderList);
  if(!$scope.orderList){
   $state.go('cart');
  }

}]);


























