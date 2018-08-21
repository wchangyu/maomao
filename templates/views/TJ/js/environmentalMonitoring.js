$(function(){

    //表格初始化
    var col = [

        {
            title:'序号',
            data:'XH'
        },
        {
            title:'设备位置',
            data:'SBWZ'
        },
        {
            title:'所属系统',
            data:'SSXT'
        },
        {
            title:'设备名称',
            data:'SBMC'
        },
        {
            title:'设备编号',
            data:'SBBH'
        },
        {
            title:'服务区域',
            data:'FWQY'
        },
        {
            title:'配电箱手自动状态',
            data:'PDX'
        },
        {
            title:'季节模式',
            data:'JJMS'
        },
        {
            title:'控制模式',
            data:'KZMS'
        },
        {
            title:'风阀节能模式',
            data:'FFJN'
        },
        {
            title:'串级节能',
            data:'JJJN'
        },
        {
            title:'启停状态',
            data:'QTZT'
        },
        {
            title:'送风压差开关',
            data:'SFYC'
        },
        {
            title:'送风温度设定（℃）',
            data:'SFWDSD'
        },
        {
            title:'送风温度（℃）',
            data:'SFWD'
        },
        {
            title:'回风温度（℃）',
            data:'HFWD'
        },
        {
            title:'CO2浓度设定（PPM）',
            data:'CO2SD'
        },
        {
            title:'CO2浓度（PPM）',
            data:'CO2'
        },
        {
            title:'水阀开度（%）',
            data:'SFKD'
        },
        {
            title:'新风阀开度（%）',
            data:'XFFKD'
        },
        {
            title:'回风阀开度（%）',
            data:'HFFKD'
        },
        {
            title:'累计运行时间（h）',
            data:'LJYYSJ'
        }

    ]

    _tableInit($('#table'),col,1,true,'','',false,'');

    //获取数据设备表格数据
    $.ajax({

        type:'get',

        url:'data/environment.json',

        success:function(result){

            _datasTable($('#table'),result);

        }

    })

    /*----------------------------------------按钮事件-----------------------------------------*/

    //汇总表--平面分布/设备列表切换
    $('.imgTableTab').on('click','span',function(){

        //样式
        $('.imgTableTab').find('span').removeClass('imgTableTab-active');

        $(this).addClass('imgTableTab-active');

        $('.imgTableCon').children().hide();

        $('.imgTableCon').children().eq($(this).index()).show();

    })

    //汇总表/平面图/3D虚拟巡检/CFD温度云图
    $('.loop-tip').on('click','div',function(){

        $('.loop-tip').children().removeClass('loop-active');

        $(this).addClass('loop-active');

        $('.loop-block').children('div').hide();

        $('.loop-block').children('div').eq($(this).index()).show();

    })

    //平面图--弹窗
    $('.PMT').click(function(){

        _moTaiKuang($('#PMT-myModal'), '详情', true, false ,false, '确认');

    })

    //点击平面图第一层弹窗，弹出第二层弹窗
    $('#PMT-myModal').on('click','img',function(){

        _moTaiKuang($('#PMT-sec-myModal'), '详情', true, false ,false, '确认');

    })


})