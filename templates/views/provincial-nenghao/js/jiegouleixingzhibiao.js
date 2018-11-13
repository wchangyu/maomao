
/**
 * Created by admin on 2018/7/27.
 */
$(function(){

    //获取当前时间
    $('.min').val(moment().format('YYYY-MM'));
    $('.max').val(moment().format('YYYY-MM'));

    $('.input-blockeds .choose-time.chooses').click()
    //点击查询按钮
    $('.btn-success').on('click',function(){
        //获取同比数据
        getOrganizationData();

    });

    //导出按钮
    $('.excelButton').on('click',function(){

        _FFExcel($('#scrap-datatables')[0]);
    });

});

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['本期数据','比较数据'],
        top:'20',
    },
    grid: {
        left: '1%',
        right: '4%',
        bottom:'1%',
        containLabel: true
    },
    toolbox: {
        show : true,
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            show:'true',
            type : 'category',
            data:[]
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    dataZoom: [
        {
            type: 'inside'
        }
    ],
    series : [
        {
            name:'当前数据',
            type:'bar',
            data:[],
            itemStyle : {
                normal:{
                    color:'#019cdf'
                }
            },
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ],
                itemStyle : {
                    normal:{
                        color:'#019cdf'
                    }
                },
                label:{
                    normal:{
                        textStyle:{
                            color:'#d02268'
                        }
                    }
                }
            },
            barMaxWidth: '60'
        }
    ]
};



//获取同比数据
function getOrganizationData(){

    //获取开始时间
    var startTime = $('.min').val()

    //获取结束时间
    var endTime = $('.max').val()
    // startTime = moment(startTime, 'YYYY-MM-DD')
    // endTime = moment(endTime, 'YYYY-MM-DD')

    var starr = startTime.split('-')
    if(starr[1]){
        var num = parseInt(starr[1]);
        if(num>12){
            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'时间格式错误,请检查', '');
            return 
        }
    }

    var edarr = endTime.split('-')
    if(edarr[1]){
        var num = parseInt(edarr[1]);
        if(num>12){
            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'时间格式错误,请检查', '');
            return 
        }
    }
    if( selecttype  == 'Year'){
        startTime = moment(startTime,'YYYY').format('YYYY-MM-DD');
        endTime = moment(endTime,'YYYY').format('YYYY-MM-02');
    }else if(selecttype == "Month"){
        startTime = moment(startTime,'YYYY-MM').format('YYYY-MM-DD');
        endTime = moment(endTime,'YYYY-MM').format('YYYY-MM-DD');
    }
    //传递给后台的数据
    var prm = {
        "selectDateType": selecttype,
        "startTime": startTime,
        "endTime": endTime,
        "userID": _userIdNum
    };

    var url = 'Provincial/GetPointerClassKPINormData';

    //定义传递给后台的回调函数
    var successFun = function (result){
        console.log(result)
        $('.top-select-container').hideLoading();
        if(result.code == 99){
            _my_creatTableData(result.data)
        }else{
            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,result.message, '');
        }


    };

    var beforeSendFun = function(){

        $('.top-select-container').showLoading();

    };

    var errorFun = function(XMLHttpRequest, textStatus, errorThrown){

        $('.top-select-container').hideLoading();

        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

        }else{

            _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

        }
    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

}

// 生成表格
function _my_creatTableData( arr ){
    $('#scrap-datatables').DataTable({
        "autoWidth": false, //用来启用或禁用自动列的宽度计算
        "paging": true, //是否分页
        "destroy": true, //还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页  共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate': {
                "previous": "上一页",
                "next": "下一页",
                "first": "首页",
                "last": "尾页"
            }
        },
        // "dom":'B<"clear">lfrtip',
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        'buttons': [

        ],
        //'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            {
                title:'项目ID',
                data:'returnOBJID',
                class: 'hidden',
                render:function(data, index, row, meta){
                    return data;
                }
            },{
                title:'机构类型',
                data:'returnOBJName'
            },
            {
                title:'建筑数量',
                data:'pointerNum',
            },
            {
                title:'建筑面积(㎡)',
                data:'coefficient',
                render: function(data, index, row, meta) {
                    return  Math.round(row.coefficient*100)/100;
                }
            },
            {
                title:'用能人数',
                data:'peopleNum',
            },
            // {
            //     title:'所有能耗的标煤数据',
            //     data:'sumEnergyBiaoMeiData',
            //     render:function(data, index, row, meta){
            //         return data
            //     }
            // },
            {
                title:'建筑面积能耗KPI指标',
                data:'coefficientKPINorm'
            },
            {
                title:'建筑面积能耗KPI数据',
                data:'coefficientKPIData',
                render:function(data, index, row, meta){
                    if(row.isCoefficientKPIOut>=1){
                        return '<span class="redtxt">'+ Math.round(row.coefficientKPIData*100)/100 +'</span>'
                    }
                    return '<span>'+ Math.round(row.coefficientKPIData*100)/100 +'</span>'
                }
            },
            // {
            //     title:'建筑面积能耗KPI是否超标0未超标，1为超标 ',
            //     data:'isCoefficientKPIOut',
            // },
            {
                title:'人员能耗KPI指标',
                data:'peopleKPINorm'
            },
            {
                title:'人员能耗KPI数据',
                data:'peopleKPIData',
                render:function(data, index, row, meta){
                    if(row.isPeopleKPIOut>=1){
                        return '<span class="redtxt">'+ Math.round(row.peopleKPIData*100)/100 +'</span>'
                    }
                    return '<span>'+ Math.round(row.peopleKPIData*100)/100 +'</span>'
                }
            },
            // {
            //     title:'人员能耗KPI是否超标，0未超标，1为超标',
            //     data:'isPeopleKPIOut'
            // },
            // {
            //     title:'所有水能耗数据',
            //     data:'sumWaterEnergyData'
            // },
            {
                title:'人均水耗KPI指标',
                data:'peopleWaterKPINorm',
            },
            {
                title:'人均水耗KPI数据',
                data:'peopleWaterKPIData',
                render:function(data, index, row, meta){
                    if(row.isPeopleWaterKPIOut>=1){
                        return '<span class="redtxt">'+ Math.round(row.peopleWaterKPIData*100)/100 +'</span>'
                    }
                    return '<span>'+ Math.round(row.peopleWaterKPIData*100)/100 +'</span>'
                }
            }
            // ,{
            //     title:'人均水耗KPI是否超标，0未超标，1为超标',
            //     data:'isPeopleWaterKPIOut'
            // }
        ],
        data: arr
    });
}

