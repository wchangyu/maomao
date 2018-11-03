$(function(){

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    var _isExist = '';

    var _thisid = '';

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //项目名称
            'HT-project-name':{

                required: true,

                isExist:_isExist

            },
            //电话
            'HT-project-tel':{

                phoneNumFormat:true

            },
            //负责人
            'HT-project-person':{

                required:true

            }
        },
        messages:{

            //合同客户名称
            'HT-name':{

                required: '合同客户名称为必填字段'

            },
            //负责人
            'HT-project-person':{

                required:'负责人为必填字段'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //项目名称
                'HT-project-name':{

                    required: true,

                    isExist:_isExist

                },
                //电话
                'HT-project-tel':{

                    phoneNumFormat:true

                },
                //负责人
                'HT-project-person':{

                    required:true

                }
            },
            messages:{

                //合同客户名称
                'HT-name':{

                    required: '合同客户名称为必填字段'

                },
                //负责人
                'HT-project-person':{

                    required:'负责人为必填字段'

                }
            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].projectName == value && _allData[i].projectName!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"项目名称已存在");

    /*-----------------------------表格初始化--------------------------------*/

    var col=[

        {
            title:'项目名称',
            data:'projectName'
        },
        {
            title:'负责人',
            data:'linkPerson'
        },
        {
            title:'联系电话',
            data:'phone'
        },
        {
            title:'项目信息',
            data:'projectInfo'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                str += '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '">' + '删除</span>'

                return str


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

            sendData('YHQHT/HTProjectAdd',$('#create-Modal').children(),false,function(result){

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

        _thisid = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //赋值
        bindData(_thisid);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQHT/HTProjectUpdate',$('#create-Modal').children(),true,function(result){

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

        _thisid = $(this).attr('data-attr');

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗','','','','删除');

        //赋值
        bindData(_thisid);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //可操作
        disAbledOption();

    })

    //删除确定按钮
    $('#create-Modal').on('click','.shanchu',true,function(){

        sendData('YHQHT/HTProjectDelete',$('#create-Modal').children(),true,function(result){

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

            //所属项目名称
            projectName:$('#HT-projectCon').val()
            ////用户ID
            //userID:_userIdNum,
            ////用户名
            //userName:_userIdName,
            ////用户角色
            //b_UserRole:_userRole,
            ////用户部门
            //b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQHT/ReturnHTProjectList',prm,$('.L-container'),function(result){

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

            //项目名称
            projectName:$('#HT-project-name').val(),
            //负责人
            linkPerson:$('#HT-project-person').val(),
            //联系电话
            phone:$('#HT-project-tel').val(),
            //项目信息
            projectInfo:$('#HT-project-info').val(),
            //备注
            remark:$('#HT-remark').val()

        }

        if(flag){

            prm.id = _thisid;

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun)

    }

    //绑定赋值
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

                _isExist = data.projectName;

                //项目名称
               $('#HT-project-name').val(data.projectName);
                //负责人
                $('#HT-project-person').val(data.linkPerson);
                //联系电话
                $('#HT-project-tel').val(data.phone);
                //项目信息
                $('#HT-project-info').val(data.projectInfo);
                //备注
                $('#HT-remark').val(data.remark);

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