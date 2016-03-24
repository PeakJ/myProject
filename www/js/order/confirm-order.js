/********************************

 creater:maliwei@cdfg.com.cn
 create time:2015/06/19
 describe：购物车
 modify time:2015/06/19

 ********************************/
/**
 State 模块路由
 **/
/**
 *  Service 模块服务
 **/


/**
 *   controller 控制器信息
 *
 * **/
cdfgApp.controller('ConfirmOrderController', ['$scope', '$http', 'CartService', '$state', '$timeout', '$rootScope', '$ionicModal', 'UrlService', 'UserService', 'PopupService', '$ionicPopup','$cordovaDatePicker','$filter', function ($scope, $http, CartService, $state, $timeout, $rootScope, $ionicModal, UrlService, UserService, PopupService, $ionicPopup,$cordovaDatePicker,$filter) {

    var curAction = '';
    var skusSimple = [];  //简版skus，获取优惠券时要用
    var couponInfo = {};  //使用的优惠券信息，包含sku和平摊价格 提交订单时使用
    var geoId = '';        //地址省份信息
    var curCoupon = ''; //选中的优惠券
    $scope.coupon={};   //确定使用的优惠券信息
    $scope.accountInfo = {zmcard: '', usecard: 0,isSetPwd:false,temppwd:''};   //优惠券中免卡信息
    $scope.addressInfo = {};  //收货地址
    $scope.selfTaking={};   //自提信息
    $scope.invoice = {checked: false, info: '', type: ''}; //发票
    $scope.couponList = [];        //优惠券列表
    $scope.userRemark = {info: ''};       //用户留言
    $scope.rechargeParams = {couponNo: ''};    //优惠券绑定
    $scope.realChargeFee = 0; //实际支付金额(总计)=商品总额-中免卡+运费-优惠券
    $scope.giftShowLength = 0;
    var goabroad={time:'',flight:'',tempflight:'',temptime:''};        //出境人信息
    $scope.goabroad=goabroad;   //航班信息和出境时间

//发票modal
    $ionicModal.fromTemplateUrl('modal-invoic.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
//获取运费
    var getDelverFee = function () {
        //如果只有免税店商品，则运费为0
        if($scope.orderProList.commPro.length==0){
            $scope.orderProList.fee=0;
            return false;
        }
        //有非免税店商品
        if (!geoId) {
            return false
        }
        var expense = $scope.orderProList.generalProTotalPrice - $scope.coupnPrice;
        if (!expense || expense < 0) {
            return false;
        }
        $http.get(UrlService.getUrl('GET_FEE'), {params: {geoId: geoId, expense: expense}}).success(function (d) {
            // if(d<$scope.orderProList.fee)
            $scope.orderProList.fee = d;
            console.log($scope.realChargeFee);
            // if($scope.accountInfo.usecard>0&&$scope.accountInfo.usecard>$scope.realChargeFee+$scope.accountInfo.usecard)
            //   console.log('产生运费后：'+$scope.realChargeFee);

        })
    }
   //选择出境提货时间
$ionicModal.fromTemplateUrl('modal-goabroad.html', {
    scope: $scope,
    animation: 'slide-in-up'
}).then(function (modal) {
    $scope.goabroadModal = modal;
});

 $scope.showGoAbroadTime=function(){
     $scope.goabroadModal.show();
 }
//选择出境时间
    $scope.showDatePicker=function(){
       // console.log(new Date().getTime());
        //var t=$filter('date')(,'yyyy-MM-dd HH:mm:ss');
        //console.log(t);
        //选择出境时间
        var options = {
            date: new Date(),
            mode: 'date time', // or 'time'
            minDate: new Date(),
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        $cordovaDatePicker.show(options).then(function(d){

            var data=$filter('date')(d,'yyyy-MM-dd HH:mm:ss');
           // alert(d-new Date());

            goabroad.temptime2=d;
            goabroad.temptime=data;

            //alert(data);
        });
    }


 //确认出境时间
    $scope.confirmGoabroad=function(){
        //验证时间
        if(goabroad.temptime2-new Date()<1800000){
            alert('请出境30分钟前下单');
            return false;
        }
        //验证航班
        if(!goabroad.tempflight){
           PopupService.alertPopup('航班号格式不正确');
            return false;
        }
        $scope.goabroad.time=$scope.goabroad.temptime;
        $scope.goabroad.flight=$scope.goabroad.tempflight;
        //console.log(goabroad);
        console.log($scope.goabroad);
        $scope.goabroadModal.hide();
    }

//获取收货地址
    var getDefaultAddr = function () {
        $http.post(UrlService.getUrl('GET_DEFAULT_ADDRESS')).success(function (d) {
            //1成功 0 没有默认地址
            if (d.code == 1) {
                //获取默认地址
                $scope.addressInfo = d.data;
                geoId = d.data.province;
                if(d.data.passportNo){
                    $scope.selfTaking= d.data;
                }
                //获取运费
                getDelverFee();
            } else if (d.code == 0) {
                $scope.addressInfo = {};
            }
        });
    }
//获取可用优惠券
    var getUsableCoupon=function(couponAllList){
        //组装简版skus
        console.log($scope.orderProList.orderlist);
        if (skusSimple.length == 0) {
            angular.forEach($scope.orderProList.orderlist, function (v) {
                skusSimple.push({
                    sku: v.skuId,
                    amount: v.quantity,
                    price: v.price
                });
            });
        }
        console.log(skusSimple);
        //获取可用优惠券列表
        if ($scope.couponList.length == 0) {
            console.log(UserService.getUser())
            var _params = {
                totalPrice: $scope.orderProList.totalPrice,
                userType: UserService.getUser().type,
                skus: JSON.stringify({skus: skusSimple})
            };
            $http.post(UrlService.getUrl('GET_Useable_coupon'), _params).success(function (_data) {
                var d=_data;
                if (d.code!=1){
                    //如果服务器报错，则当做无可用处理
                    d.data=[];
                }
                //优惠券列表
                //$scope.couponList = d.data;
                var couponUsableList= d.data;
              //  console.log(couponUsableList);
                var arrCouponId=[];
                //统计可用优惠券id
                angular.forEach(couponUsableList,function(v){
                    arrCouponId.push(v.couponCode);
                });
                console.log(arrCouponId);
                console.log(couponAllList);
                //标记优惠券是否可用
                angular.forEach(couponAllList,function(v,k){
                   // console.log(k);
                    if(arrCouponId.indexOf(v.couponCode)>-1){
                        console.log(arrCouponId.indexOf(v.couponCode));
                        couponAllList[k]=couponUsableList[arrCouponId.indexOf(v.couponCode)]
                        couponAllList[k].usable=1;
                    }else{
                        v.usable=2;
                    }

                });
                $scope.couponList =couponAllList;
                //优惠券数量
                console.log(d.data.length);
                $scope.accountInfo.couponCount = d.data.length;

            });
        }
    }
//获取全部优惠券
    var getCoupon = function () {
        //获取所有优惠券
        var availableParams = {
            type: 1,
            page: 1,
            pageSize: 50
        };
        //获取可用优惠券列表
        $http.post(UrlService.getUrl('GET_COUPONS'),availableParams).success(function(response){
            console.log('可用优惠券列表 response == ' + JSON.stringify(response));

            //网络异常、服务器出错
            if(!response || response == CDFG_NETWORK_ERROR){
                return;
            }
            if(response.code == 1){
                var couponList =response.data.coupons;
                //如果账户有优惠券则获取可用
                if(couponList.length>0){
                    getUsableCoupon(couponList);
                }else{
                    //如果没有则直接为0
                    $scope.accountInfo.couponCount = 0;
                }
            } else {
                PopupService.alertPopup(CDFG_NETWORK_ERROR);
            }

        }).error(function(response){
            if($scope.indexObj.index == 0) {
                PopupService.alertPopup(CDFG_NETWORK_ERROR);
            }
        });


    }
//获取中免卡余额
    var getZmCard = function () {
        $http.post(UrlService.getUrl('GET_BALANCE')).success(function (d) {
            if (d.code == 1) {
                $scope.accountInfo.zmcardVal = d.data.balance ? parseFloat(d.data.balance) : 0;
                $scope.accountInfo.usecard = 0;
                $scope.accountInfo.isSetPwd= d.data.status==1?true:false;
            }
        });
    }

    $scope.deliveryTime = {text: '所有日期均可送货', value: 0};


//返回
    $scope.back = function () {
        $state.go('cart');
        curAction = 'cart';
    };
//送货时间
    $rootScope.$on('DELIVERYTIME', function (event, key) {
        $scope.deliveryTime = key;
    });

//开发票
    $scope.Invoicing = function (bloon) {
        //
        if ($scope.invoice.checked) {
            $scope.modal.show();
        }
    };
    $scope.typeinvoice;
//确定发票
    $scope.confirminvoice = function () {
        if ($scope.invoice.type != '') {
            $scope.invoice.info = $scope.invoice.type;
            $scope.modal.hide();
        }
    };
//关闭modal
    $scope.closemodal = function (modalName) {
        //关闭指定modal
        if(modalName){
            $scope[modalName].hide();
        }else{
            if ($scope.invoice.info == '') {
                $scope.invoice.checked = false;
            }
            $scope.invoice.type == '';
            $scope.modal.hide();
        }
    };

//优惠券modal
    $ionicModal.fromTemplateUrl('modal-coupon.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.couponmodal = modal;
    });

//显示优惠券列表
    $scope.showCoupon = function (bloon) {

        $scope.couponmodal.show();

    };

    //绑定优惠券
    $scope.bindCoupon = function () {
        console.log('rechargeCoupon--couponNo = ' + $scope.rechargeParams.couponNo);
        if (!$scope.rechargeParams.couponNo) {
            return;
        }
        var bindParams = {
            couponCode: $scope.rechargeParams.couponNo
        };
        console.log('绑定优惠券 request params == ' + JSON.stringify(bindParams));
        $http.post(UrlService.getUrl('BIND_COUPON'), bindParams).success(function (response) {
            console.log('绑定优惠券 response == ' + JSON.stringify(response));
            if (response.code == 1) {
                PopupService.alertPopup('绑定成功');
                $scope.rechargeParams.couponNo = '';
                //更新优惠券列表
                $scope.couponList = [];
                //$scope.showCoupon();
                getCoupon();
            } else {
                PopupService.alertPopup('此优惠券无效');
            }
        }).error(function (response) {
            PopupService.alertPopup(CDFG_NETWORK_ERROR);
        });
    }

//确定使用优惠券

    $scope.confirmCoupon = function () {
        console.log(curCoupon);
        if (!curCoupon) {
            return false;
        }
        var orderProList = $scope.orderProList;
        var skus = orderProList.orderlist;
        var couponNo = curCoupon.couponCode;
        var couponValue=curCoupon.price;    //优惠券面值
        //使用优惠券--统计可用skus
        var curSkus = [];
        console.log($scope.orderProList);
        angular.forEach(orderProList.orderlist, function (v) {
            //当前sku是优惠券可用sku
            if (curCoupon.skus.indexOf(v.skuId) > -1) {
                curSkus.push({
                    couponCode: couponNo,
                    couponPrice:curCoupon.price,
                    sku: v.skuId,
                    amount: v.quantity,
                    price: v.feeMoney ? v.price - v.feeMoney : v.price
                });
            }
        });
        //获取分摊价格
        console.log(UserService.getUser());
        var data = {userType: UserService.getUser().type, skus: JSON.stringify({skus: curSkus})};
        $http.post(UrlService.getUrl('Use_coupon'), data)
            .success(function (d) {
                if (d.code == 1) {
                    //记录平摊金额
                    couponInfo = d.data;
                    //计算优惠总价
                    var coupnPrice = couponInfo.totalFee;

                    //当优惠券价格>实际支付金额，说明使用了中免卡,则修改中免卡金额
                    if (coupnPrice > $scope.realChargeFee) {
                        console.log('使用优惠券后：' + $scope.realChargeFee);
                        var realChargeFee = (orderProList.totalPrice - coupnPrice) + orderProList.fee - orderProList.promotionFeeMoney;
                        if ($scope.accountInfo.usecard > realChargeFee) {
                            $scope.accountInfo.usecard = realChargeFee;
                        }
                    }
                    //保存优惠券信息
                    $scope.coupon={
                        coupnPrice:curCoupon.price,
                        couponChargeFee:coupnPrice,
                        couponValue:couponValue,
                        couponName:curCoupon.name,
                        couponCode:curCoupon.couponCode
                    }
                    /*$scope.coupnPrice = coupnPrice;
                    $scope.couponValue=couponValue;
                    */
                    //重新获取运费
                    getDelverFee();
                    //关闭优惠券层
                    $scope.couponmodal.hide();
                }
            });

    }
//选择优惠券
    $scope.checkCoupon = function (coupon) {
        // $scope.accountInfo.useCoupon = curCoupon;
        if(coupon.usable!=1){return false;}
        console.log('点击');

        curCoupon = coupon;
        console.log(coupon);
    }
//关闭优惠券
    $scope.closeCouponModal = function (empty) {
        //是否取消优惠券
        /*if(empty){
            curCoupon={};
        }*/
        $scope.couponmodal.hide();
    };
//中免卡modal
    $ionicModal.fromTemplateUrl('modal-zmcard.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.zmCardmodal = modal;
    });
    //添加中免卡modal
    $ionicModal.fromTemplateUrl('modal-zmcard-add.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.zmCardAddmodal = modal;
    });

//显示中免卡
    $scope.showZmCard = function (type) {
        if (type) {
            //添加中免卡 判断是否设置密码
            if(!$scope.accountInfo.isSetPwd){
                //未设支付密码，跳转到设置页
                PopupService.confirmPopup('为了您的支付安全，请设置支付密码').then(function(res){
                    if(res){
                        $scope.zmCardmodal.hide();
                        curAction='payPassWord';
                        $state.go('payPassword');
                    }
                })
            }else{
                $scope.zmCardAddmodal.show();
                //显示验证码
                changeValidate()
            }
        } else {
            var accountInfo = $scope.accountInfo;
            console.log($scope.realChargeFee);
            console.log(accountInfo.zmcard);
            //如果使用金额为0||大于订单值||大于余额
            if (accountInfo.zmcard == 0 || accountInfo.zmcard > accountInfo.zmcardVal || accountInfo.zmcardVal > $scope.realChargeFee) {
                accountInfo.zmcard = accountInfo.zmcardVal > $scope.realChargeFee ? $scope.realChargeFee : accountInfo.zmcardVal;
            }
            $scope.zmCardmodal.show();
        }
    };
//输入支付密码
$scope.showPayPwdInput=function(){
    //输入支付密码
    $ionicPopup.confirm({
        template: "<input type='password'  ng-model='accountInfo.temppwd'>",
        title: "请输入支付密码",
        scope: $scope,
        buttons: [
            {text: "取消"},
            {
                text: "确定",
                type: "button-assertive",
                onTap: function (e) {
                    return $scope.accountInfo.temppwd?$scope.accountInfo.temppwd:'1';
                }
            }
        ]
    })
        .then(function (res) {
            console.log(res);
            //验证支付密码
            if(!res){$scope.accountInfo.temppwd='';return false};
            if(res.length<6){
                PopupService.alertPopup('格式错误').then(function(){
                    $scope.showPayPwdInput();
                });
            }else{
                $http.post(UrlService.getUrl('VALID_PAY_PWD'),{payPwd:$scope.accountInfo.temppwd})
                    .success(function(d){
                        //密码正确，使用成功
                        if(d.code==1){
                            $scope.accountInfo.zmcard=parseFloat($scope.accountInfo.zmcard);
                            $scope.accountInfo.usecard =$scope.accountInfo.zmcard;
                            $scope.accountInfo.pwd=$scope.accountInfo.temppwd;
                            $scope.accountInfo.temppwd='';
                            $scope.zmCardmodal.hide();
                        }else{
                            PopupService.alertPopup('密码错误').then(function(){$scope.accountInfo.temppwd='';
                                $scope.showPayPwdInput();
                            });

                        }
                    })
            }
            return false;

        });
}
//使用中免卡
    $scope.useZmCard = function () {
        var accountInfo = $scope.accountInfo;
        var zmcard = parseFloat(accountInfo.zmcard);
        var coupon = $scope.coupnPrice?parseFloat$scope.coupnPrice:0;
        var fee=parseInt($scope.orderProList.fee)?parseInt($scope.orderProList.fee):0;
        if(zmcard==0){
            $scope.accountInfo.usecard = zmcard;
            $scope.zmCardmodal.hide();
            return false;
        }
        //判断使用金额
        console.log(zmcard);
        if (zmcard > 0 && zmcard <= parseFloat(accountInfo.zmcardVal) && zmcard <= $scope.orderProList.skusPrice - coupon +fee)  {
            //判断是否设置了支付密码
            if(!$scope.accountInfo.isSetPwd){

                //未设支付密码，跳转到设置页
                PopupService.confirmPopup('为了您的支付安全，请设置支付密码').then(function(res){
                    if(res){
                        $scope.zmCardmodal.hide();
                        $state.go('payPassword');
                    }
                })

            }else{
                $scope.showPayPwdInput();
            }

        } else {
          PopupService.alertPopup('使用金额不能大于订单金额和中免卡余额');
       }
    };
//关闭中免卡||添加中免卡modal
    $scope.closeZmCard = function (type) {
        if (type) {
            $scope.zmCardAddmodal.hide();
        } else {
            $scope.zmCardmodal.hide();
        }
    };

//添加中免卡
    $scope.cardData = {};//中免卡余额、验证码数据
    $scope.recharge=rechargeCard;
    /*提交充值请求*/
    function rechargeCard() {
        var str = "充值卡号：" + $scope.rechargeParams.cardNo +
            " 密码:" + $scope.rechargeParams.password +
            " 验证码：" + $scope.rechargeParams.validateCode;
        console.log('提交充值  ' + str);
        if (!$scope.rechargeParams.cardNo) {
            PopupService.alertPopup('充值卡号不能为空');
        } else if (!$scope.rechargeParams.password) {
            PopupService.alertPopup('中免卡密码不能为空');
        } else if (!$scope.rechargeParams.validateCode) {
            PopupService.alertPopup('验证码不能为空');
        } else {
            var rechargeParams = {
                cardCode: $scope.rechargeParams.cardNo,
                pwd: $scope.rechargeParams.password,
                validCode: $scope.rechargeParams.validateCode
            };
            $http.post(UrlService.getUrl('RECHARGE_CARD'), rechargeParams).success(function (response) {
                console.log('中免卡充值 response == ' + JSON.stringify(response));

                changeValidate();//刷新验证码
                $scope.rechargeParams.validateCode = '';

                //网络异常、服务器出错
                if (!response || response == CDFG_NETWORK_ERROR) {
                    return;
                }

                switch (response.code) {
                    // 1：成功，-10图片验证失败 -20卡号错了 -30没生成过验证码 -1系统异常
                    case '1':
                        $scope.cardData.cardMoney = response.data.balance;
                        //response.data.recharge;充入金额
                        console.log('充值成功');
                        PopupService.showPrompt('充值成功');
                        $scope.rechargeParams = {};
                        //关闭充值弹窗，刷新账户余额
                        $scope.zmCardAddmodal.hide();
                        getZmCard();

                        break;
                    case '-10':
                        //验证码错误
                        PopupService.alertPopup('验证码错误');
                        break;
                    case '-20':
                        //卡号或密码错误
                        PopupService.alertPopup('卡号或密码错误');
                        break;
                    case '-30':
                        //没生成过验证码
                        PopupService.alertPopup('验证码已失效，请重试');
                        break;
                    case '-1':
                        PopupService.alertPopup('系统异常，请联系客服');
                        break;
                    default :
                        var errorText = response.data ? response.data : '充值失败';
                        PopupService.alertPopup(errorText);
                        break;
                }
            }).error(function (response) {
                PopupService.alertPopup(CDFG_NETWORK_ERROR);
            });
        }
    }

    //更换验证码
    function changeValidate() {
        console.log('更换验证码');
        //更换验证码
        $timeout(function () {
            $scope.cardData.validateCode = '';
            $scope.cardData.validateCode = UrlService.getUrl('GET_VALIDATE_CODE') +
            '?userId=' + UserService.getUser().userId +
            '&userInfo=' + UserService.getUser().userInfo +
            '&ticket=' + UserService.getUser().ticket +
            '&random=' + Math.random();
        }, 500);
    }

//标记当前跳转操作 比如收货地址选择
    $scope.changeAction = function (type) {
        curAction = type;
    }
// 监听页面进入事件  收货地址/中免卡/优惠券 的选择做处理   购物车跳转来要刷新购物车
    $scope.$on('$ionicView.beforeEnter', function () {
        console.log(curAction);
        switch (curAction) {
            case 'addr':
                getDefaultAddr();
                break;
            case 'coupon':
                getCouponZmCard();
                break;
            case 'cart':
                init();
                break;
            case 'order-success':
                init();
                break;
            case 'payPassWord':
                //修改完支付密码回来后，重新加载中免卡信息
                getZmCard();
                break;
            default :
                break;
        }
        curAction = '';
    });
//切换收货地址||自提信息
    $rootScope.$on('SELECT_ADDRESS', function (event, data) {
        console.log(data);
        console.log(curAction);
         if(curAction=='goabroad'){
            $scope.selfTaking = data;
            $scope.selfTaking.id = data.addrId;
        }else{
            $scope.addressInfo = data;
            $scope.addressInfo.id = data.addrId;
            getDelverFee(data.province);
            console.log($scope.addressInfo);
        }

    });
    //选中的收货地址被删除
    $rootScope.$on('SELECT_ADDRESS_DELETED', function (event, data) {
        console.log('')
        //获取默认地址
        getDefaultAddr();
    });
//订单提示modal
    $ionicModal.fromTemplateUrl('modal-orderHint.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.orderHintmodal = modal;
    });

//显示订单提示modal
    $scope.showOrderHint = function (bloon) {

        $scope.orderHintmodal.show();

    };
//关闭订单提示modal
    $scope.closeOrderHint = function () {
        $scope.orderHintmodal.hide();
        $state.go('cart');
    };
//订单错误提示
    $scope.objOrderHint = {}
//提交订单
    $scope.submitOrder = function () {
        var errorMsg = '';
        var order = $scope.orderProList;
        //有免税店商品，验证免税店信息
        if(order.freePro.length>0){
            //验证自提信息
            var passportNo=$scope.selfTaking.passportNo;
            var flight_number =goabroad.flight;
            var leaving_time=goabroad.time;
            var err='';
            //验证信息非空
            err+=!passportNo?'请补全护照信息':'';
            err+=!flight_number?'请补全航班信息':'';
            err+=!leaving_time?'请补全出境时间信息':'';
            if(err!=''){
             PopupService.alertPopup(err);
                return false;
            }

        }
        //验证收货地址
        var addressInfo = $scope.addressInfo;
        //有快递商品，验证收货地址信息
        if(order.commPro.length>0){
            if (!addressInfo.id) {
                errorMsg += '请填写收货地址';
            } else {
                if (!addressInfo.receiver || !addressInfo.province || !addressInfo.addr || !addressInfo.mobile) {
                    errorMsg += '请将收货地址补充完整';
                }
            }
        }
        //验证商品信息

        //精简sku信息 判断是否有活动
        var skus = [], isPromote = 0;
        angular.forEach(order.orderlist, function (sku, key) {
            var obj = {
                id: sku.id,
                skuId: sku.skuId,
                quantity: sku.quantity,
                sId: sku.sId,
                promotions: sku.promotions,
                salePrice: sku.feeMoney ? sku.price - sku.feeMoney : sku.price
            }
            //添加优惠券平摊金额
            if ($scope.coupnPrice > 0 && couponInfo.skus[sku.skuId]) {
                obj.couponDiscountPrice = couponInfo.skus[sku.skuId].feeMoney;
            }
            //判断有活动
            if (!isPromote && sku.hasActiveId) {
                isPromote = 1;
            }
            skus.push(obj);
        });
        if (skus.length == 0) {
            errorMsg += '未选择任何商品，请返回购物车添加';

        }

        //提示错误信息
        if (errorMsg != '') {
            PopupService.alertPopup('订单提示', errorMsg);
            return false;
        }

        //组织form数据
        var formdata = {
            userId: UserService.getUser().userId,
            //prodFee:1500,//购物车（商品）总价
            prodQuanlity: order.total,//购物车总数量（不包含赠品）
            deliverFee: order.fee,//运费
            // prodDiscountFee:50,//活动优惠金额
            orderFee: $scope.realChargeFee + $scope.accountInfo.usecard,//订单金额()
            zmcardChargeFee: $scope.accountInfo.usecard,//中免卡使用金额
            realChargeFee: $scope.realChargeFee,//实际支付金额
            invoiceTitle: $scope.invoice.info,//发票抬头 不开''
            deliverTimeRequest: $scope.deliveryTime.value,//收货时间
            userRemark: $scope.userRemark.info,//用户留言
            isPromote: isPromote,//是否有活动 0无活动 1有活动
            giveaways: order.giveaways,//赠品
            skus: skus
        };
        //判断是否使用优惠券
        var coupon=$scope.coupon;
        if(coupon&&$scope.coupon.coupnPrice){
            formdata.couponName=coupon.couponName;  //优惠券标题
            formdata.couponPrice=coupon.couponPrice;//优惠券面值
            formdata.couponChargeFee=coupon.couponChargeFee;//优惠券实际使用金额
            formdata.couponCard=coupon.couponCode;//优惠券ID
        }
        //判断是否有快递商品
        console.log($scope.addressInfo);
        if(order.commPro.length>0){
            formdata.recAddrId=$scope.addressInfo.id;//地址ID
        }
        console.log($scope.selfTaking);
        //判断是否有免税商品
        if(order.freePro.length>0){
            formdata.flightNumber=goabroad.flight;
            formdata.selfTakingTime=goabroad.time;
            formdata.selfTakingInfoId=$scope.selfTaking.id;
        }
        //判断是否使用了中免卡
        if($scope.accountInfo.usecard){
            formdata.zmcardPwd=$scope.accountInfo.pwd;
        }
        console.log(order.orderlist);
        var _data = {param: JSON.stringify(formdata)};
        //提交表单
        $http.post(UrlService.getUrl('SUBMIT_ORDER'), _data).success(function (d) {
            console.log(d.code == -5);
            switch (parseInt(d.code)) {

                case 1:
                    $rootScope.$broadcast('order:success', $scope.orderProList.total);
                    curAction='order-success';
                    if ($scope.realChargeFee > 0) {
                        $state.go('paytype', {orderId: d.data});
                    } else {
                        $state.go('pay-success', {orderId: d.data, orderTotal: $scope.orderProList.total});
                    }
                    break;
                case -5:
                    $scope.objOrderHint = {
                        skus: d.data,
                        title: '失效商品',
                        msg: '购买的数量超过了限购数，可能是库存不足'
                    }
                    $scope.showOrderHint();
                    break;
                default :
                    console.log(d.code);
                    PopupService.alertPopup('提交错误', '错误码：'+d.code+':'+ d.data);
                    break;
            }
        });

        //$state.go('paytype', {orderno:167});
    }

    //init:获取订单信息
    function init() {
        skusSimple = [];
        $scope.accountInfo = {zmcard: '', usecard: 0,pwd:''};   //优惠券中免卡信息
        $scope.couponList = [];        //优惠券列表
        $scope.rechargeParams = {couponNo: ''};    //优惠券绑定
        $scope.coupnPrice = 0;
        curCoupon = '';
        console.log('init');
        var orderProList = $scope.orderProList = CartService.getOrderProList();
        orderProList.fee='';
        if (!orderProList.orderlist) {
            return false
        }
        $scope.giftShowLength = orderProList.orderlist.length >= 3 ? 0 : 3 - orderProList.orderlist.length;
        console.log($scope.giftShowLength);
        console.log(orderProList);
        console.log('订单页');
        //获取地址
        getDefaultAddr();
        //获取优惠券
        getCoupon();
        //获取中免卡
        getZmCard();
    }

    init();
    //进入订单确认页清空
    /* $scope.$on('$ionicView.enter', function () {
     //每次进入购物车取消编辑状态
     //  init();
     });*/
}])
;


























