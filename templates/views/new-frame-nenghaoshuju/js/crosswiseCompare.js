/**
 * Created by admin on 2018/9/13.
 */

$(function(){

    //日期初始化
    _timeYMDComponentsFun($('.min'));

    //楼宇ztree树
    _pointerZtree = _getPointerZtree($("#allPointer"),2);

    //科室ztree树
    _officeZtree = _getOfficeZtree($("#allOffices"),2);

    //楼宇搜索功能
    _searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");


    //默认勾选第一个楼宇
    var zTree = $.fn.zTree.getZTreeObj("allPointer");
    var nodes = zTree.getNodes();

    zTree.checkNode(nodes[0], false, false);  //父节点不被选中

    zTree.checkNode(nodes[0].children[0].children[0], true, true);

    //获取支路
    GetAllBranches(2);
    //branchesType = 2 支路复选框
    branchesType = 2;



    //点击页面查询按钮
    $('.demand').on('click',function(){

        //获取页面中具体数据
        var flag = onChooseObjectType + 1;

        getContentData(flag);

    });

    ////默认加载数据
    GetShowEnergyNormItem(100,true);

    //改变右上角单位时
    $('#unit').on('change',function() {

        $('.demand').click();

    });

    //切换选择的对象时
    $('.choose-object-windows .sure').on('click',function(){

        setTimeout(function(){

            //获取当前能耗
            var energyType = $('.left-choose-energy-container .time-radio:checked').attr('data-type');

            //改变指标类型
            GetShowEnergyNormItem(energyType);

        },10);

    });

    //点击改变能耗种类
    $('.left-choose-energy-container .time-radio').on('change',function(){

        //获取当前能耗
        var energyType = $('.left-choose-energy-container .time-radio:checked').attr('data-type');

        //改变指标类型
        GetShowEnergyNormItem(energyType);

    });

    //改变指标类型 右上角单位跟着改变
    $('.choose-target-select ul').on('click','.the-target-message',function(){

        //改变右上角单位名称
        $('.unit').val($(this).attr('data-unit'));

    });

    //点击对象弹窗中的确定按钮
    $('.choose-object-windows .sure').on('click',function(){

        //console.log(511);

        //变更当前用户选择的对象类型
        onChooseObjectType = $('.choose-object-windows .left-tab-contain .onChoose').index();

        //获取当前选择的信息
        var nodes = getMessageByType(0).concat(getMessageByType(1));

        if(branchTreeObj){

            nodes = nodes.concat(getMessageByType(2));

        }

        var html = '';

        $(nodes).each(function(i,o){

            html += '<p class="has-choosed-message">'+
                '<b></b><font title="'+ o.name+'">'+o.name+'</font>'+
                '</p>'
        });

        //页面赋值
        $('.has-choosed-object').html(html);

        ////隐藏模态框
        $('#my-object').modal('hide');

    });

    //页面初始化
    $('.choose-object-windows .sure').click();

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

});

//存放获取到的指标类型
var energyNormItemArr = [];

var _pointerZtree;
var _officeZtree;

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];
var allDataX = [];
var allDataY = [];

//echart图颜色
var echartColorArr = ['#F2285C','#7DC79B','#5b69d2','#57c8d5','#e1b359'];

var echartObj =  {name:'数据',
    type:'line',
    smooth:true,

    //markPoint : {
    //    data : [
    //        {type : 'max', name: '最大值'},
    //        {type : 'min', name: '最小值'}
    //    ],
    //    itemStyle : {
    //        normal:{
    //            color:'#019cdf'
    //        }
    //    },
    //    label:{
    //        normal:{
    //            textStyle:{
    //                color:'#d02268'
    //            }
    //        }
    //    }
    //},
    //markLine : {
    //    data : [
    //        {type : 'average', name: '平均值'}
    //
    //
    //    ]
    //},
    data:[]
};

//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['本期用电','上期用电'],
        top:'30'
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
    series : [
        {
            name:'本期用电',
            type:'bar',
            data:[],
            barMaxWidth: '60'
        },
        {
            name:'上期用电',
            type:'bar',
            data:[],
            barMaxWidth: '60'
        }
    ]
};

//柱折图配置项
var optionLineBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['数据', '比较斜率'],
        top:'30'
    },
    toolbox: {
        show : true,
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['bar', 'line']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['本期','上期']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    grid: {
        left: '20%',
        right: '10%'
    },
    series : [
        {
            name:'数据',
            type:'bar',
            barMaxWidth: '50',
            data:[],
            itemStyle:{
                normal:{
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                            '#d53a35','#2f4554','#FCCE10','#E87C25','#27727B',
                            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                        ];
                        return colorList[params.dataIndex]
                    },
                }
            }
        },
        {
            name:'比较斜率',
            type:'line',
            data:[]
        }
    ]
};

//折线图配置项
var optionLine = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['数据'],
        top:'30'
    },
    toolbox: {
        show : true,
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['bar', 'line']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['本期','上期'],
            axisLine:{
                lineStyle:{
                    color:'#666',
                    width:1//这里是为了突出显示加上的
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLine:{
                lineStyle:{
                    color:'#666',
                    width:1//这里是为了突出显示加上的
                }
            }
        }
    ],
    grid: {
        left: '1%',
        right: '8%',
        containLabel: true,
        borderColor:'#DCDCDC'
    },
    series : [
        {
            name:'数据',
            type:'line',
            smooth:true,
            itemStyle : {
                normal : {
                    lineStyle:{
                        color:'#F2285C'
                    }
                }
            },
            color:['#F2285C'],
            markPoint : {
                data : [
                    {
                        type : 'max',
                        name: '最大值',
                        itemStyle:{
                            color:'#F35651'
                        },
                        label:{
                            normal:{
                                textStyle:{
                                    color:'#333'
                                }
                            }
                        }

                    },
                    {
                        type : 'min',
                        name: '最小值',
                        itemStyle:{
                            color:'#5B69D2'
                        }
                    }
                ],
                label:{
                    normal:{
                        textStyle:{
                            color:'#333'
                        }
                    }
                }
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}


                ]
            },
            data:[]
        }
    ]
};


//获取页面具体数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getContentData(flag){

    //存放访问后台的地址
    var url = 'EnergyQueryV2/GetMixtureHorCompareData';

    var totalAllData = 0;

    //存放要传的楼宇集合
    var postPointerID = [];

    //存放要传递的分户集合
    var officeID = [];

    //存放要传的支路ID
    var serviceID = [];

    //存放要传递的指标类型
    var energyNormItemObj = {};

    //当前选中的能耗类型
    if(flag != 2){

        _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');

    }else{

        _ajaxEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id1');

    }

    var commonEcType = $('.left-choose-energy-container .time-radio:checked').attr('data-id');

    _ajaxEcTypeWord = getEtName(commonEcType);

    //获取指标ID
    var normItemID = $('.choose-target-select .onChoose').attr('data-num');

    //支路是否瞬时值标识
    var f_AddSamAvg = 0;

    var branchUnit = '';

    if(normItemID){
        //在指标类型中寻找对应项
        $(energyNormItemArr).each(function(i,o){

            if(o.normIndex == normItemID){

                energyNormItemObj = o
            }
        });
    }

    //获取名称
    var areaName = '';

    //楼宇数据

        //url = 'EnergyQueryV2/GetPointerHorCompareData';

        //确定楼宇id
        var pts = _pointerZtree.getSelectedPointers();

        //比较对象不能超过三个
        //if(pts.length > 3){
        //    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'比较对象不能超过三个', '');
        //
        //    return false;
        //}

        $(pts).each(function(i,o){

            postPointerID.push(o.pointerID);

            //页面上方展示信息
            areaName += o.pointerName + " -- ";
        });



        //url = 'EnergyQueryV2/GetOfficeHorCompareData';

        //确定分户id
        var ofs = _officeZtree.getSelectedOffices();

        //比较对象不能超过三个
        //if(ofs.length > 3){
        //    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'比较对象不能超过三个', '');
        //
        //    return false;
        //}

        $( ofs).each(function(i,o){

            officeID.push(o.f_OfficeID);

            //页面上方展示信息
            areaName += o.f_OfficeName+ " -- ";
        });


        //url = 'EnergyQueryV2/GetBranchHorCompareData';

        //确定支路id
        var nodes;
        if( branchTreeObj){

            nodes= branchTreeObj.getCheckedNodes(true);

            if(nodes.length > 0){


                f_AddSamAvg = nodes[0].f_AddSamAvg;

                branchUnit = nodes[0].unit;

                var isComare = true;

                $( nodes).each(function(i,o){

                    serviceID.push(o.id);

                    //页面上方展示信息
                    areaName += o.name+ " -- ";

                    if(o.f_AddSamAvg != f_AddSamAvg || o.unit != branchUnit){

                        isComare = false;

                        return false;

                    }

                });

                if(!isComare){

                    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'不同类型支路无法比较', '');
                    return false;
                }

                //本地构建energyNormItemObj对象
                energyNormItemObj.energyItemID = _ajaxEcType;

                energyNormItemObj.energyNormFlag = 1;

            }

        }


    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }

    //获取当前时间类型
    var dateType = $('.choose-time-select .onChoose').html();

    //获取展示日期类型
    var showDateType =   getCurShowDateType(dateType)[0];

    //获取用户选择日期类型
    var selectDateType =   getCurShowDateType(dateType)[1];

    //获取开始时间
    var startTime = getCurPostTime(dateType)[0];

    //获取开始时间
    var endTime = getCurPostTime(dateType)[1];

    //定义获得数据的参数
    var ecParams = {
        "energyNorm":energyNormItemObj ,
        "energyItemID": _ajaxEcType,
        "pointerIDs": postPointerID,
        "officeIDs": officeID,
        "serviceIDs": serviceID,
        "f_AddSamAvg": f_AddSamAvg,
        "unityType": 0,
        "showDateType": showDateType,
        "selectDateType": selectDateType,
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
        },
        success:function(result){

            myChartTopLeft.hideLoading();

            //console.log(result);

            //判断是否返回数据
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }

            //如果选择支路 且为瞬时值
            if(flag == 3 && f_AddSamAvg != 0){

                $('.unit').hide();

                //单位
                $('.header-right-lists label').html("单位："+branchUnit);

            }else{

                $('.unit').show();

                //单位
                $('.header-right-lists label').html("单位：");
            }


            //改变头部显示信息
            var energyName = '';

            if($('.choose-target-select .onChoose').length > 0){
                energyName = $('.choose-target-select .onChoose').html();
            }


            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY/MM/DD');

            $('.right-header-title').html(energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);

            //首先处理本期的数据
            allData.length = 0;

            $(result).each(function(i,o){
                allData.push(o.ecMetaDatas);
            });

            //首先处理实时数据
            allDataX.length = 0;
            allDataY.length = 0;

            //绘制echarts
            if(showDateType == 'Hour' ){

                //确定x轴
                for(var i=0;i<allData[0].length;i++){
                    var dataSplit = allData[0][i].dataDate.split('T')[1].split(':');
                    var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataJoin);
                    }
                }
            }else{

                //确定x轴
                for(var i=0;i<allData[0].length;i++){
                    var dataSplit = allData[0][i].dataDate.split('T')[0];

                    if(allDataX.indexOf(dataJoin)<0){
                        allDataX.push(dataSplit);
                    }
                }
            };

            optionLine.series = [];

            optionLine.legend.data = [];

            //确定本期y轴
            for(var i=0;i<allData.length;i++){

                //创建echart series中的对象
                var obj = {};

                deepCopy(echartObj,obj);

                //对象值初始化
                obj.data.length = 0;

                obj.color = [echartColorArr[i % 5]];

                var data = [];

                for(var j=0; j < allData[i].length; j++){

                    data.push(allData[i][j].data.toFixed(2));
                }

                //给对象赋值
                obj.data = data;
                obj.name = result[i].returnOBJName;

                optionLine.series.push(obj);
                //改变上方图例
                optionLine.legend.data.push(result[i].returnOBJName);

            }

            //echart柱状图
            optionLine.xAxis[0].data = allDataX;

            myChartTopLeft.setOption(optionLine,true);

            //下方表格
            var tableHtml = '';
            //获取第一项的数据
            var total = result[0].sumMetaData;
            //获取第一项的峰值
            var max = result[0].maxMetaData;
            //获取第一项的谷值
            var min = result[0].minMetaData;
            //获取第一项的平均值
            var avg = result[0].avgMetaData;

            $(result).each(function(i,o){

                var index = i+1;
                tableHtml += '<tr>' +
                    '<td>'+ index+'</td>'+
                    '<td>'+ o.returnOBJName+'</td>'+
                    '<td class="branch-hide">'+ o.sumMetaData.toFixed(2)+'</td>'+
                    '<td>'+ o.maxMetaData.toFixed(2)+'</td>'+
                    '<td>'+ o.minMetaData.toFixed(2)+'</td>'+
                    '<td class="branch-hide">'+ o.avgMetaData.toFixed(2)+'</td>'+

                    '</tr>';

                if(i != 0){
                    //计算数据百分比
                    var totalPercent = (((o.sumMetaData -total) / total * 100).toFixed(1)) + '%';

                    if( total == 0){
                        totalPercent = 0 + '%';
                    }
                    //计算峰值百分比
                    var maxPercent = ((o.maxMetaData -max) / max * 100).toFixed(1) + '%';

                    if( max == 0){
                        maxPercent = 0 + '%';
                    }
                    //计算谷值百分比
                    var minPercent = ((o.minMetaData -min) / min * 100).toFixed(1) + '%';

                    if( min == 0){
                        minPercent = 0 + '%';
                    }

                    //计算平均值百分比
                    var avgPercent = ((o.avgMetaData -avg) / avg * 100).toFixed(1) + '%';

                    if( avg == 0){
                        avgPercent = 0 + '%';
                    }

                    tableHtml += '<tr>' +
                        '<td colspan="2">'+ index+'对比1</td>'+
                        '<td class="branch-hide">'+ totalPercent+'</td>'+
                        '<td>'+ maxPercent+'</td>'+
                        '<td>'+ minPercent+'</td>'+
                        '<td class="branch-hide">'+ avgPercent+'</td>'+
                        '</tr>';

                }
            });

            $('#dateTables tbody').html(tableHtml);

            if(flag == 3 && f_AddSamAvg != 0){

                $('#dateTables thead tr th').eq(2).hide();

                $('#dateTables thead tr th').eq(5).hide();

                $('#dateTables .branch-hide').hide();


            }else{

                $('#dateTables thead tr th').eq(2).show();

                $('#dateTables thead tr th').eq(5).show();

                $('#dateTables .branch-hide').eq(5).show();
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

//获取指标类型
//flag 是否默认加载数据
function GetShowEnergyNormItem(energyType,flag){

    //判断当前对象类型
    var index = onChooseObjectType;

    //支路无对比内容
    if(index > 2){

        $('.choose-target-select ul').html('');

        $('.choose-target-select font').html('');

        return false;
    }

    //要传递的数据
    var ecParams = {
        OBJFlag : index
    };

    $.ajax({
        type: 'get',
        url: sessionStorage.apiUrlPrefix + 'EnergyQueryV2/GetShowHorCompareItem',
        data: ecParams,
        success: function (result) {

            var html = '';

            var unitHtml = '';
            //指标类型清空
            energyNormItemArr.length = 0;

            var dataArr = [];

            $(result).each(function(i,o){
                //指标类型重新赋值
                energyNormItemArr.push(o);
                //获取对应能耗类型下的指标
                if(o.energyType == energyType){
                    dataArr.push(o);
                }
            });

            $(dataArr).each(function(i,o){

                //如果是第一个默认选中
                if(i == 0){
                    html += '<li data-num ="'+ o.normIndex+'" class="the-select-message the-target-message onChoose" data-unit="'+ o.energyUnit+'">'+ o.energyItemName+'</li>';
                    //右上角单位
                    $('.unit').val(o.energyUnit);

                    $('.choose-target font').html( o.energyItemName);

                }else{

                    html += '<li data-num ="'+ o.normIndex+' " data-unit="'+ o.energyUnit+'" class="the-select-message the-target-message">'+ o.energyItemName+'</li>'

                }

            });

            html += '<div class="clearfix"></div>';

            //将指标类型嵌入页面
            $('.choose-target-select ul').html(html);

            //改变单位

            if(flag){

                //获取页面中具体数据
                var flag1 = onChooseObjectType + 1;

                getContentData(flag1);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })

}
