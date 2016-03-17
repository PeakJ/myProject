/********************************

 creator:dhc-jiangfeng
 create time:2016/2/29
 describe：关键字查询地址Controller

 ********************************/

CYXApp.controller('goodsMapController', ['$scope', '$stateParams', '$ionicHistory', '$cordovaGeolocation',
    'PopupService', '$ionicGesture','$state','$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicHistory, $cordovaGeolocation, PopupService, $ionicGesture,$state,$ionicScrollDelegate) {

        //第一部分 页面绑定的数据  写注释 根据需要 初始化
        var map = null;//地图对象，嵌入到页面对应Id的标签中
        var keywords = '';//接收传入的地址关键字，据此查找地点
        var city = ''; //定位的当前城市
        //第二部分 必备方法
        //获取用户所在城市信息
        var AMapArea = document.getElementById('amap-goods');
        AMapArea.parentNode.style.height = "100%";
        function showCityInfo() {
            $cordovaGeolocation.getCurrentPosition()
                .then(function (position) {
                    var lnglatXY = [position.coords.longitude, position.coords.latitude]; //已知点坐标
                    if (typeof AMap != 'undefined') {
                        map = new AMap.Map('map-container-goods', {//地图对象
                            resizeEnable: 'true',
                            center: lnglatXY,
                            zoom: 17
                        });
                        var geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                        });
                        geocoder.getAddress(lnglatXY, function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                if (result.regeocode.addressComponent.city) {
                                    city = result.regeocode.addressComponent.city;
                                } else {
                                    city = result.regeocode.addressComponent.province;
                                }
                                showMultiAddress();
                            }
                        });
                    }
                }, function (error) {
                    PopupService.showMsg('定位失败');
                });
        }

        function showMultiAddress() {//根据关键字搜索多个对应地址
            AMap.plugin(['AMap.ToolBar'], function () {
                var toolBar = new AMap.ToolBar({
                    offset: new AMap.Pixel(0, 110)
                });
                map.addControl(toolBar);
            });
            AMap.service(["AMap.PlaceSearch"], function () {
                var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                    pageSize: 5,
                    pageIndex: 1,
                    city: city, //城市，默认为全国
                    map: map,
                    panel: "map-panel-goods"
                });
                //关键字查询
                placeSearch.search(keywords);
            });
        }
        //返回
        $scope.goBack = function(){
            //$ionicHistory.goBack();
            //判断wap是否能获取到上一页路由 没有则返回首页
            if(!$ionicHistory.backView()){
                $state.go('home');
                return;
            }
            ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
        };
        //第三部分 相应事件的方法 ,命名或者用业务含义 比如 submit，toDetail

        //第四部分  ionic 事件 或者自定义事件的监听

        $scope.$on('$ionicView.beforeEnter', function (e,v) {
            keywords = $stateParams.keywords;
            showCityInfo();
        });
        $ionicGesture.on('drag', function (e) {

                angular.element(document.getElementById('map-panel-goods'))[0].scrollTop =
                angular.element(document.getElementById('map-panel-goods'))[0].scrollTop -0.1*e.gesture.deltaY;


            }, angular.element(document.querySelector('#map-panel-goods'))
        );
    }]);
