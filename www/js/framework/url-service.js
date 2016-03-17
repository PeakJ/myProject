/**
 * Created by geshuo on 2016/2/16.
 */
/*接口地址管理 */
CYXApp.service('UrlService', [function () {


    //数据服务器表示 0：生产环境 1：测试环境 2：本地开发环境 13478521061


  var RUN_MODE = 1;


    var SERVICE_DATA = [
        //测试环境 高斌环境
        {
            SERVER: 'http://172.16.63.191',
            PORT: ':8085',
            SERVER_IMG: '',
            PORT_IMG: ''
        },
        //测试环境 http://172.16.63.32 --35 葛硕 192.168.1.112
        {
            SERVER: 'http://172.16.63.32',
            PORT: ':8085',
            SERVER_IMG: '',
            PORT_IMG: ''
        },
        //开发环境
        {
            SERVER: 'data',
            PORT: '',
            SERVER_IMG: '',
            PORT_IMG: ''
        }


  ];
  //数据服务器
  var HEAD = SERVICE_DATA[RUN_MODE].SERVER + SERVICE_DATA[RUN_MODE].PORT + '/';
  var HEAD_IMG = SERVICE_DATA[RUN_MODE].SERVER_IMG + SERVICE_DATA[RUN_MODE].PORT_IMG + '/';


  /*开发调试用URL列表*/
  var debugUrlList = {
    HOME_HEALTH_ADS: 'home-ads.json', //首页健康频道轮播图
    HOME_LIFE_ADS: 'home-life-ads.json', //首生活频道轮播图
    HOME_HEALTH_GOODS: 'home-health-goods.json',//首页健康频道商品列表
    HOME_HEALTH_TOPIC: 'home-health-topic.json',//首页健康专栏
    HOME_LIFE_SHOPS: 'home-life-shops.json', //首生活频道店铺列表
    HOME_LIFE_TOPIC: 'home-life-topic.json', //首生活频道专题列表
    HOME_VIP_LIST: 'home-vip-list.json',//获取VIP外部链接列表
    HEALTH_TOPIC_GOODS: 'home-health-topic-goods.json',//健康专栏商品列表
    LIFE_TOPIC_SHOPS: 'home-life-topic-shops.json',//生活专题店铺列表
    HOME_CITY_LIST: 'home-city-list.json',//城市列表
    COLLECT_GOODS: 'collect-goods.json',//收藏商品
    COLLECT_GOODS_LIST: 'collect-goods-list.json',//收藏商品列表
    COLLECT_SHOP_LIST: 'collect-shop-list.json',//收藏店铺列表
    CANCEL_COLLECT_GOODS: 'cancel-collect-goods.json',//取消收藏商品
    COLLECT_SHOP: 'collect-shop.json',//收藏店铺
    CANCEL_COLLECT_SHOP: 'cancel-collect-shop.json',//取消收藏店铺
    FIRST_CATEGORY: 'first-category.json',//一级商品分类列表
    SECOND_CATEGORY: 'second-category.json',//二级商品分类列表
    SEARCH_GOODS_LIST: 'search-goods-list.json',//搜索商品列表
    GOODS_DETAIL: 'goods-detail.json',//获取商品详情
    GOODS_SALES_SHOP: 'goods-sales-shop.json',//售卖药店列表
    GOODS_INTRODUCTION: 'goods-introduction.json',//商品亮点
    GOODS_ATTR: 'goods-attr.json',//商品说明书
    ADD_TO_SHOPPING_CART: 'add-to-shoppingcart.json',//加入购物车
    SHOP_CENTER: 'shop-center/shop-center.json',//药店中心
    INTEGRAL: 'shop-center/integral-information.json',//积分信息
    GOODS_STATISTICS: 'shop-center/goods-statistics.json',//商品统计
    SALESPERSON: 'shop-center/salesperson-statistics.json',//销售员统计
    MEMBER: 'shop-center/member-information.json',//会员信息
    CONSUMPTION: 'shop-center/member-consumption-record.json',//会员消费记录
    VOLUME_STATISTICS: 'shop-center/sales-volume-statistics.json',//消费额统计
    SINGLE_GOODS: 'shop-center/single-goods-statistics.json',//单个商品统计
    SINGLE_VOLUME: 'shop-center/single-sales-volume-statistics.json',//单个商品消费额统计
    SHOP_HOME_INFO: 'shop-home.json', //店铺首页
    CONTACT_US_INFO: 'contact-us.json',//联系我们
    ADDRESS_LIST: 'personal/address-list.json',//地址列表
    DEL_SHOPPING_CART_GOODS_INFO: 'shopping-cart/del-shopping-cart.json',//删除购物车商品信息
    GET_SHOPPING_CART_GOODS_INFO: 'shopping-cart/shopping-cart-goods.json',//获取购物车商品信息
    CREATE_ORDER: 'shopping-cart/create-order.json',//生成订单
    GET_PERSONAL_INFO: 'personal-info.json',//获取个人信息,
    GET_ORDER_DEAL: 'order/order-deal.json',//获取待核销订单信息
    CONFIRM_ORDER_INFO: 'verify-confirm-info.json',//确认核销订单信息
    CONFIRM_ORDER: 'order/order-confirm.json',//核销订单确认
    ORDER_RECORD: 'verify-records.json',//核销记录
    DEL_ORDER_RECORD: 'order/order-cancel.json',//取消核销
    GET_ORDER_RECORD_BY_TEL: 'order/order-records-by-tel.json',//根据手机号查询记录
    RECORD_DETAIL: 'verify-record-detail.json',//记录详细
    REGISTER: 'insert_user.ajax',//注册
    LOGIN: 'toLogin.ajax'//登录
  };




  /*******************本地假数据接口***************************************************/

    /*接口URL列表*/
    var urlList = {
        HOME_HEALTH_ADS: '', //首页健康频道轮播图
        HOME_LIFE_ADS: '', //首页生活频道轮播图
        HOME_HEALTH_GOODS: 'goods_list.ajax',//首页健康频道商品
        HOME_HEALTH_TOPIC: '',//首页健康专栏
        HOME_LIFE_SHOPS: '', //首生活频道店铺列表
        HOME_LIFE_TOPIC: '', //首生活频道专题列表
        HOME_VIP_LIST: '',//获取VIP外部链接列表
        HEALTH_TOPIC_GOODS:'',//健康专栏商品列表
        LIFE_TOPIC_SHOPS:'',//生活专题店铺列表
        HOME_CITY_LIST: 'store_city_list.ajax',//城市列表
      SALESPERSON: 'member/seller_statics_total.ajax',//销售员统计
      PERSONAL_INFO: 'member/get_user_info.ajax',//获取个人信息
      COLLECT_GOODS_LIST:'member/favourite_goods_list.ajax',//收藏商品列表
      COLLECT_SHOP_LIST:'member/favourite_store_list.ajax',//收藏店铺列表
        COLLECT_GOODS:'member/collect_goods.ajax',//收藏商品
        CANCEL_COLLECT_GOODS:'member/cancel_collect_goods.ajax',//取消收藏商品
        COLLECT_SHOP:'member/collect_store.ajax',//收藏店铺
        CANCEL_COLLECT_SHOP:'member/cancel_collect_store.ajax',//取消收藏店铺
        FIRST_CATEGORY:'category_list.ajax',//一级商品分类列表
        SECOND_CATEGORY:'category_list.ajax',//二级商品分类列表
        SEARCH_GOODS_LIST:'goods_list.ajax',//搜索商品列表
        GOODS_DETAIL:'goods_detail.ajax',//获取商品详情
        ORDER_LIST: 'member/order_list.ajax',//获取待(已)核销订单信息
        GOODS_SALES_SHOP:'goods_sales_store_list.ajax',//售卖药店列表
        GOODS_INTRODUCTION:'',//商品亮点
        GOODS_ATTR:'',//商品说明书
        ADD_TO_SHOPPING_CART:'member/add_shopcart.ajax',//加入购物车
        DEL_SHOPPING_CART:'member/delete_shopcart_item.ajax',//加入购物车
        SHOP_CENTER: 'member/seller_store_info.ajax',//药店中心
        INTEGRAL: 'member/points_list.ajax',//积分信息
        GOODS_STATISTICS: '',//商品统计
        //SALESPERSON: '',//销售员统计
        MEMBER: 'member/member_coupon_list.ajax',//会员信息
        CONSUMPTION: 'member/member_pay_records.ajax',//会员消费记录
        VOLUME_STATISTICS: 'member/sales_money_statics_list.ajax',//消费额统计
        SINGLE_GOODS: 'member/single_goods_statics_list.ajax',//单个商品统计
        SINGLE_VOLUME: '',//单个商品消费额统计
        SHOP_HOME_INFO: 'store_info.ajax', //店铺首页
        CONTACT_US_INFO:'query_contact_us.ajax',//联系我们
        SHOPPING_CART_LIST:'member/get_shopcart_info.ajax',//购物车列表
        REGISTER:'insert_user.ajax',//注册
        LOGIN:'toLogin.ajax',//登录
        MINE_INFO:'member/mine_info.ajax',//我的信息
        UPDATE_MY_INFO :'member/update_myInfo.ajax',//修改个人信息
        CREATE_ORDER:'member/create_order.ajax',//生成订单
        BUY_NOW:'member/immediately_buy.ajax',//立即购买，
        FORGET_PASSWORD:'forget_password.ajax',//找回密码
        GET_PROVINCES:'find_all_address.ajax',//获得省列表
        GET_CITIES:'find_all_address.ajax',//获得市列表
        GET_AREAS:'find_all_address.ajax',//获得区列表
        VERSION_INFO:'query_app_version.ajax',//获取版本号
      COUPON_VERIFY:'member/confirm_order.ajax',//获取优惠券核销信息
      VERIFY_CONFIRM:'member/verify_order.ajax',//优惠券核销
      ORDER_RECORD: 'member/verify_records.ajax',//核销记录
      DEL_ORDER_RECORD: 'member/cancel_order.ajax',//取消核销记录
      RECORD_DETAIL: 'member/get_verify_detail.ajax',//记录详细
      /***********  xuf ******************/
      GOODS_STATISTICS_TOTAL:'member/goods_statics_total.ajax',
      GOODS_STATISTICS_LIST:'member/goods_statics_list.ajax',
      HOME_PAGE_DATA:'seminar_and_banner_list.ajax',//首页 分分页的信息
      /***********  zmw******************/
        SELLER_INFO:'member/seller_simple_info.ajax',//获取卖家信息
        SELLER_LIST:'member/seller_statics_list.ajax',//获取销售员统计信息
       VOLUME_TOTAL:'member/seller_statics_total.ajax'//、销售额统计总数
    };
    /*******************本地假数据接口***************************************************/


  this.getDebugUrl = function (key) {
    return HEAD + debugUrlList[key];
  };

  /***************网络数据接口*******************************************************/

    //生产环境接口
  this.getUrl = function (key) {
    // return HEAD + url[param];
    return HEAD + urlList[key];
  };
  //图片接口返回
  this.getImageUrl = function () {
    return HEAD_IMG;
  };

}])
;
