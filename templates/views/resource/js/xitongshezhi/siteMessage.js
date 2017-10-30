$(function(){
    /*-----------------------------------------全局变量------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');

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
            addressnum:'',
            addressname:'',
            build:'',
            plies:'',
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
    getDepartment($('#djbm'));

    //条件查询
    //getDepartment($('#rybm'),'flag');


    //获取楼宇
    getBuild($('#building'));

    //存放所有地点列表的数组
    var _allPersonalArr = [];
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
              title:'',
              data:'id',
              class:'hidden'
            },
            {
                title:'地点名称',
                data:'locname'
            },
            {
                title:'地点编号',
                data:'locnum',
                className:'userNum'
            },
            {
                title:'部门',
                data:'departname'
            },
            {
                title:'楼栋',
                data:'ddname'
            },
            {
                title:'层数',
                data:'floor'
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

    //数据
    //conditionSelect();
    /*----------------------------------------按钮事件-------------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });
    //数据初始化
    conditionSelect();

    //重置按钮
    $('.resites').click(function(){
        $('.filterInput').val('');
        $('#rybm').children('option').eq(0).attr('selected','selected');
        $('#ryjs').children('option').eq(0).attr('selected','selected');
    })

    //新增按钮
    $('.creatButton').click(function(){
        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');
        //初始化登记表
        user.addressnum='';
        user.addressname='';
        user.build='';
        user.plies='';
        user.department='';
        user.remarks='';
        var disableArea = $('#user').find('.input-blockeds');
        disableArea.children('input').attr('disabled',false).removeClass('disabled-block');
        disableArea.children('select').attr('disabled',false).removeClass('disabled-block');
        disableArea.children('textarea').attr('disabled',false).removeClass('disabled-block');
    });

    //操作确定按钮
    $('#myModal')
    //登记确定按钮功能
        .on('click','.dengji',function(){
            //发送请求
            editOrView('YWGD/SysLocaleCreate','登记成功!','登记失败!');
        })
        //编辑确定按钮功能
        .on('click','.bianji',function(){
            //发送请求
            editOrView('YWGD/SysLocaleUpdate','编辑成功!','编辑失败!',false,true);
        })
        //删除确定按钮功能
        .on('click','.shanchu',function(){
            //发送请求
            editOrView('YWGD/SysLocaleDelete','删除成功!','删除失败!','false');
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

        })
        //删除
        .on('click','.option-delete',function(){
            //详情框
            moTaiKuang($('#myModal'),'确定要删除吗？');
            $('#myModal').find('.btn-primary').addClass('shanchu').removeClass('dengji').removeClass(('bianji'));
            //绑定数据
            bindingData($(this),'flag');
        })
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
       // 地点名称
       var locname = $('#filter_global input').val();
        // 部门名称
        var departname = $('#filter_global1 input').val();
        // 楼栋名称
        var ddname = $('#filter_global2 input').val();

        var prm = {
            "locname": locname,
            "departname": departname,
            "ddname": ddname,
            "userID": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/SysLocaleGetAll',
            data:prm,
            success:function(result){
                console.log(result);
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
        if( user.addressname == ''||user.plies == ''||user.department == ''||user.build == '' ){
            tipInfo($('#myModal1'),'提示','请填写红色必填项！','flag');
        }else{

                    //判断是编辑、登记、还是删除
                    var prm = {};
                    if(flag){
                        prm = {
                            "userID":_userIdName
                        };

                            //获取当前ID
                            for(var i=0;i<_allPersonalArr.length;i++){
                                if(_allPersonalArr[i].locnum == user.addressnum){

                                    prm.id = _allPersonalArr[i].id;
                                }
                            }

                    }else{
                        //获取部门名称
                        var departName =  $("#djbm").find("option:selected").text();
                        //获取楼宇名称
                        var buildName =  $("#building").find("option:selected").text();
                        prm = {
                            "locName":user.addressname,
                            "floor": user.plies,
                            "departNum":user.department,
                            "departName":departName,
                            "ddnum":user.build,
                            "ddname":buildName,
                            "memo":user.remarks
                            //"userID":_userIdName
                        };

                        if(flag1){
                            //获取当前ID
                            for(var i=0;i<_allPersonalArr.length;i++){
                                if(_allPersonalArr[i].locnum == user.addressnum){

                                        prm.id = _allPersonalArr[i].id;
                                }
                            }
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

    //查看、删除绑定数据
    function bindingData(el,flag){
        var thisBM = el.parents('tr').children('.userNum').html();
        console.log(_allPersonalArr);
        //根据工号绑定数据
        for(var i=0;i<_allPersonalArr.length;i++){
            if(_allPersonalArr[i].locnum == thisBM){
                console.log(_allPersonalArr[i]);
                //绑定数据
                user.addressnum = _allPersonalArr[i].locnum;
                user.addressname = _allPersonalArr[i].locname;
                user.plies = _allPersonalArr[i].floor;
                user.build =  _allPersonalArr[i].ddnum;
                user.department = _allPersonalArr[i].departnum;
                user.remarks = _allPersonalArr[i].memo;

            }
        }

        //查看不可操作
        var disableArea = $('#user').find('.input-blockeds');
        if(flag){
            disableArea.children('input').attr('disabled',true).addClass('disabled-block');
            disableArea.children('select').attr('disabled',true).addClass('disabled-block');
            disableArea.children('textarea').attr('disabled',true).addClass('disabled-block');
        }else{
            disableArea.children('input').attr('disabled',false).removeClass('disabled-block');
            disableArea.children('select').attr('disabled',false).removeClass('disabled-block');
            disableArea.children('textarea').attr('disabled',false).removeClass('disabled-block');
        }
    }

    //获取部门
    function getDepartment(el,flag){
        var prm = {
            "departNum": "",
            "departName": "",
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            success:function(result){
                console.log(result);
                var str = ''
                if(flag){
                    str = '<option value="">全部</option>';
                }else{
                    str = '<option value="">请选择</option>';
                }
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>'
                }
                el.append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取楼宇
    function getBuild(el,flag){
        var prm = {
            "ddName":'',
            "userID": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDDs',
            data:prm,
            success:function(result){
                var str = '';
                if(flag){
                    str = '<option value="">全部</option>';
                }else{
                    str = '<option value="">请选择</option>';
                }
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].ddNum +
                        '">' + result[i].ddName + '</option>'
                }
                el.append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }


})