$(function(){
    $('.datetimepickereType').html(_ajaxStartTime +'到'+_ajaxStartTime);
    //读取能耗种类
    _energyTypeSel = new ETSelection();
    _energyTypeSel.initPointers($(".energy-types"),undefined,function(){
    });
    //能耗种类-全部
    var allEnergyConsumptionTypes = $('<div class="selectedEnergy">')
    allEnergyConsumptionTypes.css({
        "width" : "120px",
        "height" : "70px",
        "cursor" : "pointer",
        "background":'url(./work_parts/img/allener.png)no-repeat',
        "background-size":'50px',
        "background-position":'top center',
    });
    allEnergyConsumptionTypes.attr('value','00');
    var allEnergyConsumptionTypesP = $('<p>');
    allEnergyConsumptionTypesP.css({
        "margin-top":"50px",
        "text-align":"center",
    });
    allEnergyConsumptionTypesP.html('全部');
    allEnergyConsumptionTypes.append(allEnergyConsumptionTypesP);
    $('.energy-types').prepend(allEnergyConsumptionTypes);
    //能耗种类的红边框
    $('.energy-types div').css({
        'border':'2px solid #ffffff'
    });
    $('.energy-types div').removeClass('selectedEnergy');
    $('.energy-types').children('div').eq(0).css({
        'border':'2px solid red'
    });
    $('.energy-types').children('div').eq(0).addClass('selectedEnergy');
    $('.energy-types').delegate('div','click',function(){
        $('.energy-types div').removeClass('selectedEnergy');
        $('.energy-types div').css({
            'border':'2px solid #ffffff'
        });
        $('.energy-types').children('div').eq($(this).index()).css({
            'border':'2px solid red'
        });
        $('.energy-types').children('div').eq($(this).index()).addClass('selectedEnergy');
    });
    //获取选取的能耗种类
    getEcType();
    //读取楼宇和科室的zTree；
    _objectSel = new ObjectSelection();
    _objectSel.initPointers($("#allPointer"),true);
    //搜索框功能
    var objSearch = new ObjectSearch();
    objSearch.initOfficeSearch($("#key"),$(".tipes"),"allOffices");
    //报警类型
    getAlarmInfo();
    getSelectedBranches();
    //表格初始化
    //初始化表格
    alarmHistory();
    table = $('#datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "paging": false,
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 1 页 / 总 1 页',
            'infoEmpty': '没有数据'
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [
            {
                extend:'csvHtml5',
                text:'保存csv格式'
            },
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
            },
            {
                extend: 'pdfHtml5',
                text: '保存为pdf格式',
            }
        ],
        "columns": [
            {
                "title":"时间",
                "data":"dataDate",
            },
            {
                "title": "编号",
                "class":"L-checkbox",
                "data":"alaLogID"
            },
            {
                "title": "名称",
                "data":"pointerName"
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
                "data":"flag"
            },
            {
                "title": "查看",
                "data":"memo"
            },
            {
                "title": "阅读选择",
                "class":'L-checkbox',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>未阅读"
            },
            {
                "title": "操作",
                "class":'L-button',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-success details-control'>显示/隐藏历史</button>"
            },
            {
                "title": "处理备注",
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-success' data-toggle='modal' data-target='#myModal'>点击处理</button>" +
                "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
                "<div class='modal-dialog'style='position: absolute;left: 50%;top:50%;margin-top: -87px;margin-left: -300px'>" +
                "<div class='modal-content'>" +
                "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel'>标题</h4><input type='text' class='modal-body'><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button><button type='button' class='btn btn-primary'>提交更改</button></div></div>" +
                "</div>" +
                "</div>" +
                "</div>"
            }
        ]
    });
    setData();
    //时间插件
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
    $('.btn').click(function(){
        getEcType();
        alarmHistory();
        getSelectedBranches();
        setData();

    })
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
})
var table;
//获得开始时间
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");
var _ajaxLastStartTime_1 = moment().subtract(2,'d').format("YYYY/MM/DD");
var _ajaxLastEndTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
//获取dataType(小时，日，月，年)
var _ajaxDataType='日';
function dataType(){
    var dataType;
    dataType = $('.types').val();
    _ajaxDataType=dataType;
}
//选中的能耗种类
var _ajaxEcType;
function getEcType(){
    //首先判断哪个含有selectedEnergy类
    _ajaxEcType=$('.selectedEnergy').attr('value');
    if(_ajaxEcType == '00'){
        _ajaxEcType = '';
    }
}
//获取报警类型
var treeObj;
var select_ID;
function getAlarmInfo(){
    zNodes=[];
    var allAlarmInfo={};
    allAlarmInfo.id="000";
    allAlarmInfo.name="全部";
    allAlarmInfo.checked="true";
    allAlarmInfo.open = "true";
    zNodes.push(allAlarmInfo)
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcType',
            async:false,
        success:function(result){
            if(result.length == 0){	//没有数据时候跳出,清除树
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
           treeObj = $.fn.zTree.init($("#typeSelection"), ztreeSettings, zNodes);  //ul的id
            getSelectedBranches();
        }
    });
}
function getSelectedBranches(){
    var treeObject=$.fn.zTree.getZTreeObj('typeSelection');
    var nodes = treeObject.getCheckedNodes();
    select_ID=nodes[0].id;
    if(select_ID == '000'){
        select_ID = '';
    }
}
//月的时间初始化
function monthDate(){
    $('#datetimepicker').datepicker('destroy');
    $('#datetimepicker').datepicker({
        startView: 1,
        maxViewMode: 1,
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
//获取报警记录信息
var dataArr=[];
function alarmHistory(){
    //获取楼宇id
    var pts = _objectSel.getSelectedPointers(),pointerID=[];
    if(pts.length>0) {
        pointerID.push(pts[0].pointerID);
        pointerNames = pts[0].pointerName;
    };
    if(pointerID[0] == 0){
        var allPointer = JSON.parse(sessionStorage.getItem('pointers'));
        pointerID = [];
        for(var i=0;i<allPointer.length;i++){
            pointerID.push(allPointer[i].pointerID);
        }
    }
    var prm = {
        'st' : _ajaxStartTime_1 + ' 00:00:00',
        'et' : _ajaxEndTime_1 + ' 00:00:00',
        'pointerIds' : pointerID,
        'excTypeInnderId' : select_ID,
        'energyType' : _ajaxEcType,
    };
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
        async:false,
        data:prm,
        success:function(result){
            //console.log(result);
            var pcids = [];
            for(var i=0;i<result.length;i++){
                //dataArr.push(result[i]);
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

        }
    });
}

function existItem(arr,item){ //遍历数组中的所有数，如果有相同的pointerID&&cdataID，返回true，如果没有的话返回false；
    for(var i= 0,len=arr.length;i<len;i++){
        if(arr[i].pointerID==item.pointerID && arr[i].cdataID==item.cdataID){
            return true;
        }
    }
    return false;
}

function setData(){
    var table = $("#datatables").dataTable();
    console.log(table);
    table.fnClearTable();
    table.fnAddData(dataArr);
    table.fnDraw();
}
