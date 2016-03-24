/********************************

 creater:haosijia@cdfg.com.cn
 create time:2015/07/31
 describe：绑定html数据.
 modify time:2015/07/31

 ********************************/

cdfgApp.directive('bindHtml', ['$compile','$ionicScrollDelegate',function factory($compile, $ionicScrollDelegate) {
        return {
            restrict: 'A',
            scope: {
                bindHtml: '='
            },
            link: function($scope, $el, $attrs) {
                var listener = $scope.$watch('bindHtml', function() {
                    $el[0].innerHTML = '';
                    if ($scope.bindHtml && $scope.bindHtml.trim()) {
                        $el.append($compile($scope.bindHtml.replace(/&quot;/gm, '"'))($scope));
                    }
                    $ionicScrollDelegate.resize();
                });

                $scope.$on('$destroy', function() {
                    if(listener){
                        listener();
                    }
                });
            }
        };
    }]);

