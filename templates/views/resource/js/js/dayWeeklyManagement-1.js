$(function(){
    //时间插件
    $('.time').datepicker(
        {
            language:  'zh-CN',
            todayBtn: 1,
            todayHighlight: 1,
            format: 'yyyy-mm-dd'
        }
    )
    //新增日志
    $('.btn2').click(function(){
        $('.bianjirizhi').toggle();
        $('.content-main-contents-header').toggle();
        $('.content-main-contents').toggle();
    });
    //保存日志
    //取消按钮
    $('.cancel').click(function(){
        if($('.bianjirizhi')){
            $('.bianjirizhi').hide();
            $('.content-main-contents-header').show();
            $('.content-main-contents').show();
        }
    })
    //保存按钮
    $('.save').click(function(){
        alert('保存成功！');
        if($('.bianjirizhi')){
            $('.bianjirizhi').hide();
            $('.content-main-contents-header').show();
            $('.content-main-contents').show();
        }
    })
})