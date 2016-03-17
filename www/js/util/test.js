/**
 * Created by 11150321040171 on 2016/3/15.
 */

//CYXApp.validate ={
//
//  CheckMobile:function(tel){
//    //var tel = document.getElementById('userInfo.phone').value();
//    var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
//    if (reg.test(tel)) {
//      alert("号码正确~");
//    }else{
//      alert("号码有误~");
//    };
//  },
//  checkMail:function(mail){
//
//  },
//  checkOther:function(other){
//
//  }
//
//};

CYXApp.service('ValidateService', ['PopupService', function (PopupService) {
  this.CheckMobile = function (tel) {
    if(tel){
      var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
      if (reg.test(tel)) {
        return true;
      }else{
        PopupService.showMsg('手机号格式不正确');
        return false;
      };
    }else{
      PopupService.showMsg('手机号不能为空');
      return false;
    };
  };
  this.CheckMail = function(mail){
    if(mail){
      var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(filter.test(mail)){
        return true;
      }else{
        PopupService.showMsg('邮箱格式不正确');
        return false;
      };
    }else{
      PopupService.showMsg('邮箱不能为空');
      return false;
    };
  };
  this.CheckAddress = function(address){
    if(address){
      if(address.length == 0){
        PopupService.showMsg('地址不能为空');
        return false;
      }else{
        return true;
      };
    }else{
      PopupService.showMsg('地址不能为空');
      return false;
    };
  };
  this.CheckName = function(name){
    if(name){
      if(name.length == 0){
        PopupService.showMsg('用户名不能为空');
        return false;
      }else{
        return true;
      };
    }else{
      PopupService.showMsg('用户名不能为空');
      return false;
    };
  };
}]);
