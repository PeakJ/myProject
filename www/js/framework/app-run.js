/**
 * Created by geshuo on 2016/2/16.
 */
CYXApp.run(['$ionicPlatform','$rootScope','$ionicLoading','$state','$localstorage','$cordovaGeolocation','PopupService',
  function($ionicPlatform,$rootScope,$ionicLoading,$state,$localstorage,$cordovaGeolocation,PopupService) {

  /* ADD START BY geshuo 20160216:加载进度条显示控制 --------------- */
  var requestCount = 0;
  /** loading 拦截器 **/
  $rootScope.$on('LOADING:SHOW', function () {
    requestCount++;
    if(!$rootScope.isLoadShowing){
      var params = {
        //template: '<div style="float: left"><img src="img/icon_loading.gif" style="width: 40px"/></div><div style="margin-top: 10px;float: left">正在加载中……</div>'
        template:'加载中……'
      };
      $ionicLoading.show(params)
    }
    $rootScope.isLoadShowing = true;
  });

  $rootScope.$on('LOADING:HIDE', function () {
    requestCount--;
    if(requestCount <= 0){
      $rootScope.isLoadShowing = false;
      $ionicLoading.hide()
    }
  });
  /* ADD END BY geshuo 20160216:加载进度条显示控制 --------------- */

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }


    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  /* ADD START BY geshuo 20160122:获取设备屏幕的宽高 --------------- */
  $rootScope.deviceWidth = document.body.clientWidth;
  $rootScope.deviceHeight = document.body.scrollHeight;
  /* ADD END   BY geshuo 20160122:获取设备屏幕的宽高 --------------- */

  //底部 tab 到 首月相应tab 的方法
  $rootScope.toHealth = function(){
    $state.go('home',{tabIndex:0});
  };
  $rootScope.toLife = function(){
    $state.go('home',{tabIndex:1});
  };
  $rootScope.toVIP = function(){
    $state.go('home',{tabIndex:2});
  };
      //  getCityInfo();
      //
  function getCityInfo() {
    $ionicLoading.show({ template:'正在定位....'});
    return $cordovaGeolocation.getCurrentPosition()
      .then(function (position) {debugger;
        var lnglatXY = [position.coords.longitude, position.coords.latitude]; //已知点坐标
        if (typeof AMap != 'undefined') {
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress(lnglatXY, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {

              $ionicLoading.hide();
              var city = '';
              if (result.regeocode.addressComponent.city) {
                city = result.regeocode.addressComponent.city;
              } else {
                city = result.regeocode.addressComponent.province;
              }
              $ionicLoading.show({ template:'定位成功,您所在的城市是'+city.substring(0, city.length - 1)});
              //向高德地图 发请求
              //成功 后 为 localstorage 赋值  GPS_CITY_NAME 本地存储 当前城市中文名  GPS_CITY 当前 城市码

              //

              //若失败 赋值为沈阳 210100

           //    $scope.postCode= result.regeocode.addressComponent.adcode;//需要传给后台作为查询条件//   $scope.currentCity = city.substring(0, city.length - 1);
              $localstorage.set('CURRENT_CITY', city.length - 1);
              console.log('返回地址信息 = ' + JSON.stringify(result));
            }else{
              console.warn('定位成功，获取定位信息失败');
              $ionicLoading.hide();
              PopupService.showMsg('定位成功，获取定位信息失败');
            }
         //   loadData(0);
          //
          });
        }
      }, function (error) {
        console.log('定位失败');
        $ionicLoading.hide();
        PopupService.showMsg('定位失败');
      //  loadData(0);

      });
  }
}]);
