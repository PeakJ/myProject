/*
 * 销售额统计Controller
 * wangshuang 20160218
 **/

CYXApp.controller('volumeStatisticsController', ['$scope', 'VolumeStatisticsService', '$state', '$ionicHistory', '$ionicPopup',
  function ($scope, VolumeStatisticsService, $state, $ionicHistory, $ionicPopup) {
    //筛选条件
    $scope.search = {
      goodsName: '',//药品名称筛选
      screenStart: '',   //筛选开始时间
      screenEnd: ''      //筛选结束时间
    };
    $scope.hasMoreData = false;//默认不加载下拉刷新
    var upDataFlag = false;//是否加载更多
    //是否显示时间筛选页面
    $scope.isShowDate = false;
    //分页
    $scope.pageNo = 1;
    $scope.pageSize = 10;
    $scope.subTotal = 0;
    var startResult;//开始时间
    var endResult  ;//结束时间
    var goodsName;//商品名字
    //下拉加载
    $scope.loadMore = function (param) {
      $scope.pageNo++;
      var params = {
        startDate:startResult,
        endDate: endResult,
        displayCount: $scope.pageSize,//每页数据条数（必填）
        pageNo:  $scope.pageNo//页码（必填）
      };
      $scope.loadData( true,params);
      console.log('more ....pageNo--'+ $scope.pageNo);
    };
    //加载数据
    $scope.loadData = function (upDataFlag,param) {
      VolumeStatisticsService.getVolumeList(param).then(function (response) {
        console.log('获取销售额统计信息 response = ' + JSON.stringify(response.data));
        var result = response.data;
        if (result.code == 0) {
          if(upDataFlag){
            $scope.volumeData =  $scope.volumeData.concat(result.data);
          }else{
            $scope.pageNo=1;
            $scope.volumeData = result.data;
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

          var partMoney = 0;
          var len = $scope.volumeData.length;
          if (len > 9) {
            for (var i = 0; i < 9; i++) {
              partMoney = partMoney + $scope.volumeData[i].salesMoney;
            }
            $scope.otherCount =  $scope.volumeTotal.totalSalesMoney - partMoney;
          }
          if(!upDataFlag){
            //使用echarts饼图
            showEcharts();
          }

          if(upDataFlag){
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        }

        //注意对请求失败的状态原因 区分处理 ，
        if ('net-error') {

        } else if ('500') {

        }

      }).finally(function (response) {


      });

    };
    //echarts
    function showEcharts() {
      // 路径配置
      require.config({
        paths: {
          echarts: 'http://echarts.baidu.com/build/dist'
        }
      });
      // 使用
      require(
        [
          'echarts',
          'echarts/chart/pie'
        ],
        function (ec) {
          // 基于准备好的dom，初始化echarts图表
          $scope.myChart = ec.init(document.getElementById('volumePieGraph'));

          $scope.option = {
            animation:false,
            backgroundColor: 'white',
            tooltip: {
              trigger: 'item',
              formatter: "{b}:<br/>{c}({d}%)"
            },
            series: [
              {
                name: '销售额统计',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                calculable: false,
                data: (function () {
                  var res = [];
                  var len = $scope.volumeData.length;
                  if (len <= 9) {
                    while (len--) {
                      res.push({
                        name: $scope.volumeData[len].goodsName,
                        value:$scope.volumeData[len].salesMoney
                      });
                    }
                  } else {
                    for (var i = 0; i < 9; i++) {
                      res.push({
                        value: $scope.volumeData[i].salesMoney,
                        name: $scope.volumeDatat[i].goodsName
                      })
                    }
                    res = res.concat({value: $scope.otherCount, name: '其他'});
                  }
                  return res;
                })(),
                itemStyle: {
                  normal: {
                    label: {
                      formatter: "{b}\n{d}%"
                    },
                    labelLine: {
                      length: 5,
                      lineStyle: {
                        width: 3
                      }
                    }
                  }
                }
              }
            ]
          };
          $scope.myChart.setOption($scope.option);
        });
    }

    //转到单个商品销售额统计页面
    $scope.goSingleVolume = function (gId) {
      $state.go('singleGoods', {goodsId: gId});
    };

    //根据药品名称筛选
    $scope.screenByGoodsName = function () {
      goodsName= $scope.search.goodsName;
        var params = {
            startDate: startResult,
            endDate: endResult,
            pageNo: 1,//页码（必填）
            displayCount: $scope.pageSize,//每页数据条数（必填）
            goodsName: goodsName//商品名称

        };
        $scope.loadData(false,params);
        console.log("goodsName:"+$scope.search.goodsName);
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
       startResult = $("#vStartDate").val()+' '+'00:00:00';
       endResult = $("#vEndDate").val()+' '+'00:00:00';
      if (!startResult || !endResult) {
        var popup = $ionicPopup.alert({
          title: '提示',
          template: '日期不能为空'
        });
      } else if (startResult > endResult) {
        var alert = $ionicPopup.alert({
          title: '提示',
          template: '开始日期不能大于结束日期'
        });
      } else {
        $scope.isShowDate = false;
        var params = {
          startDate: startResult,
          endDate: endResult,
          pageNo: 1,//页码（必填）
          displayCount: $scope.pageSize,//每页数据条数（必填）
          goodsName: goodsName//商品名称
        };
        $scope.loadData(false,params);
        console.log(params);
      }
    };
    //获取销售额总数
    function getTotal() {
      VolumeStatisticsService.getVolumeTotal().then(function (response) {
        console.log('销售额统计总数 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          $scope.volumeTotal = result.data;
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
      goodsName='';
      var params = {
        pageNo: 1,//页码（必填）
        displayCount: $scope.pageSize,//每页数据条数（必填）
        goodsName: goodsName,//商品名称
        startDate: '', //开始日期
        endDate: '' //结束日期

      }
      $scope.loadData(false,params);
      getTotal();
    });
  }]);


/**
 * 销售额统计Service
 * by wangshuang 20160218
 */
CYXApp.service('VolumeStatisticsService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getVolumeList = function (requestParams) {
    var url = UrlService.getUrl('VOLUME_STATISTICS');
    console.log('url = ' + url);
    return $http.post(url, requestParams);
  };
  this.getVolumeTotal = function (requestParams) {
    requestParams = {};
    var url = UrlService.getUrl('VOLUME_TOTAL');
    console.log('url = ' + url);
    return $http.post(url, requestParams);
  };
}]);
