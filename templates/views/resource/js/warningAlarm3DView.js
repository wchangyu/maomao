$(function(){

    var _ajaxEndTime = moment().format("YYYY/MM/DD");

    var _ajaxStartTime = moment().subtract(1,'d').format("YYYY/MM/DD");

    //日期插件
    $('.datetimeStart').html(_ajaxStartTime);
    $('.datetimeEnd').html(_ajaxEndTime);
    $('.datetimepickereType').html(_ajaxStartTime +'-'+_ajaxStartTime);

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
    /*-------------------------时间------------------------*/
    //显示时间
    //显示开始结束时间，
    var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");

    var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");

    var _ajaxLastStartTime_1 = moment().subtract(2,'d').format("YYYY/MM/DD");

    var _ajaxLastEndTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");

    $('.datetimepickereType').html(_ajaxStartTime +'到'+_ajaxStartTime);

    //获取dataType(小时，日，月，年)
    var _ajaxDataType='日';

    initDate();

    $('#datetimepicker').on('changeDate',function(e){
        var inputValue;
        dataType();
        inputValue = $('#datetimepicker').val();
        if(_ajaxDataType=="日"){
            inputValue = $('#datetimepicker').val();
            var now = moment(inputValue).startOf('day');
            //当前开始结束时间
            var startDay = now.format("YYYY-MM-DD");
            var endDay = now.add(1,'d').format("YYYY-MM-DD");
            $('.datetimeStart').html(startDay);
            $('.datetimeEnd').html(startDay);
            //上一阶段开始结束时间
            var startsDay = now.subtract(2,'d').format("YYYY-MM-DD");
            var endsDay = now.add(1,'d').format("YYYY-MM-DD");
            _ajaxStartTime=startDay;
            _ajaxDataType_1='小时';
            var end=startDay + "到" +startDay;
            var aa = $('.datetimepickereType').text();
            if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
                if(aa.indexOf(end)<0){
                    $('.datetimepickereType').html(end);
                }
            }
            //当前开始、结束时间
            var startSplit = startDay.split('-');
            var endSplit = endDay.split('-');
            _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
            _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
            //上一阶段的开始、结束时间
            var startsSplit = startsDay.split('-');
            var endsSplit = endsDay.split('-');
            _ajaxLastStartTime_1 = startsSplit[0] + '/' + startsSplit[1] + '/' + startsSplit[2];
            _ajaxLastEndTime_1 = endsSplit[0] + '/' + endsSplit[1] + '/' + endsSplit[2];
        }else if(_ajaxDataType=="周"){
            inputValue = $('#datetimepicker').val();
            var now = moment(inputValue).startOf('week');
            //页面显示时间
            var nowStart = now.add(1,'d').format("YYYY-MM-DD");
            var nowEnd = now.add(6,'d').format("YYYY-MM-DD");
            $('.datetimeStart').html(nowStart);
            $('.datetimeEnd').html(nowEnd);
            //当前开始结束时间
            var startWeek = now.subtract(6,'d').format("YYYY-MM-DD");
            var endWeek = now.add(7,'d').format("YYYY-MM-DD");
            end =nowStart + "到" +nowEnd;
            _ajaxDataType_1='日';
            var startsWeek = now.subtract(14,'d').format("YYYY-MM-DD");
            var endsWeek = now.add(7,'d').format("YYYY-MM-DD");
            var aa = $('.datetimepickereType').text();
            _ajaxStartTime=startWeek;
            if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
                if(aa.indexOf(end)<0){
                    $('.datetimepickereType').html(end);
                }
            }
            //当前开始结束时间
            var startSplit = startWeek.split('-');
            var endSplit = endWeek.split('-');
            _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
            _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
            //上一时段开始结束时间
            var startSplits = startsWeek.split('-');
            var endSplits = endsWeek.split('-');
            _ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
            _ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
        }else if(_ajaxDataType=="月"){
            var now = moment(inputValue).startOf('month');
            var nows = moment(inputValue).endOf('month');
            //页面显示时间
            var nowStart = now.format("YYYY-MM-DD");
            var nowEnd = nows.format("YYYY-MM-DD");
            $('.datetimeStart').html(nowStart);
            $('.datetimeEnd').html(nowEnd);
            //当前开始结束时间
            var startMonth=now.format("YYYY-MM-DD");
            var endMonth=nows.add(1,'d').format("YYYY-MM-DD");
            end = nowStart + "到" + nowEnd;
            //上一时段的开始结束时间
            var startsMonth = now.subtract(1,'month').format("YYYY-MM-DD");
            var endsMonth = nows.subtract(1,'month').format("YYYY-MM-DD");
            _ajaxDataType_1='日';
            var aa = $('.datetimepickereType').text();
            _ajaxStartTime=startMonth;
            if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
                if(aa.indexOf(end)<0){
                    $('.datetimepickereType').html(end);
                }
            }
            var startSplit = startMonth.split('-');
            var endSplit = endMonth.split('-');
            _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
            _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
            var startSplits = startsMonth.split('-');
            var endSplits = endsMonth.split('-');
            _ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
            _ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
        }else if(_ajaxDataType=="年"){
            //页面显示时间
            var now = moment(inputValue).startOf('year');
            var nows = moment(inputValue).endOf('year');
            var nowStart = now.format("YYYY-MM-DD");
            var nowEnd = nows.format("YYYY-MM-DD");
            $('.datetimeStart').html(nowStart);
            $('.datetimeEnd').html(nowEnd);
            var startYear=now.format("YYYY-MM-DD");
            var endYear=nows.add(1,'d').format("YYYY-MM-DD");
            end = nowStart+"到"+nowEnd;
            var startsYear = now.subtract(1,'year').format("YYYY-MM-DD");
            var endsYear = nows.subtract(1,'year').format("YYYY-MM-DD");
            _ajaxDataType_1='月';
            var aa = $('.datetimepickereType').text();
            _ajaxStartTime=startYear;
            if(_ajaxStartTime.match(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
                if(aa.indexOf(end)<0){
                    $('.datetimepickereType').html(end);
                }
            }
            var startSplit = startYear.split('-');
            var endSplit = endYear.split('-');
            _ajaxStartTime_1 = startSplit[0] + '/' + startSplit[1] + '/' + startSplit[2];
            _ajaxEndTime_1 = endSplit[0] + '/' + endSplit[1] + '/' + endSplit[2];
            var startSplits = startsYear.split('-');
            var endSplits = endsYear.split('-');
            _ajaxLastStartTime_1 = startSplits[0] + '/' + startSplits[1] + '/' + startSplits[2];
            _ajaxLastEndTime_1 = endSplits[0] + '/' + endSplits[1] + '/' + endSplits[2];
        }
    });

    //根据不同的时间类型初始化时间控件
    $('.types').change(function(){
        var bbaa = $('.types').find('option:selected').val();
        if(bbaa == '月'){
            monthDate();
        }else if(bbaa == '年'){
            yearDate();
        }else{
            initDate();
        }
        $('.datetimepickereType').empty();
    })

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
                "title": "名称",
                "data":"pointerName",
                "render":function(data,type,row,meta){
                    //获取ID
                    var id = row.alaLogID;

                    return '<span data-id ="'+id+'"  style="cursor: pointer;color:#72ACE3" class="open-views" title="点击查看">'+data+'</span>'
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
                "data":"data"
            },
            {
                "title": "单位房间",
                "data":"rowDetailsExcDatas"
            },
            {
                "title": "报警等级",
                "data":"priority"
            },
            {
                "title": "阅读选择",
                "class":'L-checkbox',
                "targets": -1,
                "data": 'flag',
                "render":function(data,type,row,meta){
                    if(data>0){
                        return "<div class='checker'><span class='checked'><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div>已阅读";
                    }else{
                        return "<div class='checker'><span><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div>未阅读";
                    }
                }
            },
            {
                "class":"alaLogID alaLogIDs",
                "data":"alaLogID",
                "visible":"false"
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
                "defaultContent": "<button class='btn btn-success details-control' data-alaLogID=''>显示/隐藏历史</button>"
            },
            {
                "title": "处理备注",
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-success clickButtons' data-toggle='modal' data-target='#myModal'>点击处理</button>" +
                "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
                "<div class='modal-dialog' style='position: absolute;left: 50%;top:50%;margin-top: -87px;margin-left: -300px'>" +
                "<div class='modal-content'>" +
                "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel'>报警处理备注</h4><input type='text' class='modal-body'><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button><button type='button' class='btn btn-primary submitNote'>提交更改</button></div></div>" +
                "</div>" +
                "</div>" +
                "</div>"
            }
        ]
    });
    /*-----------------------树------------------------------*/
    //区域选择
    getPointer();

    //能耗种类
    energyTypes();

    //报警类型
    typeOfAlarm();

    //报警数据
    alarmHistory();
    /*-----------------------按钮事件------------------------*/
    $('.btns').click(function(){

        //获得选中的楼宇的信息；
        _pointer_ID = _objectSel.getSelectedPointers();

        _energy_ID =  getNodeInfo(_energy,_energy_ID);

        _alarm_ID = getNodeInfo(_alarm,_alarm_ID);

        //获取报警数据
        alarmHistory();
    })
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
                historyArr.push(totalArr[i])
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

    $('.clickButtons').click(function(){
        var $this = $(this);
        userId = $this.parents('tr').children('.pointerID').html();
        _alaLogId = $this.parents('tr').children('.alaLogIDs').html();
    })
    //获得备注内容
    $('.submitNote').click(function(){
        _texts = $(this).parents('.modal-header').children('.modal-body').val();
        processingNote();
    })

    $('.logoToRead').click(function(){
        logoToRead();
    });

    //打开某个故障位置的3d视图
    $('#datatables tbody').on('click','.open-views',function(){
        //获取ID
        var id = $(this).attr('data-id');
        $('#3d-view').show();

        //生成需要传递的ID
        id = 'w' + ((id % 3) + 1);
        exec_iframe('goToWarnPlace',id);

    });
    /*-----------------------其他方法------------------------*/
    //月的时间初始化
    function monthDate(){
        $('#datetimepicker').datepicker('destroy');
        $('#datetimepicker').datepicker({
            startView: 1,
            maxViewMode: 2,
            minViewMode:1,
            format: "yyyy-mm-dd",//选择日期后，文本框显示的日期格式
            language: "zh-CN" //汉化
        })
    }

    //年的时间初始化
    function yearDate(){
        $('#datetimepicker').datepicker('destroy');
        $('#datetimepicker').datepicker({
            startView: 2,
            maxViewMode: 2,
            minViewMode:2,
            format: "yyyy-mm-dd",//选择日期后，文本框显示的日期格式
            language: "zh-CN" //汉化
        })
    }

    //一般时间初始化
    function initDate(){
        $('#datetimepicker').datepicker('destroy');
        $('#datetimepicker').datepicker(
            {
                language:  'zh-CN',
                todayBtn: 1,
                todayHighlight: 1,
                format: 'yyyy-mm-dd'
            }
        )
    }

    //确定时间维度是年月周日
    function dataType(){
        var dataType;
        dataType = $('.types').val();
        _ajaxDataType=dataType;
    }

    //显示隐藏
    function format ( d ) {
        var theader = '<table class="table">' +
            '<thead><tr><td>时间</td><td>支路</td><td>单位</td><td>报警类型</td><td>报警条件</td><td>此时数据</td><td>单位房间</td><td>报警等级</td></tr></thead>';
        var theaders = '</table>';
        var tbodyer = '<tbody>'
        var tbodyers = '</tbody>';
        var str = '<tr><td>' + d[1].dataDate.split('T')[0] + ' ' + d[1].dataDate.split('T')[1] +
            '</td><td>' + d[1].cName +
            '</td><td>' + d[1].pointerName +
            '</td><td>' + d[1].cDtnName +
            '</td><td>' + d[1].expression +
            '</td><td>' + d[1].data +
            '</td><td>' + d[1].sysLogID +
            '</td><td>' + d[1].priority +
            '</td></tr>';
        for(var i=2;i< d.length;i++){
            var atime = d[i].dataDate.split('T')[0] + ' ' + d[i].dataDate.split('T')[1];
            str += '<tr><td>' + atime +
                '</td><td>' + d[i].cName +
                '</td><td>' + d[i].pointerName +
                '</td><td>' + d[i].cDtnName +
                '</td><td>' + d[i].expression +
                '</td><td>' + d[i].data +
                '</td><td>' + d[i].sysLogID +
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

    //能耗种类
    function energyTypes(){

        var typeFlag = false;
        var localType;
        //获取本地存储的能耗种类
        if(sessionStorage.getItem('menuArg') != '' && sessionStorage.getItem('menuArg')){

            localType = sessionStorage.getItem('menuArg').split(',')[0];
        }

        if(localType && localType != 0) {

            typeFlag = true;
        }

        var zNodes = [];
        var allAlarmInfo={};
        allAlarmInfo.id="0";
        allAlarmInfo.name="全部";
        allAlarmInfo.checked="true";
        allAlarmInfo.open = "true";
        zNodes.push(allAlarmInfo);
        var totalData = [];
        $.ajax({
            type:'post',
            url:_url + 'Alarm/GetAllEnergyTypes',
            success:function(result){
                for(var i=0;i<result.length;i++){
                    if(typeFlag){
                        if(localType.indexOf(result[i].energyTypeID) != -1){
                            totalData.push(result[i]);
                        }
                    }else{
                        totalData.push(result[i]);
                    }

                }
                for(var i=0;i<totalData.length;i++){
                    zNodes.push({id:totalData[i].energyTypeID,name:totalData[i].energyTypeName,pId:allAlarmInfo.id});
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
                            _energy.checkNode(treeNode,!treeNode.checked,true);
                        }
                    }
                };
                _energy = $.fn.zTree.init($("#energyTypes"), ztreeSettings, zNodes);  //ul的id
                _energy_ID =  getNodeInfo(_energy,_energy_ID);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //报警类型
    function typeOfAlarm(){

        var typeFlag = false;
        //获取本地存储的报警类型
        var localType;
        if(sessionStorage.getItem('menuArg')){
            localType = sessionStorage.getItem('menuArg').split(',')[1];
        }
        console.log(localType);
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
        var energy = '';
        var alarm = '';
        for(var i=0; i<_pointer_ID.length; i++){
            pointer.push(_pointer_ID[i].pointerID);
        }
        //获取检测类型
        var localType
        if(sessionStorage.getItem('menuArg')){
            localType = sessionStorage.getItem('menuArg').split(',')[2];
        }

        if(!localType){
            localType = '';
        }
        //if( _pointer_ID[0].pointerID == '0'){
        //    pointer = [0];
        //}
        if(_alarm_ID.length !=0){
            alarm = _alarm_ID[0].id;
            if( _alarm_ID[0].id=='000' ){
                alarm = '';
            }
        }
        if( _energy_ID.length !=0){
            energy = _energy_ID[0].id;
            if( _energy_ID[0].id=='000' ){
                energy==''
            }
        }
        //设置初始值
        //获取楼宇id
        var prm = {
            'st' : _ajaxStartTime_1 + ' 00:00:00',
            'et' : _ajaxEndTime_1 + ' 00:00:00',
            'pointerIds' : pointer,
            'excTypeInnderId' : alarm,
            'energyType' : energy,
            'groupTypeId' : localType
        };
        $.ajax({
            type:'post',
            url:_url + 'Alarm/GetAllExcData',
            async:false,
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
                    if(!existItem(pcids,result[i])){  //没有存在相同的pointerID&&cdataID；确保pcids数组中所有pointerID和csataID不同
                        pcids.push({"pointerID":result[i].pointerID,"cdataID":result[i].cdataID});
                    }
                }
                for(var i= 0,len=pcids.length,lenD=result.length;i<len;i++){ //推荐写法
                    for(var j= 0;j<lenD;j++){ //遍历pcids里的pointerID和cdataID属性
                        if(pcids[i].pointerID==result[j].pointerID && pcids[i].cdataID== result[j].cdataID){
                            dataArr.push(result[j]);  //因为后台返回的数据是降序，所以只要有一个就push到dataArr中
                            break;  //跳处循环；
                        }
                    }
                }
                datasTable($("#datatables"),dataArr);
                //绘制3dViews中展示的数据
                var warnData = [];
                $(dataArr).each(function(i,o){
                    //获取ID
                    var id = 'w' + ((o.alaLogID % 3) + 1);

                    //描述
                    var desc = '设备故障，请注意！';
                    if(o.memo != ''){
                        desc = o.memo;
                    }
                    //编码
                    var code = 'AHU-01';
                    if(o.alarmCode != ''){
                        code = o.alarmCode;
                    }

                    var obj = {
                        "id":id,
                        "address": o.cName,
                        "name": o.pointerName,
                        "code": code,
                        "type": o.cDtnName,
                        "desc":desc,
                        "level": o.priorityID
                    }
                    warnData.push(obj);
                });
                //关闭按钮
                $('.close-view').off('click');
                $('.close-view').on('click',function(){
                    $('#3d-view').hide();
                    exec_iframe('warnupload',JSON.stringify(warnData));
                    exec_iframe('warn');
                });


                $('.close-view').click();

                $(document).unbind();
                $(document).bind('click',function(e){

                    var e = e || window.event; //浏览器兼容性
                    var elem = e.target || e.srcElement;

                    while (elem) { //循环判断至跟节点，防止点击的是div子元素
                        if (elem.id && elem.id=='3d-view' || $(elem).attr('class') == 'open-views') {

                            return;
                        }
                        elem = elem.parentNode;
                    }

                    $('#3d-view').hide(); //点击的不是div或其子元素
                    exec_iframe('warnupload',JSON.stringify(warnData));
                    exec_iframe('warn');
                });

                //console.log(warnData);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });
    }

    //标识阅读功能
    function logoToRead(){
        logoToReadID = [];
        var pitchOn = $('.choice').parent('.checked'); //包含结果的数组的object
        for(var i=0;i<$('.choice').length;i++){
            //if($('.choice').eq(i).parent('.checked'))
            if($('.choice').eq(i).parent('.checked').length != 0){
                logoToReadID.push($('.choice').eq(i).parent('.checked').parents('tr').children('.alaLogID').html())
            }
        }
        var alaLogIDs = {
            '':logoToReadID
        }
        $.ajax(
            {
                'type':'post',
                'url':sessionStorage.apiUrlPrefix + 'Alarm/UpdateAlarmReaded',
                'async':false,
                'data':alaLogIDs,
                'success':function(result){

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
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
                'async':false,
                'data':prm,
                success:function(result){
                    if(result){
                        $("#myModal").modal('hide');
                        $('.choice[data-alaLogID="' + _alaLogId  + '"]').parent().addClass('checked');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            }
        )
    }


})