$(function(){

    //var _ajaxEndTime = moment().format("YYYY/MM/DD");
    //
    //var _ajaxStartTime = moment().subtract(1,'d').format("YYYY/MM/DD");
    //
    ////日期插件
    //$('.datetimeStart').html(_ajaxEndTime);
    //
    //$('.datetimeEnd').html(_ajaxEndTime);
    //
    //$('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxStartTime);

    //目的：描绘区域位置树、报警类型树，能耗种类树，时间选择
    /*-----------------------全局变量-------------------------*/
    var _url = sessionStorage.apiUrlPrefix;

    //区域变量
    var _pointer_ID = [];

    //类型变量
    var _alarm_ID = [];

    //能耗类型
    var _energy_ID = [];

    var pointerID=[];

    var pointerName;

    var logoToReadID = [];

    var userId,_alaLogId,_texts;

    var nowDays = moment().format('YYYY/MM/DD') + ' 00:00:00';

    //楼宇变量
    var _objectSel;

    //能耗类型变量
    var _energy;

    //报警类型变量
    var _alarm;

    //后台数据
    var totalArr = [];

    //获取备注信息
    $('#datatables').on('click','.examine',function(){

        var $this = $(this);

        var _alaLogId = $this.parents('tr').children('.alaLogIDs').html();


        $(totalArr).each(function(i,o){

            if(o.alaLogID == _alaLogId){

                var html = '<p>支路信息：'+o.cName+'</p>';

                html += '<p>处理事件：'+o.sysLogEvent+'</p>';

                html += '<p>处理时间：'+o.sysLogDate.split('T')[0] +" " + o.sysLogDate.split('T')[1]+'</p>';

                html += '<p>处理人：'+o.sysLogUser+'</p>';

                html += '<p>处理备注：'+o.sysLogEventMemo+'</p>';

                $('#myModal0 .message').html(html);

                $('#myModal0').modal('show');

            }
        })

    });

    /*--------------------------表格-------------------------*/

    //初始化表格
    table = $('#datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        // "scrollY": "300px",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [
            {
                extend:'csvHtml5',
                text:'保存csv格式'
            },
            {
                extend: 'excelHtml5',
                text: '保存为excel格式'
            },
            {
                extend: 'pdfHtml5',
                text: '保存为pdf格式'
            }
        ],
        "columns": [
            {
                "title":"时间",
                "data":"dataDate",
                "render":function(data,type,row,meta){
                    if(data && data.length >0){
                        return data.split('T')[0] + ' ' + data.split('T')[1];
                    }
                }
            },
            {
                "title": "支路",
                "class":"L-checkbox cname",
                "data":"cName"
            },
            {
                "title": "楼宇名称",
                "data":"pointerName",
                "render":function(data,type,row,meta){
                    //获取ID
                    var id = row.alaLogID;

                    //return '<span data-id ="'+id+'"  style="color:black" class="open-views" title="点击查看">'+data+'</span>'
                    return '<span data-id ="'+id+'"  class="open-views" title="">'+data+'</span>'
                }
            },
            {
                "title": "报警类型",
                "data":"cDtnName"
            },
            {
                "title": "报警条件",
                "data":"expression"
            },
            {
                "title": "此时数据",
                "data":"data",
                "render":function(data,type,row,meta){

                    return data.toFixed(2);
                }
            },
            //{
            //    "title": "单位房间",
            //    "data":"rowDetailsExcDatas"
            //},
            {
                "title": "报警等级",
                "data":"priority"
            },
            {
                "title": "处理状态",
                "class":'L-checkbox',
                "targets": -1,
                "data": 'flag',
                "render":function(data,type,row,meta){
                    if(data==1){
                        return "<div class='checker'><span class='checked'><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>已阅读</span>";
                    }else if(data==3){
                        return "已处理";
                    }else{
                        return "<div class='checker'><span><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>未处理</span>";
                    }
                }
            },
            {
                "class":"alaLogID alaLogIDs theHidden",
                "data":"alaLogID"
                //"visible":"false"
            },
            {
                "class":"alaLogID pointerID",
                "data":"pointerID",
                "visible":"false"
            },
            {
                "title": "查看",
                "class":'L-button',
                "targets": -1,
                "data": null,
                "render":function(data,type,row,meta){

                    if(row.rowDetailsExcDatas.length == 0){

                        return  "无"

                    }else{

                        return  "<button class='btn btn-success details-control' data-alaLogID=''>显示/隐藏历史</button>";

                    }
                }
            },
            {
                "title": "处理备注",
                "data": 'sysLogID',
                "render":function(data,type,row,meta){

                    if(data == 0){

                        if(row.flag == 3){
                            return "<button class='btn btn-success clickButtons' data-toggle='modal' data-target='#myModal'>追加备注</button>"

                        }else{
                            return "<button class='btn btn-success clickButtons' data-toggle='modal' data-target='#myModal'>点击处理</button>"
                        }

                    }
                    else {

                        return '<a href="javascript:;" class="examine">查看备注</a>'
                    }
                }
            }
        ],
        createdRow: function(row,data,index){

            //普通报警
            if(data.priorityID == 1){

                $(row).addClass('general-alarm');

                //较急报警
            }else if(data.priorityID == 2){

                $(row).addClass('ordinary-alarm');

                //紧急报警
            }else if(data.priorityID == 3){

                $(row).addClass('urgency-alarm');

                //特别紧急报警
            }else if(data.priorityID == 4){

                $(row).addClass('particularly-urgency-alarm');
            }

        }
    });

    /*-----------------------树------------------------------*/

    //区域选择
    getPointer();

    //报警类型
    //typeOfAlarm();

    typeOfAlarmNew();

    //报警等级
    grandOfAlarm();

    /*-----------------------按钮事件------------------------*/

    $('.buttons').click('.btn',function(){

        //获得选中的楼宇的信息；
        _pointer_ID = _objectSel.getSelectedPointers();

        _energy_ID =  getNodeInfo(_energy,_energy_ID);

        _alarm_ID = getNodeInfo(_alarm,_alarm_ID);

        //获取报警数据
        alarmHistory();
    });

    $('#datatables tbody').on( 'click', 'input', function () {
        var $this = $(this);
        if($this.parents('.checker').children('.checked').length == 0){
            $this.parent($('span')).addClass('checked');
        }else{
            $this.parent($('span')).removeClass('checked');
        }
    } );

    $('#datatables tbody').on('click', 'td .details-control', function () {
        var $this = $(this);
        var cnames = $this.parents('tr').children('.cname').html();
        var pointerIDs = $this.parents('tr').children('.pointerID').html();
        var historyArr = [];

        for(var i=0;i<totalArr.length;i++){
            if(totalArr[i].cName == cnames && totalArr[i].pointerID == pointerIDs){
                historyArr = totalArr[i].rowDetailsExcDatas;
            }
        }
        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;
        var row = table.row( tr );
        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(historyArr) ).show();
            tr.addClass('shown');
        }
    } );


    $('#datatables tbody').on('click', '.clickButtons', function (){
        var $this = $(this);
        userId = sessionStorage.getItem('userName');
        _alaLogId = $this.parents('tr').children('.alaLogIDs').html();

        $('.modal-body').val('');

    });

    //获得备注内容
    $('.submitNote').click(function(){

        _texts = $(this).parents('.modal-header').children('.modal-body').val();

        //备注内容不能为空
        if(_texts == ''){
            _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'备注不能为空', '');
            return false;
        }

        processingNote();
    });

    $('.logoToRead').click(function(){
        logoToRead();
    });

    //获取登陆用户信息
    var userInfo = JSON.parse(sessionStorage.userInfo);

    //点击创建工单
    $('#datatables').on('click','.creatGD',function(){

        //loadding
        $('#theLoading').modal('show');

        //模态框显示
        _moTaiKuang($('#Creat-myModa'), '创建工单', false, '' ,'','创建');

        //初始化
        $('.gongdanList').find('input').val('');

        $('.gongdanList').find('textarea').val('');

        $('#GdNum').html('0');

        $('.gdListInfo').html('<li>无</li>');

        var prm = {

            //pointer
            pointerid:$(this).attr('data-pointer'),

            //cdataId
            cdataid:$(this).attr('data-cdata')

        };

        var _this = $(this);

        //报修备注str

        var thisTr = _this.parents('tr');

        var BxStr = '1、时间：' + thisTr.children().eq(0).html() + '；'

            + '2、支路：' +  thisTr.children().eq(1).html() + '；'

            + '3、报警事件：' +  thisTr.children().eq(3).html() + '；'

            + '4、此时数据：' +  thisTr.children().eq(5).html() + '；'

            + '5、报警等级：' +  thisTr.children().eq(6).html() + '；'

        //获取设备信息
        $.ajax({

            type:'post',

            url:_urls + 'NJNDeviceShow/ywDevGetDevInfo',

            data:JSON.stringify(prm),

            contentType:'application/json',

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result != null){

                    //赋值
                    //设备名称
                    $('#devMC').val(result.devname);

                    //设备编码(非必填)
                    $('#devBM').val(result.dnum);

                    //报修人信息
                    $('#bxRen').val(userInfo.userName);

                    //报修部门
                    $('#bxSec').val(userInfo.departName);

                    //设备系统
                    $('#devSys').val(result.dsname);

                    //设备分类
                    $('#devMatter').val(result.dcname);

                    //维修地点
                    $('#wxAdd').val(result.devlocal);

                    var thisTr = _this.parents('tr');

                    //报修备注
                    var str = '1、时间：' + thisTr.children().eq(0).html() + '；'

                        + '2、支路：' +  thisTr.children().eq(1).html() + '；'

                        + '3、报警事件：' +  thisTr.children().eq(3).html() + '；'

                        + '4、此时数据：' +  thisTr.children().eq(5).html() + '；'

                        + '5、报警等级：' +  thisTr.children().eq(6).html() + '；'

                    //报修备注
                    $('#bxRem').val(str);

                }

            },

            error:_errorFun

        });

        //查看未完成工单
        var prmGD = {

            //状态
            gdZhts:[1,2,3,4,5,6],

            //设备编码
            wxShebei: _this.attr('data-devnum'),

            //用户id
            userID:_userIdNum,

            //用户名
            userName:_userIdName

        };

        if(_this.attr('data-devnum') == ''){

            //报修备注
            prmGD.bxBeizhu = BxStr;

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDGetZh2',

            data:prmGD,

            timeout:_theTimes,

            success:function(result){

                if(result.length != 0){

                    var str = '';

                    for(var i=0;i<result.length;i++){

                        var bxStr = result[i].bxBeizhu;

                        var newBxStr = bxStr.replace(/\n/g, '<br>');

                        str += '<li>'

                        str += '<label for="">工单号：</label>' +
                            '<a href="../gongdangunali/productionOrder_see.html?gdCode=' + result[i].gdCode + '&gdCircle=1" target="_blank">' + result[i].gdCode  + '</a>' +
                            '<div></div>' +
                            '<label for="">详情：</label>' +
                            '<div class="detailGD">' + newBxStr + '</div>'

                        str += '</li>'

                    }

                    $('.gdListInfo').empty().append(str);

                }else{

                    var str = '<li>无</li>';

                    $('.gdListInfo').empty().append(str);

                }

                $('#GdNum').html(result.length);

            },

            error:_errorFun1

        })

    });

    //创建工单确定按钮
    $('#Creat-myModa').on('click','.dengji',function(){

        //模态框显示
        $('#theLoading').modal('show');

        //维修地点必填
        if($('#wxAdd').val() == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{

            var wxShix = "null";

            //如果设备分类由值，那么就传设备分类的值，如果没有就传null，维修事项也一样
            var dcname = $('#devMatter').val();

            if(dcname!=''){

                wxShix = dcname;

            }

            var prm = {

                //是否紧急
                'gdJJ':0,
                //设备名称
                'dName':$('#devMC').val(),
                //设备编码
                'dNum':$('#devBM').val(),
                //报修电话
                'bxDianhua':$('#bxTel').val() == ''?'123456':$('#bxTel').val(),
                //报修人信息
                'bxRen':$('#bxRen').val(),
                //维修地点
                'wxDidian':$('#wxAdd').val(),
                //报修部门
                'bxKeshi':$('#bxSec').val(),
                //报修部门编码
                'wxKeshiNum':userInfo.departNum,
                //设备分类
                'dcName':dcname,
                //设备分类编码***
                'dcNum':'',
                //报修备注
                'bxBeizhu':$('#bxRem').val(),
                //设备系统
                'wxShiX':wxShix,
                //设备系统编码***
                'wxShiXNum':'',
                //当前用户id
                'userID':_userIdNum,
                //工单来源*
                'gdSrc':3,
                //巡检任务编码
                'itkNum':'',
                //维修设备
                'wxShebei':$('#devBM').val()

            };

            $.ajax({

                type:'post',

                url:_urls + 'YWGD/ywGDCreDJDI',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result == 3){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单创建失败！', '');

                    }else{

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单创建成功！', '');

                        $('#Creat-myModa').modal('hide');

                        //刷新数据
                        alarmHistory();

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    $('#theLoading').modal('hide');

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'超时！', '');

                    }else{

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求失败！', '');

                    }

                }

            })

        }

    });


    ////打开某个故障位置的3d视图
    //$('#datatables tbody').on('click','.open-views',function(){
    //    //获取ID
    //    var id = $(this).attr('data-id');
    //    $('#3d-view').show();
    //
    //    //生成需要传递的ID
    //    id = 'w' + ((id % 3) + 1);
    //    exec_iframe('goToWarnPlace',id);
    //
    //});

    /*-----------------------其他方法------------------------*/

    //显示隐藏
    function format ( d ) {
        var theader = '<table class="table">' +
            '<thead><tr><td>时间</td><td>支路</td><td>楼宇名称</td><td>报警类型</td><td>报警条件</td><td>此时数据</td><td>报警等级</td></tr></thead>';
        var theaders = '</table>';
        var tbodyer = '<tbody>';
        var tbodyers = '</tbody>';
        var str = '';

        for(var i=0;i< d.length;i++){
            var atime = d[i].dataDate.split('T')[0] + ' ' + d[i].dataDate.split('T')[1];
            str += '<tr><td>' + atime +
                '</td><td>' + d[i].cName +
                '</td><td>' + d[i].pointerName +
                '</td><td>' + d[i].cDtnName +
                '</td><td>' + d[i].expression +
                '</td><td>' + d[i].data.toFixed(2) +
                '</td><td>' + d[i].priority +
                '</td></tr>'
        }
        return theader + tbodyer + str + tbodyers + theaders;
    }

    //去重
    function existItem(arr,item){ //遍历数组中的所有数，如果有相同的pointerID&&cdataID，返回true，如果没有的话返回false；
        for(var i= 0,len=arr.length;i<len;i++){
            if(arr[i].pointerID==item.pointerID && arr[i].cdataID==item.cdataID){
                return true;
            }
        }
        return false;
    }

    //范围选择树
    function getPointer(){
        //读取楼宇和科室的zTree；
        _objectSel = new ObjectSelection();
        _objectSel.initPointers($("#allPointer"),true);
        _pointer_ID = _objectSel.getSelectedPointers();
    }

    //报警类型
    function typeOfAlarm(){

        var typeFlag = false;
        //获取本地存储的报警类型
        var localType;
        if(sessionStorage.getItem('menuArg')){
            localType = sessionStorage.getItem('menuArg').split(',')[1];
        }

        if(localType && localType != -1) {
            typeFlag = true;
        }

        var zNodes=[];
        var allAlarmInfo={};
        allAlarmInfo.id="-1";
        allAlarmInfo.name="全部";
        allAlarmInfo.checked="true";
        allAlarmInfo.open = "true";
        zNodes.push(allAlarmInfo);
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcType',
            success:function(result){
                if(result.length == 0){ //没有数据时候跳出,清除树
                    var lastTree = $.fn.zTree.getZTreeObj("typeSelection");
                    if(lastTree) { lastTree.destroy(); }
                    return;
                }
                var branchArr=[];
                for(var i=0;i<result.length;i++){
                    if(typeFlag){
                        if(localType.indexOf(result[i].innerID) != -1){
                            branchArr.push(result[i]);
                        }
                    }else{
                        branchArr.push(result[i]);
                    }

                }
                //遍历数组，确定zNodes；
                for(var i=0;i<branchArr.length;i++){
                    zNodes.push({id:branchArr[i].innerID,name:branchArr[i].cDtnName,pId:allAlarmInfo.id});
                }
                var ztreeSettings = {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        chkboxType: { "Y": "ps", "N": "ps" },
                        radioType: 'all'

                    },
                    data: {
                        key: {
                            title: ""
                        },
                        simpleData: {
                            enable: true
                        }
                    },
                    view: {
                        showIcon: false,
                        showTitle:true
                    },
                    callback: {
                        onClick:function (event,treeId,treeNode){
                            _alarm.checkNode(treeNode,!treeNode.checked,true);
                        }
                    }
                };
                _alarm = $.fn.zTree.init($("#typeSelection"), ztreeSettings, zNodes);  //ul的id
                _alarm_ID = getNodeInfo(_alarm,_alarm_ID);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });
    }

    function setZtree(treeId,treeData){

        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all',
                nocheckInherit: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false,
            },
            callback: {

                onClick: function(e,treeId,treeNode){

                    //取消全部打钩的节点
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    treeObj.checkNode(treeNode,!treeNode.checked,true);

                },

                beforeClick:function(){

                    treeId.find('.curSelectedNode').removeClass('curSelectedNode');

                },

                onCheck:function(e,treeId,treeNode){

                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    //取消全部打钩的节点
                    treeObj.checkNode(treeNode,true,true);

                }

            }
        };

        pointerObj = $.fn.zTree.init(treeId, setting, treeData);

        //var node = pointerObj.getNodesByFilter(function (node) { return node.level == 0 }, true);
        //
        ////获取根节点
        //pointerObj.expandNode(node, true, false, false);

    }

    //报警类型
    function typeOfAlarmNew(){

        var data = [

            //全部
            {
                id:-1,

                name:'全部',

                checked:true,

                open:true

            },

            //设备报警
            {
                id:2,

                name:'设备报警',

                pId:'-1'

            },

            //运行报警
            {
                id:3,

                name:'运行报警',

                pId:'-1'

            },

            //仪表报警
            {
                id:1,

                name:'仪表报警',

                pId:'-1'

            },

        ]

        setZtree($("#typeSelection"),data);

    }

    //报警等级
    function grandOfAlarm(){

        $.ajax({

            type:'get',

            url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllAlarmPriority',

            timeout:_theTimes,

            success:function(result){

                var data = [];

                var obj = {

                    id:0,

                    name:'全部',

                    checked:true,

                    open:true

                };

                data.push(obj);

                for(var i=0;i<result.length;i++){

                    var obj = {};

                    obj.id = result[i].priorityID;

                    obj.name = result[i].priorityName;

                    obj.pId = 0

                    data.push(obj);

                }

                setZtree($("#energyTypes"),data);

                //报警数据
                alarmHistory();

            },

            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });

    }

    //获取选中的节点的信息
    function getNodeInfo(ztree,variable){

        if(!ztree){

            return;
        }

        var nodes = ztree.getCheckedNodes(true);

        var curPointer = {};

        variable = [];

        for(var i=0;i<nodes.length;i++){
            curPointer = {};
            curPointer.id = nodes[i].id;
            curPointer.name = nodes[i].name;
            variable.push(curPointer);

        }
        return variable;
    }

    //表格赋值
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }

    //获取报警记录信息
    function alarmHistory(){

        var pointer = [];

        for(var i=0; i<_pointer_ID.length; i++){

            pointer.push(_pointer_ID[i].pointerID);

        }

        //获取报警类型
        var treeObjType = $.fn.zTree.getZTreeObj("typeSelection");

        var nodesType = treeObjType.getCheckedNodes(true);

        //获取报警等级
        var treeObjGrand = $.fn.zTree.getZTreeObj("energyTypes");

        var nodesGrand = treeObjGrand.getCheckedNodes(true);

        //获取检测类型

        if(sessionStorage.getItem('menuArg')){

            var localType = sessionStorage.getItem('menuArg').split(',')[2];

        }else{

            localType = '';

        }

        //获取楼宇id
        var prm = {
            'st' : getPostTime()[0] + ' 00:00:00',
            'et' : getPostTime()[1] + ' 00:00:00',
            'pointerIds' : pointer,
            //报警类型
            'excTypeInnderId' : nodesType[0].id,
            //报警等级
            "deaLeval":nodesGrand[0].name=='全部'?'':nodesGrand[0].name,

            'groupTypeId' : localType,
            "dealFlag": -1, //0为未处理 -1为全部
            "userID" :  _userIdNum,
        };

        $.ajax({
            type:'post',
            url:_url + 'ZKAlarm/GetAllExcData',
            data:prm,
            beforeSend:function(){
                $('.main-contents-table').children('img').show();
            },
            success:function(result){
                totalArr.length = 0;
                $('.main-contents-table').children('img').hide();
                var dataArr = [];
                var pcids = [];
                for(var i=0;i<result.length;i++){
                    totalArr.push(result[i]);

                }
                datasTable($("#datatables"),totalArr);

                ////绘制3dViews中展示的数据
                //var warnData = [];
                //$(dataArr).each(function(i,o){
                //    //获取ID
                //    var id = 'w' + ((o.alaLogID % 3) + 1);
                //
                //    //描述
                //    var desc = '设备故障，请注意！';
                //    if(o.memo != ''){
                //        desc = o.memo;
                //    }
                //    //编码
                //    var code = 'AHU-01';
                //    if(o.alarmCode != ''){
                //        code = o.alarmCode;
                //    }
                //
                //    var obj = {
                //        "id":id,
                //        "address": o.cName,
                //        "name": o.pointerName,
                //        "code": code,
                //        "type": o.cDtnName,
                //        "desc":desc,
                //        "level": o.priorityID
                //    }
                //    warnData.push(obj);
                //});
                ////关闭按钮
                //$('.close-view').off('click');
                //$('.close-view').on('click',function(){
                //    $('#3d-view').hide();
                //    exec_iframe('warnupload',JSON.stringify(warnData));
                //    exec_iframe('warn');
                //});
                //
                //$('.close-view').click();

                //console.log(warnData);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });
    }

    //标识阅读功能
    var logoToReadID = [];

    function logoToRead (){
        logoToReadID = [];
        var pitchOn = $('.choice').parent('.checked'); //包含结果的数组的object
        for(var i=0;i<$('.choice').length;i++){
            //if($('.choice').eq(i).parent('.checked'))
            if($('.choice').eq(i).parent('.checked').length != 0){
                logoToReadID.push($('.choice').eq(i).attr('data-alalogid'));
            }
        }
        console.log(logoToReadID);
        var alaLogIDs = {
            '':logoToReadID
        };

        $.ajax(
            {
                'type':'post',
                'url':sessionStorage.apiUrlPrefix + 'Alarm/UpdateAlarmReaded',
                'async':false,
                'data':alaLogIDs,
                'success':function(result){
                    //重新获取页面数据
                    alarmHistory();
                }
            }
        )
    }

    //用户名  当前时间（获取） alaLogId  input.val()
    function processingNote(){


        //获取当前用户名
        var prm = {
            'userId':userId,
            'msgTime':nowDays,
            'alaLogId':_alaLogId,
            'alaMessage':_texts
        };

        $.ajax(
            {
                'type':'post',
                'url':sessionStorage.apiUrlPrefix + 'Alarm/SetAlarmMessage',
                'data':prm,
                success:function(result){
                    if(result){
                        $("#myModal").modal('hide');
                        $('.choice[data-alaLogID="' + _alaLogId  + '"]').parent().addClass('checked');

                        //重新获取页面数据
                        alarmHistory();

                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            }
        )
    }
});