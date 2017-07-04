$(function(){
    //目的：描绘区域位置树、报警类型树，能耗种类树，时间选择
    /*-----------------------全局变量-------------------------*/
    var _url = sessionStorage.apiUrlPrefix;
    /*-------------------------时间------------------------*/
    //显示时间
    //显示开始结束时间，
    var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
    var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
    var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");
    var _ajaxLastStartTime_1 = moment().subtract(2,'d').format("YYYY/MM/DD");
    var _ajaxLastEndTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
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
    //实际发送时间
    /*-----------------------树------------------------------*/
    //区域选择
    getPointer();
    //能耗种类
    energyTypes();
    //报警类型
    typeOfAlarm();
    /*-----------------------按钮事件------------------------*/
    $('.btns').click(function(){
        //获取区域选择的节点
        getNodeInfo('allPointer');
        //获取能耗种类选中节点
        getNodeInfo('energyTypes');
        //获取抱紧类型选中的节点
        getNodeInfo('typeSelection');
    })
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
    //范围选择树
    function getPointer(){
        //读取楼宇和科室的zTree；
        _objectSel = new ObjectSelection();
        _objectSel.initPointers($("#allPointer"),true);
    }
    //能耗种类
    function energyTypes(){
        var zNodes = [];
        var allAlarmInfo={};
        allAlarmInfo.id="000";
        allAlarmInfo.name="全部";
        allAlarmInfo.checked="true";
        allAlarmInfo.open = "true";
        zNodes.push(allAlarmInfo);
        var energyConsumptionTypes = JSON.parse(sessionStorage.getItem('allEnergyType'));
        var totalData = [];
        $.ajax({
            type:'post',
            url:_url + 'Alarm/GetAllEnergyTypes',
            async:false,
            success:function(result){
                for(var i=0;i<result.length;i++){
                    totalData.push(result[i]);
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
                            treeObjs.checkNode(treeNode,!treeNode.checked,true)
                        }
                    }
                };
                var treeObjs = $.fn.zTree.init($("#energyTypes"), ztreeSettings, zNodes);  //ul的id
            }
        })
    }
    //报警类型
    function typeOfAlarm(){
        var zNodes=[];
        var allAlarmInfo={};
        allAlarmInfo.id="000";
        allAlarmInfo.name="全部";
        allAlarmInfo.checked="true";
        allAlarmInfo.open = "true";
        zNodes.push(allAlarmInfo);
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcType',
            async:false,
            success:function(result){
                if(result.length == 0){ //没有数据时候跳出,清除树
                    var lastTree = $.fn.zTree.getZTreeObj("typeSelection");
                    if(lastTree) { lastTree.destroy(); }
                    return;
                }
                branchArr=[];
                for(var i=0;i<result.length;i++){
                    branchArr.push(result[i]);
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
                            treeObj.checkNode(treeNode,!treeNode.checked,true)
                        }
                    }
                };
                var treeObj = $.fn.zTree.init($("#typeSelection"), ztreeSettings, zNodes);  //ul的id
            }
        });
    }
    //获取选中的节点的信息
    function getNodeInfo(ztree){
        var treeObj = $.fn.zTree.getZTreeObj(ztree);
        var nodes = treeObj.getCheckedNodes(true);
        console.log(nodes);
    }
})