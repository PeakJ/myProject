/**
 * Created by xuzunyuan on 2015/7/29.
 */

/*接口地址管理 */
cdfgApp.service('UrlService', [function () {

    var app = '';
    //通用接口地址
    var head = 'http://' + CDFG_IP_SERVER + ':' + CDFG_PORT_SERVER + '/' + app;
    //支付接口地址
    var head_pay=CDFG_IP_PAY_SERVER;
    //图片地址
    var imageHead = 'http://' + CDFG_IP_IMAGE_SERVER + '/';

    var urls = {
        /*ADD START BY 葛硕 20150825：欢迎页面/广告页面--------------------------------------------*/
        GET_SPLASH: head + 'guide/usable',
        /*ADD END   BY 葛硕 20150825：欢迎页面/广告页面--------------------------------------------*/
        HOME_LAYOUT: head + 'cmsIndex',
        //提交订单
        SUBMIT_ORDER: head + 'my/order/add',
        //登录
        LOGIN: head + 'doLogin',
        LOGIN_SEND_SMS: head + 'findPwd/sendSMS',
        LOGIN_SEND_MAIL: head + 'findPwd/sendMail',
        LOGIN_FIND_PASSWORD: head + 'findPwd/findPwd',
        LOGIN_CHECK_SMS: head + 'findPwd/validSMSCode',

        //检测用户登录
        LOGIN_STATUS: head + 'my/user/loginStatus',
        GET_VERIFICATION_CODE: head + 'login/getVerificationCode',
        //获取购物车数量
        GET_CART_COUNT:head + 'my/cart/getCount',
        //购物车
        ADD_CART: head + 'my/cart/addCart',
        GET_CART: head + 'my/cart/getCartItems',
        GET_CART_UNLOGIN: head + 'cart/getCartItems',
        DELETE_CART: head + 'my/cart/delCart',
        CHANGE_CART: head + 'my/cart/modCartQuantity',
        ADD_FAVORATE: head + 'my/userFavorite/addFavorite',
        //批量加入收藏
        ADD_FAVORATE_BY_LIST: head + 'my/userFavorite/addFavoriteByList',

        GET_FEE: head + 'freight/fee',

        GET_CART_PROMOTION: head + 'prom/findUsable',
        CALC_PROMOTION: head + 'prom/calcPromotion',
        //计算购物车活动

        PAY_REQUEST: head_pay+'1/payRequest?',
        PAY_QUERY: head_pay+'1/payQuery',
        GET_DEFAULT_ADDRESS: head + 'my/userAddr/getDefaultAddr',

        GET_ORDER_INFO: head + 'my/order/pay',
        //可用优惠券列表
        GET_Useable_coupon: head + 'my/coupon/findUsable',
        //使用优惠券
        Use_coupon: head + 'my/coupon/calc',

        //优惠券个数
        GET_SUMMARY: head + 'my/coupon/getSummary',
        //中免卡余额
        GET_BALANCE: head + 'my/zmCard/getBalance',
        //支付密码验证
        VALID_PAY_PWD:head + 'my/zmCard/validPayPwd',
        //绑定优惠券
        BIND_ACTIVATE: head + 'my/coupon/activate',
        //商品列表页
        PRODUCT_LIST: head + 'prod/list',
        //商品详情
        PRODUCT_INFO: head + 'prod/info',
        GET_FAV_BY_SKU: head + 'my/userFavorite/getFavBySku',
        ADD_FAVORITE: head + 'my/userFavorite/addFavorite',
        DEL_FAVORITE: head + 'my/userFavorite/delFavorite',
        BRAND_STORY: head + 'brand/story',
        MAINTAIN_EXPLAIN: head + 'prod/maintAck',
        COMMENT_SUMMARY: head + 'comment/summary',
        COMMENT_GET: head + 'comment/get',
        //注册
        UNIQUE_MOBILE: head + 'register/uniqueMobile',
        SEND_SMS: head + 'register/sendSMS',
        VALID_CODE: head + 'register/validCode',
        DO_REGISTER: head + 'register/doRegister',
        CHECK_INVITATION_CODE: head + 'register/checkInvitationCode',
        GET_PROTOCOL: head + 'resource/userProtocol.html',

        //个人信息设置
        PERSONAL_FRONT_PAGE: head + 'my/order/statistic',
        PERSONAL_ORDER_STATUS: head + 'my/user/getUserInfo',
        PERSONAL_FEEDBACK: head + 'my/feedback/add',
        PERSONAL_MESSAGE_LIST: head + 'my/msg/getMsg',
        PERSONAL_MESSAGE_READ: head + 'my/msg/update2Readed',
        PERSONAL_FAVOURITE_LIST: head + 'my/userFavorite/getAllFavorite',
        PERSONAL_FAVOURITE_KIND: head + 'my/userFavorite/getBcInfo',
        PERSONAL_FAVOURITE_DELETE: head + 'my/userFavorite/delFavorite',
        ACCOUNT_REFLASH_INFO: head + 'my/user/getUserInfo',
        ACCOUNT_UPDATE_INFO: head + 'my/user/updateInfo',
        ACCOUNT_IMG_UPLOAD: imageHead + 'img/rc/upload',
        GET_ALL_FAVORITE: head + 'my/userFavorite/getAllFavorite',


        //地址管理增删改查
        ADDRESS_LIST: head + 'my/userAddr/getAllAddr',
        ADDRESS_DEFAULT: head + 'my/userAddr/setDefaultAddr',
        ADDRESS_SAVE_UPDATE: head + 'my/userAddr/saveOrUpdateAddr',
        ADDRESS_DELETE: head + 'my/userAddr/delUserAddr',
        BRAND: head + 'brand/list',

        //账户安全
        SECURITY_PASSWORD_GETVALIDATEPHONE: head + 'my/user/sendChangePwdSMS',
        SECURITY_PASSWORD_GETVALIDATEEMAIL: head + '/my/user/sendChangePwdMail',
        SECURITY_PASSWORD_PHONEEMAIL: head + 'my/user/getSecurityInfo',
        SECURITY_PASSWORD_VALIDATE: head + 'my/user/validateChangePwdSMSCode',
        SECURITY_PASSWORD_SAVE: head + 'my/user/changePwd',
        SECURITY_VALIDATION_GETCODE: head + 'my/user/sendChangeMobileSMS',
        SECURITY_VALIDATION_CHECKCODE: head + 'my/user/validateOldMobile',
        SECURITY_VALIDATION_GETNEWCODE: head + 'my/user/smsBindNewMobile',
        SECURITY_VALIDATION_CHECKNEWCODE: head + 'my/user/smsVerifyBindNewMobile',
        SECURITY_VALIDATION_PAYIMGCODE: head + 'my/user/getVerificationCode',
        SECURITY_VALIDATION_CHECKPAY: head + 'my/user/validPayPwd',
        SECURITY_VALIDATION_SAVEBYPAY: head + 'my/user/changeMobileByPayPwd',

        SECURITY_PAY_HASPAYPASSWORD: head + '/my/user/changePayPwdPremiss',
        SECURITY_PAY_GETCODE: head + 'my/user/sendBindPayPwdSMS',
        SECURITY_PAY_CHECKCODE: head + 'my/user/validBindPayPwdSMS',
        SECURITY_PAY_SAVEPASSWORD: head + 'my/user/savePayPwd',


        /*ADD START BY 葛硕 20150730:个人中心->订单、资产相关webAPI地址--------------------------------------------------*/
        /*订单相关*/
        GET_ORDER_LIST: head + 'my/order/list',//订单列表
        WAIT_REMARK_ORDERS: head + 'my/order/comment',//待评价订单列表
        ORDER_DETAIL: head + 'my/order/detail',//订单详情
        EXPRESS_DETAIL: head + 'my/order/logistics',//物流详情
        CANCEL_ORDER: head + 'my/order/cancel',//取消订单
        CONFIRM_RECEIVE: head + 'my/order/confirm',//确认收货
        AFTER_SALE_UPLOAD: imageHead + 'img/rc/upload',//上传图片
        AFTER_SALE_APPLY: head + 'my/after/add',
        AFTER_SALE_PROGRESS: head + 'my/after/progress',
        IMAGE_FILTER: imageHead + 'img/rc/get?rid=',

        /*评价相关*/
        REMARK_GOODS: head + 'my/comment/add',

        /*优惠券相关*/
        BIND_COUPON: head + 'my/coupon/activate',//绑定优惠券
        GET_COUPONS: head + 'my/coupon/findCoupons',//获取优惠券列表

        /*中免卡相关*/
        GET_CARD_MONEY: head + 'my/zmCard/getBalance',//获取中免卡余额
        GET_VALIDATE_CODE: head + 'my/zmCard/getVerificationCode',//获取充值验证码
        RECHARGE_CARD: head + 'my/zmCard/bindZmCard',//中免卡充值
        GET_RECHARGE_LIST: head + 'my/zmCard/getZmCardRechargeRecord',//获取充值记录
        GET_PAY_LIST: head + 'my/zmCard/getZmCardConsumeRecord',//获取消费记录

        /*免税店相关*/
        GET_SHOP_GUIDE: head + 'resource/policy.html',
        GET_SHOP_LIST: head + 'store/list',
        GET_SHOP_LOCATION: head + 'store/location',
        /*ADD END   BY 葛硕 20150730:个人中心->订单、资产相关webAPI地址--------------------------------------------------*/

        /* add by 徐峰 20150801  start*/
        GET_HOT_WORDS: head + 'hot?channel=1',
        GET_QUERY_COMPLETE: head + 'suggest',

        GET_FIRST_SC: head + 'sc/list?pId=0',
        GET_SAT_SC: head + 'sc/listsat',
        GET_PROMOTION_PRODUCT_LIST: head + 'prom/findPromotionProd',
        GET_PROMOTION_CONFIG_PAGE: head + 'topic',
        /* add by 徐峰 20150801  end */

        //通过品牌id 得到品牌名称
        GET_BRAND_NAME_BY_ID: head + 'brand/brandName',
        //搜索商品
        SEARCH_FOR_PRODUCTS: head + 'search?searchPara=',
        /*********     免税店        *********/
        SHOP_CATEGORY_LIST: head + 'ssc/list'

        /*********                   *********/

    };
    this.getUrl = function (url) {
        return urls[url];
    };
}])
;