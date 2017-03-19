$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().add(1,'day').format('YYYY/MM/DD');
    $('.datatimeblock').eq(0).val(_initStart);
    $('.datatimeblock').eq(1).val(_initEnd);


})