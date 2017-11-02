$(function(){
    /*-----------------------------------------全局变量------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');

//获得用户id
    var _userIdNum = sessionStorage.getItem('userName');

//获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");


    //验证必填项（非空）
    Vue.validator('notempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //邮箱验证
    Vue.validator('emailFormat',function(val){
        val=val.replace(/^\s+|\s+$/g,'');
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val);
    })

    //新增地点登记对象
    var user = new Vue({
        el:'#user',
        data:{
            phone:'',
            addressnum:'',
            describe:'',
            department:'',
            remarks:''
        },
        methods:{
            keyUp:function(){
                if( user.password != user.confirmpassword ){
                    $('.confirmpassword').show().html('两次输入密码不一致！');
                    if( user.confirmpassword == '' ){
                        $('.confirmpassword').hide();
                    }
                }else{
                    $('.confirmpassword').hide();
                }
            },
            keyUpJob:function(){
                var existFlag = false;
                for(var i=0;i<_allPersonalArr.length;i++){
                    if(_allPersonalArr[i].userNum == user.jobnumber){
                        existFlag = true;
                    }
                }
                if(existFlag){
                    $('.jobNumberExists').show();
                }else{
                    $('.jobNumberExists').hide();
                }
            }
        }
    });

    //获取部门（登记的时候）
    //getDepartment($('#djbm'));

    //条件查询
    //getDepartment($('#rybm'),'flag');


    //获取楼宇
    //getBuild($('#building'));

    //存放所有地点列表的数组
    var _allPersonalArr = [];
    //存放所有部门
    var _allBXArr = [];
    /*----------------------------------------表格初始化-----------------------------------------*/
    var table = $('#personal-table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "bStateSave":true,
        "iDisplayLength":50,//默认每页显示的条数,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'id',
                data:'id',
                class:'userNum hidden'
            },
            {
                title:'电话',
                data:'phone'
            },
            {
                title:'地点名称',
                data:'locname'
            },
            {
                title:'部门名称',
                data:'departname'
            },
            {
                title:'描述',
                data:'info'
            },
            {
                title:'备注',
                data:'memo'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe' style='display: none'>查看</span>" +
                "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

            }
        ]
    });

    table.buttons().container().appendTo($('.excelButton'),table.table().container());

    var matterTable = $('#choose-metter').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'search':'搜索:',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'地点编号',
                data:'locnum',
                class:'theHidden'
            },
            {
                title:'地点名称',
                data:'locname'
            },
            {
                title:'部门',
                data:'departname',
                class:'adjust-comment',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            },
            {
                title:'楼栋',
                data:'ddname'
            }
        ]
    });

    //数据
    conditionSelect();
    //获取部门
    bxKShiData();

    /*----------------------------------------按钮事件-------------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });

    //重置按钮
    $('.resites').click(function(){
        $('.filterInput').val('');
        $('#rybm').children('option').eq(0).attr('selected','selected');
        $('#ryjs').children('option').eq(0).attr('selected','selected');
    })

    //新增按钮
    $('.creatButton').click(function(){
        //显示放大镜按钮
        $('.fdjImg').show();

        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');
        //初始化登记表
        user.addressnum='';
        user.phone='';
        user.describe='';
        user.remarks='';
        user.department='';
        var disableArea = $('#user').find('.input-blockeds');
        disableArea.children('input').attr('disabled',false).removeClass('disabled-block');
        disableArea.children('select').attr('disabled',false).removeClass('disabled-block');
        disableArea.children('textarea').attr('disabled',false).removeClass('disabled-block');
        //不能下拉的地点和部门
        $('.no-choose').attr('disabled',true).addClass('disabled-block');
    });

    //操作确定按钮
    $('#myModal')
    //登记确定按钮功能
        .on('click','.dengji',function(){
            //发送请求
            editOrView('YWGD/SysPhoneCreate','登记成功!','登记失败!');
        })
        //编辑确定按钮功能
        .on('click','.bianji',function(){
            //发送请求
            editOrView('YWGD/SysPhoneUpdate','编辑成功!','编辑失败!',false,true);
        })
        //删除确定按钮功能
        .on('click','.shanchu',function(){
            //发送请求
            editOrView('YWGD/SysPhoneDelete','删除成功!','删除失败!','false');
        })
    //表格操作
    $('#personal-table tbody')
    //查看详情
        .on('click','.option-see',function(){
            //详情框
            moTaiKuang($('#myModal'),'查看','flag');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData($(this),'flag');
        })
        //编辑
        .on('click','.option-edit',function(){

            //详情框
            moTaiKuang($('#myModal'),'编辑');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData($(this));
            //$('.ghbm').attr('disabled',true).addClass('disabled-block');
            $('.no-choose').attr('disabled',true).addClass('disabled-block');
        })
        //删除
        .on('click','.option-delete',function(){
            //详情框
            moTaiKuang($('#myModal'),'确定要删除吗？');
            $('#myModal').find('.btn-primary').addClass('shanchu').removeClass('dengji').removeClass(('bianji'));
            //绑定数据
            bindingData($(this),'flag');
        });

    //选择地点弹窗打开后
    $('#choose-building').on('shown.bs.modal', function () {

        getDepartment();

    });

    $('#choose-metter').on('click','.tableCheck',function(){
        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });

    //选择地点确定按钮
    $('#choose-building .btn-primary').on('click',function() {
        var dom = $('#choose-metter tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())

                user.addressnum = dom.eq(i).children().eq(1).html();

                $('#choose-building').modal('hide');

                return false
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应地点', '')

    });

    //部门表格
    var departTable = $('#choose-department-table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'部门编号',
                data:'departNum',
                class:'adjust-comment'
            },
            {
                title:'部门名称',
                data:'departName'
            }
        ]
    });

    //选择部门弹窗打开后
    $('.choose-message').on('shown.bs.modal', function () {
        //获取当前打开的模态框ID
        var curID = $(this).attr('id');
        //如果是部门
        if(curID == 'choose-department'){
            datasTable($('#choose-department-table'),_allBXArr);
            //如果是报修人
        }else  if(curID == 'choose-people'){
            datasTable($('#choose-people-table'),_allworkerArr);
        }

    });

    $('.choose-message').on('click','.tableCheck',function(){
        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });

    //选择部门确定按钮
    $('.choose-message .btn-primary').on('click',function() {
        //获取当前打开的模态框ID
        var curID = $(this).parents('.choose-message').attr('id');

        var dom = $(this).parents('.choose-message').find('.table tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //如果是报修科室
                if(curID == 'choose-department'){
                    user.department = dom.eq(i).find('.adjust-comment').html();
                }else if(curID == 'choose-people'){
                    user.bxren = dom.eq(i).find('.adjust-comment').html();
                }

                $(this).parents('.choose-message').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应信息', '')

    });

    /*---------------------------------------其他方法--------------------------------------------*/
    //模态框自适应
    function moTaiKuang(who,title,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-title').html(title);
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    };

    //修改提示信息
    function tipInfo(who,title,meg,flag){
        moTaiKuang(who,title,flag);
        who.find('.modal-body').html(meg);
    }

    //获取条件查询
    function conditionSelect(){
        //获取条件
        var locname = $('#filter_global input').val();
        var prm = {
            "phone": "",
            "locname": locname,
            "userID": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/SysPhoneGetALl',
            data:prm,
            success:function(result){
                //console.log(result);
                _allPersonalArr = [];
                for(var i=0;i<result.length;i++){
                    _allPersonalArr.push(result[i]);
                }
                datasTable($('#personal-table'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
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

    //编辑、登记方法
    function editOrView(url,successMeg,errorMeg,flag,flag1){
        //判断必填项是否为空
        if( user.addressnum == '' || user.phone == '' || user.describe == '' || user.department==''){
            tipInfo($('#myModal1'),'提示','请填写红色必填项！','flag');
        }else{

                //判断是编辑、登记、还是删除
                var prm = {};

                if(flag){
                    prm = {
                        //"userName2": user.username,
                        "userID":_userIdName,
                        "id":thisBM
                    }
                }else{
                    //获取地点编号
                    var addressName =  $("#djbm").find("option:selected").text();
                    //获取部门
                    var departName =  $("#bmmc").find("option:selected").text();
                    prm = {
                        "phone":user.phone,
                        "locname":addressName,
                        "locnum":user.addressnum,
                        "departnum": user.department,
                        "departname": departName,
                        "info": user.describe,
                        "memo":user.remarks,
                        "userID":_userIdName
                    };
                    if(flag1){
                        prm.id = thisBM;
                    }
                }
                //发送数据
                $.ajax({
                    type:'post',
                    url:_urls + url,
                    data:prm,
                    success:function(result){
                        if(result == 99){
                            //提示登记成功
                            tipInfo($('#myModal1'),'提示',successMeg,'flag');
                            $('#myModal').modal('hide');
                        }else if(result == 3){
                            //提示登记失败
                            tipInfo($('#myModal1'),'提示',errorMeg,'flag');
                        }
                        conditionSelect();
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })


        }
    }

    //存放ID
    var thisBM;

    //查看、删除绑定数据
    function bindingData(el,flag){
        thisBM = el.parents('tr').children('.userNum').html();
        //根据工号绑定数据
        for(var i=0;i<_allPersonalArr.length;i++){
            if(_allPersonalArr[i].id == thisBM){
                //console.log(33);
                //绑定数据
                user.addressnum = _allPersonalArr[i].locnum;
                user.phone = _allPersonalArr[i].phone;
                user.describe = _allPersonalArr[i].info;
                user.remarks = _allPersonalArr[i].memo;
                user.department = _allPersonalArr[i].departnum;

            }
        }
        //查看不可操作
        var disableArea = $('#user').find('.input-blockeds');
        if(flag){
            //隐藏放大镜按钮
            $('.fdjImg').hide();
            disableArea.children('input').attr('disabled',true).addClass('disabled-block');
            disableArea.children('select').attr('disabled',true).addClass('disabled-block');
            disableArea.children('textarea').attr('disabled',true).addClass('disabled-block');
        }else{
            //显示放大镜按钮
            $('.fdjImg').show();
            disableArea.children('input').attr('disabled',false).removeClass('disabled-block');
            disableArea.children('select').attr('disabled',false).removeClass('disabled-block');
            disableArea.children('textarea').attr('disabled',false).removeClass('disabled-block');
        }
    }

    getDepartment();

    //获取地点
    function getDepartment(){

        var prm = {
            "locname": '',
            "departname": '',
            "ddname": '',
            "userID": ''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/SysLocaleGetAll',
            data:prm,
            success:function(result){
                //console.log(result);

                str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].locnum +
                        '">' + result[i].locname + '</option>'
                }
                $('#djbm').html(str);
                datasTable($('#choose-metter'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取部门
    function bxKShiData(){
        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            success:function(result){
                console.log(result);
                _allBXArr.length = 0;
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){

                    _allBXArr.push(result[i]);

                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>>';
                }

                $('#bmmc').html(str);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

});