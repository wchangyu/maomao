/**
 * Created by admin on 2018/1/3.
 */
$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //时间初始化
    $('.time-options-1').click();

    //记录页面
    _energyTypeSel = new ETSelection();

    //读取能耗种类
    _getEcType('initPointers');

    $('.energy-types div').removeClass('selectedEnergy');

    //左上角加入'全部'
    var typeHtml = '<div value="0" class="selectedEnergy  all-energy-type" style="width: 120px; height: 70px; cursor: pointer; border: 2px solid rgb(214, 70, 53);"><p style="margin-top: 50px; text-align: center;"><span>全部</span></p></div>';

    $('.energy-types').prepend(typeHtml);

    //默认选中第一个能耗
    $('.selectedEnergy').addClass('blueImg00');

    _getEcTypeWord();

    //默认能耗种类
    _ajaxEcType =_getEcTypeValue();

    console.log(_ajaxEcType);

    _ajaxEcTypeWord = _getEcTypeWord();

    //获取区域位置二级结构
    getBranchZtree(0,0,getPointerTree);

    //显示隐藏左侧时
    $('.showOrHidden').click(function(){

        window.onresize();
    });

    //加载初始数据
    getPointerData('EnergyManageV2/GetEnergyMoneyReturn');

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        //获取能耗类型名称
        var ecTypeName = $('.selectedEnergy').attr('value');

        //获取数据
        getPointerData('EnergyManageV2/GetEnergyMoneyReturn');

    });

    //能耗选择
    $('.typee').click(function(){
        $('.typee').removeClass('selectedEnergy');
        $(this).addClass('selectedEnergy');

    });


    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
            myChartTopLeft1.resize();
            myChartTopLeft2.resize();
        }
    };

});

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];
var allDataX = [];
var allDataY = [];

//分类组成
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//分区域组成
var myChartTopLeft1 = echarts.init(document.getElementById('rheader-content-17'));

//分单位组成
var myChartTopLeft2 = echarts.init(document.getElementById('rheader-content-18'));

// 指定图表的配置项和数据
var option = {
    title:{
      text:'分类组成'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        type: 'scroll',
        top: 30,
        bottom: '45%',
        data:[]
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
    grid:{
        left:'right',
        top:'bottom'
    },
    series: [
        {
            name:'分类组成',
            type:'pie',
            radius: ['50%', '75%'],
            center:['50%','75%'],
            data:[

            ],
            itemStyle:{
                normal:{
                    label:{
                        show: false,
                        position:'inside',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

var option1 = {
    title:{
        text:'分单位组成'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        type: 'scroll',
        top: 30,
        bottom: '45%',
        data:[]
    },
    grid:{
        left:'right'
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series: [
        {
            name:'分单位组成',
            type:'pie',
            radius: ['50%', '75%'],
            data:[

            ],
            center:['50%','75%'],
            itemStyle:{
                normal:{
                    label:{
                        show: false,
                        position:'inside',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

/*---------------------------------otherFunction------------------------------*/

//获取数据
function getPointerData(url){

    //存放要传的企业集合
    var enterpriseID = 0;

    //获取名称
    var areaName = '';

    //确定支路id
    var nodes = branchTreeObj.getCheckedNodes(true);

    $( nodes).each(function(i,o){

        //如果勾选的是父节点
        if(o.level == 0){

            enterpriseID = 0;


        }else{
            enterpriseID = o.id;
        }

        //页面上方展示信息
        areaName += o.name;
    });

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    };

    //获取开始时间
    var startTime = getPostTime()[0];

    //获取开始时间
    var endTime = getPostTime()[1];

    //定义获得数据的参数
    var ecParams = {

        "energyItemID": _ajaxEcType,
        "enterpriseID":  enterpriseID,
        "startTime": startTime,
        "endTime": endTime
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+url,
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            myChartTopLeft.showLoading();
            myChartTopLeft1.showLoading();
            myChartTopLeft2.showLoading();
        },
        success:function(result){
            myChartTopLeft.hideLoading();
            myChartTopLeft1.hideLoading();
            myChartTopLeft2.hideLoading();

            //判断是否返回数据
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }
            //改变头部显示信息
            var energyName = '';

            energyName = $('.energy-types .selectedEnergy p span').html() + '费用';

            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY-MM-DD');

            $('.right-header-title').html('' + energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //绘制echarts

            //删除之前的数据
            for(var i=0; i<option.series.length; i++){

                option.series[i].data = [];
            }
            option1.series[0].data = [];

            //图例
            var legendArr = [];
            var legendArr1 = [];
            var legendArr2 = [];

            //分类组成
            var sArr1 = [];

            //分区域组成
            var sArr2 = [];

            //分单位组成
            var sArr3 = [];

            //分类组成
            $(result.energyTypeItemMoneys).each(function(i,o){


                var obj = {value : o.energyMoneyData.toFixed(2),name:o.f_EnergyItemName};

                sArr1.push(obj);

                legendArr.push(o.f_EnergyItemName);

            });

                option.title.text = '分类组成';

                option.series[0].data = sArr1;

                option.legend.data = legendArr;

                //echart饼图
                myChartTopLeft.setOption(option,true);

            //分区域组成
            $(result.pointerEnergyMoneys).each(function(i,o){


                var obj = {value : o.objMoneyData.toFixed(2),name:o.returnOBJName};

                sArr2.push(obj);

                legendArr1.push(o.returnOBJName);

            });

            option.title.text = '分区域组成';

            option.series[0].data = sArr2;

            option.legend.data = legendArr1;

            //echart饼图
            myChartTopLeft1.setOption(option,true);

            //分区域组成
            $(result.officeEnergyMoneys).each(function(i,o){


                var obj = {value : o.objMoneyData.toFixed(2),name:o.returnOBJName};

                sArr3.push(obj);

                legendArr2.push(o.returnOBJName);

            });

            option1.title.text = '分单位组成';

            option1.series[0].data = sArr3;

            option1.legend.data = legendArr2;

            //echart饼图
            myChartTopLeft2.setOption(option1,true);

            //如果选择全部能耗类型
            if(_ajaxEcType == 0){

                //展示分类组成
                $('#rheader-content-16').show();

                //改变显示方式为显示三个
                $('#rheader-content-18').removeClass('col-lg-6');

                $('#rheader-content-18').addClass('col-lg-4');

                $('#rheader-content-17').removeClass('col-lg-6');

                $('#rheader-content-17').addClass('col-lg-4');

            }else{

                //隐藏分类组成
                $('#rheader-content-16').hide();

                //改变显示方式为显示两个
                $('#rheader-content-17').removeClass('col-lg-4');

                $('#rheader-content-17').addClass('col-lg-6');

                $('#rheader-content-18').removeClass('col-lg-4');

                $('#rheader-content-18').addClass('col-lg-6');


            }

        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }

        }
    })
}







