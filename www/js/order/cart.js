/********************************

 creater:maliwei@cdfg.com.cn
 create time:2015/06/19
 describe：购物车
 modify time:2015/06/19

 ********************************/

/**
 State 指令
 **/
/**
 State 过滤器
 **/
    //显示对应活动类型简称
cdfgApp.filter('promotionType', function () {
    return function (value) {
        var oPromotionType = ['', '单品折扣', '单品赠品', '品类折扣', '品类满赠'];
        return oPromotionType[value];
    }
});
/**
 *   controller 控制器信息
 *
 * **/

cdfgApp.controller('CartController', ['$scope', '$http', '$location', '$state', '$ionicPopup', 'CartService',
    'UserService', '$rootScope', 'UrlService', '$ionicModal', '$q', 'PopupService', '$ionicHistory', 'LocalCacheService',
    function ($scope, $http, $location, $state, $ionicPopup, CartService, UserService, $rootScope, UrlService,
              $ionicModal, $q, PopupService, $ionicHistory, LocalCacheService) {


        $scope.total = 0;   //总件数
        $scope.totalPrice = 0;  //总价
        $scope.editstatus = false;
        $scope.invaidPro = [];
        $scope.chkall;
        $scope.promotionFeeMoney = 0;
        $scope.cartstatu = {};
        var userInfo = UserService.getUser();
        $scope.usertype = userInfo.type;
        $scope.goBack = goBack;
        var checkedItem = [];
        var checkedItemKey = '';


        //保存商品勾选状态到localstorage
        var refreshCheckedItem = function (action, skuId) {
            if (skuId) {
                skuId += '';  //将skuId转换成sku
            }
            switch (action) {
                case 'add':
                    if (checkedItem.indexOf(skuId) < 0) {
                        checkedItem.push(skuId);
                    }
                    break;
                case 'remove':
                    var _index = checkedItem.indexOf(skuId);
                    if (_index > -1) {
                        checkedItem.splice(_index, 1);
                    }
                    break;
                case 'all':
                    //重新统计当前购物车选中状态
                    var newCheckedItem = [];
                    angular.forEach($scope.cartlist.valid, function (v) {
                        if (v.checked) {
                            newCheckedItem.push(v.skuId + '');
                        }
                    });
                    console.log(newCheckedItem);
                    checkedItem = newCheckedItem;
                    break;
                default :
                    break;
            }
            console.log('更新存储缓存');
            console.log(checkedItem);
            //更新本地存储
            LocalCacheService.set(checkedItemKey, checkedItem.join(','));
        }
        //检查存储中的勾选状态
        var checkCartCheckedStatu = function (skuId) {

            var _sku = skuId + '';
            var index = checkedItem.indexOf(_sku);

            console.log(skuId + '勾选状态' + index);
            return index > -1 ? true : false;
        }
        var giveaways = [];       //保存总赠品
        //跳转到登录页
        var gotoLogin = function () {
            $state.go('login', {last: 'cart'});
        }
        //清空购物车
        var setCartEmpty = function () {
            $scope.cartstatu = {cartempty: true};
            $scope.cartlist = {};
            CartService.deleteLocalCart();
            CartService.setCartTotal(0);
        }

        //统计购物车状态
        var countCartItem = function () {
            var params = [], hasActive = false;
            angular.forEach($scope.cartlist.valid, function (val, key) {
                // if(val.checked){
                if (val.hasActiveId) {
                    hasActive = true
                }
                params.push({
                    sku: val.skuId,
                    amount: val.quantity,
                    price: val.price
                });
                //}
            });
            return {params: params, hasActive: hasActive};
        }
        //delete showlist 删除回调
        var _deleteCallback = function (item, key, index) {
            console.log(arguments);
            //删除 活动与非活动商品
            $scope.cartlist[key].splice(index, 1);
            //非失效商品删除原始valid数据
            if (key != 'invalid') {
                for (var i = 0; i < $scope.cartlist.valid.length; i++) {
                    if ($scope.cartlist.valid[i].skuId == item.skuId) {
                        $scope.cartlist.valid.splice(i, 1);
                        break;
                    }
                }
            }
//空判断
            if ($scope.cartlist.valid.length == 0 && $scope.cartlist.invalid.length == 0) {
                setCartEmpty();
            }
        }
        //删除指定id商品
        var _deleteCart = function (item, key, index) {
            var defer = $q.defer();
            //删除非失效商品
            var url = UrlService.getUrl('DELETE_CART');
            $http.post(url, {cartId: item.id}).success(function (d) {
                if (d.code == 1) {
                    _deleteCallback(item, key, index);
                    defer.resolve(true);
                } else {
                    defer.reject(d);
                }

            });
            console.log($scope.cartlist);
            return defer.promise;

        };

        //获取||刷新数据
        var refreshCart = function () {
                checkedItemKey=userInfo.userId?'cart_checkstatus' + userInfo.userId:'cart_checkstatus0';

            //获取选择项
            checkedItem = LocalCacheService.get(checkedItemKey);
            console.log(checkedItem);
            checkedItem = checkedItem ? checkedItem.split(',') : [];

            //console.log(checkedItem);
            var d = CartService.getCartList();
            d.then(function (data) {
                //加载成功
                $scope.$broadcast('scroll.refreshComplete');
                if (data.cartempty) {
                    setCartEmpty();
                    return false;
                } else {
                    $scope.cartstatu.cartempty = false;
                    $scope.cartlist = data;
                }
                var isActive = true;
                //组合skus
                var skus = [];
                angular.forEach(data.valid, function (pro) {
                    skus.push(pro.skuId);
                });
                //有商品
                if (skus.length == 0) {

                    $scope.cartlist = data;
                    console.log($scope.cartlist);

                    return false;
                }
                //解析数据  标记sku是否有活动 初始化checked，stock等属性
                var parseDataMarkPromotion = function (data) {
                    //将skuslist解析成skuobject
                    data.promotionSkusObj = {};
                    var tempPromotionSkus = [];
                    angular.forEach(data.promotionSkus, function (valPro, key) {
                        if (valPro.promotions.length > 0) {
                            data.promotionSkusObj[valPro.sku] = {promotion: valPro.promotions};
                            tempPromotionSkus.push(valPro);
                        }
                    });
                    //组织promotionSkus
                    data.promotionSkus = tempPromotionSkus;
                    //解析已有数据
                    angular.forEach(data.valid, function (valPro, key) {
                        //标记是否有活动
                        var promotions = data.promotionSkusObj;
                        if (tempPromotionSkus.length > 0 && promotions[valPro.skuId] && promotions[valPro.skuId].promotion) {
                            //标记活动ID
                            valPro.hasActiveId = promotions[valPro.skuId].promotion[0];
                        }
                        //未登录时需设置quantity
                        if (!valPro.quantity) {
                            valPro.quantity = CartService.getLocalCart()['sku_' + valPro.skuId];
                        }
                        //保存旧quantity，以备修改数量时使用
                        valPro.oldQuantity = valPro.quantity;

                        valPro.stock = valPro.stockQuantity;
                        //设置checked状态

                        if ($scope.checkValid(valPro) && checkCartCheckedStatu(valPro.skuId)) {
                            valPro.checked = true;
                        } else {
                            valPro.checked = false;
                        }
                        //处理显示价格 销售价||内部价||手机专享价
                        valPro.price = $scope.type == 5 ? valPro.iPrice : valPro.sPrice;
                        valPro.price = valPro.mobilePrice > 0 ? valPro.mobilePrice : valPro.price;
                    });
                    //计算价格
                    //$scope.cartlist = data;
                    $scope.CalculatingPrice(isActive);

                }
                //获取活动信息
                $http.post(UrlService.getUrl('GET_CART_PROMOTION'), {skus: skus}).then(function (actval) {

                    //  console.log(actval.data);
                    //TODO：处理数据
                    if (actval.data.code == 1) {
                        data.promotionSkus = actval.data.data.skus;
                        data.promotionsInfo = actval.data.data.promotions;
                        // console.log(data);
                        parseDataMarkPromotion(data);
                    } else {
                        parseDataMarkPromotion(data);
                    }
                }, function (d) {
                    parseDataMarkPromotion(data);
                });
            });


        }
        $scope.refreshCart = refreshCart;
        //更新勾选状态
        $scope.updateCheckedStatus = function (item) {
            //取消全选
            if (item && !item.checked && $scope.chkall) {
                $scope.chkall = false;
                //如果有赠品要删除赠品
                console.log(item);
                if (item.hasActiveId && $scope.cartlist.promotionSkusObj[item.skuId]) {
                    delete $scope.cartlist.promotionSkusObj[item.skuId].gift;
                }
            }
            //判断失效
            if (!item.checked && item.quantity > item.stock) {
                item.disabled = true;
            }
            //更新checked状态
            var action = item.checked ? 'add' : 'remove';
            refreshCheckedItem(action, item.skuId);
            //计算总价
            $scope.CalculatingPrice(item.hasActive);

        };
        //编辑|完成
        $scope.toggleEdit = function () {
            var editstatus = $scope.editstatus;

            //点击完成
            if (editstatus) {

                //取消库存不足商品勾选
                angular.forEach($scope.cartlist.valid, function (value, key) {
                    //保存修改数量
                    $scope.changeCart(value);


                    if (value.disabled) {
                        value.checked = false;
                    }
                });
                // $scope.CalculatingPrice();
            }

            $scope.editstatus = !$scope.editstatus;
        };
        //判断是否失效 禁用checkbox
        $scope.checkValid = function (item) {
            if (item.quantity > item.stock) {
                item.disabled = true;
                item.checked = false;
                refreshCheckedItem('remove', item.skuId);
                return false;
            }
            return true;
        };

        //统计价格回调
        var fnCalculatingPrice = function (hasActive) {
            //活动分组
            if (hasActive || !$scope.cartlist.unpromotions) {
                console.log('重新分组');
                psrsePromotionData($scope.cartlist);
            }
            var nTotalPrice = 0;
            var nTotal = 0;
            var nCheckedTotal=0;
            var checkall = true;
            var invaidPro = [];
            var cheapPrice = 0;
            var promotionFeeMoney = 0;    //活动优惠总金额
            if (!$scope.cartlist.valid || $scope.cartlist.valid.length == 0) {
                //无有效商品
                if (!$scope.cartlist.invalid || $scope.cartlist.invalid.length == 0) {
                    //购物车为空
                    setCartEmpty();
                }
            } else {

                //计算活动商品总价
                angular.forEach($scope.cartlist.promotionSkus, function (sku, key) {
                    var value = sku.skuInfo;
                    if (!value) {
                        return false;
                    }
                    nTotal += value.quantity;

                    if (value.checked) {
                        //计算单价
                        var cheapPrice = 0;
                        //计算优惠金额
                        angular.forEach(sku.promotions, function (promotion, key) {
                            if (promotion.feeMoney) {
                                cheapPrice += promotion.feeMoney;
                            }
                        });
                        //累计价格
                        nTotalPrice += (value.price - cheapPrice) * value.quantity;
                        //累计活动优惠总价
                        promotionFeeMoney += cheapPrice * value.quantity;
                        //计算总件数
                        nCheckedTotal+=value.quantity;
                        //判断库存
                        if (value.quantity > value.stock) {
                            invaidPro.push(value);
                        }

                    } else if (!value.disabled) {
                        checkall = false;
                    }
                });
                //计算非活动商品总价
                angular.forEach($scope.cartlist.unpromotions, function (value, key) {
                    nTotal += value.quantity;

                    if (value.checked) {
                        //计算单价
                        nTotalPrice += (value.price) * value.quantity;
                        //计算总件数
                        nCheckedTotal+=value.quantity;
                        //判断库存
                        if (value.quantity > value.stock) {
                            invaidPro.push(value);
                        }
                    } else if (!value.disabled) {
                        checkall = false;
                    }
                });
                //更新失效列表
                $scope.invaidPro = invaidPro;
                //设置全选
                if (checkall != $scope.chkall) {
                    $scope.chkall = checkall;
                }
                //设置优惠总价
                $scope.promotionFeeMoney = promotionFeeMoney;
            }
            //设置总价
            $scope.totalPrice = nTotalPrice;
            $scope.total = nCheckedTotal;
            CartService.setCartTotal(nTotal);
            console.log('计算：当前件数:' + nCheckedTotal);
            console.log(nTotal);
        }
        //解析数据 分组
        var psrsePromotionData = function (data) {
            $scope.cartstatu.cartempty = false;
            //处理数据
            data.unpromotions = [];

            //有活动，将商品信息按活动分组
            var carttotal = 0;
            //处理活动数据  标记活动开始位置&&标记赠品活动
            var curPromotion = '', curSinglePromotion = '';

            console.log(data);
            angular.forEach(data.promotionSkus, function (valPro, key) {
                angular.forEach(valPro.promotions, function (info, k) {
                    var id = info.id;
                    //console.log(id);
                    //console.log(info);
                    if(!data.promotionsInfo[id]){info.show = false;return false}
                    var promotionType = data.promotionsInfo[id].promotionType;
                    //品类活动分组
                    if (promotionType == 3 || promotionType == 4) {
                        if (id != curPromotion) {
                            info.show = true;
                            curPromotion = id;
                            //显示领取赠品
                            if (promotionType == 4 || promotionType == 2) {
                                valPro.giftPromotionId = id;
                                //判断如果没有selectedGift，则创建，如果有，则说明这不是初次渲染
                                if (!valPro.selectedGift) {
                                    valPro.selectedGift = [];
                                }
                            }
                        } else {
                            info.show = false;
                        }
                    } else {
                        //单品活动分组
                        if (id != curSinglePromotion) {
                            info.show = true;
                            curSinglePromotion = id;
                            //显示领取赠品
                            if (promotionType == 4 || promotionType == 2) {
                                valPro.giftPromotionId = id;
                                //判断如果没有selectedGift，则创建，如果有，则说明这不是初次渲染
                                if (!valPro.selectedGift) {
                                    valPro.selectedGift = [];
                                }
                            }
                        } else {
                            info.show = false;
                        }
                    }


                });
            });

            angular.forEach(data.valid, function (valPro, key) {
                //再归属活动
                var sku = valPro.skuId;
                var exist = false;  //z
                var promotionSkus = data.promotionSkus;
                var curSku;
                if (promotionSkus) {
                    for (var i = 0; i < promotionSkus.length; i++) {
                        curSku = promotionSkus[i];
                        if (curSku.sku == valPro.skuId) {
                            //如果相同则关联
                            curSku.skuInfo = valPro;
                            //标记确实有活动
                            valPro.actualActiveId = curSku.promotions;
                            //找到则跳出循环
                            exist = true;
                            break
                        }
                    }
                }
                if (!exist) {
                    data.unpromotions.push(valPro);
                }
            });

            $scope.cartlist = data;
            //console.log($scope.cartlist);

        }
        //统计价格
        $scope.CalculatingPrice = function () {
            var params = countCartItem();
            // console.log(params);
            if (params.hasActive) {
                //有活动商品 计算价格
                $http.post(UrlService.getUrl('CALC_PROMOTION'), {skus: JSON.stringify({skus: params.params})}).success(function (actval) {


                    //处理数据
                    if (actval.code == 1) {
                        //解析数据 按活动 prom
                        //
                        // otionSkus与非活动 unpromotions分组
                        var promotionSkus = [], unpromotions = [];
                        angular.forEach(actval.data.skus, function (sku, key) {
                            if (sku.promotions.length > 0) {
                                //console.log(sku.sku);
                                //console.log($scope.cartlist);
                                //渲染已选择赠品
                                if ($scope.cartlist.promotionSkusObj[sku.sku] && $scope.cartlist.promotionSkusObj[sku.sku].gift) {
                                    sku.selectedGift = $scope.cartlist.promotionSkusObj[sku.sku].gift;
                                }
                                promotionSkus.push(sku);
                                // console.log(sku.selectedGift);
                            } else {
                                unpromotions.push(sku);
                            }
                        });
                        $scope.cartlist.promotionSkus = promotionSkus;
                        $scope.cartlist.promotionsInfo = actval.data.promotions;
                    }
                    //计算价格
                    fnCalculatingPrice(actval.code == 1);

                }).error(function () {
                    console.log('活动计算错误');
                    //计算价格
                    fnCalculatingPrice();
                });
            } else {
                //无活动商品
                fnCalculatingPrice();
            }
        };
        //加减购物车--数量
        $scope.fnChangeCart = function (item, action) {
            console.log(item.stock);
            if (action == '+') {
                if (item.quantity + 1 > item.stock) {
                    PopupService.showPrompt('库存不够了');
                    return false;
                }
                item.quantity++;
            } else {
                if (item.quantity > 1) {
                    item.quantity--
                } else {
                    return false;
                }
            }
            $scope.changeCart(item);
        };
        //加减购物车--加减
        $scope.changeCart = function (item) {
            var quantity = item.quantity, stock = item.stock;
            var filter = /^[1-9][0-9]*$/;
            if (!quantity || !filter.test(quantity) || quantity < 1) {
                quantity = item.quantity = item.oldQuantity;
            }
            if (quantity > stock) {
                quantity = item.quantity = stock;
                item.disabled = false;
            }
            if (item.quantity == item.oldQuantity) {
                return false;
            }
            if (userInfo.isLogined()) {
                //更改购物车数量
                $http.post(UrlService.getUrl('CHANGE_CART'), {
                    cartId: item.id,
                    skuId: item.skuId,
                    quantity: item.quantity
                })
                    .success(function (d) {
                        console.log(d);
                        if (d.code == 1) {
                            //更新库存
                            item.stock = d.data;
                            if (item.checked) {
                                $scope.CalculatingPrice(item.hasActive);
                            }
                            //更新oldQuantity
                            item.oldQuantity = item.quantity;
                        } else {
                            item.quantity = item.oldQuantity;
                            console.log('修改失败' + d.data);
                        }
                    });
            } else {
                CartService.changeCart(item.skuId, item.quantity);
                if (item.checked) {
                    $scope.CalculatingPrice(item.hasActive);
                }
                item.oldQuantity = item.quantity;
            }

        };

        //单个删除购物车  参数1 当前购物车商品对象，参数2 cartlist[key] 参数3 index
        $scope.deleteCart = function (item, key, index) {
            //confirm
            PopupService.confirmPopup('确定删除吗').then(function (res) {
                //取消
                if (!res) {
                    return false
                }
                //确定
                if (userInfo.isLogined()) {
                    //登录操作
                    _deleteCart(item, key, index).then(function (d) {
                        //console.log('删除回调');
                        $scope.CalculatingPrice(item.hasActive);
                    });
                } else {
                    //非登录--本地操作
                    if (CartService.deleteLocalCart(item.skuId, item.quantity)) {
                        _deleteCallback(item, key, index);
                    }
                    $scope.CalculatingPrice(item.hasActive);
                }

                return false;
            });


        };
        //批量删除数据
        var _batchDeleteCartCallBack = function () {
            var fnDelete = function (key) {
                for (var y = 0; y < $scope.cartlist[key].length; y++) {
                    if (key == 'promotionSkus') {
                        var sku = $scope.cartlist[key][y].skuInfo;
                    } else {
                        var sku = $scope.cartlist[key][y];
                    }
                    if (sku.checked) {
                        $scope.cartlist[key].splice(y, 1);
                        y--;
                    }
                }
            }
            fnDelete('promotionSkus')
            fnDelete('unpromotions')
            fnDelete('valid')
            $scope.CalculatingPrice();
        }
        //批量删除  参数为是否隐藏删除成功信息 默认为提示
        $scope.batchDeleteCart = function (blHide) {

            //删除
            var fnDel = function () {
                var validpro = $scope.cartlist.valid;
                var cartId=[];
                //统计选中的cartid
                angular.forEach(validpro,function(v){
                    if(v.checked){
                        cartId.push(v.id);
                    }
                });
                if (userInfo.isLogined()) {
                    //登录状态
                    var url = UrlService.getUrl('DELETE_CART');
                    console.log(cartId);
                    //return false;
                    $http.post(url, {cartId: cartId}).success(function (d) {
                        if (d.code == 1) {
                            //删除成功
                            //$rootScope.$broadcast('refreshCart',true);
                            //refreshCart();
                            _batchDeleteCartCallBack();
                            if (!blHide) {
                                PopupService.showPrompt('删除成功');
                            }
                        }
                    });
                } else {
                    //非登录状态--需要删除本地存储
                    var arrSkus=['promotionSkus','unpromotions']
                    angular.forEach(arrSkus,function(v,k){
                        var validPro=$scope.cartlist[v];
                        for (var i = 0; i < validPro.length; i++) {
                            if (validPro[i].checked) {
                                var curSku=validPro[i];
                                //非登录--本地操作
                                if (CartService.deleteLocalCart(curSku.skuId, curSku.quantity)) {
                                    _deleteCallback(curSku,v, i);
                                }
                                i--;
                            }
                        }
                    })

                    $scope.CalculatingPrice();
                }
            }
            //confirm
            if (blHide) {
                fnDel();
            } else {
                PopupService.confirmPopup('确定删除吗').then(function (res) {
                    //取消
                    if (!res) {
                        return false
                    }
                    if ($scope.total == 0) {
                        alert('请选择一件商品');
                        return false;
                    }
                    fnDel();

                });
            }
        };
        //清除失效商品
        $scope.removeInvalidPro = function () {
            var invalidPro = $scope.cartlist.invalid;
            if (userInfo.isLogined()) {
                //登录状态
                var cartId = [];
                for (var i = 0; i < invalidPro.length; i++) {
                    cartId.push(invalidPro[i].id);
                }

                var url = UrlService.getUrl('DELETE_CART');
                $http.post(url, {cartId: cartId}).success(function (d) {
                    if (d.code == 1) {
                        $scope.cartlist.invalid = [];
                        PopupService.showPrompt('操作成功');
                    }
                    if ($scope.cartlist.valid.length == 0 && $scope.cartlist.invalid.length == 0) {
                        setCartEmpty();
                    }
                });
            } else {
                //非登录状态--需要删除本地存储
                for (var i = 0; i < invalidPro.length; i++) {
                    $scope.deleteCart(invalidPro[i], 'invalid', i);
                    i--;
                    console.log(invalidPro);
                    if (invalidPro.length == 0) {
                        return false;
                    }
                }
            }
        }
        //移入收藏夹
        $scope.moveToCollect = function () {
            //检查登录
            if (!UserService.getUser().isLogined()) {
                gotoLogin();
                return false;
            }
            //获取所有已选项
            var skuId = [];
            angular.forEach($scope.cartlist.valid, function (value, key) {
                if (value.checked) {
                    skuId.push(value.skuId);
                }
            });
            if (skuId.length == 0) {
                alert('请选择商品')
            }
            PopupService.confirmPopup('确定移入收藏夹？')
                .then(function (res) {
                    if (!res) {
                        return false;
                    }
                    //先执行收藏
                    $http.post(UrlService.getUrl('ADD_FAVORATE_BY_LIST'), {skuId: skuId})
                        .success(function (d) {
                            //1是成功 -10是重复
                            if (d.code == 1 || d.code == -10) {
                                //再执行删除
                                $scope.batchDeleteCart(true);

                                PopupService.showPrompt('移至收藏夹成功');
                            } else {
                                PopupService.showPrompt(d.data);
                            }
                        });
                });

        };
        //全选|全不选
        $scope.chkAll = function (checked) {
            angular.forEach($scope.cartlist.valid, function (value, key) {
                if ($scope.editstatus) {
                    value.checked = checked;
                    refreshCheckedItem('add', value.skuId);
                } else if (!value.disabled) {
                    value.checked = checked;
                }
            });
            console.log($scope.cartlist.promotionSkus);
            //删除所有赠品
            if (!checked) {
                angular.forEach($scope.cartlist.promotionSkus, function (value, key) {
                    console.log(value);
                    if (value.selectedGift && value.selectedGift.length > 0) {
                        value.selectedGift = [];
                        delete $scope.cartlist.promotionSkusObj[value.skuInfo.skuId].gift;
                    }
                });
            }

            if (checked) {

                $scope.CalculatingPrice($scope.cartlist.promotionSkus && $scope.cartlist.promotionSkus.length > 0);
            } else {
                $scope.total = 0;
                $scope.totalPrice = 0;
                $scope.invaidPro = [];
            }
        };

        //结算验证
        $scope.settlement = function () {
            //结算时先//获取登陆状态 验证登陆状态
            var userInfo = UserService.getUser();
            var error = '';
            //检查登录
            if (!userInfo.isLogined()) {
                $state.go('login', {last: 'cart', params: ''});
                return false;
            }

            //非空验证
            if ($scope.total == 0) {
                PopupService.alertPopup('请至少选择一件商品');
                return false;
            }
            //验证成功
            var orderlist = [];
            //统计免税店商品及快递到家商品
            var freePro = [], commPro = [], curStore = '';
            var generalProTotalPrice = $scope.totalPrice; //普通商品总价
            var freeTotalPrice = 0;
            var freeTotal = 0;
            angular.forEach($scope.cartlist.valid, function (value) {
                if (value.checked) {
                    orderlist.push(value);
                    if (value.sId) {
                        if (curStore == '') {
                            curStore = value.sId;
                        } else if (value.sId != curStore) {
                            error = '只能购买您出境地的免税店商品';
                            return false;
                        }
                        //免税品
                        freePro.push(value);
                        freeTotalPrice += value.price;
                        freeTotal += value.quantity;
                    } else {
                        //普通商品
                        commPro.push(value);
                    }
                }
            });
            if (error != '') {
                PopupService.alertPopup(error);
                return false;
            }
            //统计活动feeMoney --组装成订单提交需要的数据
            console.log($scope.cartlist);
            angular.forEach($scope.cartlist.promotionSkus, function (v) {
                //组装活动
                if (v.skuInfo.checked) {
                    v.skuInfo.promotions = [];
                    angular.forEach(v.promotions, function (promotion) {
                        //活动feeMoney
                        if (promotion.feeMoney) {
                            v.skuInfo.feeMoney = promotion.feeMoney;
                        }
                        //组装sku对应的活动
                        v.skuInfo.promotions.push({
                            promotionId: promotion.id,
                            promoteDiscountPrice: promotion.feeMoney ? promotion.feeMoney : 0
                        })
                    });

                }
            });
            //保存checkedprolist

            generalProTotalPrice = $scope.totalPrice - freeTotalPrice;
            console.log(freeTotalPrice);
            //统计赠品及活动
            var giveaways = [], giveawaysDetail = [];
            angular.forEach($scope.cartlist.promotionSkus, function (sku, key) {
                //组装赠品
                var gift = sku.selectedGift;
                if (gift && gift.length > 0) {
                    giveawaysDetail.push(gift[0]);
                    giveaways.push({
                        skuId: gift[0].skuId,
                        quantity: gift[0].quantity ? gift[0].quantity : 1,

                        promotionId: gift[0].giftPromotionId
                    });
                }

            });
            CartService.setOrderProList({
                orderlist: orderlist,
                total: $scope.total,
                generalProTotalPrice: generalProTotalPrice,       //非免税商品总价 --获取运费需要
                totalPrice: $scope.totalPrice,
                skusPrice: $scope.totalPrice + $scope.promotionFeeMoney,
                promotionFeeMoney: $scope.promotionFeeMoney,
                giveaways: giveaways,
                giveawaysDetail: giveawaysDetail,
                freePro: freePro,
                commPro: commPro,
                freeTotal: freeTotal
            });

            //console.log(CartService.getOrderProList());
            //更新勾选状态
            refreshCheckedItem('all');
            $state.go('confirm-order');


        };
        //领取赠品
        $ionicModal.fromTemplateUrl('modal-selectgift.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.giftmodal = modal;
        });
        //赠品弹层
        $scope.curSku = '';
        $scope.selectGift = function (promotionid, skuitem) {
            console.log(promotionid);
            $scope.giftmodal.show();
            $scope.curSku = skuitem;
            var giftlist = $scope.cartlist.promotionsInfo[promotionid].feeGoods;
            $http.get(UrlService.getUrl('GET_CART_UNLOGIN'), {params: {skuId: giftlist}}).success(function (data) {
                $scope.skudata = data;
            });
        }
        //选择赠品
        $scope.checkGift = function (item) {
            $scope.curSku.tempGift = item;
            $scope.curSku.tempGift.giftPromotionId = $scope.curSku.giftPromotionId;
            //console.log($scope.cartlist);
        }
        //关闭赠品
        $scope.closemodal = function () {
            $scope.giftmodal.hide();
        }
        //确认添加赠品
        $scope.submitgift = function () {
            //curGift.quantity
            //验证
            $scope.curSku.selectedGift[0] = $scope.curSku.tempGift;
            $scope.giftmodal.hide();
            $scope.cartlist.promotionSkusObj[$scope.curSku.skuInfo.skuId].gift = $scope.curSku.selectedGift;
            // console.log($scope.cartlist);
        }
        //进入购物车刷新购物车
        $scope.$on('$ionicView.enter', function () {
            //每次进入购物车取消编辑状态
            $scope.editstatus = false;
            refreshCart();
        });

        //返回上一页
        function goBack() {
            refreshCheckedItem('all');
            $ionicHistory.goBack();
        }
    }]);


























