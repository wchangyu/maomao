/**
 * Created by admin on 2018/8/23.
 */
$(function(){

    //时间设置
    _timeYMDComponentsFun($('.datatimeblock'));

    //点击未阅读变为已阅读
    $('#allState-list').on('click','.data-read',function(){

        console.log(33);

        $(this).html('已阅读');

        $(this).css({
            'background':'lightgray'
        });

    });

});

//存放table中数据
var tableArr = [
    {
        "time":"2018/08/19 18:32",
        "thing":"IT机房A 冷通道TH4多次报警",
        "area":"IT机房A",
        "equipment":"TH1",
        "state":"持续",
        "people1":"张三",
        "people2":"李四",
        "ifSure":"0"
    },
    {
        "time":"2018/08/19 09:00",
        "thing":"冷机出水温度15修改为10℃",
        "area":"制冷站",
        "equipment":"1#主机",
        "state":"关闭",
        "people1":"张三",
        "people2":"张三",
        "ifSure":"0"
    },
    {
        "time":"2018/08/19 13:30",
        "thing":"下午15:00倒闸，注意观察中控",
        "area":"变电室A",
        "equipment":"IT-TA",
        "state":"关闭",
        "people1":"李四",
        "people2":"李四",
        "ifSure":"0"
    },
    {
        "time":"2018/08/18 16:32",
        "thing":"上午9:00安排外修公司进入冷站维修",
        "area":"制冷站",
        "equipment":"B1水泵",
        "state":"持续",
        "people1":"张三",
        "people2":"李四",
        "ifSure":"1"
    },
    {
        "time":"2018/08/19 10:32",
        "thing":"下午15:00安排外修公司进入IT机房A维修RPP-1",
        "area":"IT机房A",
        "equipment":"RPP-1",
        "state":"持续",
        "people1":"王五",
        "people2":"",
        "ifSure":"1"
    },
    {
        "time":"2018/08/19 09:32",
        "thing":"定压补水系统故障，需要每隔2小时现场查看压力手动补水",
        "area":"制冷站",
        "equipment":"定压补水系统",
        "state":"持续",
        "people1":"王五",
        "people2":"",
        "ifSure":"1"
    }
];

//下方表格
var missedListCol = [
    {
        title:'工单号',
        data:'time',
        className:'gdCode',
        render:function(data, type, row, meta){

            return meta.row + 1;

        }
    },
    {
        title:'时间',
        data:'time'
    },
    {
        title:'事件',
        data:'thing'
    },
    {
        title:'关联机房',
        data:'area'
    },
    {
        title:'关联设备',
        data:'equipment'
    },
    {
        title:'状态',
        data:'state'
    },
    {
        title:'创建人',
        data:'people1'
    },
    {
        title:"关单人",
        data:'people2'
    },
    {
        title:'操作',
        data:null,
        defaultContent: "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span><span class='data-option option-delete btn default btn-xs black'><i class='fa fa-trash-o'></i>删除</span>"
    },
    {
        title:'交接班阅读',
        data:'ifSure',
        render:function(data, type, row, meta){

            if(data == '1'){

                return "<span class='data-read data-option option-edit btn default btn-xs green-stripe' style='background: lightgray;'>已阅读</span>";
            }else{

                return "<span class='data-read data-option option-edit btn default btn-xs green-stripe' style='background: #eee'>未阅读</span>";
            }

        }
    }
];


_tableInit($('#allState-list'),missedListCol,'2','','','');


//页面赋值
_datasTable($('#allState-list'),tableArr);