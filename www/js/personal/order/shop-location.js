/**
 * 个人中心-->免税店地理位置图
 * Created by geshuo on 2015/07/02.
 */
cdfgApp.controller('ShopLocationController', ['$scope', '$ionicHistory', '$http', '$state', '$ionicScrollDelegate',
        '$timeout', '$ionicViewSwitcher', 'UrlService', '$stateParams', '$rootScope',
        function ($scope, $ionicHistory, $http, $state, $ionicScrollDelegate, $timeout, $ionicViewSwitcher, UrlService,
                  $stateParams, $rootScope) {

            $scope.loadData = loadData;//加载数据

            /*返回上一页*/
            $scope.goBack = function () {
                $ionicViewSwitcher.nextDirection('back');
                $ionicHistory.goBack();
                clearData();
            };

            //判断是否刷新页面
            $scope.$on('$ionicView.beforeEnter', function () {
                if (!$scope.imgData) {
                    loadData();
                }
            });

            //Android设备back键按下
            $rootScope.$on('goBack', function (event, data) {
                clearData();
            });

            /*清除数据*/
            function clearData() {
                $scope.imgData = null;//图片数据
            }


            /*加载初始数据*/
            function loadData() {
                console.log('$stateParams.storeId = ' + $stateParams.storeId);
                $ionicScrollDelegate.$getByHandle('locationHandle').scrollTop();//滚动到顶部

                $scope.storeName = $stateParams.storeName;//店铺名称
                $scope.imgData = [];//图片数据

                var url = UrlService.getUrl('GET_SHOP_LOCATION');
                var params = {
                    storeId: $stateParams.storeId
                };

                //请求图片数据
                $http.post(url, params).success(function (response) {
                    console.log(response);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.imgData = response;
                }).error(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }

            /*查看大图*/
            $scope.toLocationDetail = function (imageUrl) {
                console.log("免税店位置图-->查看大图 imageUrl = " + imageUrl);

                var params = {
                    imageUrl: imageUrl
                };
                $state.go('shop-location-image', params);
            };
        }]
);