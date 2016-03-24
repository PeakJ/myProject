/**
 * 动态获取启动画面
 *
 * BY 葛硕 20150825
 *
 * */
cdfgApp.controller('SplashController', ['$scope', '$http', 'UrlService', 'LocalCacheService', '$timeout', '$state',
    '$ionicViewSwitcher',
    function ($scope, $http, UrlService, LocalCacheService, $timeout, $state, $ionicViewSwitcher) {
        var originAutoPlay = false;//从服务器取得的自动播放标志位
        var canSwipeToHome = false;//是否可以滑动到首页
        var timeObject = null;

        $scope.SLIDE_INTERVAL = 1500;//自动播放间隔
        $scope.autoPlay = false;// 是否自动播放
        $scope.slideLocal = slideLocal;//页面滑动监听--本地欢迎页面
        $scope.slideContent = slideContent;//页面滑动监听--服务器取得页面
        $scope.setAutoPlay = setAutoPlay;//设置自动播放
        $scope.swipeLeft = swipeLeft;//向左滑动
        $scope.swipeLocalLeft = swipeLocalLeft;//本地欢迎页面，向左滑动
        $scope.clickLocalPage = clickLocalPage;//点击欢迎页面

        $scope.showLocal = false;//显示本地欢迎页面
        $scope.localImages = ['img/splash01.jpg', 'img/splash02.jpg',
            'img/splash03.jpg', 'img/splash04.jpg'];//欢迎页面数组
        $scope.pageData = {
            pageIndex: 0,
            localIndex: 0
        };


        loadData();
        /*加载页面初始数据*/
        function loadData() {
            console.log(LocalCacheService.getObject('splash'));
            if (LocalCacheService.get('hasHistory', false)) {//查询本地是否有使用记录
                var dataObject = LocalCacheService.getObject('splash');
                if (!dataObject || !dataObject.data) {
                    $http.post(UrlService.getUrl('GET_SPLASH')).success(function (response) {
                        console.log('获取广告画面---' + JSON.stringify(response));
                        if (response.code == 1) {
                            LocalCacheService.setObject('splash', response);
                            parseData(response, true);
                        } else {
                            //获取出现错误时直接跳转到首页
                            console.log('获取引导页面失败---');
                            $state.go('home');
                        }
                    }).error(function () {
                        //获取出现错误时直接跳转到首页
                        console.log('获取引导页面失败---');
                        $state.go('home');
                    });
                } else {
                    parseData(dataObject);
                }
            } else {
                $scope.showLocal = true;
                LocalCacheService.set('hasHistory', true);
            }
        }

        /*本地页面--滑动监听*/
        function slideLocal(index) {

        }

        /*服务器取得页面--滑动监听*/
        function slideContent(index) {
            console.log('index = ' + index);

            if (!originAutoPlay) {
                //如果不是自动播放，不处理
                return;
            }
            console.log('$timeout---originAutoPlay = ' + originAutoPlay);
            if (index == $scope.contentPages.length - 1) {
                //当前处于最后一页，自动跳转到首页
                timeObject = $timeout(function () {
                    if ($scope.pageData.pageIndex == $scope.contentPages.length - 1) {
                        goHome();
                    }
                }, $scope.SLIDE_INTERVAL);
            }
        }

        /*解析数据*/
        function parseData(splashData, fromRequest) {
            var data = splashData.data;
            var contents;
            for (var i = 0, len = data.length; i < len; i++) {
                var splashItem = data[i];
                if (compareTime(getNowFormatDate(), splashItem.bdate) == 1 &&
                    compareTime(getNowFormatDate(), splashItem.edate) == -1) {
                //if (splashItem.id == 37) {//debug用
                    originAutoPlay = (splashItem.transition == 0);
                    $scope.autoPlay = originAutoPlay;//0 自动切换 1自定义切换
                    contents = splashItem.contents;
                    break;
                }
            }
            if (contents) {
                $scope.contentPages = contents;
                console.log(JSON.stringify($scope.contentPages) + '  autoPlay == ' + $scope.autoPlay);
                if (contents.length == 1 && $scope.autoPlay) {
                    //只有一个页面，且为自动播放时
                    timeObject = $timeout(function () {
                        goHome();
                    }, $scope.SLIDE_INTERVAL);
                }
            } else {
                if (fromRequest) {
                    //从服务器取得，没有有效数据
                    return;
                }
                //从本地取得数据无效时（没有符合当前日期的数据），从服务器获取
                loadData();
            }
        }


        /*设置自动播放*/
        function setAutoPlay(isAutoPlay) {
            if (!originAutoPlay) {
                //服务器返回的标志位，不自动播放
                return;
            }
            $scope.autoPlay = isAutoPlay;//设置自动播放标志，用户手指触摸屏幕是停止自动播放
            if (timeObject) {
                //取消定时器
                $timeout.cancel(timeObject);
            }

            if ($scope.autoPlay && $scope.pageData.pageIndex == $scope.contentPages.length - 1) {
                //如果当前处于最后一页，则跳转到首页
                slideContent($scope.pageData.pageIndex);
            }
        }

        /*向左滑动*/
        function swipeLeft() {
            console.log('swipeLeft---');
            if ($scope.pageData.pageIndex == $scope.contentPages.length - 1) {
                if (canSwipeToHome || $scope.contentPages.length == 1) {
                    //如果当前处于最后一页，则跳转到首页
                    goHome();
                }
                canSwipeToHome = true;
            } else {
                canSwipeToHome = false;
            }
        }

        /*本地欢迎页面向左滑动*/
        function swipeLocalLeft() {
            console.log('swipeLocalLeft---');
            if ($scope.pageData.localIndex == $scope.localImages.length - 1) {
                if (canSwipeToHome || $scope.localImages.length == 1) {
                    //如果当前处于最后一页，则跳转到首页
                    goHome();
                }
                canSwipeToHome = true;
            } else {
                canSwipeToHome = false;
            }
        }

        /* *
         * 时间比较
         * 入参格式：(yyyy-mm-dd hh:mi:ss)
         *
         * 返回参数 -1：第二个时间大
         *          0：相等
         *          1：第一个时间大
         * */
        function compareTime(beginTime, endTime) {
            var beginTimes = beginTime.substring(0, 10).split('-');
            var endTimes = endTime.substring(0, 10).split('-');

            beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
            endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);

            var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
            if (a < 0) {
                //beginTime大
                return 1;
            } else {
                //endTime大
                return -1;
            }
        }

        /* *
         * 获取当前时间
         * 返回参数格式：yyyy-MM-dd HH:mm:ss
         * */
        function getNowFormatDate() {
            var date = new Date();
            var separator1 = "-";
            var separator2 = ":";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;//月份加1处理
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }

            return year + separator1 + month + separator1 + strDate
                + " " + date.getHours() + separator2 + date.getMinutes()
                + separator2 + date.getSeconds();
        }

        /*返回首页*/
        function goHome() {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('home');
        }

        /*点击欢迎页面*/
        function clickLocalPage(index){
            if(index == $scope.localImages.length - 1){
                goHome();
            }
        }

    }]);