/**
 * Created by geshuo on 2016/2/16.
 *
 * 用户信息服务
 *
 */
CYXApp.service('PopupService', ['$rootScope', '$ionicLoading',function ($rootScope,$ionicLoading) {

  this.showMsg = function(msg){
    return $ionicLoading.show({
      //template: icon + template,
      template: msg,
      duration: 1500  //持续时间2ms后调用hide()
    });
  };
}
]);
