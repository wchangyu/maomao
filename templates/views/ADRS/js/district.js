﻿var District = function () {

    //树（小）
    var districtZtreeS;

    //记录当前选中的数据id
    var _thisID = '';

    /*------------------------------------------表格初始化----------------------------*/

    var col = [

        {
            title:'区域编码',
            data:'id'
        },
        {
            title:'区域名称',
            data:'name'
        },
        {
            title:'父级',
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
        },
        {
            title:'编辑操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                return  "<span class='option-button option-edit' data-userId='" + full.id + "'>编辑</span>"

            }
        }

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

            //登录账户名
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
        _moTaiKuang($('#create-Modal'),'创建区域','',false,false,'创建');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //loadding
        $('#theLoading').modal('hide');

    })

    //创建账户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRDistrict/CreateDRDistrictInfo','创建成功');

        })
    })

    //【编辑】
    $('#table tbody').on('click','.option-edit',function(){

        $('#theLoading').modal('show');

        //样式
        changeCss($(this));

        //初始化
        createInit();

        //获取当前的账户id
        _thisID = $(this).attr('data-userid');

        //模态框
        _moTaiKuang($('#create-Modal'), '编辑区域', false, '' ,'', '保存');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //是否可操作
        //账户登录名不能操作
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

            sendOption('DRDistrict/ModifyDRDistrictInfo','编辑成功',true);

        })

    })

    /*-------------------------------------------其他方法-----------------------------*/

    //获取所有产品
    function conditionSelect(){

        $('#theLoading').modal('show');

        var prm = {

            keyword:$('#keyWord').val(),
            //登录者
            loginSysuserRole:sessionStorage.ADRS_UserRole

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRDistrict/GetDRDistrictDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                $('#tip').hide();

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                    var arr = [];

                    var arr1 = [];


                if(result.code == -2){

                    _topTipBar('暂时没有区域数据');

                }else if(result.code == -1){

                    _topTipBar('异常错误');

                }else if(result.code == -3){

                    _topTipBar('异常错误');

                }else if(result.code == -4){

                    _topTipBar('内容已存在');

                }else if(result.code == -6){

                    _topTipBar('抱歉，您没有获取区域数据的权限');

                }else if(result.code == 0){


                    for(var i=0;i<result.dists.reverse().length;i++){

                        var data = result.dists.reverse()[i];

                        var obj = {};

                        obj.id = data.id;

                        obj.name = data.name;

                        obj.pId = data.pId;

                        obj.open = true;

                        obj.level = data.level;

                        if(obj.level == 1){

                            //省级

                            obj.nocheck = false;

                        }else{

                            //市级
                            obj.nocheck = true;

                        }

                        arr.push(obj);

                    }

                    for(var i=0;i<result.dists.reverse().length;i++){

                        var data = result.dists.reverse()[i];

                        var obj = {};

                        obj.id = data.id;

                        obj.name = data.name;

                        obj.pId = data.pId;

                        obj.open = true;

                        obj.level = data.level;

                        obj.nocheck = true;

                        arr1.push(obj);

                    }

                }

                //表格
                _jumpNow($('#table'),arr);

                if(arr1.length == 0){

                    //没有您想要的结果
                    $('#ztreeStation').html('暂时没有区域数据');

                }else{

                    $('#ztreeStation').empty();

                    setZtree($("#ztreeStation"),arr1);


                }

                if(arr.length == 0){

                    $('#ztreeStationS').html('暂时没有区域数据');

                }else{

                    //ztree(小)
                    $('#ztreeStationS').empty();

                    setZtree($("#ztreeStationS"),arr);

                }



            },

            error:_errorBar

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

    //创建账户(flag代表是否传id)
    function sendOption(url,seccessMeg,flag){

        //获取勾选的id
        var parentId = 0;

        districtZtreeS = $.fn.zTree.getZTreeObj("ztreeStationS");

        if(districtZtreeS){

            var parentArr = districtZtreeS.getCheckedNodes(true);

            if(parentArr.length != 0){

                parentId = parentArr[0].id;

            }

        }

        var prm = {

            //区域名称
            name:$('#district-name').val(),
            //账户角色
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

                if(result.code == 0){

                    //模态框消失
                    $('#create-Modal').modal('hide');

                    $('#create-Modal').one('hidden.bs.modal',function(){

                        conditionSelect();

                    })


                }else if(result.code == -2){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

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

        //验证消息要隐藏
        var error = $('#create-Modal').find('.error');

        for(var i=0;i<error.length;i++){

            if(error[i].nodeName == 'LABEL'){

                error.eq(i).hide();

            }else{

                error.eq(i).removeClass('error');

            }

        }

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
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    treeObj.checkNode(treeNode,!treeNode.checked,true);

                    //如果选中，则级别是市，且不可操作

                    var length = treeObj.getCheckedNodes(true).length;

                    if(length>0){

                        $('#level').attr('disabled',true);

                        //默认选中市
                        $('#level').val(2);

                    }else{

                        $('#level').attr('disabled',true);

                        //默认选中省
                        $('#level').val(1);

                    }



                },

                beforeClick:function(){

                    treeId.find('.curSelectedNode').removeClass('curSelectedNode');

                },

                onCheck:function(e,treeId,treeNode){

                    var treeObj = $.fn.zTree.getZTreeObj(treeId);

                    //取消全部打钩的节点
                    treeObj.checkNode(treeNode,true,true);

                    //如果选中，则级别是市，且不可操作

                    var length = treeObj.getCheckedNodes(true).length;

                    if(length>0){

                        $('#level').attr('disabled',true);

                        //默认选中市
                        $('#level').val(2);

                    }else{

                        $('#level').attr('disabled',true);

                        //默认选中省
                        $('#level').val(1);

                    }


                }

            }
        };

        pointerObj = $.fn.zTree.init(treeId, setting, treeData);

        //var node = pointerObj.getNodesByFilter(function (node) { return node.level == 0 }, true);
        //
        ////获取根节点
        //pointerObj.expandNode(node, true, false, false);

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

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'暂无数据', '');

                }else if(result.code == -1){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'异常错误', '');

                }else if(result.code == -3){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'参数错误', '');

                }else if(result.code == -4){

                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'内容已存在', '');

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