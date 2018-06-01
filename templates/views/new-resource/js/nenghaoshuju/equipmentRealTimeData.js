/**
 * Created by admin on 2018/3/14.
 */
/**
 * Created by admin on 2018/3/11.
 */
$(function(){

    //获取到当前项目名称
    var systemName = sessionStorage.getItem('systemName');

    $('.systemTitle').html(systemName);

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));


    //默认勾选前两个楼宇
    //var zTree = $.fn.zTree.getZTreeObj("allPointer");
    //var nodes = zTree.getNodes();
    //
    //zTree.checkNode(nodes[0], false, false);  //父节点不被选中
    //zTree.setChkDisabled(nodes[0], true); //父节点禁止勾选
    //
    //zTree.checkNode(nodes[0].children[0].children[0], true, true);

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){

        //获取数据
        getPointerData();

    });

    //改变能耗类型 改变对应的指标
    $('.energy-types').on('click','div',function(){

        //获取当前能耗类型
        var energyType = $('.selectedEnergy').attr('value');

        GetShowEnergyNormItem(energyType);

    });

    //删除设备列表中的项目
    $('.select-equipment-container').on('click',"font",function(){

        $(this).parents("p").remove();

    });

    //清除全部按钮
    $('.clear-list').on('click',function(){

        $('.select-equipment-container').empty();

    });

    //获取区域位置的数据
    getDevAreaByType();

    //导出excel
    $('.save-excel').on('click',function(){

        $('.buttons-excel').click();

    });

});

//获取全部楼宇ID列表
var pointerIdArr = getPointersId();

//获取当前时间
var date = moment().format('YYYY-MM-DD');

$('.table-title .curTime').html(date);

//获取当前系统类型
var devTypeID = window.location.href.split("?arg=")[1];

//获取当前系统名称
var devTypeName = getSystemType(devTypeID);

$('.table-title .curSystem').html(devTypeName);

/*---------------------------------table-----------------------------------*/
//右上角楼宇table
var table = $('#dateTables').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":true,
    "bPaginate": false,
    "ordering": false,
    'searching':false,
    'info':false,
    //"scrollY": '400px', //支持垂直滚动
    //"scrollCollapse": true,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'hiddenButton'
        }
    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'数据时间',
            class:'',
            data:"dataDate"
        },
        {
            title:'检测设备',
            data:"devCdataName",
            render:function(data, type, full, meta){

                return data;
            }
        },
        {
            title:'数据',
            data:"data",
            render:function(data, type, full, meta){

                return data.toFixed(2);
            }
        },
        {
            title:'单位',
            data:"dataUnit"
        }
    ]
});

/*---------------------------------otherFunction------------------------------*/

//获取区域位置的数据
function getDevAreaByType(){

    var ecParams = {

        "devTypeID": devTypeID,
        "pointerIDs": pointerIdArr
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

            //console.log(result);

            //判断是否返回数据
            if(result == null || result.length == 0){

                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');

                return false;
            }

            getEquipmentZtree(result);


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

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(){

    //判断是否选择设备
    if($('.select-equipment-container p').length == 0){

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择设备后查看', '');
    }

    //定义设备ID集合
    var devIDsArr = [];

    //定义获得数据的参数
    for(var i=0; i<$('.select-equipment-container p').length; i++){

        //设备ID
        var devId = $('.select-equipment-container p').eq(i).find("b").attr('class');

        //区域ID
        var areaID =  $('.select-equipment-container p').eq(i).attr('class');

        devIDsArr.push({
            "devAreaID": areaID,
            "devTypeID": devId
        });
    }

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+"NJNDeviceShow/GetDevInsData",
        data:{
            "":devIDsArr
        },
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){


            //console.log(result);

            _datasTable($('#dateTables'),result);

            return false;

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

                var treeObj = $.fn.zTree.getZTreeObj("allPointer");

                treeObj.checkNode(treeNode,!treeNode.checked,false);

                //获取当前已选中的属性
                var pts = treeObj.getCheckedNodes(true);

                if(pts.length > 0){
                    drawEquipmentList(pts[0]);
                }
            },
            beforeClick:function(treeId,treeNode){

                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

            },
            onCheck:function(e,treeId,treeNode){

                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');

                $('#' + treeId).find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                var treeObj = $.fn.zTree.getZTreeObj("allPointer");

                //获取当前已选中的属性
                var pts = treeObj.getCheckedNodes(true);

                if(pts.length > 0){
                    drawEquipmentList(pts[0]);
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

        zNodes = fun();
    }

    //console.log(zNodes);
    if(node){

        treeObj = $.fn.zTree.init($(node), setting, zNodes);

    }else{

        treeObj = $.fn.zTree.init($("#allPointer"), setting, zNodes);
    }

};

//根据参数绘制页面中已选设备列表
function drawEquipmentList(equipObj){


    //获取当前选中名称及id

    var chooseID = equipObj.id;

    var chooseName = equipObj.name;

    //获取父级元素ID

    var parentID = equipObj.pId;

    var parentNode = equipObj.getParentNode();

    var parentName = parentNode.name;


    //定义属性列表的字符串
    var natureHtml = "( <b class='"+chooseID+"'>"+chooseName+"</b> )";


    //判断是替换还是重新插入
    if($("#" +chooseID+"eqp" +parentID).length > 0){

    }else{

        //定义插入页面中的字段
        var drawHtml = '<p style="width:50%;float: left" class="'+parentID+'" id="'+chooseID+'eqp' +parentID+'"><span class="select-equipment">'+parentName+'<span class="select-nature"></span><font></font></span></p>';

        $('.select-equipment-container').append(drawHtml);

        $("#" +chooseID+"eqp" +parentID).find('.select-nature').html(natureHtml);
    }

};

//获取分项zTree树的数据
function getZNodes1(EnItdata){

    var zNodes = new Array();

    $(EnItdata).each(function(i,o){

        //获取楼宇ID
        var pointerID = o.returnOBJID;
        var ifOpen = false;

        var parentID = o.parentOBJID;

        if(o.returnType < 3){

            zNodes.push({ id: pointerID, pId:parentID, name:o.returnOBJName,title: o.returnOBJName,open:true,checked:false,nocheck :true});

        }else{

            if(o.returnType < 4){
                zNodes.push({ id: pointerID, pId:parentID, name:o.returnOBJName,title: o.returnOBJName,open:ifOpen,checked:false,nocheck :true});

            }else{

                zNodes.push({ id: pointerID, pId:parentID, name:o.returnOBJName,title: o.returnOBJName,open:ifOpen,checked:false});

            }


        }

    });
    console.log(zNodes);
    return zNodes;

};

//搜索
var lastValue='',nodeList=[],fontCss={};

function searchNode(e,node) {
    var zTree = $.fn.zTree.getZTreeObj("allPointer");
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

}

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

//搜索框
var key;
key = $("#key0");
key.bind("focus",focusKey)
    .bind("blur", blurKey)
    .bind("propertychange", searchNode)
    .bind("input", searchNode);

//选中之后更新节点
function updateNodes(highlight) {
    var zTree = $.fn.zTree.getZTreeObj("allPointer");
    var allNode = zTree.transformToArray(zTree.getNodes());
    //指定被隐藏的节点 JSON 数据集合
    zTree.hideNodes(allNode);
    //遍历nodeList第n个nodeList
    for(var n in nodeList){
        findParent(zTree,nodeList[n]);
    }
    zTree.showNodes(nodeList);
}
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
}
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
