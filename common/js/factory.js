/**
 *  雅旌WAP Angular框架-公共类库
 *  -----------------------------
 *  一张网页，要经历怎样的过程，才能抵达用户面前
 *  一个特效，要经历这样的修改，才能让用户点个赞
 *  一个产品，创意源于生活，源于内心，需要慢慢品味
 **************************************/
var IS_WECHAT, // 全局变量 - 是否微信公众号中访问
    VERSION = '', // 全局变量 - 随机版本号
    IS_WECHAT_SHARE = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i); // 是否微信浏览器

var COMPANY_ID = '10A0',//厂商id
    APP_KEY = '500012',//应用key
    IMEI = 'weixin',//手机imei
    APPID = 'wxf5f4f16c9f28a933',//APPID
    OPENID_KEY = 'OPENID_'+APP_KEY,
    WXTOKEN_KEY = 'WXTOKEN_'+APP_KEY,
    DEVICEID_KEY = 'DEVICEID_'+APP_KEY,
    IS_RUN_TIMER,
    WX_TYPE = '4';
var contextPath = window.location.href.replace(/\/index\.html#.*/g, "");

// 监听手机横竖屏
var updateOrientation = function () {
    if (window.orientation == '-90' || window.orientation == '90') alert('为了更好的体验，请您将手机竖过来看吧');
};
window.onorientationchange = updateOrientation;

//var useragent = navigator.userAgent;
//if (!IS_WECHAT_SHARE) {
//    alert('已禁止本次访问：您必须使用微信内置浏览器访问本页面！');
//    var opened = window.open('about:blank', '_self');
//    opened.opener = null;
//    opened.close();
//}

// 封装接口时间请求
angular.module("yunwaApp").factory("ApiTimeService", ["$http", "$cookies", "CommonService",
    function ($http, $cookies, CommonService) {
        // 封装请求参数
        var config = {
            method: 'get',                                             // 方法类型
            url: '/time',                                               // 地址
            params: {},                                                // 参数
            headers: {"Content-Type": "text/json; charset=UTF-8"},      // 头部
            cache: false,                                              // 是否使用缓存
            timeout: 30000                                            // 响应时长
        };

        /**
         * 请求并缓存接口时间
         */
        var initTimestamp = function () {
            $http(config).success(function (data) {
                var res = data.body;
                if (res.apiStatus == 0) {
                    var timestamp = parseInt(res.check_timestamp) - new Date().getTime();
                    $cookies.put("timestamp", timestamp);
                } else {
                    CommonService.showToast(res.apiMessage);
                }
            }).error(function () {
                $cookies.put("timestamp", 0);
            });
        };

        return {
            initTimestamp: initTimestamp
        };
    }]);

// 封装获取域名请求 for 微信
angular.module("yunwaApp").factory("GetDomainService", ["$http", "$cookies", "$window", "ShareService",
    function ($http, $cookies, $window, ShareService) {

        //  封装请求参数
        var config = {
            method: 'get',                                               // 方法类型
            url: '/h5/system/getDomain',                                 // 地址
            params: {},                                                  // 参数
            headers: {"Content-Type": "text/json; charset=UTF-8"},       // 头部
            cache: false,                                                // 是否使用缓存
            timeout: 30000                                               // 响应时长
        };

        var getDomain = function () {
            $http(config).success(function (data) {
                var res = data.body;
                if (res.apiStatus == 0) {
                    $cookies.put('wx_current_domain', res.weixinDomain);
                    ShareService.wx_share(document.title, document.title, $cookies.get('wx_current_domain') + '/weixin/authRedirect/shareStore?redirect=' + $window.location.pathname + $window.location.hash, $window.location.protocol + '//' + $window.location.host + '/yunwa/common/img/icon_300.png');
                }
            });
        };

        return {
            getDomain: getDomain
        };
    }]);

// 微信 分享
angular.module("yunwaApp").factory("ShareService", function ($http, $window, CommonService) {

    var jsApiParams = function (title, desc, link, imgUrl, success, cancel) {
        // 封装请求参数
        var config = {
            method: 'post',                                               // 方法类型
            url: '/weixin/jssdk/config',
            params: {                                                    // 参数
                url: location.href.split('#')[0],
                app_key: APP_KEY
            },
            headers: {"Content-Type": "text/json; charset=UTF-8"},       // 头部
            cache: false,                                              // 是否使用缓存
            timeout: 30000                                               // 响应时长
        };

        imgUrl = (imgUrl && imgUrl != '') ? imgUrl : $window.location.protocol + '//' + $window.location.host + 'yunwa/common/img/icon_300.png';
        $http(config).success(function (data) {

            var shareResultHanlder = function (type) {
                if ($(".wechat-share-image")) {
                    $(".wechat-share-image").hide();
                }
                setTimeout(function () {
                    CommonService.showToast(type ? '分享成功！' : '取消分享！');
                }, 600);
            }

            var config = data,
                shareData = {
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl,
                    type: 'link',
                    dataUrl: '',
                    success: function () {
                        shareResultHanlder(1);
                        if (typeof success == 'function') {
                            success();
                        }
                    },
                    cancel: function () {
                        shareResultHanlder();
                        if (typeof cancel == 'function') {
                            cancel();
                        }
                    }
                },
                shareData2 = {
                    title: desc,
                    desc: title,
                    link: link,
                    imgUrl: imgUrl,
                    type: 'link',
                    dataUrl: '',
                    success: function () {
                        shareResultHanlder(1);
                        if (typeof success == 'function') {
                            success();
                        }
                    },
                    cancel: function () {
                        shareResultHanlder();
                        if (typeof cancel == 'function') {
                            cancel();
                        }
                    }
                },
                auth_list = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideOptionMenu', 'showOptionMenu',
                    'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'];
            wx.config({
                debug: false,
                appId: config.appId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.signature,
                jsApiList: auth_list
            });
            wx.ready(function () {
                wx.onMenuShareTimeline(shareData2);
                wx.onMenuShareAppMessage(shareData);
            });
        });
    };

    var wx_share = function (title, desc, link, imgUrl, success, cancel) {
        jsApiParams(title, desc, link, imgUrl, success, cancel);
    };

    return {
        wx_share: wx_share
    };
});


// 封装XHR请求
angular.module("yunwaApp").factory("XHRFactory", ["$http", "$cookies", "CommonService",
    function ($http, $cookies, CommonService) {
        // 封装请求参数
        var config = {
            method: 'get',                                          // 方法类型
            url: '',                                                // 地址
            params: {},                                             // GET参数
            data: {},                                                // POST参数
            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},  // 头部
            cache: false,                                          // 是否使用缓存
            timeout: 30000                                          // 响应时长
        };
        /**
         * 封装XHR请求方法
         * @param type 请求类型：'get' | 'post'
         * @param url 请求地址
         * @param params 请求参数
         * @param callback 回调函数
         * @param hasLoading 是否添加加载效果：true | false
         */
        var getJson = function (type, params, callback, hasLoading) {
            CommonService.tips(false);
            if (params != null) {
                // 添加公共请求参数
                var timestamp = $cookies.get("timestamp") ? $cookies.get("timestamp") : 0;
                params.timestamp = parseInt(timestamp) + new Date().getTime();
                params.app_key = APP_KEY;
                params.company_id = COMPANY_ID;
                // params.token = $cookies.get(WXTOKEN_KEY) ? $cookies.get(WXTOKEN_KEY) : 'ae05a2b7ef034881b0b2b813e67cbfeb';
                // params.token = $cookies.get(WXTOKEN_KEY) ? $cookies.get(WXTOKEN_KEY) : 'b007e5c184d442f0a3d4d54b0d29bedc';
                params.token = $cookies.get(WXTOKEN_KEY) ? $cookies.get(WXTOKEN_KEY) : '';
                params.imei = IMEI;
                params.language = 'zh-CN';
                // params.version = IS_WECHAT ? '1.3' : '1.1'; // 接口版本号 微信1.3 M站1.1
            }

            if (hasLoading && hasLoading == true) {
                CommonService.showLoading(); // 添加加载效果
            }
            config.method = type;
            config.params = type.toLowerCase() == 'post' ? {} : params;
            config.url = (params.path == null || params.path == undefined || params.path == '' ) ? '/weixin/user/authorize' : '/weixin/common';
            config.data = type.toLowerCase() == 'post' ? $.param(params) : {};

            $http(config)
                .success(callback)
                .error(function () {
                    CommonService.showToast('网络未连接，请重试');
                }).finally(function () {
                if (hasLoading && hasLoading == true) {
                    CommonService.hideLoading(); // 去除加载效果
                }
            });
        };
        return {
            getJson: getJson
        };
    }]);


/**
 * 公共方法 CommonService
 */
angular.module("yunwaApp").factory('CommonService', function ($rootScope, $timeout, $cookies, $window) {
    var commonService = {}, num = 0;

    /**
     * @param isShow 是否显示【默认 false不显示】
     * @param msg 提示内容【默认 服务器被玩坏了哦】
     * @param pic 提示图片【默认 失败图片】
     * **/
    commonService.tips = function (isShow, msg, pic, hideView) {
        $rootScope.globalTip = {
            isShow: isShow || false,
            msg: msg != undefined && msg != '' ? msg : '服务器被玩坏了',
            pic: pic != undefined && pic != '' ? pic : 'common/img/fail.png',
            hideView: hideView != undefined ? true : false
        };
    };

    /**
     * 显示/隐藏加载动画
     * **/
    commonService.showLoading = function () {
        $rootScope.show_loader = true;
    };
    commonService.hideLoading = function () {
        $rootScope.show_loader = false;
    };

    /**
     * 获取当前url的参数
     */

    commonService.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    };

    /**
     * toast提示
     * @param message 提示内容
     * @param t 提示时间 【默认1.5s】
     * **/

    commonService.showToast = function (message, t) {
        var alert = document.getElementById("toast");
        if (alert == null) {
            alert = document.createElement("div");
            alert.id = 'toast';
            alert.className = 'fd';
            alert.innerText = message;
        }
        else {
            alert.style.opacity = .9;
        }
        document.body.appendChild(alert);
        t = t != undefined ? t : 1500;
        var toast_timer = $timeout(function () {
            if (alert != null) {
                alert && alert.parentNode && alert.parentNode.removeChild(alert);
                $timeout.cancel(toast_timer);
            }
        }, t);
    };

    commonService.showWxShare = function () {
        var bg = $('<div class="wechat-share-image"></div>');


         bg.css({
            'background-image': ' url(payment/view/img/wechat-share.png)',
            'height': ' 100%',
            'width': ' 100%',
            'position': ' fixed',
            'top': ' 0px',
            'bottom': ' 0px',
            'background-color': ' rgba(0,0,0,0.5)',
            'background-size': ' 100%',
            'background-repeat': ' no-repeat',
            'z-index': ' 1000',
        });

        bg.click(function (e) {
            $(this).hide();
        });

        $('body').append(bg);
    };


    /**
     * 判断设备类型
     * **/
    commonService.isIosOrAndroid = function () {
        var u = navigator.userAgent, isAndroid, isiOS, app = 1;
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isAndroid) {
            app = 1;
        }
        if (isiOS) {
            app = 2;
        }
        return app;
    };


    /**
     *  判断是否微信浏览器
     * */
    commonService.isWeixin = function () {
        var hostName = $window.location.hostname;
        if (hostName.indexOf('h5-api') != -1) {
            return $cookies.get(OPENID_KEY) && navigator.userAgent.indexOf('MicroMessenger') > -1 ? true : false;
        } else {
            return false;
        }
    };

    /**
     *  检查数组中是否含有某值
     * */
    commonService.inArray = function (needle, array, bool) {
        if (typeof needle == "string" || typeof needle == "number") {
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (needle === array[i].objId) {
                    if (bool) {
                        return i;
                    }
                    return true;
                }
            }
            return false;
        }
    };

    /**
     *   合并数组
     * */
    commonService.merge = function () {
        return Array.prototype.concat.apply([], arguments);
    };

    /**
     * 生成任意长度随机字母数字组合
     * @params: randomFlag -是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
     * */
    commonService.randomStr = function (randomFlag, min, max) {
        var str = "",
            range = min,
            pos,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    };

    return commonService;
});

/**
 * 封装localStorage的方法
 */
angular.module("yunwaApp").factory('locals', ['$window', function ($window) {
    return {
        set: function (key, value) { //存储单个属性
            // 判断是否无痕浏览模式
            if (typeof localStorage === 'object') {
                try {
                    $window.localStorage[key] = escape(value);
                } catch (e) {
                    alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
                    return;
                }
            }
        },
        get: function (key, defaultValue) {  //读取单个属性
            // 判断是否无痕浏览模式
            if (typeof localStorage === 'object') {
                try {
                    return unescape($window.localStorage[key] || defaultValue);
                } catch (e) {
                    alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
                    return;
                }
            }
        },
        getParam: function (c) {
            var cookieValue = this.get(c);
            var theRequest = {};
            if (cookieValue) {
                if (cookieValue.indexOf("&") != -1) {
                    var str = cookieValue.split("&");
                    for (var i = 0; i < str.length; i++) {
                        theRequest[str[i].split("=")[0]] = str[i].split("=")[1];
                    }
                } else {
                    theRequest[cookieValue.split("=")[0]] = cookieValue.split("=")[1];
                }
                return theRequest;
            } else {
                return false;
            }
        },
        setObject: function (key, value) { //存储对象，以JSON格式存储
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {  //读取对象
            return JSON.parse($window.localStorage[key] || '{}');
        },
        remove: function (key) {
            $window.localStorage[key] = '';
            delete $window.localStorage[key];
        }
    }
}]);

/**
 *  封装商家或全维二维码请求
 */
angular.module("yunwaApp").factory("QRCodeService", ["$http", "$rootScope", "$stateParams", "$cookies",
    function ($http, $rootScope, $stateParams, $cookies) {
        // 封装请求参数
        var config = {
            method: 'get',                                              // 方法类型
            url: '/h5/branch/group/qrcode',                             // 地址
            headers: {"Content-Type": "text/json; charset=UTF-8"},      // 头部
            cache: false,                                              // 是否使用缓存
            timeout: 30000,                                             // 响应时长
            params: {}                                                  // 参数
        };

        var getQRCode = function () {
            config.params.branchId = $stateParams.branchId || $cookies.get('branchId'); // 门店ID
            if (config.params.branchId) {
                $http(config).success(function (data) {
                    var res = data.body;
                    if (res.apiStatus == 0) {
                        $rootScope.qrCodeUrl = res.qrCodeUrl;
                    }
                }).error(function () {
                    $rootScope.qrCodeUrl = 'yunwa/common/img/qrcode.png';
                });
            }
        };

        return {
            getQRCode: getQRCode
        };
    }]);

/**
 * 关注公众号 弹框
 */
function openQrcode() {
    $('.follow_wechat_mask').fadeIn();
}
function closeQrcode() {
    $('.follow_wechat_mask').fadeOut();
}


//微信 扫一扫
angular.module("yunwaApp").factory("SweepService", function ($http, $window, $cookies, $state, $q, CommonService) {

    var jsApiParams = function () {
        var api_res = {};
        api_res = $q.defer();
        // 封装请求参数
        var config = {
            method: 'post',                                               // 方法类型
            /*url: '/h5/jsApiParams/get',  */                                // 地址
            url: '/weixin/jssdk/config',
            params: {                                                    // 参数
                url: location.href.split('#')[0],
                app_key: APP_KEY
            },
            headers: {"Content-Type": "text/json; charset=UTF-8"},       // 头部
            cache: false,                                              // 是否使用缓存
            timeout: 30000                                               // 响应时长
        };

        $http(config).success(function (data) {
            timestamp = data.timestamp;
            nonceStr = data.nonceStr;
            signature = data.signature;

            var config = data,
                auth_list = ['scanQRCode', 'configWXDeviceWiFi'];
            wx.config({
                beta: true,
                debug: false,
                appId: config.appId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.signature,
                jsApiList: auth_list
            });
            wx.ready(function (data) {
                api_res.resolve({});
            })

        }).error(function () {
            CommonService.showToast("微信扫一扫接口初始化失败！");
        });
        return api_res.promise;
    };

    var wx_sweep = function () {
        return jsApiParams();
    };

    return {
        wx_sweep: wx_sweep
    };
});
