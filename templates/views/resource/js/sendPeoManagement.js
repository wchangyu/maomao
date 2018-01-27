/**
 * Created by admin on 2018/1/18.
 */
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
    });

    //新增地点登记对象
    var user = new Vue({
        el:'#user',
        data:{
            addressnum:'',
            addressname:'',
            peoplename:'',
            age:'',
            sex:'0',
            phone:'',
            telphone:'',
            duty:''
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

    //条件查询
    //getDepartment($('#rybm'),'flag');


    $(document).on("show.bs.modal", ".modal", function(){
        $(this).draggable({
            handle: ".modal-header"   // 只能点击头部拖动
        });
        $(this).css("overflow", "hidden"); // 防止出现滚动条，出现的话，你会把滚动条一起拖着走的
    });

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
                data:'lmid',
                class:'hidden userNum'
            },
            {
                title:'序号',
                data:null,
                render:function(data, type, full, meta){

                    return meta.row + 1
                }
            },
            {
                title:'单位名称',
                data:'lmEprName'
            },
            {
                title:'统计员',
                data:'lmName'
            },
            {
                title:'性别',
                data:'lmSex',
                render:function(data, type, full, meta){

                    if(data == 0){
                        return '男'
                    }else {
                        return '女'
                    }
                }
            },
            {
                title:'年龄',
                data:'lmAge',

            },
            {
                title:'职务',
                data:'lmPost'
            },
            {
                title:'办公电话',
                data:'lmTel'
            },
            {
                title:'手机',
                data:'lmmp'
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
    });

    //新增按钮
    $('.creatButton').click(function(){
        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');
        //初始化登记表
        user.addressnum='';
        user.addressname='';
        user.peoplename='';
        user.age='';
        user.sex='0';
        user.duty='';
        user.telphone='';
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
            editOrView('Alarm/AddNoteLinkMan','登记成功!','登记失败!');
        })
        //编辑确定按钮功能
        .on('click','.bianji',function(){
            //发送请求
            editOrView('Alarm/EditNoteLinkMan','编辑成功!','编辑失败!',false,true);
        })
        //删除确定按钮功能
        .on('click','.shanchu',function(){
            //发送请求
            editOrView('Alarm/DelNoteLinkMan','删除成功!','删除失败!','false');
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

        //判断用户是否有发送短信权限
        if(sessionStorage.userAuth){
            var userAuth = sessionStorage.userAuth;
            console.log(userAuth.charAt(30));
            if(userAuth.charAt(30)!="1"){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'当前用户无操作权限', '');

                return false;
            }

        }

        //获取条件
        // 单位名称
        var eprName = $('#filter_global input').val();

        var prm = {
            "eprName": eprName
        };
        $.ajax({
            type:'get',
            url:_urls + 'Alarm/GetNoteLinkMans',
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
        //判断用户是否有发送短信权限
        if(sessionStorage.userAuth){
            var userAuth = sessionStorage.userAuth;
            if(userAuth.charAt(30)!="1"){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'当前用户无操作权限', '');

                return false;
            }

        }

        //判断必填项是否为空
        if( user.addressname == ''||user.peoplename == ''||user.telephone == ''){
            tipInfo($('#myModal1'),'提示','请填写红色必填项！','flag');
        }else{

            //判断是编辑、登记、还是删除
            var prm = {};
            if(flag){

                //获取当前ID
                for(var i=0;i<_allPersonalArr.length;i++){
                    if(_allPersonalArr[i].lmid == user.addressnum){

                        prm.LmID = _allPersonalArr[i].lmid;
                    }
                }

                prm.UserID=_userIdName;

                console.log(prm);

                //发送数据
                $.ajax({
                    type:'post',
                    url:_urls + url,
                    data:JSON.stringify(prm),
                    contentType:'application/json',
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

            }else{

                prm = {
                    "lmid": 0,
                    "lmEprName":user.addressname,
                    "lmAge": user.age,
                    "lmSex":user.sex,
                    "lmName":user.peoplename,
                    "lmTel":user.phone,
                    "lmmp": user.telphone,
                    "lmPost":user.duty,
                    "userID":_userIdName
                };

                if(flag1){
                    //获取当前ID
                    for(var i=0;i<_allPersonalArr.length;i++){
                        if(_allPersonalArr[i].lmid == user.addressnum){

                            prm.lmid = _allPersonalArr[i].lmid;
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
    }

    //查看、删除绑定数据
    function bindingData(el,flag){
        var thisBM = el.parents('tr').children('.userNum').html();
        //console.log(_allPersonalArr);
        //根据工号绑定数据
        for(var i=0;i<_allPersonalArr.length;i++){
            if(_allPersonalArr[i].lmid == thisBM){
                console.log(_allPersonalArr[i]);
                //绑定数据
                user.addressnum = _allPersonalArr[i].lmid;
                user.addressname = _allPersonalArr[i].lmEprName;
                user.age = _allPersonalArr[i].lmAge;
                user.peoplename =  _allPersonalArr[i].lmName;
                user.sex = _allPersonalArr[i].lmSex;
                user.duty = _allPersonalArr[i].lmPost;
                user.phone = _allPersonalArr[i].lmTel;
                user.telphone = _allPersonalArr[i].lmmp;
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


});