/**
 * 常量聚集JS类。
 * 此类中常量为全局变量。
 * 新加入常量时候一定要严禁，否则可能影响到其他人的业务逻辑。
 * Created by dhc on 2015/7/31.
 */
//0开发环境 1测试环境 2准生产环境 3正式环境
var  ENVIRONMENT=1;

var CDFG_IP=[
    {
        MAIN:'192.168.103.210',
        PORT:'80',
        IMG:'http://192.168.103.217/img/rc/get?rid=',
        PAY:'http://192.168.103.217/test/payment/',
        LOGIN:'http://192.168.103.217:8080/'
    },
    {
        MAIN:'192.168.103.218',
        PORT:'80',
        IMG:'http://192.168.103.217/img/rc/get?rid=',
        PAY:'http://192.168.103.217/payment/',
        LOGIN:'http://192.168.103.217:8080/'

    }

]
var CUR_IP=CDFG_IP[ENVIRONMENT],

CDFG_IP_IMAGE =CUR_IP.IMG,//图片服务器地址
CDFG_IP_SERVER = CUR_IP.MAIN,//数据服务器地址
CDFG_PORT_SERVER = CUR_IP.PORT,//数据服务器端口
CDFG_IP_IMAGE_SERVER = '192.168.103.235',//图片服务器地址,
CDFG_IP_PAY_SERVER= CUR_IP.PAY,//支付接口
CDFG_IP_LOGIN=CUR_IP.LOGIN, //第三方登录

CDFG_PAGE_SIZE = 10,//页码，每页多少条数据
CDFG_WAITING_TIME = 60,//发送验证码等待时间
CDFG_NETWORK_ERROR = '无法连接到网络';