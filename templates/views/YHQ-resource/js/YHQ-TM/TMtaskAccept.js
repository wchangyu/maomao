$(function(){

    _isClickTrMulti = true;

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    //当前操作的数据编码
    var _thisId = '';

    //当前操作的任务的id
    var _thisIdTrue = '';

    //下发任务是否执行完成
    var _isCompleteAssign = false;

    //下发任务是执行成功
    var _isSuccessAssign= false;

    //负责人是否执行完成
    var _isCompleteExecutor = false;

    //负责人是否执行成功
    var _isSuccessExecutor = false;

    /*----------------------------日历插件----------------------------------*/

    //默认半个月

    var now = moment().format('YYYY-MM-DD');

    var st = moment(now).subtract(14,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(now);

    _timeYMDComponentsFun11($('.abbrDT'));

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //运送科室
            'TM-carryDep':{

                required: true

            }
        },
        messages:{

            //运送科室
            'TM-carryDep':{

                required: '运送科室是必填字段'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //运送科室
                'TM-carryDep':{

                    required: true

                }
            },
            messages:{

                //运送科室
                'TM-carryDep':{

                    required: '运送科室是必填字段'

                }
            }

        });

    }

    /*-----------------------------表格初始化--------------------------------*/

    var col=[

        {
            title:'运送任务编码',
            data:'tmCode',
            render:function(data, type, full, meta){

                return '<a href="TMDetails.html?num=' + full.tmCode + '&data=' + full.id + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'发起人',
            data:'bxRenName'
        },
        {
            title:'发起班组',
            data:'bxkeshi'
        },
        {
            title:'开始地点',
            data:'tMsrcdidian'
        },
        {
            title:'结束地点',
            data:'tMdestDidian'
        },
        {
            title:'项目',
            data:'tmXms'
        },
        {
            title:'任务时间',
            data:'tmShij',
            render:function(data, type, full, meta){

                var str = '';

                if(data != '' && data != null){

                    str = data.replace(/T/g,' ')

                }

                return str

            }
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                str += '<span class="option-button option-edit option-in" data-num="' + full.tmCode + '">' + '分派</span>' +

                    '<span class="option-button option-del option-in" data-num="' + full.tmCode + '">' + '回退</span>'

                return str


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    //可协助
    var assistCol=[

        {
            title:'运送任务编码',
            data:'tmCode',
            render:function(data, type, full, meta){

                return '<a href="TMDetails.html?num=' + full.tmCode + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'发起人',
            data:'bxRenName'
        },
        {
            title:'发起班组',
            data:'bxkeshi'
        },
        {
            title:'开始地点',
            data:'tMsrcdidian'
        },
        {
            title:'结束地点',
            data:'tMdestDidian'
        },
        {
            title:'项目',
            data:'tmXms'
        },
        {
            title:'任务时间',
            data:'tmShij',
            render:function(data, type, full, meta){

                var str = '';

                if(data != '' && data != null){

                    str = data.replace(/T/g,' ')

                }

                return str

            }
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                str += '<span class="option-button option-edit option-in" data-num="' + full.tmCode + '" data-id="' + full.id + '">' + '协助</span>'

                return str


            }

        }

    ]

    _tableInit($('#table-assist'),assistCol,'2','','','','','');

    //已协助
    var assistedCol=[

        {
            title:'运送任务编码',
            data:'tmCode',
            render:function(data, type, full, meta){

                return '<a href="TMDetails.html?num=' + full.tmCode + '" target="_blank">' + data + '</a>'

            }
        },
        {
            title:'发起人',
            data:'bxRenName'
        },
        {
            title:'发起班组',
            data:'bxkeshi'
        },
        {
            title:'开始地点',
            data:'tMsrcdidian'
        },
        {
            title:'结束地点',
            data:'tMdestDidian'
        },
        {
            title:'项目',
            data:'tmXms'
        },
        {
            title:'任务时间',
            data:'tmShij',
            render:function(data, type, full, meta){

                var str = '';

                if(data != '' && data != null){

                    str = data.replace(/T/g,' ')

                }

                return str

            }
        },
        {
            title:'协助科室',
            data:'tMkeshi'

        },
        {
            title:'协助负责人',
            data:'pgUserNames'
        },
        {
            title:'协助执行人',
            data:'tmUserNames'
        }

    ]

    _tableInit($('#table-assisted'),assistedCol,'2','','','','','');

    //已选中项目表格
    var projectCol = [

        {
            title:'项目名称',
            data:'tmname',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.id + '">' + data + '</span>'

            }
        },
        {
            title:'项目分类编码',
            data:'tmclassnum'
        },
        {
            title:'项目分类名称',
            data:'tmclassname'
        }

    ]

    _tableInit($('#project-table'),projectCol,'2','','','','','','',true);

    //负责人列表
    var leaderCol = [
        {
            title:'工号',
            data:'tmRen'
        },
        {
            title:'姓名',
            data:'tmrName'
        },
        {
            title:'职位',
            data:'rolename'
        },
        {
            title:'联系电话',
            data:'tmrDh'
        }

    ]

    //执行人列表
    var executoCol = [

        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  '<div class="checker" data-id="' + full.userNum + '"><span><input type="checkbox"                                 value=""></span></div>'

            }
        },
        {
            title:'工号',
            data:'userNum'
        },
        {
            title:'姓名',
            data:'userName'
        },
        {
            title:'职位',
            data:'roleName'
        },
        {
            title:'联系电话',
            data:'mobile'
        }

    ]

    _tableInit($('#project-table-leader'),leaderCol,'2','','','','','','',true);

    _tableInit($('#project-table-executor'),executoCol,'2','','','','','','',true);

    //待接单
    conditionSelect();

    //获取协助任务
    xzDataList();

    /*-----------------------------按钮事件----------------------------------*/

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //新增
    $('#createBtn').click(function(){

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //自动填写部分隐藏
        $('.autoBack').hide();

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQTM/TMAddInfo',$('#create-Modal').children(),false,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


            })

        }

    })

    //重置
    $('#resetBtn').click(function(){

        _resetFun();

        $('#spDT').val(st);

        $('#epDT').val(now);

    })

    //分派
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-num');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'分派','','','','分派');

        //赋值
        bindData(_thisId);

        //获取子项
        itemListByNum(_thisId);

        //获取运送负责人
        getLeaderList(_thisId);

        //获取运送执行人列表
        getExecutorList();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('xiezhu').addClass('bianji');

        //自动填写部分显示
        $('.autoBack').show();

        //协助原因
        $('.assist-block').hide();

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        //指定执行人
        executorPublic();

        //分派
        assignTask();

    })

    //科室选择
    $('#dep-Modal').on('click','.btn-primary',function(){

        var currentTr = _isSelectTr($('#depart-table-global'));

        if(currentTr){

            var name = $(currentTr).children().eq(2).html();

            var num = $(currentTr).children().eq(1).html();

            //运送科室
            $('#TM-carryDep').val(name);

            $('#TM-carryDep').attr('data-num',num);

            $('#TM-carryDep').next('.error').hide();

            $('#dep-Modal').modal('hide');

            //根据选择的维修班组，获取负责人列表，点击选择之后，添加
            getLeaderList(num);

        }

    })

    //指定负责人
    $('#project-table-leader tbody').on('click','tr',function(){

        _isClickTr = false;

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //回退
    $('#table tbody').on('click','.option-del',function(){

        //初始化
        $('#back-remark').val('');

        _thisId = $(this).attr("data-num");

        var str = '确定要回退<span style="font-size: 14px;font-weight: bold;margin: 0 10px;">' + _thisId + '</span>吗？'

        //模态框
        _moTaiKuang($('#back-Modal'),str,'','','','回退');

    })

    //回退确定按钮
    $('#back-Modal').on('click','.btn-primary',function(){

        //回退
        backTask();

    })

    //点击协助
    $('#table-assist tbody').on('click','.option-edit',function(){

        _thisIdTrue = $(this).attr('data-id');

        _thisId = $(this).attr('data-num');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'协助','','','','协助');

        //赋值
        xzDetail();

        //子项目
        itemListByNum(_thisId);

        getExecutorList();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').addClass('xiezhu');

        //显示隐藏

        //协助原因
        $('.assist-block').show();

    })

    //协助确定按钮
    $('#create-Modal').on('click','.xiezhu',function(){

        zxFun();

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //状态
            tmStatus:20,
            //运送任务编号
            tmCode:$('#TM-taskNumCon').val(),
            //开始时间
            gdSt:$('#spDT').val(),
            //结束时间
            gdEt:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM,

            TMKeshiNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQTM/GetTMInfoList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //初始化
    function createModeInit(){

        _creatInit();

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

        $('#create-Modal').find('textarea').val('');

        _datasTable($('#project-table'),[]);

        _datasTable($('#project-table-leader'),[]);

        $('#TM-carryDep').removeAttr('data-num');

    }

    //发送数据
    function sendData(url,el,flag,successFun){

        if(_itemListArr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'项目不能为空','');

            return;

        }

        var prm = {

            //发起人id
            bxrenid:$('#TM-taskPersonNum').val(),
            //发起人
            bxrenname:$('#TM-taskPersonName').val(),
            //发起电话
            bxdianhua:$('#TM-taskTel').val(),
            //发起科室
            bxkeshi:$('#TM-taskDep').val(),
            //发起科室id
            bxkeshinum:$('#TM-taskDep').attr('data-num'),
            //开始地点
            tmsrcdidian:$('#TM-startAdress').val(),
            //开始地点id
            tmsrcdidiannum:$('#TM-startAdress').attr('data-num'),
            //结束地点
            tmdestdidian:$('#TM-endAdress').val(),
            //结束地点id
            tmdestdidiannum:$('#TM-endAdress').attr('data-num'),
            //运送分类
            tmcate:$('#TM-carryType').children('option:selected').html(),
            //运送分类编号
            tmcatenum:$('#TM-carryType').val(),
            //运送科室
            tmkeshi:$('#TM-carryDep').val(),
            //运送科室id
            tmkeshinum:$('#TM-carryDep').attr('data-num'),
            //运送任务类型
            tmleixing:$('#TM-carryTaskDep').val(),
            //项目
            tmxms:_itemListArr
        }

        if(flag){

            prm.tmcode = _thisId;

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.tmCode == id){

                //运送编号
                $('#TM-taskNum').val(data.tmCode);
                //运送状态
                $('#TM-taskStatus').val(_getTMStatus(data.tmStatus));
                //发起人
                $('#TM-taskPersonNum').val(data.bxRenID);
                //发起人姓名
                $('#TM-taskPersonName').val(data.bxRenName);
                //发起人电话
                $('#TM-taskTel').val(data.bXdianhua);
                //发起科室
                $('#TM-taskDep').val(data.bxkeshi);
                //发起科室id
                //$('#TM-taskDep').attr('data-num',data.bxKeshiNum);
                //开始地点
                $('#TM-startAdress').val(data.tMsrcdidian);
                //开始地点id
                //$('#TM-startAdress').attr('data-num',data.tMsrcdidianNum);
                //结束地点
                $('#TM-endAdress').val(data.tMdestDidian);
                //结束地点id
                //$('#TM-endAdress').attr('data-num',data.tMdestdidianNum);
                //运送分类
                $('#TM-carryType').val(data.tmCateNum);
                //运送科室
                $('#TM-carryDep').val(data.tMkeshi);
                //运送科室id
                $('#TM-carryDep').attr('data-num',data.tmKeshiNum);
                //运送任务类型
                $('#TM-carryTaskDep').val(data.tMleixing);
                //备注
                $('#TM-remark').val(data.tmBeizhu);

            }

        }

    }

    //获取子项的list
    function itemListByNum(num){

        var prm = {

            tmCode:num

        }

        _mainAjaxFunCompleteNew('post','YHQTM/GetTMInfoxmsList',prm,false,function(result){

            if(result.code == 99){

                if(result.data.length != 0 && result.data != null){

                    var arr = [];

                    //赋值
                    for(var i=0;i<result.data.length;i++){

                        var data = result.data[i];

                        var obj = {};

                        obj.id = data.tmXmid;

                        obj.tmname = data.tmXm;

                        obj.tmclassnum = data.tmclassnum;

                        obj.tmclassname = data.tmclassname;

                        arr.push(obj);

                    }

                    _datasTable($('#project-table'),arr);

                }

            }

        })

    }

    //获取运送负责人
    function getLeaderList(){

        var prm = {

            //部门编码
            tmCode: _thisId,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMWXLeaderList',prm,false,function(result){

            if(result.length != 0 && result != null){

                _datasTable($('#project-table-leader'),result.data);

            }else{

                _datasTable($('#project-table-leader'),[]);

            }

        })

    }

    //获取执行人接口
    function getExecutorList(){

        var prm = {

            //部门编码
            departNum: _userBM,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YWGD/ywGetWXRens',prm,false,function(result){

            if(result.length != 0 && result != null){

                _datasTable($('#project-table-executor'),result);

            }else{

                _datasTable($('#project-table-executor'),[]);

            }

        })

    }

    //分派接口
    function assignTask(){

        var prm = {

            //任务编码
            tmcode:_thisId,
            //运送班组
            tmkeshi:$('#TM-carryDep').val(),
            //运送班组编号
            tmkeshinum:$('#TM-carryDep').attr('data-num'),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMUptPaig',prm,false,function(result){

            _isCompleteAssign = true;

            if(result.code == 99){

                _isSuccessAssign = true;

                bothCallBack();

            }

        })

    }

    //指定执行人
    function executorPublic(){

        var current = $('#project-table-executor tbody').children('.tables-hover');

        var arr = [];

        if( current.length != 0 && current.eq(0).children().hasClass('dataTables_empty')){



        }else{

            for(var i=0;i<current.length;i++){

                var data = current.eq(i);

                var obj = {};

                //运送人员ID
                obj.tmRen = data.children().eq(1).html();
                //运送人姓名
                obj.tmrName = data.children().eq(2).html();
                //联系电话
                obj.tmrDh = data.children().eq(4).html();
                //任务编码
                obj.tmCode = _thisId

                arr.push(obj);

            }

        }

        if(arr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'执行人不能为空','');

            return false;

        }

        var prm = {

            //编码
            tmCode:_thisId,
            //负责任人列表
            list:arr,
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMRenEdit',prm,false,function(result){

            _isCompleteExecutor = true;

            if(result.code == 99){

                _isSuccessExecutor = true;

                bothCallBack();

            }

        })


    }

    //判断两个接口的执行结果
    function bothCallBack(){

        if(_isCompleteAssign && _isCompleteExecutor ){

            var str = '';

            if(_isSuccessAssign){

                str += '分派任务成功，'

            }else{

                str += '分派任务失败，'

            }

            if(_isSuccessExecutor){

                str += '指定执行人成功'

            }else{

                str += '指定执行人失败'

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,str,'');

            if(_isSuccessAssign && _isSuccessExecutor){

                $('#create-Modal').modal('hide');

            }

        }

    }

    //回退
    function backTask(){

        var prm = {

            tmcode:_thisId,

            backreason:$('#back-remark').val(),

            tmstatus:10,

            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMReturn',prm,false,function(result){

            if(result.code == 99){

                $('#back-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    }

    //获取协助列表
    function xzDataList(){

        var prm = {

            //开始时间
            st:$('#spDT').val(),
            //结束时间
            et:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //运送任务编号
            tmCode:$('#TM-taskNumCon').val()

        }

        _mainAjaxFunCompleteNew('post','YHQTM/GetTMInfoFZList',prm,false,function(result){

            //可协助
            var arr = [];

            //已协助
            var arr1 = [];

            if(result.code == 99){

                if(result.data.length != 0 && result.data != null){

                    for(var i=0;i<result.data.length;i++){

                        var data = result.data[i];

                        if(data.tmStatus == 20){

                            //可协助
                            arr.push(data);

                        }else if(data.tmStatus == 30){

                            //已协助
                            arr1.push(data);

                        }

                    }

                }

            }

            _datasTable($('#table-assist'),arr);

            _datasTable($('#table-assisted'),arr1);


        })


    }

    //可协助详情
    function xzDetail(){

        var prm = {

            id:_thisIdTrue,

            tmCode:_thisId

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMInfoFZDetail',prm,false,function(result){

            if(result.code == 99){

                var data = result.data;
                //运送编号
                $('#TM-taskNum').val(data.tmCode);
                //运送状态
                $('#TM-taskStatus').val(_getTMStatus(data.tmStatus));
                //发起人
                $('#TM-taskPersonNum').val(data.bxRenID);
                //发起人姓名
                $('#TM-taskPersonName').val(data.bxRenName);
                //发起人电话
                $('#TM-taskTel').val(data.bXdianhua);
                //发起科室
                $('#TM-taskDep').val(data.bxkeshi);
                //发起科室id
                //$('#TM-taskDep').attr('data-num',data.bxKeshiNum);
                //开始地点
                $('#TM-startAdress').val(data.tMsrcdidian);
                //开始地点id
                //$('#TM-startAdress').attr('data-num',data.tMsrcdidianNum);
                //结束地点
                $('#TM-endAdress').val(data.tMdestDidian);
                //结束地点id
                //$('#TM-endAdress').attr('data-num',data.tMdestdidianNum);
                //运送分类
                $('#TM-carryType').val(data.tmCate);
                //运送科室
                $('#TM-carryDep').val(data.tMkeshi);
                //运送科室id
                $('#TM-carryDep').attr('data-num',data.tmKeshiNum);
                //运送任务类型
                $('#TM-carryTaskDep').val(data.tMleixing);
                //备注
                $('#TM-remark').val(data.tmBeizhu);
                //协助原因
                $('#TM-xzRemark').val(data.remark);
                //负责人
                if(data.wxLeaderFZList.length != 0 && data.wxLeaderFZList != null){

                    _datasTable($('#project-table-leader'),data.wxLeaderFZList);

                }


            }

        })

    }

    //协助方法
    function zxFun(){

        var current = $('#project-table-executor tbody').children('.tables-hover');

        var arr = [];

        if( current.length != 0 && current.eq(0).children().hasClass('dataTables_empty')){



        }else{

            for(var i=0;i<current.length;i++){

                var data = current.eq(i);

                var obj = {};

                //运送人员ID
                obj.tmRen = data.children().eq(1).html();
                //运送人姓名
                obj.tmrName = data.children().eq(2).html();
                //联系电话
                obj.tmrDh = data.children().eq(4).html();
                //任务编码
                obj.tmCode = _thisId

                arr.push(obj);

            }

        }

        if(arr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'执行人不能为空','');

            return false;

        }

        var prm = {

            //id
            id:_thisIdTrue,
            //任务编号
            tmCode:_thisId,
            //执行人
            list:arr

        }

        console.log(prm);

        _mainAjaxFunCompleteNew('post','YHQTM/TMRenFZUpdateTMUser',prm,false,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

                xzDataList();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    }

})