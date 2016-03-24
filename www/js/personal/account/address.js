/**
 * AddressController
 * Created by ZCP on 2015/7/6.
 */
cdfgApp.controller('AddressController', ['$scope', 'AddressService', '$stateParams', '$ionicListDelegate',
    '$rootScope', 'PopupService', '$ionicHistory', '$state','$timeout',
    function ($scope, AddressService, $stateParams, $ionicListDelegate, $rootScope, PopupService, $ionicHistory, $state,$timeout) {
        /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBack = goBack;
        //返回上一页
        function goBack() {
            //todo 清空缓存
            $ionicHistory.goBack();
        }

        /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/

        //初始化方法
        $scope.init = function () {
            $scope.selectedAddress = $stateParams.addrId;//左侧checkbox选择框，带过来的以选择地址的id，用于控制左侧checkbox选择框的勾选
            $scope.selectedItem = $stateParams.addrId;//选择的数据信息，记录选择地址的ID，用于传给地址详情，从地址服务中获取详细信息。
            AddressService.getAddressList()
                .success(function (response, status, headers, config) {
                    if (response.code == 1) {
                        $scope.addressList = response.data;
                        console.log('地址列表加载成功！');
                    }
                    console.log(response.code);
                    console.log(response.data);
                })

        };

        //进入页面，刷新页面。
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
            $timeout(function () {
                console.log('clearing cache');
                $ionicHistory.clearCache();
                //$ionicHistory.clearHistory();
                console.log('clearing cache');
            },1000);
        });

        //删除地址方法
        $scope.deleteAddress = function (addressId) {
            PopupService.confirmPopup('提示', '信息删除后不可恢复', '确认')
                .then(function (res) {
                    if (res) {
                        AddressService.deleteAddress(addressId)
                            .success(function (response, status, headers, config) {
                                $ionicListDelegate.closeOptionButtons();
                                $scope.init();
                                console.log('地址删除成功！addressId:' + addressId);
                                if ($scope.selectedAddress == addressId) {
                                    $rootScope.$broadcast('SELECT_ADDRESS_DELETED', addressId);//通知其他页面，当前选中地址被删除
                                    console.log('SELECT_ADDRESS_DELETED:' + addressId);
                                }
                            })

                    } else {

                        $ionicListDelegate.closeOptionButtons();
                    }
                });
        };

        //广播地址信息，广播出ID，需要的在自己页面接收。发送的是全部数据。
        $scope.selectAddressData = function (addr) {
            console.log(!$scope.selectedAddress);
            if (!$scope.selectedAddress) {
                $state.go('addressDetail', {addressId: addr.addrId});
            } else {
                console.log(addr);
                $scope.selectedAddress = addr.addrId;
                $rootScope.$broadcast('SELECT_ADDRESS', addr);
                $scope.$ionicGoBack();
            }
        };

        //设置默认地址方法
        $scope.setDefaultAddress = function (addressId) {
            $ionicListDelegate.closeOptionButtons();
            AddressService.setDefaultAddress(addressId)
                .success(function (response, status, headers, config) {
                    $scope.init();
                    console.log(response);
                    console.log('设置默认地址成功！');
                })

        };

    }]);

/**
 * AddressService
 * Created by ZCP on 2015/7/6.
 */
cdfgApp.service('AddressService', ['$http', 'UserService', 'UrlService', function ($http, UserService, UrlService) {
    //service中备份一份
    var addressList = [];
    this.getAddressList = function () {
        return $http.post(UrlService.getUrl('ADDRESS_LIST'))
            .success(function (response, status, headers, config) {
                if (response.code == 1) {
                    addressList = response.data;
                }
            })
    };

    this.setDefaultAddress = function (id) {
        var param = {
            addrId: id
        };
        return $http.post(UrlService.getUrl('ADDRESS_DEFAULT'), param)
    };

    this.addOrUpdateAddress = function (param) {
        return $http.post(UrlService.getUrl('ADDRESS_SAVE_UPDATE'), param)
    };

    this.deleteAddress = function (id) {
        var param = {
            addrId: id
        };
        return $http.post(UrlService.getUrl('ADDRESS_DELETE'), param)
    };

    this.getAddressById = function (addressId) {
        for (i = 0; i < addressList.length; i++) {
            if (addressList[i].hasOwnProperty('addrId') && addressList[i].addrId == addressId) {
                console.log(addressId + 'has returned!');
                return addressList[i];
            }
        }
    };
}]);