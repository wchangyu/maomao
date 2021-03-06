$(function(){

    /*--------------------------------------------------变量---------------------------------------------------*/

    //时间插件
    _timeOneComponentsFun($('.datatimeblock'),'3','4','3','yyyy-mm');

    //执行人数组
    var _workerArr = [];

    //获取所有班次
    var _BCData = [];

    //当前添加的所有已排班的静态数组
    var _allData = [];

    //所有已排班列表
    var  _allList = [];

    //当前选中的id；
    var _thisID = '';

    //当前选中的值班表编号
    var _thisCode = '';

    //当前选择的执行人的id
    var _thisWorkerNum = '';

    //记录当前选中的行；
    var _thisRow = '';

    //判断当前是否是新增类型；
    var _isDeng = false;

    //保存当前this对象
    var _$that = '';

    //班次
    getShift();

    //部们列表
    _WxBanzuStationData(_BZ);

    function _BZ(){

        _BZList($('#depart'),getRY(true));

    }

    //当前值班所属的维修班组
    var _$thisBZ = '';

    //第二层执行人列表
    var _currentSelect = [];

    //当前班次日历数组
    var _calendarArr = [];

    //当前班次所对应的排班次
    var _BCDayObj = {};

    $('#fullcalendar-Modal').on('shown.bs.modal',function(){

        var now = $('#ADD-Modal').find('.datatimeblock').val();

        $('#calendar').fullCalendar('destroy');

        //模态框首先默认显示
        $('#calendar').fullCalendar({
            theme: true,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            dayNames:['周日','周一','周二','周三','周四','周五','周六'],
            dayNamesShort:['周日','周一','周二','周三','周四','周五','周六'],
            today:['今天'],
            firstDay:1,//第一天是周一还是周日；
            buttonText:{
                today:'本月',
                month:'月',
                week:'周',
                day:'日',
                prev:'上一月',
                next:'下一月',
            },
            defaultDate: now,
            events: _calendarArr
        });

    })


    /*--------------------------------------------------表格初始化----------------------------------------------*/

    //值班表格
    var tableListCol = [

        {
            title:'值班编号',
            data:'zbCode',
            className:'zbCode',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.id + '">' + data + '</span>'

            }
        },
        {
            title:'值班月份',
            data:'watchtime',
            render:function(data, type, full, meta){

                return data.slice(0,7)

            }
        },
        {
            title:'部门名称',
            data:'departName',
            render:function(data, type, row, meta){

                return '<span data-num="' +  row.departNum + '">' + row.departName + '</span>'

            }
        },
        {
            title:'创建人',
            data:'createUserName'
        },
        {
            title:'审批人',
            data:'shenpUserName'
        },
        {
            title: '操作',
            "data": '',
            "className": 'noprint',
            render:function(data, type, full, meta){

                //full.isexamine=1显示审批按钮

                if(full.isexamine == 1){

                    if(full.shenpUserName == ''){

                        return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                            "<span class='data-option option-shenhe btn default btn-xs green-stripe'>审核</span>"+
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

                    }else{

                        return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
                            //"<span class='data-option option-shenhe btn default btn-xs green-stripe'>审核</span>"

                    }



                }else if(full.isexamine == 0){

                    if(full.shenpUserName == ''){

                        return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

                    }else{

                        return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"


                    }

                }

            }
        }

    ];

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    var col3 = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'zxrnum'
        },
        {
            title:'执行人员',
            data:'userName',
            className:'zxrname'
        },
        {
            title:'职位',
            data:'pos'
        },
        {
            title:'部门',
            data:'departName'
        },
        {
            title:'联系电话',
            data:'mobile',
            className:'zxrphone'
        }
    ];
    _tableInit($('#zhixingRenTable'),col3,2,true,'','');

    $.fn.dataTable.ext.errMode = function (s, h, m) {
        //console.log('')
    };

    //排班人表格初始化
    ZBPersonInit();

    //获取当前条件查询
    conditionSelect();

    //给表头添加全选、全不选按钮
    var creatCheckBox = '<div class="checker"><span><input type="checkbox"></span></div>';

    $('thead').find('.checkeds').prepend(creatCheckBox);

    /*--------------------------------------------------按钮事件------------------------------------------------*/


    $('.creatButton').click(function(){

        //loadding显示
        $('#theLoading').modal('show');

        _isDeng = true;

        //重新初始化表格
        ZBPersonInit();

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'新增','','','','新增');

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('shenhe').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //添加人员类
        $('#Worker-Modal').find('.addZXR').addClass('addWorker').removeClass('addPerson');

        //可操作
        abledOption();

        //清空数组
        _allData.length = 0;

        _datasTable($('#worker-table'),_allData);

        //loadding消失
        $('#theLoading').modal('hide');

    })

    //选择人员
    $('#select-work').click(function(){

        if($('.datatimeblock').val() == ''){

            _moTaiKuang($('#myModal2'),'提示','flag','istap','请先选择日期！','');

        }else{

            //模态框
            _moTaiKuang($('#Worker-Modal'),'执行人列表','','','','选择');

        }

        //初始化
        $('#zxName').val('');

        $('#zxNum').val('');

        $('#depart').val('');

        //全选按钮默认不选
        $('#zhixingRenTable thead').find('input').parent().removeClass('checked');

        _datasTable($('#zhixingRenTable'),_workerArr);

    })

    //执行人条件查询
    $('.zhixingButton').click(function(){

        getRY(false);

    })

    //执行人表格选择
    $('#zhixingRenTable').find('tbody').on( 'click', 'tr', function () {

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent().removeClass('checked');

            $('#zhixingRenTable thead').find('input').parent().removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent().addClass('checked');

            //判断是不是全选了(通过判断tables-hover的长度和tr的长度)
            var hoverLengths = $('#zhixingRenTable').find('.tables-hover').length;

            var trLength = $('#zhixingRenTable tbody').find('tr').length;

            if(hoverLengths == trLength){

                $('#zhixingRenTable thead').find('input').parent().addClass('checked');

            }else{

                $('#zhixingRenTable thead').find('input').parent().removeClass('checked');

            }


        }
    });

    //表头全选全不选按钮
    $('#zhixingRenTable').find('thead').on('click','input',function(){

        if($(this).parent().hasClass('checked')){

            $(this).parent().removeClass('checked');

            //所有tbody的选中
            $('#zhixingRenTable tbody').find('tr').removeClass('tables-hover');

            $('#zhixingRenTable tbody').find('input').parent('span').removeClass('checked');


        }else{

            $(this).parent().addClass('checked');

            //所有tbody的选中
            $('#zhixingRenTable tbody').find('tr').addClass('tables-hover');

            $('#zhixingRenTable tbody').find('input').parent('span').addClass('checked');

        }


    });

    //已选中执行人员点击事件
    $('.on-duty-worker').on('click','li',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //字符串拼接形成表格
    $('#Worker-Modal').on('click','.addWorker',function(){

        //首先判断是否选中值班人
        if($('#zhixingRenTable tbody').children('.tables-hover').length == 0){

            _moTaiKuang($('#myModal2'),'提示','flag','istap','请先选择人员！','');

        }else{

            //判断有没有选择班次

            if( $('#shift').val() == '' ){

                _moTaiKuang($('#myModal2'),'提示','flag','istap','请先选择班次！','');

            }else{

                //将选中的人存入currentArr中

                _currentSelect.length = 0;

                var currentArr = $('#zhixingRenTable tbody').find('.tables-hover');

                for(var i=0;i<currentArr.length;i++){

                    var obj = {};

                    obj.num = currentArr.eq(i).children('.zxrnum').html();

                    obj.name = currentArr.eq(i).children('.zxrname').html();

                    obj.bcCode = $('#shift').val();

                    obj.bcName = ($('#shift').val() == '')?'':$('#shift').children('option:selected').html();

                    _currentSelect.push(obj);

                }

                //判断_allData

                if(_allData.length == 0){

                }else{

                    //如果_allData中已存在当前选中的人id，直接去重
                    for(var i=0;i<_allData.length;i++){

                        for(var j=0;j<_currentSelect.length;j++){

                            if(_allData[i].num == _currentSelect[j].num){

                                _currentSelect.removeByValue(_currentSelect[j].num,'num');

                            }

                        }


                    }

                }

                //去重之后的数组
                for(var i=0;i<_currentSelect.length;i++){

                    _allData.push(_currentSelect[i]);

                }

                _datasTable($('#worker-table'),_allData);

                $('#Worker-Modal').modal('hide');

            }

        }

    })

    //添加
    $('#ADD-Modal').on('click','.dengji',function(){

        //验证班次和人员选择了
        if( $('#shift').val() == ''){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请选择班次！', '');

        }else{

            var arr = [];

            var time = $('.datatimeblock').val() + '-' + '01';

            for(var i=0;i<_allData.length;i++){

                var obj = {};

                //值班人id
                obj.watchUser = _allData[i].num;
                //值班人姓名
                obj.watchUserName = _allData[i].name;
                //班次编号
                obj.bccode = _allData[i].bcCode;
                //班次名称
                obj.bcname = _allData[i].bcName.split(' ')[0];

                arr.push(obj);
            }

            //验证是否已排班
            if( arr.length == 0 ){

                _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'无值班安排！', '');

            }else{

                var prm = {

                    //值班具体月份(eg:2017-12-01);
                    watchtime:time,

                    //创建人
                    createUser:_userIdNum,

                    //创建人姓名
                    createUserName:_userIdName,

                    //所属部门编号
                    departNum:_loginUser.departNum,

                    //所属部门名称
                    departName:_loginUser.departName,

                    //值班人员集合
                    wprAddList:arr

                }

                $.ajax({

                    type:'post',
                    url:_urls + 'YWFZ/WatChAdd',
                    data:prm,
                    timeout:_theTimes,
                    beforeSend: function () {
                        $('#theLoading').modal('show');
                    },
                    complete: function () {
                        $('#theLoading').modal('hide');
                    },
                    success:function(result){

                        if(result == 99){

                            _moTaiKuang($('#myModal2'),'提示','flag','istap','新增成功！','');

                            $('#ADD-Modal').modal('hide');

                            conditionSelect();

                        }else{

                            _moTaiKuang($('#myModal2'),'提示','flag','istap','新增失败！','');

                        }


                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }

                })

            }

        }

    })

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //查看
    $('#table-list').on('click','.option-see',function(){

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'查看详情','flag','','','');

        //数据绑定
        bindData($(this),false);

        //人员你添加类
        $('.addWorker').removeClass('addPerson');

        //不可操作
        disabledOption();
    })

    //编辑(只能修改月份时间);
    $('#table-list').on('click','.option-edit',function(){

        _isDeng = false;

        //初始化
        detailedInit();

        //重新初始化表格
        var workCol = [

            {
                title:'姓名',
                data:'name',
                render:function(data, type, full, meta){

                    return '<span data-id="' + full.id + '">' + data + '</span>'

                }
            },
            {
                title:'工号',
                data:'num'
            },
            {
                title:'班次',
                data:'bcName',
                render:function(data, type, full, meta){

                    if(_isDeng){

                        return '<span class="data-option option-BC btn default btn-xs green-stripe" data-num="' + full.bcCode +
                            '">' + data +
                            '</span>'
                    }else{

                        if(full.shangbantime && full.xiabantime){

                            return '<span class="data-option option-BC btn default btn-xs green-stripe" data-num="' + full.bcCode +
                                '">' + data + " （" + full.shangbantime.substring(0,5) + "-" + full.xiabantime.substring(0,5) + ")" +
                                '</span>'

                        }else{

                            return '<span class="data-option option-BC btn default btn-xs green-stripe" data-num="' + full.bcCode +
                                '">' + data +
                                '</span>'

                        }

                    }

                }
            },
            {
                title:'操作',
                defaultContent:'<span class="data-option option-delete option-Bdelete btn default btn-xs green-stripe">删除</span>'
            }
        ]

        _tableInit($('#worker-table'),workCol,2,'','','','','');

        //模态框
        _moTaiKuang($('#ADD-Modal'),'编辑','','','','保存');

        //数据绑定
        bindData($(this),true);

        _thisID = $(this).parents('tr').children('.zbCode').children().attr('data-num');

        _thisCode = $(this).parents('tr').children('.zbCode').children().html();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('shenhe').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //人员你添加类
        $('.addZXR').addClass('addPerson').removeClass('addWorker');

        //可操作
        abledOption();

        _$that = $(this);

    })

    //时间插件修改
    $('.datatimeblock').change(function(){

        //判断时间去重
        var prm = {

            //时间
            watchtime:$('#ADD-Modal').find('.datatimeblock').val(),
            //部门编号
            departNum:_maintenanceTeam
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatChIsTimeExist',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    $('#select-work').attr('disabled',false);

                    $('#ADD-Modal .modal-footer').find('.btn-primary').attr('disabled',false);

                }else{

                    _moTaiKuang($('#myModal2'),'提示',true,'istap','当前时间已排班，请选择其他时间','');

                    $('#select-work').attr('disabled',true);

                    $('#ADD-Modal .modal-footer').find('.btn-primary').attr('disabled',true);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

        _isDeng = false;

    })

    //删除
    $('#table-list').on('click','.option-delete',function(){

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'确定要删除吗？','','','','删除');

        //数据绑定
        bindData($(this),false);

        _thisID = $(this).parents('tr').children('.zbCode').children().attr('data-num');

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('shenhe').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //人员你添加类
        $('.addWorker').removeClass('addPerson').removeClass('addWorker');

        //不可操作
        disabledOption()

    })

    //删除确定按钮
    $('#ADD-Modal').on('click','.shanchu',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatChDelete',
            data:{

                id:_thisID

            },
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','删除成功!','');

                    $('#ADD-Modal').modal('hide');

                    conditionSelect()

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','删除失败!','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    })

    //编辑确定按钮
    $('#ADD-Modal').on('click','.bianji',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatChUpdate',
            data:{
                id:_thisID,

                watchtime:$('.datatimeblock').val() + '-' + '01',

                departNum:_loginUser.departNum
            },
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','编辑成功!','');

                    $('#ADD-Modal').modal('hide');

                    conditionSelect();

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','编辑失败!','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })


    })

    //添加执行人员
    $('#Worker-Modal').on('click','.addPerson',function(){

        //首先验证是否选中排班的人
        var currentArr = $('#zhixingRenTable tbody').children('.tables-hover');

        if(currentArr.length == 0){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请选择人员！', '');

        }else{

            if($('#shift').val() == ''){

                _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请选择班次！', '');

            }else{

                _currentSelect.length = 0;

                for(var i=0;i<currentArr.length;i++){

                    var obj = {};

                    obj.num = currentArr.eq(i).children('.zxrnum').html();

                    obj.name = currentArr.eq(i).children('.zxrname').html();

                    obj.bcCode = $('#shift').val();

                    obj.bcName = ($('#shift').val() == '')?'':$('#shift').children('option:selected').html();

                    _currentSelect.push(obj);

                }

                if(_allData.length == 0){


                }else{

                    for(var i=0;i<_allData.length;i++){

                        for(var j=0;j<_currentSelect.length;j++){

                            if(_allData[i].num == _currentSelect[j].num){

                                _currentSelect.removeByValue(_currentSelect[j].num,'num');

                            }

                        }

                    }

                }


                var arr = [];

                for(var i=0;i<_currentSelect.length;i++){

                    var obj = {};

                    obj.watchUser = _currentSelect[i].num;

                    obj.watchUserName = _currentSelect[i].name;

                    obj.bcCode = _currentSelect[i].bcCode;

                    obj.bcName = _currentSelect[i].bcName;

                    arr.push(obj);
                }

                $.ajax({

                    type:'post',
                    url:_urls + 'YWFZ/WPRAdd',
                    timeout:_theTimes,
                    data:{

                        zbCode:_thisCode,
                        wprList:arr

                    },
                    beforeSend: function () {
                        $('#theLoading').modal('show');
                    },
                    complete: function () {
                        $('#theLoading').modal('hide');
                    },
                    success:function(result){

                        if(result == 99){

                            $('#Worker-Modal').modal('hide');

                            _moTaiKuang($('#myModal2'),'提示','flag','istap','添加人员成功!');

                            conditionSelect();

                            //更新一下_allData
                            allDate();

                            //将_readRens中也添加进去
                            bindData(_$that,true);

                            //修改
                            $('#worker-table tbody').children('tr').eq(1).children('td').eq(0).html('<span class="data-option option-delete-worker btn default btn-xs green-stripe">删除</span>')

                        }else{

                            _moTaiKuang($('#myModal2'),'提示','flag','istap','添加人员失败!');

                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){

                        console.log(jqXHR.responseText);

                    }

                })


            }

        }

    })

    //动态删除人员确定按钮
    $('#DEL-Modal').on('click','.table-shi-del',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/UPRDelete',
            data:{

                id:_thisWorkerNum

            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','删除人员成功！','');

                    $('#DEL-Modal').modal('hide');

                    conditionSelect();

                    //更新_allData;
                    allDate();

                    //刷新表格
                    $(_thisRow).remove();

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','删除人员失败！','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    })

    //静态删除人员确定按钮
    $('#worker-table').on('click','.option-quiet-worker',function(){

        //模态框
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除吗？','删除');

        //添加类
        $('#DEL-Modal').find('.btn-primary').removeClass('option-delete-worker').addClass('option-quite-worker');

        _thisRow = $(this).parents('tr');

        _thisWorkerNum = $(this).parents('tr').children('td').eq(0).children().attr('data-id');

    })

    //静态删除确定按钮
    $('#DEL-Modal').on('click','.option-quite-worker',function(){

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].num == _thisWorkerNum){

                _allData.remove(_allData[i]);

            }

        }

        _datasTable($('#worker-table'),_allData);

        //模态框消失
        $('#DEL-Modal').modal('hide');

    })

    //审核
    $('#table-list').on('click','.option-shenhe',function(){

        //初始化
        $('#examine-Modal').find('#myApp33').find('input').val('');

        $('#examine-Modal').find('#myApp33').find('textarea').val('');

        $('#radioblock').find('input').parent('span').removeClass('checked');

        $('#radioblock').find('input').eq(0).parent('span').addClass('checked');

        //模态框
        _moTaiKuang($('#examine-Modal'),'审核','','','','审核');

        //值班id
        _thisID = $(this).parents('tr').children('.zbCode').children().attr('data-num');

        //值班code
        _thisCode = $(this).parents('tr').children('.zbCode').children().html();

        $('#examine-Modal').find('#myApp33').find('input').eq(0).val(_thisID);

        $('#examine-Modal').find('#myApp33').find('input').eq(1).val(_thisCode);


    })

    //审核单选按钮事件
    $('#radioblock').on('click','input',function(){

        $('#radioblock').find('input').parent('span').removeClass('checked');

        $(this).parent('span').addClass('checked');

    })

    //审核确定按钮
    $('#examine-Modal').on('click','.shenhe',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatchShenpi',
            data:{
                //值班表id
                id:_thisID,
                //值班表code
                zbCode:_thisCode,
                //审批人编号
                shenpUserNum:_userIdNum,
                //审批人姓名
                shenpUserName:_userIdName,
                //审批意见
                shenpopinion:$('#examine-Modal').find('textarea').val(),
                //是否通过
                isshenp:$('#radioblock').find('.checked').children().attr('attr-value')
            },
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','审核成功！','');

                    conditionSelect();

                    $('#examine-Modal').modal('hide');

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','审核失败！','');


                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    })

    //查看某一人班次信息
    $('#worker-table').on('click','.option-BC',function(){

        //样式
        $('#worker-table tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        var title = '';

        //根据当前的班次编码，选择班次详情
        for(var i=0;i<_BCData.length;i++){

            if( $(this).attr('data-num') == _BCData[i].bccode ){

                //console.log(_BCData[i]);

                //title = _BCData[i].name;

                _BCDayObj.banCiDetailList = _BCData[i].banCiDetailList;

                _BCDayObj.period = _BCData[i].period;
            }

        }

        //首先确定当月有几天
        var now = $('#ADD-Modal').find('.datatimeblock').val();

        var year = (now != '')?now.split('-')[0]:'';

        var Monthnum = (now != '')?now.split('-')[1]:'';
        //首先确定当月有几天，
        var day = new Date(year,Monthnum,0);

        var daycount = day.getDate();

        _calendarArr.length = 0;

        //判断当前是日还是月1是周，2是月
        if(_BCDayObj.period == 1){

            for(var i=0;i<daycount;i++){

                var times = moment(year + '-' + Monthnum + '-' + (i + 1)).format('YYYY-MM-DD');

                var flag = false;

                //console.log(_BCDayObj.banCiDetailList);

                for(var j=0;j<_BCDayObj.banCiDetailList.length;j++){

                    var weekNum = (moment(times).format('d') == 0)?7:moment(times).format('d');

                    if(_BCDayObj.banCiDetailList[j].selectedday == weekNum){

                        flag = true;

                        break;

                    }else{

                        flag = false;

                    }

                }

                if(flag){

                    var obj = {};

                    title = _BCDayObj.banCiDetailList[j].sjDname + '('+ _BCDayObj.banCiDetailList[j].shangbantime + '-'+ _BCDayObj.banCiDetailList[j].xiabantime +')';

                    obj.title = title;

                    obj.start = moment(year + '-' + Monthnum + '-' + (i + 1)).format('YYYY-MM-DD');

                    obj.end = moment(year + '-' + Monthnum + '-' + (i + 1)).format('YYYY-MM-DD');

                    _calendarArr.push(obj);

                }

            }


        }else if( _BCDayObj.period == 2 ){

            for(var i=0;i<_BCDayObj.banCiDetailList.length;i++){

                var obj = {};

                title = _BCDayObj.banCiDetailList[i].sjDname + '('+ _BCDayObj.banCiDetailList[i].shangbantime + '-'+ _BCDayObj.banCiDetailList[i].xiabantime +')';

                obj.title = title;

                obj.start = moment(year + '-' + Monthnum + '-' + _BCDayObj.banCiDetailList[i].selectedday).format('YYYY-MM-DD');

                obj.end = moment(year + '-' + Monthnum + '-' + _BCDayObj.banCiDetailList[i].selectedday).format('YYYY-MM-DD');

                _calendarArr.push(obj);

            }

        }

        //模态框显示
        $('#fullcalendar-Modal').modal('show');

    })

    //动态删除某人的排班
    $('#worker-table').on('click','.option-Bdelete',function(){

        //样式
        $('#worker-table tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //提示
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除该人员吗？','删除');

        //添加类
        $('#DEL-Modal').find('.btn-primary').addClass('table-shi-del');

        //确定删除人id
        _thisWorkerNum = $(this).parents('tr').children('td').eq(0).children().attr('data-id');

        //记录删除某一行
        _thisRow = $(this).parents('tr');

    })

    //登记的时候静态删除
    $('#worker-table').on('click','.option-Ddelete',function(){

        //样式
        $('#worker-table tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //模态框
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除吗？','删除');

        //添加类
        $('#DEL-Modal').find('.btn-primary').removeClass('option-delete-worker').addClass('option-quite-worker');

        _thisRow = $(this).parents('tr');

        _thisWorkerNum = $(this).parents('tr').children('td').eq(1).html();

    })

    /*--------------------------------------------------其他方法-------------------------------------------------*/
    //条件查询
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/WatchGetAll',
            data:{
                //当前用户id
                userNum:_userIdNum,
                //当前用户角色
                userRole:_userRole,
                //当前用户部门编号
                userdepartNum:_loginUser.departNum,
                //值班编号
                zbCode:$('.ZBBH').val()

            },
            success:function(result){

                _allList.length = 0;

                for(var i=0;i<result.length;i++){

                    var obj = {};

                    obj.wxbz = result[i].departNum;

                    obj.time = result[i].watchtime;

                    _allList.push(obj);

                }

                _datasTable($('#table-list'),result);



            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    }

    //获取班次
    function getShift(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/BanCiGetAll',
            timeout:_theTimes,
            success:function(result){

                if(result.length != 0 ){

                    _BCData.length = 0;

                    for(var i=0;i<result.length;i++){

                        _BCData.push(result[i]);

                    }

                    var str = '<option value="">请选择</option>';

                    var reg = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

                    for(var i=0;i<result.length;i++){


                        //首先判断是否是时间格式

                        var st = '';

                        if( reg.test(result[i].shangbantime) ){

                            st = result[i].shangbantime.slice(0,5);

                        }else{

                            st = ''

                        }

                        var et = '';

                        if( reg.test(result[i].xiabantime) ){

                            et = result[i].xiabantime.slice(0,5);

                        }else{

                            et = '';

                        }

                        str +='<option value="' + result[i].bccode +
                            '" data-attr="' + result[i].period +
                            '"><span>' + result[i].name +
                            '</span>' +
                            '</option>'

                    }

                    $('#shift').empty().append(str);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    }

    //选择执行人 true
    function getRY(flag){
        var prm = {
            "username": $('#zxName').val(),
            "usernum": $('#zxNum').val(),
            "userID": _userIdNum,
            "userName":_userIdName,

        }

        if(flag){

            prm.departnum = _maintenanceTeam;

        }else{

            var depart = '';

            if( $('#depart').val() == '' ){

                depart = _maintenanceTeam;

            }else{

                depart = $('#depart').val();

            }

            prm.departnum = depart;

        }
        $.ajax({
            type:'post',
            url:_urls + 'YWFZ/ReturnUserList',
            data:prm,
            success:function(result){

                if(flag){

                    for(var i=0;i<result.length;i++){

                        _workerArr.push(result[i]);

                    }

                }

                _datasTable($('#zhixingRenTable'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //初始化
    function detailedInit(){

        //日历控件
        $('.datatimeblock').val('');

        //已选中的执行人员清空
        $('.on-duty-worker').empty();

        //班次选择
        $('#shift').val('');

        //已排班
        //$('#table-block').empty();

    }

    //数据绑定flag = true的时候。删除按钮显示，flag = false的时候，删除按钮不显示
    function bindData($this,flag){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        //获取编码
        var $thisCode = $this.parents('tr').children('.zbCode').children().attr('data-num');

        //获取当前的班组
        _$thisBZ = $this.parents('tr').children('td').eq(2).children().attr('data-num');

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/ReturnOneWatch',
            data:{

                id:$thisCode

            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            timeout:_theTimes,
            success:function(result){

                if(result){

                    //数据处理
                    //时间
                    var time = result.watchtime.substring(0,7);

                    var month = result.watchtime.split('-')[1];

                    $('#ADD-Modal').find('.datatimeblock').val(time);

                    _allData.length = 0;

                    if(result.wprList){

                        for(var i=0;i<result.wprList.length;i++){

                            var obj = {};

                            obj.name = result.wprList[i].watchUserName;

                            obj.num = result.wprList[i].watchUser;

                            obj.bcCode = result.wprList[i].bccode;

                            obj.bcName = result.wprList[i].bcname;

                            obj.id = result.wprList[i].id;

                            obj.shangbantime = result.wprList[i].shangbantime;

                            obj.xiabantime = result.wprList[i].xiabantime;

                            _allData.push(obj);

                        }

                    }

                    _datasTable($('#worker-table'),_allData);

                    if(!flag){

                        $('#worker-table').find('.option-delete').attr('disabled',true);

                    }else{

                        $('#worker-table').find('.option-delete').attr('disabled',false);

                    }

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    }

    //可操作
    function abledOption(){

        //日历插件可操作input-blocked
        $('.datatimeblock').attr('disabled',false).removeClass('disabled-block');

        $('.datatimeblock').parent('.input-blocked').removeClass('disabled-block');

        //选择人员
        $('#select-work').attr('disabled',false);

        //选择班次
        $('#shift').attr('disabled',false).removeClass('disabled-block');

        //确定按钮不能操作
        $('.QRButton').attr('disabled',false);

    }

    //不可操作
    function disabledOption(){

        //日历插件不可操作input-blocked
        $('.datatimeblock').attr('disabled',true).addClass('disabled-block');

        $('.datatimeblock').parent('.input-blocked').addClass('disabled-block');

        //选择人员
        $('#select-work').attr('disabled',true);

        //选择班次
        $('#shift').attr('disabled',true).addClass('disabled-block');

        //确定按钮不能操作
        $('.QRButton').attr('disabled',true);
    }

    //添加人员成功之后，更新当前_allData数据
    function allDate(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/ReturnOneWatch',
            data:{

                id:_thisID

            },
            timeout:_theTimes,
            success:function(result){

                if(result.wprList){

                    _allData.length = 0;

                    for(var i=0;i<result.wprList.length;i++){

                        var obj = {};

                        obj.name = result.wprList[i].watchUserName;

                        obj.num = result.wprList[i].watchUser;

                        obj.bcNum = result.wprList[i].bccode;

                        obj.bcName = result.wprList[i].bcname;

                        _allData.push(obj);

                    }

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }

        })

    }

    //值班详情值班人初始化
    function ZBPersonInit(){

        //排班表格
        var workCol = [

            {
                title:'姓名',
                data:'name',
                render:function(data, type, full, meta){

                    return '<span data-id="' + full.id + '">' + data + '</span>'

                }
            },
            {
                title:'工号',
                data:'num'
            },
            {
                title:'班次',
                data:'bcName',
                render:function(data, type, full, meta){

                    if(_isDeng){

                        return '<span class="data-option option-BC btn default btn-xs green-stripe" data-num="' + full.bcCode +
                            '">' + data +
                            '</span>'
                    }else{

                        if(full.shangbantime && full.xiabantime){

                            return '<span class="data-option option-BC btn default btn-xs green-stripe" data-num="' + full.bcCode +
                                '">' + data + " （" + full.shangbantime.substring(0,5) + "-" + full.xiabantime.substring(0,5) + ")" +
                                '</span>'

                        }else{

                            return '<span class="data-option option-BC btn default btn-xs green-stripe" data-num="' + full.bcCode +
                                '">' + data +
                                '</span>'

                        }

                    }

                }
            },
            {
                title:'操作',
                defaultContent:'<span class="data-option option-delete option-Ddelete btn default btn-xs green-stripe">删除</span>'
            }
        ]

        _tableInit($('#worker-table'),workCol,2,'','','','','');

    }



});