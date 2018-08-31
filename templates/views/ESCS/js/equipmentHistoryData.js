/**
 * Created by admin on 2018/3/11.
 */
$(function(){

    //获取到当前项目名称
    var systemName = sessionStorage.getItem('systemName');

    $('.systemTitle').html(systemName);

    //获取区域位置的数据
    getDevAreaByType();

    _selectTime("自定义");

    var nowTime = moment(sessionStorage.sysDt).format('YYYY-MM-DD');

    $('#spDT').val(moment(nowTime).subtract('1','days').format("YYYY-MM-DD"));

    $('#epDT').val(nowTime);

    //时间插件
    _timeYMDComponentsFun11($('.abbrDT'));


    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('#selected').click(function(){

        getPointerData();

    });

    //数据导出
    $('.buttons').children('#excelBtn').click(function(){



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

    //删除设备列表中的项目
    $('.select-equipment-container').on('click',"font",function(){

        $(this).parents("p").remove();

    });

    //清除全部按钮
    $('.clear-list').on('click',function(){

        $('.select-equipment-container').empty();

    });

});

/*---------------------------------table-----------------------------------*/

var col = [

    {
        title:'对象',
        class:'',
        data:"returnOBJName"
    },
    {
        title:'单位',
        data:"returnOBJUnit"
    },
    {
        title:'峰值',
        data:"maxMetaData",
        render:function(data, type, full, meta){

            return data.toFixed(1);
        }
    },
    {
        title:'出现时间',
        data:"maxMetaDataDT"
    },
    {
        title:'谷值',
        data:"minMetaData",
        render:function(data, type, full, meta){

            return data.toFixed(1);
        }
    },
    {
        title:'出现时间',
        data:"minMetaDataDT"
    },
    {
        title:'平均值',
        data:"avgMetaData",
        render:function(data, type, full, meta){

            return data.toFixed(1);
        }
    }

]

//右上角楼宇table

_tableInit($('#dateTables'),col,2,false,'','','','','','','','');

//var table = $('#dateTables').DataTable({
//    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
//    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
//    //是否分页
//    "destroy": false,//还原初始化了的datatable
//    "paging":true,
//    "bPaginate": false,
//    "ordering": false,
//    'searching':false,
//    'info':false,
//    //"scrollY": '400px', //支持垂直滚动
//    //"scrollCollapse": true,
//    'language': {
//        'emptyTable': '没有数据',
//        'loadingRecords': '加载中...',
//        'processing': '查询中...',
//        'lengthMenu': '每页 _MENU_ 件',
//        'zeroRecords': '没有数据',
//        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
//        'paginate': {
//            'first':      '第一页',
//            'last':       '最后一页',
//            'next':       '下一页',
//            'previous':   '上一页'
//        },
//        'infoEmpty': ''
//    },
//    'buttons': [
//    ],
//    "dom":'B<"clear">lfrtip',
//    //数据源
//    'columns':[
//
//    ]
//});

/*---------------------------------echart-----------------------------------*/

//折线图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

var echartObj =  {name:'数据',
    type:'line',
    smooth:true,
    data:[]
};

//折线图配置项
var optionLine = {
    title:{

        subtext:'',
        padding: [20,100]

    },
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
            dataView : {

                optionToContent: function(opt) {

                    //thead
                    var table = '<table class="table table-striped table-advance table-hover  dataTable no-footer">';

                    var tables = '</table>';

                    var thead = '<thead>';

                    var theads = '</thead>';

                    var tbody = '<tbody>';

                    var tbodys = '</tbody>';

                    //th
                    var thStr = '<tr><th>时间</th>';

                    for(var i=0;i<opt.series.length;i++){

                        thStr += '<th>';

                        thStr += opt.series[i].name;

                        thStr += '</th>'

                    }

                    thStr += '</tr>';

                    //td
                    var tdStr = '';

                    for(var i=0;i<opt.xAxis[0].data.length;i++){

                        tdStr += '<tr>';

                        //时间
                        tdStr += '<td>';

                        tdStr += opt.xAxis[0].data[i];

                        tdStr += '</td>';

                        for(var j=0;j<opt.series.length;j++){

                            tdStr += '<td>';

                            tdStr += opt.series[j].data[i]==undefined?'-':opt.series[j].data[i];

                            tdStr += '</td>';

                        }

                        tdStr += '</tr>';


                    }

                    return table + thead + thStr + theads + tbody + tdStr + tbodys + tables;



                }

            }
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

var equipmentObj;

//定义当前的设备列表
var equipmentArr = [
    {
        name:"PY/PF-B1-19",
        id:1
    },
    {
        name:"PY/PF-B1-20",
        id:2
    },
    {
        name:"PY/PF-B1-21",
        id:3
    },
    {
        name:"PY/PF-B1-22",
        id:4
    },
    {
        name:"PY/PF-B1-23",
        id:5
    },
    {
        name:"PY/PF-B1-19",
        id:6
    },
    {
        name:"PY/PF-B1-20",
        id:7
    },
    {
        name:"PY/PF-B1-21",
        id:8
    },
    {
        name:"PY/PF-B1-22",
        id:9
    },
    {
        name:"PY/PF-B1-23",
        id:10
    }
];

var natureObj;

//定义当前的属性列表
var natureArr = [
    {
        name:"全部",
        id:0
    },
    {
        name:"回路启停",
        id:1
    },
    {
        name:"回路电流",
        id:2
    },
    {
        name:"回路电压",
        id:3
    },
    {
        name:"回路功率",
        id:4
    }
];

var areaObj;

//获取当前系统类型
var devTypeID = window.location.href.split("?arg=")[1];

//获取当前系统名称
var devTypeName = getSystemType(devTypeID);

//获取全部楼宇ID列表
var pointerIdArr = getPointersId();

$('.curSystem').html(devTypeName);

/*---------------------------------otherFunction------------------------------*/

//获取区域位置的数据
function getDevAreaByType(){

    $('.noDataTipQY').remove();

    var pointerArr = [sessionStorage.PointerID];

    var ecParams = {

        "devTypeID": '1',

        "pointerIDs": pointerArr
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+"NJNDeviceShow/GetDevAreaByType",
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){

            if(result != null ){

                if(result.length>0){

                    var dataArr = [];

                    $(result).each(function(i,o){

                        dataArr.push(o);

                    });

                    getEquipmentZtree(dataArr,3,getZNodes2,"#allPointer",areaObj);

                    //只要是父元素就不允许选择
                    var treeObj = $.fn.zTree.getZTreeObj('allPointer');

                    var nodes =  treeObj.getNodes();

                    var childrenArr = [];

                    loop(nodes);

                    function loop(arr){

                        for(var i=0;i<arr.length;i++){

                            if(arr[i].isParent){

                                arr[i].nocheck = true;

                                if(arr[i].children.length>0){

                                    loop(arr[i].children)

                                }

                            }else{

                                childrenArr.push(arr[i]);


                            }

                        }

                    }

                    //自动刷新ztree树
                    treeObj.refresh();

                    //选中第一个
                    var node = treeObj.getNodeByParam("id",childrenArr[0].id );

                    treeObj.checkNode(node,true);

                    //获取设备名称
                    getDevInfoCTypes(treeObj.getCheckedNodes()[0],true);

                }else{

                    //提示暂时没有获取到区域数据
                    var str = '<div class="noDataTipQY" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有获取到区域数据</div>'

                    $('#allPointer').before(str);

                }

            }else{

                //提示暂时没有获取到区域数据
                var str = '<div class="noDataTipQY" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有获取到区域数据</div>'

                $('#allPointer').before(str);

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
};

//根据设备类型获取设备名称及监测点类型(flag为真表示默认加载)
function getDevInfoCTypes(equipObj,flag){

    $('.noDataTipSB').remove();

    //获取当前选中名称及id

    var chooseID = equipObj.auxiliaryOBJID;

    var chooseName = equipObj.name;

    //获取父级元素ID

    var parentID = equipObj.devTypeForAreaID;

    var parentNode = equipObj.getParentNode();

    var parentName = equipObj.devTypeForAreaName;

    //传递给后台的数据
    var ecParams = {

        "devAreaID": parentID,
        "devTypeID": chooseID
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+"ZKDevicesShow/GetDevInfoCTypes",
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            $('.left-middle-main1').showLoading();
        },
        success:function(result){

            $('.left-middle-main1').hideLoading();

            if(result.arosList.length == 0 || result.code !=0){

                //提示暂时没有获取到区域数据
                var str = '<div class="noDataTipSB" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有获取到区域数据</div>'

                $('#allEquipment').before(str);

                return


            }

            //清空设备列表
            equipmentArr.length = 0;

            if(result.code == 0){

                $(result.arosList).each(function(i,o){

                    var obj = {

                        id : o.id,
                        name : o.devName,
                        devCNameTModels : o.devCNameTModelNew
                    };

                    equipmentArr.push(obj);
                });

            }

            //获取设备列表
            getEquipmentZtree(equipmentArr,1,false,false,equipmentObj);

            if(flag){

                var treeObj = $.fn.zTree.getZTreeObj('allEquipment');

                var nodes =  treeObj.getNodes();

                //选中第一个
                var node = treeObj.getNodeByParam("id",nodes[0].id );

                treeObj.checkNode(node,true);

                //自动获取属性
                getNatureTree(nodes[0].id,true);

            }




        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            $('.left-middle-main1').hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }

        }
    })

};

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(){

    $('.noDataTipMain').remove();

    //表格初始化
    _datasTable($('#dateTables'),[]);

    //判断是否选择设备
    if($('.select-equipment-container p').length == 0){

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择设备后查看', '');
    }

    //定义属性ID集合
    var cNameTIDs = [];

    //定义获得数据的参数
    for(var i=0; i<$('.select-equipment-container p b').length; i++){

        //设备ID
        var devId = $('.select-equipment-container p b').eq(i).attr('id');


        cNameTIDs.push(devId);
    }

    //获取查询时间
    var startDate = $('#spDT').val();

    var endDate = moment($('#epDT').val()).add(1,'days').format("YYYY-MM-DD");

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+"NJNDeviceShow/GetDevHistoryData",
        data:{
            "startTime": startDate,
            "endTime": endDate,
            "cNameTIDs": cNameTIDs
        },
        timeout:_theTimes,
        beforeSend:function(){

            //echart
            $('#rheader-content-16').showLoading();

            //table
            $('#dateTables').showLoading();
        },
        complete:function(){

            //echart
            $('#rheader-content-16').hideLoading();

            //table
            $('#dateTables').hideLoading();

        },
        success:function(result){

            myChartTopLeft.hideLoading();

            //判断是否返回数据
            if(result == null || result.devInfoDatas.length == 0){

                //提示暂时没有获取到区域数据
                var str = '<div class="noDataTipMain" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有获取到数据曲线</div>'

                $('#rheader-content-16').append(str);


                return false;
            }

            //改变头部日期
            var date = startDate +" — " + $('#epDT').val();

            $('.curTime').html(date);

            var xArr = [];

            var sArr = [];

            var ledArr = [];

            $(result.devInfoDatas[0].ecMetaDatas).each(function(i,o){

                xArr.push(o.dataDate.split('T')[0] + " " + o.dataDate.split('T')[1]);
            });

            //echart柱状图
            optionLine.title.subtext = result.devInfoDatas[0].returnOBJUnit;

            optionLine.xAxis[0].data = xArr;

            //清空optionLine
            optionLine.series.length = 0;

            $(result.devInfoDatas).each(function(i,o){

                //创建echart series中的对象
                var obj = {};

                deepCopy(echartObj,obj);
                //对象值初始化
                obj.data.length = 0;

                var legendName = o.returnOBJName;

                obj.name = legendName;

                ledArr.push(legendName);

                var dataArr = [];

                $(o.ecMetaDatas).each(function(j,k){

                    dataArr.push(k.data);
                });

                obj.data = dataArr;

                optionLine.series[i] = obj;
            });

            optionLine.legend.data = ledArr;

            myChartTopLeft.setOption(optionLine,true);

            //console.log(col);

            //var unite = '(' + result.devInfoTables[0].returnOBJUnit + ')';

            col = [

                {
                    title:'对象',
                    class:'',
                    data:"returnOBJName"
                },
                {
                    title:'单位',
                    data:"returnOBJUnit"
                },
                {
                    title:'峰值',
                    data:"maxMetaData",
                    render:function(data, type, full, meta){

                        return data.toFixed(1);
                    }
                },
                {
                    title:'出现时间',
                    data:"maxMetaDataDT"
                },
                {
                    title:'谷值',
                    data:"minMetaData",
                    render:function(data, type, full, meta){

                        return data.toFixed(1);
                    }
                },
                {
                    title:'出现时间',
                    data:"minMetaDataDT"
                },
                {
                    title:'平均值',
                    data:"avgMetaData",
                    render:function(data, type, full, meta){

                        return data.toFixed(1);
                    }
                }

            ]

            _tableInit($('#dateTables'),col,2,false,'','','','','','','','');

            //下方表格
            _datasTable($('#dateTables'),result.devInfoTables);

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
};

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

};

function getEquipmentZtree(EnItdata,flag,fun,node,treeObj){

    var setting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        },
        data: {
            key: {
                title: "title"
            },
            simpleData: {
                enable: true
            }
        },
        view: {
            showIcon: false
        },
        callback: {
            onClick:function (event,treeId,treeNode){

                var treeObj1 = $.fn.zTree.getZTreeObj(treeId);

                treeObj1.checkNode(treeNode,!treeNode.checked,false);

                var nodes = treeObj1.getCheckedNodes(true)[0];

                if(nodes == undefined){

                    return false;
                }

                //如果是点击属性选择树状图
                if(flag == 2){
                    $('#' + treeId).find('.checkbox_true_full_focus').next('a').addClass('curSelectedNode');

                    var treeObj = $.fn.zTree.getZTreeObj("allNature");

                    //获取当前已选中的属性
                    var pts = treeObj.getCheckedNodes(true);

                    //获取当前选中的设备
                    var eqps = $.fn.zTree.getZTreeObj("allEquipment").getCheckedNodes(true);

                    //调用绘制设备列表的函数
                    drawEquipmentList(eqps[0],pts);

                }

                //如果点击区域位置树状图
                if(flag == 3){

                    var treeObj = $.fn.zTree.getZTreeObj("allPointer");

                    //获取当前已选中的属性
                    var pts = treeObj.getCheckedNodes(true);

                    getDevInfoCTypes(pts[0]);

                    //查询属性初始化
                    getEquipmentZtree([],2,false,'#allNature',natureObj);

                    //已选设备初始化
                    $('.select-equipment-container').empty();

                }

                //如果点击设备名称树状图
                if(flag == 1){

                    var treeObj = $.fn.zTree.getZTreeObj("allEquipment");

                    //获取当前已选中的属性
                    var pts = treeObj.getCheckedNodes(true);

                    getNatureTree(pts[0].id);

                }
            },
            beforeClick:function(treeId,treeNode){

                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

            },
            onCheck:function(e,treeId,treeNode){

                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                $('#' + treeId).find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                //如果是点击属性选择树状图
                if(flag == 2){
                    $('#' + treeId).find('.checkbox_true_full_focus').next('a').addClass('curSelectedNode');

                    var treeObj = $.fn.zTree.getZTreeObj("allNature");

                    //获取当前已选中的属性
                    var pts = treeObj.getCheckedNodes(true);

                    //获取当前选中的设备
                    var eqps = $.fn.zTree.getZTreeObj("allEquipment").getCheckedNodes(true);

                    //调用绘制设备列表的函数
                    drawEquipmentList(eqps[0],pts);

                }

                //如果点击区域位置树状图
                if(flag == 3){

                    var treeObj = $.fn.zTree.getZTreeObj("allPointer");

                    //获取当前已选中的属性
                    var pts = treeObj.getCheckedNodes(true);

                    getDevInfoCTypes(pts[0]);


                }

                //如果点击设备名称树状图
                if(flag == 1){

                    var treeObj = $.fn.zTree.getZTreeObj("allEquipment");

                    //获取当前已选中的属性
                    var pts = treeObj.getCheckedNodes(true);

                    getNatureTree(pts[0].id);

                }
            }
        }
    };

    //判断是单选框还是复选框
    if(flag == 2){
        setting.check.chkStyle = 'checkbox';
    }

    var zNodes;

    if(!fun){

        zNodes = getZNodes1(EnItdata);

    }else{

        zNodes = fun(EnItdata);
    }

    //console.log(zNodes);
    if(node){

        treeObj = $.fn.zTree.init($(node), setting, zNodes);

    }else{

        treeObj = $.fn.zTree.init($("#allEquipment"), setting, zNodes);
    }

};


//根据参数绘制页面中已选设备列表
function drawEquipmentList(equipObj,natureArr){

    //console.log(equipObj.id)

    //定义属性列表的字符串
    var natureHtml = "";

    $(natureArr).each(function(i,o){

        if(o.pId == null){

            natureArr.remove(o);
        }
    });


    $(natureArr).each(function(i,o){

        if(i == 0){

            natureHtml += "( ";

        }


        natureHtml += "<b id='"+ o.id+"'>"+ o.name +"</b> ";

        if(i == natureArr.length -1){

            natureHtml += " )";

        }

    });


    //判断是替换还是重新插入
    if($("#"+equipObj.id+"eqp").length > 0){

        $("#"+equipObj.id+"eqp").find('.select-nature').html(natureHtml);

    }else{

        //定义插入页面中的字段
        var drawHtml = '<p  id="'+equipObj.id+'eqp"><span class="select-equipment">'+equipObj.name+'<span class="select-nature"></span><font></font></span></p>';

        $('.select-equipment-container').append(drawHtml);

        $("#"+equipObj.id+"eqp").find('.select-nature').html(natureHtml);
    }

};

//获取分项zTree树的数据
function getZNodes1(EnItdata){

    var zNodes = new Array();

    // console.log(EnItdata)

    $(EnItdata).each(function(i,o){

        //获取楼宇ID
        var pointerID = o.id;
        var ifOpen = true;

        if(pointerID == 0){
            zNodes.push({ id: pointerID, pId:-1, name:o.name,title: o.name,open:ifOpen,checked:false});

        }else{

            zNodes.push({ id: pointerID, pId:0, name:o.name,title: o.name,open:ifOpen,checked:false});


        }

    });
    return zNodes;

};

//获取分项zTree树的数据
function getZNodes2(EnItdata){

    var zNodes = new Array();

    $(EnItdata).each(function(i,o){

        //获取楼宇ID
        var pointerID = o.returnOBJID;

        var ifOpen = false;

        var parentID = o.parentOBJID;

        //zNodes.push({ id: pointerID, pId:parentID, name:o.returnOBJName,noCheck:false,title: o.returnOBJName,open:true,checked:false,auxiliaryOBJID: o.auxiliaryOBJID});

        if(o.returnType < 4){

            zNodes.push({ id: pointerID, pId:parentID, name:o.returnOBJName,title: o.returnOBJName,open:true,checked:false,nocheck :true,auxiliaryOBJID: o.auxiliaryOBJID});

        }else{

            if(o.returnType < 4){
                zNodes.push({ id: pointerID, pId:parentID, name:o.returnOBJName,title: o.returnOBJName,open:true,checked:false,nocheck :true,auxiliaryOBJID: o.auxiliaryOBJID});

            }else{

                zNodes.push({ id: pointerID, pId:parentID, name:o.returnOBJName,title: o.returnOBJName,open:true,checked:false,devTypeForAreaID: o.devTypeForAreaID,devTypeForAreaName: o.devTypeForAreaName,auxiliaryOBJID: o.auxiliaryOBJID});

            }


        }

    });
    return zNodes;

};

//获取当前设备下的属性集合(flag为真表示默认数据加载)
function getNatureTree(equipID,flag){

    //清空存放属性的集合
    natureArr.length = 0;

    var obj = {
        name:"全部",
        id:0
    };

    natureArr.push(obj);

    $(equipmentArr).each(function(i,o){

        if(o.id == equipID){

            //console.log(o.devCNameTModels);

            $(o.devCNameTModels).each(function(i,o){

                var obj = {
                    name : o.cNameT,
                    id : o.cNameTID
                };

                natureArr.push(obj);
            });

            return false;
        }


    });

    //获取属性列表
    getEquipmentZtree(natureArr,2,false,'#allNature',natureObj);

    if(flag){

        //自动选中全部
        var treeObj = $.fn.zTree.getZTreeObj('allNature');

        //默认选中第一个
        var node = treeObj.getNodeByParam("id",natureArr[1].id );

        treeObj.checkNode(node,true);

        var attrNode = treeObj.getCheckedNodes(true);

        //获取设备
        var devTree = $.fn.zTree.getZTreeObj('allEquipment');

        var devNodes = devTree.getCheckedNodes(true)[0];

        //调用绘制设备列表的函数
        drawEquipmentList(devNodes,attrNode);

        getPointerData();

    }


};

//从本地存储中获取楼宇ID列表
function getPointersId(){

    //存放楼宇ID列表
    var pointerIdArr = [];

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));


    $(pointerArr).each(function(i,o){

        pointerIdArr.push(o.pointerID);
    });

    return pointerIdArr;
};

//搜索
var lastValue='',nodeList=[],fontCss={};

function searchNode(e,node) {
    var zTree = $.fn.zTree.getZTreeObj("allEquipment");
    //去掉input中的空格（首尾）
    var value = $.trim($("#key0").val().trim());
    keyType = "name";
    if (lastValue === value)
        return;
    lastValue = value;
    if (value === "") {
        $('.tipess0').hide();
        //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
        //获取 zTree 的全部节点数据
        //如果input是空的则显示全部；
        zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;
        return;
    }
    //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
    // 的节点数据 JSON 对象集合
    nodeList = zTree.getNodesByParamFuzzy(keyType,value);
    nodeList = zTree.transformToArray(nodeList);
    if(nodeList==''){
        $('.tipess0').show();
        $('.tipess0').html('抱歉，没有您想要的结果')
    }else{
        $('.tipess0').hide();
    }
    updateNodes(true);

};

//搜索框
var key;
key = $("#key0");
key.bind("focus",focusKey)
    .bind("blur", blurKey)
    .bind("propertychange", searchNode)
    .bind("input", searchNode);

//选中之后更新节点
function updateNodes(highlight) {
    var zTree = $.fn.zTree.getZTreeObj("allEquipment");
    var allNode = zTree.transformToArray(zTree.getNodes());
    //指定被隐藏的节点 JSON 数据集合
    zTree.hideNodes(allNode);
    //遍历nodeList第n个nodeList
    for(var n in nodeList){
        findParent(zTree,nodeList[n]);
    }
    zTree.showNodes(nodeList);
};

//确定父子关系
function findParent(zTree,node){
    //展开 / 折叠 指定的节点
    zTree.expandNode(node,true,false,false);
    //pNode父节点
    if(typeof node == 'function'){
        return false;
    }
    //pNode父节点
    var pNode = node.getParentNode();
    if(pNode != null){
        nodeList.push(pNode);
        findParent(zTree,pNode);
    }
};
function filter(node) {
    return !node.isParent && node.isFirstNode;
}

//搜索框功能
function focusKey(e) {
    if (key.hasClass("empty")) {
        key.removeClass("empty");
    }
}
function blurKey(e) {
    //内容置为空，并且加empty类
    if ($('#key0').get(0).value === "") {

        $('#key0').addClass("empty");
    }
}
