/**
 * Created by admin on 2018/7/20.
 */
/**
 * Created by admin on 2018/7/16.
 */
$(function(){

    //获取后台数据
    getReportCollects();

    //点击查询按钮
    $('#selected').on('click',function(){

        //获取后台数据
        getReportCollects();

    });

});

//传递给后台的类型
var ajaxType = 'post';

//查询到的报表列表
var notEntertainedCol = [

    {
        title:'游泳馆名称',
        data:'eprName'
    },
    //{
    //    title:'报表id',
    //    class:'theHidden',
    //    data:'bxDianhua'
    //},
    {
        title:'游泳池名称',
        data:'pointername'
    },
    {
        title:'PH值',
        data:'phData'
    },
    {
        title:'浊度',
        data:'zhuDuData'
    },
    {
        title:'余氯',
        data:'yuLvData'
    },
    {
        title:'ORP数值',
        data:'orpData'
    },
    {
        title:'人数',
        data:'renShuData'
    },
    {
        title:'时间',
        data:'dataDate',
        render:function(data, type, row, meta){

            return data.split('T')[0] + " " + data.split('T')[1]
        }
    }

];

//初始化表格
_tableInit($('#scrap-datatables'),notEntertainedCol,'2','','','');

//获取后台数据 并展示
function getReportCollects(){

    //游泳馆名称
    var eprName = $('#eprName').val();

    //游泳池名称
    var pointerName = $('#pointerName').val();

    //传递给后台的数据
    var prm = {

        "pointerName": pointerName,
        "eprName": eprName,
        "begintime": "",
        "endtime": "",
        "userID": _userIdNum

    };

    //定义传递给后台的回调函数
    var successFun = function (result){

        //console.log(result);

        //表格赋值
        _datasTable($('#scrap-datatables'),result);

    };

    //调用后台的位置
    var url = 'HBYYG/PubenvDatasList';

    //调用数据
    _mainAjaxFun(ajaxType,url,prm,successFun);

}

