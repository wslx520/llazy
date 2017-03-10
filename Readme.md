## llazy

llazy 是一个非常简单的图片 lazyload 库。无依赖，不需要构建，也没有压缩。

示例就在 index.html 里

兼容到IE8（更低的没测）



### 使用方法

```javascript
// no param 'ops', will use default options
llazy('#cont img');
// post custom ops
llazy('#cont-hor img', {
	container: '#cont-hor', // default is root
	src: 'data-src', // default is 'data-src'
    onload: function (img) {
        // 可以在这里头操作 img，也可以访问其父节点
        img.style.backgroundColor = '#f00';
    }
});
```

