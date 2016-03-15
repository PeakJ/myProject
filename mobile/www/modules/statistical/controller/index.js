//项目
bomApp.controller('statisticalCtrl', ['$scope', 'projectServices', 'checkUtil', 'loadingUtil','userService',
    function ($scope, projectServices, checkUtil, loadingUtil,userService) {
    $scope.trafficData = {
        startDate: '',
        endDate: ''
    };
    $scope.tabIndex0 = function () {
        $scope.submit();
        $scope.tab = 0;
    };
    $scope.submit = function () {
        if ($scope.trafficData.startDate > $scope.trafficData.endDate) {
            checkUtil.f_alert_test('开始日期不能大于结束日期')
            return;
        }
        $scope.applyProject = [];
        $scope.price = [];
        $scope.traffic = [];
        $scope.chartData = [];
        $scope.chartsHeight = 0;
        loadingUtil.show();
        var userId=userService.getUserId();
        console.log(userId);
        var userLevel=userService.getUserLevel();
        console.log(userLevel);
        var param ='userId='+userId+'&userLevel='+userLevel+'&startDate=' + $scope.trafficData.startDate + '&endDate=' + $scope.trafficData.endDate;
        projectServices.get(param).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.traffic.push({
                    applyProject: data[i].applyProject,
                    price: data[i].price,
                    count: data[i].count
                });
                $scope.applyProject.push(
                    data[i].applyProject
                );
                $scope.price.push(
                    data[i].price
                )
            }
            $scope.chartsHeight = data.length * 25+200;
            document.getElementById('objectmain').style.height = $scope.chartsHeight + 'px';
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
                    'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    $scope.myChart = ec.init(document.getElementById('objectmain'));

                    $scope.option = {
                        tooltip: {
                            show: true
                        },
                        legend: {
                            data: ['费用']
                        },
                        animation: !ionic.Platform.isAndroid(),
                        xAxis: [
                            {
                                axisLabel: {
                                    rotate: 30,
                                },
                                type: 'value'
                            }
                        ],
                        yAxis: [
                            {
                                axisLabel: {
                                    rotate: 30,
                                },
                                type: 'category',
                                data: $scope.applyProject
                            }
                        ],
                        grid: {
                            x: 40,
                            x2: 20,
                            y2: 100,
                        },
                        series: [
                            {
                                "name": "费用",
                                "type": "bar",
                                "data": $scope.price
                            }
                        ]
                    };
                    $scope.myChart.setOption($scope.option);
                }
            );

        });
        loadingUtil.hide();
        $scope.price = [];
    };
}
]);
//人员
bomApp.controller('statisticalUserCtrl', ['$scope', 'userServices', 'checkUtil', 'loadingUtil','userService',
    function ($scope, userServices, checkUtil, loadingUtil,userService) {
    $scope.tabIndex1 = function () {
        $scope.submit();
        $scope.tab = 1;
    };

    $scope.trafficData = {
        startDate: '',
        endDate: ''
    };

    $scope.submit = function () {
        if ($scope.trafficData.startDate > $scope.trafficData.endDate) {
            checkUtil.f_alert_test('开始日期不能大于结束日期')
            return;
        }

        $scope.userName = [];
        $scope.price = [];
        $scope.traffic = [];
        $scope.chartData = [];
        $scope.chartsHeight = 0;
        loadingUtil.show();

        console.log($scope.trafficData);
        var userId=userService.getUserId();
        console.log(userId);
        var userLevel=userService.getUserLevel();
        console.log(userLevel);
        var param ='userId='+userId+'&userLevel='+userLevel+'&startDate=' + $scope.trafficData.startDate + '&endDate=' + $scope.trafficData.endDate;
        userServices.get(param).then(function (data) {
            console.log(data);
            for (var i = 0; i < data.businessTripApplys.length; i++) {
                $scope.traffic.push({
                    userName: data.businessTripApplys[i].userName,
                    price: data.traffics[i].price,
                    count: data.businessTripApplys[i].count
                });

                $scope.userName.push(
                    data.businessTripApplys[i].userName
                );
                $scope.price.push(
                    data.traffics[i].price
                )
            }
            $scope.chartsHeight = data.businessTripApplys.length * 25+200;
            document.getElementById('usermain').style.height = $scope.chartsHeight + 'px';

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
                    'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    $scope.myChart = ec.init(document.getElementById('usermain'));

                    $scope.option = {
                        tooltip: {
                            show: true
                        },
                        legend: {
                            data: ['销量']
                        },
                        animation: !ionic.Platform.isAndroid(),
                        xAxis: [
                            {
                                axisLabel: {
                                    rotate: 30,
                                },
                                type: 'value'
                            }
                        ],
                        yAxis: [
                            {
                                type: 'category',
                                data: $scope.userName
                            }
                        ],
                        series: [
                            {
                                "name": "销量",
                                "type": "bar",
                                "data": $scope.price
                            }
                        ]
                    };
                    $scope.myChart.setOption($scope.option);
                }
            );
        });
        loadingUtil.hide();
        $scope.price = [];
    };
}
]);
//交通
//bomApp.controller('statisticalCtrl2',['$scope',function($scope){
bomApp.controller('statisticalTrafficCtrl', ['$scope', 'trafficServices', 'checkUtil', 'loadingUtil', 'userService',function ($scope, trafficServices, checkUtil, loadingUtil,userService) {
    $scope.tabIndex2 = function () {
        $scope.submit();
        $scope.tab = 2;
    };
    $scope.trafficData = {
        startDate: '',
        endDate: ''
    };
    $scope.submit = function () {
        if ($scope.trafficData.startDate > $scope.trafficData.endDate) {
            checkUtil.f_alert_test('开始日期不能大于结束日期')
            return;
        }

        $scope.type = [];
        $scope.price = [];
        $scope.traffic = [];
        var trafficData = [];
        loadingUtil.show();
        var userId=userService.getUserId();
        var userLevel=userService.getUserLevel();
        var param ='userId='+ userId + '&userLevel='+ userLevel + '&startDate=' + $scope.trafficData.startDate + '&endDate=' + $scope.trafficData.endDate;
        trafficServices.get(param).then(function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                $scope.convertTrafficType = function (value) {
                    if (value == '0') {
                        return '飞机';
                    }
                    if (value == '1') {
                        return '火车';
                    }
                    if (value == '2') {
                        return '汽车';
                    }
                    if (value == '3') {
                        return '轮船';
                    }
                };
                $scope.traffic.push({
                    type: $scope.convertTrafficType(data[i].type),
                    price: data[i].price,
                    countType: data[i].countType
                });

                trafficData.push({
                    value : data[i].price,
                    name: $scope.convertTrafficType(data[i].type)
                });

                $scope.price.push(
                    data[i].price
                )
            }
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
                    'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    $scope.myChart = ec.init(document.getElementById('trafficmain'));

                    $scope.option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            y: 'bottom',
                            data: ['飞机', '火车', '长途汽车', '轮船']
                        },
                        animation: !ionic.Platform.isAndroid(),
                        calculable: true,
                        series: [
                            {
                                name: '交通统计',
                                type: 'pie',
                                radius: ['20%', '50%'],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    },
                                    emphasis: {
                                        label: {
                                            show: true,
                                            position: 'center',
                                            textStyle: {
                                                fontSize: '30',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    }
                                },
                                data: trafficData,
                                itemStyle:{
                                    normal:{
                                        label:{
                                            show: true,
                                            formatter: '{b} : ({d}%)'
                                        },
                                        labelLine :{show:true}
                                    }
                                }

                            }
                        ]
                    };
                    $scope.myChart.setOption($scope.option);
                }
            );
        });
        loadingUtil.hide();
        $scope.price = [];
    };
}
]);
//目的地
bomApp.controller('statisticalDestinationCtrl', ['$scope', 'destinationServices', 'checkUtil', 'loadingUtil','userService',
    function ($scope, destinationServices, checkUtil, loadingUtil,userService) {
    $scope.trafficData = {
        startDate: '',
        endDate: ''
    };
    $scope.tabIndex3 = function () {
        $scope.submit();
        $scope.tab = 3;
    };
    $scope.submit = function () {
        if ($scope.trafficData.startDate > $scope.trafficData.endDate) {
            checkUtil.f_alert_test('开始日期不能大于结束日期')
            return;
        }
        $scope.destination = [];
        $scope.price = [];
        $scope.traffic = [];
        $scope.chartData = [];
        $scope.chartsHeight = 0;
        loadingUtil.show();
        var userId=userService.getUserId();
        var userLevel=userService.getUserLevel();
        var param = 'userId='+ userId +'&userLevel=' + userLevel +'&startDate=' + $scope.trafficData.startDate + '&endDate=' + $scope.trafficData.endDate;
        destinationServices.get(param).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.traffic.push({
                    destination: data[i].destination,
                    price: data[i].price,
                    countType: data[i].countType
                })
                $scope.destination.push(
                    data[i].destination
                )
                $scope.price.push(
                    data[i].price
                )
            }
            $scope.chartsHeight = data.length * 25+200;
            document.getElementById('destinationmain').style.height = $scope.chartsHeight + 'px';

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
                    'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    $scope.myChart = ec.init(document.getElementById('destinationmain'));
                    $scope.option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        calculable: true,
                        animation: !ionic.Platform.isAndroid(),
                        xAxis: [
                            {
                                axisLabel: {
                                    rotate: 30,
                                },
                                type: 'value',
                                boundaryGap: [0, 0.01]
                            }
                        ],
                        yAxis: [
                            {
                                type: 'category',
                                data: $scope.destination
                            }
                        ],
                        series: [
                            {
                                type: 'bar',
                                data: $scope.price
                            }
                        ]
                    };
                    $scope.myChart.setOption($scope.option);

                }
            );
        });
        loadingUtil.hide();
        $scope.price = [];
    };
}
]);