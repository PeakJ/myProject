CYXApp.controller('addressProvinceController', ['$scope', 'AddressService', '$ionicSlideBoxDelegate', '$timeout', '$ionicHistory',
  '$ionicModal', '$state', 'CollectService', 'PopupService', '$cordovaGeolocation', '$ionicTabsDelegate',
  '$stateParams','$ionicLoading','$localstorage',
  function ($scope, AddressService, $ionicSlideBoxDelegate, $timeout, $ionicHistory, $ionicModal, $state, CollectService,
            PopupService, $cordovaGeolocation, $ionicTabsDelegate, $stateParams,$ionicLoading,$localstorage) {

    var firstLoad = true;
    var tabIndex = 0;
    if(ionic.Platform.version() >= 7 && ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
      //ios header 里的 图标需要加个top值
    }

    $scope.init = function(){
      $scope.provinceId = $localstorage.get('USER_PROVINCEID');
      $scope.loadData();

    };
    $scope.loadData = function(){
      var param = {
        grade:1,
        parentId:86
      };
      AddressService.getProvinces(param).then(function(response){

        if (!response.data) {
          return;
        }
        var result = response.data;
        if(result.code == 0){
          $scope.addressList = result.data;


        }
        else{

        }


      }).finally(function(f){


      })
    };

    //每个地址选项的点击事件 先改 本地缓存的 provinceId  再跳转页面
    $scope.onSelect = function(itemId){
      $scope.provinceId = itemId;
      $localstorage.set('USER_PROVINCEID',itemId);

      $state.go('addressCity');
    };
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


    $scope.$on('$ionicView.beforeEnter',function(e,v){
      if(v.direction == 'back'){//不需要刷新
      }else{
        //需要刷新
        $scope.init();
      }
    });

    $scope.$on('$ionicView.afterLeave',function(e,v){

    });
    $scope.$on('$destroy', function() {

    });

  }]);

CYXApp.service('AddressService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getProvinces = function (requestParams) {
    var url = UrlService.getUrl('GET_PROVINCES');
    return $http.post(url, requestParams);
  };
  this.getCities= function (requestParams) {
    var url = UrlService.getUrl('GET_PROVINCES');
    return $http.post(url, requestParams);
  };
  this.getAreas = function (requestParams) {
    var url = UrlService.getUrl('GET_PROVINCES');
    return $http.post(url, requestParams);
  };
}]);
