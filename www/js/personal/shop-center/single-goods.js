/*
 * 单个商品统计Controller
 * wangshuang 20160218
 **/

CYXApp.controller('singleGoodsController', ['$scope', 'SingleGoodsService', '$stateParams', '$ionicHistory','$ionicPopup','$state','PopupService',
    function ($scope, SingleGoodsService, $stateParams, $ionicHistory,$ionicPopup,$state,PopupService) {
        //筛选条件
        $scope.search = {
            screenStart: '',   //筛选开始时间
            screenEnd: ''      //筛选结束时间
        };
        //是否显示时间筛选页面
        $scope.isShowDate = false;
        //从商品统计页面获取商品名称
        $scope.goodsId = $stateParams.goodsId;
        //分页
        $scope.singGoodsNo = 1;
        $scope.pageSize = 10;
        $scope.pageNo = 1;
        $scope.sumTotal = 0;
        $scope.hasMore = false;


       $scope.init = function(){
         $scope.goodsNo = 1;
         $scope.pageSize = 10;
         $scope.sumTotal = 0;
         $scope.hasMore = false;
         $scope.goodsId = $stateParams.goodsId;

         $scope.search = {
           screenStart: '',   //筛选开始时间
           screenEnd: ''      //筛选结束时间
         };
         $scope.loadData();
       } ;

        //加载数据
        $scope.loadData = function () {
            var param = {
                startDate:$scope.search.screenStart,
                endDate:$scope.search.screenEnd,
                goodsId:$scope.goodsId,
                pageNo:$scope.pageNo,
                displayCount:$scope.pageSize
            };

            SingleGoodsService.getSingleGoodsList(param).then(function (response) {
                var result = response.data;
                if (result.code == 0) {
                    $scope.singleGoodsList = result.data;
                    //调用echarts面积图
                    showEcharts()

                }
                //注意对请求失败的状态原因 区分处理 ，
                if ('net-error') {

                } else if ('500') {

                }

            }).finally(function (response) {


            });

        };
        //echarts
        function showEcharts(){
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
                    'echarts/chart/line',
                    'echarts/chart/bar'
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    $scope.myChart = ec.init(document.getElementById('singleGoodsBroken'));

                    $scope.option = {
                        backgroundColor:'white',
                        grid: {
                            x: 40,
                            y: 10,
                            x2: 33,
                            y2: 25
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'none'
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: (function () {
                                    var res = [];
                                    var len = $scope.singleGoodsList.length;
                                    while (len--) {//日期 坐标点 push
                                        res.push(
                                         $scope.singleGoodsList[len].date
                                        );
                                    }
                                    return res;
                                })()
                            }
                        ],
                        axis: [
                            {
                                splitLine: {
                                    show:false
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value} '
                                }

                            }
                        ],
                        series: [
                            {
                                name: '销量',
                                type: 'line',
                                smooth: true,
                                symbolSize: 0,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {            // 系列级个性化折线样式，横向渐变描边
                                            type: 'default',
                                            color: '#3bc4e9'
                                        },
                                        lineStyle:{
                                            color: '#3bc4e9'
                                        }
                                    },
                                    emphasis: {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle:{
                                                color:'#3bc4e9',
                                                fontSize:16
                                            }
                                        },
                                        lineStyle:{
                                            color: '#3bc4e9'
                                        }
                                    }
                                },
                                data: (function () {
                                    var res = [];
                                    var len = $scope.singleGoodsList.length;
                                    while (len--) {
                                        res.push(
                                            $scope.singleGoodsList[len].salesCount
                                        );
                                    }
                                    return res;
                                })()
                            }
                        ]
                    };
                    $scope.myChart.setOption($scope.option);
                });
        }

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
            var startResult = $("#sgStartDate").val();
            var endResult = $("#sgEndDate").val();
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
              $scope.search = {
                screenStart: startResult + ' 00:00:00',   //筛选开始时间
                screenEnd: endResult+ ' 00:00:00'      //筛选结束时间
              };
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
 * 单个商品统计Service
 * by wangshuang 20160218
 */
CYXApp.service('SingleGoodsService', ['$http', 'UrlService', function ($http, UrlService) {
    this.getSingleGoodsList = function (requestParams) {
        var url = UrlService.getUrl('SINGLE_GOODS');
        return $http.post(url, requestParams);
    };
}]);
