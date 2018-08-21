$(function(){

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
            data:'BJDJ'
        },
        {
            title:'处理状态',
            data:'CLZT'
        }

    ]

    _tableInit($('#table'),col,1,true,'','','','');

    conditionSelect();

    function conditionSelect(){

        $.ajax({

            type:'get',

            url:'data/alarm.json',

            success:function(result){

                _datasTable($('#table'),result)

            }

        })

    }

})