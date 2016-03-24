/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/06/17
 describe：公用指令
 modify time:

 ********************************/

/* 通过给定属性 cdfg-auto-height="{{5/9}}"  [5/9]长宽比例值和已知宽值计算该元素高度   */
cdfgApp.directive('cdfgAutoHeight', ['$timeout', '$rootScope', function factory($timeout, $rootScope) {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $el, $attrs) {
            var el = $el[0],
                width = el.clientWidth;
            $el.css('height', (width * $attrs.cdfgAutoHeight) + 'px');

            $timeout(setHeight);

            window.addEventListener('resize', setHeight);

            var h = $rootScope.$on('$ionicView.enter', setHeight);

            function setHeight() {
                width = el.clientWidth;
                if (!(el.offsetWidth > 0 && el.offsetHeight > 0)) return;

                $el.css('height', (width * $attrs.cdfgAutoHeight) + 'px');

            }

            $scope.$on('$destroy', function () {
                window.removeEventListener('resize', setHeight);
                h();
            });
        }
    };
}]);

/* 字母索引 */
cdfgApp.directive('cdfgAlphabetTouch', [function factory() {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $el, $attrs) {
            var element = $el[0],
                previousIndex = -1;

            var getNode = function (e) {
                var touch = e.targetTouches[0],
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
                if (curNode) {
                    curNode.className += ' hover';
                    var letterCode = curNode.getAttribute('letter');
                    var target = document.getElementById(letterCode);
                    if (target) {
                        $scope.scrollTo(target.offsetTop);
                    } else {
                        /*ADD START BY 葛硕 20150817:找不到当前索引后，寻找下一个存在的索引--------------------------------------*/
                        var letterId = letterCode.substring(letterCode.length - 1, letterCode.length);//当前字母

                        for (var i = letterId.charCodeAt(0) + 1; i < 91; i++) {
                            //遍历字母集合，向下寻找存在数据的索引
                            var newLetter = String.fromCharCode(i);//unicode转换为字母

                            var newTarget = document.getElementById('brand-' + newLetter);
                            if (newTarget) {
                                //找到索引对应的数据
                                $scope.scrollTo(newTarget.offsetTop);
                                break;
                            }
                        }
                        /*ADD END   BY 葛硕 20150817--------------------------------------*/
                    }
                }
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
}]);

