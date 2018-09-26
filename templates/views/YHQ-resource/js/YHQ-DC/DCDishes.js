$(function(){

    /*---------------------------------------变量-----------------------------------------*/

    //存放所有数据
    var _allData = [];

    //当前的餐厅id
    var _thisId = '';

    var _isExist = '';

    /*----------------------------------------验证-----------------------------------------*/

    //输入验证
    $('#commentForm').validate({

        rules:{
            //菜品编码
            'DC-num':{

                required: true,

                isExist:_isExist

            },
            //菜品名称
            'DC-name':{

                required: true

            }

        },
        messages:{

            //餐厅名称
            'DC-num':{

                required: '请输入分类编码'

            },
            //地址
            'DC-name':{

                required: '请输入分类名称'

            }
        }

    });

    //验证编码是否存在
    $.validator.addMethod("isExist",function(value,element,params){

        var flag = true;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].lxbm == value && _allData[i].lxbm!= _isExist){

                flag = false;

                break;

            }

        }

        return flag;

    },"编码已存在");

    //点击按钮验证
    function validform(){

        return $('#commentForm').validate({

            rules:{
                //菜品编码
                'DC-num':{

                    required: true,

                    isExist:_isExist

                },
                //菜品名称
                'DC-name':{

                    required: true

                }

            },
            messages:{

                //餐厅名称
                'DC-num':{

                    required: '请输入分类编码'

                },
                //地址
                'DC-name':{

                    required: '请输入分类名称'

                }
            }


        });

    }


    /*------------------------------------------表格初始化---------------------------------*/

    var col = [

        {
            title:'菜品分类编码',
            data:'lxbm'
        },
        {
            title:'菜品分类名称',
            data:'lxname'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                return '<span class="option-button option-edit option-in" data-attr="' + full.id + '" data-bm="' + full.lxbm + '">' + '编辑</span>' +

                    '<span class="option-button option-del option-in" data-attr="' + full.id + '" data-bm="' + full.lxbm + '">' + '删除</span>'


            }

        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    conditionSelect();

    /*----------------------------------------按钮事件-------------------------------------*/

    //新增
    $('#createBtn').click(function(){

        //loadding
        $('.L-container').showLoading();

        //初始化
        createModeInit();

        //模态框
        _moTaiKuang($('#create-Modal'),'新增','','','','新增');

        $('.L-container').hideLoading();

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可操作
        abledOption();

    })

    //新增确定按钮
    $('#create-Modal').on('click','.dengji',function(){

        if(validform().form()){

            sendData('YHQDC/CookStyleAdd',$('#create-Modal').children(),false,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect()

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }

    })

    //查询
    $('#selectBtn').click(function(){

        conditionSelect();

    })

    //重置
    $('#resetBtn').click(function(){

        $('#DC-nameCon').val('');

    })

    //时间验证通过
    $('#create-Modal').find('.time-tool-block').on('keyup','input',function(){

        _timeShow($('#create-Modal'));

    })

    $('#create-Modal').on('click',function(){

        _timeShow($('#create-Modal'));

    })

    //编辑
    $('#table tbody').on('click','.option-edit',function(){

        //初始化
        createModeInit();
        //模态框
        _moTaiKuang($('#create-Modal'),'编辑','','','','保存');
        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
        //是否可操作
        abledOption();
        //绑定值
        _thisId = $(this).attr('data-attr');

        bindData(_thisId);

        _isExist = $(this).attr('data-bm');


    })

    //编辑确定按钮
    $('#create-Modal').on('click','.bianji',function(){

        if(validform().form()){

            sendData('YHQDC/CookStyleUpdate ',$('#create-Modal').children(),true,function(result){

                if(result.code == 99){

                    $('#create-Modal').modal('hide');

                    conditionSelect()

                }

                _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

            })

        }

    })

    //删除
    $('#table tbody').on('click','.option-del',function(){

        //初始化
        createModeInit();
        //模态框
        _moTaiKuang($('#create-Modal'),'确定要删除吗？','','','','删除');
        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');
        //是否可操作
        disAbledOption();
        //绑定值
        _thisId = $(this).attr('data-attr');

        bindData(_thisId);

    })

    //删除确定按钮
    $('#create-Modal').on('click','.shanchu',function(){

        sendData('YHQDC/CookStyleDelete',$('#create-Modal').children(),true,function(result){

            if(result.code == 99){

                $('#create-Modal').modal('hide');

                conditionSelect()

            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })

    })

    /*-----------------------------------其他方法------------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {

            lxbm:$('#DC-dishCon').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/RetrunCookStyleList',prm,$('.L-container'),function(result){

            if(result.code == 99){

                _allData = result.data;

                _jumpNow($('#table'),result.data);

            }

        })


    }

    //操作发送数据
    function sendData(url,el,flag,successFun){

        var prm = {

            //分类编码
            lxbm:$('#DC-num').val(),
            //分类名称
            lxname:$('#DC-name').val(),
            //备注
            remark:$('#DC-remark').val()
        }

        if(flag){

            prm.id = _thisId

        }

        _mainAjaxFunCompleteNew('post',url,prm,el,successFun);

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

        _isExist = '';


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

    //绑定数据
    function bindData(id){

        for(var i=0;i<_allData.length;i++){

            var data = _allData[i];

            if(data.id == id){

                //分类编码
                $('#DC-num').val(data.lxbm);
                //地址
                $('#DC-name').val(data.lxname);
                //备注
                $('#DC-remark').val(data.remark);

            }

        }

    }

})