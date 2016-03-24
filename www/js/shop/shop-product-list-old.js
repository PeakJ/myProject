/********************************
 creater: xuf
 create time:2015/08/17
 describe����˰����Ʒ�б�ҳ
 ********************************/

cdfgApp.factory('ShopProductListService',['$http','UrlService',function($http,UrlService){
    return {
        searchProducts:function(param){
            //to do
        }
    };
}]);

cdfgApp.directive('cdfgShopProductList',['$http','$stateParams','$timeout',
    '$ionicHistory','$ionicPopup','ProductListService','$state','$ionicModal','$ionicScrollDelegate',
    'PopupService','$ionicViewSwitcher','StyleConfig',
    'StyleForPlatform','LocalCacheService','SearchService','$rootScope',
    function( $http,$stateParams, $timeout,$ionicHistory,$ionicPopup,ProductListService,
              $state,$ionicModal,$ionicScrollDelegate,PopupService,$ionicViewSwitcher,StyleConfig,
              StyleForPlatform,LocalCacheService,SearchService,$rootScope){
        return{
            restrict:'A',
            replace:false,
            scope:{
                productList:'=cdfgShopProductList'
            },
            templateUrl:'templates/shop/shop-product-list.html',
            controller:function($scope){
                var urlParams = {
                    type: $stateParams.fromPage,  //���ĸ�ҳ����
                    id: $stateParams.id,
                    title: $stateParams.title,
                    query:$stateParams.query,
                    brandId:$stateParams.brandId,
                    shopId:$stateParams.shopId,
                    typeId:$stateParams.typeId
                };
                $scope.fromPage = urlParams.type;
                $scope.title = urlParams.title;
                $scope.shopId = $scope.productList.shopId;
                angular.extend($scope, {
                    query:{tag:$stateParams.query  //input �����ݵ����ʵ���ַ������ڶ����������
                    },//�����ؼ���
                    // ɸѡҳ�ļ۸�ɸѡ
                    param: {
                        startPage: 1,
                        pageSize: 20,
                        channel:1,
                        //��˰�����в���
                        store:$scope.productList.shopId
                    },
                    totolPage: null,
                    listNumber: null,
                    productTotal: null, //��ȡ�б����ݣ��ۺϣ�
                    productData: [],//��ȡ�б�
                    dataSc: null,  //ɸѡҳ���
                    dataBrand: null, //ɸѡҳƷ��
                    dataSpuSpec: null, //ɸѡҳspu
                    dataSkuSpec: null, //ɸѡҳsku
                    dataSpuAttr: null, //ɸѡҳspu����
                    selectAttrVal: {
                        brand: {},
                        spuSpec: {},
                        skuSpec: {},
                        spuAttr: {},
                        name: null
                    },
                    //��������
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
                    //����ˢ��
                    doRefresh: function () {
                        $scope.param.startPage = 1;
                        $scope.initData();
                        $scope.$broadcast('scroll.refreshComplete');
                    },
                    hasMore: function () {
                        return $scope.totolPage > $scope.param.startPage;
                    }
                });

                //    �жϴ��Ǹ�ҳ�������������Ӧ��id
                switch (urlParams.type) {
                    //ɾ��
                    case 'brand':
                        $scope.param.brand = [];
                        $scope.param.brand.push({id:urlParams.id});
                        break;
                    //���
                    case 'category':
                        $scope.param.sc = [];
                        $scope.param.sc.push({id:urlParams.id});
                        break;
                    default :
                        console.log('�Ҵ�������'+urlParams.type);
                }
                //if(urlParams.query != '')
                if(urlParams.query != ''){
                    $scope.param.keywords = urlParams.query;
                }
                if(urlParams.brandId){
                    console.log("�����ڷ������--��"+urlParams.typeId);
                    $scope.param.brand = [{id:urlParams.brandId}];
                }
                if(urlParams.typeId){
                    console.log("�����ڷ������--��"+urlParams.typeId);
                    $scope.param.sc = [{id:urlParams.typeId}];
                }


                $scope.initData = function(type){
                    var me = $scope;
                    if(me.param.lowPrice == null) delete me.param.lowPrice;
                    if(me.param.heightPrice == null) delete me.param.heightPrice;
                    if(!me.param.sortField) me.param.sortField = '';var aaa = me.param;

                    ProductListService.productList($scope.param).success(function (data) {
                        if(!data){
                            me.totolPage =0 ;return ;
                        }
                        me.totolPage = data.totolPage ? data.totolPage : 0;
                        if (type) {
                            $scope.productData ? $scope.productData = $scope.productData.concat(data.result) : $scope.productData = data.result;
                        } else {
                            $scope.productData = data.result;
                        }

                    });

                };

                $scope.initData();

                //������
                $scope.getDatas = function (param) {

                    var me = $scope;
                    me.param.sortField = param.sortField;

                    param.sortDir ? me.param.sortDir = param.sortDir : function(){
                        me.param.sortDir ? delete me.param.sortDir : null;
                    }();
                    me.param.startPage = 1;
                    me.initData();
                };
                //�ص�����
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
                    $ionicHistory.goBack();
                };
                //��
                $rootScope.$on('aaa',function(event,data){
                    alert(data.typeId+"aaaa");
                });
                $scope.productList.doInit = function(){
                    alert($scope.productList.typeId);
                }

            },
            link:function($scope, $el, $attrs){
                $rootScope.$on('aaa',function(event,data){
                    alert(data.typeId+"aaaa");
                });
            }
        }
    }
]);


