CYXApp.controller('addressCityController', ['$scope', 'AddressService', '$ionicSlideBoxDelegate', '$timeout', '$ionicHistory',
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
      $scope.cityId = $localstorage.get('USER_CITYID');
      $scope.provinceId = $localstorage.get('USER_PROVINCEID');
      $scope.loadData();

    };
    $scope.loadData = function(){
      var param = {
        grade:2,
        parentId:$scope.provinceId
      };
      AddressService.getCities(param).then(function(response){

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
    $scope.onSelect = function(itemId){
      $scope.cityId =itemId;
      $localstorage.set('USER_CITYID',itemId);
      $state.go('addressArea');
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
