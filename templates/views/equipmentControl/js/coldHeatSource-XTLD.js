$(function(){

    //协同联动是否启用
    $('.button-control').click(function(){

        //看是否包含button-on类

        if($(this).hasClass('button-on')){

            $(this).removeClass('button-on').addClass('button-off');

        }else{

            $(this).removeClass('button-off').addClass('button-on');

        }


    })

    //表格初始化
    var col = [

        {
            title:'末端负荷率',
            data:''
        },
        {
            title:'冷机运行策略',
            data:''
        },
        {
            title:'冷冻水供水设定温度',
            data:''
        }

    ]

    _tableInitScroll($('.table'),col,2,false,'','','','','',true,500);

})