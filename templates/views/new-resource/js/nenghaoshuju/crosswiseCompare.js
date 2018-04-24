$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //时间初始化
    $('.time-options-1').click();

    //记录页面
    _energyTypeSel = new ETSelection();

    //读取能耗种类
    _getEcType('initPointers');

    //默认选中第一个能耗
    $('.selectedEnergy').addClass('blueImg0');

    _getEcTypeWord();

    //默认能耗种类
    _ajaxEcType =_getEcTypeValue();

    _ajaxEcTypeWord = _getEcTypeWord();

    //楼宇ztree树
    _pointerZtree = _getPointerZtree($("#allPointer"),2);

    //科室ztree树
    _officeZtree = _getOfficeZtree($("#allOffices"),2);

    //楼宇搜索功能
    _searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");

    //默认勾选前两个楼宇
    var zTree = $.fn.zTree.getZTreeObj("allPointer");
    var nodes = zTree.getNodes();

    zTree.checkNode(nodes[0], false, false);  //父节点不被选中
    zTree.setChkDisabled(nodes[0], true); //父节点禁止勾选

    zTree.checkNode(nodes[0].children[0].children[0], true, true);
    //zTree.checkNode(nodes[0].children[0].children[1], true, true);

    //获取支路
    GetAllBranches(2);
    //branchesType = 2 支路复选框
    branchesType = 2;
    ////默认加载数据
    GetShowEnergyNormItem(100,true);

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);


        //先判断获取的是楼宇还是科室
        var o = $('.tree-0')[0].style.display;
        //科室状态
        var a = $('.tree-2')[0].style.display;
        //分户状态
        var s = $('.tree-3')[0].style.display;

        if(o != 'none'){
            //楼宇数据
            getPointerData('EnergyQueryV2/GetPointerHorCompareData',1);

        }else if(a == 'block'){
            //分户数据
            getPointerData('EnergyQueryV2/GetOfficeHorCompareData',2);

        }else if(s == 'block'){
            //支路数据
            getPointerData('EnergyQueryV2/GetBranchHorCompareData',3);

        }
    });

    //能耗选择
    $('.typee').click(function(){

        $('.typee').removeClass('selectedEnergy');
        $(this).addClass('selectedEnergy');

    });

    //点击切换楼宇或单位时，改变上方能耗类型
    $('.left-middle-main .left-middle-tab').on('click',function(){

        //判断页面中是否存在能耗类型选项
        if(typeof _energyTypeSel!="undefined" ){
            if($(this).index() == 0){

                _energyTypeSel.initPointers($(".energy-types"),undefined,function(){
                    getEcType();
                });

            }else if($(this).index() == 1){

                _energyTypeSel.initOffices($(".energy-types"),undefined,function(){
                    getEcType();
                });
            }
            //改变右上角单位
            var html = '';
            $(unitArr3).each(function(i,o){
                html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
            });

            $('#unit').html(html);

            //如果当前页面存在支路
            if($('#allBranch').length > 0){
                //获取当前楼宇下的支路
                GetAllBranches(2);
            }
            //默认选中第一个能耗
            $('.selectedEnergy').addClass('blueImg0');
        }else{

        };

        //获取指标类型
        var energyType = $('.selectedEnergy').attr('value');

        GetShowEnergyNormItem(energyType);

    });

    //改变能耗类型 改变对应的指标
    $('.energy-types').on('click','div',function(){

        //获取当前能耗类型
        var energyType = $('.selectedEnergy').attr('value');

        GetShowEnergyNormItem(energyType);

    });

    //改变指标类型 右上角单位跟着改变
    $('.left-middle-main1').on('click','p',function(){

        $('.left-middle-main1 p').removeClass('curChoose');

        $(this).addClass('curChoose');

        //console.log($(this).attr('data-unit'));

        //改变右上角单位名称
        $('.unit').val($('.curChoose').attr('data-unit'));
    });

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

    var zoomSize = 6;
    myChartTopLeft.on('click', function (params) {
        console.log(allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        myChartTopLeft.dispatchAction({
            type: 'dataZoom',
            startValue: allDataX[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue: allDataX[Math.min(params.dataIndex + zoomSize / 2, allDataY.length - 1)]
        });
    });

});

//存放获取到的指标类型
var energyNormItemArr = [];

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];
var allDataX = [];
var allDataY = [];

//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

//柱状图配置项
var optionBar = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['累计值'],
        top:'30',
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
            name:'累计值',
            type:'bar',
            data:[],
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
            //
            //},
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
        data:['累计值', '比较斜率'],
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
            name:'累计值',
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
            data:[],
        }
    ]
};

//折线图配置项
var optionLine = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['累计值'],
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
        left: '10%',
        right: '8%'
    },
    series : [

    ]
};

/*---------------------------------otherFunction------------------------------*/

var echartObj =  {name:'累计值',
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

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(url,flag){

    var totalAllData = 0;

    //存放要传的楼宇集合
    var postPointerID = [];

    //存放要传递的分户集合
    var officeID = [];

    //存放要传的支路ID
    var serviceID = [];

    //存放要传递的指标类型
    var energyNormItemObj = {};

    //获取指标ID
    var normItemID = $('.left-middle-main1 .curChoose').attr('data-num');

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
    if(flag == 1){
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

        //分户数据
    }else if(flag == 2){
        //确定分户id
        var ofs = _officeZtree.getSelectedOffices();

        console.log(ofs);
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

    }else if(flag == 3){
        //确定支路id
        var nodes = branchTreeObj.getCheckedNodes(true);

        ////比较对象不能超过三个
        //if(nodes.length > 3){
        //    _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'比较对象不能超过三个', '');
        //
        //    return false;
        //}
        $( nodes).each(function(i,o){

            serviceID.push(o.id);

            //页面上方展示信息
            areaName += o.name+ " -- ";
        });

        //本地构建energyNormItemObj对象
        energyNormItemObj.energyItemID = _ajaxEcType;

        energyNormItemObj.energyNormFlag = 1;
    }

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }

    //获取展示日期类型
    var showDateType = getShowDateType()[0];

    //获取用户选择日期类型
    var selectDateType = getShowDateType()[1];

    //获取开始时间
    var startTime = getPostTime()[0];

    //获取开始时间
    var endTime = getPostTime()[1];

    //定义获得数据的参数
    var ecParams = {
        "energyNorm":energyNormItemObj ,
        "energyItemID": _ajaxEcType,
        "pointerIDs": postPointerID,
        "officeIDs": officeID,
        "serviceIDs": serviceID,
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
            //改变头部显示信息
            var energyName = '';

            if($('.left-middle-main1 .curChoose').length > 0){
                energyName = $('.left-middle-main1 .curChoose').html();
            }


            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY-MM-DD');

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
            //获取第一项的累计值
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
                    '<td>'+ o.sumMetaData.toFixed(2)+'</td>'+
                    '<td>'+ o.maxMetaData.toFixed(2)+'</td>'+
                    '<td>'+ o.minMetaData.toFixed(2)+'</td>'+
                    '<td>'+ o.avgMetaData.toFixed(2)+'</td>'+

                    '</tr>';

                if(i != 0){
                    //计算累计值百分比
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
                        '<td>'+ totalPercent+'</td>'+
                        '<td>'+ maxPercent+'</td>'+
                        '<td>'+ minPercent+'</td>'+
                        '<td>'+ avgPercent+'</td>'+
                        '</tr>';

                }
            });

            $('#dateTables tbody').html(tableHtml);

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
    var index = $('.left-middle-main .isChoose').index();
    //支路无对比内容
    if(index > 2){

        $('.left-middle-main1').html('');

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
                    html += '<p data-num ="'+ o.normIndex+'" class="curChoose" data-unit="'+ o.energyUnit+'">'+ o.energyItemName+'</p>';
                    //右上角单位
                    $('.unit').val(o.energyUnit);
                }else{
                    html += '<p data-num ="'+ o.normIndex+' " data-unit="'+ o.energyUnit+'">'+ o.energyItemName+'</p>'
                }


            });
            html += '<div class="clearfix"></div>';
            //将指标类型嵌入页面
            $('.left-middle-main1').html(html);

            //改变单位

            if(flag){
                getPointerData('EnergyQueryV2/GetPointerHorCompareData',1);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })

}
