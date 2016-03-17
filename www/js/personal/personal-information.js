/********************************

 creator:dhc-jiangfeng
 create time:2016/2/22
 describe：个人资料Controller

 ********************************/

CYXApp.controller('personalInformationController', ['$scope', 'PersonalService', '$ionicHistory','$timeout','$state',
    '$ionicActionSheet', '$cordovaCamera', '$ionicPopup','$cordovaFileTransfer','UserService','PopupService','$localstorage','ValidateService',
    function ($scope, PersonalService, $ionicHistory,$timeout,$state, $ionicActionSheet, $cordovaCamera,
              $ionicPopup,$cordovaFileTransfer,UserService,PopupService,$localstorage,ValidateService) {

        /**
         * 获取个人信息
         */
        function getPersonalInfo() {
          PersonalService.getMineInfo().then(function (response) {
                console.log('个人信息 response = ' + JSON.stringify(response.data));
                if (!response.data) {
                    //请求失败
                    return;
                }
                var result = response.data;
                if (result.code == 0) {

                  //将后台传来的 用户信息 放到本地缓存，地址信息 放到本地缓存
                  var detail = result.data;
                  $scope.userInfo={
                    userId:detail.id,
                    userName:detail.showName,
                    mobile:detail.mobile,
                    headImage:detail.logoPath,
                    sex:detail.sex,
                    address:detail.address,
                    email:detail.email,
                    areaId:detail.areaId,
                    provinceName :detail.provinceName,
                    cityName:detail.cityName,
                    areaName:detail.areaName
                  };
                  $localstorage.set('USER_PROVINCEID',detail.provinceId);
                  $localstorage.set('USER_CITYID',detail.cityId);
                  $localstorage.set('USER_AREAID',detail.areaId);
                  UserService.setUser($scope.userInfo);
                 //   $scope.userInfo = result.data;
                 //   $scope.sexState = $scope.userInfo.sex == "0";
                }
            });
        }

        $scope.init = function(){
          var userInfo  = UserService.getUser();

          if(!userInfo ||!userInfo.userId ){
            //跳到登录
            PopupService.showMsg('请先登录...');
            $timeout(function(){
              $state.go('login');
            },1600);
            return;
          }
          getPersonalInfo();
        };


        //定义选择照片的函数，
        $scope.choosePicMenu = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '拍照'},
                    {text: '从相册选择'}
                ],
                titleText: '选择照片',
                cancelText: '取消',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        takePhoto();
                    } else if (index == 1) {
                        album();
                    }
                    return true;
                }
            });
        };

        //拍照
        function takePhoto() {
            $cordovaCamera.cleanup();
            var options = {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                saveToPhotoAlbum: false,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                quality: 100

            };
            $cordovaCamera.getPicture(options).then(function (imageURI) {

                $scope.userInfo.headImg = "data:image/jpeg;base64," + imageURI;
                $cordovaFileTransfer.upload().then(function(object){

                });
            }, function (err) {
                // error
            });
        }

        //相册
        function album() {
            $cordovaCamera.cleanup();
            var options = {
                quality: 100,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageURI) {

                $scope.userInfo.headImg = "data:image/jpeg;base64," + imageURI;
               upload(imageURI);
            }, function (err) {
                // An error occured. Show a message to the user
                //PopupService.alertPopup('获取照片失败！');
            });
        }

        //头像上传
        function upload(imageURI){
            var server = '';
            var trustHosts = false;
            var options = {
                //enctype : "multipart/form-data"
            };
            $cordovaFileTransfer.upload(server,imageURI,options,trustHosts).then(function(object){
                var data = object.response;
                console.log(data);
            });
        }

        $scope.showPopup = function (index) {//修改资料弹窗
            $scope.data = {};
            $scope.data.index = index; //0手机号  1名字 2 详细地址 3邮箱
            var reqParam ={};
            switch (index) {
                case 0:
                    $scope.data.item = $scope.userInfo.mobile;
                    break;
                case 1:
                    $scope.data.item = $scope.userInfo.userName;
                    break;
                case 2:
                    $scope.data.item = $scope.userInfo.address;
                    break;
                case 3:
                    $scope.data.item = $scope.userInfo.email;
                    break;
                default :
                    break;
            }

            // 自定义弹出框
            var myPopup = $ionicPopup.show({
                templateUrl:'./templates/common/popup/one-input-popup.html',
                title: '',
                cssClass:'cyxPopup', // 通过在 父 级div 加class 改变 ionic 的popup 层的样式
                subTitle: '',
                scope: $scope,
                buttons: [
                    {text: '取消',
                     type:'cyx-popup-button'
                    },
                    {
                        text: '<b>保存</b>',
                        type: 'cyx-popup-button',
                        onTap: function (e) {
                          switch (index) {
                            case 0:
                              reqParam = {mobile:$scope.data.item};
                              break;
                            case 1:
                              reqParam = {showName:$scope.data.item};
                              break;
                            case 2:
                              reqParam = {address:$scope.data.item};
                              break;
                            case 3:
                              reqParam = {email:$scope.data.item};
                              break;
                            default :
                              break;
                          }
                          //验证手机号
                          if(0 == index && !ValidateService.CheckMobile($scope.data.item)){
                            e.preventDefault();
                            return;
                          }
                          //验证用户名
                          if(1 == index && !ValidateService.CheckName($scope.data.item)){
                            e.preventDefault();
                            return;
                          }
                          //验证地址
                          if(2 == index && !ValidateService.CheckAddress($scope.data.item)){
                            e.preventDefault();
                            return;
                          }
                          //验证邮箱
                          if(3 == index && !ValidateService.CheckMail($scope.data.item)){
                            //PopupService.showMsg('邮箱格式不对');
                            //console.log('ssss');
                            e.preventDefault();
                            return;
                          }
                            PersonalService.updateMyInfo(reqParam).then(function (response) {
                              if (!response.data) {
                                //请求失败
                                return;
                              }
                              var result = response.data;
                              if (result.code == 0) {//修改成功
                                PopupService.showMsg(result.message);
                                $scope.init();
                              }else{

                                PopupService.showMsg(result.message);
                              }
                            });
                        }
                    }
                ]
            });

            //myPopup.then(function(res) {
            //    console.log('Tapped!', res);
            //});

        };
        $scope.goSelectArea = function(){
          $state.go('addressProvince');
        };

        $scope.changeMaleState = function (sex) {// 0 男  。1 女
          if(sex == $scope.userInfo.sex){
            //点击 选中的性别 不需要发请求
            return;
          }
          var reqParam = {sex :sex};
          PersonalService.updateMyInfo(reqParam).then(function (response) {
            if (!response.data) {
              //请求失败
              return;
            }
            var result = response.data;
            if (result.code == 0) {//修改成功
              PopupService.showMsg(result.message);
              $scope.init();
            }else{
              PopupService.showMsg(result.message);
            }
          });
        };


      $scope.$on('$ionicView.beforeEnter',function(e,v){
        if(v.direction == 'back'){//不需要刷新
        }else{
          //需要刷新
        }
        $scope.init();//特殊页面 都需要刷新
      });

      $scope.$on('$ionicView.afterLeave',function(e,v){

      });
      $scope.$on('$destroy', function() {

      });


    }]);


CYXApp.service('PersonalService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getMineInfo = function () {
    var url = UrlService.getUrl('MINE_INFO');
    //var url='http://172.16.63.32:8085/insert_user.ajax';
    console.log('url = ' + url);
    return $http.post(url);
  };
  this.updateMyInfo = function(param){
    var url  = UrlService.getUrl('UPDATE_MY_INFO');
    return $http.post(url,param);
  }
}]);


