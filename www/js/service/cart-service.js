/**
 * Created by xuzunyuan on 2015/7/29.
 * modify by maliwei on 2015/07/31
 */
cdfgApp.factory('CartService', ['$http', '$q', 'UserService', 'UrlService', 'LocalCacheService', '$rootScope',
    function ($http, $q, UserService, UrlService, LocalCacheService, $rootScope) {
        var loginStatus = false;
        var cartlist = {};
        var orderProList = {};
        var invalidProList = [];
        var localcart = LocalCacheService.getObject('localcart');
        var cartTotal = LocalCacheService.getObject('cartTotal');
        var userInfo={};
        if (!cartTotal.skus) {
            //初始化cartTotal
            cartTotal.total = 0;
            cartTotal.skus = [];
        } else {
            //校验cartTotal，保持一致
            if (cartTotal.skus.length == 0) {
                cartTotal.total = 0;
                localcart = {};
                LocalCacheService.setObject('localcart', {});
            }
        }
        var othis = this;
        console.log(localcart);
        console.log(cartTotal);

        //设置本地勾选状态
        var _refreshCheckedItem=function(arrSku){
            console.log(arrSku);
            var userId=userInfo.userId?userInfo.userId:0;
            var checkedItemKey='cart_checkstatus' + userId;
            var checkedItem = LocalCacheService.get(checkedItemKey);
            checkedItem = checkedItem ? checkedItem.split(',') : [];
            angular.forEach(arrSku,function(sku,key){
                //转换成字符串
                sku=sku+'';
                if (checkedItem.indexOf(sku) < 0) {
                    checkedItem.push(sku);
                }
            });
            console.log(checkedItemKey);
            console.log(checkedItem);
            LocalCacheService.set(checkedItemKey, checkedItem.join(','));
        }
        //更新本地缓存  参数：sku|数量|操作
        var _refreshLocalCart = function (action, sku, argQuantity) {
            switch (action) {
                //删除
                case 'delete':
                    delete localcart['sku_' + sku];
                    cartTotal.skus.splice(cartTotal.skus.indexOf(sku), 1);
                    if (argQuantity) {
                        //非失效商品
                        cartTotal.total -= argQuantity;
                    }
                    break;
                //添加
                case 'add':
                    if (localcart['sku_' + sku]) {
                        localcart['sku_' + sku] = localcart['sku_' + sku] + parseInt(argQuantity);
                    } else {
                        localcart['sku_' + sku] = argQuantity;
                    }
                    console.log('添加' + sku);
                    if (cartTotal.skus.indexOf(sku) < 0) {
                        cartTotal.skus.push(sku);
                    }
                    cartTotal.total += argQuantity;

                    break;
                case 'change':
                    //默认是覆盖原数量
                    var dif = argQuantity - localcart['sku_' + sku];
                    console.log('dif:' + dif);
                    localcart['sku_' + sku] = argQuantity;
                    cartTotal.total += dif;
                    break;
                default :
                    console.log('未选择更新操作');
            }
            LocalCacheService.setObject('localcart', localcart);
            LocalCacheService.setObject('cartTotal', cartTotal);
            console.log(cartTotal);
            console.log(localcart);
            return true;
        };
        // console.log(JSON.parse(localStorage.getItem('localcart')));

        //删除本地购物车--登陆时需要全部删除
        var _deleteLocalCart = function (sku, argQuantity) {
            if (sku) {
                return _refreshLocalCart('delete', sku, argQuantity);
            } else {
                cartTotal = {total: 0, skus: []};
                LocalCacheService.setObject('cartTotal', cartTotal);
                LocalCacheService.remove('localcart');
                localcart = {};
                //清空本地购物车勾选状态
                LocalCacheService.set('cart_checkstatus','');
            }
            console.log('删除本地');
            console.log(cartTotal);
            console.log(LocalCacheService.getObject('localcart'));
        };


        return {
            //获取购物车总数
            getCartTotal: function () {
                console.log('获取购物车总数');
                console.log(cartTotal);
                return cartTotal;
            },
            //设置购物车总数
            setCartTotal: function (number) {
                cartTotal.total = number;
                return cartTotal;
            },
            //获取本地购物车
            getLocalCart: function () {
                console.log(localcart);
                return localcart;
            },
            //删除本地购物车
            deleteLocalCart: function (sku, argQuantity) {
                return _deleteLocalCart(sku, argQuantity);
            },
            //登录合并购物车&&设置购物车数量--登录时调用
            joinLocalCart: function () {
                var skulist = [];
                var quantitylist = [];
                var skus = cartTotal.skus;
                if (skus.length == 0) {
                    return false;
                }
                //收集本地购物车数据
                for (var i = 0; i < skus.length; i++) {
                    skulist.push(skus[i]);
                    quantitylist.push(localcart['sku_' + skus[i]]);
                }

                console.log('合并购物车');

                var url = UrlService.getUrl('ADD_CART');
                //将本地购物车同步到服务器
                $http.post(url,{skuId: skulist, quantity: quantitylist})
                    .success(function (data) {
                        if (data.code == 1) {
                            console.log('合并成功');
                            userInfo=UserService.getUser();
                            _refreshCheckedItem(skulist);
                            _deleteLocalCart();
                        } else {
                            console.log(data.msg);
                        }
                    });
            },
            //加入购物车--商品详情页调用
            addToCart: function (sku, argQuantity) {
                if (!sku) {
                    return false
                }
                var quantity = parseInt(argQuantity);
                //验证数量
                if (quantity <= 0) {
                    alert('添加购物车数量不能为0');
                    return false;
                }
                var d = $q.defer();
                //获取登陆状态
                userInfo = UserService.getUser();
                if (userInfo.isLogined()) {
                    //如果登陆，则同步到服务器
                    var url = UrlService.getUrl('ADD_CART');
                    $http.post(url, {
                        skuId: sku, quantity: argQuantity
                    }).success(function (data) {
                        if (data.code == 1) {
                            cartTotal.total+=argQuantity;
                            d.resolve(1);
                            //保存新加入商品的勾选状态
                            _refreshCheckedItem([sku]);

                        } else {
                            console.log(data.msg);
                            d.resolve(0);
                        }


                    });
                } else {
                    //同步本地缓存
                    _refreshLocalCart('add', sku, argQuantity);
                    //保存新加入商品的勾选状态
                    _refreshCheckedItem([sku]);
                    d.resolve(1);
                }
                return d.promise;
            },
            //更改数量--购物车页调用
            changeCart: function (sku, argQuantity) {
                var quantity = parseInt(argQuantity);
                //验证数量
                if (quantity <= 0) {
                    alert('数量不能为0');
                    return false;
                }
                //同步本地缓存
                _refreshLocalCart('change', sku, argQuantity)
            },
            //拉取购物车清单--购物车页调用
            getCartList: function (isSetTotal) {
                var userInfo = UserService.getUser();
                var deferred = $q.defer();
                //未登录处理
                var unloginCallback=function(){
                    if (cartTotal.total == 0 || cartTotal.skus.length == 0) {
                        deferred.resolve({cartempty: true});
                    } else {
                        //传本地cart sku获取商品信息
                        $http.get(UrlService.getUrl('GET_CART_UNLOGIN'), {params: {skuId: cartTotal.skus}}).success(function (data) {
                            console.log(data);
                            deferred.resolve(data);
                        });
                    }
                }
                //如果登陆的话返回后台信息
                if (userInfo.isLogined()) {
                    $http.post(UrlService.getUrl('GET_CART'))
                        .then(function (val) {
                            val=val.data;
                            if (val.code == -1) {
                                console.log('服务器报错' + val.code);
                                deferred.resolve({cartempty: true});
                                deferred.reject(val);
                            }else if(val.code==-101){
                                //用户未验证，清空用户信息，当未登录处理
                                UserService.clearUser();
                                unloginCallback();
                            }else{
                                //获取sku详细信息
                                var _cartlist = val.data;
                                //无有效商品则直接返回商品列表
                                if (_cartlist.valid.length == 0 && _cartlist.invalid.length == 0) {
                                    deferred.resolve({cartempty: true});
                                } else {
                                    deferred.resolve(_cartlist);
                                }
                            }

                        });
                } else {
                    //未登录
                    unloginCallback();

                }
                return deferred.promise;
            },
            //获取订单商品清单
            getOrderProList: function () {
                return orderProList;
            },
            //设置购物车内容----购物车页调用
            setOrderProList: function (tmpCartList) {
                orderProList = tmpCartList;
                return true;
            },
            //设置失效商品清单
            setInvalidList: function (tmpProList) {
                invalidProList = tmpProList;
            },
            //获取失效商品清单
            getInvalidList: function () {
                return invalidProList;
            }

        }
    }]);
