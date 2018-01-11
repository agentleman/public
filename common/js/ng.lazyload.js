angular.module('ng-lazyload', [])
    .directive('lazyContainer', [
        function(){
            var uid = 0;
            function getUid(el){
                var __uid = el.data("__uid");
                if (! __uid) {
                    el.data("__uid", (__uid = '' + ++uid));
                }
                return __uid;
            }

            return {
                restrict: 'EA',
                controller: ['$scope', '$element', function($scope, $element){
                    var elements = {};
                    function onLoad(){
                        var $el = angular.element(this);
                        var uid = getUid($el);

                        $el.css('opacity', 1);

                        if(elements.hasOwnProperty(uid)){
                            delete elements[uid];
                        }
                    }

                    function isVisible(elem){
                        var containerRect = $element[0].getBoundingClientRect();
                        var elemRect = elem[0].getBoundingClientRect();
                        var xVisible, yVisible;
                        var offset = 50;

                        if(elemRect.bottom + offset >= containerRect.top &&
                            elemRect.top - offset <= containerRect.bottom){
                            yVisible = true;
                        }

                        if(elemRect.right + offset >= containerRect.left &&
                            elemRect.left - offset <= containerRect.right){
                            xVisible = true;
                        }

                        return xVisible&&yVisible;
                    }

                    function checkImage(){
                        Object.keys(elements).forEach(function(uid){
                            var obj = elements[uid],
                                iElement = obj.iElement,
                                iScope = obj.iScope;
                            if(isVisible(iElement)){
                                iElement.attr('src', iScope.ngLazySrc);
                            }
                        });
                    }

                    this.addImg = function(iScope, iElement, iAttrs){
                        iElement.bind('load', onLoad);
                        iScope.$watch('ngLazySrc', function(){
                            var speed = "1s";
                            if (iScope.animateSpeed != null) {
                                speed = iScope.animateSpeed;
                            }
                            if(isVisible(iElement)){
                                if (iScope.animateVisible) {
                                    iElement.css({
                                        'background-color': '#fff',
                                        'opacity': 0,
                                        '-webkit-transition': 'opacity ' + speed,
                                        'transition': 'opacity ' + speed
                                    });
                                }
                                iElement.attr('src', iScope.ngLazySrc);
                            }else{
                                var uid = getUid(iElement);
                                iElement.css({
                                    'background-color': '#fff',
                                    'opacity': 0,
                                    '-webkit-transition': 'opacity ' + speed,
                                    'transition': 'opacity ' + speed
                                });
                                elements[uid] = {
                                    iElement: iElement,
                                    iScope: iScope
                                };
                            }
                        });
                        iScope.$on('$destroy', function(){
                            iElement.unbind('load');
                            var uid = getUid(iElement);
                            if(elements.hasOwnProperty(uid)){
                                delete elements[uid];
                            }
                        });
                    };

                    $element.bind('scroll', checkImage);
                    $element.bind('resize', checkImage);
                }]
            };
        }
    ])
    .directive('ngLazySrc', [
        function(){
            return {
                restrict: 'A',
                require: '^lazyContainer',
                scope: {
                    ngLazySrc: '@',
                    ngLazyErrSrc: '@',
                    animateVisible: '@',
                    animateSpeed: '@'
                },
                link: function(iScope, iElement, iAttrs, containerCtrl){
                    containerCtrl.addImg(iScope, iElement, iAttrs);
                    // 当图片路径失效时，绑定错误默认图片
                    iElement.bind("error", function() {
                        if (iAttrs.src != iAttrs.ngLazyErrSrc) {
                            iAttrs.$set("src", iAttrs.ngLazyErrSrc);
                        }
                        // 根据隐藏域中的图片路径判断是否失效，调整背景图的路径
                        var next = iElement.next();
                        if(next.hasClass("pro_img") || next.hasClass("giftPic")){
                            next.addClass("errorImg");
                        }
                    });
                }
            };
        }
    ]);