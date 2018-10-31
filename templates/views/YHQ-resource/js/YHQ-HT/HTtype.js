$(function(){

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    //合同名称去重
    var _isExist = '';

    //暂存当前操作的合同类型id
    var _thisId = '';

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //合同类型名称
            'HT-name':{

                required: true,

                isExist:_isExist

            },
            //顺序
            'HT-order':{

                required: true,

                number:true,

                min:1

            }
        },
        messages:{

            //合同类型名称
            'HT-name':{

                required: '合同类型是必填字段'

            },
            //顺序
            'HT-order':{

                required: '顺序是必填字段',

                number:'顺序为大于0的整数',

                min:'顺序为大于0的整数'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //合同类型名称
                'HT-name':{

                    required: true,

                    isExist:_isExist

                },
                //顺序
                'HT-order':{

                    required: true,

                    number:true,

                    min:1

                }
            },
            messages:{

                //合同类型名称
                'HT-name':{

                    required: '合同类型是必填字段'

                },
                //顺序
                'HT-order':{

                    required: '顺序是必填字段',

                    number:true,

                    min:1

                }
            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].catename == value && _allData[i].catename!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"合同名称已存在");

    /*-----------------------------表格初始化--------------------------------*/

    var col = [

        {
            title:'合同类型',
            data:'catename'
        },
        {
            title:'顺序',
            data:'orders'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                return  '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    //默认加载数据
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

            sendData('YHQHT/HTCateAdd',$('#create-Modal').children(),false,function(result){

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

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        _thisId = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //赋值
        bindData(_thisId);

        _isExist = $('#HT-name').val();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQHT/HTCateEdit',$('#create-Modal').children(),true,function(result){

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

        sendData('YHQHT/WasteTypeDelete',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');


        })

    })

    /*-----------------------------其他方法----------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            //合同类型名称
            catename:$('#HT-nameCon').val(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQHT/GetHTCates',prm,$('.L-container'),function(result){

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
    function sendData(url,el,flag,successFun){

        var prm = {

            //合同类型名称
            catename:$('#HT-name').val(),
            //顺序
            order:$('#HT-order').val(),
            //备注
            memo:$('#HT-remark').val(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM

        }

        if(flag){

            prm.id = _thisId;

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

                //合同类型名称
                $('#HT-name').val(data.catename);
                //顺序
                $('#HT-order').val(data.orders);
                //备注
                $('#HT-remark').val(data.memo);

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