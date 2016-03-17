/********************************

 creator:dhc-jiangfeng
 create time:2016/2/19
 describe：店铺地图页面Controller

 ********************************/
CYXApp.controller('shopMapController', ['$scope', '$stateParams', '$ionicHistory', '$state','$ionicGesture',
    function ($scope, $stateParams, $ionicHistory, $state,$ionicGesture) {

        //第一部分 页面绑定的数据  写注释 根据需要 初始化
        var map = null;//地图对象，嵌入到页面对应Id的标签中
        var lnglat = [];//地图中心经纬度
        //第二部分 必备方法
        var AMapArea = document.getElementById('amap');
        AMapArea.parentNode.style.height = "100%";
        if (typeof AMap != 'undefined') {
            map = new AMap.Map('map-container', {//地图对象
                resizeEnable: 'true',
                zoom: 17
            });
        }
        //地图显示
        function showOneAddress() {//根据传入地址，定位店铺

            map.setCenter(lnglat);
            AMap.plugin(['AMap.ToolBar'], function () {
                var toolBar = new AMap.ToolBar(
                    {
                        offset: new AMap.Pixel(0, 110)
                    }
                );
                map.addControl(toolBar);
            });
            var content = '<div class="info-title">高德地图</div><div class="info-content">' +
                '<img src="http://webapi.amap.com/images/amap.jpg">' +
                '高德是中国领先的数字地图内容、导航和位置服务解决方案提供商。<br/>' +
                '<a target="_blank" href = "http://mobile.amap.com/">点击下载高德地图</a></div>';
            var marker = new AMap.Marker({
                position: lnglat
            });
            marker.content = content;
            marker.on('click', markerClick);
            marker.setMap(map);
            map.plugin('AMap.AdvancedInfoWindow', function () {//信息窗体
                var infoWindow = new AMap.AdvancedInfoWindow({
                    panel: 'map-panel',
                    placeSearch: true,
                    asOrigin: true,
                    asDestination: true,
                    content: content,
                    offset: new AMap.Pixel(0, -30)
                });
                infoWindow.open(map, lnglat);
            });

            function markerClick(e) {//点击标记点，显示信息窗体
                var infoWindow = new AMap.AdvancedInfoWindow({
                    panel: 'map-panel',
                    offset: new AMap.Pixel(0, -30)
                });
                infoWindow.setContent(e.target.content);
                infoWindow.open(map, e.target.getPosition());
            }
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

        //第三部分 相应事件的方法 ,命名或者用业务含义 比如 submit，toDetail

        //第四部分  ionic 事件 或者自定义事件的监听
        $scope.$on('$ionicView.beforeEnter', function (e, v) {
            var address = "";//传入的店铺地址
            address = $stateParams.address;
            map.plugin('AMap.Geocoder', function (e, v) {
                //实例化Geocoder
                geocoder = new AMap.Geocoder({
                    city: "全国"//城市，默认：“全国”
                });
                //地理编码
                geocoder.getLocation(address, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        var geocode = result.geocodes[0].location;
                        citycode = result.geocodes[0].addressComponent.citycode;
                        lnglat = [geocode.getLng(), geocode.getLat()];
                        console.log("地理解析结果:" + lnglat);
                        showOneAddress();
                    } else {
                        //获取经纬度失败
                    }
                });
            });
        });
        $ionicGesture.on('drag', function (e) {

                angular.element(document.getElementById('map-panel'))[0].scrollTop =
                    angular.element(document.getElementById('map-panel'))[0].scrollTop -0.1*e.gesture.deltaY;

            }, angular.element(document.querySelector('#map-panel'))
        );
        $scope.$on('$ionicView.afterLeave', function (e, v) {


        });

        $scope.$on('$destroy', function () {
            //$scope.modal.remove();
        });

    }]);
