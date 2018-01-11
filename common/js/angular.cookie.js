/*
 AngularJS v1.4.1
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
 */
(function(p, g, l) {
    'use strict';
    function m(b, a, f) {
        var c = f.baseHref(),
            k = b[0];
        return function(b, d, e) {
            var f,
                h;
            e = e || {};
            h = e.expires;
            f = g.isDefined(e.path) ? e.path: c;
            d === l && (h = "Thu, 01 Jan 1970 00:00:00 GMT", d = "");
            g.isString(h) && (h = new Date(h));
            d = b + "=" + d;
            d = d + (f ? ";path=" + f: "") + (e.domain ? ";domain=" + e.domain: "");
            d += h ? ";expires=" + h.toUTCString() : "";
            d += e.secure ? ";secure": "";
            e = d.length + 1;
            4096 < e && a.warn("Cookie '" + b + "' possibly not set or overflowed because it was too large (" +
                e + " > 4096 bytes)!");
            k.cookie = d
        }
    }
    g.module("ngCookies", ["ng"]).provider("$cookies", [function() {
        var date = new Date(); // 获取当前时间
        date.setTime(date.getTime() + 24*3600*1000); // 格式化为cookie识别的时间
        var b = this.defaults = {
            'expires': date.toGMTString(),
            'path': '/'
        };
        this.$get = ["$$cookieReader", "$$cookieWriter",
            function(a, f) {
                return {
                    get: function(c) {
                        return (c=a()[c]) ? unescape(c): c
                    },
                    getParam: function(c){
                        var cookieValue = this.get(c);
                        var theRequest = {};
                        if(cookieValue){
                            if (cookieValue.indexOf("&") != -1) {
                                var str = cookieValue.split("&");
                                for (var i = 0; i < str.length; i++) {
                                    theRequest[str[i].split("=")[0]] = str[i].split("=")[1];
                                }
                            }else{
                                theRequest[cookieValue.split("=")[0]] = cookieValue.split("=")[1];
                            }
                            return theRequest;
                        }else{
                            return false;
                        }
                    },
                    getObject: function(c) {
                        return (c = this.get(c)) ? c : c
                    },
                    getAll: function() {
                        return a()
                    },
                    put: function(c, a, n) {
                        f(c, escape(a), n ? g.extend({},
                            b, n) : b)
                    },
                    putObject: function(c, b, a) {
                        this.put(c, b, a)
                    },
                    remove: function(a, k) {
                        f(a, l, k ? g.extend({},
                            b, k) : b)
                    }
                }
            }]
    }]);
    g.module("ngCookies").factory("$cookieStore",
        ["$cookies",
            function(b) {
                return {
                    get: function(a) {
                        return b.getObject(a)
                    },
                    put: function(a, f) {
                        b.putObject(a, f)
                    },
                    remove: function(a) {
                        b.remove(a)
                    }
                }
            }]);
    m.$inject = ["$document", "$log", "$browser"];
    g.module("ngCookies").provider("$$cookieWriter",
        function() {
            this.$get = m
        })
})(window, window.angular);