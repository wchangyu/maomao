$(function(){

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    var _isExist = '';

    //当前操作的id
    var _thisId = '';

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //合同客户名称
            'HT-name':{

                required: true,

                isExist:_isExist,

                maxlength:20

            },
            //联系人
            'HT-linkperson':{

                required: true,

                maxlength:50

            },
            //电话
            'HT-tel':{

                required: true,

                phoneNumFormat:true,

                maxlength:50

            },
            //手机
            'HT-mobile':{

                required: true,

                phoneNumFormat:true

            },
            //传真
            'HT-fax':{

                required: true,

                maxlength:50

            },
            //邮箱
            'HT-email':{

                required: true,

                email:true,

                maxlength:50

            },
            //发票名称
            'HT-invoice':{

                required: true,

                maxlength:20

            },
            //纳税人
            'HT-invoicet':{

                required: true,

                maxlength:50

            },
            //地址
            'HT-location':{

                required: true,

                maxlength:100

            },


        },
        messages:{

            //合同客户名称
            'HT-name':{

                required: '合同客户名称为必填字段',

                isExist:'合同客户名称已存在',

                maxlength:20

            },
            //联系人
            'HT-linkperson':{

                required: '联系人为必填字段',

                maxlength:50

            },
            //电话
            'HT-tel':{

                required: '电话为必填字段',

                maxlength:50

            },
            //手机
            'HT-mobile':{

                required: '手机为必填字段',

            },
            //传真
            'HT-fax':{

                required: '传真为必填字段',

                maxlength:50

            },
            //邮箱
            'HT-email':{

                required: '邮箱为必填字段',

                maxlength:50

            },
            //发票名称
            'HT-invoice':{

                required: '发票为必填字段',

                maxlength:20

            },
            //纳税人
            'HT-invoicet':{

                required: '纳税人为必填字段',

                maxlength:50

            },
            //地址
            'HT-location':{

                required: '地址为必填字段',

                maxlength:100

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //合同客户名称
                'HT-name':{

                    required: true,

                    isExist:_isExist,

                    maxlength:20

                },
                //联系人
                'HT-linkperson':{

                    required: true,

                    maxlength:50

                },
                //电话
                'HT-tel':{

                    required: true,

                    phoneNumFormat:true,

                    maxlength:50

                },
                //手机
                'HT-mobile':{

                    required: true,

                    phoneNumFormat:true

                },
                //传真
                'HT-fax':{

                    required: true,

                    maxlength:50

                },
                //邮箱
                'HT-email':{

                    required: true,

                    email:true,

                    maxlength:50

                },
                //发票名称
                'HT-invoice':{

                    required: true,

                    maxlength:20

                },
                //纳税人
                'HT-invoicet':{

                    required: true,

                    maxlength:50

                },
                //地址
                'HT-location':{

                    required: true,

                    maxlength:100

                },


            },
            messages:{

                //合同客户名称
                'HT-name':{

                    required: '合同客户名称为必填字段',

                    isExist:'合同客户名称已存在',

                    maxlength:20

                },
                //联系人
                'HT-linkperson':{

                    required: '联系人为必填字段',

                    maxlength:50

                },
                //电话
                'HT-tel':{

                    required: '电话为必填字段',

                    phoneNumFormat:true,

                    maxlength:50

                },
                //手机
                'HT-mobile':{

                    required: '手机为必填字段',

                    phoneNumFormat:true

                },
                //传真
                'HT-fax':{

                    required: '传真为必填字段',

                    maxlength:50

                },
                //邮箱
                'HT-email':{

                    required: '邮箱为必填字段',

                    email:true,

                    maxlength:50

                },
                //发票名称
                'HT-invoice':{

                    required: '发票为必填字段',

                    maxlength:20

                },
                //纳税人
                'HT-invoicet':{

                    required: '纳税人为必填字段',

                    maxlength:50

                },
                //地址
                'HT-location':{

                    required: '地址为必填字段',

                    maxlength:100

                }
            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].clientname == value && _allData[i].clientname!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"合同名称已存在");

    /*-----------------------------表格初始化--------------------------------*/

    var col = [

        {
            title:'合同客户',
            data:'clientname'
        },
        {
            title:'联系人',
            data:'linkperson',
        },
        {
            title:'电话',
            data:'phone'
        },
        {
            title:'手机',
            data:'mobile'
        },
        {
            title:'传真',
            data:'fax'
        },
        {
            title:'邮箱',
            data:'email'
        },
        {
            title:'发票名称',
            data:'invoicename'
        },
        {
            title:'纳税人',
            data:'invoicetnum'
        },
        {
            title:'地址',
            data:'address'
        },
        {
            title:'备注',
            data:'description'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                return '<span class="option-button option-see option-in" data-attr="' + full.id + '">' + '查看</span>' +

                '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

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

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQHT/AddHTClient',$('#create-Modal').children(),false,function(result){

                console.log(result);

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

        $('#HT-nameCon').val('');

    })

    //查看
    $('#table tbody').on('click','.option-see',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'查看详情',true,'','','保存');

        //赋值
        bindData(_thisId);

        //不可操作
        disAbledOption();

    })

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //赋值
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQHT/UpdateHTClient',$('#create-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect();

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


            })

        }

    })

    //删除
    $('#table tbody').on('click','.option-del',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗','','','','删除');

        //赋值
        bindData(_thisId);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //可操作
        disAbledOption();

    })

    //删除确定按钮
    $('#create-Modal').on('click','.shanchu',true,function(){

        sendData('YHQHT/DelHTClient',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        },true)

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //合同名称
            clientname:$('#HT-nameCon').val()

        };

        _mainAjaxFunCompleteNew('post','YHQHT/GetAllHTClient',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _datasTable($('#table'),result.data);

            }

        })


    }

    //初始化
    function createModeInit(){

        //时间验证占位dom隐藏
        $('.time-seat').hide();

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

        $('#create-Modal').find('textarea').val('');

        //将所有label .error验证隐藏
        var label = $('#create-Modal').find('label');

        for(var i=0;i<label.length;i++){

            var attr = $(label).eq(i).attr('class')

            if(attr){

                if(attr.indexOf('error')>-1){

                    label.eq(i).hide();

                }

            }

        }

    }

    //发送数据
    function sendData(url,el,flag,successFun,flag1){

        var prm = {

            //供应商名称
            clientname:$('#HT-name').val(),
            //联系人
            linkperson:$('#HT-linkperson').val(),
            //电话
            phone:$('#HT-tel').val(),
            //传真
            fax:$('#HT-fax').val(),
            //手机
            mobile:$('#HT-mobile').val(),
            //邮件
            email:$('#HT-email').val(),
            //发票名称
            invoicename:$('#HT-invoice').val(),
            //纳税人
            invoicetnum:$('#HT-invoicet').val(),
            //供应商地址
            address:$('#HT-location').val(),
            //备注
            description:$('#HT-remark').val()

        }

        if(flag){

            prm.id = _thisId;

        }

        if(flag1){


            prm = {

                id:_thisId,

                userid:_userIdNum

            }

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

                _isExist = data.clientname;

                //合同客户名称
                $('#HT-name').val(data.clientname);
                //联系人
                $('#HT-linkperson').val(data.linkperson);
                //电话
                $('#HT-tel').val(data.phone);
                //手机
                $('#HT-mobile').val(data.mobile);
                //传真
                $('#HT-fax').val(data.fax);
                //邮箱
                $('#HT-email').val(data.email);
                //发票名称
                $('#HT-invoice').val(data.invoicename);
                //纳税人
                $('#HT-invoicet').val(data.invoicetnum);
                //地址
                $('#HT-location').val(data.address);
                //备注
                $('#HT-remark').val(data.description);
            }

        }

    }

    //可以操作
    function abledOption(){

        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);
    }

    //不可以操作
    function disAbledOption(){

        $('#create-Modal').find('input').attr('disabled',true);

        $('#create-Modal').find('select').attr('disabled',true);

        $('#create-Modal').find('textarea').attr('disabled',true);

    }


})