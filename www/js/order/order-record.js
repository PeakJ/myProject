/**
 * 核销记录页面Controller
 *
 */
CYXApp.controller('orderRecordController', ['$scope', 'OrderRecordService', '$state', '$timeout', 'PopupService', '$ionicHistory',
  '$ionicPopup',
  function ($scope, OrderRecordService, $state, $timeout, PopupService, $ionicHistory, $ionicPopup) {

    $scope.isShowDate = false;//显示时间筛选页面
    $scope.isShowButton = true;//显示筛选按钮button
    $scope.orderRecords;//核销记录数据
    $scope.hasMoreData=false;//默认不加载下拉刷新
    $scope.pageNo = 1;//页码
    $scope.pageSize = 5;//每页数据条数
    $scope.sumTotal = 0;//数据总条数
    var upDataFlag=false;//是否加载更多
    var startResult1;
    var endResult ;
    var mobile;
    $scope.orderRecord = {id: ''};//订单号


    /**
     * 获取核销记录
     */
    function loadData(upDataFlag,params) {
      if(!upDataFlag){
        $scope.orderRecords='';
      }
      OrderRecordService.getDealOrderList(params).then(function (response) {
        console.log('核销记录 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          if(upDataFlag){
            $scope.orderRecords =  $scope.orderRecords.concat(result.data);

          }else{
            $scope.pageNo=1;
            $scope.orderRecords = result.data;
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
    }
    //  下拉刷新
    $scope.loadMore = function(){
      $scope.pageNo++;
      var params = {
        startDate:startResult1,
        endDate: endResult,
        displayCount: $scope.pageSize,//每页数据条数（必填）
        pageNo:  $scope.pageNo//页码（必填）
      };
      loadData( true,params);
      console.log('more ....pageNo--'+ $scope.pageNo);

    };
    /**跳转核销记录订单详情*/
    $scope.onRecordNumClick = function (orderId) {
      var prams = {
        orderId: orderId

      };
      $state.go('orderDetail', prams);


    };
    /**取消核销记录*/
    $scope.onCancelRecordClick = function (orderId) {
      var params = {
        orderId: orderId
      };

      OrderRecordService.cancelOrderRecord(params).then(function (response) {
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          console.log("核销记录取消成功"+result.data);
          PopupService.showMsg(result.data);
         //刷新
          var params = {
            startDate:startResult1,
            endDate: endResult,
            mobile: mobile,
            pageNo:   1,
            displayCount:$scope.pageSize //每页显示数量
          };
          loadData(false, params);
        }
      });

    };
    /** 返回上一页面 */
    $scope.goBack = function () {
      if (!$ionicHistory.backView()) {
        $state.go('home');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };
    /** 根据订单号查询记录 */
    $scope.onScreenRecordClick = function (tel) {
      mobile=tel;
      console.log('订单号' + mobile);
      //if (memberMobile == 0) {
      //  $ionicPopup.alert({
      //    title: '提示',
      //    template: '请输入订单号'
      //  });
      //  return;
      //}
      var params = {
        startDate:startResult1,
        endDate: endResult,
        mobile: mobile,
        pageNo:   1,
        displayCount:$scope.pageSize //每页显示数量
      };
      console.log('手机号' +params. mobile);
      loadData(false, params);
      //OrderRecordService.searchOrderRecord(prams).then(function (response) {
      //  console.log('手机号查询核销记录 response = ' + JSON.stringify(response.data));
      //  if (!response.data) {
      //    //请求失败
      //    return;
      //  }
      //  var result = response.data;
      //  if (result.code == 0) {
      //    if ($scope.orderRecords.length == 0) {
      //       $ionicPopup.alert({
      //        title: '提示',
      //        template: '没有找到您所需要的信息！'
      //      });
      //    } else
      //      $scope.orderRecords = result.data;
      //
      //
      //  }
      //});
    };
    //时间筛选页面显示
    $scope.openModal = function () {
      $scope.isShowDate = true;
      $scope.isShowButton = false;
    };
    //时间筛选页面关闭
    $scope.closeModal = function () {
      $scope.isShowDate = false;
      $scope.isShowButton = true;
    };
    //根据时间进行筛选
    $scope.dateScreen = function () {
       startResult1 = $("#orderStartDate").val()+' '+'00:00:00';
       endResult = $("#orderEndDate").val()+' '+'00:00:00';
      if (startResult1 > endResult) {
        var alertPopup = $ionicPopup.alert({
          title: '提示',
          template: '开始日期不能大于结束日期'
        });
      } else {
        $scope.isShowButton = true;
        $scope.isShowDate = false;
        var params = {
          startDate:startResult1,
          endDate: endResult,
          mobile: mobile,
          pageNo:   1,
          displayCount:$scope.pageSize //每页显示数量
        };
        loadData(false, params);
      }
    };
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if(v.direction == 'backward'){//不需要刷新
      }else {
        $scope.pageNo = 1;
        startResult='';
        endResult = '';
        mobile='';
        var params = {
          startDate:startResult1,
          endDate: endResult,
          mobile: mobile,
          pageNo:   1,
          displayCount:$scope.pageSize //每页显示数量
        };
        loadData(false, params);
      }
    });
  }]);

/**
 * 核销记录Service
 *
 */
CYXApp.service('OrderRecordService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取核销记录
  this.getDealOrderList = function (requestParams) {
    var url = UrlService.getUrl('ORDER_RECORD');
    console.log("url"+url);
    return $http.post(url, requestParams);
  };
  //取消核销记录
  this.cancelOrderRecord = function (requestParams) {
    return $http.post(UrlService.getUrl('DEL_ORDER_RECORD'), requestParams);
  };
  ////查询核销记录
  //this.searchOrderRecord = function (requestParams) {
  //  return $http.post(UrlService.getUrl('GET_ORDER_RECORD_BY_TEL'), requestParams);
  //};

}]);
