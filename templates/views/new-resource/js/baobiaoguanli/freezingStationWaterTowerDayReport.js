$(function(){

    /*------------------------------时间插件--------------------------*/

    var nowTime = moment().format('YYYY/MM/DD');

    //默认时间
    $('.datatimeblock').val(nowTime);

    //时间插件初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //导出时间
    var excelTime = nowTime;

    //获取楼宇
    _pointerData();

    //获取能源站
    _areaData($('#area'), function(){

        conditionSelect(sessionStorage.PointerID);

    });


    /*------------------------------按钮事件---------------------------*/

    $('#selected').click(function(){

        conditionSelect($('#pointer').val());

    })


})

function conditionSelect(pointer){

    var prm = {

        //楼宇id
        pId:pointer,

        //能源站
        AREA:$('#area').val(),

        //时间
        sp:$('.datatimeblock').val()

    };

    _mainAjaxFun('post','MultiReportRLgs/GetReportLQTRLgs',prm,successFun);


}

function successFun(result){

    if(result){

        //报表名称
        $('#table-titleH').html(result.report_Name);
        //数据时间
        $('.data-time').html(result.report_Dt);
        //导出时间
        excelTime = moment().format('YYYY/MM/DD');
        $('.derive-time').html(excelTime);
        //位置
        $('#location').html(result.location);
        //设备
        $('#eqName').html(result.eqname);
        //循环数据
        if(result.report_list>0){

            //将属性重新排列

            var str = '';

            for(var i=0;i<result.report_list.length;i++){

                str += '<tr>';

                //遍历属性，生成td j是属性
                for(var j in result.report_list[i] ){

                    str += '<td>' + result.report_list[i][j] +'</td>';

                }

                str +='</tr>'


            }

            $('.table').find('tbody').empty().append(str);

        }

    }


}