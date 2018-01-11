/**
 *  wafaWAP Angular框架-自定义指令
 *  -----------------------------
 *  一张网页，要经历怎样的过程，才能抵达用户面前
 *  一个特效，要经历这样的修改，才能让用户点个赞
 *  一个产品，创意源于生活，源于内心，需要慢慢品味
 **************************************/
'use strict';
/**
 * 门店星级标签
 * eg: <branch-star star-num="1"></branch-star>
 */
angular.module("yunwaApp").directive('branchStar', function() {
    // 局部变量
    var star_no_img = '<img ng-src="/QWWAP_NG/common/img/star_no.png" />',
        half_star_img = '<img ng-src="/QWWAP_NG/common/img/half_star.png" />',
        star_img = '<img ng-src="/QWWAP_NG/common/img/star.png" />';

    return{
        restrict: 'E',
        scope: {
            starNum: '='
        },
        template: '<div id="store_star"><p class="store_star" ng-if="starNum==0">' +
        star_no_img +
        star_no_img +
        star_no_img +
        star_no_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==1">' +
        half_star_img +
        star_no_img +
        star_no_img +
        star_no_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==2">' +
        star_img +
        star_no_img +
        star_no_img +
        star_no_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==3">' +
        star_img +
        half_star_img +
        star_no_img +
        star_no_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==4">' +
        star_img +
        star_img +
        star_no_img +
        star_no_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==5">' +
        star_img +
        star_img +
        half_star_img +
        star_no_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==6">' +
        star_img +
        star_img +
        star_img +
        star_no_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==7">' +
        star_img +
        star_img +
        star_img +
        half_star_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==8">' +
        star_img +
        star_img +
        star_img +
        star_img +
        star_no_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==9">' +
        star_img +
        star_img +
        star_img +
        star_img +
        half_star_img +
        '</p>'+
        '<p class="store_star" ng-if="starNum==10">' +
        star_img +
        star_img +
        star_img +
        star_img +
        star_img +
        '</p></div>',
        replace: true
    };
});

/**
 * 图片资源加载错误时，图片替换指令
 * eg: <img ng-src="{{currentUrl}}" err-src="img/404.jpg"/>
 */
angular.module("yunwaApp").directive("errSrc", function() {
    return {
        restrict: 'A',
        scope: {
            errSrc: '@'
        },
        link: function($scope, $element, $attrs) {
            // 当图片路径失效时，绑定错误默认图片
            $element.bind("error", function() {
                if ($attrs.src != $attrs.errSrc) {
                    $attrs.$set("src", $attrs.errSrc);
                }
                // 根据隐藏域中的图片路径判断是否失效，调整背景图的路径
                var next = $element.next();
                if(next.hasClass("pro_img")){
                    next.addClass("errorImg");
                }
            });
        }
    }
});

/**
 * 其中$sce是angularJS自带的安全处理模块，$sce.trustAsHtml(input)方法便是将数据内容以html的形式进行解析并返回。
 * 将此过滤器添加到ng-bind-html所绑定的数据中，便实现了在数据加载时对于html标签的自动转义。
 */
angular.module("yunwaApp").filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});

/**
 * 全局提示 showEmpty指令
 * eg:
 *  <show-empty ng-repeat="n in globaltips" ng-if="n.isshow" pic="n.pic" msg="n.msg"></show-empty>
 */
angular.module("yunwaApp").directive('showEmpty',[function(){
    return {
        restrict: 'E',
        template: "<div class='noContent'><img class='failImg' width='100%' ng-src='{{pic}}'><p class='failTxt' ng-bind-html='msg | trustHtml'></p></div>",
        scope : {
            msg : "=",
            pic : "="
        },
        link: function($scope, iElm, iAttrs, controller) {
            $scope.msg = $scope.msg;
        },
        replace: true
    };
}]);

/**
 * 关键词/药房搜索-结果高亮指令
 * eg:
 *  <keyword-sel keyword="" content=""></keyword-sel>
 */
angular.module("yunwaApp").directive('keywordSel',[ function(){
    return {
        restrict: 'E',
        template: '<p ng-bind-html="result | trustHtml"></p>',
        scope : {
            content : "=",
            keyword : "="
        },
        controller: function($scope) {
            var content = $scope.content;
            var keyword = $scope.keyword;
            if(content.indexOf(keyword) > -1){
                var invalid = /[.~!@#$%\^\+\*&\\\/\?\|:\.{}()';="]+/g;
                var a = keyword;
                if(!keyword.match(invalid)){
                    // 排除特殊字符存在场景
                    a = new RegExp(keyword, "gi");
                }
                content = content.replace(a,("<span>" + keyword+ "</span>"));
            }
            $scope.result = content;
        },
        replace: true
    };
}]);