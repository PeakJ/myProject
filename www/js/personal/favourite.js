/**
 * Created by ZCP on 2015/7/1.
 * Controller 服务
 */
cdfgApp.controller('FavouriteController', ['$scope', 'FavouriteService', 'PopupService', '$timeout', '$state', '$ionicHistory',
    function ($scope, FavouriteService, PopupService, $timeout, $state, $ionicHistory) {
        /* CHG START BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/
        $scope.goBack = goBack;
        /* CHG END   BY 葛硕20150808：[APP-95] bug:部分标题会显示样式错乱 -------------------------------*/

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });
        //初始化数据
        $scope.init = function (menu) {
            $scope.shelfStatusText = ['上架', '下架', '终止销售', '待上架']
            $scope.index = 1;
            $scope.total = 1;
            $scope.deleteList = [];//删除收藏的容器
            $scope.basicClass = [];//分类列表数据容器
            $scope.productData = [];//收藏的产品信息容器
            $scope.isEditMode = false;
            $scope.modeText = $scope.isEditMode ? '完成' : '编辑';
            $scope.networkError = false;

            // 获取分类列表
            FavouriteService.getBcInfo()
                .success(function (response, status, headers, config) {
                    console.log(response);
                    if (response.code == 1) {
                        $scope.networkError = false;
                        $scope.basicClass = response.data;
                        var total = 0;
                        for (var i = 0; i < $scope.basicClass.length; i++) {
                            total = total + $scope.basicClass[i].count;
                        }
                        var all = {
                            scName: '全部分类',
                            scId: '',
                            count: total
                        };
                        $scope.basicClass.unshift(all);
                        console.log($scope.hasMore());
                        console.log($scope.total);
                        console.log($scope.productData.length);
                        $scope.loadMore();

                    } else {
                        $scope.networkError = true;
                        $scope.total = 0;
                    }
                });

            if (menu) {
                $scope.menu = menu;
            } else {
                $scope.menu = {
                    showMenu: false,
                    currentClassId: '',
                    currentClassName: '全部分类'
                };
            }
        };

        //点击收藏产品
        $scope.clickFavourite = function (item) {
            if ($scope.isEditMode) {
                item.isSelected = !item.isSelected;
                console.log(item);
            } else {
                if (item.shelfStatus == 1) {
                    $state.go('product.detail', {type: 'sku', id: item.skuId});
                } else if (item.shelfStatus == 2) {
                    PopupService.alertPopup('提示', '来晚了，此商品已下架。');
                } else if (item.shelfStatus == 3) {
                    PopupService.alertPopup('提示', '很遗憾，此商品已终止销售。');
                } else if (item.shelfStatus == 4) {
                    PopupService.alertPopup('提示', '此商品已还未上架，请耐心等待');
                }
            }
        };

        //选择筛选目录
        $scope.selectClass = function (clazz) {
            $scope.menu.currentClassId = clazz.scId;
            $scope.menu.currentClassName = clazz.scName;
            $scope.menu.showMenu = false;
            $scope.init($scope.menu);
        };
        //编辑状态切换
        $scope.triggerEdit = function () {
            $scope.isEditMode = !$scope.isEditMode;
            $scope.modeText = $scope.isEditMode ? '完成' : '编辑';
            $scope.menu.showMenu = false;
            console.log($scope.isEditMode);
        };
        //开关menu菜单显示/隐藏
        $scope.triggerMenu = function () {
            $scope.menu.showMenu = !$scope.menu.showMenu;
        };
        //删除收藏
        $scope.deleteFavouriteList = function () {
            // 获取分类列表
            var paramId = [];
            for (var i = 0; i < $scope.productData.length; i++) {
                if ($scope.productData[i].isSelected) {
                    paramId.push($scope.productData[i].id);
                }
            }
            if (paramId.length > 0) {
                FavouriteService.delFavorite(paramId)
                    .success(function (response, status, headers, config) {
                        console.log(response);
                        if (response.code == 1) {
                            $scope.init();
                        }
                    })
            }
        };

        $scope.hasMore = function () {
            console.log('$scope.total' + $scope.total);
            console.log($scope.productData.length);
            return ($scope.total > $scope.productData.length);
        };
        //上拉加载
        $scope.loadMore = function () {
            console.log('loading......');
            if ($scope.hasMore) {
                // 获取分类列表
                $timeout(function () {
                    FavouriteService.getAllFavorite($scope.index, $scope.menu.currentClassId)
                        .success(function (response, status, headers, config) {

                            console.log(response);
                            console.log('loading complete......');
                            if (response.code == 1) {
                                var temp = response.data.result;//拿到数组
                                temp = formatArray(temp);//给数组的每个成员添加isSelected属性
                                $scope.productData = $scope.productData.concat(temp);

                                $scope.total = response.data.totalRecord;
                                $scope.index = $scope.index + 1;
                                $scope.$broadcast('scroll.infiniteScrollComplete');

                                console.log($scope.total);
                                console.log($scope.productData.length);
                            }
                        })

                }, 500);

            }
        };
        //下拉刷新
        $scope.doRefresh = function () {
            $scope.init($scope.menu);
            $scope.$broadcast('scroll.refreshComplete');
        };

        var formatArray = function (localArray) {
            for (var i = 0; i < localArray.length; i++) {
                var temp = localArray[i];
                temp.isSelected = false;
            }
            return localArray;
        };

        //返回上一页
        function goBack() {
            $ionicHistory.goBack();
        }

    }]);

/**
 * Service 服务
 * Created by ZCP on 2015/7/1.
 */
cdfgApp.service('FavouriteService', ['UrlService', '$http', function (UrlService, $http) {

    //获取用户收藏数据
    this.getAllFavorite = function (index, scId) {
        var param = {
            pageNo: index,
            pageSize: CDFG_PAGE_SIZE,
            scId: scId
        };
        return $http.post(UrlService.getUrl('PERSONAL_FAVOURITE_LIST'), param)
    };
    //获取用户收藏种类
    this.getBcInfo = function () {
        return $http.post(UrlService.getUrl('PERSONAL_FAVOURITE_KIND'))
    };
    //删除用户收藏数据
    this.delFavorite = function (list) {
        var params = {
            favId: list
        };
        return $http.post(UrlService.getUrl('PERSONAL_FAVOURITE_DELETE'), params)
    };
}]);

/**
 * Service 指令
 * Created by ZCP on 2015/7/1.
 */

/**
 * 用于获取img的loaded事件。并添加loaded=true属性到scope上
 */
cdfgApp.directive('imgloaded', function () {
    return {
        link: function (scope, element, attrs) {

            element.bind("load", function (e) {
                // success, "onload" catched
                // now we can do specific stuff:
                scope.$parent.imgloaded = true;
                console.log(1111);
            });
        },
        priority: 500
    }
});
