/**
 * Created by admin on 2018/10/10.
 */
$(function(){

    /*---------------------------------------------------------时间插件--------------------------------------------------*/

    //默认按日初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM/DD');

    //开始时间
    var et = moment(nowTime).subtract(1,'days').format('YYYY/MM/DD');

    var st = moment(et).subtract(7,'days').format('YYYY/MM/DD');

    $('.min').val(st);

    $('.max').val(et);

    //获取配电房数据
    getAllPowerCutRoom();

    /*-------------------------------------------------------表格初始化---------------------------------------------------*/
    var col = [
        {
            title:'日期',
            data:'currentDT'
        },
        {
            title:'配电室',
            data:'rate'
        },
        {
            title:'高压开关编号',
            data:'rate'
        },
        {
            title:'停电时间',
            data:'devName'

        },
        {
            title:'送电时间',
            data:'rate'
        },

    ];

    _tableInit($('#all-reporting'),col,2,false,'','','','',10,'');


    /*------------------------------------------------------按钮事件-----------------------------------------------------*/

    $('#selected').click(function(){

        conditionSelect();

    });

    //导出
    $('.excelButton').click(function(){

        _FFExcel($('#all-reporting')[0]);

    });

    //打印
    $('.dataTables_length').parent().addClass('noprint');

    //选择配电房 回路联动
    $('#powerRoom').on('change',function(){

        //获取当前回路信息
        var powerType = $(this).find("option:selected").attr('data-type');

        //字符串转为数据
        var powerTypeArr = powerType.split(',');

        var html = "";

        $(powerTypeArr).each(function(i,o){

            if(o == 0){

                html += '<option value="0">高压</option>';

            }else if(o == 1) {

                html += '<option value="1">低压</option>';

            }

        });

        //页面赋值

        $('#powerCutType').html(html);

    });
    /*-----------------------------------------------------其他方法------------------------------------------------------*/



});

//获取报表中的数据
function conditionSelect(){

    //开始时间
    var st = $('.min').val();
    //结束时间
    var et = $('.max').val();

    //配电房
    var powerCutType = $('#powerCutType').val();

    //楼宇id
    var pointerID = $('#powerRoom').val();

    var prm = {

        "pointerIDs": [pointerID],
        "powerCutType": powerCutType,
        "selectST": st,
        "selectET": et
    };

    _mainAjaxFun('post','EnergyReportV2/GetPowerCutReport',prm,successFun);

    function successFun(result){

        if(result != null){

            var dataArr = result.data;


            _jumpNow($('#all-reporting'),dataArr);

        }

    }

};

//获取配电房数据
function getAllPowerCutRoom(){

    var prm = {};

    _mainAjaxFun('get','EnergyReportV2/GetAllPowerCutRoom',prm,successFun);

    function successFun(result){

        var html = '';

        $(result.data).each(function(i,o){

            //把高低压标识数据转为字符串
            var powerTypes = o.f_PowerTypes.join(",");

            html += '<option value="'+ o.f_Pointerid+'" data-type="'+powerTypes+'">'+ o.f_PowerRoom+'</option>'

        });

        //页面赋值
        $('#powerRoom').html(html);

        $('#powerRoom').change();

        //获取数据
        conditionSelect();

    }

}