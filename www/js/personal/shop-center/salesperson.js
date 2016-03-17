/*
 * 销售员统计Controller
 * wangshuang 20160218
 **/

CYXApp.controller('salespersonController', ['$scope', 'SalespersonService', '$ionicHistory','$timeout',
    function ($scope, SalespersonService, $ionicHistory, $timeout) {
      $scope.hasMoreData=false;//默认不加载下拉刷新
      var upDataFlag=false;//是否加载更多
        //筛选条件
        $scope.search = {
          mobile: ''//销售员手机号
        };
        //分页
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.subTotal = 0;
      //  下拉刷新
      $scope.loadMore = function(){
        $scope.pageNo++;
        var params = {
          mobile: $scope.search.mobile,
          displayCount: $scope.pageSize,//每页数据条数（必填）
          pageNo:  $scope.pageNo//页码（必填）
        };
        getList( true,params);
        console.log('more ....pageNo--'+ $scope.pageNo);

      };


        function getTotal() {
            SalespersonService.getSalespersonList().then(function (response) {
              console.log('销售员统计总数 response = ' + JSON.stringify(response.data));
                var result = response.data;
                if (result.code == 0) {
                    $scope.salespersonTotal = result.data;
                    //$scope.detailSalespersonList = result.data.detail;
                }
                //注意对请求失败的状态原因 区分处理 ，
                if ('net-error') {

                } else if ('500') {

                }

            }).finally(function (response) {


            });

        };
      function getList(upDataFlag,param){

        SalespersonService.getSellerList(param).then(function(response){
          console.log('销售员统计 response = ' + JSON.stringify(response.data));
          if (!response.data) {
            //请求失败
            return;
          }
          var result = response.data;
          if (result.code == 0) {
            if(upDataFlag){
              $scope.detailSalespersonList =  $scope.detailSalespersonList.concat(result.data);

            }else{
              $scope.pageNo=1;
              $scope.detailSalespersonList = result.data;
            }
            $scope.sumTotal=result.sumTotal;
            console.log(" $scope.sumTotal:"+ $scope.sumTotal+";;"+($scope.sumTotal/$scope.pageSize));
            if($scope.sumTotal/$scope.pageSize>=$scope.pageNo ){
              $timeout(function(){
                $scope.hasMoreData=true;
              },1000);

            }else{
              $scope.hasMoreData=false;
              console.log("没有更多数据了");
            }
            console.log("是否还有更多数据"+$scope.hasMoreData);
          }
          if(upDataFlag){
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      };
        //根据销售员手机号码进行筛选
        $scope.screenSalesPerson = function () {

                var params = {
                  mobile: $scope.search.mobile,
                  pageNo:1,
                  displayCount:  $scope.pageSize
                };
              getList(false,params);
                console.log(params.mobile);

        };

        //返回
        $scope.goBack = function () {
            //$ionicHistory.goBack();
            //判断wap是否能获取到上一页路由 没有则返回首页
            if (!$ionicHistory.backView()) {
                $state.go('home');
                return;
            }
            ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
        };
      $scope.$on('$ionicView.beforeEnter',function(e,v){
        if(v.direction == 'back'){//不需要刷新
        }else{
          //需要刷新
          getTotal();
          var param ={
            pageNo:1,
            displayCount:  $scope.pageSize,
            mobile:''
          };
          getList(false,param);
        }
      });
    }]);


/**
 * 销售员统计Service
 * by wangshuang 20160218
 */
CYXApp.service('SalespersonService', ['$http', 'UrlService', function ($http, UrlService) {

    this.getSalespersonList = function (requestParams) {
      requestParams={
      };
        var url = UrlService.getUrl('SALESPERSON');
        console.log('url = ' + url);
        return $http.post(url, requestParams);
    };
  this.getSellerList = function (requestParams) {
    var url = UrlService.getUrl('SELLER_LIST');
    console.log('url = ' + url);
    return $http.post(url, requestParams);
  };

}]);
