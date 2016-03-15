/********************************

 creater:maliwei@cdfg.com.cn
 create time:2015/06/17
 describe：公用指令
 modify time:

 ********************************/

/* 通过给定属性 city-auto-height="{{5/9}}"  [5/9]长宽比例值和已知宽值计算该元素高度   */
bomApp.directive('cityAutoHeight', function factory($timeout, $rootScope) {
 return {
  restrict: 'A',
  scope: false,
  link: function($scope, $el, $attrs) {
   var el = $el[0],
       width = el.clientWidth;
   $el.css('height', (width * $attrs.cityAutoHeight)  + 'px');

   $timeout(setHeight);

   window.addEventListener('resize', setHeight);

   var h = $rootScope.$on('$ionicView.enter', setHeight);

   function setHeight() {
    width = el.clientWidth;
    if (!(el.offsetWidth > 0 && el.offsetHeight > 0)) return;

    $el.css('height', (width * $attrs.cityAutoHeight)  + 'px');

   }

   $scope.$on('$destroy', function() {
    window.removeEventListener('resize', setHeight);
    h();
   });
  }
 };
})