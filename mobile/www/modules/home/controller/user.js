/**
 * Created by 11150421050181 on 2015/7/20.
 */
/**
 * 我的信息
 * 张俊辉
 * 2015-08-11 15:29
 */
bomApp.controller('homeUserCtrl', ['$scope', '$state', 'userService', '$ionicActionSheet', 'loadingUtil',
    'userCenterService', 'FileServices', '$cordovaCamera', 'userImageService', 'UrlService', 'checkUtil','loadingUtil',
    function ($scope, $state, userService, $ionicActionSheet, loadingUtil, userCenterService, FileServices,
              $cordovaCamera, userImageService, UrlService, checkUtil, loadingUtil) {
        //点击头像
        $scope.addPhoto = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '相机'},
                    {text: '图库'}
                ],
                cancelText: '关闭',
                cancel: function () {
                    return true;
                },
                buttonClicked: function (index) {
                    console.log(index);
                    switch (index) {
                        case 0:
                            $scope.takePhoto();
                            break;
                        case 1:
                            $scope.Photo();
                            break;
                        default :
                            break;
                    }
                    return true;
                }
            });
        };
        //拍照
        $scope.takePhoto = function () {
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                saveToPhotoAlbum: false,
                targetWidth: 768,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                quality: 100

            };
            $cordovaCamera.getPicture(options).then(function (imageURI) {
                //alert(imageURI);
                $scope.userInfo.photo = imageURI;
                FileServices.upload(imageURI).then(function (imagePath) {
                    var urlParameter = "userId=" + userService.getUserId() + "&imagePath=" + imagePath;
                    userImageService.get(urlParameter).then(function (data) {
                    })
                })
            }, function (err) {
                // error
            });
        };

        //相册
        $scope.Photo = function () {
            loadingUtil.show();
            $cordovaCamera.cleanup();
            var options = {
                quality: 100,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 768,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageUrl) {
                $scope.userInfo.photo = imageUrl;
                FileServices.upload(imageUrl).then(function (imagePath) {
                    var urlParameter = "userId=" + userService.getUserId() + "&imagePath=" + imagePath;
                    userImageService.get(urlParameter).then(function (data) {
                    })
                })
            }, function (err) {
                // An error occured. Show a message to the user
                //PopupService.alertPopup('获取照片失败！');
            });
            loadingUtil.hide();
        };
        /**
         * 查询用户信息
         * 张帅
         * @type {string}
         */
        var urlParameter = "";
        var photo = '';
        $scope.prompt = '';
        $scope.userInfo = {};
        loadingUtil.show();
        urlParameter = "userId=" + userService.getUserId();
        userCenterService.get(urlParameter).then(function (data) {
            if (data != undefined) {
                if (!checkUtil.f_check_empty_no(data.photo)) {
                    photo = 'img/user-logo.png';
                } else {
                    photo = UrlService.getImageUrl() + data.photo;
                }
                $scope.userType = '';
                if (data.userType == '1') {
                    $scope.userType = "系统管理员";
                } else if (data.userType == '2') {
                    $scope.userType = "部门经理";
                } else if (data.userType == '3') {
                    $scope.userType = "业务线负责人";
                } else if (data.userType == '4') {
                    $scope.userType = "项目经理";
                } else if (data.userType == '5') {
                    $scope.userType = "部门助理";
                } else if (data.userType == '6') {
                    $scope.userType = "普通用户"
                }
                $scope.userInfo = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    no: data.no,
                    loginName: data.loginName,
                    mobile: data.mobile,
                    photo: data.photo,
                    company: data.company.name,
                    office: data.office.name,
                    userType: $scope.userType,
                    photo: photo,
                    imageUrl: data.photo
                }
            } else {
                $scope.prompt = "获取用户信息失败请稍后重试！";
            }
            console.log($scope.userInfo.photo);
        });
        loadingUtil.hide();
        $scope.outBut = function () {
            userService.clearUserInfo();
            $state.go('login');
        };
        //跳转图片详情
        $scope.goImage = function(){
            $state.go('userImage',{imageUrl:$scope.userInfo.photo});
        }
}]);