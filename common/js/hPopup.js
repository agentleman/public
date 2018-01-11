/*
 * @desc 弹窗插件
 * update on 2016/6/22
 *
 * ================================================================================
 //一个参数：
 //hPopup("我是一个参数测试【信息内容】!");

 //两个参数：
 //hPopup("我是二个参数测试【信息内容+图标】!", {type: "error"});
 //hPopup("我是二个参数测试【信息内容+执行函数】，确定要删除这条数据吗？", function(){ hPopup("调用后的执行效果，数据删除成功！"); });

 //三个参数：
 //hPopup("我是三个参数测试【信息内容+图标+执行函数】确定要编辑这条数据吗？", {type: "confirm",lock: true}, function(){ hPopup("调用【图标+执行函数】后的结果！"); });

 */
!function(w, $){
	/**工厂构造函数*/
	Factory = function(configs){
		var _i = this, c = _i.options;
		_i.config = $.extend({}, c, configs);

		//实例化弹窗
		if(!(_i instanceof Factory)){
			return new Factory(configs);
		}
		_i.init();
	};
	Factory.prototype = {
		options: {
			dom: "hPopup",			    //标识弹窗，用于关闭所有
			id: "hPop",				    //弹窗ID (不同ID对应不同弹窗)
			title: false,				//标题(为false时隐藏标题)
			content: "",				//消息内容
			bottom: true,				//底部(为false时隐藏底部)
			showImg: false,            //显示图片(为false时隐藏)
			type: "success",			//图标类型 error|success
			padding: "20px",			//内容填充区域
			lock: true,					//锁定屏幕(遮罩)
			fixed: true,				//是否固定定位
			zIndex: 9999,				//设置元素层叠
			time: 0,					//定时关闭
			btn: "确定",				//按钮(String/Array) 	btn:"确定" | btn:["确定", "取消"] | btn: ['按钮1', '按钮2', '按钮3', …]
			onShow: null,				//打开弹窗成功回调方法
			onOk: null,					//确定按钮回调方法
			onClose: null,				//关闭按钮回调方法
			alpha: [".4", "#000"],	    //设置遮罩层背景及透明度
			skinPath: "/yunwa/common/img/" //图片路径
		},
		init: function(){
			var _i = this, opt = _i.config, c = null, popWin = null, offsetL, offsetT;
			_i.isfixed = (opt.fixed || opt.time) ? true : false;
			if($("#" + opt.id)[0]) { return; }

			c = $("<div id='"+opt.id+"' class='"+opt.dom+"'></div>");
			c.html(
				/**遮罩*/
				(opt.lock ? '<div class="'+opt.dom+'Overlay"></div>' : '')
				/**窗体*/
				+ '<div class="'+opt.dom+'Wrapper anim-ui-wrapper">'
					/*标题区域*/
				+ (opt.title ? '<div class="'+opt.dom+'Head"><div class="'+opt.dom+'Title">'+opt.title+'</div></div>' : '')
					/*内容区域*/
				+ '<div class="'+opt.dom+'Body">'
				+	(opt.type ? '<div style="text-align:center;"> ' + (opt.showImg ? '<img src="'+ opt.skinPath + opt.type +'_icon.png"/>' : '') + ' <p style="text-align:center;padding:15px 0 10px;font-size:16px;color:#333;">' + opt.content + '</p></div>' : opt.content)
				+ '</div>'
					/*底部区域*/
				+ (opt.bottom && opt.btn ? function(){
					/*定义多个按钮*/
					var btn = "", btnClassName = '';
					typeof opt.btn === "string" && (opt.btn = [opt.btn]);
					$.each(opt.btn, function(i, v){
						if(opt.btn.length > 1){
							btnClassName = 'btn_line';
						}
						btn += '<a class="hBtns '+opt.dom+'Btn'+i+' '+btnClassName+'" style="width: '+ (100 / opt.btn.length - 1)+'%">'+v+'</a>';
					});
					return '<div class="'+opt.dom+'Foot"><div class="'+opt.dom+'Btns">'+ btn +'</div></div>';
				}() : '')
				+ '</div>'
			);
			$("body").append(c); //插入到body最后

			/**锁屏设置*/
			_i.overlay = c.find('.'+opt.dom+"Overlay");
			_i.overlay.css({
				"background-color": opt.alpha[1] || "#000",
				"opacity": 0,
				"z-index": _i.maxIndex() + 1
			}).fadeTo(300, opt.alpha[0]);

			_i.popWin = popWin = c.find('.'+opt.dom+"Wrapper");
			popWin.css({
				"position": _i.isfixed ? "fixed" : "absolute",
				"z-index": _i.maxIndex() + 1
			});

			_i.body = _i.popWin.find('.'+opt.dom+"Body");
			_i.body.css({
				"padding-top": opt.padding,
				"padding-bottom": opt.padding
			});

			offsetL = ($(window).width() - popWin.outerWidth()) / 2;
			offsetT = ($(window).height() - popWin.outerHeight()) / 2;

			/**弹窗定位*/
			popWin.css({
				"left": _i.isfixed ? offsetL : $(document).scrollLeft() + offsetL,
				"top": _i.isfixed ? offsetT : $(document).scrollTop() + offsetT
			});

			_i.ui_overlay = c.find('.'+opt.dom+"Overlay");
			_i.ui_close = c.find('.'+opt.dom+"Close");

			//弹窗事件
			_i.callback();
		},
		callback: function(){
			var _i = this, opt = _i.config;

			opt.onShow && opt.onShow(_i);
			//弹窗自动关闭
			if(opt.time){
				setTimeout(function(){
					_i.close();
				}, opt.time * 1000);
			}

			//按钮事件
			_i.popWin.find('.'+opt.dom+"Btns a").on("click", function(){
				var index = $(this).index();

				if(index === 0){ //默认是确定按钮 [第一个按钮，可以写btn1]
					opt.onOk ? (_i.close(), opt.onOk(_i)) : _i.close();
				}else if(index === 1){ //默认是取消按钮 [第二个按钮，可以写btn2]
					_i.close();
				}else{
					opt["btn" + (index+1)] && _i.close();
				}
				opt["btn" + (index+1)] && opt["btn" + (index+1)](_i);
			});
		},
		//关闭弹窗
		close: function(){
			var _i = this, opt = _i.config;

			if($("#" + opt.id)){
				$("#" + opt.id).remove();
			}
			opt.onClose && opt.onClose(_i); //执行关闭事件
		},
		//获取弹窗最大层级
		maxIndex: function(){
			for(var idx = this.config.zIndex, elem = $("*"), i = 0, len = elem.length; i < len; i++)
				idx = Math.max(idx, elem[i].style.zIndex);
			return idx;
		}
	};

	//提供外部访问接口
	var interface = (function(){
		/*
		 ===多功能消息弹窗(合并alert和confirm)(可接收三个参数[可向左容错])===
		 1. 参数1个 信息内容
		 2. 参数2个 {a:1~2组合[信息内容~配置参数] | b:1~3组合[信息内容~执行函数]}
		 3. 参数3个 {a:1~2~3组合[信息内容~定时关闭~执行函数] | b:1~2~3组合[信息内容~配置参数~执行函数]}
		 */
		exports = function(content, options, fn){
			Factory(
				typeof content === "object" ? arguments[0] : $.extend({
					content: content,
					onOk: typeof options === "function" ? options : fn,
					btn: arguments.length === 3 ? ["确定", "取消"] : typeof options === "function" ? ["确定", "取消"] : ["关闭"]
				}, options || {})
			);
		};
		return exports;
	}());

	//提供外部接口
	w.hPopup = interface;

}(window, jQuery);