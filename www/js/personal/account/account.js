/**
 * AccountController
 * Created by ZCP on 2015/6/30.
 */
cdfgApp.controller('AccountController', ['$scope', '$rootScope', 'UserService', '$cordovaImagePicker', '$cordovaCamera',
    '$cordovaFileTransfer', '$http', 'UrlService', 'AccountService', 'PopupService', '$ionicHistory',
    function ($scope, $rootScope, UserService, $cordovaImagePicker, $cordovaCamera,
              $cordovaFileTransfer, $http, UrlService, AccountService, PopupService, $ionicHistory) {
        /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBack = goBack;
        //返回上一页
        function goBack() {
            $ionicHistory.goBack();
        }

        /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        //初始化方法
        $scope.init = function () {
            $scope.localUser = UserService.getUser();
            $scope.localUser.year = $scope.localUser.birthday.substr(0, 4);
            $scope.localUser.month = $scope.localUser.birthday.substr(4, 2);
            $scope.localUser.day = $scope.localUser.birthday.substr(6, 2);
            AccountService.reflashInfo()
                .success(function (response, status, headers, config) {
                    if (response.code == 1) {
                        console.log(response);
                        UserService.setUser(response.data);
                        $scope.localUser = UserService.getUser();
                        $scope.localUser.year = $scope.localUser.birthday.substr(0, 4);
                        $scope.localUser.month = $scope.localUser.birthday.substr(4, 2);
                        $scope.localUser.day = $scope.localUser.birthday.substr(6, 2);
                    }
                });

        };

        var checkTime = function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        };

        //日期选择方法
        $scope.pickDate = function () {
            var options = {
                date: new Date($scope.localUser.birthday.substr(0, 4), $scope.localUser.birthday.substr(4, 2) - 1, $scope.localUser.birthday.substr(6, 2)),
                mode: 'date',
                locale: 'zh-cn',//ios 中文日期
                cancelButtonLabel: '取消',//ios 中文取消
                doneButtonLabel: '选择'//ios 中文选择
            };

            function onSuccess(date) {
                //alert(date.getFullYear());
                //alert(date.getMonth());
                //alert(date.getDate());
                $scope.localUser.birthday = date.getFullYear().toString().concat(checkTime(date.getMonth() + 1).toString(), checkTime(date.getDate()).toString());
                AccountService.updateBirthday($scope.localUser.birthday)
                    .success(function (response) {
                        console.log('更新生日成功！' + response.data);
                        //$scope.$apply(function () {
                        $scope.localUser.year = $scope.localUser.birthday.substr(0, 4);
                        $scope.localUser.month = $scope.localUser.birthday.substr(4, 2);
                        $scope.localUser.day = $scope.localUser.birthday.substr(6, 2);
                        //});
                        UserService.setUser($scope.localUser);
                    })

            }

            function onError(error) {
                //alert('Error: ' + error);
            }

            //alert('pickDate Start!');
            //alert(datePicker);
            datePicker.show(options, onSuccess, onError);
        };


        //联网更新名字
        $rootScope.$on('USER_NAME', function (evt, data) {
            console.log('received USER_NAME:' + data);         //父级能得到值
            AccountService.updateName(data)
                .success(function (response) {
                    if (response.code == 1) {

                        console.log('更新姓名成功！');
                        $scope.localUser.nickName = data;
                        UserService.setUser($scope.localUser);
                    }
                })

        });

        //联网更新性别
        $rootScope.$on('SEX', function (evt, data) {
            console.log(data);         //父级能得到值
            AccountService.updateSex(data.value)
                .success(function (response) {
                    if (response.code == 1) {
                        console.log('更新性别成功！' + response.data);
                        $scope.localUser.gender = data.value;
                        UserService.setUser($scope.localUser);
                    }
                })

        });

        /* //选择图片方式1
         $scope.pickImage = function () {
         var options = {
         maximumImagesCount: 1,
         width: 800,
         height: 800,
         quality: 80
         };
         $cordovaImagePicker.getPictures(options)
         .then(function (results) {
         uploadPhoto('http://192.168.102.98:8081/UploadTest/Test', results[0]);
         }, function (error) {
         // error getting photos

         });
         };*/

        //上传照片方法
        var uploadPhoto = function (filePath) {
            $cordovaFileTransfer.upload(UrlService.getUrl('ACCOUNT_IMG_UPLOAD'), filePath)
                .then(function (result) {
                    // Success!
                    var temp = JSON.parse(result.response);
                    //$scope.localUser.headerPic = CDFG_IP_IMAGE + temp.rid;
                    $scope.localUser.headerPic = temp.rid;
                    AccountService.updatePhoto($scope.localUser.headerPic)
                        .success(function (response) {
                            if (response.code == 1) {
                                $rootScope.$broadcast('loading:hide');
                                UserService.setUser(localUser);
                                console.log('更新头像成功！' + response.data);
                                $scope.localUser.gender = data.value;
                                UserService.setUser($scope.localUser);
                            } else {
                                PopupService.alertPopup('上传失败', 'error');
                            }
                        })

                }, function (err) {
                    // Error

                    $rootScope.$broadcast('loading:hide');
                    if (response.code / 100 == 5) {
                        PopupService.alertPopup('', '服务器错误,稍后再次尝试', 'error');
                    } else {
                        PopupService.alertPopup('数据获取失败,网络请求失败', 'error');
                    }
                }, function (progress) {

                }
            );
        };
        //选择图片方式2-可以简单编辑图片
        $scope.takePhoto = function () {
            $cordovaCamera.cleanup();
            var options = {
                quality: 100,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageUrl) {
                // Success! Image data is here
                //alert(imageData);

                $rootScope.$broadcast('loading:show');
                uploadPhoto(imageUrl);
                //uploadImage(imageData);
            }, function (err) {
                // An error occured. Show a message to the user
                //PopupService.alertPopup('获取照片失败！');
            });
        };

        $scope.$on('$ionicView.enter', function () {
            $scope.init();
        });

    }
]);

/**
 * AccountService
 * Created by ZCP on 2015/6/30.
 */
cdfgApp.service('AccountService', ['$http', 'UserService', 'UrlService', function ($http, UserService, UrlService) {

    //联网获取用户信息数据
    this.reflashInfo = function () {
        return $http.post(UrlService.getUrl('ACCOUNT_REFLASH_INFO'))
    };

    //更新头像
    this.updatePhoto = function (pic) {
        var param = {
            headerPic: pic
        };
        return $http.post(UrlService.getUrl('ACCOUNT_UPDATE_INFO'), param)
    };
    //更新用户名
    this.updateName = function (name) {
        var param = {
            nickName: name
        };
        return $http.post(UrlService.getUrl('ACCOUNT_UPDATE_INFO'), param)
    };
    //更新生日
    this.updateBirthday = function (birthday) {
        console.log(birthday);
        var param = {
            birthday: birthday
        };
        return $http.post(UrlService.getUrl('ACCOUNT_UPDATE_INFO'), param)
    };
    //更新性别
    this.updateSex = function (sex) {
        var param = {
            gender: sex + ''
        };
        return $http.post(UrlService.getUrl('ACCOUNT_UPDATE_INFO'), param)
    };

}]);