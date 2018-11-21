$(function(){

    /*-----------------------------变量--------------------------*/

    var _allData = [];

    //科室
    MWDopFun();

    //当前选中的医废id
    var _thisId = '';

    var _isExist = '';

    /*-----------------------------验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //电子称名称
            'MW-balance-name':{

                required: true,

                isExist:_isExist

            }


        },
        messages:{

            //电子称名称
            'MW-balance-name':{

                required: '称名称是必填字段'

            }
        }

    });

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{

                //电子称名称
                'MW-balance-name':{

                    required: true,

                    isExist:_isExist

                }


            },
            messages:{

                //电子称名称
                'MW-balance-name':{

                    required: '称名称是必填字段'

                }
            }

        });

    }

    //验证合同名称是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].scalename == value && _allData[i].scalename!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"称名称已存在");

    /*----------------------------表格初始化---------------------*/

    var mainCol = [

        {
            title:'名称',
            data:'scalename'
        },
        {
            title:'所在位置',
            data:'scaleloc'
        },
        {
            title:'所属科室',
            data:'keshiname'
        },
        {
            title:'规格型号',
            data:'scaleinfo'
        },
        {
            title:'描述',
            data:'remark'
        },
        {
            title:'操作',
            data:null,
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit" data-attr="' + full.id + '">' + '编辑</span>' +

                    '<span class="option-button option-del" data-attr="' + full.id + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),mainCol,'2','','','','','');

    conditionSelect();

    /*------------------------------按钮事件--------------------*/

    //【新增】
    $('#createBtn').click(function(){

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','保存');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //可操作
        abledOption();

    })

    //【登记】确定
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendOption('MW/mwScaleAdd');

        }

    })


    //【编辑】
    $('#table tbody').on('click','.option-edit',function(){

        var num = $(this).attr('data-attr');

        _thisId = num;

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');

        //赋值
        BindData(num);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

    })

    //【编辑】确定
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendOption('MW/mwScaleUpdate',_thisId);

        }

    })

    //【删除】
    $('#table tbody').on('click','.option-del',function(){

        var num = $(this).attr('data-attr');

        _thisId = num;

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗？','','','','删除');

        //赋值
        BindData(num);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //不可操作
        disAbledOption();

    })

    //【编辑】确定
    $('#create-Modal').on('click','.shanchu',function(){

        sendOption('MW/mwScaleDelete',_thisId);

    })

    /*------------------------------其他方法--------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {


        }

        _mainAjaxFunCompleteNew('post','MW/GetmwScaleList',prm,$('.content-top'),function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

                _allData = result.data;

            }

            _jumpNow($('#table'),arr);


        })

    }

    //初始化
    function modalInit(){

        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val('');

    }

    //绑定数据
    function BindData(id){

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].id == id){

                var current = _allData[i];

                _isExist = current.scalename;

                //赋值
                //名称
                $('#MW-balance-name').val(current.scalename);
                //位置
                $('#MW-location').val(current.scaleloc);
                //规格型号
                $('#MW-size').val(current.scaleinfo);
                //所属科室
                $('#MW-dep').val(current.keshinum);
                //描述
                $('#MW-remark').val(current.remark);
            }

        }

    }

    //科室
    function MWDopFun(){

        var prm = {

            'userID':_userIdNum,

            'userName':_userIdName

        }

        _mainAjaxFunCompleteNew('post','RBAC/rbacGetDeparts',prm,false,function(result){

            if(result){

                var str = '<option value="">请选择</option>'

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].departNum + '">' + result[i].departName + '</option>'
                }

                $('#MW-dep').empty().append(str);

            }


        })


    }

    //操作
    function sendOption(url,flag){

        var prm = {

            //名称
            scalename:$('#MW-balance-name').val(),
            //电子秤位置
            scaleloc:$('#MW-location').val(),
            //规格型号
            scaleinfo:$('#MW-size').val(),
            //所属班组
            keshinum:$('#MW-dep').val(),
            //所属班组
            keshiname:$('#MW-dep').val()==''?'':$('#MW-dep').children('option:selected').html(),
            //描述
            remark:$('#MW-remark').val()
        }

        if(flag){

            prm.id = flag;

        }

        _mainAjaxFunCompleteNew('post',url,prm,$('#create-Modal').find('.modal-dialog'),function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect();

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    }

    //可操作
    function abledOption(){

        $('#create-Modal').find('input').attr('readOnly',false);

        $('#create-Modal').find('select').attr('disabled',false);

    }

    //不可操作
    function disAbledOption(){

        $('#create-Modal').find('input').attr('readOnly',true);

        $('#create-Modal').find('select').attr('disabled',true);

    }

})