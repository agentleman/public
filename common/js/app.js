/**
 *  雅旌WAP Angular框架-全局配置
 *  -----------------------------
 *  一张网页，要经历怎样的过程，才能抵达用户面前
 *  一个特效，要经历这样的修改，才能让用户点个赞
 *  一个产品，创意源于生活，源于内心，需要慢慢品味
 **************************************/
'use strict';
/**
 *  声明全局module及注入以下模块
 *  ui.route 路由模块
 *  oc.lazyLoad 文件资源懒加载模块
 *  ngCookies 缓存模块
 *  infinite-scroll 滚动加载模块
 *  ng-lazyload 图片显示滚动懒加载模块
 *  ksSwiper 轮播图模块
 *  mobiscroll-select 定制下拉框模块
 *  angular-momentum-scroll 滚动模块 as iScroll
 */
angular.module("yunwaApp", ['ui.router', 'oc.lazyLoad', 'ngCookies', 'infinite-scroll', 'ng-lazyload', 'ksSwiper', 'mobiscroll-select', 'angular-momentum-scroll'])
    .config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("index"); // 路由不存在 默认至首页

        // 配置全站路由
        $stateProvider
            .state('/', {
                url: "?code&refid", // root route
                views: {
                    "mainView": {
                        controller: 'CommonCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // 懒加载当前模块所需资源
                        return $ocLazyLoad.load([
                            'common/js/controller.js?v=' + VERSION,
                            'home/service/homeService1.js?v=' + VERSION
                        ]);
                    }]
                }
            }).state('login', {
            url: "/login", // 绑定登录
            views: {
                "mainView": {
                    controller: 'LoginCtrl',
                    templateUrl: 'login/view/login.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'login/view/less/login.css?v=' + VERSION,
                        'login/service/loginService.js?v=' + VERSION,
                        'login/controller/loginCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('home', {
            url: "/home", // 首页
            views: {
                "mainView": {
                    controller: 'HomeCtrl',
                    templateUrl: 'home/view/home.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'home/view/less/home.css?v=' + VERSION,
                        'home/service/homeService.js?v=' + VERSION,
                        'home/controller/homeCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('yuyue_address', {
            url: "/yuyue_address?packageType", // 地址选择
            views: {
                "mainView": {
                    controller: 'AddressCtrl',
                    templateUrl: 'address/view/addressList.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'home/service/wxAuthService.js?v='+VERSION,
                        'address/view/less/address.css?v='+VERSION,
                        'address/service/addressService.js?v='+VERSION,
                        'address/controller/addressCtrl.js?v='+VERSION

                    ]);
                }]
            }
        }).state('yuyue_addressWx', {
            url: "/yuyue_addressWx", // 预约安装地址wx
            views: {
                "mainView": {
                    controller: 'AddressWxCtrl',
                    templateUrl: 'address/view/addressList.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'address/view/less/address.css?v=' + VERSION,
                        'address/service/addressService.js?v=' + VERSION,
                        'home/service/homeService1.js?v=' + VERSION,
                        'address/controller/addressWXCtrl.js?v=' + VERSION

                    ]);
                }]
            }
        }).state('addAddress', {
            /* url: "/addAddress?district&lat&lng&village&city", //添加地址*/
            url: "/addAddress?province_id&province_name&city_id&city_name&district_id&district_name", //添加地址
            views: {
                "mainView": {
                    controller: 'AddAddressCtrl',
                    templateUrl: 'address/view/addAddress.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'address/view/less/addAddress.css?v=' + VERSION,
                        'address/service/addAddressService.js?v=' + VERSION,
                        'address/controller/addAddressCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('modifyAddress', {
            url: "/modifyAddress?id&contact&contact_mobile&detail_address&province_name&city_name&district_name&province_id&city_id&district_id", //修改地址
            views: {
                "mainView": {
                    controller: 'ModifyAddressCtrl',
                    templateUrl: 'address/view/modifyAddress.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'address/view/less/modifyAddress.css?v=' + VERSION,
                        'address/service/modifyAddressService.js?v=' + VERSION,
                        'address/controller/modifyAddressCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('order', {
            url: "/order?packageType&id&contact&contact_mobile&detail_address&province_name&city_name&district_name&district_id&is_visit", //套餐选择页面
            views: {
                "mainView": {
                    controller: 'OrderCtrl',
                    templateUrl: 'order/view/order.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'order/view/less/order.css?v=' + VERSION,
                        'order/service/orderService.js?v=' + VERSION,
                        'order/controller/orderCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('payment', {
//                url: "/payment/?amount&order_id&order_type&contact&contact_mobile&detail_address&province_name&city_name&district_name", //支付页面
            url: "/payment/",
            views: {
                "mainView": {
                    controller: 'PaymentCtrl',
                    templateUrl: 'payment/view/payment.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'payment/view/less/payment.css?v=' + VERSION,
                        'payment/service/paymentService.js?v=' + VERSION,
                        'payment/controller/paymentCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('paysuccess', {
            url: "/paysuccess?order_id&amount", //支付成功回调页面
            views: {
                "mainView": {
                    controller: 'PaySuccessCtrl',
                    templateUrl: 'payment/view/paysuccess.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'payment/view/less/paysuccess.css?v=' + VERSION,
                        'payment/service/paySuccessService.js?v=' + VERSION,
                        'payment/controller/paySuccessCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('orderlist', {
            url: "/orderlist", //订单列表
            views: {
                "mainView": {
                    controller: 'OrderListCtrl',
                    templateUrl: 'order/view/orderlist.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'order/view/less/orderlist.css?v=' + VERSION,
                        'order/service/orderListService.js?v=' + VERSION,
                        'order/controller/orderListCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('orderlistWx', {
            url: "/orderlistWx", //订单列表
            views: {
                "mainView": {
                    controller: 'OrderListWxCtrl',
                    templateUrl: 'order/view/orderlist.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'order/view/less/orderlist.css?v=' + VERSION,
                        'order/service/orderListService.js?v=' + VERSION,
                        'home/service/homeService1.js?v=' + VERSION,
                        'order/controller/orderListWXCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('chooseAddress', {
            url: "/chooseAddress?str", //选择省市区页面
            views: {
                "mainView": {
                    controller: 'ChooseAddressCtrl',
                    templateUrl: 'address/view/chooseAddress.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'address/view/less/chooseAddress.css?v=' + VERSION,
                        'address/service/chooseAddressService.js?v=' + VERSION,
                        'address/controller/chooseAddressCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('getRedpackage', {
            url: "/getRedpackage?red_ticket", //领取红包
            views: {
                "mainView": {
                    controller: 'GetRedpackageCtrl',
                    templateUrl: 'redpackage/view/getRedpackage.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'redpackage/view/less/getRedpackage.css?v=' + VERSION,
                        'redpackage/service/getRedpackageService.js?v=' + VERSION,
                        'login/service/loginService.js?v=' + VERSION,
                        'redpackage/controller/getRedpackageCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('getRedpackageWx', {
            url: "/getRedpackageWx", //领取红包-微信
            views: {
                "mainView": {
                    controller: 'GetRedpackageWxCtrl',
                    templateUrl: 'redpackage/view/getRedpackage.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'redpackage/view/less/getRedpackage.css?v=' + VERSION,
                        'redpackage/service/getRedpackageService.js?v=' + VERSION,
                        'login/service/loginService.js?v=' + VERSION,
                        'home/service/homeService1.js?v=' + VERSION,
                        'redpackage/controller/getRedpackageWxCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('activities', {
            url: "/activities", //活动列表
            views: {
                "mainView": {
                    controller: 'ActivitiesCtrl',
                    templateUrl: 'activity/view/activities.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'activity/view/less/activities.css?v=' + VERSION,
                        'activity/service/activitiesService.js?v=' + VERSION,
                        'activity/controller/activitiesCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('activityMessage', {
            url: "/activityMessage?id", //活动详情
            views: {
                "mainView": {
                    controller: 'ActivityMessageCtrl',
                    templateUrl: 'activity/view/activityMessage.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'activity/view/less/activityMessage.css?v=' + VERSION,
                        'activity/service/activityMessageService.js?v=' + VERSION,
                        'activity/controller/activityMessageCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('downloadApp', {
            url: "/downloadApp", //下载客户端页面
            views: {
                "mainView": {
                    controller: 'DownloadAppCtrl',
                    templateUrl: 'app/view/downloadApp.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'app/view/less/downloadApp.css?v=' + VERSION,
                        'app/service/downloadAppService.js?v=' + VERSION,
                        'app/controller/downloadAppCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('invite', {
            url: "/invite", //邀请注册
            views: {
                "mainView": {
                    controller: 'InviteCtrl',
                    templateUrl: 'app/view/invite.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'app/view/less/invite.css?v=' + VERSION,
                        'app/service/inviteService.js?v=' + VERSION,
                        'app/controller/inviteCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('zhuye', {
            url: "/zhuye?id", //主页
            views: {
                "mainView": {
                    controller: 'zhuyeCtrl',
                    templateUrl: 'homepage/view/zhuye.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'common/js/animate.js',
                        'activity/service/activitiesService.js?v=' + VERSION,
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'homepage/view/less/zhuye.css?v=' + VERSION,
                        'homepage/service/zhuyeService.js?v=' + VERSION,
                        'homepage/controller/zhuyeCtrl.js?v=' + VERSION,
                    ]);
                }]
            }
        }).state('orderDetail', {
            url: "/orderDetail?contact&contact_mobile&contact_address&recharge_pay&recharge_present&order_id&order_status&create_time&express_order_id&red_envelope_group_status&express_company&order_type", //订单详情
            views: {
                "mainView": {
                    controller: 'OrderDetailCtrl',
                    templateUrl: 'order/view/orderDetail.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'order/view/less/orderDetail.css?v=' + VERSION,
                        'order/service/orderDetailService.js?v=' + VERSION,
                        'payment/service/paymentService.js?v=' + VERSION,
                        'order/controller/orderDetailCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('share', {
            url: "/share", //订单详情
            views: {
                "mainView": {
                    controller: 'shareCtrl',
                    templateUrl: 'homepage/view/share.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'homepage/view/less/share.css?v=' + VERSION,
                        'homepage/service/shareService.js?v=' + VERSION,
                        'homepage/controller/shareCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('shebei', {
            url: "/shebei", //设备
            views: {
                "mainView": {
                    controller: 'shebeiCtrl',
                    templateUrl: 'homepage/view/shebei.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'homepage/view/less/shebei.css?v=' + VERSION,
                        'homepage/service/shebeiService.js?v=' + VERSION,
                        'homepage/controller/shebeiCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('activity', {
            url: "/activity", //活动
            views: {
                "mainView": {
                    controller: 'activityCtrl',
                    templateUrl: 'homepage/view/activity.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'homepage/view/less/activity.css?v=' + VERSION,
                        'homepage/service/activityService.js?v=' + VERSION,
                        'homepage/controller/activityCtrl.js?v=' + VERSION
                    ]);
                }]
            },
            cache: false
        }).state('main', {
            url: "/main", //我的
            views: {
                "mainView": {
                    controller: 'mainCtrl',
                    templateUrl: 'homepage/view/main.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'homepage/view/less/main.css?v=' + VERSION,
                        'homepage/service/mainService.js?v=' + VERSION,
                        'homepage/controller/mainCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('chooseStyle', {
            url: "/chooseStyle", //试用申请选择方式
            views: {
                "mainView": {
                    controller: 'chooseStyleCtrl',
                    templateUrl: 'homepage/view/chooseStyle.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'homepage/view/less/chooseStyle.css?v=' + VERSION,
                        'homepage/controller/chooseStyleCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('waterRefill', {
            url: "/waterRefill?from&waterNum&balance&realPay&inPutBalance&orderShowType&redpackageId&redpackageAmount", //设备充水页面
            views: {
                "mainView": {
                    controller: 'waterRefillCtrl',
                    templateUrl: 'facility/view/waterRefill.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'homepage/service/shebeiService.js?v=' + VERSION,
                        'homepage/service/mainService.js?v=' + VERSION,
                        'facility/view/less/waterRefill.css?v=' + VERSION,
                        'facility/service/waterRefillService.js?v=' + VERSION,
                        'login/service/loginService.js?v=' + VERSION,
                        'facility/controller/waterRefillCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('activityDel', {
            url: "/activityDel/:id", //活动列表详情
            views: {
                "mainView": {
                    controller: 'activityDelCtrl',
                    templateUrl: 'homepage/view/activityDel.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'homepage/view/less/activityDel.css?v=' + VERSION,
                        'homepage/service/activityDelService.js?v=' + VERSION,
                        'homepage/controller/activityDelCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('waterQuality', {
            url: "/waterQuality",
            views: {
                "mainView": {
                    controller: 'waterQualityCtrl',
                    templateUrl: 'facility/view/waterQuality.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'facility/view/less/waterQuality.css?v=' + VERSION,
                        'homepage/service/shebeiService.js?v=' + VERSION,
                        'facility/service/waterQualityService.js?v=' + VERSION,
                        'facility/controller/waterQualityCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('waterAmount', {
            url: "/waterAmount", //主页用水量
            views: {
                "mainView": {
                    controller: 'waterAmountCtrl',
                    templateUrl: 'facility/view/waterAmount.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'facility/view/less/waterAmount.css?v=' + VERSION,
                        'homepage/service/shebeiService.js?v=' + VERSION,
                        'facility/service/waterAmountService.js?v=' + VERSION,
                        'facility/controller/waterAmountCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('filterUsing', {
            url: "/filterUsing", //滤芯使用
            views: {
                "mainView": {
                    controller: 'filterUsingCtrl',
                    templateUrl: 'facility/view/filterUsing.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'facility/view/less/filterUsing.css?v=' + VERSION,
                        'homepage/service/shebeiService.js?v=' + VERSION,
                        'facility/service/filterUsingService.js?v=' + VERSION,
                        'facility/controller/filterUsingCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('productType', {
            url: "/productType", //产品类型
            views: {
                "mainView": {
                    controller: 'productTypeCtrl',
                    templateUrl: 'equipchoose/view/productType.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'equipchoose/view/less/productType.css?v=' + VERSION,
                        'equipchoose/service/productTypeService.js?v=' + VERSION,
                        'equipchoose/controller/productTypeCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('smartPurifier', {
            url: "/smartPurifier", //链接设备
            views: {
                "mainView": {
                    controller: 'smartPurifierCtrl',
                    templateUrl: 'equipchoose/view/smartPurifier.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'equipchoose/view/less/smartPurifier.css?v=' + VERSION,
                        'equipchoose/controller/smartPurifierCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('connectDevice', {
            url: "/connectDevice", //链接设备
            views: {
                "mainView": {
                    controller: 'connectDeviceCtrl',
                    templateUrl: 'equipadd/view/connectDevice.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'equipadd/view/less/connectDevice.css?v=' + VERSION,
                        'equipadd/service/connectDeviceService.js?v=' + VERSION,
                        'equipadd/controller/connectDeviceCtrl.js?v=' + VERSION
                    ]);
                }]
            },
            cache: false
        }).state('addDevice', {
            url: "/addDevice", //添加设备
            views: {
                "mainView": {
                    controller: 'addDeviceCtrl',
                    templateUrl: 'equipadd/view/addDevice.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'equipadd/view/less/addDevice.css?v=' + VERSION,
                        'equipadd/service/addDeviceService.js?v=' + VERSION,
                        'equipadd/controller/addDeviceCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('applyUse', {
            url: "/applyUse", //试用申请
            views: {
                "mainView": {
                    controller: 'applyUseCtrl',
                    templateUrl: 'freeuse/view/applyUse.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'freeuse/view/less/applyUse.css?v=' + VERSION,
                        'freeuse/service/applyUseService.js?v=' + VERSION,
                        'freeuse/controller/applyUseCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('orderInstall', {
            url: "/orderInstall?orderType", //订单列表
            views: {
                "mainView": {
                    controller: 'orderInstallCtrl',
                    templateUrl: 'freeuse/view/orderInstall.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'freeuse/view/less/orderInstall.css?v=' + VERSION,
                        'freeuse/service/orderInstallService.js?v=' + VERSION,
                        'freeuse/controller/orderInstallCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('repairs', {
            url: "/repairs", //报修页
            views: {
                "mainView": {
                    controller: 'repairsCtrl',
                    templateUrl: 'freeuse/view/repairs.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'freeuse/view/less/repairs.css?v=' + VERSION,
                        'freeuse/service/repairsService.js?v=' + VERSION,
                        'freeuse/controller/repairsCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('newsCenter', {
            url: "/newsCenter", //消息列表中心
            views: {
                "mainView": {
                    controller: 'newsCenterCtrl',
                    templateUrl: 'homepage/view/newsCenter.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'homepage/view/less/newsCenter.css?v=' + VERSION,
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'homepage/service/newsCenterService.js?v=' + VERSION,
                        'homepage/controller/newsCenterCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('messageDetail', {
            url: "/messageDetail", //消息详情页
            views: {
                "mainView": {
                    controller: 'messageDetailCtrl',
                    templateUrl: 'homepage/view/messageDetail.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'homepage/view/less/messageDetail.css?v=' + VERSION,
                        'homepage/controller/messageDetailCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('bindlogin', {
            url: "/bindlogin", // 绑定登录
            views: {
                "mainView": {
                    controller: 'LoginCtrl',
                    templateUrl: 'login/view/bindlogin.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'login/view/less/bindlogin.css?v=' + VERSION,
                        'login/service/bindloginService.js?v=' + VERSION,
                        'login/controller/bindloginCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('refill', {
            url: "/refill", // 账户充值
            views: {
                "mainView": {
                    controller: 'refillCtrl',
                    templateUrl: 'menu/view/refill.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'menu/view/less/refill.css?v=' + VERSION,
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'menu/service/refillService.js?v=' + VERSION,
                        'menu/controller/refillCtrl.js?v=' + VERSION,
                        'order/service/orderService.js?v=' + VERSION,
                        'payment/service/paymentService.js?v=' + VERSION,
                    ]);
                }]
            }
        }).state('myRedpack', {
            url: "/myRedpack?from&waterNum&balance&realPay&inPutBalance&orderShowType", // 我的红包
            views: {
                "mainView": {
                    controller: 'myRedpackCtrl',
                    templateUrl: 'menu/view/myRedpack.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'menu/view/less/myRedpack.css?v=' + VERSION,
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'menu/service/myRedpackService.js?v=' + VERSION,
                        'menu/controller/myRedpackCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('orderForm', {
            url: "/orderForm", // 订单列表
            views: {
                "mainView": {
                    controller: 'orderFormCtrl',
                    templateUrl: 'menu/view/orderForm.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'menu/view/less/orderForm.css?v=' + VERSION,
                        'menu/service/orderFormService.js?v=' + VERSION,
                        'menu/controller/orderFormCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('waterAcount', {
            url: "/waterAcount", // 账户充值明细列表
            views: {
                "mainView": {
                    controller: 'waterAcountCtrl',
                    templateUrl: 'menu/view/waterAcount.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'menu/view/less/waterAcount.css?v=' + VERSION,
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'menu/service/waterAcountService.js?v=' + VERSION,
                        'menu/controller/waterAcountCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('inviteGet', {
            url: "/inviteGet", // 邀请用户
            views: {
                "mainView": {
                    controller: 'inviteGetCtrl',
                    templateUrl: 'menu/view/inviteGet.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'menu/view/less/inviteGet.css?v=' + VERSION,
                        'menu/controller/inviteGetCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('countDown', {
            url: "/countDown?mac", // 配网倒计时
            views: {
                "mainView": {
                    controller: 'countDownCtrl',
                    templateUrl: 'menu/view/countDown.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'home/service/wxAuthService.js?v=' + VERSION,
                        'homepage/service/shebeiService.js?v=' + VERSION,
                        'menu/view/less/countDown.css?v=' + VERSION,
                        'menu/controller/countDownCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('redIntro', {
            url: "/redIntro", // 红包详情
            views: {
                "mainView": {
                    controller: 'redIntroCtrl',
                    templateUrl: 'menu/view/redIntro.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'menu/view/less/redIntro.css?v=' + VERSION,
                        'menu/service/redIntroService.js?v=' + VERSION,
                        'menu/controller/redIntroCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('newsDel', {
            url: "/newsDel", // 主页消息详情
            views: {
                "mainView": {
                    controller: 'newsDelCtrl',
                    templateUrl: 'homepage/view/newsDel.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'homepage/view/less/newsDel.css?v=' + VERSION,
                        'homepage/service/newsDelService.js?v=' + VERSION,
                        'homepage/controller/newsDelCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        }).state('waterRecord', {
            url: "/waterRecord", // 冲水明细列表
            views: {
                "mainView": {
                    controller: 'waterRecordCtrl',
                    templateUrl: 'facility/view/waterRecord.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'facility/view/less/waterRecord.css?v=' + VERSION,
                        'facility/service/waterRecordService.js?v=' + VERSION,
                        'facility/controller/waterRecordCtrl.js?v=' + VERSION
                    ]);
                }]
            }
        });


    })
    .run(function ($rootScope, $state, $window, $stateParams, $cookies, ApiTimeService, GetDomainService, CommonService, QRCodeService) {
        FastClick.attach(document.body);

        // 随机字符串
        $rootScope.VERSION = VERSION = CommonService.randomStr(false, 10);

        // 请求接口、缓存接口与本地时间差
        /*if(!$cookies.get("timestamp")){
         ApiTimeService.initTimestamp();
         }*/

        // 微信判断全局标志
        $rootScope.IS_WECHAT = IS_WECHAT = CommonService.isWeixin();

        //如果微信中，则请求获取域名接口
        if ($rootScope.IS_WECHAT == true) {
            if (!$cookies.get('wx_current_domain')) {
                GetDomainService.getDomain();
            }
        }

        // 当模板解析完成后触发
        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            var toast = document.getElementById("toast");
            if (toast != null) {
                toast && toast.parentNode && toast.parentNode.removeChild(toast); // 默认去掉toast
            }

            //存储refid
            if ($stateParams.refid) {
                if ($cookies.get('refid') != $stateParams.refid) {
                    $cookies.put('refid', $stateParams.refid);
                }
            }

            $rootScope.globalTip = {};                 // 全局提示框信息对象
            $rootScope.isFromNav = true;              // 区分是否从底部导航进入 默认走底部导航
            document.body.scrollTop = 0;               // 页面默认置顶
            document.body.style.overflowY = 'auto';    // 默认垂直滚动条

            switch (toState.name) {
                case 'login':
                    $cookies.put('toLoginPage', $window.location.href); // 记录登录前的路径
                    break;
                case 'index':
                case 'myself':
                case 'cart':
                case 'cartForOrder':
                case 'submit':
                case 'myWallet':
                    QRCodeService.getQRCode(); // 如果页面含有关注公众号 则请求二维码接口
                    break;
            }

            if (toState.name != fromState.name) {
                $state.previous = fromState.name;      // 前页面路由状态
                $state.previous_params = fromParams;   // 前页面路由参数
            }
        });

        // 当模板解析过程中发生错误时触发
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, rejection) {
            CommonService.tips(true, rejection, '', '');
        });
    });
