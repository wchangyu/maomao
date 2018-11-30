$(function(){

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    //当前操作的数据id
    var _thisId = '';

    //项目树
    var _itemTreeObj;

    var setting = {

        check: {
            enable: true,
            chkboxType: { "Y": "ps", "N": "ps" },
            radioType:'all'
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId"
            }
        },
        view:{
            showIcon:false
        },
        callback: {

            onClick: function(e,treeId,treeNode){

                var treeObj = $.fn.zTree.getZTreeObj(treeId);

                //取消全部打钩的节点
                treeObj.checkNode(treeNode,!treeNode.checked,true);

                getCheckedItem();

            },

            onCheck:function(e,treeId,treeNode){

                var treeObj = $.fn.zTree.getZTreeObj(treeId);

                if(treeNode.checked){

                    treeObj.checkNode(treeNode,true,true);

                }else{

                    treeObj.checkNode(treeNode,false,true);

                }

                getCheckedItem();

            }

        }
    };

    //当前任务下的项目集合
    var _itemListArr = [];

    //获取运送分类
    taskCate();

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

            //发起人姓名
            'TM-taskPersonName':{

                required: true

            },
            //开始地点
            'TM-startAdress':{

                required: true

            }


        },
        messages:{

            //发起人姓名
            'TM-taskPersonName':{

                required: '发起人姓名是必填字段'

            },
            //开始地点
            'TM-startAdress':{

                required: '开始地点是必填字段'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //发起人姓名
                'TM-taskPersonName':{

                    required: true

                },
                //开始地点
                'TM-startAdress':{

                    required: true

                }


            },
            messages:{

                //发起人姓名
                'TM-taskPersonName':{

                    required: '发起人姓名是必填字段'

                },
                //开始地点
                'TM-startAdress':{

                    required: '开始地点是必填字段'

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

                str += '<span class="option-button option-edit option-in" data-num="' + full.tmCode + '">' + '编辑</span>'

                return str


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

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
        },
        {
            title:'操作',
            data:'id',
            render:function(data, type, full, meta){

                return '<div class="option-button option-del option-in" style="width: 50px;" data-id="' + data +'">删除</div>'

            }

        }

    ]

    _tableInit($('#project-table'),projectCol,'2','','','','','');

    //项目表格
    var projectModalCol = [

        {
            title:'项目名称',
            data:'name',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.id + '">' + data + '</span>'

            }
        },
        {
            title:'项目分类编码',
            data:'pnum'
        },
        {
            title:'项目分类名称',
            data:'pname'
        },
        {
            title:'操作',
            data:'id',
            render:function(data, type, full, meta){

                return '<div class="option-button option-del option-in" style="width: 50px;" data-id="' + data +'">删除</div>'

            }

        }

    ]

    _tableInitSearch($('#project-table-modal'),projectModalCol,'2','','','','','');

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

        //可操作
        abledOption();

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
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //赋值
        bindData(_thisId);

        //获取子项
        itemListByNum(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

        //自动填写部分显示
        $('.autoBack').show();

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQTM/ywGDUpt',$('#create-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


            })

        }

    })

    //新增，编辑已选项目
    $('#add-project').on('click',function(){

        _moTaiKuang($('#project-Modal'),'项目列表','','','','选择');

        //获取当前已选中的项目
        _itemListArr.length = 0;

        var lengths = 0;

        var trs = $('#project-table tbody').children();

        for(var i=0;i<trs.length;i++){

            if(trs.eq(i).find('.option-del').length == 1){

                lengths ++

            }

        }

        for(var i=0;i<lengths;i++){

            var obj = {};

            obj.id = trs.eq(i).children('td').eq(0).children().attr('data-id');

            _itemListArr.push(obj);

        }

        projectType();

    })

    //第二层模态框删除项目
    $('#project-table-modal tbody').on('click','.option-del',function(){

        var currentId = $(this).attr('data-id');

        //根据id寻找节点
        var treeNode = _itemTreeObj.getNodeByParam('id',currentId);

        //删除ztree的当前id项
        _itemTreeObj.checkNode(treeNode,false,true);

        //删除表格
        var t = $('#project-table-modal').DataTable();

        t.row($(this).parents('tr')).remove().draw();

    })

    //点击第二层确定按钮
    $('#project-Modal').on('click','.btn-primary',function(){

        //将所有节点付给第一层
        var nodes = _itemTreeObj.getCheckedNodes(true);

        //过滤掉父节点
        var arr = [];

        for(var i=0;i<nodes.length;i++){

            if(!nodes[i].isParent){

                arr.push(nodes[i]);

            }

        }

        if(arr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择项目','');

            return

        }

        //转换格式

        _itemListArr.length = 0;

        for(var i=0;i<arr.length;i++){

            var obj = {};

            obj.tmname = arr[i].name;

            obj.tmclassnum = arr[i].pnum;

            obj.tmclassname = arr[i].pname;

            obj.id = arr[i].id;

            _itemListArr.push(obj);

        }

        _datasTable($('#project-table'),_itemListArr);

        $('#project-Modal').modal('hide');

    })

    //第一层删除项目按钮
    $('#project-table tbody').on('click','.option-del',function(){

        var t = $('#project-table').DataTable();

        t.row($(this).parents('tr')).remove().draw();

        _itemListArr.removeByValue($(this).attr('data-id'),'id');

    })

    //科室选择
    $('#dep-Modal').on('click','.btn-primary',function(){

        var currentTr = _isSelectTr($('#depart-table-global'));

        if(currentTr){

            var name = $(currentTr).children().eq(2).html();

            var num = $(currentTr).children().eq(1).html();

            if(_selectDepartButton == 'TM-taskDepButton'){

                //发起科室
                $('#TM-taskDep').val(name);

                $('#TM-taskDep').attr('data-num',num);

                $('#TM-taskDep').next('.error').hide();

            }else if(_selectDepartButton == 'TM-carryDepButton'){

                //运送科室
                $('#TM-carryDep').val(name);

                $('#TM-carryDep').attr('data-num',num);

                $('#TM-carryDep').next('.error').hide();

            }

            $('#dep-Modal').modal('hide');

        }

    })

    //确定发起人
    $('#person-new-Modal').on('click','.btn-primary',function(){

        //验证是否选择
        var currentTr = _isSelectTr($('#person-table-filter'));

        if(currentTr){

            var num = currentTr.find('.checker').attr('data-id');

            var name = currentTr.children().eq(1).html();

            var depNum = currentTr.children().eq(2).children().attr('data-num');

            var depName = currentTr.children().eq(2).children().html();

            var tel = currentTr.children().eq(4).html();

            $('#person-new-Modal').modal('hide');

            $('#TM-taskPersonNum').val(num);

            $('#TM-taskPersonName').val(name);

            $('#TM-taskTel').val(tel);

            $('#TM-taskDep').val(depName);

            $('#TM-taskDep').attr('data-num',depNum);

            $('#TM-taskPersonName').next('.error').hide();

        }


    })

    //确定地点
    $('#address-Modal').on('click','.btn-primary',function(){

        var current = _isSelectTr($('#address-table'));

        if(current){

            var name = current.children().eq(2).html();

            var num = current.children().eq(1).html();

            if(_selectLocationButton == 'startAdress'){

                //开始地点
                $('#TM-startAdress').val(name);

                $('#TM-startAdress').attr('data-num',num);

                $('#TM-startAdress').next('label').hide();

            }else if(_selectLocationButton == 'endAdress'){

                //结束地点
                $('#TM-endAdress').val(name);

                $('#TM-endAdress').attr('data-num',num);

                $('#TM-endAdress').next('label').hide();

            }

            $('#address-Modal').modal('hide');

        }

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //状态
            tmStatus:10,
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
            b_DepartNum:_userBM
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

        $('#TM-carryTaskDep').val(4);

        $('#TM-taskDep').removeAttr('data-num');

        $('#TM-carryDep').removeAttr('data-num');

        _datasTable($('#project-table'),[]);

    }

    //发送数据
    function sendData(url,el,flag,successFun){

        //if(_itemListArr.length == 0){
        //
        //    _moTaiKuang($('#tip-Modal'),'提示',true,true,'项目不能为空','');
        //
        //    return;
        //
        //}

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
            tmcate:$('#TM-carryType').val() == ''?'':$('#TM-carryType').children('option:selected').html(),
            //运送分类编号
            tmcatenum:$('#TM-carryType').val(),
            //运送科室
            tmkeshi:$('#TM-carryDep').val(),
            //运送科室id
            tmkeshinum:$('#TM-carryDep').attr('data-num'),
            //运送任务类型
            tmleixing:$('#TM-carryTaskDep').val(),
            //项目
            tmxms:_itemListArr,
            //备注
            bxbeizhu:$('#TM-remark').val()
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
                $('#TM-taskDep').attr('data-num',data.bxKeshiNum);
                //开始地点
                $('#TM-startAdress').val(data.tMsrcdidian);
                //开始地点id
                $('#TM-startAdress').attr('data-num',data.tMsrcdidianNum);
                //结束地点
                $('#TM-endAdress').val(data.tMdestDidian);
                //结束地点id
                $('#TM-endAdress').attr('data-num',data.tMdestdidianNum);
                //运送分类
                $('#TM-carryType').val(data.tmCateNum);
                //运送科室
                $('#TM-carryDep').val(data.tMkeshi);
                //运送科室id
                $('#TM-carryDep').attr('data-num',data.tmKeshiNum);
                //运送任务类型
                $('#TM-carryTaskDep').val(data.tMleixing);
                //备注
                $('#TM-remark').val(data.bxBeizhu);

            }

        }

    }

    //可以操作
    function abledOption(){

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);
    }

    //获取项目分类
    function projectType(){

        _mainAjaxFunCompleteNew('post','YHQTM/TmxmClassGetAll','',false,function(result){

            if(result.code == 99){

                if(result.data.length > 0){

                    var arr = [];

                    for(var i=0;i<result.data.length;i++){

                        arr.push(result.data[i]);

                    }

                    //获取运送项目
                    itemData(arr);

                }

            }


        })

    }

    //获取所有项目
    function itemData(arr){

        var prm = {

            "tmnum": "",

            "tmname": "",

            "tmclassname": "",

            "userID": _userIdNum,

            "userName": _userIdName,

            "b_UserRole": _userRole,

            "b_DepartNum": _userBM

        }

        _mainAjaxFunCompleteNew('post','YHQTM/TmxmGetAll',prm,false,function(result){

            if(result.code == 99){

                if(result.data.length>0){

                    for(var i=0;i<result.data.length;i++){

                        arr.push(result.data[i]);

                    }

                }

            }

            var itemArr = [];

            for(var i=0;i<arr.length;i++){

                var obj = {};

                obj.id = arr[i].tmname?arr[i].id:arr[i].tmclassnum;

                obj.name = arr[i].tmname?arr[i].tmname:arr[i].tmclassname;

                if(arr[i].tmname){

                    //说明是项目

                    obj.pname = arr[i].tmclassname;

                    obj.pnum = arr[i].tmclassnum;

                    obj.pId = arr[i].tmclassnum;

                }else{

                    //说明是项目分类(不可选)
                    //obj.nocheck = true;

                    if(i == 0){

                        obj.open = true;

                    }

                }

                itemArr.push(obj);

            }

            _itemTreeObj = $.fn.zTree.init($('#TM-project'), setting, itemArr);

            if(_itemListArr.length !=0){

                //根据id寻找节点
                for(var i=0;i<_itemListArr.length;i++){

                    var treeNode = _itemTreeObj.getNodeByParam('id',_itemListArr[i].id);

                    //删除ztree的当前id项
                    _itemTreeObj.checkNode(treeNode,true,true);

                }

            }

            getCheckedItem();

        })


    }

    //运送分类
    function taskCate(){

        _mainAjaxFunCompleteNew('post','YHQTM/TMCateList','',false,function(result){

            var str = '<option value="">请选择</option>'

            if(result.code == 99){

                if(result.data.length>0){

                    for(var i=0;i<result.data.length;i++){

                        var data = result.data[i];

                        str += '<option value="' + data.id + '">' + data.catename + '</option>'

                    }

                }

            }

            $('#TM-carryType').empty().append(str);

        })

    }

    //点击ztree树，获取选中节点
    function getCheckedItem(){

        var nodes = _itemTreeObj.getCheckedNodes(true);

        //过滤掉父节点
        var arr = [];

        for(var i=0;i<nodes.length;i++){

            if(!nodes[i].isParent){

                arr.push(nodes[i]);

            }

        }

        _datasTable($('#project-table-modal'),arr);

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

                    _itemListArr.length = 0;

                    //赋值
                    for(var i=0;i<result.data.length;i++){

                        var data = result.data[i];

                        var obj = {};

                        obj.id = data.tmXmid;

                        obj.tmname = data.tmXm;

                        obj.tmclassnum = data.tmclassnum;

                        obj.tmclassname = data.tmclassname;

                        _itemListArr.push(obj);

                        arr.push(obj);

                    }

                    _datasTable($('#project-table'),arr);

                }

            }

        })

    }

})