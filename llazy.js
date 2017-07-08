var llazy = (function(doc) {
    // 判断两个矩形是否相交
    function cross(r1, r2) {
        return (Math.abs((r1.left + r1.right) / 2 - (r2.left + r2.right) / 2) < ((r1.right + r2.right - r1.left - r2.left) / 2)
            && Math.abs((r1.top + r1.bottom) / 2 - (r2.top + r2.bottom) / 2) < ((r1.bottom + r2.bottom - r1.top - r2.top) / 2));
    }
    var addEvent = doc.addEventListener ? function(dom, type, listener) {
        dom.addEventListener(type, listener, false);
    } : function(dom, type, listener) {
        dom.attachEvent('on' + type, listener);
    };
    // 表示“载入”状态，用随机数确保不会与 img 其他自定义属性冲突
    var tempLoading = Math.random() + '_loading';
    var LLazy = function(imgs, ops) {
        ops = ops || {};
        imgs = typeof imgs === 'string' ? doc.querySelectorAll(imgs) : imgs;
        var container = ops.container || doc.documentElement;
        if (typeof container === 'string') {
            container = doc.querySelector(container);
        }
        var originSrc = ops.src || 'data-src';
        var onerror = function(e) {
            e = e || window.event;
            var img = e.target || e.srcElement;
            img.src = img.getAttribute(originSrc);
        };
        var isroot = (container === doc.documentElement || container === doc.body);
        // console.log(imgs, container);
        // 用 timer 做一个简单的函数节流阀
        var _timer = null;
        var onscroll = function(e) {
            console.log('scrolling');
            clearTimeout(_timer);
            _timer = setTimeout(function () {
                // var t = Date.now();
                // console.log('do scrolling todo', t);
                // window 没有 getBoundingClientRect 方法，body 与 root 才有
                var containerBox = container.getBoundingClientRect();
                var cont;
                var viewport = {
                    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                };
                if (isroot) {
                    cont = {
                        left: container.scrollLeft,
                        right: container.scrollLeft + viewport.width,
                        top: container.scrollTop,
                        bottom: container.scrollTop + viewport.height
                    };
                } else {
                    cont = containerBox;
                }
                
                // console.log(cont);
                for (var i = 0, img, rect; i < imgs.length; i++) {
                    img = imgs[i];
                    var osrc = img.getAttribute(originSrc);
                    // 如果图片没有加载过
                    if (osrc && !img[tempLoading]) {
                        rect = img.getBoundingClientRect();
                        // 在循环中输出内容到控制台，会使最终时间差变大好多倍（FF, IE）
                        // console.log(cont, rect, cross(cont, rect));
                        // 如果图片出现在可见区，则加载，并设置图片 loading 状态
                        // if (cross(cont, rect)) {
                        if (cross(cont, rect)) {
                            img.src = osrc;
                            img[tempLoading] = true;
                            // 执行 onload 函数
                            if (typeof ops.onload === 'function') {
                                ops.onload(img);
                            }
                        }
                    }
                }
                // console.log(Date.now() -t);
            }, 50);
            
        };
        // document.documentElement 并没有 onscroll事件；document.body 的 onscroll 兼容性也不好
        // 所以，默认 container 是 document.documentElement 或 body 时，则将 onscroll 监听加在 window 上
        addEvent(isroot ? window : container, 'scroll', onscroll);
        // 初始化时就执行一次 load ，加载出此时已经出现在“可视区”的图片
        onscroll();
    };
    LLazy.isCross = cross;
    return LLazy;
})(document);

