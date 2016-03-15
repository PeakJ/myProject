/**
 * Created by 11150421050181 on 2015/8/13.
 */
/*
 * 文件上传和下载
 * 张俊辉
 * 2015-08-13 18:36
 * */
bomApp.factory('FileServices', ['$cordovaFileTransfer', 'UrlService', function ($cordovaFileTransfer, UrlService) {
    //获取服务器地址头部
    var headUrl = UrlService.getUrl();
    return {
        /**
         * 文件下载
         * @param parameter
         * @returns {*}
         */
        download: function (parameter) {
            var url = headUrl + 'bom/a/sys/businesstrip/api/businesstripList?' + parameter;
            //var url = "http://cdn.wall-pix.net/albums/art-space/00030109.jpg";
            var targetPath = cordova.file.documentsDirectory + "testImage.png";
            var trustHosts = true;
            var options = {};
            /**
             * url 服务器的URL下载的文件
             * targetPath 文件系统的URL表示设备上的文件
             * options 可选参数，目前只支持头
             * trustAllHosts 如果设置为真 -接受所有安全证书
             */
            return $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // Error
                }, function (progress) {
                    /*$timeout(function () {
                     $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                     })*/
                });
        },
        /**
         * 文件上传
         * @param parameter
         * @returns {*}
         */
        upload: function (filePath) {
            var trustHosts = true;
            var server = headUrl + "bom/a/sys/file/api/uploadImage";
            var options = {
                //enctype : "multipart/form-data"
            };
            var trustHosts = false;
            /**
             * server 的服务器的URL来接收文件
             * targetPath 文件系统的URL表示设备上的文件
             * options 可选参数
             * trustAllHosts 如果设置为真 -接受所有安全证书
             */
            return $cordovaFileTransfer.upload(server, filePath, options,trustHosts)
                .then(function(object) {
                    var data = object.response;
                    return data;
                }, function(err) {
                    // Error
                }, function (progress) {
                    // constant progress updates
                });
        }
    }
}]);