/********************************

 creater: xuf
 create time:2015/08/17
 describe：免税店商品分类页

 ********************************/

//免税店分类服务
cdfgApp.factory('ShopCategoryService',['$http','UrlService',function($http,UrlService){
    return {
        //获得一二级分类
        get1And2Type:function(shopId){
            var url = UrlService.getUrl('SHOP_CATEGORY_LIST'),
                params ={'storeId':shopId};
            return $http.get(url,{params:params});
        }

    };
}]);


cdfgApp.directive('cdfgShopCategory',['$http','$stateParams','ShopCategoryService',
    '$ionicHistory','ProductListService','$state','$rootScope',
    function( $http,$stateParams,ShopCategoryService,$ionicHistory,ProductListService,
             $state,$rootScope){
        return{
            restrict:'A',
            replace:false,
            scope:{
                category:'=cdfgShopCategory'
            },
            templateUrl:'templates/shop/shop-category.html',
            controller:function($scope){
                $scope.cListStyle = {height:500};
                $scope.myGoBack = function(){
                    $ionicHistory.goBack();
                };
                //跳转到商品列表
                $scope.goShopProductList = function(tId){
                    clearChecked($scope.categoryList,tId,$scope.all);
                    $state.go('shopProductList',{fromPage:'shopCategory',shopId:$scope.shopId,typeId:tId});
                 //   $rootScope.$broadcast('toShopProductList',{typeId:tId}); //发送广播
                };
                //清空分类中的checked 属性
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
                    if(!stId){//选中的是全部分类
                        all.isChecked = true;
                        return ;
                    }
                    all.isChecked = false;
                }

                //分类列表
                $scope.shopId = 1; //为了 测试 写的shopId
                $scope.shopId= $scope.category.shopId;
                $scope.categoryList = [];
                $scope.all = {//全部分类
                    isChecked:true,
                    id:undefined
                };

                ShopCategoryService.get1And2Type($scope.shopId).then(function(d){
                    $scope.categoryList = d.data;
                    //测试时 将所有一级目录打开
                    for(var i=0;i<$scope.categoryList.length;i++){
                       var sl = $scope.categoryList[i].subList;
                        if(!sl){
                            return ;
                        }
                        for(var sli=0;sli<sl.length;sli++){
                            if(sli%2 == 0){
                                sl[sli].divStyle = 'cdfg-odd-a';
                            }
                            else{
                                sl[sli].divStyle = 'cdfg-even-a';
                            }
                        }
                    }
                });

            },
            link:function($scope, $el, $attrs){
                var divList = angular.element($el);
                divList.css('min-height',400);
            }
        }
    }
]);