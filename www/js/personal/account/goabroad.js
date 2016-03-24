/**
 * AddressController
 * 联网和服务器交互和地址addressService复用
 * Created by ZCP on 2015/7/6.
 */
cdfgApp.controller('GoabroadController', ['$scope', 'AddressService', '$stateParams', '$ionicListDelegate',
    '$rootScope', 'PopupService', '$ionicHistory', '$state',
    function ($scope, AddressService, $stateParams, $ionicListDelegate, $rootScope, PopupService, $ionicHistory, $state) {
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
                                console.log('地址删除成功！');
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
            console.log(addr);
            if (addr.passportNo) {
                $scope.selectedAddress = addr.addrId;
                $rootScope.$broadcast('SELECT_ADDRESS', addr);
                $scope.$ionicGoBack();
            } else {
                PopupService.confirmPopup('提示', '出境人信息不完整，是否去补充？', '去补充', '取消').then(function (res) {
                    //取消
                    if (!res) {
                        return false
                    } else {
                        $state.go('goabroadDetail', {'addressId': addr.addrId});
                        return false;
                    }
                });

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