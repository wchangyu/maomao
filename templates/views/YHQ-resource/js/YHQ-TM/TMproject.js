$(function(){

    /*-----------------------------默认加载---------------------------------*/

    //暂存所有条件查询的数据
    var _allData = [];

    var _isExist = '';

    //当前操作的id
    var _thisId = '';

    //获取项目类别
    _TMcategory($('#TM-categoryCon'),true);

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //项目名称
            'TM-projectName':{

                required: true,

                isExist:_isExist

            },
            //项目类型
            'MT-category':{

                required: true

            },
            //工时时间
            'TM-timeConsuming':{

                number:true,

                required:true,

                min:0.1

            },
            //工时费用
            'TM-fee':{

                number:true,

                required:true,

                min:0.1

            }

        },
        messages:{

            //项目名称
            'TM-projectName':{

                required: '项目名称为必填字段'

            },
            //项目类型
            'MT-category':{

                required: '项目类型为必选字段'

            },
            //工时时间
            'TM-timeConsuming':{

                number:'工时时间为数字格式',

                required:'工时时间为必填字段',

                min:'格式为大于0的数字'

            },
            //工时费用
            'TM-fee':{

                number:'工时费用为数字格式',

                required:'工时费用为必填字段',

                min:'格式为大于0的数字'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //项目名称
                'TM-projectName':{

                    required: true,

                    isExist:_isExist

                },
                //项目类型
                'MT-category':{

                    required: true

                },
                //工时时间
                'TM-timeConsuming':{

                    number:true,

                    required:true,

                    min:0.1

                },
                //工时费用
                'TM-fee':{

                    number:true,

                    required:true,

                    min:0.1

                }

            },
            messages:{

                //项目名称
                'TM-projectName':{

                    required: '项目名称为必填字段'

                },
                //项目类型
                'MT-category':{

                    required: '项目类型为必选字段'

                },
                //工时时间
                'TM-timeConsuming':{

                    number:'工时时间为数字格式',

                    required:'工时时间为必填字段',

                    min:'格式为大于0的数字'

                },
                //工时费用
                'TM-fee':{

                    number:'工时费用为数字格式',

                    required:'工时费用为必填字段',

                    min:'格式为大于0的数字'

                }
            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].tmname == value && _allData[i].tmname!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"项目名称已存在");

    /*-----------------------------表格初始化--------------------------------*/

    var col=[

        {
            title:'项目编码',
            data:'tmnum'
        },
        {
            title:'项目名称',
            data:'tmname'
        },
        {
            title:'项目类别',
            data:'tmclassname'
        },
        {
            title:'工时时间',
            data:'workhour'
        },
        {
            title:'工时费用',
            data:'workfee'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '';

                str += '<span class="option-button option-see option-in" data-attr="' + full.id + '">' + '查看</span>' +

                    '<span class="option-button option-edit option-in" data-attr="' + full.id + '">' + '编辑</span>' +

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

            sendData('YHQTM/ywGDWxxmCreate',$('#create-Modal').children(),false,function(result){

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

        $('.L-condition').eq(0).find('select').val('');

        $('.L-condition').eq(0).find('input').val('');

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

            sendData('YHQTM/TmxmUpdate',$('#create-Modal').children(),true,function(result){

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

        sendData('YHQTM/ywGDWxxmDelete',$('#create-Modal').children(),true,function(result){

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

            //项目名称
            tmname:$('#MT-projectNameCon').val(),
            //项目编号
            tmnum:$('#MT-projectNumCon').val(),
            //项目类型
            tmclassname:$('#TM-categoryCon').children('option:selected').html() == '全部'?'':$('#TM-categoryCon').children('option:selected').html(),
            //用户ID
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_userBM
        }

        _mainAjaxFunCompleteNew('post','YHQTM/TmxmGetAll',prm,$('.L-container'),function(result){

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
            tmname:$('#TM-projectName').val(),
            //项目类型编号
            tmclassnum:$('#MT-category').val(),
            //项目类型名称
            tmclassname:$('#MT-category').children('option:selected').html(),
            //工时时间
            workhour:$('#TM-timeConsuming').val(),
            //工时费用
            workfee:$('#TM-fee').val(),
            //备注
            memo:$('#TM-remark').val()

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

                _isExist = data.tmname;

                //项目编码
                $('#TM-projectNum').val(data.tmnum);
                //项目名称
                $('#TM-projectName').val(data.tmname);
                //项目类型编号
                $('#MT-category').val(data.tmclassnum);
                //工时时间
                $('#TM-timeConsuming').val(data.workhour);
                //工时费用
                $('#TM-fee').val(data.workfee);
                //备注
                $('#TM-remark').val(data.memo);
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

    //获取项目类型
    function _TMcategory(){

        _mainAjaxFunCompleteNew('post','YHQTM/TmxmClassGetAll','',false,function(result){

            if(result.code == 99){

                var str = '<option value="">全部</option>';

                var str1 = '<option value="">请选择</option>';

                for(var i =0;i<result.data.length;i++){

                    var data = result.data[i];

                    str += '<option value="' + data.tmclassnum + '">' + data.tmclassname + '</option>';

                    str1 += '<option value="' + data.tmclassnum + '">' + data.tmclassname + '</option>';

                }

                $('#TM-categoryCon').empty().append(str);

                $('#MT-category').empty().append(str1);

            }

        })

    }


})