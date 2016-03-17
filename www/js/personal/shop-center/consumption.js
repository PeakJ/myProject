/*
 * 会员消费记录Controller
 * wangshuang 20160218
 **/

CYXApp.controller('consumptionController', ['$scope', 'ConsumptionService', '$stateParams', '$ionicHistory', '$ionicPopup', '$state',
  function ($scope, ConsumptionService, $stateParams, $ionicHistory, $ionicPopup, $state) {
    /*页面绑定的数据*/
    //会员消费记录列表
    $scope.consumptionList = [];
    $scope.hasMoreData = false;//默认不加载下拉刷新
    var upDataFlag = false;//是否加载更多
    var startTime;//开始时间
    var endTime;//结束时间
    var orderId;//订单id
    //搜索及筛选条件
    $scope.search = {
      orderId: '',     //订单编号筛选
      screenStart: '',   //筛选开始时间
      screenEnd: ''      //筛选结束时间
    };
    //获取会员信息页面的会员id
    $scope.memberId = $stateParams.memberId;
    $scope.memberAccount=$stateParams.memberAccount;
    console.log($stateParams.memberId);
    //是否显示时间筛选页面
    $scope.isShowDate = false;
    //分页
    $scope.consumptionNo = 1;
    $scope.pageSize = 10;
    $scope.subTotal = 0;
    //下拉加载
    $scope.loadMore = function () {
      $scope.pageNo++;
      var params = {
        startDate: startTime,
        endDate: endTime,
        orderId: orderId,
        displayCount: $scope.pageSize,//每页数据条数（必填）
        pageNo:  $scope.pageNo//页码（必填）
      };
      loadData( true,params);
      console.log('more ....pageNo--'+ $scope.pageNo);

    };
    //};
    //加载数据
    function loadData(upDataFlag,param) {
      ConsumptionService.getConsumptionList(param).then(function (response) {
        console.log('会员消费记录 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          if(upDataFlag){
            $scope.consumptionList =  $scope.consumptionList.concat(result.data);

          }else{
            $scope.pageNo=1;
            $scope.hasData=true;
            $scope.consumptionList = result.data;
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

    //根据订单编号筛选
    $scope.screenByOrderID = function () {
      console.log("orderId:" + $scope.search.orderId);
      var params = {
        startDate: startTime,
        endDate: endTime,
        orderId: $scope.search.orderId,
        displayCount: $scope.pageSize,//每页数据条数（必填）
        memberId:  $scope.memberId,
        pageNo: 1//页码（必填）
      };
      loadData(false, params);
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
     var startResult = $("#cStartDate").val();
      var endResult = $("#cEndDate").val() ;
    //  console.log(startResult+"----"+endResult);
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
        startTime=startResult+ ' ' + '00:00:00';
        endTime=endResult+ ' ' + '00:00:00';
        var params = {
          startDate: startTime,
          endDate: endTime,
          orderId: $scope.search.orderId,
          displayCount: $scope.pageSize,//每页数据条数（必填）
          memberId:  $scope.memberId,
          pageNo: 1//页码（必填）
        };

        loadData(false,params);
        console.log("params:"+params);
      }
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
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if(v.direction == 'backward'){//不需要刷新
      }else {
        startTime = '';
        endTime = '';
        orderId = $scope.search.orderId;
        var params = {
          startDate: startTime,
          endDate: endTime,
          memberId:  $scope.memberId,
          displayCount: $scope.pageSize,//每页数据条数（必填）
          pageNo: 1//页码（必填）
        };
        loadData(false, params);
      }
    });
  }]);


/**
 * 会员消费记录Service
 * by wangshuang 20160218
 */
CYXApp.service('ConsumptionService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getConsumptionList = function (requestParams) {
    var url = UrlService.getUrl('CONSUMPTION');
    console.log('url = ' + url);
    return $http.post(url, requestParams);
  };
}]);
