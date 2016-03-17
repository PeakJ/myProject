/********************************

 creator:dhc-jiangfeng
 create time:2016/2/22
 describe：联系我们Controller

 ********************************/
CYXApp.controller('contactUsController', ['$scope', 'ContactUsService', '$ionicHistory', '$state',
    function ($scope, ContactUsService, $ionicHistory, $state) {
        //第一部分 页面绑定的数据  写注释 根据需要 初始化
        var lnglat = [];//地图中心经纬度
        var map = null;//地图对象，嵌入到页面对应Id的标签中
        $scope.contactInfo;//联系我们具体信息
        //第二部分 必备方法
        $scope.loadData = function () {
            if (typeof AMap != 'undefined') {
                map = new AMap.Map('container_mini', {//地图对象
                    resizeEnable: 'true',
                    zoom: 15
                });
            }

            ContactUsService.getContactInfo().then(function (response) {
                if (!response.data) {
                    //请求失败
                    return;
                }
                var result = response.data;
                if (result.code == 0) {
                    $scope.contactInfo = result.data;
                    if (map) {
                        map.plugin('AMap.Geocoder', function () {//地理反编码（地址-经纬度）
                            //实例化Geocoder
                            geocoder = new AMap.Geocoder({
                                city: "全国"//城市，默认：“全国”
                            });
                            //地理编码
                            geocoder.getLocation(result.data.address, function (status, result) {
                                if (status === 'complete' && result.info === 'OK') {
                                    var geocode = result.geocodes[0].location;
                                    lnglat = [geocode.getLng(), geocode.getLat()];
                                    showMap();
                                } else {
                                    //获取经纬度失败
                                  console.log('获取经纬度失败')
                                }
                            });
                        });
                    }
                }
            });
        };
        //展示地图
        function showMap() {
            map.setCenter(lnglat);
            var marker = new AMap.Marker({//地图点标记
                position: lnglat
            });
            marker.setMap(map);
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
            $scope.loadData();
        })
    }]);


/**
 * 联系我们Service
 * jiangfeng
 */
CYXApp.service('ContactUsService', ['$http', 'UrlService', function ($http, UrlService) {
    this.getContactInfo = function () {
        var url = UrlService.getUrl('CONTACT_US_INFO');
    //    console.log('url = ' + url);
        return $http.post(url);
    };
}]);
