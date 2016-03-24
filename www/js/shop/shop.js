//搜索服务

//var bbb =angular.module('ionic', ['ngAnimate', 'ngSanitize', 'ui.router']);
var im = angular.module('ionic');
cdfgApp.factory('ShopService',['$http','UrlService',function($http,UrlService){
    return {
        getShopSearchAssist:function(){
        },
        getShopPage:function(storeId){
            var url = UrlService.getUrl('HOME_LAYOUT'),
                params={
               'storeId':storeId
            };
            return $http.get(url,{params:params});
        }

    };
}]);
/***扩展ionic的ionnav指令
 *
 */
im.directive('ionCdfgTab', [
        '$compile',
        '$ionicConfig',
        '$ionicBind',
        '$ionicViewSwitcher',
        function($compile, $ionicConfig, $ionicBind, $ionicViewSwitcher) {
            //isDefined jqLite 存在于 ionic 闭包中，这里使用需要重新定义
            function isDefined(value) {return typeof value !== 'undefined';}
            var jqLite = angular.element;

            //Returns ' key="value"' if value exists
            function attrStr(k, v) {
                return isDefined(v) ? ' ' + k + '="' + v + '"' : '';
            }
            return {
                restrict: 'E',
                require: ['^ionCdfgTabs', 'ionCdfgTab'],
                controller: '$ionicTab',
                scope: true,
                compile: function(element, attr) {
                    var cdfgtab= attr.cdfgtab;

                    //We create the tabNavTemplate in the compile phase so that the
                    //attributes we pass down won't be interpolated yet - we want
                    //to pass down the 'raw' versions of the attributes
                    var tabNavTemplate = '<ion-tab-nav' +
                        attrStr('ng-click', attr.ngClick) +
                        attrStr('title', attr.title) +
                        attrStr('icon', attr.icon) +
                        attrStr('icon-on', attr.iconOn) +
                        attrStr('icon-off', attr.iconOff) +
                        attrStr('badge', attr.badge) +
                        attrStr('badge-style', attr.badgeStyle) +
                        attrStr('hidden', attr.hidden) +
                        attrStr('disabled', attr.disabled) +
                        attrStr('class', attr['class']) +
                        '></ion-tab-nav>';
                    if(cdfgtab==1){
                        tabNavTemplate=  '<ion-cdfg-tab-nav' +
                            attrStr('ng-click', attr.ngClick) +
                            attrStr('title', attr.title) +
                            attrStr('icon', attr.icon) +
                            attrStr('icon-on', attr.iconOn) +
                            attrStr('icon-off', attr.iconOff) +
                            attrStr('badge', attr.badge) +
                            attrStr('badge-style', attr.badgeStyle) +
                            attrStr('hidden', attr.hidden) +
                            attrStr('disabled', attr.disabled) +
                            attrStr('class', attr['class']) +
                            attrStr('number',attr.number)+
                            '></ion-cdfg-tab-nav>';
                    }


                    //Remove the contents of the element so we can compile them later, if tab is selected
                    var tabContentEle = document.createElement('div');
                    for (var x = 0; x < element[0].children.length; x++) {
                        tabContentEle.appendChild(element[0].children[x].cloneNode(true));
                    }
                    var childElementCount = tabContentEle.childElementCount;
                    element.empty();

                    var navViewName, isNavView;
                    if (childElementCount) {
                        if (tabContentEle.children[0].tagName === 'ION-NAV-VIEW') {
                            // get the name if it's a nav-view
                            navViewName = tabContentEle.children[0].getAttribute('name');
                            tabContentEle.children[0].classList.add('view-container');
                            isNavView = true;
                        }
                        if (childElementCount === 1) {
                            // make the 1 child element the primary tab content container
                            tabContentEle = tabContentEle.children[0];
                        }
                        if (!isNavView) tabContentEle.classList.add('pane');
                        tabContentEle.classList.add('tab-content');
                    }

                    return function link($scope, $element, $attr, ctrls) {
                        var childScope;
                        var childElement;
                        var tabsCtrl = ctrls[0];
                        var tabCtrl = ctrls[1];
                        var isTabContentAttached = false;
                        $scope.$tabSelected = false;

                        $ionicBind($scope, $attr, {
                            onSelect: '&',
                            onDeselect: '&',
                            title: '@',
                            uiSref: '@',
                            href: '@'
                        });

                        tabsCtrl.add($scope);
                        $scope.$on('$destroy', function() {
                            if (!$scope.$tabsDestroy) {
                                // if the containing ionTabs directive is being destroyed
                                // then don't bother going through the controllers remove
                                // method, since remove will reset the active tab as each tab
                                // is being destroyed, causing unnecessary view loads and transitions
                                tabsCtrl.remove($scope);
                            }
                            tabNavElement.isolateScope().$destroy();
                            tabNavElement.remove();
                            tabNavElement = tabContentEle = childElement = null;
                        });

                        //Remove title attribute so browser-tooltip does not apear
                        $element[0].removeAttribute('title');

                        if (navViewName) {
                            tabCtrl.navViewName = $scope.navViewName = navViewName;
                        }
                        $scope.$on('$stateChangeSuccess', selectIfMatchesState);
                        selectIfMatchesState();
                        function selectIfMatchesState() {
                            if (tabCtrl.tabMatchesState()) {
                                tabsCtrl.select($scope, false);
                            }
                        }

                        var tabNavElement = jqLite(tabNavTemplate);
                        tabNavElement.data('$ionTabsController', tabsCtrl);
                        tabNavElement.data('$ionTabController', tabCtrl);
                        tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));


                        function tabSelected(isSelected) {
                            if (isSelected && childElementCount) {
                                // this tab is being selected

                                // check if the tab is already in the DOM
                                // only do this if the tab has child elements
                                if (!isTabContentAttached) {
                                    // tab should be selected and is NOT in the DOM
                                    // create a new scope and append it
                                    childScope = $scope.$new();
                                    childElement = jqLite(tabContentEle);
                                    $ionicViewSwitcher.viewEleIsActive(childElement, true);
                                    tabsCtrl.$element.append(childElement);
                                    $compile(childElement)(childScope);
                                    isTabContentAttached = true;
                                }

                                // remove the hide class so the tabs content shows up
                                $ionicViewSwitcher.viewEleIsActive(childElement, true);

                            } else if (isTabContentAttached && childElement) {
                                // this tab should NOT be selected, and it is already in the DOM

                                if ($ionicConfig.views.maxCache() > 0) {
                                    // keep the tabs in the DOM, only css hide it
                                    $ionicViewSwitcher.viewEleIsActive(childElement, false);

                                } else {
                                    // do not keep tabs in the DOM
                                    destroyTab();
                                }

                            }
                        }

                        function destroyTab() {
                            childScope && childScope.$destroy();
                            isTabContentAttached && childElement && childElement.remove();
                            tabContentEle.innerHTML = '';
                            isTabContentAttached = childScope = childElement = null;
                        }

                        $scope.$watch('$tabSelected', tabSelected);

                        $scope.$on('$ionicView.afterEnter', function() {
                            $ionicViewSwitcher.viewEleIsActive(childElement, $scope.$tabSelected);
                        });

                        $scope.$on('$ionicView.clearCache', function() {
                            if (!$scope.$tabSelected) {
                                destroyTab();
                            }
                        });

                    };
                }
            };
        }]);
im.directive('ionCdfgTabNav', [function() {
        return {
            restrict: 'E',
            replace: true,
            require: ['^ionTabs', '^ionTab'],
            template:
            '<a ' +
            '  class="tab-item cdfg-ion-shop-tab">' +
            '<i class="icon cdfg-shop-bar-i-highlight" ng-if="isTabActive() && !isIcon()" >{{number}}</i>'+
            '<i class="icon cdfg-shop-bar-i-normal" ng-if="!isTabActive() && !isIcon()" >{{number}}</i>'+
            '<i class="icon {{getIconOn()}}"  ng-if="isTabActive()  && isIcon()"></i>' +
            '<i class="icon {{getIconOff()}}"  ng-if="!isTabActive()  && isIcon()"></i>' +
            '<span class="tab-title" ng-bind-html="title"></span>' +
            '</a>',
            scope: {
                title: '@',
                icon: '@',
                iconOn: '@',
                iconOff: '@',
                badge: '=',
                hidden: '@',
                disabled: '&',
                badgeStyle: '@',
                'class': '@',
                number:'@'
            },
            link: function($scope, $element, $attrs, ctrls) {
                var tabsCtrl = ctrls[0],
                    tabCtrl = ctrls[1];

                //Remove title attribute so browser-tooltip does not apear
                $element[0].removeAttribute('title');

                $scope.selectTab = function(e) {
                    e.preventDefault();
                    tabsCtrl.select(tabCtrl.$scope, true);
                };
                if (!$attrs.ngClick) {
                    $element.on('click', function(event) {
                        $scope.$apply(function() {
                            $scope.selectTab(event);
                        });
                    });
                }

                $scope.isHidden = function() {
                    if ($attrs.hidden === 'true' || $attrs.hidden === true) return true;
                    return false;
                };
                //xuf 添加
                $scope.isIcon = function(){
                    return $scope.icon ==='true';
                };
                $scope.getIconOn = function() {
                    return $scope.iconOn ;
                };
                $scope.getIconOff = function() {
                    return $scope.iconOff ;
                };

                $scope.isTabActive = function() {
                    return tabsCtrl.selectedTab() === tabCtrl.$scope;
                };
            }
        };
    }]);
im.directive('ionCdfgTabs', [
    '$ionicTabsDelegate',
    '$ionicConfig',
    function($ionicTabsDelegate, $ionicConfig) {
        function isDefined(value) {return typeof value !== 'undefined';}
        var jqLite = angular.element;
        return {
            restrict: 'E',
            scope: {
               tabsUp: '@', tabsDown:'@'
            },
            controller: '$ionicTabs',
            compile: function(tElement,$scope) {
                //We cannot use regular transclude here because it breaks element.data()
                //inheritance on compile
                var innerElement = jqLite('<div class="tab-nav tabs cdfg-tabs-top " >');
                innerElement.append(tElement.contents());
                $scope.getTabsUp = function(){
                    return $scope.tabsUp;
                };
                tElement.append(innerElement)
                    .addClass('tabs-' + $ionicConfig.tabs.position() + ' tabs-' + $ionicConfig.tabs.style());

                return { pre: prelink, post: postLink };
                function prelink($scope, $element, $attr, tabsCtrl) {
                    var deregisterInstance = $ionicTabsDelegate._registerInstance(
                        tabsCtrl, $attr.delegateHandle, tabsCtrl.hasActiveScope
                    );

                    tabsCtrl.$scope = $scope;
                    tabsCtrl.$element = $element;
                    tabsCtrl.$tabsElement = jqLite($element[0].querySelector('.tabs'));
                    //bu xuf
                    var tabsEle=    jqLite($element[0].querySelector(".cdfg-tabs-top"));

                //        tabsEle.addClass($scope.tabsUp);
                 //   tabsEle.addClass("xxxooo");debugger;
                    $scope.$watch(function() { return $element[0].className; }, function(value) {
                        var isTabsTop = value.indexOf('tabs-top') !== -1;
                        var isHidden = value.indexOf('tabs-item-hide') !== -1;
                        $scope.$hasTabs = !isTabsTop && !isHidden;
                        $scope.$hasTabsTop = isTabsTop && !isHidden;
                        $scope.$emit('$ionicTabs.top', $scope.$hasTabsTop);
                    });

                    function emitLifecycleEvent(ev, data) {
                        ev.stopPropagation();
                        var previousSelectedTab = tabsCtrl.previousSelectedTab();
                        if (previousSelectedTab) {
                            previousSelectedTab.$broadcast(ev.name.replace('NavView', 'Tabs'), data);
                        }
                    }

                    $scope.$on('$ionicNavView.beforeLeave', emitLifecycleEvent);
                    $scope.$on('$ionicNavView.afterLeave', emitLifecycleEvent);
                    $scope.$on('$ionicNavView.leave', emitLifecycleEvent);

                    $scope.$on('$destroy', function() {
                        // variable to inform child tabs that they're all being blown away
                        // used so that while destorying an individual tab, each one
                        // doesn't select the next tab as the active one, which causes unnecessary
                        // loading of tab views when each will eventually all go away anyway
                        $scope.$tabsDestroy = true;
                        deregisterInstance();
                        tabsCtrl.$tabsElement = tabsCtrl.$element = tabsCtrl.$scope = innerElement = null;
                        delete $scope.$hasTabs;
                        delete $scope.$hasTabsTop;
                    });
                }

                function postLink($scope, $element, $attr, tabsCtrl) {
                    if (!tabsCtrl.selectedTab()) {
                        // all the tabs have been added
                        // but one hasn't been selected yet
                        tabsCtrl.select(0);
                    }
                }
            },
            link:function($scope, $element, $attrs){
            var xxxf=    jqLite($element[0].querySelector(".cdfg-tabs-top"));
            }
        };
    }]);

cdfgApp.controller('ShopController',['$scope','SearchService','PopupService','UrlService','$http',
    '$state','LocalCacheService','$stateParams','$window','$timeout','$ionicScrollDelegate',
    '$ionicHistory','StyleConfig','StyleForPlatform',
    'ShopService','$window','$ionicTabsDelegate','BrandService','$rootScope','ProductListService',
    function($scope,SearchService,PopupService,UrlService,$http,$state,LocalCacheService,
             $stateParams,$window,$timeout,
             $ionicScrollDelegate, $ionicHistory,StyleConfig,StyleForPlatform,ShopService,
             $window,$ionicTabsDelegate,BrandService,$rootScope,ProductListService){

        $scope.brandNum = '';
        $scope.prodNum = '';
        $scope.storeName = '';
        //由于 tabs 占了 50px的高度 view 需要加50
        $scope.viewHeight = {top:'-50px',height:new Number($window.innerHeight) +250};
        //请求免税店首页 信息
        $scope.init = function(){
            //加载数据
            var url=UrlService.getUrl('HOME_LAYOUT');
            $http.get(url+"?storeId="+$stateParams.id,{cache:false}).success(function(d){
                if(!d){
                    //网络超时
                    return ;
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.cmsData= d.data;
                $scope.brandNum = d.brandNum;
                $scope.prodNum = d.prodNum;
                $scope.storeName= d.storeName;
                $scope.backPic = d.backPic;
                if(d.data[0].type==0){
                    $scope.showSearchBar=true;
                }
            }).then(function(res){

                if(!res){  //网络未连接

                }
            });
        };
       $scope.init();
        $scope.myGoBack = function(){
            $ionicHistory.goBack();
        };

        $scope.shopHeader = {top:44,width:'100%'};
   //     $scope.shopContent = {top:296};
        $scope.tabsY = "tabsDown";
        //动画方法， 向上推出header 图片 图片高200,200-44 =156 content

        $scope.css3up = function(){
            $scope.shopHeader = {top:'-156px',width:'100%'};
         //   $scope.shopContent = {top:'96px'};
            $scope.viewHeight = {top:'-250px',height:new Number($window.innerHeight) +250};
        //    $scope.tabsY = "tabsUp";

        }
        $scope.css3down = function(){
            $scope.shopHeader = {top:'44px',width:'100%'};
         //   $scope.shopContent = {top:'296px'};
            $scope.viewHeight = {top:'-50px',height:new Number($window.innerHeight) +250};
          //  $scope.tabsY = "tabsDown";
        };
        $scope.tabsAnimate = 'cdfg-animate-down';
        $scope.isUp = false;

        var t1Scroll =  $ionicScrollDelegate.$getByHandle('t1');//从左至右 这个滚动区域代理
        var t2Scroll =  $ionicScrollDelegate.$getByHandle('t2');
        var t3Scroll =  $ionicScrollDelegate.$getByHandle('t3');
        var t4Scroll =  $ionicScrollDelegate.$getByHandle('t4');
        var tArray = [0,t1Scroll,t2Scroll,t3Scroll,t4Scroll];
        var brandAlphabet = document.getElementById('brand-alphabet');
        $scope.scroll = function(index){
            var y = tArray[index].getScrollPosition().top;
            console.log("---->"+y);
          if(y>20){
              //if(!$scope.isUp){
              //    $ionicScrollDelegate.scrollTop(0);
              //}
              $scope.css3up();
              console.log("aaaaauuuuppp");
              $scope.tabsAnimate = 'cdfg-animate-up';
            $scope.isUp =true;
              if(index == 3){

                  if(brandAlphabet) brandAlphabet.style.opacity = 1;
              }else{
                  if(brandAlphabet) brandAlphabet.style.opacity = 0;
              }
          }
            else{
              $scope.css3down();
              console.log("aaddddooowwwnnn");
              $scope.isUp = false;
              $scope.tabsAnimate = 'cdfg-animate-down';
              if(brandAlphabet) brandAlphabet.style.opacity = 0;
          }
        };
        $scope.shopId = $stateParams.id;

        //免税店分类 页面的指令配置对象
        $scope.category ={shopId: $scope.shopId};

        //转到品牌店
        $scope.goBrand = function(){
            $scope.brandParam = {
                storeId : $scope.shopId,
                channel:1
            }
            BrandService.brandsList($scope.brandParam,'reco')
                .success(function (data, status, headers, config) {

                    //网络异常、服务器出错
                    if(!data || data == CDFG_NETWORK_ERROR){
                        $scope.networkError = true;
                        return;
                    }
                    $scope.networkError = false;

                    $scope.commends = data;
                })
                .error(function (data, status, headers, config) {
                    PopupService.alertPopup(CDFG_NETWORK_ERROR);
                });
            //获取品牌列表
            $timeout(function () {

                BrandService.brandsList($scope.brandParam)
                    .success(function (data, status, headers, config) {
                        if(!data || data == CDFG_NETWORK_ERROR){
                            return;
                        }
                        /* 排序 */
                        data.sort(function (a, b) {
                            return a.enName.toUpperCase() > b.enName.toUpperCase() ? 1 : -1;
                        });

                        /* 组合数组 */
                        $scope.brandList = data;

                        $scope.letter = []; //用于存放字母的空数组
                        $scope.curCart = null;

                        $scope.isShowTitle = function (item) {
                            if($scope.brandList.length <= 1){
                                var type = true;
                            }else{
                                var type = false;
                            }
                            var newCart = item.enName.charAt(0).toUpperCase();
                            newCart != $scope.curCart ? type = true : null;
                            if (type) $scope.curCart = newCart;
                            //添加字母到数组中
                            if ($scope.letter.indexOf($scope.curCart) == -1) $scope.letter.push($scope.curCart);
                            return type;
                        };

                        //console.log($scope.letter);

                    })
                    .error(function (data, status, headers, config) {
                        PopupService.alertPopup(CDFG_NETWORK_ERROR);
                    });
            }, 500);

        };
        $scope.goBrand();
        //brandto 跳转到全部商品
        $scope.goShopBrandId = function(storeId){
            //$scope.param.brand
           $state.go('shopProductList',{fromPage:'shopBrand',shopId:$scope.shopId,brandId:storeId});
        };
        //联网是失败点击重新加载
        $scope.restartPage = function(){
            $scope.goBrand();
        };
        // 字母索引
        $scope.scrollTo = function (top) {
            t3Scroll.scrollTo(0, top-51, true);
        };

        //全部商品 开始 productList
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
        angular.extend($scope, {
            query:{tag:$stateParams.query  //input 绑定数据的最佳实践字符串放在对象的属性里
            },//搜索关键字
            // 筛选页的价格筛选
            param: {
                startPage: 1,
                pageSize: 20,
                channel:1,
                //免税店特有参数
                store:$scope.shopId
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

            ProductListService.productList($scope.param).success(function (data) {
                //给totolPage赋值;
                //如果返回是null 则认为总数是0
                if(!data){
                    me.totolPage =0 ;return ;
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

        //搜索指令的设置
        $scope.query = {tag:'',
            isShowSearch:false,
            hasPopularDiv:false,
            hasHistoryDiv:false,
            shopId:$scope.shopId, //路由中的id 是shopId
            urlParam:{
                shopId:$scope.shopId
            },
            varInDirective:{
                shopId:$scope.shopId
            },
            goTo:'shopProductList'
        };
        $scope.showSearch = function(){
            $scope.query.isShowSearch = true;
            var input = $window.document.getElementById('searchInput');
            $timeout(function() {//解决 ng-show 显示指令页 无法使input 获得焦点问题
                input.focus();
            },10);
        };

        $scope.share= function () {
            if (window.umeng) {
                var me = $scope;
                title = me.storeName+'，赶紧来看看吧',
                    content = '我在中免发现这个免税店，简直惊呆了，【' + me.storeName + '】',
                    pic = CDFG_IP_IMAGE +$scope.backPic,
                    url = 'http://' + CDFG_IP_SERVER + ':' + CDFG_PORT_SERVER + '/' + '' + '/shop/' + $stateParams.id + '/view';
                window.umeng.share( title, content, pic, url);
            }
        };


    }]);
