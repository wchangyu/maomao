$(function(){
    //新增日志
    $('.btn1').click(function(){
        $('.zhoubao').toggle();
        $('.content-main-contents-header').toggle();
        $('.content-main-contents').toggle();
    });
    //取消按钮
    $('.cancel').click(function(){
        if($('.zhoubao')){
            $('.zhoubao').hide();
            $('.content-main-contents-header').show();
            $('.content-main-contents').show();
        }
    })
    //保存按钮
    $('.save').click(function(){
        alert('保存成功！');
        if($('.zhoubao')){
            $('.zhoubao').hide();
            $('.content-main-contents-header').show();
            $('.content-main-contents').show();
        }
    })
})