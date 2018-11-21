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

    //存放所有保养任务的数组
    var _allDataArr = [];

    //存放保养步骤的数组
    var _allXJSelect = [];

    //记录当前选中的任务的编码
    var _thisBM = '';

    //记录当前任务下的执行人数组
    var _oldPersonArr = [];

    //记录当前任务下的执行人数组
    var _newPersonArr = [];

    //存放所有执行人数组
    var _allPersonArr = [];

    //添加执行人按钮
    var addStr = '<li class="addButton" style="width: 70px;">' +
        '                        <div class="cont-col1" style="cursor: pointer">' +
        '                            <div class="label label-sm label-warning selectPersonButton" style="line-height: 34px;padding: 7px 14px;font-family: 微软雅黑;font-size: 14px;">' +
        '                                <i class="fa fa-plus" style="margin-right: 2px;"></i>选择执行人' +
        '                            </div>' +
        '                        </div>' +
        '                    </li>';

    divType();

    //添加执行人的部门下拉内容
    getDepart();

    //获取所有执行人
    getExecutor(true);

    /*------------------------------------------------表格初始化------------------------------------------*/

    //保养任务总表格
    var inspectionMissionCol = [

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
            title:'时间',
            data:'tkTime',
            render:function(data, type, full, meta){

                if(full.status == 0 || full.status == 1){

                    //判断日期颜色
                    var now = moment().format('YYYY-MM-DD');

                    //时间tkTime小于今天的  日期变成红色

                    if(_timeCompare(data,now)){//第一个小于第二个返回true

                        if(data == ''){

                            return ''

                        }else{

                            return '<span style="color: red">' + moment(data).format("YYYY-MM-DD") + '</span>'

                        }



                    }


                }else{

                    if(data == ''){

                        return ''

                    }else{

                        return moment(data).format('YYYY-MM-DD')

                    }

                }



            }

        },
        {
            title:'状态',
            data:'status',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '未接单'
                }else if(data == 1){
                    return '执行中'
                }else if(data == 2){
                    return '完成'
                }else if(data == 3){

                    return '取消下发'

                }
            }
        },
        {
            title:'操作',
            "data": 'status',
            "render":function(data, type, full, meta){

                if(data == 0){

                    return "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span><span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"

                }else if(data ==1){

                    return "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span>"

                }else if(data ==2){

                    return "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span>"

                }else if(data == 3){

                    return "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span><span class='data-option option-xiafa btn default btn-xs green-stripe'>重新下发</span>"

                }
            }
        }

    ];

    _tableInit($('.main-contents-table').find('.table'),inspectionMissionCol,1,'flag','','');

    //未接单状态下的保养步骤
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
            title:'工作内容',
            data:'desc'
        },
        {
            title:'保养方式',
            data:'mtContent'
        },
        {
            title:'备注',
            data:'remark'
        }

    ];

    _tableInit($('#personTable1'),XJBZCol,2,'flag','','');

    //执行中状态下的保养步骤
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
            title:'保养结果',
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

    //执行人列表
    var choiceWorkCol = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'dipRenNum',
        },
        {
            title:'执行人员',
            data:'userName',
            className:'dipRen'
        },
        {
            title:'联系电话',
            data:'mobile',
            className:'dipDh'
        },

    ];

    _tableInit($('#zhixingRenTable'),choiceWorkCol,2,'','','');

    //不可编辑的执行人表格
    var ZXRColno = [

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
            data:'itkdh'
        },
        {
            title:'',
            "targets": -1,
            "data": null,
            "defaultContent": ''

        }

    ];

    //可编辑的执行人表格
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
            data:'itkdh'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": '<span class="data-option option-del btn default btn-xs green-stripe">删除</span>'

        }

    ];

    //数据加载
    conditionSelect();

    /*-------------------------------------------------按钮事件-------------------------------------------*/
    //未接单状态【查看】
    $('#scrap-datatables tbody').on('click','.option-see1',function(){

        //执行人表格初始化
        _tableInit($('#personTable2,#personTable2s'),ZXRColno,2,'flag','','');

        //初始化
        detailInit(unAnsweredState,$('#myModal'),$('#personTable1'),$('#personTable2'));

        //模态框
        _moTaiKuang($('#myModal'),'基本情况','flag','','','');

        var callback = function(result){

            //设备
            _datasTable($('#personTable1'),result.devMTItems);
            //执行人
            _datasTable($('#personTable2'),result.dmMemberModels);

        }

        bindData(unAnsweredState,$(this),callback);

    })

    //执行中【查看】
    $('#scrap-datatables tbody').on('click','.option-see2',function(){

        //执行人表格初始化
        _tableInit($('#personTable2,#personTable2s'),ZXRColno,2,'flag','','');

        //初始化
        detailInit(implementingState,$('#myModal1'),$('#personTable1s'),$('#personTable2s'));

        //模态框
        _moTaiKuang($('#myModal1'),'基本情况','flag','','','');

        var callback = function(result){

            _datasTable($('#personTable1s'),result.devMTItems);

            _datasTable($('#personTable2s'),result.dmMemberModels);

        }

        bindData(implementingState,$(this),callback);

        //显示执行人项
        $('#myModal1').find('.table-title').children().eq(1).show();

    })

    //完成【查看】
    $('#scrap-datatables tbody').on('click','.option-see3',function(){

        //执行人表格初始化
        _tableInit($('#personTable2,#personTable2s'),ZXRColno,2,'flag','','');

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
                console.log(_allDataArr[i]);
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
                $('#jdsjs').val(_allDataArr[i].tkRecTime);
                //开始时间
                $('#kssjs').val(_allDataArr[i].tkTime);
                //完成时间
                $('#wcsjs').val(_allDataArr[i].tkCompTime);
                //备注
                $('#beizhus').val(_allDataArr[i].remark);

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

    //【取消】
    $('#scrap-datatables tbody').on('click','.option-cancel',function(){

        _thisBM = $(this).parents('tr').find('.bianma').html();

        //执行人表格初始化
        _tableInit($('#personTable2,#personTable2s'),ZXRColno,2,'flag','','');

        //初始化
        detailInit(unAnsweredState,$('#myModal'),$('#personTable1'),$('#personTable2'));

        //模态框
        _moTaiKuang($('#myModal'),'确定要取消下发的任务吗?',false,'','','取消任务');

        var callback = function(result){

            //设备
            _datasTable($('#personTable1'),result.devMTItems);
            //执行人
            _datasTable($('#personTable2'),result.dmMemberModels);

        }

        bindData(unAnsweredState,$(this),callback);

        //绑定类名
        $('#myModal').find('.btn-primary').removeClass('reSend').addClass('cancel');

    })

    //【取消确定按钮】
    $('#myModal').on('click','.cancel',function(){

        //loadding
        $('#theLoading').modal('show');

        var prm = {

            //任务编码
            itkNum:_thisBM,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWDevMT/QuXiaoDMTask',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result == 99){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'取消任务成功！', '');

                    $('#myModal').modal('hide');

                    //刷新
                    conditionSelect();

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'取消任务失败！', '');

                }

            },

            error:_errorFun1

        })

    })

    //【重新下发】
    $('#scrap-datatables tbody').on('click','.option-xiafa',function(){

        _thisBM = $(this).parents('tr').find('.bianma').html();

        //插入添加执行人表格
        $('.condition-query1').append(addStr);

        //执行人表格初始化
        _tableInit($('#personTable2,#personTable2s'),ZXRCol,2,'flag','','');

        //初始化
        detailInit(unAnsweredState,$('#myModal'),$('#personTable1'),$('#personTable2'));

        //模态框
        _moTaiKuang($('#myModal'),'重新下发',false,'','','重新下发');

        var callback = function(result){

            //设备
            _datasTable($('#personTable1'),result.devMTItems);
            //执行人
            _datasTable($('#personTable2'),result.dmMemberModels);

            _oldPersonArr.length = 0;

            for(var i=0;i<result.dmMemberModels.length;i++){

                _oldPersonArr.push(result.dmMemberModels[i]);

            }

        }

        bindData(unAnsweredState,$(this),callback);

        //绑定类名
        $('#myModal').find('.btn-primary').removeClass('cancel').addClass('reSend');

    })

    //删除添加执行人按钮
    $('#myModal').on('hide.bs.modal',function(){

        $('.condition-query1').empty();

    })

    //【重新下发确定按钮】
    $('#myModal').on('click','.reSend',function(){

        //loadding
        $('#theLoading').modal('show');

        var prm = {

            //任务编码
            itkNum:_thisBM,
            //执行人列表
            memberModelList:_oldPersonArr,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWDevMT/CXXFDMTask',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result == 99){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'重新下发成功！', '');

                    $('#myModal').modal('hide');

                    //刷新
                    conditionSelect();

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'重新下发失败！', '');

                }

            },

            error:_errorFun1

        })

    })

    //【删除执行人】
    $('#personTable2 tbody').on('click','.option-del',function(){

        //删除选中的执行人
        var thisWorker = $(this).parents('tr').children().eq(1).html();

        //根据工号删除相应的执行人
        _oldPersonArr.removeByValue(thisWorker,'itkRenNum');

        //给表格赋值
        _datasTable($(this).parents('.table'),_oldPersonArr);

    })

    //【添加执行人】按钮
    $('.condition-query1').on('click','.addButton',function(){

        //模态框
        _moTaiKuang($('#Person-Modal'),'添加执行人',false, '' ,'', '添加');

        //初始化
        personInit();

        //将就数组的执行人放进新数组中

        var _canFlag = true;

        _newPersonArr.length = 0;

        for(var i=0;i<_oldPersonArr.length;i++){

            for(var j=0;j<_newPersonArr.length;j++){

                if(_oldPersonArr[i].itkRenNum == _newPersonArr[j].itkRenNum){

                    _canFlag = false;

                    break;

                }

            }

            if(_canFlag){

                _newPersonArr.push(_oldPersonArr[i]);

            }

        }

    })

    //条件查询执行人
    $('.zhixingButton').click(function(){

        getExecutor();

    })

    //获取选择的新的执行人
    $('.addZXR').click(function(){

        //获得执行人
        var personList = $('#zhixingRenTable tbody').children('.tables-hover');

        for(var i=0;i<personList.length;i++){

            var obj = {};

            //工号
            obj.itkRenNum = personList.eq(i).children('.dipRenNum').html();

            //执行人
            obj.itkRen = personList.eq(i).children('.dipRen').html();

            //电话
            obj.itkdh = personList.eq(i).children('.dipDh').html();

            _canFlag = true;

            if(_newPersonArr.length == 0){

                _canFlag = true;

            }else{

                for(var j=0;j<_newPersonArr.length;j++){

                    if(_newPersonArr[j].itkRenNum == obj.itkRenNum){

                        _canFlag = false;

                        break;

                    }

                }

            }

            if(_canFlag){

                _newPersonArr.push(obj);

            }

        }

        //将新数组存入到旧数组中

        _oldPersonArr.length = 0;

        for(var i=0;i<_newPersonArr.length;i++){

            _oldPersonArr.push(_newPersonArr[i]);

        }

        //第一个表格赋值
        _datasTable($('#personTable2'),_oldPersonArr);

        //模态框消失
        $('#Person-Modal').modal('hide');

    })

    //选择执行人的复选框
    $('#zhixingRenTable tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

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
            userID:_userIdNum,
            //是否超时
            istimeout:$('#istimeout').val()
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevMT/YWDMTGetTasks',
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
            url:_urls + 'YWDevMT/YWMTKGetItemAndMembers',
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

    //执行人的部门
    function getDepart(){

        $.ajax({

            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:{

                userID:_userIdNum,
                userName:_userIdName,
                departName:$('.sbmc1').val(),
                isWx:1
            },
            timeout:_theTimes,
            success:function(result){

                //根据筛选部门

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>'


                }

                $('#bm').empty().append(str);

                _datasTable($('#department-table'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //执行人列表初始化
    function personInit(){

        $('#Person-Modal').find('input').val('');

        $('#Person-Modal').find('select').val('');

        _datasTable($('#zhixingRenTable'),_allPersonArr);

    }

    //获取所有执行人,true的时候，获取所有执行人
    function getExecutor(flag){

        var prm = {

            userName2:$('#zxName').val(),
            userNum:$('#zxNum').val(),
            zxPhone:$('#zxPhone').val(),
            departNum:$('#bm').val(),
            userID:_userIdNum,
            userName:_userIdName

        }

        $.ajax({

            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(flag){

                    _allPersonArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allPersonArr.push(result[i]);

                    }

                }else{

                    _datasTable($('#zhixingRenTable'),result);

                }



            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }


        })

    }


})