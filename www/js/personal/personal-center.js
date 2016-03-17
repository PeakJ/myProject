/*
 * 个人中心Controller
 **/


CYXApp.controller('personalCenterController', ['$scope', '$state', '$ionicHistory', '$ionicPopup',
  'UserService', 'PopupService', 'PersonalCenterService',
  function ($scope, $state, $ionicHistory, $ionicPopup, UserService, PopupService, PersonalService) {
    var user;
    $scope.vipNo = '001415';//vip卡号
    var vipPop;//vip弹框
    var isShow = false;
    $scope.headDefault = './img/head-default.png'//默认头像


    //console.log("init");
    $scope.personalInfo;//个人信息
    //console.log("个人信息-tel:"+user.tel);
    //console.log("个人信息-userId:"+user.userId);
    //console.log("个人信息-isSeller:"+user.isSeller);
    ////$scope.personalInfo.isSalesperson = !(user.isSeller==null);//角色是否是销售员
    //$scope.personalInfo.isSalesperson = false;//测试 角色是否是销售员
    //console.log("是否是销售员" + $scope.personalInfo.isSalesperson);


    function loadData() {
      var params={
      };
      PersonalService.getPersonalInfo(params).then(function (response) {

        console.log('获取用户信息 response = ' + JSON.stringify(response.data));
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {
          $scope.personalInfo = result.data;
          var role = parseInt( $scope.personalInfo.role);
          console.log("role:" + role);
        //  role=2;//测试临时
          switch (role) {
            case 0:
              $scope.personalInfo.isSalesperson = false;
              break;
            case 1:
              $scope.personalInfo.isSalesperson = true;
              $scope.personalInfo.isSeller = '销售员';
              break;
            case 2:
              $scope.personalInfo.isSeller = '店主';
              $scope.personalInfo.isSalesperson = true;
              break;
          }
        }
      });
    }


    //跳转到药店中心
    $scope.goShopCenter = function () {
      $state.go('shopCenter', {role: $scope.personalInfo.role});
    };
    //vip对话框提示
    $scope.onPopUpClick = function () {

      vipPop = $ionicPopup.show({
        templateUrl: './templates/common/popup/vip-card-popup.html',
        cssClass: 'cyxVipPopup',
        scope: $scope
      });
      vipPop.then(function (res) {
        console.log('Thank you for not eating my delicious ice cream cone');
      });

    };
    $scope.onClosePopClick = function () {
      console.log("-------close-----");
      vipPop.close();
    };


    /*返回上一页*/
    $scope.goBack = function () {
      if (!$ionicHistory.backView()) {
        $state.go('home');
        return;
      }
      ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
    };


    //检查更新
    $scope.checkUpdate = function () {
      CYXApp.appVersion = '0';
      PersonalService.getVersionInfo().then(function(response){
        if (!response.data) {
          //请求失败
          return;
        }
        var result = response.data;
        if (result.code == 0) {//注意 data0 是ios 1是android
          if(CYXApp.appVersion ==result.data[0].version ){
            PopupService.showMsg('已经是最新版本');
          }else{
            alert('需要更新');//CYXApp.iosDownUrl CYXApp.androidDownUrl
          }
        }

      }).finally(function(f){

      });
    };
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      loadData();
    });
  }]);


CYXApp.service('PersonalCenterService', ['$http', 'UrlService', function ($http, UrlService) {
//获取未核销订单
  this.getPersonalInfo = function (requestParams) {
    var url = UrlService.getUrl('PERSONAL_INFO');
    return $http.post(url, requestParams);
  };

  //获得版本信息
  this.getVersionInfo = function () {
    var url = UrlService.getUrl('VERSION_INFO');
    return $http.post(url);
  };
}]);
