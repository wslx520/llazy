var llazy = (function(doc) {
    // 判断两个矩形是否相交
    function cross(r1, r2) {
        if (Math.abs((r1.left + r1.right) / 2 - (r2.left + r2.right) / 2) < ((r1.right + r2.right - r1.left - r2.left) / 2)
            && Math.abs((r1.top + r1.bottom) / 2 - (r2.top + r2.bottom) / 2) < ((r1.bottom + r2.bottom - r1.top - r2.top) / 2))
            return true;
        return false;
    }
    var addEvent = doc.addEventListener ? function(dom, type, listener) {
        dom.addEventListener(type, listener, false);
    } : function(dom, type, listener) {
        dom.attachEvent('on' + type, listener);
    };
    var toArray = function (arrayLike) {
        var len = arrayLike.length, res = [], i = 0;
        for (;i < len; res.push(arrayLike[i++]));
        return res;
    };
    var LLazy = function(container, ops) {
        container = container || doc.body;
        var imgs = container.getElementsByTagName('img');
        imgs = toArray(imgs);
        var onload = function(e) {
            e = e || window.event;
            var img = e.target || e.srcElement;
            img._loaded = true;
        };
        var onerror = function(e) {
            e = e || window.event;
            var img = e.target || e.srcElement;
            img.src = img.getAttribute('data-src');
        };
        // 用 timer 做一个简单的函数节流阀
        var _timer = null;
        var onscroll = function(e) {
            console.log('scrolling');
            clearTimeout(_timer);
            _timer = setTimeout(function () {
                var t = Date.now();
                console.log('do scrolling todo', t);
                var cont = container.getBoundingClientRect();
                console.log(cont);
                for (var i = 0; i < imgs.length; i++) {
                    var img = imgs[i];
                    var rect = img.getBoundingClientRect();
                    // 在循环中输出内容到控制台，会使最终时间差变得好多倍（FF, IE）
                    // console.log(cross(cont, rect));
                    // 如果图片出现在可见区，则加载，并将已处于 loading 状态的图片移出待加载列表
                    if (!img._loading && cross(cont, rect)) {
                        img.src = img.getAttribute('data-src');
                        img._loading = true;
                        // 移出待加载数组
                        imgs.splice(i, 1);
                    }
                }
                console.log(Date.now() -t);
            }, 50);
            
        };
        addEvent(container, 'scroll', onscroll);
    };
    LLazy.isCross = cross;
    return LLazy;
})(document);


llazy(document.querySelector('#cont'));