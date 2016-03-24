/**
 * 免税店列表
 *
 * @author：葛硕
 * 2015/8/14
 *
 * */
cdfgApp.controller('ShopListController', ['$scope', '$ionicHistory', '$http', '$state', 'PopupService',
    '$ionicScrollDelegate', 'UrlService', '$stateParams', '$rootScope',
    function ($scope, $ionicHistory, $http, $state, PopupService, $ionicScrollDelegate, UrlService, $stateParams, $rootScope) {

        $scope.goBack = goBack;//返回上一页
        $scope.toShopGuide = toShopGuide;//跳转到【免税店购物指南】页面
        $scope.toShopDetail = toShopDetail;//跳转到【免税店详情】页面
        $scope.toShopFilter = toShopFilter;//跳转到【免税店筛选】页面
        $scope.loadData = loadData;//加载数据
        $scope.selectCity = 0;//已选择的城市索引，0为全部

        /*返回上一页*/
        function goBack() {
            $ionicHistory.goBack();
            $scope.shopListAll = [];
        }

        //判断是否刷新页面
        $scope.$on('$ionicView.beforeEnter',function(){
            if($stateParams.reload && (!$scope.shopListAll || $scope.shopListAll.length == 0)){
                loadData();
            }
        });

        /*加载页面数据*/
        function loadData() {
            $scope.shopListAll = [];//全部免税店
            $scope.shopList = [];//免税店列表数据

            $scope.cityList = [{
                id:'all',
                name:'不限',
                code:0
            }];//城市列表数据

            var params = {};
            $http.post(UrlService.getUrl('GET_SHOP_LIST'), params).success(function (response) {
                console.log(JSON.stringify(response));
                $scope.$broadcast('scroll.refreshComplete');
                if (response.code == '1') {
                    var result = response.data.result;
                    var cityCodes = [];//城市简拼

                    for (var i = 0, len = result.length; i < len; i++) {
                        var city = {};
                        city.code = result[i].cityPinyin;//拼音首字母
                        city.name = result[i].airportName;
                        city.id = result[i].id;
                        console.log('city.code------------' + city.code);
                        if(cityCodes.indexOf(city.code) == -1){
                            cityCodes.push(city.code);
                            $scope.cityList.push(city);
                        }
                    }

                    console.log(JSON.stringify($scope.cityList));
                    $scope.shopListAll = result;
                    $scope.shopList = result;
                }
            }).error(function () {
                $scope.$broadcast('scroll.refreshComplete');
                PopupService.alertPopup(CDFG_NETWORK_ERROR);
            });

        }

        /*跳转到购物指南*/
        function toShopGuide() {
            console.log('跳转到购物指南');
            $state.go('shop-guide');
        }

        /*跳转到店铺详情*/
        function toShopDetail(shopId) {
            console.log('跳转到店铺详情 shopId = ' + shopId);
            $state.go('shop', {'id': shopId});
        }

        /*跳转到筛选页面*/
        function toShopFilter() {
            var params = {
                shopCities: JSON.stringify($scope.cityList),//所有免税店城市列表
                selectedCity: $scope.selectedCity
            };
            console.log('跳转到筛选页面 data = ' + JSON.stringify(params));

            $state.go('shopListFilter',params);
        }

        //接收广播，刷新免税店列表数据
        $rootScope.$on('RefreshShopList',function(event,data){
            console.log('接收广播 data = ' + JSON.stringify(data));
            var cityCode = data.cityCode;//已选城市拼音简拼
            $scope.selectedCity = data.selectedCity;//已选城市索引
            showFilterList(cityCode);
        });

        /*显示所选城市的免税店*/
        function showFilterList(code){
            if(code == 0){
                //显示全部免税店
                $scope.shopList = [];
                $scope.shopList = $scope.shopListAll;
            } else {
                //显示指定城市的免税店
                $scope.shopList = [];
                console.log(code);

                for(var i = 0,len = $scope.shopListAll.length; i < len ;i++){
                    if($scope.shopListAll[i].cityPinyin == code){
                        $scope.shopList.push($scope.shopListAll[i]);
                    }
                }
            }
        }
    }]);