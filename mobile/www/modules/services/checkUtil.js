/**
 * Created by 11150421050181 on 2015/7/28.
 */

bomApp.factory('checkUtil',['$ionicPopup',function($ionicPopup){
    return {
        //弹出警告对话框
        f_alert_test : function(alertInfo){
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template: alertInfo
            });
        },
        f_alert : function(obj,alertInfo){
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template: obj + alertInfo
            });
        },
        //判断是否为汉字
        f_check_chinese:function(obj){
            if (! /^[\u4e00-\u9fa5]+$/.test(obj)){
                return false;
            }else{
                return true;
            }

        },
        //判断是否为数字和字母的集合
        f_check_numberletter:function(obj){
            if (!/^[A-Za-z0-9]+$/.test( obj )){
                return false;
            }else{
                return true;
            }
        },
        //判断是否为实数
        f_check_float:function(obj){
            if(!/^(\+|-)?\d+($|\.\d+$)/.test( obj )){
                return false;
            }else{
                return true;
            }
        },
        //判断是否为空
        f_check_empty:function(obj){
            if(obj==null||obj==""){
                return false;
            }else{
                return true;
            }
        },
        //判断为数字且在1-10之间
        f_check_numberlimit:function(obj){
            if(!/^(\d(\.\d{1,2})?|10)$/.test(obj)){
                return false;
            }else{
                return true;
            }
        },
        //判断项目是否为空
        f_check_project_empty:function(obj){
            if(obj==null||obj==""){
                this.f_alert_test("请选择项目");
                return false;
            }else{
                return true;
            }
        },
        //判断出差时间是否为空
        f_check_date_empty:function(obj){
            if(obj==null||obj==""){
                this.f_alert_test("请选择出差时间");
                return false;
            }else{
                return true;
            }
        },
        //判断出差事由是否为空
        f_check_applyReason_empty:function(obj){
            if(obj==null||obj==""){
                this.f_alert_test("请输入出差事由");
                return false;
            }else{
                return true;
            }
        },
        //判断住宿是否为空
        f_check_stayType_empty:function(obj){
            if(obj==null||obj==""){
                this.f_alert_test("请选择住宿");
                return false;
            }else{
                return true;
            }
        },
        //判断住宿费用是否为数字
        f_check_stayCost:function(obj){
            if(!/^(\+|-)?\d+($|\.\d+$)/.test( obj )){
                this.f_alert_test("请输入住宿费用");
                return false;
            }else{
                return true;
            }
        },
        //判断是否为空
        f_check_empty_no:function(obj){
            if(obj==null||obj==""){
                return false;
            }else{
                return true;
            }
        },
    }
}]);