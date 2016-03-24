/********************************

 creater:maliwei@cdfg.com.cn
 create time:2015/06/17
 describe：公用过滤器
 modify time:

 ********************************/
//图片地址过滤器 参数 wh为已;分割的宽高尺寸，比如10;10，是宽10高10
cdfgApp.filter('imgUrlFilter', function () {
 return function (value,wh) {
  if(!value){
   return 'img/10x10.png'
  }
     //图片地址
  var pic=CDFG_IP_IMAGE+value;
   if(wh){
     var size=wh.split(';');

            pic += '&op=s1_w' + size[0] + '_h' + size[1] + '_e1-c0_x0_y0_w' + size[0] + '_h' + size[1];
        }
        return pic;
    }
})
    .filter('UserPhotoFilter', function () {
        return function (value, wh) {
            if (!value) {
                return 'img/photo.png'
            }
            var pic = CDFG_IP_IMAGE + value;
            if (wh) {
                var size = wh.split(';');

                pic += '&op=s1_w' + size[0] + '_h' + size[1] + '_e1-c0_x0_y0_w' + size[0] + '_h' + size[1];
            }
            return pic;
        }
    });

