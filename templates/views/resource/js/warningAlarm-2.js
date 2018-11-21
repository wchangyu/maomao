$(function(){

    var _ajaxEndTime = moment().format("YYYY/MM/DD");

    var _ajaxStartTime = moment().subtract(1,'d').format("YYYY/MM/DD");

    //日期插件
    $('.datetimeStart').html(_ajaxEndTime);
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

    //改变时段选择下拉框
    $('.types').on('change',function(){

        if($(this).val() == '日'){

            _ajaxStartTime_1 = moment().format('YYYY/MM/DD');

            _ajaxEndTime_1 = moment().add('1','days').format('YYYY/MM/DD');

            $('.datetimeStart').html( _ajaxStartTime_1);

            $('.datetimeEnd').html( _ajaxStartTime_1);

        }else if($(this).val() == '月'){

            _ajaxStartTime_1 = moment().startOf('month').format('YYYY/MM/DD');

            var endTime = moment().endOf('month').format('YYYY/MM/DD');

            _ajaxEndTime_1 = moment().add('1','months').startOf('month').format('YYYY/MM/DD');

            $('.datetimeStart').html( _ajaxStartTime_1);

            $('.datetimeEnd').html( endTime);

        }else if($(this).val() == '周'){

            startTime = moment().format('YYYY/MM/DD');

            endTime = moment().subtract('7','days').format('YYYY/MM/DD');

            _ajaxStartTime_1 = endTime;


            _ajaxEndTime_1 = moment(startTime).add('1','day').format('YYYY/MM/DD');

            $('.datetimeStart').html( _ajaxStartTime_1);

            $('.datetimeEnd').html( startTime);

        }else if($(this).val() == '年'){

            _ajaxStartTime_1 = moment().startOf('year').format('YYYY/MM/DD');

            var endTime = moment().endOf('year').format('YYYY/MM/DD');

            _ajaxEndTime_1 = moment().add('1','years').startOf('year').format('YYYY/MM/DD');

            $('.datetimeStart').html( _ajaxStartTime_1);

            $('.datetimeEnd').html( endTime);
        }


    });


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
            },
            {

                "title": "创建工单",
                "data":'dNum',
                "render":function(data,type,row,meta){

                    if(row.flag == 3 ){

                        return '无法创建'

                    }else{

                        return  "<button class='btn btn-success creatGD' data-devNum = '" + data + "' data-pointer='" + row.pointerID + "' data-cdata='" + row.cdataID + "'>创建工单</button>";

                        //if(data == null || data == ''){
                        //
                        //    return '无法创建'
                        //
                        //}else{
                        //
                        //
                        //
                        //}

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

    //能耗种类
    function energyTypes(){

        var typeFlag = false;
        var localType;
        //获取本地存储的能耗种类
        if(sessionStorage.menuArg && sessionStorage.getItem('menuArg') != ''){

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
                        chkStyle: "checkbox",
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
                        chkStyle: "checkbox",
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

        if(nodes.length > 1){

          $(nodes).each(function(i,o){

             if(!o.pId){

                 nodes.remove(o);
             }

          });
        }

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
        var localType;

        if(sessionStorage.menuArg){

            localType = sessionStorage.getItem('menuArg').split(',')[2];
        }

        if(!localType){
            localType = '';
        }

        console.log(_alarm_ID);

        if(_alarm_ID.length !=0){

            $(_alarm_ID).each(function(i,o){

                if(i != _alarm_ID.length -1){

                    alarm += o.id + ',';

                }else{

                    alarm += o.id + '';
                }

            });


        }

        console.log(alarm);

        if( _energy_ID.length !=0){


            if( _energy_ID[0].id=='000' ){
                energy==''
            }else{

                $( _energy_ID).each(function(i,o){

                    if(i !=  _energy_ID.length -1){

                        energy += o.id + ',';

                    }else{

                        energy += o.id + '';
                    }

                });
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
            'groupTypeId' : localType,
            "dealFlag": -1, //0为未处理 -1为全部
            "userID" :  _userIdNum
        };

        $.ajax({
            type:'post',
            url:_url + 'Alarm/GetAllExcData',
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