/*
 * 首页Controller
 * geshuo 20160216
 **/

CYXApp.controller('xxxController', ['$scope', 'HomeService', '$ionicSlideBoxDelegate', '$timeout', '$ionicHistory',
  '$ionicModal', '$state', 'CollectService', 'PopupService', '$cordovaGeolocation', '$ionicTabsDelegate', '$stateParams',
  function ($scope, HomeService, $ionicSlideBoxDelegate, $timeout, $ionicHistory, $ionicModal, $state, CollectService,
            PopupService, $cordovaGeolocation, $ionicTabsDelegate, $stateParams) {

    //第一部分 页面绑定的数据  写注释 根据需要 初始化
    $scope.bindData ;
    $scope.entity ;
    $scope.status;
    $scope.netError; //网络错误
    $scope.hasMore;  //分页的列表 还有剩下的数据
    $scope.noData;   // 没有数据

    //第二部分 必备方法

    $scope.init = function(){

    };
    $scope.loadData = function(param){

      $XXXService.getData(param).then(function(res){
      //注意对请求失败的状态原因 区分处理 ，
        if('net-error'){

        }else if('500'){

        }

      }).finally(function(res){


      });

    };
    //第三部分 相应事件的方法 ,命名或者用业务含义 比如 submit，toDetail
    $scope.onXXXClick = function(){

    };
    $scope.onXXXScroll = function(){

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

    //第四部分
    //ionic 事件 或者自定义事件的监听
    $scope.$on('$ionicView.beforeEnter',function(e,v){

    });

    $scope.$on('$ionicView.afterLeave',function(e,v){

    });

    $scope.$on('$destroy', function() {

    });

    //

  }]);

CYXApp.controller('exampleController', ['$scope', 'AddressService', '$ionicSlideBoxDelegate', '$timeout', '$ionicHistory',
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
      $scopoe.provinceId = $localstorage.get('U_PROVINCEID');
      $scope.loadData();


    };
    $scope.loadData = function(){
      AddressService.getProvinces(param).then(function(response){

        if (!response.data) {
          return;
        }
        var result = response.data;
        if(result.code == 0){


        }
        else{

        }


      }).finally(function(f){


      })
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

