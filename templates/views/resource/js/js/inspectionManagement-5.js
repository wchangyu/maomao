$(function(){

    /*-----------------------------------------------时间插件----------------------------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));

    //页面加载初始时间
    var showStartTime = moment().format('YYYY/MM/DD');

    var showEndTime = moment().add(7,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(showStartTime);

    $('.datatimeblock').eq(1).val(showEndTime);

    /*-------------------------------------------------变量----------------------------------------------*/

    //未接单任务的Vue对象
    var unAnsweredState = new Vue({
        el:'#workDone',
        data:{
            sfqy:0,
            rwdh:'',
            rwmc:'',
            sbmc:'',
            sbbm:'',
            zrdwbm:'',
            fzr:'',
            zxr:'',
            zysm:'',
            jhbm:''
        }
    });

    //执行中Vue对象
    var implementingState = new Vue({

        el:'#myModal1',
        data:{
            sfqy:0,
            rwdh:'',
            rwmc:'',
            sbmc:'',
            sbbm:'',
            zrdwbm:'',
            fzr:'',
            zxr:'',
            zysm:'',
            jhbm:''
        }

    })

    //存放所有巡检任务的数组
    var _allDataArr = [];

    //存放巡检步骤的数组
    var _allXJSelect = [];

    divType();

    /*------------------------------------------------表格初始化------------------------------------------*/

    //巡检任务总表格
    var inspectionMissionCol = [

        {
            title:'是否启用',
            className:'isActive',
            data:'isActive',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '未启用'
                }if(data == 1){
                    return '启用'
                }if(data ==2){
                    return '停用'
                }
            }
        },
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
            title:'设备名称',
            data:'dName'
        },
        {
            title:'设备编码',
            data:'dNum'
        },
        {
            title:'状态',
            data:'status',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '未接单'
                }if(data == 1){
                    return '执行中'
                }if(data == 2){
                    return '完成'
                }
            }
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
            title:'操作',
            "data": 'status',
            "render":function(data, type, full, meta){
                if(data == 0){
                    return "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span>"
                }if(data ==1){
                    return "<span class='data-option option-see2 btn default btn-xs green-stripe'>查看</span>"
                }if(data ==2){
                    return "<span class='data-option option-see3 btn default btn-xs green-stripe'>查看</span>"
                }
            }
        }

    ];

    _tableInit($('.main-contents-table').find('.table'),inspectionMissionCol,1,'flag','','');

    //未接单状态下的巡检步骤
    var XJBZCol = [

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
        }

    ];

    _tableInit($('#personTable1'),XJBZCol,2,'flag','','');

    //未接单状态下的执行人
    var ZXRCol = [

        {
            title:'执行人员',
            data:'itkRen'
        },
        {
            title:'工号',
            data:'itkRenNum'
        },
        {
            title:'联系电话',
            data:'ITKDH'
        }

    ];

    _tableInit($('#personTable2,#personTable2s'),ZXRCol,2,'flag','','');

    //执行中状态下的巡检步骤
    var XJBZingCol = [

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
            data:'res',
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
            data:'record',
            //render:function(data, type, full, meta){
            //
            //    console.log(data);
            //
            //    if(data == ''){
            //
            //        return ''
            //
            //    }else{
            //
            //
            //    }
            //}
        },
        {
            title:'异常故障描述',
            className:'tableInputBlock',
            data:'exception',
            //render:function(data, type, full, meta){
            //    if(data == ''){
            //
            //        return ''
            //
            //    }
            //}
        }

    ];

    _tableInit($('#personTable1s'),XJBZingCol,2,'flag','','');

    //数据加载
    conditionSelect();

    /*-------------------------------------------------按钮事件-------------------------------------------*/
    //未接单状态【查看】
    $('#scrap-datatables tbody').on('click','.option-see1',function(){

        //初始化
        detailInit(unAnsweredState,$('#myModal'),$('#personTable1'),$('#personTable2'))

        //模态框
        _moTaiKuang($('#myModal'),'基本情况','flag','','','');

        var callback = function(result){

            _datasTable($('#personTable1'),result.dipItems);

            _datasTable($('#personTable2'),result.itkMembers);

        }

        bindData(unAnsweredState,$(this),callback);

    })

    //执行中【查看】
    $('#scrap-datatables tbody').on('click','.option-see2',function(){

        //初始化
        detailInit(implementingState,$('#myModal1'),$('#personTable1s'),$('#personTable2s'));

        //模态框
        _moTaiKuang($('#myModal1'),'基本情况','flag','','','');

        var callback = function(result){

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
                obj.res = '';
                obj.record = '';
                obj.exception = '';
                _allXJSelect.push(obj);

            }

            _datasTable($('#personTable1s'),_allXJSelect);

            _datasTable($('#personTable2s'),result.dipMembers);

        }

        bindData(implementingState,$(this),callback);

        //显示执行人项
        $('#myModal1').find('.table-title').children().eq(1).show();

    })

    //完成【查看】
    $('#scrap-datatables tbody').on('click','.option-see3',function(){

        //初始化
        detailInit(implementingState,$('#myModal1'),$('#personTable1s'),$('#personTable2s'));

        //模态框
        _moTaiKuang($('#myModal1'),'基本情况','flag','','','');

        //样式
        var $this = $(this).parents('tr');

        $('.table tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        //当前点击的任务编码
        var $thisBM = $(this).parents('tr').children('.bianma').html();

        for(var i=0;i<_allDataArr.length;i++){

            if(_allDataArr[i].itkNum == $thisBM){

                //是否启用
                implementingState.sfqy = _allDataArr[i].isActive;
                //任务单号
                implementingState.rwdh = _allDataArr[i].itkNum;
                //任务名称
                implementingState.rwmc = _allDataArr[i].itkName;
                //设备名称
                implementingState.sbmc = _allDataArr[i].dName;
                //设备编码
                implementingState.sbbm = _allDataArr[i].dNum;
                //责任单位部门
                implementingState.zrdwbm = _allDataArr[i].dipKeshi;
                //负责人
                implementingState.fzr = _allDataArr[i].manager;
                //执行人
                implementingState.zxr = _allDataArr[i].itkRen;
                //计划编码
                implementingState.jhbm = _allDataArr[i].dipNum;
                //接单时间
                $('#jdsj').val(_allDataArr[i].tkRecTime);
                //开始时间
                $('#kssj').val(_allDataArr[i].tkTime);
                //完成时间
                $('#wcsj').val(_allDataArr[i].tkCompTime);
                //备注
                $('#beizhu').val(_allDataArr[i].remark);

            }

        }

        var prm = {

            itkNum:implementingState.rwdh,

            dipNum:implementingState.jhbm,

            userID:_userIdNum

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/ywITKGetTKInfo',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){

                _datasTable($('#personTable1s'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });

        //隐藏执行人项
        $('#myModal1').find('.table-title').children().eq(1).hide();

    })

    //选项卡
    $('.table-title span').click(function(){
        var $this = $(this);

        $this.parent('.table-title').children('span').removeClass('spanhover');

        $this.addClass('spanhover');

        var tabDiv = $(this).parents('.table-title').next().children('div');

        tabDiv.addClass('hide-block');

        tabDiv.eq($(this).index()).removeClass('hide-block');

    });

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })


    /*-------------------------------------------------其他方法-------------------------------------------*/

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

    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            itkNum:filterInput[0],
            itkName:filterInput[1],
            dcNum:$('#sblx').val(),
            dNum:filterInput[2],
            dName:filterInput[3],
            dipKeshi:filterInput[4],
            manager:filterInput[5],
            ditST:filterInput[6],
            ditET:moment(filterInput[7]).add(1,'d').format('YYYY/MM/DD'),
            isAllData:1,
            status:$('#zht').val(),
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDITGetTasks',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                _allDataArr = [];
                for(var i=0;i<result.length;i++){
                    _allDataArr.push(result[i]);
                }
                _datasTable($('#scrap-datatables'),result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //绑定数据
    function bindData(el,$that,callback){

        //样式
        var $this = $that.parents('tr');

        $('.table tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        //当前点击的任务编码
        var $thisBM = $that.parents('tr').children('.bianma').html();

        //加载表格下属步骤和执行人
        var prm = {
            itkNum:$thisBM,
            userID:_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWITKGetItemAndMembers',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){

                //赋值
                //是否启用
                el.sfqy = result.isActive;
                //任务单号
                el.rwdh = result.itkNum;
                //任务名称
                el.rwmc = result.itkName;
                //设备名称
                el.sbmc = result.dName;
                //设备编码
                el.sbbm = result.dNum;
                //责任单位部门
                el.zrdwbm = result.dipKeshi;
                //负责人
                el.fzr = result.manager;
                //执行人
                el.zxr = result.itkRen;
                //计划编码
                el.jhbm = result.dipNum;
                //接单时间
                var tkRecTime = result.tkRecTime === null?'':result.tkRecTime.split('T')[0];

                $('#jdsj').val(tkRecTime);

                //开始时间
                var tkTime = result.tkTime === null?'':result.tkTime.split('T')[0];

                $('#kssj').val(tkTime);

                //完成时间
                var tkCompTime = result.tkCompTime === null?'':result.tkCompTime.split('T')[0];


                $('#wcsj').val(tkCompTime);

                //备注
                $('#beizhu').val(result.remark);

                callback(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });

    }

    //模态框初始化
    function detailInit(el,mo,table1,table2){

        //是否启用
        el.sfqy = 0;
        //任务单号
        el.rwdh = '';
        //任务名称
        el.rwmc = '';
        //设备名称
        el.sbmc = '';
        //设备编码
        el.sbbm = '';
        //责任单位部门
        el.zrdwbm = '';
        //负责人
        el.fzr = '';
        //执行人
        el.zxr = '';
        //计划编码
        el.jhbm = '';
        //时间初始化
        mo.find('.datatimeblock').val('');
        //textarea初始化
        mo.find('textarea').val('');

        //表格初始化
        var arr = [];

        if(table1){

            _datasTable(table1,arr);

        }
        if(table2){

            _datasTable(table2,arr);

        }




    }


})