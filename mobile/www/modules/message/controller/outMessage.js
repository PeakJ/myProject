/**
 * Created by chenjie on 15/8/11.
 */
bomApp.controller("outMessageCtrl",['$scope','outMessageService','setMessageReadService','userService','$state','messageState','loadingUtil','UrlService','checkUtil',
    function($scope,outMessageService,setMessageReadService,userService,$state,messageState,loadingUtil,UrlService,checkUtil){
        var userId = userService.getUserId();
        var parameter = "userId=" + userId;
        $scope.message = [];
        loadingUtil.showLoading('加载中');
        outMessageService.get(parameter).then(function(data){
            console.log(data);
            for(var i=0 ; i<data.messages.length ;i++){
                var css = {};
                var recordId ='';
                var readFlag = '';
                var photo = '';
                for(var j=0 ; j<data.messageRecords.length;j++){
                    if(data.messages[i].id == data.messageRecords[j].sysMessageId ){
                        if( data.messageRecords[j].readFlag == '1'){
                            css = {color:'#666'};
                        }
                        recordId = data.messageRecords[j].id;
                        readFlag = data.messageRecords[j].readFlag;

                        if (!checkUtil.f_check_empty_no(data.user[j].photo)) {
                            photo = 'img/user-logo.png';
                        } else {
                            //photo = UrlService.getImageUrl() + data.user[j].photo;
                            photo = 'http://121.42.29.151:8080/bom/images/' + data.user[j].photo;
                        }

                        break;
                    }
                }
                $scope.message.push({
                    type : data.messages[i].type,
                    title : data.messages[i].title,
                    content : data.messages[i].content,
                    createDate : data.messages[i].createDate,
                    files : data.messages[i].files,
                    id : data.messageRecords[i].id,
                    css : css,
                    recordId : recordId,
                    readFlag :  readFlag,
                    photo : photo
                });
            }
            loadingUtil.hide();
        });

        $scope.goUrl = function(type,files,recordId){
            console.log(type+"::"+files+"::"+recordId);
            setMessageReadService.get("recordId="+recordId).then(function(data){
            });
            messageState.url(type,files);
        }
    }]);