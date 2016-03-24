/**
 * Created by dhc on 2015/7/6.
 */
cdfgApp.controller('GoabroadDetailController', ['$scope', '$ionicHistory',
    function ($scope, $ionicHistory) {
        /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBack = goBack;
        $scope.needCatch = true;
        //返回上一页
        function goBack() {
            $ionicHistory.goBack();
        }

        /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
    }]);


cdfgApp.controller('GoabroadDetailFormController', ['$scope', '$http', '$stateParams', '$rootScope', 'AddressService',
    'LocationService', '$ionicHistory', 'PopupService',
    function ($scope, $http, $stateParams, $rootScope, AddressService, LocationService, $ionicHistory, PopupService) {


        var formatGeoName = function (obj) {
            obj.geoName = '';
            if (obj.provinceText) {
                obj.geoName = obj.geoName + $scope.addressInfo.provinceText;
            }
            if (obj.cityText) {
                obj.geoName = obj.geoName + '-' + $scope.addressInfo.cityText;
            }
            if (obj.countyText) {
                obj.geoName = obj.geoName + '-' + $scope.addressInfo.countyText;
            }
            if (obj.townText) {
                obj.geoName = obj.geoName + '-' + $scope.addressInfo.townText;
            }
        };
        //初始化
        $scope.init = function () {

            $scope.validate = false;
            $scope.addressId = $stateParams.addressId;//获得传来的addressId，如果没有就是新建地址
            console.log('addressId:' + $scope.addressId);
            if ($scope.addressId) {
                //如果id存在，则从网上获取地址信息//实际上是从上一个页面带过来的 数据
                $scope.addressInfo = AddressService.getAddressById($scope.addressId);
                var value = [];
                if ($scope.addressInfo.province) {
                    value.push($scope.addressInfo.province);
                    $scope.addressInfo.provinceText = LocationService.getLocationTextByValue(value);
                }
                if ($scope.addressInfo.city) {
                    value.push($scope.addressInfo.city);
                    $scope.addressInfo.cityText = LocationService.getLocationTextByValue(value);
                }
                if ($scope.addressInfo.county) {
                    value.push($scope.addressInfo.county);
                    $scope.addressInfo.countyText = LocationService.getLocationTextByValue(value);
                }
                if ($scope.addressInfo.town) {
                    value.push($scope.addressInfo.town);
                    $scope.addressInfo.townText = LocationService.getLocationTextByValue(value);
                }
                console.log($scope.addressInfo);
            } else {
                //如果id不存在，则为新增；
                //保存地址参数
                $scope.addressInfo = {
                    receiver: '',
                    provinceText: '-省',
                    province: '',
                    cityText: '-市',
                    city: '',
                    countyText: '-区',
                    county: '',
                    townText: '',
                    town: '',
                    addr: '',
                    mobile: '',
                    idCardNo: '',
                    passportNo: ''
                };
            }
        };
        $rootScope.$on();
        $rootScope.$on('LOCATION1', function (evt, data) {
            console.log($scope.addressInfo);
            $scope.addressInfo.provinceText = data.text;
            $scope.addressInfo.province = data.value;
            $scope.addressInfo.cityText = '';
            $scope.addressInfo.city = '';
            $scope.addressInfo.countyText = '';
            $scope.addressInfo.county = '';
            $scope.addressInfo.townText = '';
            $scope.addressInfo.town = '';
            console.log('provence');
        });
        $rootScope.$on('LOCATION2', function (evt, data) {
            console.log($scope.addressInfo);
            $scope.addressInfo.cityText = data.text;
            $scope.addressInfo.city = data.value;
            $scope.addressInfo.countyText = '';
            $scope.addressInfo.county = '';
            $scope.addressInfo.townText = '';
            $scope.addressInfo.town = '';
            console.log('city');
        });
        $rootScope.$on('LOCATION3', function (evt, data) {
            $scope.addressInfo.countyText = data.text;
            $scope.addressInfo.county = data.value;
            $scope.addressInfo.townText = '';
            $scope.addressInfo.town = '';
            console.log('county');
        });
        $rootScope.$on('LOCATION4', function (evt, data) {
            $scope.addressInfo.townText = data.text;
            $scope.addressInfo.town = data.value;
            console.log('town');
        });

        $scope.submitAddress = function () {
            $scope.validate = true;
            if ($scope.addressDetailForm.$valid) {
                console.log('addressDetailForm validate passed! And ready to submit!');
                AddressService.addOrUpdateAddress($scope.addressInfo)
                    .success(function (response, status, headers, config) {
                        //测试用业务逻辑
                        console.log(response);
                        if (response.code == 1) {
                            PopupService.alertPopup('提示', '提交成功')
                                .then(function () {
                                    $scope.$ionicGoBack();
                                });
                        } else {
                            PopupService.alertPopup('提示', '提交失败');
                        }
                    })
            } else if (!$scope.addressDetailForm.receiver.$valid) {
                PopupService.promptPopup('收货人姓名长度2~16个字符', 'error');
                $scope.focusReceiver = true;
            } else if (!$scope.addressDetailForm.mobile.$valid) {
                PopupService.promptPopup('手机号码填写不正确', 'error');
                $scope.focusMobile = true;
            } else if (!$scope.addressDetailForm.addr.$valid) {
                PopupService.promptPopup('护照号填写不正确', 'error');
                $scope.focusAddr = true;
            }

        };
        //选择联系人
        $scope.selectContact = function () {
            navigator.contacts.pickContact(function (contact) {
                    $scope.$apply(function () {
                        $scope.addressInfo.receiver = contact.displayName;
                        $scope.addressInfo.mobile = contact.phoneNumbers[0].value.replace(/-/g, '');
                    });
                }, function (err) {
                    console.log('Error: ' + err);
                    alert('error');
                }
            );
        };
        $scope.init();
    }])
;
cdfgApp.directive('focusMe', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        scope.$apply(model.assign(scope, false));
                        element[0].focus();
                    }, 30);
                }
            });
        }
    };
});