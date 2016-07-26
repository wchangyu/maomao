$(function(){
    getHeight();
})
getHeight();
window.onresize = function () {
    getHeight();
}
function getHeight(){
    //获取浏览器的高度；
    var h = window.innerHeight ||document.documentElement.clientHeight || document.body.clientHeight;
    // console.log(h);
    var heights = h * 0.70;
    $('.total-warp').css({
        height:heights
    })
}