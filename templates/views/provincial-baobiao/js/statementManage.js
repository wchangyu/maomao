/**
 * Created by admin on 2018/7/16.
 */
$(function(){

    //页面select年份动态计算
    changeSelectYears();

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
        title:'报表名称',
        data:'reportShowDesc'
    },
    {
        title:'报表id',
        class:'theHidden',
        data:'id'
    },
    {
        title:'汇总类型',
        data:'yearFlag',
        render:function(data, type, row, meta){

            if(data == 0){

                return '年报'
            }else  if(data == 1){

                return '半年报'
            }else  if(data == 2){

                return '季报'
            }else  if(data == 3){

                return '月报'
            }

        }
    },
    {
        title:'时间',
        data:'yearDT'
    },
    {
        title:'报出时间',
        data:'yearDT'
    },
    {
        title:'操作',
        render:function(data, type, row, meta){

            var jumpHtml = "classifyStatement.html";

            //获取报表id
            var id = row.id;

            jumpHtml += "?id="+id;

            return  "<span class='data-option option-delete btn default btn-xs green-stripe' ><a href='"+jumpHtml+"' target='_blank'>查看</a></span>";

        }
    }
];

//初始化表格
_tableInit($('#scrap-datatables'),notEntertainedCol,'2','','','');

//获取后台报表 并展示
function getReportCollects(){

    //汇总类型
    var yearFlag = $('#collect-type').val();

    //年份
    var year = $('#years').val();

    //报表类型
    var statementType = $('#statement-type-val').val();

    //传递给后台的数据
    var prm = {

        "yearDT": year,
        "yearFlag": yearFlag,
        "reportFlag": statementType

    };

    //定义传递给后台的回调函数
    var successFun = function (result){

        console.log(result);

        _datasTable($('#scrap-datatables'),result);

    };

    //调用后台的位置
    var url = 'ProvincialReport/GetReportCollects';

    //调用数据
    _mainAjaxFun(ajaxType,url,prm,successFun);

}

//页面select年份动态计算
function changeSelectYears(){

    //获取当前年份
    var curYear = parseInt(moment().format('YYYY'));

    //定义给页面select中赋值的字符串
    var yearHtml = "";

    for(var i=0; i<5; i++){

        var year = curYear - i;

        yearHtml += "<option>"+year+"</option>";

    }

    $('#years').html(yearHtml);

}