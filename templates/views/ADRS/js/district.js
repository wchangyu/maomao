var District = function () {

    //条件刷新标识
    var _isReloadData = false;

    //树（小）
    var districtZtreeS;

    //记录当前选中的数据id
    var _thisID = '';

    /*------------------------------------------表格初始化----------------------------*/

    var col = [

        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='data-option option-edit btn default btn-xs green-stripe' data-userId='" + full.id + "'>编辑</span>"

                    //"<span class='data-option option-shanchu btn default btn-xs green-stripe' data-userId='" + full.id + "'>删除</span>"

            }
        },
        {
            title:'区域id',
            data:'id'
        },
        {
            title:'区域名称',
            data:'name'
        },
        {
            title:'父级id',
            data:'pId'
        },
        {
            title:'区域等级',
            data:'level',
            render:function(data, type, full, meta){

               if(data == 1){

                   return '省级'

               }else if(data == 2){

                   return '市级'

               }

            }
        }
        //{
        //    title:'是否有效',
        //    data:'isDelName'
        //}

    ]

    _tableInit($('#table'),col,2,true,'','','','');

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //区域名称
            'district-name':{

                required: true

            }

        },
        messages:{

            //登陆用户名
            'district-name':{

                required: '请输入区域名称'

            }

        }

    })

    /*-------------------------------------------按钮方法-----------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //创建区域
    $('#createUser').click(function(){

        //loadding
        $('#theLoading').modal('show');

        //初始化
        createInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'创建','',false,false,'创建');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //loadding
        $('#theLoading').modal('hide');

    })

    //创建用户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRDistrict/CreateDRDistrictInfo','创建成功！');

        })
    })

    //【编辑】
    $('#table tbody').on('click','.option-edit',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //初始化
        createInit();

        //获取当前的用户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#create-Modal'), '提示', false, '' ,'', '保存');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //是否可操作
        //用户登陆名不能操作
        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        $('#create-user-name').attr('disabled',true);

        //密码不显示
        $('.password-block').hide();

    })

    //编辑【确定】
    $('#create-Modal').on('click','.bianji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRDistrict/ModifyDRDistrictInfo','编辑成功！',true);

        })

    })

    //【删除】
    $('#table tbody').on('click','.option-shanchu',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //初始化
        createInit();

        //获取当前的用户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#create-Modal'), '确定要删除吗？', false, '' ,'', '删除');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //是否可操作
        //用户登陆名不能操作
        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

        //密码不显示
        $('.password-block').hide();

    })

    //删除【确定】
    $('#create-Modal').on('click','.shanchu',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            var prm = {

                districtId:_thisID

            }

            $.ajax({

                type:'post',

                url:sessionStorage.apiUrlPrefix + 'DRDistrict/LogicDelDRDistrict',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    //重载数据标识
                    _isReloadData = true;

                    if(result.code == 0){

                        //创建成功
                        _moTaiKuang($('#tip-Modal'),'提示',true,true,'删除成功！','');

                        //模态框消失
                        $('#create-Modal').modal('hide');


                    }else if(result.code == -2){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                    }else if(result.code == -1){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                    }else if(result.code == -3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                    }else if(result.code == -4){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                    }

                },

                error:_errorFun

            })


        })

    })

    //提示关闭之后，再刷新数据
    $('#tip-Modal').on('hidden.bs.modal',function(){

        if(_isReloadData){

            conditionSelect();

        }

        //标识重置
        _isReloadData = false;

    })

    /*-------------------------------------------其他方法-----------------------------*/

    //获取所有产品
    function conditionSelect(){

        $('#theLoading').modal('show');

        var prm = {

            keyword:$('#keyWord').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRDistrict/GetDRDistrictDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                var arr = [];

                if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }else if(result.code == 0){

                    arr = result.dists.reverse();
                }

                //表格
                _jumpNow($('#table'),arr);

                //ztree(大)
                setZtree($("#ztreeStation"),arr);

                //ztree(小)
                setZtree($("#ztreeStationS"),arr);

            },

            error:_errorFun

        })


    }

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#district-name').val() == '' ){

            $('#theLoading').modal('hide');

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项!','');

        }else{

            //验证错误
            var error = $('#create-Modal').find('.error');

            if(error.length != 0){

                if(error.css('display') != 'none'){

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式!','');

                }else{

                    //验证通过
                    fun();

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

    //创建用户(flag代表是否传id)
    function sendOption(url,seccessMeg,flag){

        //获取勾选的id
        var parentId = 0;

        districtZtreeS = $.fn.zTree.getZTreeObj("ztreeStationS");

        var parentArr = districtZtreeS.getCheckedNodes(true);

        if(parentArr.length != 0){

            parentId = parentArr[0].id;

        }

        var prm = {

            //区域名称
            name:$('#district-name').val(),
            //用户角色
            parentId:parentId,
            //等级
            level:$('#level').val()

        };

        if(flag){

            prm.id = _thisID;

        }


        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + url,

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                //重载数据标识
                _isReloadData = true;

                if(result.code == 0){

                    //创建成功
                    _moTaiKuang($('#tip-Modal'),'提示',true,true,seccessMeg,'');

                    //模态框消失
                    $('#create-Modal').modal('hide');

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }

            },

            error:_errorFun


        })

    }

    //初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        _thisID = '';

    }

    //ztree树
    function setZtree(treeId,treeData){

        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all',
                nocheckInherit: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false,
            },
            callback: {

                onClick: function(e,treeId,treeNode){

                    //取消全部打钩的节点
                    pointerObj.checkNode(treeNode,!treeNode.checked,true);

                },
                beforeClick:function(){

                    $('#ztreeStation').find('.curSelectedNode').removeClass('curSelectedNode');

                },

                onCheck:function(e,treeId,treeNode){

                    $('#ztreeStation').find('.curSelectedNode').removeClass('curSelectedNode');

                    $('#ztreeStation').find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                    //取消全部打钩的节点
                    pointerObj.checkNode(treeNode,true,true);


                }

            }
        };

        pointerObj = $.fn.zTree.init(treeId, setting, treeData);

    }

    //样式
    function changeCss(el){

        $('.table tbody').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

    }

    //绑定数据
    function bind(id){

        var prm = {

            districtId:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRDistrict/GetDRDistrictById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据
                    //区域名称
                    $('#district-name').val(result.district.name);

                    //级别
                    $('#level').val(result.district.level);

                    //父级区域
                    //首先获取树
                    districtZtreeS = $.fn.zTree.getZTreeObj("ztreeStationS");

                    if(result.district.pId != 0){

                        //获取到的id
                        var node = districtZtreeS.getNodeByParam("id",result.district.pId);

                        districtZtreeS.checkNode(node);

                        districtZtreeS.selectNode(node);

                    }

                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据！', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误！', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误！', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在！', '');

                }

            }

        })


    }

    return {
        init: function () {

            conditionSelect();

        }
    }

}();