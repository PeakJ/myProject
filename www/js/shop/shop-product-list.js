/********************************
 creater: xuf
 create time:2015/08/17
 describe：免税店商品列表页
 ********************************/

//免税店商品列表controller
cdfgApp.controller('ShopProductListController',['$scope', '$http','$stateParams','$timeout',
    '$ionicHistory','$ionicPopup','ProductListService','$state','$ionicModal','$ionicScrollDelegate',
    'PopupService','$ionicViewSwitcher','StyleConfig',
    'StyleForPlatform','LocalCacheService','SearchService',
    function($scope, $http,$stateParams, $timeout,$ionicHistory,$ionicPopup,ProductListService,
             $state,$ionicModal,$ionicScrollDelegate,PopupService,$ionicViewSwitcher,StyleConfig,
             StyleForPlatform,LocalCacheService,SearchService){

        var urlParams = {
            type: $stateParams.fromPage,  //从哪个页面来
            id: $stateParams.id,
            title: $stateParams.title,
            query:$stateParams.query,
            brandId:$stateParams.brandId,
            shopId:$stateParams.shopId,
            typeId:$stateParams.typeId
        };

        $scope.fromPage = urlParams.type;
        $scope.title = urlParams.title;
        $scope.shopId = urlParams.shopId;
        angular.extend($scope, {
            query:{tag:$stateParams.query  //input 绑定数据的最佳实践字符串放在对象的属性里
            },//搜索关键字
            // 筛选页的价格筛选
            param: {
                startPage: 1,
                pageSize: 20,
                channel:1,
                //免税店特有参数
                store:urlParams.shopId
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
            selectAttrVal: {
                brand: {},
                spuSpec: {},
                skuSpec: {},
                spuAttr: {},
                name: null
            },
            //上拉加载
            loadMore: function () {

                $timeout(function () {
                    if (!$scope.hasMore) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        return;
                    }
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
                console.log('我从这里来'+urlParams.type);
        }
        //if(urlParams.query != '')
        if(urlParams.query != ''){
            $scope.param.keywords = urlParams.query;
        }
        if(urlParams.brandId){
            console.log("店铺内分类存在--》"+urlParams.typeId);
            $scope.param.brand = [{id:urlParams.brandId}];
        }
        if(urlParams.typeId){
            console.log("店铺内分类存在--》"+urlParams.typeId);
            $scope.param.sc = [{id:urlParams.typeId}];
        }

        //获取总流水
        $scope.initData = function(type){
            // 获取分类列表
            var me = $scope;
            if(me.param.lowPrice == null) delete me.param.lowPrice;
            if(me.param.heightPrice == null) delete me.param.heightPrice;
            if(!me.param.sortField) me.param.sortField = '';var aaa = me.param;
            if($scope.param.keywords){//特殊处理 <script> 这种情况
                var kw = $scope.param.keywords.replace(/</g,'') ;
                kw= kw.replace(/>/g,'');
                $scope.param.keywords = kw;
            }
            ProductListService.productList($scope.param).then(function (d) {
                if(d.code == -1){
                    $scope.networkError = true;
                    return;
                }
                var data = d.data;
                //给totolPage赋值;
                //如果返回是null 则认为总数是0
                if(!data){
                    data = {"brand":[],"currentPageNo":1,"pageSize":20,"result":[],"sc":[],"skuSpec":[],"spuAttr":[],"spuSpec":[],"totalRecord":0,"totolPage":0};
                }
                me.totolPage = data.totolPage ? data.totolPage : 0;
                //商品列表
                if (type) {
                    $scope.productData ? $scope.productData = $scope.productData.concat(data.result) : $scope.productData = data.result;
                } else {
                    $scope.productData = data.result;
                }

            });

        };

        $scope.initData();

        //排序点击
        $scope.getDatas = function (param) {

            var me = $scope;
            me.param.sortField = param.sortField;

            param.sortDir ? me.param.sortDir = param.sortDir : function(){
                me.param.sortDir ? delete me.param.sortDir : null;
            }();

            me.param.startPage = 1;
            me.initData();
        };

        //回到顶部
        $scope.fs = false;
        $scope.press = true;
        $scope.scrollFloat = function(){
            var pos =   $ionicScrollDelegate.getScrollPosition();
            var y = parseInt(pos.top);
            $scope.press = true
            if(y>40){
                $scope.fs = true;
            }else{
                $scope.fs = false;
            }
        };

        $scope.toTop = function(){
            $ionicScrollDelegate.scrollTop(0);
            $scope.fs = $scope.press = false;
        };

        $scope.headerStyle = StyleConfig.header;
        $scope.searchInputStyle = StyleConfig.searchInput;
        $scope.headerLeftArrowStyle = StyleConfig.headerLeftArrow;
        $scope.leftArrow = StyleForPlatform.getStyle('leftArrow');

        $scope.goCategory = function(){
            $state.go('shopCategory',{shopId:$scope.shopId});
        };
        $scope.myGoBack = function(){
            $state.go('shop',{id:$scope.shopId});
            $ionicHistory.goBack();
        };

        //搜索指令的设置
        $scope.query = {tag:urlParams.query,
            isShowSearch:false,
            hasPopularDiv:false,
            hasHistoryDiv:false,
            shopId:$stateParams.id, //路由中的id 是shopId
            urlParam:{
                shopId:$stateParams.shopId
            },
            varInDirective:{
                shopId:$stateParams.shopId
            },
            goTo:'shopProductList'
        };
        $scope.showSearch = function(){
            $scope.query.isShowSearch = true;
        };
    }]);

