/**
 * Created by 11150421050181 on 2015/7/23.
 */
/**
 *出差计划
 * 张俊辉
 * 2015-07-23 10:50
 */

/* 字母索引 */
bomApp.directive('cityAlphabetTouch', function factory() {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $el, $attrs) {
            var element = $el[0],
                previousIndex = -1;
            var getNode = function (e) {
                var touch = e.originalEvent.targetTouches[0],
                    x = touch.pageX - element.offsetLeft,
                    y = touch.pageY - element.offsetTop;
                if (x < 0 || x > element.clientWidth || y < 0 || y >= element.clientHeight) {
                    return;
                }

                var nodes = element.querySelectorAll('li'),
                    index = Math.floor(y / nodes[0].clientHeight);

                if (previousIndex === index) {
                    return null;
                }
                previousIndex = index;
                return nodes[index];
            };

            $el.on('touchmove', function (e) {
                var curNode = getNode(e);

                if (!curNode) {
                    return;
                }

                var preNode = this.querySelector('li.hover'),
                    target = document.getElementById(curNode.getAttribute('letter'));

                if (preNode) {
                    (preNode.className = preNode.className.replace(/ hover/g, ''));
                }
                curNode.className += ' hover';
                $scope.scrollTo(target.offsetTop);
                e.preventDefault();
            });

            $el.on('touchstart', function (e) {
                var curNode = getNode(e);
                if(curNode){
                    curNode.className += ' hover';
                    var target = document.getElementById(curNode.getAttribute('letter'));
                    $scope.scrollTo(target.offsetTop);
                };
                e.preventDefault();
            });

            $el.on('touchend', function (e) {
                var preNode = this.querySelector('li.hover');
                if (preNode) {
                    (preNode.className = preNode.className.replace(/ hover/g, ''));
                }
                previousIndex = -1;
                e.preventDefault();
            });
        }
    };
});


bomApp.controller('businessTripAddPlanCityCtrl', ['$scope', '$ionicScrollDelegate','loadingUtil', '$stateParams', 'cityServices', '$state', '$ionicHistory', '$ionicViewSwitcher',
    function ($scope, $ionicScrollDelegate,loadingUtil, $stateParams, cityServices, $state, $ionicHistory, $ionicViewSwitcher) {
        $scope.whichTab = $stateParams.whichTab;
        $scope.whichPlace = $stateParams.whichPlace;
        $scope.planId = $stateParams.planId;
        $scope.isShowHot = true;
        $scope.isShowHistory = false;
        $scope.repeatSearch = false;
        $scope.isLocationHistory = false;
        $scope.cityHistory = [];
        $scope.cityList = [];
        $scope.city = {
            id: '',
            name: ''
        };
        $scope.cityListLetter = [];
        $scope.pageContent = {
            search: '',
            location: ''
        }

        //字母索引
        var scroll = $ionicScrollDelegate.$getByHandle('city-scroll');
        $scope.scrollTo = function (top) {
            scroll.scrollTo(0, top, true);
        };

        var oy,
            cityAlphabet = document.getElementById('city-alphabet'),    //屏幕右側字母索引表
            cityMenu = document.getElementById('city-menu');    //城市列表

        angular.extend($scope, {
            //滑动 “全部品牌” 控制scrollTo
            scrollSwipeUp : function($event){
                oy = cityMenu.offsetTop;
                $scope.scrollTo(oy);
                cityAlphabet.style.opacity = 1;
            },
            scrollSwipeDown : function($event){
                $scope.scrollTo(0);
                cityAlphabet.style.opacity = 0;
            },
            //索引菜单显示与隐藏
            alphabetHide : function($event){
                cityAlphabet.style.opacity = 0;
            },
            alphabetShow : function($event){
                cityAlphabet.style.opacity = 1;
            }
        });


        //定位服务
        var latestLocation = cityServices.getLocation('locationHistory'); //获得历史位置
        if (latestLocation != '' && latestLocation != undefined && latestLocation != null) {    //有历史位置
            $scope.isLocationHistory = true;
            var latestLocationCity = cityServices.getLocationCity('locationCity');
            var strLocation = latestLocation.substring(0, latestLocation.length);
            var locationArray = strLocation.split(',');
        }
        if(latestLocationCity){
            $scope.pageContent.location = latestLocationCity;
        }else{
            $scope.pageContent.location = '定位中...';
        }

        // 百度地图API功能
        //var map = new BMap.Map("allmap");
        //map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        //map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
        //if ($scope.isLocationHistory) {
        //    var point = new BMap.Point(locationArray[0], locationArray[1]);
        //    map.centerAndZoom(point, 10);
        //} else {
        //    var point = new BMap.Point(116.331398, 39.897445);
        //    map.centerAndZoom(point, 1);
        //}
        //var geoc = new BMap.Geocoder();
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                //var mk = new BMap.Marker(r.point);
                var gc = new BMap.Geocoder();
                //map.addOverlay(mk);
                //map.panTo(r.point);
                var point = new BMap.Point(r.point.lng, r.point.lat);
                gc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $scope.pageContent.location = addComp.city.toString().substring(0,2);
                    $('#currentLocation').text($scope.pageContent.location);
                    //$scope.pageContent.location = addComp.city; //双向绑定不能执行，原因是，此处是jquery代码区
                    //map.centerAndZoom(point, 10);
                    cityServices.setLocation(r.point.lng.toString() + ',' + r.point.lat.toString());
                    cityServices.setLocationCity($scope.pageContent.location);
                    //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                });
            }
            else {
                $('#currentLocation').text('定位失败，请稍后重试');
            }
        }, {enableHighAccuracy: true})
        //关于状态码
        //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
        //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
        //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
        //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
        //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
        //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
        //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
        //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
        //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)

        //获得搜索历史
        var history = cityServices.getHistory();
        if (history != '' && history != undefined && history != null) {         //有搜索历史
            var strHistory = history.substring(0, history.length);
            var historyArray = strHistory.split(',');
            for (var i = 0; i < historyArray.length; i++) {
                $scope.cityHistory.push(historyArray[i]);
            }

            $scope.isShowHistory = true;
        } else {
            $scope.cityHistory = [];
        }

        $scope.searchHistoryAdd = function () {   //设置搜索历史,判断历史存储容量为5条数据的情况
            var searchContent = $scope.pageContent.search;
            if ($scope.cityHistory.length == 5) {
                for (var j = 0; j < $scope.cityHistory.length; j++) { //判断是否重复
                    if ($scope.cityHistory[j] == searchContent) {
                        $scope.changeOrder(j, searchContent);
                        $scope.repeatSearch = true;
                        break;
                    }
                }
                if ($scope.repeatSearch == false) {
                    for (var i = $scope.cityHistory.length - 1; i > 0; i--) {   //若为5条，前四位后移，第一位改为最新搜索
                        $scope.cityHistory[i] = $scope.cityHistory[i - 1]
                    }
                    $scope.cityHistory[0] = searchContent;
                }

            } else {
                for (var j = 0; j < $scope.cityHistory.length; j++) { //判断是否重复
                    if ($scope.cityHistory[j] == searchContent) {
                        $scope.changeOrder(j, $scope.cityHistory[j]);
                        $scope.repeatSearch = true;
                        break;
                    }
                }
                if ($scope.repeatSearch == false) {   //不满5条，没有重复搜索，继续存储
                    $scope.cityHistory.push(
                        searchContent
                    );
                }
            }
            cityServices.setHistory($scope.cityHistory);    //存入localstorage
        }

        loadingUtil.showLoading('加载中');
        cityServices.getCity().then(function (data) {
            for (var i = 0; i < data.city.length; i++) {
                $scope.cityList.push({
                    letter: data.city[i].letter,
                    ifStater: true
                })
                for (var j = 0; j < data.city[i].content.length; j++) {
                    $scope.cityList.push({
                        id: data.city[i].content[j].id,
                        name: data.city[i].content[j].name,
                        ifStater: false
                    })
                }
            }

        })
        cityServices.getCityLetter().then(function (data) {
            for (var i = 0; i < data.cityListLetter.length; i++) {
                $scope.cityListLetter.push({
                    letter: data.cityListLetter[i].letter
                })
            }

        })
        loadingUtil.hide();
        $scope.changeOrder = function (order, repeatValue) {    //搜索重复时，优先级变为第一
            var temp = [];
            var j = 0;
            for (var i = 0; i < $scope.cityHistory.length; i++) {
                if (i == order) {
                    continue;
                }
                temp[j] = $scope.cityHistory[i];
                j++;
            }
            for (var i = 0; i < temp.length; i++) {
                $scope.cityHistory[i + 1] = temp[i];
            }
            $scope.cityHistory[0] = repeatValue;
        }

        $scope.historySearch = function (cityName) { //使用最近搜索或地理位置进行搜索
            if(cityName != '定位中...' && cityName != '' && cityName != undefined && cityName != null){
                $scope.pageContent.search = cityName;
                $scope.city = $scope.pageContent.search;
                $scope.isShowHot = false;
            }
        }

        $scope.changeDetection = function () { //监视搜索栏是否启用
            //if ($scope.pageContent.search != '' && $scope.pageContent.search != undefined && $scope.pageContent.search != null) {
            $scope.isShowHot = false;
            //} else {
            //    $scope.isShowHot = true;
            //}
            $scope.city = $scope.pageContent.search;
        }

        $scope.cleanSearch = function () { //清空搜索框
            $scope.pageContent.search = '';
            $scope.city = $scope.pageContent.search;
        }

        $scope.cancelSearch = function () { //取消搜索
            $scope.pageContent.search = '';
            $scope.city = $scope.pageContent.search;
            $scope.isShowHot = true;
        }

        $scope.cleanHistory = function () {   //清空历史搜索
            cityServices.setHistory('');
            $scope.cityHistory = [];
            $scope.isShowHistory = false;
        }

        $scope.backToPlan = function (paramId, paramName) {     //选择城市后返回
            if ($scope.isShowHot == false) {
                $scope.searchHistoryAdd();
            }

            $state.go('businessTripAddPlan', {
                whichTab: $scope.whichTab,
                whichPlace: $scope.whichPlace,
                cityId: paramId,
                cityName: paramName,
                planId: $scope.planId
            });
            $scope.clearCityPage();
        };

        $scope.backDirect = function () {   //直接点返回键
            $state.go('businessTripAddPlan', {
                whichTab: $scope.whichTab,
                whichPlace: $scope.whichPlace,
                cityId: '',
                cityName: ''
            });
            $scope.clearCityPage();
        };

        $scope.clearCityPage = function () {  //清空页面数据
            $scope.pageContent.search = '';
            $scope.city = $scope.pageContent.search;
            $scope.isShowHot = true;
            $scope.isShowHistory = false;
            $scope.repeatSearch = false;
            $scope.pageContent.location = '';   //用户短时间内不会换城市
            $scope.isLocationHistory = false;
        }

        /*返回上一页*/
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.goBack();
        };
    }]);