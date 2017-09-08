/**
 * Created by admin on 2017/8/28.
 */
/*--------------------------------全局变量---------------------------------*/
//获得用户名
var _userIdName = sessionStorage.getItem('userName');
//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");
//开始/结束时间插件
$('.datatimeblock').datepicker({
    language:  'zh-CN',
    todayBtn: 1,
    todayHighlight: 1,
    format: 'yyyy/mm/dd'
});
//延迟时间
var theTimes = 30000;
$(document).ready(function(){



    //初始化
    var myChart = echarts.init(document.getElementById('energy-demand'));
    // 指定图表的配置项和数据
    option = {
        title:{
            text: '故障率统计',
            x: 'center'
        },
        tooltip : {
            'trigger':'item',
            'show':true,
            'formatter': '{b} : {c} ({d}%)'

        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },
        series : [
            {
                name: '故障率',
                type: 'pie',
                radius : '70%',
                center: ['50%', '50%'],
                data:[
                    {value:335, name:'昼'},
                    {value:310, name:'夜'}
                ],
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: '{b} : {c} ({d}%)'
                    }
                },
                itemStyle: {
                    //normal: {
                    //    color: function(params) {
                    //
                    //        var colorList = [
                    //            '#9dc541','#afc8de'
                    //        ];
                    //        return colorList[params.dataIndex]
                    //    }
                    //},
                    //emphasis: {
                    //    shadowBlur: 10,
                    //    shadowOffsetX: 0,
                    //    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    //}
                }
            }
        ]
    };

    window.onresize = function () {
        if(myChart ){
            myChart.resize();

        }
    };

    var st = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
    var et = moment().startOf('month').format('YYYY-MM-DD');

    //页面显示的时间
    var showET = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

    $('.min').val(st);
    $('.max').val(showET);
    //获取后台数据放入页面
    $('.btn-success').on('click',function(){
        //获取开始结束时间
        var startTime = $('.min').val();
        var endTime = moment($('.max').val()).add(1,'day').format('YYYY-MM-DD');

        if(startTime == '' || endTime == ''){
            myAlter('请输入时间进行查询');
            return false;
        }

        //获取要传递的值
        var postArr = [];
        //获取要传递的地址
        var postUrl = '';
        //获取要传递的参数名称
        var postName = '';

        var typeVal = $('#refer-type').val();

            if(typeVal == 1){

                postUrl = '/YWGDAnalysis/GetGDDLRate';
                postName = 'dlNums';
                postArr = DLineArr;

            }else if(typeVal == 2){
                postUrl = '/YWGDAnalysis/GetGDDDepRate';
                postName = 'ddNums';
                postArr = DStationArr;
            }else if(typeVal == 3){
                postArr.length = 0;
                postUrl = '/YWGDAnalysis/GetGDDSysRate';
                postName = 'ddNums';
                var theVal = $('#refer-station').val();
                if($('#refer-point').val() == 0){
                    postArr =  DStationArr;
                }else{
                    //车站选择全部时
                    if(theVal == 0){
                        $(relationArr).each(function(i,o){
                            if(o.dlNum == $('#refer-point').val()){
                                var arr = o.deps;
                                $(arr).each(function(i,o){
                                    postArr.push(o.ddNum);
                                })
                            }
                        });
                    }else{

                        postArr.push(theVal);
                    }
                }

            }


        var prm = {
            'st':startTime,
            'et':endTime
        };

        prm[postName] = postArr;
        //向后台发送请求
        $.ajax({
            type: 'post',
            url: _urls + postUrl,
            timeout: theTimes,
            beforeSend: function () {
                //$('#theLoading').modal('show');
                myChart.showLoading();
            },

            complete: function () {
                //$('#theLoading').modal('hide');
            },
            data:prm,
            success: function (data) {
                console.log(data);

                var sArr = [];

                if(data.length == 0){
                    myAlter('无数据');
                    option.series[0].data = sArr;

                    //重绘chart图
                    myChart.hideLoading();
                    myChart.setOption(option);
                    return false;
                }

                $(data).each(function(i,o){
                    var obj = {};
                    obj.value = o.gdCount;
                    obj.name = o.returnName;
                    //数据
                    sArr.push( obj);

                });

                option.series[0].data = sArr;

                //重绘chart图
                myChart.hideLoading();
                myChart.setOption(option);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //console.log(textStatus);
                myChart.hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter('超时')
                }else{
                    myAlter('请求失败')
                }

            }
        });
    });


});
//改变类型时
$('#refer-type').on('change',function(){


    var theVal = $(this).val();

    if(theVal == 3){

        $('#refer-point').parents('li').addClass('show');
        $('#refer-station').parents('li').addClass('show');
    }else{
        $('#refer-point').parents('li').removeClass('show');
        $('#refer-station').parents('li').removeClass('show');
    }

});

//改变线点时，给车站添加联动
$('#refer-point').on('change',function(){
    console.log(33);
    var theVal = $(this).val();
    if(theVal == 0){
        $('#refer-station').html('<option value="0">全部</option>');
    }

    $(relationArr).each(function(i,o){

        if(theVal == o.dlNum){
            var arr = o.deps;
            var html = '<option value="0">全部</option>';
            $(arr).each(function(i,o){
                 html += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>';
            });
        }
        $('#refer-station').html(html);
    });
});
//存放线点
var DLinesSelect = '';
var DLineArr = [];
//存放车站
var DStationSelect = '';
var DStationArr = [];
//存放线点与车站的关系
var relationArr = [];

getAllDLines();

//获取全部线点
function getAllDLines(){

    $.ajax({
        type: 'post',
        url: _urls + '/YWGD/ywGetDLines',
        timeout: theTimes,
        data:{
            'userID':_userIdName
        },
        success: function (data) {
            console.log(data);
            DLinesSelect += '<option value="0">全部</option>';

            $(data).each(function(i,o){
                relationArr.push(o);
                DLinesSelect += '<option value="'+ o.dlNum+'">'+ o.dlName+'</option>';
                DLineArr.push(o.dlNum);
            });
            $('#refer-point').html(DLinesSelect);

            var startHtml =  '<option value="0">全部</option>';
            //var startArr = data[0].deps;
            //$(startArr).each(function(i,o){
            //    startHtml += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>';
            //});
            $('#refer-station').html('<option value="0">全部</option>');

            $('.btn-success').click();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter('超时')
            }else{
                myAlter('请求失败')
            }

        }
    });
};

getAllDStations();

//获取全部车站
function getAllDStations(){

    $.ajax({
        type: 'post',
        url: _urls + '/YWDev/ywDMGetDDs',
        timeout: theTimes,
        data:{
            'userID':_userIdName,
            'ddNum':''
        },
        success: function (data) {
            DStationSelect += '';

            $(data).each(function(i,o){
                DStationSelect += '<option value="0">全部</option>';
                DStationSelect += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>';
                DStationArr.push(o.ddNum);
            })


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter('超时')
            }else{
                myAlter('请求失败')
            }

        }
    });
};