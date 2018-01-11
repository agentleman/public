/**
 *  公共类库
 *  -----------------------------
 *  一张网页，要经历怎样的过程，才能抵达用户面前
 *  一个特效，要经历这样的修改，才能让用户点个赞
 *  一个产品，创意源于生活，源于内心，需要慢慢品味
 **************************************/
var DEFAULT_LONGITUDE = '120.730435', DEFAULT_LATITUDE = '31.273391', DEFAULT_PROVINCE = "江苏省", DEFAULT_CITY = '苏州市', toast_timer = 0, _hmt = _hmt || [], ak = 'st0gFj52DcKZqy4QwcrGtaqG', wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
var typeLocation, urlLocation, paramLocation, callbackLocation, hasLoadingLocation;

// 监听手机横竖屏
var updateOrientation = function(){ if(window.orientation=='-90' || window.orientation=='90') alert('为了更好的体验，请您将手机竖过来看吧'); }; window.onorientationchange = updateOrientation;

// 监听网络是否离线
window.addEventListener("offline", function() { showToast('请检查您的网络是否正常',10000); }, true);


/**
 * cookie操作
 * 设置cookie的方法为：cookie.set(key,val,day);
 * 获取cookie的方法为：cookie.get(key);
 * 删除cookie的方法为：cookie.del(key);
 * */
var cookie = {
	set: function(key,val,hour){ // 设置cookie方法
		var date = new Date(); // 获取当前时间
		if(typeof hour === 'undefined'){ hour = 24 } ;
		date.setTime(date.getTime() + hour*3600*1000); // 格式化为cookie识别的时间
		document.cookie = key + "=" + escape(val) +";expires=" + date.toGMTString() + ";path=/"; // 设置cookie
	},
	get: function(key){ // 获取cookie方法
		var getCookie = document.cookie.replace(/[ ]/g,""); // 获取cookie，并且将获得的cookie格式化，去掉空格字符
		var arrCookie = getCookie.split(";"); // 将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
		var tips; // 声明变量tips
		for(var i=0;i<arrCookie.length;i++){  // 使用for循环查找cookie中的tips变量
			var arr = arrCookie[i].split("="); // 将单条cookie用"等号"为标识，将单条cookie保存为arr数组
			if(key == arr[0]){  // 匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
				tips = unescape(arr[1]); // 将cookie的值赋给变量tips
				break; // 终止for循环遍历
			}
		}
		return tips;
	},
	del: function(key){ // 删除cookie方法
		var date = new Date();
		date.setTime(date.getTime() - 1*24*3600*1000); // 设置为前一天的时间
		if(this.get(key) != null) document.cookie= key + "="+ this.get(key) +";expires="+date.toGMTString() + ";path=/";
	},
	getParam : function (name) {
		var cookieValue = cookie.get(name); // 获取cookie
		var theRequest = {};
		if(cookieValue){
			if (cookieValue.indexOf("&") != -1) {
				var str = cookieValue.split("&");
				for (var i = 0; i < str.length; i++) {
					theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
				}
			}else{
				theRequest[cookieValue.split("=")[0]] = unescape(cookieValue.split("=")[1]);
			}
			return theRequest;
		}else{
			return false;
		}
	}
};
var wx_token = cookie.get(WXTOKEN_KEY);
/**
 * 微信相关
 * */
var $wx = {
	init: function(){
		var _wx = document.createElement("script");
		_wx.src = "http://res.wx.qq.com/open/js/jweixin-1.0.0.js";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(_wx, s);
	},
	getDomain: function(){
		var wx_current_domain = cookie.get('wx_current_domain');
		if(wx_current_domain != undefined){
			$wx.share(document.title, document.title, wx_current_domain+'/weixin/authRedirect/shareStore?redirect='+window.location.pathname+window.location.search, window.location.protocol+'//'+window.location.host+'/QWWX/common/img/icon_300.png');
		}else{
			getJson('GET', '/h5/system/getDomain', null, function (data) {
				if(data.result == 'OK'){
					var res = data.body;
					if(res.apiStatus == 0){
						cookie.set('wx_current_domain',res.weixinDomain);
						$wx.share(document.title, document.title, res.weixinDomain+'/weixin/authRedirect/shareStore?redirect='+window.location.pathname+window.location.search, window.location.protocol+'//'+window.location.host+'/QWWX/common/img/icon_300.png');
					}else{
						showToast(res.apiMessage,2000);
					}
				}
			});
		}
	},
	share: function(title,desc,link,imgUrl){
		$wx.init();
		var params = { url: window.location.href };
		getJson('GET', '/h5/jsApiParams/get', params, function (data) {
			if(data.result != 'FAIL'){
				var config = data.body;
				var shareData = { title: title, desc: desc, link: link, imgUrl: imgUrl, type: 'link', dataUrl: '', success: function () { showToast('分享成功！'); }, cancel: function () { } };
				var shareData2 = { title: desc, desc: title, link: link, imgUrl: imgUrl, type: 'link', dataUrl: '', success: function () { showToast('分享成功！'); }, cancel: function () { } };
				var auth_list = ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareQZone','onMenuShareWeibo','hideOptionMenu','showOptionMenu','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem'];
				wx.config({debug: false,appId: config.appId,timestamp: config.timestamp,nonceStr: config.nonceStr,signature: config.signature,jsApiList: auth_list });
				wx.ready(function() {
					wx.checkJsApi({ jsApiList:auth_list, error:function(res){ showToast("您的微信客户端太低，请升级后再试！",3000); } });
					wx.onMenuShareTimeline(shareData2);
					wx.onMenuShareAppMessage(shareData);
					wx.onMenuShareQQ(shareData);
					wx.onMenuShareWeibo(shareData);
				});
			}
		});
	}
};
if(navigator.userAgent.indexOf('MicroMessenger') > -1 || navigator.userAgent.indexOf('MQQBrowser') > -1){
	$wx.getDomain();
}
//百度统计 [百度事件跟踪统计  参数：[需要统计的元素，区分是否有点击事件；标题；事件的额外信息；事件数值信息]]
var baiduTj = {
	init: function(){
		var _baiduId = location.host.indexOf('h5-api') > 0 ? "6148f8ecc2226b11d62fa297495d1ac2" : "474479cb6b572797e43983f59b26f3d4";
		var hm = document.createElement("script");
		hm.src = "//hm.baidu.com/hm.js?"+_baiduId;
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(hm, s);
	},
	baidu_event_track: function(element,title,opt_label,opt_value){
		opt_value = opt_value != undefined ? GetRequest().opt_value : '';
		if(element != null && element != ''){
			document.querySelector(element).onclick = function(){
				_hmt.push(['_trackEvent', title, opt_label, opt_value]);
			}
		}else{
			_hmt.push(['_trackEvent', title, opt_label, opt_value]);
		}
	}
};
baiduTj.init();

//显示 和 隐藏 提示框
function showToast(message,t){ var alert = document.getElementById("toast"); if(alert == null){ alert =  document.createElement("div"); alert.id = 'toast'; alert.className = 'fd'; alert.innerText = message; }else{ alert.style.opacity = .9; } document.body.appendChild(alert); t = (t != undefined) ? t : 1000; toast_timer = setTimeout("hideToast()", t); }
function hideToast(){ var alert = document.getElementById("toast"); if(alert != null) document.body.removeChild(alert); clearTimeout(toast_timer); }

//显示 和 移除loading
function showLoading(){ var loadTpl = '<div class="loader_popover"><div class="loader"><div class="loader-inner"><div></div><div></div><div></div></div></div></div>'; if($('body').find('.loader_popover').length <= 0) $('body').append(loadTpl); }
function hideLoading(){ $('.loader_popover').remove(); }

//封装ajax
function getJson(type, url, param, callback, hasLoading){ if(param != null){param.timestamp = parseInt(cookie.get("timestamp")) + new Date().getTime();param.version = wechatInfo ? '1.3' : '1.1'; }if(hasLoading != undefined && hasLoading == true){$.ajax({type: type,url : url,data : param,timeout: 30000,dataType : "json",cache : false,beforeSend: function(xhr, settings){ showLoading(); },success : callback,complete: function(xhr, status){ hideLoading(); },error: function(){ showToast('网络未连接，请重试'); }});}else{$.ajax({type: type,url : url,data : param,timeout: 30000,dataType : "json",cache : false,success : callback,error: function(){ showToast('网络未连接，请重试'); }});}}

// 星级加载
function userStar(star) { var fullStar = Math.floor(star / 2), halfStar = star % 2, returnImg = "", n = 0; for (var i = 0; i < fullStar; i++) { returnImg += "<img src='/QWWAP_NG/common/img/star.png' />"; n++; } if (halfStar != 0) { returnImg += "<img src='/QWWAP_NG/common/img/half_star.png' />"; n++; } for (var j = 0; j < 5 - n; j++) { returnImg += "<img src='/QWWAP_NG/common/img/star_no.png' />"; } return returnImg; }

// 空页面
function showEmpty(txt,el,pic){ if(txt == undefined) txt = ''; if(el == undefined) el = '.wrap'; pic = pic != undefined ? pic : '/QWWAP_NG/common/img/fail.png'; $(el).html('<div class="noContent" style="width: 100%;height: 100%;"><img style="width: 30%;height: auto;margin: 20% 0 30px 35%;" width="100%" src="'+pic+'"><p style="font-size: 18px;color: #c0c5d0;text-align: center">'+txt+'</p></div>');}

// 获取url参数
function GetRequest(isencode) { var url = location.search; if(isencode != undefined && isencode == 1){ url = decodeURI(location.search); } var theRequest = {}; if (url.indexOf("?") != -1) { var str = url.substr(1); strs = str.split("&"); for (var i = 0; i < strs.length; i++) { theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]); } } return theRequest; }

// 文字新闻上下滚播 (参数1：请求的URL，参数2：发送到服务器的数据，参数3：元素ID或Class，参数4：回调)
function marquee(requestUrl,requestParams,el,callback) { if(requestUrl!=undefined) getJson('get',requestUrl, requestParams, callback);clearInterval(t);var t = setInterval(function () {var ul = $(el).find('ul'), liHeight = ul.find("li:last").height();ul.animate({marginTop: liHeight + "px"}, 1000, function() {ul.find("li").next().prependTo(ul);ul.find("li:first").hide();ul.css({marginTop: 0});ul.find("li:first").show();});}, 3000);}

// 通用左右滑动【可用于轮播或代金券】  (参数1：元素ID或Class，参数2：可见图片数量，参数3：图片间距)
function slide(el,num,margin,isPage) { if(isPage != undefined){ var mySwiper = new Swiper(el, { touchMoveStopPropagation: false, pagination: '.swiper-pagination', paginationClickable: true, spaceBetween: parseInt(margin), slidesPerView: parseInt(num), preloadImages: false, lazyLoading: true }); }else{var mySwiper = new Swiper(el, {touchMoveStopPropagation: false,slidesPerView: parseInt(num),spaceBetween: parseInt(margin),preloadImages: false,lazyLoading: true});}}

// 验证手机号 (参数1：输入框元素，参数2：提交按钮元素，参数3：验证成功的回调方法)
function checkTelphone(inputEl,btnEl,callback){ $(btnEl).on('click',function(){ var tel = $(inputEl).val(), telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/); if(tel == ''){ showToast('请输入手机号码！'); }else if(tel.length != 11 || telReg == false){ showToast('手机号码格式错误！'); }else{ callback(); }});}

//判断是否设备系统
function isIosOrAndroid(){ var u = navigator.userAgent,isAndroid,isiOS,app; isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); if(isAndroid) { app = 1;} if(isiOS){ app = 2;} return app;}

// 过滤html标签
function removeHTMLTag(str) {str = str.replace(/<\/?[^>]*>/g,'');str = str.replace(/[ | ]*\n/g,'\n');str = str.replace(/\n[\s| | ]*\r/g,'\n');str = str.replace(/ /ig,'');str = str.replace(/\s+/g,"");return str;}

// 数组去重
function unique(arr) { var result = [], hash = {}; for (var i = 0, elem; (elem = arr[i]) != null; i++) { if (!hash[elem]) { result.push(elem); hash[elem] = true; } } return result;}

//并过滤特殊符号
function check_str(s) { var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); var rs = ""; for (var i = 0; i < s.length; i++) { rs = rs+s.substr(i, 1).replace(pattern, ''); } return rs; }

//底部导航增加时间戳
$(".footer_navs").find("a").unbind("click").bind("click",function(event){ event.preventDefault(); window.location.href = this.href + "?isFromNav=true&time=" + new Date().getTime();});

//获取头部refid值默认存储到缓存中 by yuanjie
var _refid = typeof(GetRequest().refid) !="undefined" ? GetRequest().refid : "", _cokRefid = typeof(cookie.get("refid")) !="undefined" ? cookie.get("refid") : ""; if(_cokRefid != ""){ if(_refid !="") { if(_refid  !=_cokRefid){ cookie.set("refid",_refid,720); } } }else{ cookie.set("refid",_refid,720); }

// 请求并缓存接口时间
$(function(){ if(!cookie.get("timestamp")){ $.ajax({type: "get",url : "/time",data : "",timeout: 30000,dataType : "json",cache : false,async : false, beforeSend: function(xhr, settings){  }, success : function(data){ var res = data.body; if(res.apiStatus == 0){ var timestamp = parseInt(res.check_timestamp) - new Date().getTime(); cookie.set("timestamp",timestamp); }else{ showToast(res.apiMessage); }},complete: function(xhr, status){ },error: function(){ cookie.set("timestamp",0);}});} });

// 初始化数组
function stringBuffer() { this._strs = []; }
// 添加字符串
stringBuffer.prototype.append = function(str) { this._strs.push(str); };
stringBuffer.prototype.toString = function() { return this._strs.join(""); };
