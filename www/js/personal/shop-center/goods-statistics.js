/*
 * 商品统计Controller
 * wangshuang 20160218
 **/

CYXApp.controller('goodsStatisticsController', ['$scope', 'GoodsStatisticsService', '$state', '$ionicHistory', '$ionicPopup','PopupService',
    function ($scope, GoodsStatisticsService, $state, $ionicHistory, $ionicPopup,PopupService) {

        //筛选条件
        $scope.search = {
            goodsName: '',//根据药品名称筛选
            screenStart: '',   //筛选开始时间
            screenEnd: ''      //筛选结束时间
        };
        //是否显示时间筛选页面
        $scope.isShowDate = false;
        //分页
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.sumTotal = 0;
        $scope.hasMore = false;

        $scope.init = function(){
          $scope.pageNo = 1;
          $scope.pageSize = 10;
          $scope.sumTotal = 0;
          $scope.hasMore = false;

          $scope.search = {
            goodsName: '',//根据药品名称筛选
            screenStart: '',   //筛选开始时间
            screenEnd: ''      //筛选结束时间
          };
          $scope.loadData();

        };

      $scope.loadData = function(){
        getTotal();
        getList();
      };
      function getTotal(){
          var param ={};
        GoodsStatisticsService.getGSTotal(param).then(function(response){

          if (!response.data) {
            //请求失败
            return;
          }
          var result = response.data;
          if (result.code == 0) {
            $scope.goodsData = result.data;

          }else{

          }

        }).finally(function(f){


        });

      }

      function getList(more){
        var param ={//准备参数
          pageNo:$scope.pageNo,
          displayCount:$scope.pageSize,
          startDate:$scope.search.screenStart,
          endDate:$scope.search.screenEnd,
          goodsName:$scope.search.goodsName
        };
        GoodsStatisticsService.getGSList(param).then(function(response){

          if (!response.data) {
            //请求失败
            return;
          }
          var result = response.data;
          if (result.code == 0) {
            if(!more){

              $scope.detailGoodsList = result.data;
              showEcharts();
            }else{//加载更多 饼状图变

            }

          }

        }).finally(function(f){


        });
      };

        //下拉加载
        $scope.loadMore = function (param) {
            //HomeService.getHomeAdsList().then(function (response) {
            //  var result = response.data;
            //  if (result.code == 0) {
            //
            //    $scope.list.concanct = result.data.array;
            //  }
            //});
            $scope.goodsNo++;
            console.log('more ....pageNo--' + $scope.goodsNo);
            //$timeout(function () {
            //
            //
            //},2000);
            //GoodsStatisticsService.getGoodsList(param).then(function (response) {
            //    //console.log('获取健康频道商品 response = ' + JSON.stringify(response.data));
            //    if (!response.data) {
            //        //请求失败
            //        return;
            //    }
            //    var result = response.data;
            //    if (result.code == 0) {
            //        $scope.detailGoodsList = $scope.detailGoodsList.concat(result.data.detail);
            //    }
            //    $scope.$broadcast('scroll.infiniteScrollComplete');
            //});
        };
        //加载数据
       /// $scope.loadData = function (param) {
            //GoodsStatisticsService.getGoodsList(param).then(function (response) {
            //    var result = response.data;
            //    if (result.code == 0) {
            //        $scope.goodsData = result.data;
            //        $scope.detailGoodsList = result.data.detail;
            //        var partCount = 0;
            //        var len = $scope.detailGoodsList.length;
            //        if (len > 9) {
            //            for (var i = 0; i < 9; i++) {
            //                partCount = partCount + result.data.detail[i].salesVolume;
            //            }
            //            $scope.otherCount = result.data.totalSalesCount - partCount;
            //        }
            //        //使用echarts中的饼图
            //        showEcharts();
            //    }
            //    //注意对请求失败的状态原因 区分处理 ，
            //    if ('net-error') {
            //
            //    } else if ('500') {
            //
            //    }
            //
            //}).finally(function (response) {
            //
            //
            //});

      //  };
        //使用echarts
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
                    $scope.myChart = ec.init(document.getElementById('goodsPieGraph'));

                    $scope.option = {animation:false,
                        backgroundColor: 'white',
                        tooltip : {
                            trigger: 'item',
                            formatter: "{b}:<br/>{c}({d}%)"
                        },
                        series: [
                            {
                                name: '商品统计',
                                type: 'pie',
                                radius: '60%',
                                center: ['50%', '50%'],
                                calculable : false,
                                data: (function () {
                                    var res = [];
                                  //$scope.detailGoodsList =[//假数据
                                  //  {goodsName:'111',salesVolume:10},{goodsName:'111',salesVolume:10},
                                  //  {goodsName:'111',salesVolume:10},{goodsName:'111',salesVolume:10},
                                  //  {goodsName:'111',salesVolume:10},{goodsName:'111',salesVolume:10},
                                  //  {goodsName:'111',salesVolume:10},{goodsName:'111',salesVolume:10}
                                  //];
                                    var len = $scope.detailGoodsList.length;
                                    if (len <= 9) {
                                        while (len--) {
                                            res.push({
                                                name: $scope.detailGoodsList[len].goodsName,
                                                value: $scope.detailGoodsList[len].amount
                                            });
                                        }
                                    } else {
                                        for (var i = 0; i < 9; i++) {
                                            res.push({
                                                value: $scope.detailGoodsList[i].amount,
                                                name: $scope.detailGoodsList[i].goodsName
                                            })
                                        }
                                        res = res.concat({value:$scope.otherCount, name: '其他'});
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

        //根据药品名称筛选
        $scope.screenByGoodsName = function () {
            if ($scope.search.goodsName) {
                alert($scope.search.goodsName);
            }
        };
        //跳转到单个商品统计页面
        $scope.goSingleGoods = function (gId) {
            $state.go('singleGoods', {goodsId: gId});
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
            var startResult = $("#gStartDate").val();
            var endResult = $("#gEndDate").val();
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

              $scope.search.screenStart = startResult+' 00:00:00';
              $scope.search.screenEnd = endResult+' 00:00:00';

                $scope.loadData();
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



      $scope.$on('$ionicView.beforeEnter',function(e,v){
            if(v.direction == 'back'){//不需要刷新
            }else{
              //需要刷新
            $scope.init();

            }
          });

    }]);


/**
 * 商品统计Service
 * by wangshuang 20160218
 */
CYXApp.service('GoodsStatisticsService', ['$http', 'UrlService', function ($http, UrlService) {
    //商品统计总数
  this.getGSTotal = function (requestParams) {
        var url = UrlService.getUrl('GOODS_STATISTICS_TOTAL');
        return $http.post(url, requestParams);
    };
  //商品 条目 list统计
  this.getGSList = function (requestParams) {
    var url = UrlService.getUrl('GOODS_STATISTICS_LIST');
    return $http.post(url, requestParams);
  };

}]);
