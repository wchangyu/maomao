var BaseLine = function () {

    //记录当前选中的userId
    var _thisID = '';

    /*-----------------------------------表格初始化-------------------------------------*/

    var col=[
        {
            title:'基线类型',
            data:'type',
            name:'type',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '累计（典型）'

                }else{

                    return '时刻'
                }

            }
        },
        {
            title:'基线名称',
            data:'name'
        },
        {
            title:'计算方式',
            data:'typical',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '仅限工作日'

                }else if(data == 2){

                    return '不限工作日'

                }else{

                    return ''

                }

            }
        },
        {
            title:'推前天数',
            data:'days'
        },
        {
            title:'推前分钟数',
            data:'minutes'
        },
        {
            title:'描述',
            data:'memo'
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

    $('#table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": true,
        "bProcessing":true,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        'buttons':{
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        },
        "columns": col,
        "rowsGroup": [
            'type:name',
            0
        ],
        "aoColumnDefs": [ { "orderable": false, "targets": [ 1,2,3,4,5,6] }]
    });

    //_tableInit($('#table'),col,2,true,'','','','');

    /*-----------------------------------创建表单验证-------------------------------------*/

    $('#commentForm').validate({

        rules:{

            //基线名称
            'baseline-name':{

                required: true

            },

            //推前天数
            'forward-days':{

                numberFormat1:true

            },

            //推前分钟数
            'forward-minute':{

                numberFormat1:true

            }

        },
        messages:{

            //基线名称
            'baseline-name':{

                required: '请输入基线名称'

            },

            //推前天数
            'forward-days':{

                numberFormat1:true

            },

            //推前分钟数
            'forward-minute':{

                numberFormat1:true

            }

        }

    })

    //验证数字
    //正则表达式（补贴价格只能是数字）
    $.validator.addMethod("numberFormat",function(value,element,params){

        var doubles= /^\d+(\.\d+)?$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入数字格式");

    //正则表达式（大于0的数字）
    $.validator.addMethod("numberFormat1",function(value,element,params){

        var doubles= /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;

        return this.optional(element)||(doubles.test(value));

    },"请输入大于0的数字");

    /*-----------------------------------按钮事件----------------------------------------*/

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【创建账户】
    $('#creatUser').click(function(){

        //loadding
        $('#theLoading').modal('show');

        //初始化
        createInit();

        //模态框
        _moTaiKuang($('#create-Modal'), '提示', false, '' ,'', '创建');

        //loadding
        $('#theLoading').modal('hide');

        //类
        $('#create-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可编辑（都可编辑）
        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //选择区域显示
        $('.select-district').show();


    })

    //创建账户【确定按钮】
    $('#create-Modal').on('click','.dengji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRBaseline/CreateDRBaselineInfo','创建成功');

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
        _moTaiKuang($('#create-Modal'), '提示', false, '' ,'', '保存');

        //绑定数据
        bind(_thisID);

        //类
        $('#create-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //是否可操作
        //账户登录名不能操作
        $('#create-Modal').find('input').attr('disabled',false);

        $('#create-Modal').find('select').attr('disabled',false);

        $('#create-Modal').find('textarea').attr('disabled',false);

        //选择区域显示
        $('.select-district').show();

    })

    //编辑【确定】
    $('#create-Modal').on('click','.bianji',function(){

        $('#theLoading').modal('show');

        formatValidate(function(){

            sendOption('DRBaseline/ModifyDRBaselineInfo','编辑成功',true);

        })

    })

    //累计类型选择
    $('#baseline-type-modal').change(function(){

        var value = $('#baseline-type-modal').val()

        if(value == 1){

            $('.type-add-up').show();

            $('.type-schedule').hide();

        }else{

            $('.type-add-up').hide();

            $('.type-schedule').show();

        }

    })
    /*----------------------------------其他方法-----------------------------------------*/

    //获取列表
    function conditionSelect(){

        $('#theLoading').modal('show');

        var  prm = {

            //基线类别
            type:$('#baseline-type').val()

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRBaseline/GetDRBaselineDs',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

                $('#tip').hide();

                var arr = [];

                if(result.code == -2){

                    _topTipBar('暂时没有基线数据')

                }else if(result.code == -1){

                    _topTipBar('异常错误')

                }else if(result.code == -3){

                    _topTipBar('参数错误')

                }else if(result.code == -4){

                    _topTipBar('内容已存在')

                }else if(result.code == 0){

                    arr = result.drbls.reverse();

                }

                _jumpNow($('#table'),arr);

            },

            error:_errorBar

        })


    }

    //初始化
    function createInit(){

        //清空
        $('#create-Modal').find('input').val('');

        $('#create-Modal').find('select').val(1);

        $('#create-Modal').find('textarea').val('');

        //当前id
        _thisID = '';

        $('.type-add-up').show();

        $('.type-schedule').hide();

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

    //格式验证(flag为真的时候，验证密码是否为空)
    function formatValidate(fun){

        //非空验证
        if($('#baseline-name').val() == ''){

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

        var prm = {

            //基线名称
            name:$('#baseline-name').val(),
            //基线类型
            type:$('#baseline-type-modal').val(),
            //描述
            memo:$('#create-remark').val()

        };

        if( $('#baseline-type-modal').val() == 1 ){

            //计算方式
            prm.typical = $('#baseline-calculate').val();
            //推前天数
            prm.days = $('#forward-days').val();

        }else{

            //推前分钟数
            prm.minutes = $('#forward-minute').val()

        }

        if(flag){

            prm.id = _thisID;

            //不管基线类型是啥，天数和分钟数都要传

            if($('#baseline-type-modal').val() == 1){

                //推前分钟数
                prm.minutes = $('#forward-minute').val()

            }else{

                //计算方式
                prm.typical = $('#baseline-calculate').val();
                //推前天数
                prm.days = $('#forward-days').val();

            }


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

    //样式
    function changeCss(el){

        $('.table tbody').find('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

    }

    //绑定数据
    function bind(id){

        var prm = {

            id:id

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'DRBaseline/GetDRBaselineById',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //绑定数据
                    //基线名称
                    $('#baseline-name').val(result.baseline.name);
                    //基线类型
                    $('#baseline-type-modal').val(result.baseline.type);

                    if(result.baseline.type == 1){

                        //样式
                        $('.type-add-up').show();

                        $('.type-schedule').hide();

                        //计算方式
                        $('#baseline-calculate').val(result.baseline.typical);

                        //推前天数
                        $('#forward-days').val(result.baseline.days);

                    }else{

                        //样式
                        $('.type-add-up').hide();

                        $('.type-schedule').show();

                        //推前分钟数
                        $('#forward-minute').val(result.baseline.minutes);
                    }

                    //描述
                    $('#create-remark').val(result.baseline.memo);


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
            //条件选择
            conditionSelect()

        }
    }

}();