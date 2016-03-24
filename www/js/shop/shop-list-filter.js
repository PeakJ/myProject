/**
 * 免税店列表
 *
 * @author：葛硕
 * 2015/8/14
 *
 * */
cdfgApp.controller('ShopListFilterController', ['$scope', '$ionicHistory',
    '$ionicScrollDelegate', '$stateParams', '$rootScope', '$cordovaGeolocation',
    function ($scope, $ionicHistory, $ionicScrollDelegate, $stateParams, $rootScope, $cordovaGeolocation) {

        $scope.goBack = goBack;//返回上一页
        $scope.changeCity = changeCity;//选择城市
        $scope.loadData = loadData;//加载数据

        var shopScroll = $ionicScrollDelegate.$getByHandle('shop-list-handle');//页面滚动对象

        /*返回上一页*/
        function goBack() {
            $ionicHistory.goBack();
        }

        //判断是否刷新页面
        $scope.$on('$ionicView.beforeEnter', function () {
            loadData();
        });

        /*加载页面数据*/
        function loadData() {
            $scope.shopListAll = [];//全部免税店
            $scope.shopList = [];//免税店列表数据
            $scope.letter = [];//字母数据
            $scope.cityData = {
                selectedCity: $stateParams.selectedCity ? $stateParams.selectedCity : 0//所选城市
            };

            //取免税店城市数据
            $scope.cityList = JSON.parse($stateParams.shopCities);

            //筛选页面字母数据
            $scope.letter.push(0);
            for (var i = 0; i < 26; i++) {
                $scope.letter.push(String.fromCharCode(65 + i));
            }
            console.log($scope.letter);

            //获取经纬度
            $cordovaGeolocation.getCurrentPosition().then(function (position) {

                var map = new BMap.Map("map"); //在相应的DOM处展现地图
                var point = new BMap.Point(position.coords.longitude, position.coords.latitude);
                var gc = new BMap.Geocoder();
                //根据当前地图中心点，获取详细的位置信息：省市区街道牌号等
                gc.getLocation(point, function (rs) {
                    var address = rs.addressComponents;
                    if (address.city) {
                        $scope.$apply(function () {
                            var cityName = address.city.substring(0, address.city.length - 1);
                            //var cityName = '上海';
                            for (var i = 0, len = $scope.cityList.length; i < len; i++) {
                                if ($scope.cityList[i].name == cityName) {
                                    $scope.currentCity = cityName;
                                    $scope.currentCityCode = $scope.cityList[i].code;
                                    break;
                                }
                            }
                        });
                    }
                });

            }, function (error) {
                console.log('error');
            });

        }

        // 字母索引用，滚动到指定位置
        $scope.scrollTo = function (top) {
            shopScroll.scrollTo(0, top, true);
        };

        /*选择城市*/
        function changeCity(code) {
            var params = {
                cityCode: code,
                selectedCity: $scope.cityData.selectedCity
            };
            $rootScope.$broadcast('RefreshShopList', params);
            goBack();
        }
    }]);