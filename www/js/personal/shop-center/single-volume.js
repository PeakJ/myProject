/*
 * 单个商品销售额统计Controller
 * wangshuang 20160218
 **/

CYXApp.controller('singleVolumeController', ['$scope', 'SingleVolumeService','$stateParams','$ionicHistory','$ionicPopup','$state',
    function ($scope, SingleVolumeService,$stateParams,$ionicHistory,$ionicPopup,$state) {
        //筛选条件
        $scope.search = {
            screenStart: '',   //筛选开始时间
            screenEnd: ''      //筛选结束时间
        };
        //是否显示时间筛选页面
        $scope.isShowDate = false;
        //从商品销售额统计页面获取商品名称
        $scope.goodsName = $stateParams.goodsName;
        //分页
        $scope.singGoodsNo = 1;
        $scope.pageSize = 10;
        $scope.subTotal = 0;
        //下拉加载
        $scope.loadMore = function (param) {
            //HomeService.getHomeAdsList().then(function (response) {
            //  var result = response.data;
            //  if (result.code == 0) {
            //
            //    $scope.list.concanct = result.data.array;
            //  }
            //});
            $scope.singGoodsNo++;
            console.log('more ....pageNo--' + $scope.singGoodsNo);
            //$timeout(function () {
            //
            //
            //},2000);
            SingleVolumeService.getSingleVolumeList(param).then(function (response) {
                //console.log('获取健康频道商品 response = ' + JSON.stringify(response.data));
                if (!response.data) {
                    //请求失败
                    return;
                }
                var result = response.data;
                if (result.code == 0) {
                    $scope.singleVolumeList = $scope.singleVolumeList.concat(result.data);
                    showEcharts();
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        //加载数据
        $scope.loadData = function (param) {
            SingleVolumeService.getSingleVolumeList(param).then(function (response) {
                var result = response.data;
                if (result.code == 0) {
                    $scope.singleVolumeList = result.data;
                    //使用echarts面积图
                    showEcharts();
                }
                //注意对请求失败的状态原因 区分处理 ，
                if ('net-error') {

                } else if ('500') {

                }

            }).finally(function (response) {


            });

        };
        //使用echarts
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
                    $scope.myChart = ec.init(document.getElementById('salesVolumeBroken'));

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
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data: (function () {
                                    var res = [];
                                    var len = $scope.singleVolumeList.length;
                                    while (len--) {
                                        res.push(
                                            $scope.singleVolumeList[len].date
                                        );
                                    }
                                    return res;
                                })()
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series: [
                            {
                                name: '销售额',
                                type: 'line',
                                smooth: true,
                                symbolSize: 0,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {            // 系列级个性化折线样式，横向渐变描边
                                            type: 'default',
                                            color: 'rgba(59,196,233,0.5)'
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
                                    var len = $scope.singleVolumeList.length;
                                    while (len--) {
                                        res.push(
                                            $scope.singleVolumeList[len].salesMoney
                                        );
                                    }
                                    return res;
                                })()
                            },  {
                                name: '销量',
                                type: 'line',
                                smooth: true,
                                symbolSize: 0,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {            // 系列级个性化折线样式，横向渐变描边
                                            type: 'default',
                                            color: 'rgba(59,196,233,0.5)'
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
                                    var len = $scope.singleVolumeList.length;
                                    while (len--) {
                                        res.push(
                                            $scope.singleVolumeList[len].salesCount
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
            var startResult = $("#svStartDate").val();
            var endResult = $("#svEndDate").val();
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
                    endDate: endResult
                };
                $scope.loadData(params);
                console.log(params);
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
            $scope.loadData();
        });
    }]);


/**
 * 单个商品销售额统计Service
 * by wangshuang 20160218
 */
CYXApp.service('SingleVolumeService', ['$http', 'UrlService', function ($http, UrlService) {
    this.getSingleVolumeList = function (requestParams) {
        var url = UrlService.getDebugUrl('SINGLE_VOLUME');
        console.log('url = ' + url);
        return $http.get(url, requestParams);
    };
}]);
