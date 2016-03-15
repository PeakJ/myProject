/**
 * Created by 11150421050181 on 2015/7/20.
 */
/*
* 配置服务器访问服务
* 张俊辉
* 2015-07-20 14:57
* */
bomApp.service('UrlService', [function () {
    var IP = '121.42.29.151';   //外网IP 提交时不要改成自己的IP
    var PORT = '8080';
    var head = 'http://' + IP + ':' + PORT + '/';
    var project = 'bom';
    this.getUrl = function () {
        return head;
    };
    this.getImageUrl = function (){
        return head + project + "/images/";
    }
}]);
/**
 *配置通用变量
 * 张俊辉
 * 2015-07-29 14:41
 */
bomApp.factory('common',[function(){
    //分页内容数量
    var pageSize = 10;
    return {
        pageSize : function(){
            return pageSize;
        }
    }
}]);