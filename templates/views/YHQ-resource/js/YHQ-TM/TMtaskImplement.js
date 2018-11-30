$(function(){

    _isClickTrMulti = true;

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    //当前操作的数据id
    var _thisId = '';

    //当前操作的子项目
    var projectSon = '';

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

                str += '<span class="option-button option-edit option-in" data-num="' + full.tmCode + '">' + '完工</span>' +

                    '<span class="option-button option-del option-in" data-num="' + full.tmCode + '">' + '回退</span>'

                return str


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    //已选中项目表格
    var projectCol = [

        {
            title:'项目名称',
            data:'tmXm',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.tmXmid + '">' + data + '</span>'

            }
        },
        {
            title:'项目分类名称',
            data:'tmclassname'
        },
        {
            title:'完成人',
            data:'tmRenName'
        },
        {
            title:'完成时间',
            data:'xmwgTime',
            render:function(data, type, full, meta){

                var str = '';

                if(data != '' && data != null){

                    str = data.replace(/T/g,' ');

                }

                return str;

            }
        },
        {
            title:'完成备注',
            data:'tmxmmemo'
        },
        {
            title:'操作',
            data:'id',
            render:function(data, type, full, meta){

                var str = ''

                if(full.xmStatus == 0){

                    str += '<span class="option-button option-edit option-in" data-id="' + data + '">' + '完成</span>'

                }else{

                    str = '已完成'

                }

                return str

            }
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

    _tableInit($('#project-table-leader'),leaderCol,'2','','','','','','',true);

    _tableInit($('#project-table-executor'),executoCol,'2','','','','','','',true);

    //物料列表
    var materialCol = [
        {
            title:'选择',
            data:'',
            render:function(data, type, full, meta){

                return '<div class="option-button option-see selectMaterial option-in" style="width: 50px;">选择</div>'

            }
        },
        {
            title:'物料编码',
            data:'itemNum'

        },
        {
            title:'物料名称',
            data:'itemName'
        },
        {
            title:'型号',
            data:'size'
        },
        {
            title:'单价',
            render:function(data, type, full, meta){

                var str = '<input class="table-group-action-input form-control" placeholder="数字，必填">';

                return str;

            }
        },
        {
            title:'数量',
            data:'num',
            render:function(data, type, full, meta){

                return '<input class="table-group-action-input form-control" placeholder="数字，必填">'

            }
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'金额',
            data:'amount',
            render:function(data, type, full, meta){

                return '<input class="table-group-action-input form-control" placeholder="数字，必填">'

            }
        }


    ]

    _tableInit($('#material-table-add'),materialCol,'2','','','','','','',true);

    conditionSelect();

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

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-num');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'申请完工',true,'','','申请完工');

        //赋值
        bindData(_thisId);

        //获取子项
        itemListByNum(_thisId);

        //获取运送负责人
        getLeaderList(_thisId);

        //获取运送执行人
        getExecutorList();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //自动填写部分显示
        $('.autoBack').show();

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){


        //完工申请
        finishTask();

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

    //物料增加一行
    $('#add-material').click(function(){

        //增加一行空的tr
        var t = $('#material-table-add').DataTable();

        t.row.add([]).draw();

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

    //完成单个子项目
    $('#project-table tbody').on('click','.option-edit',function(){

        //初始化
        $('#finish-remark').val('');

        projectSon = $(this).attr('data-id');

        _moTaiKuang($('#project-son-Modal'),'完成','','','','完成');

    })

    //完成单个子项目确定按钮
    $('#project-son-Modal').on('click','.btn-primary',function(){

        finishSonProject();

    })

    //选择物品确定按钮
    //$('#material-Modal').on('click','.btn-primary',function(){
    //
    //    var current = _isSelectTr($('#material-table'));
    //
    //    console.log(current);
    //
    //})

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //状态
            tmStatus:30,
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

                    _datasTable($('#project-table'),result.data);

                    var isFlag = false;

                    for(var i=0;i<result.data.length;i++){

                        var data = result.data[i];

                        if(data.xmStatus == 0){

                            isFlag = true;

                            break;

                        }else{

                            isFlag = false;

                        }

                    }

                    if(isFlag){

                        $('#create-Modal').find('.btn-primary').hide();

                    }else{

                        $('#create-Modal').find('.btn-primary').show().html('申请完工');

                    }


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

    //获取执行人
    function getExecutorList(){

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

        _mainAjaxFunCompleteNew('post','YHQTM/TMRenList',prm,false,function(result){

            if(result.length != 0 && result != null){

                _datasTable($('#project-table-executor'),result.data);

            }else{

                _datasTable($('#project-table-executor'),[]);

            }

        })

    }

    //完工申请
    function finishTask(){

        var prm = {

            //任务单号
            tmcode:_thisId,
            //备注
            tmbeizhu:$('#TM-remark').val(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/ywGUptWang',prm,false,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })


    }

    //回退
    function backTask(){

        var prm = {

            tmcode:_thisId,

            backreason:$('#back-remark').val(),
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

    //完成子项目
    function finishSonProject(){

        var obj = {};

        obj.tmCode = _thisId;

        obj.id = projectSon;

        obj.tmRen = _userIdNum;

        obj.tmRenName = _userIdName;

        obj.tmxmmemo = $('#finish-remark').val()

        var arr = [];

        arr.push(obj);

        var prm = {

            //任务编号
            tmCode:_thisId,
            //
            list:arr

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TMInfoxmsFinish',prm,false,function(result){

            if(result.code == 99){

                $('#project-son-Modal').modal('hide');

                itemListByNum(_thisId);

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    }

})