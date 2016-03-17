CYXApp.controller('addressAreaController', ['$scope', 'PersonalService', '$ionicSlideBoxDelegate', '$timeout', '$ionicHistory',
  '$ionicModal', '$state', 'AddressService', 'PopupService', '$cordovaGeolocation', '$ionicTabsDelegate',
  '$stateParams','$ionicLoading','$localstorage',
  function ($scope, PersonalService, $ionicSlideBoxDelegate, $timeout, $ionicHistory, $ionicModal, $state, AddressService,
            PopupService, $cordovaGeolocation, $ionicTabsDelegate, $stateParams,$ionicLoading,$localstorage) {

    var firstLoad = true;
    var tabIndex = 0;
    if(ionic.Platform.version() >= 7 && ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
      //ios header 里的 图标需要加个top值
    }

    $scope.init = function(){
      $scope.cityId = $localstorage.get('USER_CITYID');
      $scope.areaId = $localstorage.get('USER_AREAID');
      $scope.loadData();

    };
    $scope.loadData = function(){
      var param = {
        grade:3,
        parentId:$scope.cityId
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

    //地区选择完 后 发请求 改 本地缓存 goback（-3）;
    $scope.onSelect = function(itemId){
      /**
       * @ngdoc method
       * @name $ionicHistory#goBack
       * @param {number=} backCount Optional negative integer setting how many views to go
       * back. By default it'll go back one view by using the value `-1`. To go back two
       * views you would use `-2`. If the number goes farther back than the number of views
       * in the current history's stack then it'll go to the first view in the current history's
       * stack. If the number is zero or greater then it'll do nothing. It also does not
       * cross history stacks, meaning it can only go as far back as the current history.
       * @description Navigates the app to the back view, if a back view exists.
       */
      $scope.areaId = itemId;
      $localstorage.set('USER_AREAID',itemId);

      var param ={
        areaId:itemId
      };
      PersonalService.updateMyInfo(param).then(function (response) {
        console.log('个人信息 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {//修改地址成功
          PopupService.showMsg(result.message);
          $ionicHistory.goBack(-3);
        }else{
          PopupService.showMsg(result.message);
        }
      });



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
