/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/06/07
 describe：单品详情页
 modify time:2015/07/16

 ********************************/
/*
 Service 服务
 */
cdfgApp.factory('GetUrlServices',['$http','UrlService',function($http,UrlService){
    return {
        //获取商品规格和图片
        productSpecification: function(id,type){
            return $http.post(UrlService.getUrl('PRODUCT_INFO'), {
                id:id,
                type:type,
                channel:1
            });
            //return $http.get('datas/goodSpecification.json');

        },
        // 获取是否收藏
        getFavBySku: function(skuId,userInfo){
            return $http.post(UrlService.getUrl('GET_FAV_BY_SKU'), {
                skuId:skuId,
                ticket:userInfo.ticket,
                userInfo:userInfo.userInfo,
                userId:userInfo.userId,
                channel:1
            });
        },
        // 添加收藏
        addFavorite: function(skuId,userInfo){
            return $http.post(UrlService.getUrl('ADD_FAVORITE'), {
                skuId:skuId,
                ticket:userInfo.ticket,
                userInfo:userInfo.userInfo,
                userId:userInfo.userId,
                channel:1
            });
        },
        // 移除收藏
        delFavorite: function(favId,userInfo){
            return $http.post(UrlService.getUrl('DEL_FAVORITE'), {
                favId:favId,
                ticket:userInfo.ticket,
                userInfo:userInfo.userInfo,
                userId:userInfo.userId,
                channel:1
            });
        },
        //品牌故事
        brandStory: function(brandId){
            return $http.post(UrlService.getUrl('BRAND_STORY'), {
                brandId:brandId,
                channel:1
            });
            /*return $http.post('http://192.168.103.219/brand/story', {
                brandId:brandId,
                channel:1
            });*/
        },
        //保养说明
        maintainExplain: function(bcId){
            return $http.post(UrlService.getUrl('MAINTAIN_EXPLAIN'), {
                bcId:bcId,
                channel:1
            });
        },
        //政策说明
        policyStatement: function(){
            return $http.post(UrlService.getUrl('GET_SHOP_GUIDE'));
        },
        //加载活动信息
        getCartPromotion: function(skuId){
            return $http.get(UrlService.getUrl('GET_CART_PROMOTION'), {params:{
                skus:skuId,
                channel:1
            }});
        }
    };
}]);

/*
 directive模块指令
 */


/*
 Controller 模块控制器
 */

cdfgApp.controller('ProductController', ['$scope', '$stateParams', '$http', '$ionicModal', '$timeout','GetUrlServices',
    '$state','$ionicSlideBoxDelegate','CommentServices','PopupService','CartService','UserService',
    'ProductListService','$rootScope', '$ionicHistory', '$cordovaNetwork','$ionicScrollDelegate',
    function ($scope, $stateParams, $http, $ionicModal, $timeout,GetUrlServices,$state,$ionicSlideBoxDelegate,
              CommentServices,PopupService,CartService,UserService,ProductListService,$rootScope, $ionicHistory,
              $cordovaNetwork,$ionicScrollDelegate) {

    /* ADD START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
    $scope.goBack = goBack;
    //返回上一页
    function goBack(){
        $ionicHistory.goBack();
    }
    /* ADD END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/

    var argumentId = $stateParams.id;
    var type;  //1:prodId  2:spuId  3:skuId
    switch ($stateParams.type) {
        case 'prod':
            type = 1;
            break;
        case 'spu':
            type = 2;
            break;
        case 'sku':
            type = 3;
            break;
        default :
            console.log();
    }

    //尺码颜色 Modal 指向页面
    $ionicModal.fromTemplateUrl('templates/product/product-variety.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.varietyModal = modal;
    });

    // 分享 Modal 指向页面
    $ionicModal.fromTemplateUrl('templates/base/share-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.shareModal = modal;
    });

    //当我们用完模型时，清除它！
    $scope.$on('$destroy', function () {
        $scope.varietyModal.remove();
        $scope.shareModal.remove();
    });

    angular.extend($scope, {
        prodItemInfo: null, //基本信息 初始化
        productData: null, //商品详情
        nowProduct: null, //当前选择类别下商品
        productItem: [], //显示类别数组
        productSize: [], //显示尺码数组
        selectSize: null, //选中的尺码
        selectPrice: null, //选中的价格
        selectShowPrice: null,
        productStoreNum: null, //库存
        stockNum:{
            curStock: 1
        }, //当前购买数量
        addShopSku: null, //添加购物车sku
        prodParameter: null, //商品参数
        commentNumber: null, //评价数量
        prodSpuNumber: null, //spu库存
        cartNumber: null, //购物车商品数量
        shoppingCartTotal: CartService.getCartTotal(),//获取购物车总数
        innerStaff: false, //是否为内部员工
        favId: null, //已收藏id
        prodId: null, //商品id
        skuPromotion: null, //当前sku所属活动
        detailBanner: true, //判断是否有banner图
        lastCollectSkuId: false, //判断是否重复不停点击
        initData: function(){
            var me = $scope;
            me.networkError = false;//不显示网络错误
            me.network404 = true;
            me.pageDisplay = false;
            GetUrlServices.productSpecification(argumentId,type).success(function (data) {

                var spuItem = data.spuItems;
                var prodItemInfo = data;
                //网络异常、服务器出错
                if(!data || data == CDFG_NETWORK_ERROR){
                    console.log('获取订单列表  response == ' + JSON.stringify(data));
                    me.networkError = true;
                    me.network404 = false;
                    //$rootScope.$broadcast('http-response:error');
                    //me.hideButton = false;
                    return;
                }
                //404页面
                if(data.spuItems.length <= 0){
                    me.pageDisplay = true;
                    me.network404 = false;
                    me.prodItemInfo = prodItemInfo;
                    return;
                }
                me.network404 = true;
                /* 生成颜色图片 */
                for(var i=0;i<spuItem.length;i++){
                    me.productItem.push({
                        pid: spuItem[i].id,
                        type: spuItem[i].specName,
                        name: spuItem[i].specValueName,
                        url: spuItem[i].spuImgs[0],
                        status:1
                    });
                }

                /* 生成尺码列表(所有) */
                var productSize = [];
                for(var i=0;i<spuItem.length;i++){
                    var spuItemInx = spuItem[i];
                    for(var j=0;j<spuItemInx.skuItems.length;j++){
                        if(productSize.indexOf(spuItemInx.skuItems[j].specValueName) == -1){
                            productSize.push(spuItemInx.skuItems[j].specValueName);
                        }
                    }
                }
                for(var i=0;i<productSize.length;i++){
                    me.productSize.push({name: productSize[i], status:0})
                }

                me.productData = spuItem;
                me.prodItemInfo = prodItemInfo;
                me.prodId = me.prodItemInfo.id;

                me.initSku();
                //console.log(me.prodItemInfo.brandId)

                //品牌故事brandId
                GetUrlServices.brandStory(me.prodItemInfo.brandId).success(function(data, status, headers, config){
                    //console.log(data)
                    if(data){
                        me.brandStoryInfo = '<div>' + data + '</div>';
                    }else{
                        me.brandStoryInfo = '<div></div>';
                    }
                    //me.brandStoryInfo = '<img src="http://img2.zhongmian.com/photo/Kindeditor/130833121224456927.jpg">';
                }).error(function (data, status, headers, config) {
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });

                //保养说明bcId(基础类目(三级))
                //console.log(me.prodItemInfo.bcId);
                if(me.prodItemInfo.bcId && me.prodItemInfo.bcId != ''){
                    GetUrlServices.maintainExplain(me.prodItemInfo.bcId).success(function(data, status, headers, config){
                        if(data){
                            me.maintainExplainInfo = '<div>' + data + '</div>';
                        }else{
                            me.maintainExplainInfo = '<div></div>';
                        }

                    }).error(function (data, status, headers, config) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    });
                }else{
                        me.maintainExplainInfo = '<div></div>';
                }


                //评论总数
                CommentServices.commentTotal(me.prodId).success(function (data) {
                    if(data.code == 1){
                        me.commentNumber = data.data;
                        me.total = me.commentNumber.good + me.commentNumber.medium + me.commentNumber.bad;
                        if(me.total == 0){
                            me.goodNumber = '100%';
                        }else{
                            me.goodNumber = Math.round(me.commentNumber.good / me.total * 100) + "%";
                        }
                    }
                }).error(function (data, status, headers, config) {
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });

                //政策说明
                //console.log(me.prodItemInfo.businessModel)
                if(me.prodItemInfo.businessModel == 3){
                    GetUrlServices.policyStatement()
                        .success(function(data){
                            me.policyStatementInfo = data;
                        })
                        .error(function(){
                            PopupService.showPrompt('加载失败');
                        });
                }

            }).error(function (data, status, headers, config) {
                PopupService.alertPopup(CDFG_NETWORK_ERROR);
            });

        },
        itemRest: function(){
            var me = $scope;
            for(var i=0;i<me.productItem.length;i++ ){
                me.productItem[i].status = 1;
            }
        },
        sizeRest: function(){
            var me = $scope;
            for(var i=0;i<me.productSize.length;i++ ){
                me.productSize[i].status = 0;
                delete me.productSize[i].type;
            }
        },
        changeProduct: function(pid){
            var me = $scope;
            for(var i=0;i < me.productData.length;i++){
                if(me.productData[i].id == pid) me.nowProduct = me.productData[i];
            }
            me.initSku();
            me.stockNum.curStock = 1;  //初始化购买数量
            me.addShopSku = null;  //更换颜色shopSku不存在
            me.nowProductPrice();
        },
        changeSize: function(skuId, status){

            if(status == 0) return;

            var me = $scope;

            me.stockNum.curStock = 1; //初始化购买数量

            /* 选择尺码 */
            var skuItem = me.nowProduct.skuItems;
            for(var i=0;i<skuItem.length;i++){

                if(skuItem[i].id == skuId){

                    me.selectSize = skuItem[i].specValueName;
                    /*me.selectPrice = {marketPrice: skuItem[i].marketPrice,
                        salePrice: skuItem[i].salePrice,
                        innerPrice: skuItem[i].innerPrice,
                        mobilePrice: skuItem[i].mobilePrice
                    };*/

                    //me.selectShowPrice = null;
                    //console.log(me.innerStaff)
                    if(skuItem[i].mobilePrice > 0){
                        me.selectShowPrice = {
                            price: skuItem[i].mobilePrice
                        };
                        console.log('mobilePrice');
                    }else if(skuItem[i].mobilePrice <= 0 && me.innerStaff){
                        me.selectShowPrice = {
                            price: skuItem[i].innerPrice
                        };
                        console.log('innerPrice');
                    }else{
                        me.selectShowPrice = {
                            price: skuItem[i].salePrice
                        };
                        console.log('salePrice');
                    }
                    me.selectShowPrice.marketPrice = skuItem[i].marketPrice;

                    me.productStoreNum = skuItem[i].storeNum;
                    me.addShopSku = skuId;  //加入购物车选择尺码
                    me.judgeCollect();
                    me.getPromotion();
                    me.shelfStatus = skuItem[i].shelfStatus; //上架状态 1-上架\n2-下架\n3-终止销售\n4-待上架'

                }

            }

            /* 判断当前尺码在其他商品中是否存在 */
            for(var i=0;i<me.productData.length;i++){
                if(me.productData[i].id != me.nowProduct){
                    var otherSkuItem = me.productData[i].skuItems;
                    var status = 0;
                    for(var y=0;y<otherSkuItem.length;y++){
                        if(otherSkuItem[y].specValueName == me.selectSize && otherSkuItem[y].storeNum > 0){
                            status = 1;
                        }
                    }
                    for(var y=0;y<me.productItem.length;y++){
                        if(me.productItem[y].pid == me.productData[i].id){
                            me.productItem[y].status = status;
                        }
                    }
                }
            }

        },
        nowProductPrice: function(){
            var me = $scope;
            if(me.nowProduct.mobilePrice > 0){
                me.selectShowPrice = {
                    price: me.nowProduct.mobilePrice
                };
                console.log('now-mobilePrice');
            }else if(me.nowProduct.mobilePrice <= 0 && me.innerStaff){
                me.selectShowPrice = {
                    price: me.nowProduct.innerPrice
                };
                console.log('now-innerPrice');
            }else{
                me.selectShowPrice = {
                    price: me.nowProduct.salePrice
                };
                console.log('now-salePrice');
            }
            me.selectShowPrice.marketPrice = me.nowProduct.marketPrice;
            me.judgeSize(me.nowProduct.skuItems);
        },
        initSku: function(){
            var me = $scope;
            me.selectSize = null;
            me.selectPrice = null;
            me.productStoreNum = null;

            if(type == 1){
                if(!me.nowProduct) me.nowProduct = me.productData[0];
                me.nowProductPrice();
            }else if(type == 2){  //spu
                for(var i=0;i<me.productData.length;i++){
                    if(argumentId == me.productData[i].id){
                        if(!me.nowProduct) me.nowProduct = me.productData[i];
                        me.nowProductPrice();
                    }
                }
            }else if(type == 3){

                for(var i=0;i<me.productData.length;i++){  //addShopSku
                    var skuItems = me.productData[i].skuItems;
                    for(var j=0;j<skuItems.length;j++){
                        if(argumentId == skuItems[j].id){
                            if(!me.nowProduct) me.nowProduct = me.productData[i];
                            if(!me.addShopSku) me.addShopSku = argumentId;
                            me.changeSize(argumentId,1);
                            //me.selectSize = skuItems[j].specValueName;
                        }
                    }
                }
            }

            var skuItem = me.nowProduct.skuItems;

            // 当banner图为空时，隐藏banner
            //console.log(me.nowProduct.spuImgs.length)
            if(me.nowProduct.spuImgs.length <= 0){
                me.detailBanner = false;
            }else{
                me.detailBanner = true;
            }

            //商品描述  && 尺码对照表
            me.commodityDes = '<div style="padding:0 10px;line-height:2;background:#fff;">'+me.nowProduct.detail+'</div>';
            me.sizeContrast = '<div style="padding:0 10px;line-height:2;background:#fff;">'+me.nowProduct.sizeContrast +'</div>';

            //卖家保证
            if(me.nowProduct.salerGuarantee){

                var salerGuarantee = me.nowProduct.salerGuarantee.toString(2);
                    me.salerGuaranteeMenu = [];

                for(var i=0;i<salerGuarantee.length;i++){
                    if(salerGuarantee.charAt(i) == 1){
                        switch (i) {
                            case 0:
                                me.salerGuaranteeMenu.push('正品保证');
                                break;
                            case 1:
                                me.salerGuaranteeMenu.push('维修保养');
                                break;
                            case 2:
                                me.salerGuaranteeMenu.push('权威鉴定');
                                break;
                            case 3:
                                me.salerGuaranteeMenu.push('七天退货');
                                break;
                            case 4:
                                me.salerGuaranteeMenu.push('国家免税');
                                break;
                            default :
                                console.log();
                        }
                    }
                }
            }

            /* 初始化库存 */
            me.itemRest();

            /* 初始化尺码选项 */
            me.sizeRest();

            /* 商品参数 */
            var parameter = me.nowProduct.attrs.split("||");
            var temArray = [];
            for(var i= 0,strl;i<parameter.length;i++){
                strl = parameter[i].length;
                var substr = parameter[i].substr(strl-1,1);
                if(substr !=='='){
                    parameter[i] = parameter[i].replace(/\=/g,'：');
                    temArray.push(parameter[i]);
                }
                //最后一位是= 不显示
            }
            me.prodParameter = temArray;
            //console.log(me.prodParameter.length);

            /* 激活已存在尺码 */
            for(var i=0;i<skuItem.length;i++){
                for(var y=0;y<me.productSize.length;y++){
                    if(me.productSize[y].name == skuItem[i].specValueName && skuItem[i].storeNum > 0){
                        me.productSize[y].status = 1;
                        me.productSize[y].skuId = skuItem[i].id;
                    }
                    me.productSize[y].type = skuItem[0].specName;
                }
                me.prodSpuNumber += skuItem[i].storeNum;
            }
            $ionicSlideBoxDelegate.update();

            //当前状态为登录状态时判断该商品为已收藏商品  &&  判断是否为内部员工

            //加载活动信息
            me.getPromotion();
           /*var skus = [],skulength = me.nowProduct.skuItems.length,si,promotionArr = [];// edit by xufeng
            for(si=0;si<skulength;si++){
                skus.push(me.nowProduct.skuItems[si].id);
            }*/


            //获取购物车商品数量
            me.shoppingCartTotal = CartService.getCartTotal();
        },
        //加载活动信息
        getPromotion: function(){
            var me = $scope,
                collectSkuId = me.addShopSku;

            if(!me.addShopSku) collectSkuId = me.nowProduct.skuItems[0].id;
            var promotionArr = [];

            GetUrlServices.getCartPromotion(collectSkuId)// edit by xufeng
                .success(function(data){
                    me.oPromotionType = ['','[单品折扣]', '[单品赠品]', '[品类折扣]', '[品类满赠]'];
                    if(data.code == 1){
                        me.skuPromotion = data.data.promotions;//promotions是MAP结构
                        //将qioPromotionType转化成数组
                        for (o in me.skuPromotion) {
                            promotionArr.push(me.skuPromotion[o]);
                        }
                        me.skuPromotion = promotionArr;
                    }

                }).error(function (data, status, headers, config) {
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });

        },
        //判断是否只有一个sku，只有一个时，默认选中
        judgeSize: function(skuItem){
            var me = $scope;
            if(me.productSize.length == 1 && skuItem[0].storeNum > 0){
                me.changeSize(skuItem[0].id,1);
            }else{
                me.judgeCollect();
                me.productStoreNum = 0;
                for(var i=0;i<me.nowProduct.skuItems.length;i++){

                    me.productStoreNum += me.nowProduct.skuItems[i].storeNum;
                }
            }
        },
        //判断是否是已收藏商品
        judgeCollect: function(){
            var me = $scope,
                userInfo = UserService.getUser(),
                collectSkuId = me.addShopSku;

            if(!me.addShopSku) collectSkuId = me.nowProduct.skuItems[0].id; //var skuId = me.nowProduct;
            //判断是否登录；
            if(userInfo.isLogined()){
                //判断是否为已收藏
                GetUrlServices.getFavBySku(collectSkuId,userInfo)
                    .success(function(data){
                        console.log(data);
                        if(data.code == 1){
                            me.collect = true;
                            me.favId = data.data;
                        }else{
                            me.collect = false;
                        }
                    }).error(function (data, status, headers, config) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    });

                //判断是否为内部员工
                if(userInfo.type == '5') me.innerStaff = true;
            };
        },
        minusStock: function(){
            var me = $scope;
            if(me.stockNum.curStock>1) me.stockNum.curStock--;
        },
        plusStock: function(){
            var me = $scope;
            if(me.stockNum.curStock<me.productStoreNum) me.stockNum.curStock++;
        },
        openShopcart: function(){
            var me = $scope;
            me.varietyModal.show();
            me.selectInfo = true;
        },
        changeStock: function(number){
            var me = $scope;
            console.log(number + '-' + me.productStoreNum)
            if(!number){
                me.stockNum.curStock = 1;
            }
            var stock = me.productStoreNum;
            if (number < 1) {
                me.stockNum.curStock = null;
            }
            if (number > stock) {
                me.stockNum.curStock = stock;
                console.log(me.stockNum.curStock)
            }
        },
        //加入购物车操作
        addShopcart: function(){
            var me = $scope;

            if(!me.addShopSku){
                PopupService.promptPopup('请选择"'+ me.productSize[0].type +'"！','hide');
            }else{
                if (me.stockNum.curStock < 1) {
                    PopupService.promptPopup('请选择购买数量！');
                    me.stockNum.curStock = null;
                    return;
                }
                console.log(me.stockNum.curStock);
                CartService.addToCart(me.addShopSku,me.stockNum.curStock).then(function(data){
                    //加入购物车成功
                    if(data == 1){
                        me.varietyModal.hide();
                        PopupService.showPrompt('已加入购物车！');
                        $scope.shoppingCartTotal=CartService.getCartTotal();
                        //console.log($scope.shoppingCartTotal);
                        me.productStoreNum = me.productStoreNum - me.stockNum.curStock;
                        if(me.productStoreNum <= 0){
                            me.prodSpuNumber = 0;
                        }
                        me.addAnimate = true;
                        setTimeout(function(){
                            me.addAnimate = false;
                            me.stockNum.curStock = 1;
                        }, 2000);

                    }else if(data == 0){
                        PopupService.showPrompt('加入失败请重新加入','hide');
                        return;
                    }

                });
            }
        },
        /*  -----------  ----------- */
        /* 商品选择跳转 */  /* 加入购物车选择尺码跳转 */
        setSku: function(){
            var me = $scope;
            //打开modal指向
            me.varietyModal.show();
            me.selectInfo = true;
        },
        // 弹框取消事件按钮
        cancelAdd: function () {
            var me = $scope;
            me.varietyModal.hide();
            me.shareModal.hide();
            me.selectInfo = false;
        },
        //展开关闭事件
        toggle: function (key, value) {
            $scope[key] = !value;
            //当界面高度发生改变时重新计算
            $ionicScrollDelegate.resize();
        },
        //判断当前商品是否已收藏

        // 弹出层标题  添加收藏
        addToCollect : function(){

            var me = $scope
                userInfo = UserService.getUser(),
                collectSkuId = me.addShopSku;
                //如果请求值未返回来是重复点击则false；
                if(me.lastCollectSkuId){
                    return false;
                }
                me.lastCollectSkuId = true;

            if(userInfo.type == '5') me.innerStaff = true; //判断是否为内部员工

            if(!me.addShopSku) collectSkuId = me.nowProduct.skuItems[0].id; //var skuId = me.nowProduct;
            //判断是否登录
            if(!userInfo.isLogined()){
                /*ADD START BY 葛硕 20150809：[APP-86.87]点击收藏商品时，定向到登陆页面，登陆后不能自动返回-------------*/
                var params = {
                    params: 'isCollect',
                    last:'product='+collectSkuId
                };
                /*ADD END   BY 葛硕 20150809：[APP-86.87]点击收藏商品时，定向到登陆页面，登陆后不能自动返回-------------*/
                $state.go('login', params);
                return;
            }
            me.judgeCollect();

            GetUrlServices.addFavorite(collectSkuId,userInfo).success(function(data){
                console.log(data);

                me.lastCollectSkuId = false;
                if(data.code == 1){
                    PopupService.promptPopup('收藏成功');
                    me.collect = true;
                    me.favId = data.data;
                }else if(data.code == -10){
                    me.collect = true;
                }else if(data.code == -101) {
                    /*ADD START BY 葛硕 20150809：[APP-86.87]点击收藏商品时，定向到登陆页面，登陆后不能自动返回-------------*/
                    var params = {
                        params: 'isCollect',
                        last:'product='+collectSkuId
                    };
                    /*ADD END   BY 葛硕 20150809：[APP-86.87]点击收藏商品时，定向到登陆页面，登陆后不能自动返回-------------*/
                    $state.go('login', params);
                    return;
                }else if(data.code <= 0){
                    PopupService.promptPopup('收藏失败，'+ data.data ,'error');
                }

            }).error(function (data, status, headers, config) {
                PopupService.alertPopup(CDFG_NETWORK_ERROR);
            });

        },
        // 移除收藏
        removeTocollect : function(){
            var userInfo = UserService.getUser();
            var me = $scope;
            console.log(me.favId);
            GetUrlServices.delFavorite(me.favId,userInfo)
                .success(function (data) {
                    console.log(data);
                    if(data.code == 1){
                        PopupService.promptPopup('已取消收藏');
                        me.collect = false;
                        me.lastCollectSkuId = false;
                    }else if(data.code == 0){
                        PopupService.promptPopup('取消失败');
                    }

                }).error(function (data, status, headers, config) {
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });
        },
        // 分享modal
        share: function () {
            var me = $scope,
                title = me.prodItemInfo.brandName + ' ' + '仅售'+me.selectShowPrice.price+'元，赶紧来看看吧',
                content = '我在中免发现这个免税品，简直惊呆了，【' + me.prodItemInfo.name + '】',
                pic = CDFG_IP_IMAGE + me.nowProduct.spuImgs[0],
                url = 'http://' + CDFG_IP_SERVER + ':' + CDFG_PORT_SERVER + '/' + '' + '/product/' + $stateParams.type + '/' + argumentId + '/detail';

            if (window.umeng) {
                window.umeng.share( title, content, pic, url);
            }
        },


        //点击图片跳转页面
        applyImg: function(imageList,index){

            var imageListUrl = [];
            for(var i=0;i<imageList.length;i++){
                imageListUrl.push({url:CDFG_IP_IMAGE + imageList[i]});
            }

            $state.go('apply-images',{
                'imageList' : JSON.stringify(imageListUrl),
                'index' : index,
                'clearDel' : true
            });

        }

    });

    $scope.initData();
    /* ADD START BY 马丽伟 购物车数量显示不正确--------*/
    $scope.$on('$ionicView.enter', function () {
        $scope.shoppingCartTotal=CartService.getCartTotal();
    });
    /* ADD END BY 马丽伟 购物车数量显示不正确--------*/

    /*ADD START BY 葛硕 20150809：[APP-86.87]点击收藏商品时，定向到登陆页面，登陆后不能自动返回-------------*/
    //接受登录成功的广播
    $rootScope.$on('LoginSuccess', function (event, data) {
        console.log('接收登录成功的广播 data = ' + JSON.stringify(data));
        if(data == 'isCollect'){
            $scope.addToCollect();
        }
    });
    /*ADD END   BY 葛硕 20150809：[APP-86.87]点击收藏商品时，定向到登陆页面，登陆后不能自动返回-------------*/


    /*ADD START BY 葛硕 20150813：[APP-261]商品详情页要有下拉刷新功能 -----------------------------------*/
    //监听网络连接状态
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        console.log('网络已连接');
        me.productItem = [];
        me.productSize = [];
        $scope.initData();
    });
    /*ADD END   BY 葛硕 20150813：[APP-261]商品详情页要有下拉刷新功能 -----------------------------------*/
}]);
