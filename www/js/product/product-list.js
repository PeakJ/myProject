/********************************

 creater:haosijia@cdfg.com.cn  and  xuf
 create time:2015/06/29
 describe：商品列表页
 modify time:2015/06/29

 ********************************/
/*
 Service 服务
 */
cdfgApp.factory('ProductListService', ['$http','UrlService','UserService',function ($http,UrlService,UserService) {
    return {
        // 获取商品列表信息
        productList: function (params) {
            //debugger;
            //return $http.get(UrlService.getUrl('PRODUCT_LIST'),{params:params});
            var user = UserService.getUser();
            if(user.userId){
                params.userId = user.userId;
            }
            console.log(JSON.stringify(params));
            params = JSON.stringify(params);
            var urlStr = UrlService.getUrl('SEARCH_FOR_PRODUCTS')+ params;

            return $http.post(urlStr);
        },
        getBrandName: function(bId){
                var params ={
                    brandId :bId,
                    channel : 1
                };
            return $http.get(UrlService.getUrl('GET_BRAND_NAME_BY_ID'),{params:params});
        }

    }
}]);

/* directive模块指令 */

/* 切换排列顺序 */
cdfgApp.directive('clickToggleOrderby', [function factory() {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $el, $attrs) {

            var span = $el.children('span');
            span.on('click', function (e) {

                var spanCurent = angular.element(this);

                span.removeClass('assertive');
                spanCurent.addClass('assertive');
                e.preventDefault();

            });

        }
    };
}]);

/* controller模块指令 */
cdfgApp.controller('ProductListController',['$scope', '$http','$stateParams','$timeout',
    '$ionicHistory','$ionicPopup','ProductListService','$state','$ionicModal','$ionicScrollDelegate',
    'PopupService','$ionicViewSwitcher','StyleConfig','StyleForPlatform','LocalCacheService','SearchService','UserService','$rootScope',
    function($scope, $http,$stateParams, $timeout,$ionicHistory,$ionicPopup,ProductListService,
             $state,$ionicModal,$ionicScrollDelegate,PopupService,$ionicViewSwitcher,StyleConfig,StyleForPlatform,LocalCacheService,SearchService,UserService,$rootScope){

    var urlParams = {
        type: $stateParams.fromPage,
        id: $stateParams.id,
        title: $stateParams.title,
        query:$stateParams.query
    };
    $scope.fromPage = urlParams.type;
    $scope.title = urlParams.title;
        if(!$scope.title || $scope.title ==""){
            ProductListService.getBrandName(urlParams.id).then(function(d){
                if(d){
                    $scope.title = d.data;
                }
                else{
                    alert('品牌名称获取失败');
                }
            });
        }
        $scope.leftArrow = StyleForPlatform.getStyle('leftArrow');
    angular.extend($scope, {
        query:{tag:$stateParams.query  //input 绑定数据的最佳实践字符串放在对象的属性里
        },//搜索关键字
        // 筛选页的价格筛选
        param: {
            startPage: 1,
            pageSize: 20,
            channel:1
        },
        totolPage: null,
        listNumber: null,
        productTotal: null, //获取列表数据（综合）
        productData: [],//获取列表
        dataSc: null,  //筛选页类别
        dataBrand: null, //筛选页品牌
        dataSpuSpec: null, //筛选页spu
        dataSkuSpec: null, //筛选页sku
        dataSpuAttr: null, //筛选页spu属性
        hideInfinite: false, //初次加载隐藏上拉加载
        moreFont: true,
        selectAttrVal: {
            brand: {},
            spuSpec: {},
            skuSpec: {},
            spuAttr: {},
            name: null
        },
        //上拉加载
        loadMore: function () {
            if (!$scope.hasMore) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            $timeout(function () {
                $scope.param.startPage++;
                $scope.initData('upData');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        },
        //下拉刷新
        doRefresh: function () {
            $scope.param.startPage = 1;
            $scope.initData();
            $scope.$broadcast('scroll.refreshComplete');
        },
        hasMore: function () {
            if(!$scope.hideInfinite){
                return;
            }
            return $scope.totolPage > $scope.param.startPage;
        }
    });

    //    判断从那个页面进来，给与相应的id
    switch (urlParams.type) {
        //删除
        case 'brand':
            $scope.param.brand = [];
            $scope.param.brand.push({id:urlParams.id});
            break;
        //添加
        case 'category':
            $scope.param.sc = [];
            $scope.param.sc.push({id:urlParams.id});
            break;
        default :
            console.log();
    }

    //if(urlParams.query != '')
    if(urlParams.query != ''){
        $scope.param.keywords = urlParams.query;
    }
    $scope.networkError = false;//不显示网络错误

    //获取总流水
    $scope.initData = function(type){
        // 获取分类列表
        var me = $scope;
        if(me.param.lowPrice == null) delete me.param.lowPrice;
        if(me.param.heightPrice == null) delete me.param.heightPrice;
        if(!me.param.sortField) me.param.sortField = '';
        //判断用户是否登陆
        var userInfo = UserService.getUser();
        if(userInfo.isLogined()){
            me.param.userId = userInfo.userId;
        }else{
            delete me.param.userId;
        }
        if($scope.param.keywords){//特殊处理 <script> 这种情况
            var kw = $scope.param.keywords.replace(/</g,'') ;
            kw= kw.replace(/>/g,'');
            $scope.param.keywords = kw;
        }
       ProductListService.productList($scope.param).error(function (data, status, headers, config) {
           PopupService.alertPopup(CDFG_NETWORK_ERROR);
       }).then(function (d){//success 改成then
           if(d.code == -1){
               $scope.networkError = true;
               return;
           }
           //console.log(data);
           //给totolPage赋值;
           var data = d.data;
           if(!data){//如果返回null 搜索了特殊字符 返回个list为空的对象防止 undefined
               data = {"brand":[],"currentPageNo":1,"pageSize":20,"result":[],"sc":[],"skuSpec":[],"spuAttr":[],"spuSpec":[],"totalRecord":0,"totolPage":0};
           }
           me.totolPage = data.totolPage ? data.totolPage : 1;
           //商品列表
            if (type == 'upData') {
                $scope.productData ? $scope.productData = $scope.productData.concat(data.result) : $scope.productData = data.result;
            } else {
                $scope.productData = data.result;
            }

           $timeout(function () {
               $scope.hideInfinite = true;
           }, 500);
           $scope.moreFont = false;
           //商品列表页筛选界面
           //data.sc ? me.dataSc = data.sc : null;
           if(data.sc && data.sc.length) me.dataSc = data.sc;
           //data.brand ? me.dataBrand = [{"cateName":"品牌","list":data.brand}] : null;
           if(data.brand && data.brand.length) me.dataBrand = [{"cateName":"品牌","list":data.brand}];

           //data.spuSpec ? me.dataSpuSpec = data.spuSpec : null;
           if(data.spuSpec) {
               var temp = [];

               angular.forEach(data.spuSpec, function(value){
                   if(value.list && value.list.length > 0) {
                       temp.push(value);
                   }
               });

               if(temp.length) me.dataSpuSpec = temp;
           }

           //data.skuSpec ? me.dataSkuSpec = data.skuSpec : null;
           if(data.skuSpec) {
               var temp = [];

               angular.forEach(data.skuSpec, function(value){
                   if(value.list && value.list.length > 0) {
                       temp.push(value);
                   }
               });

               if(temp.length) me.dataSkuSpec = temp;
           }

           //data.spuAttr ? me.dataSpuAttr = data.spuAttr : null;
           if(data.spuAttr) {
               var temp = [];

               angular.forEach(data.spuAttr, function(value){
                    if(value.list && value.list.length > 0) {
                        temp.push(value);
                    }
               });

               if(temp.length) me.dataSpuAttr = temp;
           }


           if(me.productData.length>0){
               me.listNumber = false;
           }else{
               me.listNumber = true;
           }

        });

    };

    $scope.initData();

    $scope.restartPage = function(){
        $scope.initData();
    };

    //排序点击
    $scope.getDatas = function (param) {

        var me = $scope;
        //console.log(param.sortField);
        //判断重复点击是不执行请求
        if(param.sortField == me.param.sortField && param.sortField != 'salePrice'){
            return;
        }

        me.param.sortField = param.sortField;

        param.sortDir ? me.param.sortDir = param.sortDir : function(){
            me.param.sortDir ? delete me.param.sortDir : null;
        }();

        me.param.startPage = 1;

        me.initData();
    };



    //filter页面要维护3个list 1：三级分类集合，例如男鞋，衬衫，运动鞋
        $scope.classList;
        //2 三级分类下的 商品属性名 列表
        $scope.attrList;
        //3 属性名下的可枚举的属性值列表
        $scope.selectValueList;

    var slideMenu = document.getElementById('slideMenu');
    //跳转到filter页面
    $scope.slideMenu = false;
    $scope.slideMenuValue = false;
    $scope.initFilter = function () {
        //$state.go('productList.filter');
        $scope.slideMenu = true;
    };
    $scope.closeInitFilter = function(){
        $scope.slideMenu = false;
    };




    //    -----------------  筛选  类别  ----------------   //
    // 点击类别 获取联动筛选属性
    $scope.getAttrsFn = function(scId){

        var me = $scope;
        me.param.sc ? delete me.param.sc : null;
        if(scId){
            me.param.sc = [];
            me.param.sc.push({id:scId});
        }
        me.param.resultList = false;
        me.param.startPage = 1;
        if(me.param.lowPrice == null) delete me.param.lowPrice;
        if(me.param.heightPrice == null) delete me.param.heightPrice;

        ProductListService.productList(me.param).success(function (data) {
            console.log(data)
            var me = $scope;
            //商品列表页筛选界面
            data.brand ? me.dataBrand = [{"cateName":"品牌","list":data.brand}] : null
            data.spuSpec ? me.dataSpuSpec = data.spuSpec : null;
            data.skuSpec ? me.dataSkuSpec = data.skuSpec : null;
            data.spuAttr ? me.dataSpuAttr = data.spuAttr : null;
            me.selectAttrVal.brand = {};
            me.selectAttrVal.spuSpec = {};
            me.selectAttrVal.skuSpec = {};
            me.selectAttrVal.spuAttr = {};
        }).error(function (data, status, headers, config) {
            PopupService.alertPopup(CDFG_NETWORK_ERROR);
        });

    };


    //点击类别 close按钮
    $scope.checkedClose = function(){
        var me = $scope;
        me.dataSc.selection = null;
        me.getAttrsFn();
    }

    //筛选页面的返回按钮方法
    $scope.filterBack = function(){
        $ionicHistory.goBack();
    };
    //    -----------------  选择  类别属性选择  ----------------   //
    //跳转到FilterSelections页面
    var me = $scope;
    me.initFilterSelections = function(filter,type){

        if(!filter || filter.length==0){
            console.error("商品规格参数不存在");
        }

        if(filter.list[0].name != '不限'){
            var o = angular.extend({},filter.list[0]);
            o.name = '不限'; //增加 ‘不限’ 选项
            o.id= undefined;
            $scope.selectValueList = filter.list.splice(0, 0, o);//增加 ‘不限’ 选项插入到selectFilterList中
        }

        me.selectFilter = filter;//JSON.parse(filter);
        me.type = type;
        me.slideMenuValue = true;
        //$state.go("productList.select");

    }
    //  筛选 -> 选择分类
    me.onSelect = function (filter,type) {
        filter.isChecked = true;
        if(type == 'brand'){
            me.selectAttrVal.brand[me.selectFilter.cateName] = filter;
        }
        if(type == 'spuSpec'){
            me.selectAttrVal.spuSpec[me.selectFilter.cateName] = filter;
        }
        if(type == 'skuSpec'){
            me.selectAttrVal.skuSpec[me.selectFilter.cateName] = filter;
        }
        if(type == 'spuAttr'){
            me.selectAttrVal.spuAttr[me.selectFilter.cateName] = filter;
        }
        me.slideMenuValue = false;
        $state.go("productList.view");
        //$scope.slideMenu = true;
    };

    //  筛选点击确定按钮事件
    me.applyFilter = function () {
        var me = $scope;
        // change here
        var dataSc = me.dataSc ? me.dataSc.selection : null;  //类别
        var selectBrand = me.selectAttrVal.brand ? me.selectAttrVal.brand : null;
        var selectSpuSpec = me.selectAttrVal.spuSpec ? me.selectAttrVal.spuSpec : null;
        var selectSkuSpec = me.selectAttrVal.skuSpec ? me.selectAttrVal.skuSpec : null;
        var selectSpuAttr = me.selectAttrVal.spuAttr ? me.selectAttrVal.spuAttr : null;

        me.param.sc ? delete me.param.sc : null;
        me.param.brand ? delete me.param.brand : null;
        me.param.spuSpec ? delete me.param.spuSpec : null;
        me.param.skuSpec ? delete me.param.skuSpec : null;
        me.param.spuAttr ? delete me.param.spuAttr : null;
        !me.param.resultList ? delete me.param.resultList : null;

        /* ----- sc   n个销售分类 ----- */
        if(dataSc && dataSc.id){
            me.param.sc = [];
            me.param.sc.push({id:dataSc.id});
        }else if(urlParams.type == 'category'){
            me.param.sc = [];
            me.param.sc.push({id:urlParams.id});
        }
        /* ----- brand   n个品牌分类 ----- */
        if(selectBrand){
            for(var key in selectBrand){
                me.param.brand ? null : me.param.brand = [];
                if(selectBrand[key].name != '不限' && selectBrand[key] != '不限'){
                    me.param.brand.push({id:selectBrand[key].id});
                    me.title = selectBrand[key].name;
                }
            }
            me.param.brand && $scope.param.brand.length == 0 ? delete $scope.param.brand : me.param.brand;
        }

        if(urlParams.type == 'brand') {
            if(!me.param.brand){
                me.param.brand = [];
                me.param.brand.push({id:urlParams.id});
                me.title = urlParams.title;
            }
        }

        /* ----- spuSpec   n个spu规格 ----- */
        if(selectSpuSpec){
            for(var key in selectSpuSpec){
                me.param.spuSpec ? null : me.param.spuSpec = [];
                if(selectSpuSpec[key].name != '不限' && selectSpuSpec[key] != '不限'){
                    $scope.param.spuSpec.push({id:selectSpuSpec[key].id});
                }
            }
            me.param.spuSpec && me.param.spuSpec.length == 0 ? delete me.param.spuSpec : me.param.spuSpec;
        }
        /* ----- skuSpec   n个sku规格 ----- */
        if(selectSkuSpec){
            for(var key in selectSkuSpec){
                me.param.skuSpec ? null : me.param.skuSpec = [];
                if(selectSkuSpec[key].name != '不限' && selectSkuSpec[key] != '不限'){
                    me.param.skuSpec.push({id:selectSkuSpec[key].id});
                }
            }
            me.param.skuSpec && $scope.param.skuSpec.length == 0 ? delete me.param.skuSpec : me.param.skuSpec;
        }
        /* ----- spuAttr   n个spu属性 ----- */
        if(selectSpuAttr){
            for(var key in selectSpuAttr){
                me.param.spuAttr ? null : me.param.spuAttr = [];
                if(selectSpuAttr[key].name != '不限' && selectSpuAttr[key] != '不限'){
                    me.param.spuAttr.push({id:selectSpuAttr[key].id});
                }
            }
            me.param.spuAttr && $scope.param.spuAttr.length == 0 ? delete me.param.spuAttr : me.param.spuAttr;
        }


        // 价格区间 *//* //^\+?[1-9][0-9]*$/
        var lowPrice = me.param.lowPrice;
        var heightPrice = me.param.heightPrice;

        me.param.lowPrice || lowPrice != '' ? delete me.param.lowPrice : null;
        me.param.heightPrice || heightPrice != '' ? delete me.param.heightPrice : null;

        var reg = new RegExp('^[1-9][0-9]*$');

        if(lowPrice && !reg.test(lowPrice)){
            PopupService.alertPopup('提示','价格必须是非零正整数');
            me.param.lowPrice = '';
            return;
        }

        if(heightPrice && !reg.test(heightPrice)){
            PopupService.alertPopup('提示','价格必须是非零正整数');
            me.param.heightPrice = '';
            return;
        }

        if(lowPrice && heightPrice && heightPrice < lowPrice){

            PopupService.alertPopup('提示','最高价格应该大于最低价格');
            me.param.lowPrice = lowPrice;
            me.param.heightPrice = '';
            return;
        }

        lowPrice ? me.param.lowPrice = lowPrice : null;
        heightPrice ? me.param.heightPrice = heightPrice : null;

        me.param.startPage = 1;
        me.initData();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.slideMenu = false;
        $state.go("productList.view");
    };

    //  筛选点击取消选择按钮事件
    me.cancelFilter = function () {
        //$scope.initFilterSelections({'name':'不限','id':undefined});
        var me = $scope;
        if(me.dataSc){
            me.dataSc.selection = null;
        }
        me.selectAttrVal.brand = me.selectAttrVal.spuSpec = me.selectAttrVal.skuSpec = me.selectAttrVal.spuAttr = {};
        !me.param.resultList ? delete me.param.resultList : null;
        me.param.lowPrice = me.param.heightPrice = null;
        me.getAttrsFn();

        //$state.go("productList.view");
    };

    //  回退按钮  &&  初始化列表页
    me.myGoBack = function () {
        //$ionicViewSwitcher.nextDirection('back');
        $ionicHistory.goBack();
    };

    //弹出搜索框
    // me.showSearch = function(){
    //    $state.go("search",{query:$scope.query.tag,fromPage:$scope.param.fromType});
    //};
        /*方法定义*/
        $scope.onContentScroll = onContentScroll;//列表滚动，判断是否显示返回顶部
        $scope.scrollTop = scrollTop;//滚动到顶部
        $scope.showToTopImage = false;//显示返回顶部

        /*返回顶部*/
        function scrollTop(){
            $ionicScrollDelegate.$getByHandle('listContent').scrollTop();//滚动到顶部
        }

        /*列表滚动，判断是否显示返回顶部*/
        function onContentScroll(){
            var position = $ionicScrollDelegate.$getByHandle('listContent').getScrollPosition();//获取滚动位置

            $scope.$apply(function(){
                $scope.showToTopImage = position.top > $rootScope.deviceHeight / 3.0;
                //console.log($scope.showToTopImage);
            });

            if(position.top < 20){
                $scope.headAnimateUp();
            }else {
                $scope.headAnimateDown();
            }
        }

        //头部搜索项和排序==手势 动画
        $scope.headAnimateUp = function(){
            $scope.headerAnimate = {top:'0'};
            $scope.subheaderAnimate = {top:'44px', position: 'static', width: '100%'};
            $scope.contentAnimate = {top:'88px'};

        }
        $scope.headAnimateDown = function(){
            $scope.headerAnimate = {top:'-44px'};
            $scope.subheaderAnimate = {top:'-44px', position: 'fixed', width: '100%'};
            $scope.contentAnimate = {top:'0'};
        };

        $scope.headerStyle = StyleConfig.header;
        $scope.searchInputStyle = StyleConfig.searchInput;
        $scope.headerLeftArrowStyle = StyleConfig.headerLeftArrow;

        $scope.leftArrow = StyleForPlatform.getStyle('leftArrow');

        $scope.query = {tag:$stateParams.query,
            isShowSearch:false,
            hasPopularDiv:true,
            hasHistoryDiv:true,
            urlParam:{
                fromPage:$stateParams.fromPage //从category 还是brand 还是 home
            },
            varInDirective:{

            },
            goTo:'productList.view'
        };
        $scope.showSearch=function(){
            $scope.query.isShowSearch = true;
        };
        $scope.closeSearch=function(){
            // $ionicHistory.goBack();
            $scope.query.isShowSearch = false;
        };

}]);