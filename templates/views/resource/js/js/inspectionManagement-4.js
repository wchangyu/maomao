$(function(){

    /*-----------------------------------------------时间插件----------------------------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));

    //页面加载初始时间
    var showStartTime = moment().format('YYYY/MM/DD');

    var showEndTime = moment().add(7,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(showStartTime);

    $('.datatimeblock').eq(1).val(showEndTime);

    /*-----------------------------------------------变量-------------------------------------------------*/

    //接单vue对象
    var orderTaking = new Vue({
        el:'#workDone',
        data:{
            //是否启用
            sfqy:0,
            //任务单号
            rwdh:'',
            //任务名称
            rwmc:'',
            //设备名称
            sbmc:'',
            //设备编码
            sbbm:'',
            //责任单位部门
            zrdwbm:'',
            //负责人
            fzr:'',
            //执行人
            zxr:'',
            //计划编码
            jhbm:''
        }
    });

    //执行vue对象
    var implementTaking = new Vue({

        el:'#workDone1',
        data:{
            //是否启用
            sfqy:0,
            //任务单号
            rwdh:'',
            //任务名称
            rwmc:'',
            //设备名称
            sbmc:'',
            //设备编码
            sbbm:'',
            //责任单位部门
            zrdwbm:'',
            //负责人
            fzr:'',
            //执行人
            zxr:'',
            //计划编码
            jhbm:''
        }

    });

    //修改巡检步骤的Vue对象
    var tmtable = new Vue({
        el:'#tmtable',
        data:{
            tmbm:'',
            tmmc:'',
            tmckz:'',
            bjgx:'',
            xjjg:'',
            jgjl:'',
            ycms:''
        }
    })

    //设备类型
    divType();

    //存放所有巡检任务
    var _allDataArr = [];

    //存放所有维保组的数组
    var _InfluencingArr = [];

    //存放班组的数组
    var _bzArr = [];

    //读出的departNum在维保组中标识
    var stationsFlag = false;

    //读出的departNum在班组中用标识
    var wxBanzusFlag = false;

    //状态为执行中的巡检步骤的数组
    var _allXJSelect = [];

    //设备步骤
    devStep();


    /*------------------------------------------------表格初始化-------------------------------------------*/

    //巡检任务表格
    var tableCol = [

        {
            title:'任务单号',
            data:'itkNum',
            className:'bianma'
        },
        {
            title:'任务名称',
            data:'itkName'
        },
        {
            title:'设备类型',
            data:'dcNum'
        },
        {
            title:'设备名称',
            data:'dName'
        },
        {
            title:'设备编码',
            data:'dNum'
        },
        {
            title:'责任单位部门',
            data:'dipKeshi'
        },
        {
            title:'责任人',
            data:'manager'
        },
        {
            title:'执行人',
            data:'itkRen'
        },
        {
            title:'任务时间',
            data:'tkTime'
        },
        {
            title:'操作',
            "data": 'status',
            "render":function(data, type, full, meta){
                if(data == 0){
                    return "<span class='data-option option-see btn default btn-xs green-stripe'>接单</span>"
                }if(data ==1){
                    return "<span class='data-option option-sees btn default btn-xs green-stripe'>执行中</span>"
                }if(data ==2){
                    return "<span class='data-option option-sees btn default btn-xs green-stripe'>完成</span>"
                }
            }
        }

    ]

    _tableInit($('.main-contents-table').find('.table'),tableCol,1,'flag','','');

    //巡检步骤
    var XJXMCol = [
        {
            title:'设备类型',
            data:'dcName'
        },
        {
            title:'步骤编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'步骤名称',
            data:'ditName'
        },
        {
            title:'步骤参考值',
            data:'stValue'
        },
        {
            title:'报警关系',
            data:'relation'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-delete btn default btn-xs green-stripe' disabled='disabled'>删除</span>"
        }
    ];

    _tableInit($('#personTable1'),XJXMCol,2,'','','');

    //执行人员
    var ZXRYCol = [

        {
            title:'执行人员',
            data:'dipRen'
        },
        {
            title:'工号',
            data:'dipRenNum'
        },
        {
            title:'联系电话',
            data:'dipDh'
        }

    ];

    _tableInit($('#personTable2,#personTable2s'),ZXRYCol,2,'','','');

    //执行中的巡检步骤
    var XJBZCol = [

        {
            title:'步骤编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'步骤名称',
            data:'ditName'
        },
        {
            title:'步骤参考值',
            data:'stValue'
        },
        {
            title:'报警关系',
            data:'relation'
        },
        {
            title:'巡检结果',
            className:'tableInputBlock',
            data:'xjjg',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '正常'
                }if(data ==2){
                    return '异常'
                }else{
                    return ''
                }
            }
        },
        {
            title:'结果记录',
            className:'tableInputBlock',
            data:'jgjl'
        },
        {
            title:'异常故障描述',
            className:'tableInputBlock',
            data:'ycms'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>"
            /*"<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"*/
        }

    ];

    _tableInit($('#personTable1s'),XJBZCol,2,'','','');

    //数据加载
    InfluencingUnit();

    //导出按钮显示隐藏问题
    $('.excelButton').children().hide();

    $('.excelButton').children().eq(0).show();

    /*------------------------------------------------------按钮事件-------------------------------------*/

    //tab选项卡
    $('.table-title span').click(function(){

        var $this = $(this);

        $this.parent('.table-title').children('span').removeClass('spanhover');

        $this.addClass('spanhover');

        var tabDiv = $(this).parents('.table-title').next().children('div');

        tabDiv.addClass('hide-block');

        tabDiv.eq($(this).index()).removeClass('hide-block');

        $('.excelButton').children().hide();

        $('.excelButton').children().eq($(this).index()).show();

    });

    //查询
    $('#selected').click(function(){

        conditionSelect(stationsFlag,wxBanzusFlag);

    })

    //表格接单
    $('.main-contents-table').find('.table')
        .on('click','.option-see',function(){

            //初始化
            orderTakingInit();

            //数据绑定
            bindData($(this),orderTaking,$('#personTable1'),$('#personTable2'),true);

            //模态框
            _moTaiKuang($('#myModal'),'基本情况','','','','执行');


        })
        .on('click','.option-sees',function(){

            //初始化
            implementTakingInit();

            //数据绑定
            bindData($(this),implementTaking,$('#personTable1s'),$('#personTable2s'),false);

            //模态框
            _moTaiKuang($('#myModal1'),'基本情况','','','','完成');

        })

    //执行窗口编辑操作
    $('#personTable1s tbody').on('click','.option-edite',function(){
            //样式
            var $this = $(this).parents('tr');

            $('#personTable1s tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            //_index = $(this).parents('tr').index();

            _moTaiKuang($('#myModal3'),'编辑','','','','保存');

            var $thisBM = $(this).parents('tr').children('.bianma').html();

            //console.log(_allXJSelect);

            for(var i=0;i<_allXJSelect.length;i++){

                if(_allXJSelect[i].ditNum == $thisBM){

                    tmtable.tmbm = _allXJSelect[i].ditNum;
                    tmtable.tmmc = _allXJSelect[i].ditName;
                    tmtable.tmckz = _allXJSelect[i].stValue;
                    tmtable.bjgx = _allXJSelect[i].relation;
                    tmtable.xjjg = '';
                    tmtable.jgjl = '';
                    tmtable.ycms = '';

                }

            }

        })

    //编辑当前巡检条目完成
    $('#myModal3').on('click','.selectSBMC',function(){
        for(var i=0;i<_allXJSelect.length;i++){

            if(_allXJSelect[i].ditNum == tmtable.tmbm){

                _allXJSelect[i].xjjg = tmtable.xjjg;

                _allXJSelect[i].jgjl = tmtable.jgjl;

                _allXJSelect[i].ycms = tmtable.ycms;

            }
        }

        $(this).parents('.modal').modal('hide');

        _datasTable($('#personTable1s'),_allXJSelect);
    })

    //接单操作
    $('#myModal').on('click','.jiedan',function(){
        var prm = {
            itkNum:orderTaking.rwdh,
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/ywITKRecTask',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){
                if(result == 99){

                    _moTaiKuang($('#myModal5'),'提示','flag','istap','接单成功！','');

                    conditionSelect(stationsFlag,wxBanzusFlag);

                    $('#myModal').modal('hide');

                }else{

                    _moTaiKuang($('#myModal5'),'提示','flag','istap','接单失败！','');

                }
            }
        })
    });

    //完成操作
    $('#myModal1').on('click','.zhixing',function(){
        var tableRow = [];
        for(var i=0;i<_allXJSelect.length;i++){
            var obj = {};
            obj.id = _allXJSelect[i].id;
            obj.dipNum = implementTaking.jhbm;
            obj.itkNum = implementTaking.rwdh;
            obj.ditNum = _allXJSelect[i].ditNum;
            obj.res = _allXJSelect[i].xjjg;
            obj.record = _allXJSelect[i].jgjl;
            obj.exception = _allXJSelect[i].ycms;
            tableRow.push(obj);
        }
        var prm = {
            "itkNum": implementTaking.rwdh,
            "remark": $('#beizhus').val(),
            "items": tableRow,
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/ywITKFinishTask',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){
                if(result == 99){

                    _moTaiKuang($('#myModal5'),'提示','flag','istap','执行成功！','');

                    $('#myModal1').modal('hide');

                    conditionSelect(stationsFlag,wxBanzusFlag);
                }else{
                    _moTaiKuang($('#myModal5'),'提示','flag','istap','执行失败！','');
                }
            }
        })
    });

    /*------------------------------------------------其他方法--------------------------------------------*/

    //条件查询
    function conditionSelect(station,bz){

        var arr = [];

        //如果在维修班组中，则传wxKeshi，如果是在所属维保组中，则传wxKeshis=[]
        if(bz){

            arr.length = 0;

            arr.push(sessionStorage.userDepartNum);

        }

        if(station){

            for(var i=0;i<_InfluencingArr.length;i++){

                if(_InfluencingArr[i].departNum == sessionStorage.userDepartNum){

                    for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){

                        arr.push(_InfluencingArr[i].wxBanzus[j]);

                    }

                }

            }

        }

        //获取条件
        var filterInput = [];

        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');

        for(var i=0;i<filterInputValue.length;i++){

            filterInput.push(filterInputValue.eq(i).val());

        }
        var realStartTime = $('.condition-query .min').val();

        var realEndTime = moment($('.condition-query .max').val()).add(1,'d').format('YYYY/MM/DD');

        var prm = {
            itkNum:filterInput[0],
            itkName:filterInput[1],
            dcNum:$('#sblx').val(),
            dNum:filterInput[2],
            dName:filterInput[3],
            dipKeshi:filterInput[4],
            manager:filterInput[5],
            ditST:realStartTime,
            ditET:realEndTime,
            isAllData:0,
            userID:_userIdName,
            wxDepartNums:arr
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDITGetTasks',
            data:prm,
            success:function(result){

                _allDataArr = [];

                var jiedanArr = [];

                var zhixingArr = [];

                for(var i=0;i<result.length;i++){

                    _allDataArr.push(result[i]);

                    if(result[i].status == 0){

                        jiedanArr.push(result[i]);

                    }else if(result[i].status == 1){

                        zhixingArr.push(result[i]);

                    }
                }
                _datasTable($('#scrap-datatables'),result);

                _datasTable($('#scrap-datatables1'),jiedanArr);

                _datasTable($('#scrap-datatables2'),zhixingArr);
            }
        })
    }

    //设备类型
    function divType(){

        var prm = {
            "dcNum": "",
            "dcName": "",
            "dcPy": "",
            "userID": "mch"
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDCs',
            data:prm,
            success:function(result){
                var str = '<option value="">全部</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].dcNum + '">' + result[i].dcName + '</option>'
                }
                $('#sblx').append(str);
            }
        });

    }

    //获取所属维保组和所属班组
    function InfluencingUnit(){
        var prm = {
            "id": 0,
            "ddNum": "",
            "ddName": "",
            "ddPy": "",
            "daNum": "",
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:prm,
            success:function(result){

                //所属车间
                _InfluencingArr.length = 0;
                //所属班组
                _bzArr.length = 0;

                for(var i=0;i<result.stations.length;i++){

                    _InfluencingArr.push(result.stations[i]);

                }

                for(var i=0;i<result.wxBanzus.length;i++){
                    _bzArr.push(result.wxBanzus[i]);

                }

                //首先判断是在车间还是维保组里(如果是在维保组里，加载该维保组的维修班组，如果是在维修班组里，直接发送维修班组即可);

                for(var i=0;i<result.stations.length;i++){

                    if(sessionStorage.userDepartNum == result.stations[i].departNum){

                        stationsFlag = true;

                        break;

                    }else{

                        stationsFlag = false;

                    }
                }
                for(var i=0;i<result.wxBanzus.length;i++){
                    if(sessionStorage.userDepartNum == result.wxBanzus[i].departNum){
                        wxBanzusFlag = true;
                        break;
                    }else{
                        wxBanzusFlag = false;
                    }
                }

                conditionSelect(stationsFlag,wxBanzusFlag);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //数据绑定(flag = true的时候，接单，flag = false的时候，执行);
    function bindData($this,el,table1,table2,flag){

        //样式
        var $thisTable = $this.parents('.main-contents-table').find('.table');

        var $thiss = $this.parents('tr');

        $thisTable.find('tr').removeClass('tables-hover');

        $thiss.addClass('tables-hover');

        //获取当前选中的编码
        var $thisBM = $this.parents('tr').children('.bianma').html();

        //绑定数据
        for(var i=0;i<_allDataArr.length;i++){

            if(_allDataArr[i].itkNum == $thisBM){

                //是否启用
                el.sfqy = _allDataArr[i].isActive;
                //任务单号
                el.rwdh = _allDataArr[i].itkNum;
                //任务名称
                el.rwmc = _allDataArr[i].itkName;
                //设备名称
                el.sbmc = _allDataArr[i].dName;
                //设备编码
                el.sbbm = _allDataArr[i].dNum;
                //责任单位部门
                el.zrdwbm = _allDataArr[i].dipKeshi;
                //负责人
                el.fzr = _allDataArr[i].manager;
                //执行人
                el.zxr = _allDataArr[i].itkRen;
                //计划编码
                el.jhbm = _allDataArr[i].dipNum;
                //接单时间
                $('#jdsjs').val(_allDataArr[i].tkRecTime);
                //开始时间
                $('#kssjs').val(_allDataArr[i].tkTime);
                //完成时间
                $('#wcsjs').val(_allDataArr[i].tkCompTime);
                //备注
                $('#beizhus').val(_allDataArr[i].remark);
            }

        };

        //获取表格内的数据
        //加载表格下属步骤和执行人
        var prm = {
            dipNum:el.jhbm,
            userID:_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIPGetItemAndMembers',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){
                //找到存放所有巡检步骤的数组，比较

                if(flag){

                    _datasTable(table1,result.dipItems);

                    _datasTable(table2,result.dipMembers);

                }else{

                    _allXJSelect.length = 0;

                    for(var i=0;i<result.dipItems.length;i++){

                        var obj = {};
                        obj.id = result.dipItems[i].id;
                        obj.dcName = $.trim(result.dipItems[i].dcName);
                        obj.dcNum = result.dipItems[i].dcNum;
                        obj.desc = result.dipItems[i].desc;
                        obj.ditName = result.dipItems[i].ditName;
                        obj.ditNum = result.dipItems[i].ditNum;
                        obj.relation = result.dipItems[i].relation;
                        obj.remark = result.dipItems[i].remark;
                        obj.stValue = result.dipItems[i].stValue;
                        obj.xjjg = '';
                        obj.jgjl = '';
                        obj.ycms = '';
                        _allXJSelect.push(obj);

                    }

                    _datasTable(table1,_allXJSelect);

                    _datasTable(table2,result.dipMembers);

                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });


    }

    //接单初始化
    function orderTakingInit(){

        //是否启用
        orderTaking.sfqy = 0;

        //任务单号
        orderTaking.rwdh = '';

        //任务名称
        orderTaking.rwmc = '';

        //设备名称
        orderTaking.sbmc = '';

        //设备编码
        orderTaking.sbbm = '';

        //责任单位部门
        orderTaking.zrdwbm = '';

        //负责人
        orderTaking.fzr = '';

        //执行人
        orderTaking.zxr = '';

        //计划编码
        orderTaking.jhbm = '';

        //接单时间、开始时间、完成时间
        $('#myModal').find('.datatimeblock').val('');

        //备注
        $('#myModal').find('textarea').val('');

        //表格
        var arr = [];

        _datasTable($('#personTable1'),arr);

        _datasTable($('#personTable2'),arr);

    }

    //执行初始化
    function implementTakingInit(){

        //是否启用
        implementTaking.sfqy = 0;

        //任务单号
        implementTaking.rwdh = '';

        //任务名称
        implementTaking.rwmc = '';

        //设备名称
        implementTaking.sbmc = '';

        //设备编码
        implementTaking.sbbm = '';

        //责任单位部门
        implementTaking.zrdwbm = '';

        //负责人
        implementTaking.fzr = '';

        //执行人
        implementTaking.zxr = '';

        //计划编码
        implementTaking.jhbm = '';

        //接单时间、开始时间、完成时间
        $('#myModal').find('.datatimeblock').val('');

        //备注
        $('#myModal').find('textarea').val('');

        //表格
        var arr = [];

        _datasTable($('#personTable1'),arr);

        _datasTable($('#personTable2'),arr);

    }

    //设备步骤
    function devStep(){

        var prm = {
            ditName:'',
            dcNum:'',
            userID:_userIdNum
        };

        $.ajax({
            type:'post',
            url: _urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            success:function(result){
                _tiaoMuArr = [];
                for(var i=0;i<result.length;i++){
                    _tiaoMuArr.push(result[i]);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });

    }



})
