$(function(){

    /*-----------------------------变量--------------------------------*/

    //保养vue
    var MTObj = new Vue({

        el:'#myApp33',

        data:{

            //保养编码
            bianma:'',

            //保养名称
            mingcheng:'',

            //设备分类
            sbfl:'',

            //工作内容
            gznr:'',

            //保养方式
            byfs:'',

            //备注
            beizhu:''

        }

    })

    //当前选中的保养编码
    var _thisBM = '';

    /*-----------------------------表格初始化---------------------------*/

    var mainCol = [

        {
            title:'条目编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'条目名称',
            data:'ditName',
            className:'mingcheng'
        },
        {
            title:'设备分类',
            data:'dcName',
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
            data:'remark',
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }

    ];

    //导出列
    var excelArr = [0,1,2,3,4,5]

    _tableInit($('#scrap-datatables'),mainCol,1,true,'','','',excelArr);

    //获取设备类型
    getDevType();

    /*-----------------------------按钮事件-----------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【新增】
    $('.creatButton').click(function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');

        //类
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可操作(可操作)；
        editOption();
    })

    //【查看】
    $('#scrap-datatables tbody').on('click','.option-see',function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#myModal'), '查看', true, '' ,'', '');

        //绑定数据
        bindData($(this));

        //不可编辑
        disEditOption();

    })

    //【编辑】
    $('#scrap-datatables tbody').on('click','.option-edite',function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#myModal'), '编辑', false, '' ,'', '保存');

        //绑定数据
        bindData($(this));

        //不可编辑
        editOption();

        //类
        $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

    })

    //【删除】
    $('#scrap-datatables tbody').on('click','.option-delete',function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#myModal'), '确定要删除吗？', false, '' ,'', '删除');

        //绑定数据
        bindData($(this));

        //不可编辑
        disEditOption();

        //类
        $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

    })

    //登记【确定】
    $('#myModal').on('click','.dengji',function(){

        sendOption('YWDevMT/ywDMAddDIItem','添加成功！','添加失败！')

    })

    //编辑【确定】
    $('#myModal').on('click','.bianji',function(){

        sendOption('YWDevMT/ywDMUptDIItem','编辑成功！','编辑失败！')

    })

    //删除【确定】
    $('#myModal').on('click','.shanchu',function(){

        sendOption('YWDevMT/ywDMDelDIItem','删除成功！','删除失败！')

    })

    /*----------------------------其他方法-------------------------------*/

    //获取设备类型
    function getDevType(){

        var prm = {

            userID:_userIdNum,

            userName:_userIdName
        }

        $.ajax({

            type:'post',

            url:_urls+'YWDev/ywDMGetDCs',

            data:prm,

            success:function(result){

                //将数组赋值到下拉框(条件选择)；
                var str = '<option value="">全部</option>';

                var strModal = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].dcNum + '">' + result[i].dcName + '</option>'

                    strModal += '<option value="' + result[i].dcNum + '">' + result[i].dcName + '</option>'

                }

                //条件选择下拉框
                $('#shebeileixing').empty().append(str);

                //模态框
                $('#sblx').empty().append(strModal);

                //默认数据
                conditionSelect();
            },

            error:_errorFun1

        })

    }

    //条件查询
    function conditionSelect(){

        $('#theLoading').modal('show');

        var prm = {
            //设备类型
            dcNum:$('#shebeileixing').val(),
            //保养步骤名称
            ditName:$('.filterInput').val(),
            //用户id
            userID:_userIdName
        }

        $.ajax({

                //发送方式
                type:'post',

                //url
                url:_urls + 'YWDevMT/YWDMGetDMItems',

                //timeout
                timeout:_theTimes,

                //参数
                data:prm,

                //成功
                success:function(result){

                    $('#theLoading').modal('hide');

                    //赋值
                    _jumpNow($('#scrap-datatables'),result);

                },

                //失败
                error: _errorFun

        })

    }

    //模态框初始化
    function modalInit(){

        //保养编码
        MTObj.bianma = '';

        //保养名称
        MTObj.mingcheng = '';

        //设备分类
        MTObj.sbfl = '';

        //工作内容
        MTObj.gznr = '';

        //保养方式
        MTObj.byfs = '';

        //备注
        MTObj.beizhu = '';

    }

    //可编辑
    function editOption(){

        //input控件全可操作

        $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#myApp33').find('textarea').attr('disabled',false).removeClass('disabled-block');

        //保养编码永远不可操作
        $('.bmStep').attr('disabled',true).addClass('disabled-block');

    }

    //不可编辑
    function disEditOption(){

        //input控件全可操作

        $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');
    }

    //给模态框绑定数据
    function bindData(el){

        //样式
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

        //获取当前选中的编码
        _thisBM = el.parents('tr').find('.bianma').html();

        //loadding
        $('#theLoading').modal('show');

        var prm = {

            //保养编码
            ditNum:_thisBM,

            //用户id
            userID:_userIdNum

        };

        $.ajax({

            //发送方式
            type:'post',

            //url
            url:_urls + 'YWDevMT/YWDMGetDMItems',

            //timeout
            timeout:_theTimes,

            //参数
            data:prm,

            //成功
            success:function(result){

                $('#theLoading').modal('hide');

                if(result != ''){

                    //赋值
                    //保养编码
                    MTObj.bianma = result[0].ditNum;

                    //保养名称
                    MTObj.mingcheng = result[0].ditName;

                    //设备分类
                    MTObj.sbfl = result[0].dcNum;

                    //工作内容
                    MTObj.gznr = result[0].desc;

                    //保养方式
                    MTObj.byfs = result[0].mtContent;

                    //备注
                    MTObj.beizhu = result[0].remark;

                }

            },

            //失败
            error: _errorFun

        })

    }

    //操作发送数据
    function sendOption(url,successMeg,errorMeg){

        //非空验证
        if(MTObj.mingcheng == '' || MTObj.sbfl == ''){

            _moTaiKuang($('#tip-Modal'),'提示',true,'istap','请填写红色必填项！','');

        }else{

            var prm = {

                //保养编码
                ditNum:MTObj.bianma,

                //保养名称
                ditName:MTObj.mingcheng,

                //设备分类(编码)
                dcNum:MTObj.sbfl,

                //设备分类（名称）
                dcName:$('#sblx').children('option:selected').html(),

                //工作内容
                description:MTObj.gznr,

                //保养方式
                mtContent:MTObj.byfs,

                //备注
                remark:MTObj.beizhu,

                //用户id
                userID:_userIdNum

            }

            $.ajax({

                type:'post',

                url:_urls + url,

                data:prm,

                timeOut:_theTimes,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result == 99){

                        _moTaiKuang($('#tip-Modal'),'提示',true,'istap',successMeg,'');

                        setTimeout(function(){

                            conditionSelect();

                            $('#myModal').modal('hide');


                        },600);


                    }else{

                        _moTaiKuang($('#tip-Modal'),'提示',true,'istap',errorMeg,'');

                    }

                },

                error:_errorFun

            })

        }

    }

})