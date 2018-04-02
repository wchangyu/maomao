$(function(){

    /*------------------------------------------------时间-------------------------------------*/

    //月份
    _monthDate($('.datatimeblock'));

    //默认上月
    var demoTime = moment().subtract(1,'months').format('YYYY/MM');

    $('.datatimeblock').val(demoTime);

    /*-----------------------------------------------表格初始化---------------------------------*/

    //按班组表格
    var wxContentByClassCol = [

        {
            title:'序号',
            data:''
        },
        {
            title:'班组名称',
            data:'className'
        },
        {
            title:'班次',
            data:'classNum'
        },
        {
            title:'所占百分比%',
            data:'percentage'
        }

    ]

    _tableInit($('#wxContentByClassTable'),wxContentByClassCol,2,false,'','','','','','');

    //按房屋表格
    var wxContentByHouseCol = [

        {
            title:'序号',
            data:''
        },
        {
            title:'地点',
            data:'place'
        },
        {
            title:'次数',
            data:'num'
        },
        {
            title:'百分比',
            data:'percentage'
        }

    ]

    _tableInit($('#wxContentByHouseTable'),wxContentByHouseCol,2,false,'','','','','','');

    //水电班按工作内容
    var wxContentOfHydroelectricCol = [

        {
            title:'序号',
            data:''
        },
        {
            title:'项目名称',
            data:'itemName'
        },
        {
            title:'数量',
            data:'num'
        },
        {
            title:'所占百分比%',
            data:'percentage'
        },
        {
            title:'备注',
            data:'remark'
        }

    ]

    _tableInit($('#wxContentOfHydroelectric'),wxContentOfHydroelectricCol,2,false,'','','','','','');

    var wxContentByDepartmentCol =[

        {
            title:'序号',
            data:''
        },
        {
            title:'科室',
            data:'depart'
        },
        {
            title:'维保修项次数',
            data:'num'
        }

    ]

    _tableInit($('#wxContentByDepartment'),wxContentByDepartmentCol,2,false,'','','','','','');

    /*-----------------------------------------------按钮事件----------------------------------*/

    //选项卡事件
    $('.table-title span').click(function(){

        //选项卡样式修改
        $('.table-title').children('span').removeClass('spanhover');

        $(this).addClass('spanhover');

        //表格对应情况
        $('.table-title').next().children().addClass('hide-block');

        $('.table-title').next().children().eq($(this).index()).removeClass('hide-block');

    })

    /*------------------------------------------------其他方法---------------------------------*/



});