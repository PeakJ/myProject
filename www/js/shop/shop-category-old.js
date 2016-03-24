//��˰����Ʒ����controller
cdfgApp.controller('ShopCategoryController',['$scope', '$http','$stateParams','ShopCategoryService',
    '$ionicHistory','ProductListService','$state',
    'PopupService','$ionicViewSwitcher','StyleConfig','StyleForPlatform','LocalCacheService','SearchService',
    function($scope, $http,$stateParams,ShopCategoryService,$ionicHistory,ProductListService,
             $state,PopupService,$ionicViewSwitcher,StyleConfig,StyleForPlatform,LocalCacheService,SearchService){

        $scope.myGoBack = function(){
            $ionicHistory.goBack();
        };

        $scope.goShopProductList = function(tId){
            clearChecked($scope.categoryList,tId,$scope.all);
            $state.go('shopProductList',{fromPage:'shopCategory',shopId:$scope.shopId,typeId:tId});
        };
        //��շ����е�checked ����
        function clearChecked(list,stId,all){
            if(list&& list.length>0){
                for(var i=0;i<list.length;i++){
                    var firstType = list[i];
                    for(var j=0;j<firstType.subList.length;j++){
                        if(firstType.subList[j].id!=stId){
                            firstType.subList[j].isChecked =false;
                        }
                    }
                }
            }
            if(!stId){//ѡ�е���ȫ������
                all.isChecked = true;
                return ;
            }
            all.isChecked = false;
        }

        //����ָ�������
        $scope.query = {tag:'',
            isShowSearch:false,
            hasPopularDiv:false,
            hasHistoryDiv:false,
            shopId:$stateParams.id, //·���е�id ��shopId
            urlParam:{
                shopId:$stateParams.shopId
            },
            varInDirective:{
                shopId:$stateParams.shopId
            },
            goTo:'shopProductList'
        };
        $scope.shopHeader = {top:44,width:'100%'};
        $scope.shopContent = {top:296};

        $scope.showSearch = function(){
            $scope.query.isShowSearch = true;
        };

        //�����б�
        $scope.shopId = 1;
        $scope.categoryList = [];
        $scope.all = {//ȫ������
            isChecked:true,
            id:undefined
        };

        ShopCategoryService.get1And2Type($scope.shopId).then(function(d){
            $scope.categoryList = d.data;
            //����ʱ ������һ��Ŀ¼��
            for(var i=0;i<$scope.categoryList.length;i++){
                $scope.categoryList[i].isExpanded = false;
            }
        });
    }]);