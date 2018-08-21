$(function(){

    /*----------------------------------------------表格初始化-------------------------------------*/

    //表格初始化
    var col = [

        {
            title:'编号',
            data:'BH'
        },
        {
            title:'名称',
            data:'MC'
        },
        {
            title:'类别',
            data:'LB'
        },
        {
            title:'型号',
            data:'XH'
        },
        {
            title:'品牌',
            data:'PP'
        },
        {
            title:'机组状态',
            data:'JZZT'
        },
        {
            title:'冷水阀开度',
            data:'LSFKD'
        },
        {
            title:'加湿器状态',
            data:'JSQZT'
        },
        {
            title:'回风温度',
            data:'HFWD'
        },
        {
            title:'送风温度',
            data:'SFWD'
        },
        {
            title:'过滤器压差开关',
            data:'GLQYC'
        },
        {
            title:'风机频率',
            data:'FJPL'
        },

    ]

    _tableInit($('#table'),col,1,true,'','',false,'');

    //获取数据设备表格数据
    var arr = [

        {
            "BH":"K1",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"LBT1",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"90%",
            "JSQZT":"关",
            "HFWD":"25.4",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"50"
        },
        {
            "BH":"K2",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"LBT1",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"85%",
            "JSQZT":"关",
            "HFWD":"25.4",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"50"
        },
        {
            "BH":"K3",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"LBT1",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"95%",
            "JSQZT":"关",
            "HFWD":"26.7",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"50"
        },
        {
            "BH":"K4",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"LBT1",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"68%",
            "JSQZT":"关",
            "HFWD":"25.4",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"49"
        },
        {
            "BH":"K5",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"LBT1",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"88%",
            "JSQZT":"关",
            "HFWD":"25.4",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"49"
        },
        {
            "BH":"K6",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"LBT1",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"90%",
            "JSQZT":"开",
            "HFWD":"25.5",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"50"
        },
        {
            "BH":"K7",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"STZ3",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"90%",
            "JSQZT":"关",
            "HFWD":"25.4",
            "SFWD":"21",
            "GLQYC":"正常",
            "FJPL":"45"
        },
        {
            "BH":"K8",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"STZ3",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"98%",
            "JSQZT":"关",
            "HFWD":"26.1",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"50"
        },
        {
            "BH":"K9",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"STZ3",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"97%",
            "JSQZT":"关",
            "HFWD":"25.4",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"50"
        },
        {
            "BH":"K10",
            "MC":"精密空调",
            "LB":"HVAC",
            "XH":"STZ3",
            "PP":"立波特",
            "JZZT":"运行",
            "LSFKD":"80%",
            "JSQZT":"关",
            "HFWD":"26.1",
            "SFWD":"20.5",
            "GLQYC":"正常",
            "FJPL":"50"
        }

    ]

    _datasTable($('#table'),arr);


    //按钮点击事件

    $('.loop-tip').on('click','div',function(){

        $('.loop-tip').children().removeClass('loop-active');

        $(this).addClass('loop-active');

        $('.loop-block').children('div').hide();

        $('.loop-block').children('div').eq($(this).index()).show();

    })

    //时间
    _timeYMDComponentsFun($('.datatimeblock'));

    $('#selected').click(function(){

        $('.duibi').attr('src','img/duibiquxian.png');

    })

})