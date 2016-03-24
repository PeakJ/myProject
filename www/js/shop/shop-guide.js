/**
 * 免税店购物指南
 * Created by geshuo on 2015/8/12.
 */
cdfgApp.controller('ShopGuideController', ['$scope', '$http', '$ionicHistory', 'UrlService', 'PopupService',
    function ($scope, $http, $ionicHistory, UrlService, PopupService) {

        $scope.goBack = goBack;

        loadData();

        /*加载主页面*/
        function loadData(){
            $http.post(UrlService.getUrl('GET_SHOP_GUIDE')).success(function(response){
                console.log(response);
                $scope.guideContent = response;
            }).error(function(){
                PopupService.showPrompt('加载失败');
            });
        }

        /*返回上一页*/
        function goBack(){
            $ionicHistory.goBack();
        }
    }
]);