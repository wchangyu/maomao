/**
 * Created by admin on 2018/7/24.
 */

$(function(){

    //获取区域位置选框中信息
    getPositionSelect();

    //获取公共机构分类统计表数据
    getOrganizationData();

    //改变区域位置
    $('#regional-position').on('change',function(){

        //获取公共机构分类统计表数据
        getOrganizationData();

    });

    //导出按钮
    $('.excelButton').on('click',function(){

        _FFExcel($('#scrap-datatables')[0]);
    });

});

//饼图
var pieOption ={

    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        type: 'scroll',
        top: 10,
        bottom: 10,
        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
    },
    grid:{
        left:'right'
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series: [
        {
            name:'建筑信息',
            type:'pie',
            radius: ['0%', '80%'],
            data:[

            ],
            center:['60%','50%'],
            itemStyle:{
                normal:{
                    label:{
                        show: false,
                        formatter: '{b} : {c} ({d}%)'
                    },
                    color:function(params){
                        var colorList = [
                            '#2ec8ab','#2f4554','#0BA3C3','#fad797', '#f8276c', '#61a0a8','#ffa90b', '#0353F7', '#3C27D5','#6512D7', '#283DDA', '#901AD3','#f8276c'
                        ];
                        return colorList[params.dataIndex]

                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

//echart初始化
var pieCharts = echarts.init(document.getElementById('pie-chart'));

//获取区域位置选框中信息
function getPositionSelect(){

    var positionArr = getAllPositionType();

    var html = "<option value='-1'>全部</option>" ;

    $(positionArr).each(function(i,o){

        html += '<option value="'+ o.districtID+'">'+ o.districtName+'</option>';
    });

    $('#regional-position').html(html);

}

//获取公共机构分类统计表数据
function getOrganizationData(){

    var districtID = $('#regional-position').val();

    var districtIDArr = [];

    //公共机构id集合
    if( districtID == -1){

        var positionArr = getAllPositionType();

        $(positionArr).each(function(i,o){

            districtIDArr.push(o.districtID)
        })
    }else{

        districtIDArr = [districtID]
    }

    //传递给后台的数据
    var prm = {

        "districtIDs": districtIDArr,
        "userID": _userIdNum
    };

    var url = 'Provincial/GetProvincialClassMeterData';

    //定义传递给后台的回调函数
    var successFun = function (result){

        //存放饼图中数据
        var legendArr = [];

        var sArr = [];


        //表头信息
        var tableHeadHtml = "<tr><th>机构分类</th><th>建筑数量</th><th>建筑面积(㎡)</th>";

        $(result.showMeterTitles).each(function(i,o) {

            tableHeadHtml += "<th>"+o+"</th>"

        });

        tableHeadHtml += "</tr>";

        //数据信息
        var tableHtml = "";

        $(result.provincialClassMeters).each(function(i,o) {

            tableHtml += "<tr >" +

                            "<td class='blues'>"+ o.returnOBJName+"</td>"+
                            "<td>"+ o.pointerNum+"</td>"+
                            "<td>"+ o.coefficient.toFixed(2)+"</td>";

            $(o.showMeterNums).each(function(k,j){

                tableHtml += "<td>"+ j +"</td>";

            });

            if(o.returnOBJID != -1){

                var obj = {value : o.pointerNum,name:o.returnOBJName};

                sArr.push(obj);

                legendArr.push(o.returnOBJName);

            }



            tableHtml += "</tr>";
        });

        pieOption.series[0].data = sArr;

        pieOption.legend.data = legendArr;

        //页面赋值
        $('#scrap-datatables tbody').html(tableHtml);

        $('#scrap-datatables thead').html(tableHeadHtml);

        pieCharts.setOption(pieOption,true);

        $('.top-select-container').hideLoading();

    };

    var beforeSendFun = function(){

        $('.top-select-container').showLoading();


    };

    var errorFun = function(){

        $('.top-select-container').hideLoading();
    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

}

