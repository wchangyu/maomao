$(function(){

    //设备历史数据
    var _devHistoryArr = [];

    //点击表格中操作中下拉按钮
    $('#table').on('click','.button-switch',function(){

        var dom = $(this).parent().find('.hide-button').eq(0);

        if(dom.is(":hidden")){

            $(this).html('↑');

        }else{

            $(this).html('↓');
        }

        $(this).parent().find('.hide-button').toggle();


    });

    /*-----------------------------------------表格初始化----------------------------------------------*/

    //报警表格
    var col = [

        {
            title:'时间',
            data:'SJ'
        },
        {
            title:'支路',
            data:'ZL'
        },
        {
            title:'楼宇名称',
            data:'LYMC'
        },
        {
            title:'报警事件',
            data:'BJSJ'
        },
        {
            title:'报警类型',
            data:'BJLX'
        },
        {
            title:'报警条件',
            data:'BJTJ'
        },
        {
            title:'此时数据',
            data:'CSSJ'
        },
        {
            title:'报警等级',
            data:'BJDJ',
            render:function(data, type, row, meta){

                if(data == '紧急'){

                    return '<img src="img/timg.gif" alt="" style="width: 15px;vertical-align: middle;margin-top: -2px;margin-left: 5px;"><a class="urgency-alarm" href="../TJ/urgency-alarm.html">'+data+'</a>';

                }else{

                    return data;
                }


            }
        },
        {
            title:'处理状态',
            data:'CLZT'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                return "<span class='data-option option-confirm btn default btn-xs green-stripe'>确认</span>" +

                    "<span class='data-option option-query btn default btn-xs green-stripe'>查询</span>" +

                    "<span class='data-option option-GD btn default btn-xs green-stripe'>分派</span>" +

                    "<span class='button-switch'>↓</span>"+

                    "<br/><span class='data-option option-modify btn default btn-xs green-stripe hide-button'>修改范围</span>" +

                    "<span class='data-option option-delay btn default btn-xs green-stripe hide-button'>延迟报警</span>"

            }

        }

    ];

    _tableInit($('#table'),col,1,true,'','','','');

    //查询表格
    var queryCol = [

        {
            title:'报警时间',
            data:'BJSJ'
        },
        {
            title:'报警内容',
            data:'BJNR'
        },
        {
            title:'等级',
            data:'DJ'
        },
        {
            title:'设备',
            data:'SB'
        },
        {
            title:'状态',
            data:'ZT'
        },
        {
            title:'处理方法',
            data:'CLFF'
        },
        {
            title:'执行人',
            data:'ZXR'
        }

    ];

    _tableInit($('#devTable'),queryCol,1,true,'','',true,'');

    //报警数据
    conditionSelect();

    //设备历史数据
    devHistory();
    /*-----------------------------------------按钮事件-----------------------------------------------*/

    //【确认】
    $('#table').on('click','.option-confirm',function(){

        //样式修改
        cssChange($(this));

        //初始化

        $('#theLoading').modal('show');

        _moTaiKuang($('#confirm-myModal'), '确认报警', false, false ,false, '确认');

        $('#theLoading').modal('hide');

    });

    //确认【确认】按钮
    $('#confirm-myModal').on('click','.btn-primary',function(){

        $('#theLoading').modal('show');

        //模态框消失
        $('#confirm-myModal').modal('hide');

        $('#theLoading').modal('hide');

        //提示
        _moTaiKuang($('#tip-myModal'), '提示', true, true ,'确认成功！', '');

    });

    //【查询】
    $('#table').on('click','.option-query',function(){

        //样式修改
        cssChange($(this));

        //初始化

        $('#theLoading').modal('show');

        _moTaiKuang($('#query-myModal'), '查询报警历史', true, false ,false, '');

        _datasTable($('#devTable'),_devHistoryArr);

        $('#theLoading').modal('hide');

    });

    //【分派】
    $('#table').on('click','.option-GD',function(){

        //样式修改
        cssChange($(this));

        $('#theLoading').modal('show');

        _moTaiKuang($('#create-myModal'), '创建工单', false, false ,false, '创建');

        $('#theLoading').modal('hide');

    });

    //分派【确认】按钮
    $('#create-myModal').on('click','.btn-primary',function(){

        $('#theLoading').modal('show');

        //模态框消失
        $('#create-myModal').modal('hide');

        $('#theLoading').modal('hide');

        //提示
        _moTaiKuang($('#tip-myModal'), '提示', true, true ,'创建成功！', '');

    });

    //【修改范围】
    $('#table').on('click','.option-modify',function(){

        //样式修改
        cssChange($(this));

        //初始化


        $('#theLoading').modal('show');

        _moTaiKuang($('#range-myModal'), '修改范围', false, false ,false, '保存');

        $('#theLoading').modal('hide');

    });

    //修改范围【确定】按钮
    $('#range-myModal').on('click','.btn-primary',function(){

        $('#theLoading').modal('show');

        //模态框消失
        $('#range-myModal').modal('hide');

        $('#theLoading').modal('hide');

        //提示
        _moTaiKuang($('#tip-myModal'), '提示', true, true ,'修改成功！', '');

    });

    //【延迟】
    $('#table').on('click','.option-delay',function(){

        //样式修改
        cssChange($(this));

        //初始化

        $('#theLoading').modal('show');

        _moTaiKuang($('#delay-myModal'), '延迟报警', false, false ,false, '延迟');

        $('#theLoading').modal('hide');

    });

    //延迟【确定按钮】
    $('#delay-myModal').on('click','.btn-primary',function(){

        $('#theLoading').modal('show');

        //模态框消失
        $('#delay-myModal').modal('hide');

        $('#theLoading').modal('hide');

        //提示
        _moTaiKuang($('#tip-myModal'), '提示', true, true ,'延迟成功！', '');

    });

    /*------------------------------------------其他方法-----------------------------------------------*/

    //主表格数据
    function conditionSelect(){

        $.ajax({

            type:'get',

            url:'data/alarm.json',

            success:function(result){

                _datasTable($('#table'),result)

            }

        })

    };

    //查询数据表格
    function devHistory(){

        $.ajax({

            type:'get',

            url:'data/historyAlarm.json',

            success:function(result){

                _devHistoryArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _devHistoryArr.push(result[i]);

                }

            }

        })

    };

    //样式修改
    function cssChange(tr){

        $('#table tbody').children('tr').removeClass('tables-hover');

        tr.parents('tr').addClass('tables-hover');

    };


});