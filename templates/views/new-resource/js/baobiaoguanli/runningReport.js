$(function(){
    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    $('.datatimeblock').val(moment().format('YYYY-MM-DD'));

    //楼宇
    pointerData();

    //所有设备
    var _allDevArr = [];

    //当前条件下的所有数据
    var _allData = [];

    //导出时间（查询时间）
    var excelTime = moment().format('YYYY-MM-DD');

    //区域
    var area = $('#dev-type').children('option:selected').attr('data-value');

    areaBlock(area,true);

    //ztree搜索功能
    var key = $("#key");

    searchKey();

    //更换报表类型，获取区域
    $('#dev-type').change(function(){

        areaBlock($('#dev-type').children('option:selected').attr('data-value'));

    })

    /*-----------------------------------按钮事件-------------------------------------------------*/

    //查询
    $('#selected').click(function(){

        //初始化
        $('.table-area').empty();

        $('#alreadySelect').empty();

        conditionSelect($('#pointer').val());

    })

    //点击设备下拉框ztree出现
    $('#dev').click(function(){

        $('.ztreeblock').slideToggle();

    })

    //选择设备
    $('#selectDev').click(function(){

        //首先获取节点数量
        var treeObj = $.fn.zTree.getZTreeObj("dev-tree");

        var nodes = treeObj.getCheckedNodes(true);

        if(nodes.length == 0){

            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'请选择设备','');

        }else{

            $('#theLoading').modal('show');

            //初始化
            $('.table-area').empty();

            $('#alreadySelect').empty();

            //导出时间
            excelTime = moment().format('YYYY-MM-DD');

            getCheckedNodeFun();

            $('#theLoading').modal('hide');

            $('.ztreeblock').slideToggle();

        }


    })

    //取消
    $('#cancelDev').click(function(){

        $('.ztreeblock').slideToggle();

    })

    //全选
    $('#checkAll').click(function(){

        //与全不选互斥
        $('#cancelAll').removeClass('checkState');

        if($(this).hasClass('checkState')){


        }else{

            $(this).addClass('checkState');

            //选中所有节点
            var treeObj = $.fn.zTree.getZTreeObj("dev-tree");

            treeObj.checkAllNodes(true);

        }

    })

    //全不选
    $('#cancelAll').click(function(){

        //与全选互斥
        $('#checkAll').removeClass('checkState');

        if($(this).hasClass('checkState')){


        }else{

            $(this).addClass('checkState');

            //选中所有节点
            var treeObj = $.fn.zTree.getZTreeObj("dev-tree");

            treeObj.checkAllNodes(false);

        }

    })

    //打印
    $('#print').click(function(){

        _printFun($('.table-area'))

    })

    //导出
    $('.excelButton').click(function(){

        _exportExecl($('.table'));

    })

    /*-----------------------------------其他方法-------------------------------------------------*/

    //ztree树
    function devTree(arr){

        var setting = {
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all'
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{

                showIcon:false
            },
            callback: {
                //这个是点击后边的文字选中的事件
                onClick: function(e,treeId,treeNode){

                    //勾选当前选中的节点
                    zTreeObj.checkNode(treeNode, !treeNode.checked, true);

                    //获取所有节点的数量
                    var nodes = zTreeObj.getCheckedNodes(true);

                    if(nodes.length != _allDevArr.length ){

                        $('#checkAll').removeClass('checkState');

                    }else{

                        $('#checkAll').addClass('checkState');

                    }

                    if(nodes.length == 0){

                        $('#cancelAll').addClass('checkState');

                    }else{

                        $('#cancelAll').removeClass('checkState');

                    }


                },
                beforeClick:function(){

                    //$('#deparmentTree').find('.curSelectedNode').removeClass('curSelectedNode');

                },
                onCheck:function(e,treeId,treeNode){

                    //点击前边的按钮选中事件
                    //获取所有节点的数量
                    var nodes = zTreeObj.getCheckedNodes(true);

                    if(nodes.length != _allDevArr.length ){

                        $('#checkAll').removeClass('checkState');

                    }else{

                        $('#checkAll').addClass('checkState');

                    }

                    if(nodes.length == 0){

                        $('#cancelAll').addClass('checkState');

                    }else{

                        $('#cancelAll').removeClass('checkState');

                    }

                }
            }
        };

        var treeArr = [];

        for(var i=0;i<arr.length;i++){
            var obj = {};
            obj.id = arr[i].eqname;
            obj.name = arr[i].eqname;
            if(i==0){

                obj.checked = true;

            }
            treeArr.push(obj);
        }

        var zTreeObj = $.fn.zTree.init($("#dev-tree"), setting, treeArr);

    }

    //获取设备
    function conditionSelect(pointer){

        $('#theLoading').modal('show');

        var prm = {

            //楼宇id
            pId:pointer,

            //能源站
            AREA:$('#area').val(),

            //时间
            sp:$('.datatimeblock').val()

        }

        //首先判断是请求谁的数据 空调箱、换热站群控、蒸汽换热罐、离心机、溴化锂、地源热泵、冷却塔
        var urlArr = ['MultiReportRLgs/GetReportZHSKTXRLgs','MultiReportRLgs/GetReportRZQKRLgs','MultiReportRLgs/GetReportRHRBRLgs','MultiReportRLgs/GetReportLZLXRLgs','MultiReportRLgs/GetReportLZXLRLgs','MultiReportRLgs/GetReportLZRBRLgs','MultiReportRLgs/GetReportLQTRLgs'];

        var url = urlArr[$('#dev-type').val()-1];

        $.ajax({

            type:'post',

            url:_urls + url,

            data:prm,

            timeout:_theTimes,

            //发送数据之前
            //beforeSend:_beforeSendFun,

            //发送数据完成之后
            //complete:_completeFun,

            //成功
            success:function(result){

                $('#theLoading').modal('hide');

                //处理设备数据
                if(result.code == 0){

                    _allDevArr.length = 0;

                    _allData.length = 0;

                    for(var i=0;i<result.master.length;i++){

                        _allDevArr.push(result.master[i].eqname)

                        _allData.push(result.master[i]);
                    }

                    //根据返回的数据，生成设备的ztree树
                    devTree(_allData);

                    //获取选中节点
                    getCheckedNodeFun();

                }else{

                    //提示错误
                    _moTaiKuang($('#tip-Modal'),'提示', true, 'istap' ,result.msg, '');


                }

            },

            //失败
            error: _errorFun

        })


    }

    //ztree树搜索功能
    function searchKey(){

        //聚焦事件
        key.bind("focus",focusKey($('#key')));
        //失去焦点事件
        key.bind("blur", blurKey);
        //输入事件
        //key.bind("propertychange", searchNode);
        //输入事件
        key.bind("input", searchNode);

        function focusKey(e) {

            if ($('#key').hasClass("empty")) {

                $('#key').removeClass("empty");

            }
        }

        function blurKey(e) {

            //内容置为空，并且加empty类
            if ($('#key').get(0).value === "") {

                $('#key').addClass("empty");
            }
        }

        var lastValue='',nodeList=[];

        function searchNode(e) {

            //获取树
            var zTree = $.fn.zTree.getZTreeObj("dev-tree");

            //去掉input中的空格（首尾）
            var value = $.trim($('#key').get(0).value);

            //设置搜索的属性
            var keyType = "name";

            if (lastValue === value)

                return;

            lastValue = value;

            if (value === "") {

                $('#tip').html('');
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

                $('.tipes').html('抱歉，没有您想要的结果');

            }else{

                $('.tipes').html('');

            }

            updateNodes(true);

        }

        //选中之后更新节点
        function updateNodes(highlight) {

            var zTree = $.fn.zTree.getZTreeObj("dev-tree");

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

            //展开符合搜索条件的节点
            //展开 / 折叠 指定的节点
            zTree.expandNode(node,true,false,false);

            if(typeof node == 'object'){

                //pNode父节点
                var pNode = node.getParentNode();

            }

            if(pNode != null){

                nodeList.push(pNode);

                findParent(zTree,pNode);
            }
        }

    }

    //获取勾选的节点
    function getCheckedNodeFun(){

        var treeObj = $.fn.zTree.getZTreeObj("dev-tree");

        var nodes = treeObj.getCheckedNodes(true);

        //将选中的名字写进后边的
        var str = '已选中：';

        for(var i=0;i<nodes.length;i++){

            str += '<span style="margin-right: 5px;">' + nodes[i].name + '、' +'</span>'

        }

        $('#alreadySelect').empty().append(str);

        //筛选出的数据
        var filterArr = [];

        //通过比较选中的名称来给表格赋值；

        for(var i=0;i<_allData.length;i++){

            for(var j=0;j<nodes.length;j++){

                if(_allData[i].eqname == nodes[j].name){

                    filterArr.push(_allData[i]);

                }

            }

        }

        //判断是要报表类型
        if($('#dev-type').val() == 1){

            airConditioningFun(filterArr);

        }else if($('#dev-type').val() == 2){

            heatChangeFun(filterArr);

        }else if( $('#dev-type').val() == 3 ){

            hotWaterFun(filterArr)

        }else if( $('#dev-type').val() == 4 ){

            LXJFun(filterArr)

        }else if( $('#dev-type').val() == 5 ){

            XLJFun(filterArr)

        }else if( $('#dev-type').val() == 6 ){

            DYRBFun(filterArr)

        }else if( $('#dev-type').val() == 7 ){

            LQTFun(filterArr)

        }

    }

    //绘制空调箱表格(传入数组，来确定要生成几个)
    function airConditioningFun(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<table class="table nextPage" cellspacing="0" width="100%" style="text-align:center;border: 1px solid black">' +
                '<thead style="text-align:center">' +
                '<tr style="text-align:center">' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black;width:140px;">报表名称</th>' +
                '<th colspan="20" class="table-titleH" style="text-align:center;background: #ffffff;border:1px solid black"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">数据时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="20" class="data-time"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">导出时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="20" class="derive-time"></th>' +
                '</tr>' +
                '<tr>' +
                '<th colspan="21" style="text-indent: 35px;text-align: left;border: 1px solid black">位置:<span class="location"></span><span class="eqName"></span></th></tr>' +
                '<tr>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">记录时间</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">配电箱手自动状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">子系统运行模式</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">节能联控模式启闭</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">节能联控对象</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">安全联动模式启闭</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">安全联动对象</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">启停状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">报警状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">送风温度设定（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">回风温度设定（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">CO2设定（PPM）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">准点送风温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">回风温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">回风湿度（%）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">回风CO2浓度</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">新风温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">新风湿度（%）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">水阀开度（%）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">新风阀开度（%）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">回风阀开度（%）</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '</tbody>' +
                '<tfoot>' +
                '</tfoot>' +
                '</table>';


        }

        $('.table-area').empty().append(str);

        //赋值
        assignValue(arr);

    }

    //绘制换热站表格
    function heatChangeFun(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<table class="table nextPage" cellspacing="0" width="100%" style="text-align:center;border: 1px solid black">' +
                '<thead style="text-align:center">' +
                '<tr style="text-align:center">' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black;width:140px;">报表名称</th>' +
                '<th colspan="14" class="table-titleH" style="text-align:center;background: #ffffff;border:1px solid black"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">数据时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="14" class="data-time"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">导出时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="14" class="derive-time"></th>' +
                '</tr>' +
                '<tr><th colspan="16" style="text-indent: 35px;text-align: left;border: 1px solid black">位置:<span class="location"></span><span class="eqName"></span></th></tr>' +
                '<tr>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">记录时间</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">子系统控制模式</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">节能联控模式启停</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">节能联控对象</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">安全联动模式启停</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">安全联动对象</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽流量（t）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽压力（MPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">供水温度设定（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">供水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">回水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">供水压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">回水压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">热水泵运行台数</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">热水泵频率（Hz）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">未处理报警</th>' +
                '</tr>' +


                '</thead>' +
                '<tbody>' +
                '</tbody>' +
                '<tfoot>' +

                '</tfoot>' +
                '</table>';


        }

        $('.table-area').empty().append(str);

        //赋值
        assignValue(arr);

    }

    //绘制热水交换器表格
    function hotWaterFun(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += 	'<table class="table nextPage" cellspacing="0" width="100%" style="text-align:center;border: 1px solid black">' +
                '<thead style="text-align:center">' +
                '<tr style="text-align:center">' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black;width:140px;">报表名称</th>' +
                '<th colspan="6" class="table-titleH" style="text-align:center;background: #ffffff;border:1px solid black"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">数据时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="6" class="data-time"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">导出时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="6" class="derive-time"></th>' +
                '</tr>' +
                '<tr><th colspan="7" style="text-indent: 35px;text-align: left;border: 1px solid black">位置:<span class="location"></span><span class="eqName"></span></th></tr>' +
                '<tr>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">记录时间</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽压力（MPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽侧阀门开度（%）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">热水供水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">热水回水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">热水阀开度（%）</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '</tbody>' +
                '<tfoot>' +
                '</tfoot>' +
                '</table>'

        }

        $('.table-area').empty().append(str);

        //赋值
        assignValue(arr);

    }

    //绘制离心机表格
    function LXJFun(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<table class="table nextPage" cellspacing="0" width="100%" style="text-align:center;border: 1px solid black">' +
                '<thead style="text-align:center">' +
                '<tr style="text-align:center">' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black;width:140px;">报表名称</th>' +
                '<th colspan="23" class="table-titleH" style="text-align:center;background: #ffffff;border:1px solid black"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">数据时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="23" class="data-time"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">导出时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="23" class="derive-time"></th>' +
                '</tr>' +
                '<tr><th colspan="24" style="text-indent: 35px;text-align: left;border: 1px solid black">位置:<span class="location"></span><span class="eqName"></span></th></tr>' +
                '<tr>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">记录时间</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">运行状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻供水温度设定（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻供水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻回水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷却出水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷却回水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸发压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸发器温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷凝压力（kPa））</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷凝器温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">主机电流（%）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">轴承温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">油槽温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">供油压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">油槽压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">供油压差（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">导叶开度（%）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">运行电功率（kW）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">累计运行时间（h）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">上一小时电耗（kWh）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">手/自动状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">新增故障报警</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">故障停机</th>' +
                '</tr>' +


                '</thead>' +
                '<tbody>' +
                '</tbody>' +
                '<tfoot>' +

                '</tfoot>' +
                '</table>';

        }

        $('.table-area').empty().append(str);

        //赋值
        assignValue(arr);

    }

    //绘制捏修理及表格
    function XLJFun(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<table class="table nextPage" cellspacing="0" width="100%" style="text-align:center;border: 1px solid black">' +
                '<thead style="text-align:center">' +
                '<tr style="text-align:center">' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black;width:140px;">报表名称</th>' +
                '<th colspan="24" class="table-titleH" style="text-align:center;background: #ffffff;border:1px solid black"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">数据时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="24" class="data-time"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">导出时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="24" class="derive-time"></th>' +
                '</tr>' +
                '<tr><th colspan="25" style="text-indent: 35px;text-align: left;border: 1px solid black">位置:<span class="location"></span><span class="eqName"></span></th></tr>' +
                '<tr>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">记录时间</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">运行状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽压力（MPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻供水温度设定（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻供水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻回水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷却出水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷却回水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷剂蒸发温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷剂冷凝温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">溶液出口温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">低温再生器入口温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">浓低温再生器入口温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽调节阀开度（%）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">高温再生器露点（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">高温再生器入口（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">高温再生器出口（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸汽凝水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">凝水热交出口温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">抽气箱压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">运行功率（kW）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">累计运行时间（h）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">手/自动状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">新增故障报警</th>' +
                '</tr>' +


                '</thead>' +
                '<tbody>' +
                '</tbody>' +
                '<tfoot>' +

                '</tfoot>' +
                '</table>';

        }

        $('.table-area').empty().append(str);

        //赋值
        assignValue(arr);

    }

    //地源热泵
    function DYRBFun(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<table class="table nextPage" cellspacing="0" width="100%" style="text-align:center;border: 1px solid black">' +
                '<thead style="text-align:center">' +
                '<tr style="text-align:center">' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black;width:140px;">报表名称</th>' +
                '<th colspan="19" class="table-titleH" style="text-align:center;background: #ffffff;border:1px solid black"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">数据时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="19" class="data-time"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">导出时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="19" class="derive-time"></th>' +
                '</tr>' +
                '<tr><th colspan="20" style="text-indent: 35px;text-align: left;border: 1px solid black">位置:<span class="location"></span><span class="eqName"></span></th></tr>' +
                '<tr>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">记录时间</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">运行状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻供水温度设定（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻供水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻回水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">地源出水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">地源回水温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸发器压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">蒸发饱和温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷凝器压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷凝饱和温度（℃）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻水进口压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">冷冻水出口压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">地源出水压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">地源回水压力（kPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">运行功率（kW）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">累计运行时间（h）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">上一小时电耗（kWh）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">手/自动状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">新增故障报警</th>' +
                '</tr>' +


                '</thead>' +
                '<tbody>' +
                '</tbody>' +
                '<tfoot>' +

                '</tfoot>' +
                '</table>';

        }

        $('.table-area').empty().append(str);

        //赋值
        assignValue(arr);

    }

    //冷却塔
    function LQTFun(arr){

        var str = '';

        for(var i=0;i<arr.length;i++){

            str += '<table class="table nextPage" cellspacing="0" width="100%" style="text-align:center;border: 1px solid black">' +
                '<thead style="text-align:center">' +
                '<tr style="text-align:center">' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black;width:140px;">报表名称</th>' +
                '<th colspan="10" class="table-titleH" style="text-align:center;background: #ffffff;border:1px solid black"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">数据时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="10" class="data-time"></th>' +
                '</tr>' +
                '<tr>' +
                '<th class="printBgColor" style="text-align:center;background: #E2E9F2;border:1px solid black">导出时间</th>' +
                '<th style="text-align:center;background: #ffffff;border:1px solid black" colspan="10" class="derive-time"></th>' +
                '</tr>' +
                '<tr><th colspan="11" style="text-indent: 35px;text-align: left;border: 1px solid black">位置:<span class="location"></span><span class="eqName"></span></th></tr>' +
                '<tr>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">记录时间</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">启停状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">变频器反馈频率（Hz）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">进水压力（MPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">出水压力（MPa）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">电压（V）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">电流（A）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">准点功率（kw）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">上一小时电耗（kWh）</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">手/自动状态</th>' +
                '<th style="text-align:center;background: #E2E9F2;border:1px solid black">新增故障报警</th>' +
                '</tr>' +


                '</thead>' +
                '<tbody>' +
                '</tbody>' +
                '<tfoot>' +

                '</tfoot>' +
                '</table>';

        }

        $('.table-area').empty().append(str);

        //赋值
        assignValue(arr);

    }

    //给表格赋值
    function assignValue(arr){

        for(var i=0;i<arr.length;i++){

            //报表名称
            $('.table-titleH').eq(i).html(arr[i].report_Name);

            //数据时间
            $('.data-time').eq(i).html(arr[i].report_Dt);

            //导出时间
            $('.derive-time').eq(i).html(excelTime);

            //位置
            $('.location').eq(i).html(arr[i].location);

            //设备名称
            $('.eqName').eq(i).html(arr[i].eqname);

            //插入td

            var tds = '';

            for(var j=0;j<arr[i].report_list.length;j++){

                tds += '<tr>';

                //遍历属性，生成td j是属性
                for(var k in arr[i].report_list[j] ){

                    tds += '<td>' + arr[i].report_list[j][k] +'</td>';

                }

                tds +='</tr>'

            }

            $('.table').eq(i).find('tbody').empty().append(tds);


        }

    }

    //获取楼宇
    //获取楼宇
    function pointerData(){

        var pointer = JSON.parse(sessionStorage.getItem('pointers'));

        var str = '';

        for(var i=0;i<pointer.length;i++){

            str += '<option value="' + pointer[i].pointerID + '">' + pointer[i].pointerName + '</option>';

        }

        $('#pointer').empty().append(str);

        $('#pointer').val(sessionStorage.PointerID);


    }

    //获取设备区域flag表示第一次
    function areaBlock(devNum,flag){

        var prm = {

            devType:devNum

        }

        $.ajax({

            type:'post',

            url:_urls + 'MultiReportRLgs/GetDevTypeAreaDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                if(result != null){

                    if(result.code == 0){

                        if(result.areas.length >0){

                            var str = '';

                            for(var i=0;i<result.areas.length;i++){

                                str += '<option value="' + result.areas[i].areaID + '">' + result.areas[i].areaName +'</option>'

                            }

                            $('#area').empty().append(str);

                        }

                        //条件查询
                        if(flag){

                            conditionSelect(sessionStorage.PointerID);

                        }

                    }else{

                        //_moTaiKuang($('#tip-Modal'),'提示',true,'istap',result.msg,'');

                        console.log(result.msg);

                    }

                }

            },

            error:_errorFun1

        })

    }

})