$(function(){

    /*-----------------------------变量--------------------------*/

    var _allData = [];

    //科室
    MWDopFun();

    //当前选中的医废id
    var _thisId = '';

    /*----------------------------表格初始化---------------------*/

    var mainCol = [

        {
            title:'名称',
            data:'wsname'
        },
        {
            title:'顺序',
            data:'orders'
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

    /*---------------------------------表格验证----------------------------------*/

    $('#commentForm').validate({

        rules:{

            //名称
            'MW-source-name':{

                required:true

            },

            //顺序
            'MW-source-order':{

                number:true,
                //整数
                digits:true,

                min:0

            }
        },
        messages:{

            //名称
            'MW-source-name':{

                required:'名称是必填项'

            },

            //顺序
            'MW-source-order':{

                number:'顺序需是数字',

                digits:'需是大于0的整数'

            },

        }

    });

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

        formatValidateUser(function(){

            sendOption('MW/WasteSrcAdd');

        })

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

        formatValidateUser(function(){

            sendOption('MW/WasteSrcUpdate',_thisId);

        })

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

        sendOption('MW/WasteSrcDelete',_thisId);

    })

    /*------------------------------其他方法--------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {


        }

        _mainAjaxFunCompleteNew('post','MW/GetWasteSrcList',prm,$('.content-top'),function(result){

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

                //赋值
                //名称
                $('#MW-source-name').val(current.wsname);
                //权重
                $('#MW-source-order').val(current.orders);
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

        //验证
        if($('#MW-balance-name').val() == ''){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

            return false;

        }

        var prm = {

            //名称
            wsname:$('#MW-source-name').val(),
            //权重
            orders :$('#MW-source-order').val()
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

    //验证
    function formatValidateUser(fun){

        //非空验证
        if($('#MW-source-name').val() == '' ){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写必填项','');

        }else{

            //验证错误
            var error = $('#commentForm').find('.error');

            if(error.length != 0){

                var flag = true;

                for(var i=0;i<error.length;i++){

                    if(error.eq(i).css('display') != 'none'){

                        flag = false;

                        break;

                    }

                }

                if(flag){

                    fun();

                }else{

                    _moTaiKuang($('#tip-Modal'),'提示',true,true,'请填写正确格式','');

                }

            }else{

                //验证通过
                fun();

            }


        }

    }

})