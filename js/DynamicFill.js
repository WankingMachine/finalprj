/* 触发动态加载的JS文件 */

/* 利用函数的闭包 */
(function() {
    /* 防止滑动条接近底部时重复发送请求 */
var i = 1;

function fu() {
    var regin = function() {
        i = 1;
    }
    /* 滚动条滚动的高度 */
    var scroll = document.documentElement.scrollTop;
    /* 内容的总高度 */
    var bodyHeight = document.body.scrollHeight;
    /* 浏览器窗口的高度 */
    var visHeight = document.documentElement.clientHeight;

    if((scroll + visHeight >= bodyHeight) && i === 1) {
        i = 0;
        console.log('Bingo');
        /* 来一次中断之后，再重新恢复 i 的值 */
        setTimeout(regin,2000);
    };
}

document.addEventListener('scroll',fu);
})()