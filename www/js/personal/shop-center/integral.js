/*
 * 积分信息Controller
 * wangshuang 20160218
 **/

CYXApp.controller('integralController', ['$scope', 'IntegralService', '$ionicHistory', '$ionicPopup','UserService','PopupService','$state',
   '$stateParams','$timeout',
    function ($scope, IntegralService, $ionicHistory, $ionicPopup,UserService,PopupService,$state, $stateParams,$timeout) {
      //$scope.score= $stateParams.score;
      //$scope.headImg=$stateParams.headImg;
      //console.log("积分统计"+ $scope.score);
      $scope.hasMoreData=false;//默认不加载下拉刷新
      var upDataFlag=false;//是否加载更多
        //筛选条件
        $scope.search = {
            screenStart: '',   //筛选开始时间
            screenEnd: ''      //筛选结束时间
        };
        //是否显示时间筛选页面
        $scope.isShowDate = false;
        //分页
        $scope.integralNo = 1;
        $scope.pageSize =5;
        $scope.sumTotal = 0;
      var startResult;//开始时间
      var endResult  ;//结束时间

      //  下拉刷新
      $scope.loadMore = function(){
        $scope.pageNo++;
        var params = {
          startDate:startResult,
          endDate: endResult,
          displayCount: $scope.pageSize,//每页数据条数（必填）
          pageNo:  $scope.pageNo//页码（必填）
        };
        loadData( true,params);
        console.log('more ....pageNo--'+ $scope.pageNo);

      };

        //数据加载
      function loadData(upDataFlag,params) {

            IntegralService.getIntegralList(params).then(function (response) {
                var result = response.data;
                if (result.code == 0) {
                  console.log('积分信息 response = ' + JSON.stringify(response.data));
                  if(upDataFlag){
                    $scope.integralData =  $scope.integralData.concat(result.data);

                  }else{
                    $scope.pageNo=1;
                    $scope.hasData=true;
                    $scope.integralData = result.data;
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
        //时间筛选页面显示
        $scope.openModal = function () {
            $scope.isShowDate = true
        };
        //时间筛选页面关闭
        $scope.closeModal = function () {
            $scope.isShowDate = false
        };
        //根据时间进行筛选
        $scope.dateScreen = function () {
             startResult = $("#iStartDate").val()+' '+'00:00:00';
             endResult = $("#iEndDate").val()+' '+'00:00:00';
            if (!startResult || !endResult) {
                var popup = $ionicPopup.alert({
                    title: '提示',
                    template: '日期不能为空'
                });
            }else if (startResult > endResult) {
                var alert = $ionicPopup.alert({
                    title: '提示',
                    template: '开始日期不能大于结束日期'
                });
            } else {
                $scope.isShowDate = false;
                var params = {
                  startDate: startResult,
                  endDate: endResult,
                  displayCount: $scope.pageSize,//每页数据条数（必填）
                  pageNo: 1//页码（必填）
                };
                loadData(false,params);
                console.log(params);
            }
        };
      function getSellerInfo(){
        var params={
        };
        IntegralService.getSellerInfo(params).then(function (response) {
          console.log('获取卖家信息 response = ' + JSON.stringify(response.data));
          if (!response.data) {
            //请求失败
            return;
          }
          var result = response.data;
          if (result.code == 0) {
            $scope.score=  result.data.score;
            $scope.headImg=result.data.headImg;
            console.log("积分统计"+ $scope.score);
          }

        });
      }
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
        $scope.$on('$ionicView.beforeEnter', function (e, v) {
          if(v.direction == 'backward'){//不需要刷新
          }else{
            getSellerInfo();
            startResult='';
            endResult = '';
            var params = {
              startDate:startResult,
              endDate: endResult,
              displayCount: $scope.pageSize,//每页数据条数（必填）
              pageNo: 1//页码（必填）
            };
            loadData( false,params);
          }
        });

    }]);

/**
 * 积分信息Service
 * by wangshuang 20160218
 */
CYXApp.service('IntegralService', ['$http', 'UrlService', function ($http, UrlService) {
    this.getIntegralList = function (requestParams) {
        var url = UrlService.getUrl('INTEGRAL');
        console.log('url = ' + url);
        return $http.post(url, requestParams);
    };
  this.getSellerInfo = function (requestParams) {
    var url = UrlService.getUrl('SELLER_INFO');
    console.log('url = ' + url);
    return $http.post(url, requestParams);
  };
}]);
