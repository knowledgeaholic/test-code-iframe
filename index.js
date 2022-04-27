/*! jquery.iframetracker v2.1.0 | https://github.com/vincepare/iframeTracker-jquery | Copyright (c) 2013-2018 Vincent Paré | Licensed Apache-2.0 */ ! function(e, r) {
    "function" == typeof define && define.amd ? define(["jquery"], function(e) {
        return r(e)
    }) : "object" == typeof module && module.exports ? module.exports = r(require("jquery")) : r(e.jQuery)
}(this, function(e) {
    ! function(e) {
        e.fn.iframeTracker = function(r) {
            "function" == typeof r && (r = {
                blurCallback: r
            });
            var t = this.get();
            if (null === r || !1 === r) e.iframeTracker.untrack(t);
            else {
                if ("object" != typeof r) throw new Error("Wrong handler type (must be an object, or null|false to untrack)");
                e.iframeTracker.track(t, r)
            }
            return this
        }, e.iframeTracker = {
            focusRetriever: null,
            focusRetrieved: !1,
            handlersList: [],
            isIE8AndOlder: !1,
            init: function() {
                try {
                    !0 === e.browser.msie && e.browser.version < 9 && (this.isIE8AndOlder = !0)
                } catch (e) {
                    try {
                        navigator.userAgent.match(/(msie) ([\w.]+)/i)[2] < 9 && (this.isIE8AndOlder = !0)
                    } catch (e) {}
                }
                if (e(window).focus(), e(window).blur(function(r) {
                        e.iframeTracker.windowLoseFocus(r)
                    }), e("body").append('<div style="position:fixed; top:0; left:0; overflow:hidden;"><input style="position:absolute; left:-300px;" type="text" value="" id="focus_retriever" readonly="true" /></div>'), this.focusRetriever = e("#focus_retriever"), this.focusRetrieved = !1, this.isIE8AndOlder) {
                    this.focusRetriever.blur(function(r) {
                        r.stopPropagation(), r.preventDefault(), e.iframeTracker.windowLoseFocus(r)
                    }), e("body").click(function(r) {
                        e(window).focus()
                    }), e("form").click(function(e) {
                        e.stopPropagation()
                    });
                    try {
                        e("body").on("click", "form", function(e) {
                            e.stopPropagation()
                        })
                    } catch (e) {
                        console.log("[iframeTracker] Please update jQuery to 1.7 or newer. (exception: " + e.message + ")")
                    }
                }
            },
            track: function(r, t) {
                t.target = r, e.iframeTracker.handlersList.push(t), e(r).bind("mouseover", {
                    handler: t
                }, e.iframeTracker.mouseoverListener).bind("mouseout", {
                    handler: t
                }, e.iframeTracker.mouseoutListener)
            },
            untrack: function(r) {
                if ("function" == typeof Array.prototype.filter) {
                    e(r).each(function(r) {
                        e(this).unbind("mouseover", e.iframeTracker.mouseoverListener).unbind("mouseout", e.iframeTracker.mouseoutListener)
                    });
                    var t = function(e) {
                        return null !== e
                    };
                    for (var i in this.handlersList) {
                        for (var o in this.handlersList[i].target) - 1 !== e.inArray(this.handlersList[i].target[o], r) && (this.handlersList[i].target[o] = null);
                        this.handlersList[i].target = this.handlersList[i].target.filter(t), 0 === this.handlersList[i].target.length && (this.handlersList[i] = null)
                    }
                    this.handlersList = this.handlersList.filter(t)
                } else console.log("Your browser doesn't support Array filter, untrack disabled")
            },
            mouseoverListener: function(r) {
                r.data.handler.over = !0, e.iframeTracker.retrieveFocus();
                try {
                    r.data.handler.overCallback(this, r)
                } catch (e) {}
            },
            mouseoutListener: function(r) {
                r.data.handler.over = !1, e.iframeTracker.retrieveFocus();
                try {
                    r.data.handler.outCallback(this, r)
                } catch (e) {}
            },
            retrieveFocus: function() {
                document.activeElement && "IFRAME" === document.activeElement.tagName && (e.iframeTracker.focusRetriever.focus(), e.iframeTracker.focusRetrieved = !0)
            },
            windowLoseFocus: function(e) {
                for (var r in this.handlersList)
                    if (!0 === this.handlersList[r].over) try {
                        this.handlersList[r].blurCallback(e)
                    } catch (e) {}
            }
        }, e(document).ready(function() {
            e.iframeTracker.init()
        })
    }(e)
});
