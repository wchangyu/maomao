$(function(){

    /*----------------------------------------时间插件------------------------------------------*/

    //时间插件（月）
    _monthDate($('.datatimeblock').eq(0));

    //默认本月
    var nowTime = moment().format('YYYY/MM');

    $('.datatimeblock').eq(0).val(nowTime);

    /*-----------------------------------------变量---------------------------------------------*/

    var obj = new Vue({
        el:'#myApp33',
        data:{
            //时间
            time:'',
            //盐用量
            consumption:'',
        },
        methods:{
            timeFun:function(){

                $('.datatimeblock').eq(1).datepicker({
                    language:  'zh-CN',
                    todayBtn: 1,
                    todayHighlight: 1,
                    format: 'yyyy/mm/dd',
                    forceParse: 0,
                    autoclose: 1
                });
            }
        }
    });

    /*----------------------------------------------------表格初始化----------------------------------*/

    //主表格
    var mainCol = [

        {
            title:'日期',
            data:'f_DayDate',
            render:function(data, type, full, meta){

                return data.split(' ')[0]
            }

        },
        {
            title:'朝阳液氧过磅重量(吨)',
            data:'f_InputValue'
        },
        {
            title:'操作',
            data:null,
            className:'table-option',
            render:function(data, type, full, meta){

                return "<span class='data-option option-bianji btn default btn-xs green-stripe' data-id='" +
                    full.pK_ID + "'>编辑</span><span class='data-option option-shanchu btn default btn-xs green-stripe' data-id='" + full.pK_ID +
                    "'>删除</span>"

            }
        }

    ]

    _tableInit($('#all-reporting'),mainCol,1,true,'','','',[0,1],10,'');

    //获取加载数据
    conditionSelect();

    /*----------------------------------------按钮事件-------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //新增
    $('.creatButton').click(function(){

        //loadding响应
        $('#theLoading').modal('show');

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#myModal'), '新增', false, '' ,'', '新增');

        $('.datatimeblock').eq(1).click();

        //默认当前时间
        var time = moment().format('YYYY/MM/DD');

        $('.datatimeblock').eq(1).val(time);

        obj.time = time;

        //类
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //可操所
        abledOption();

        //loadding响应
        $('#theLoading').modal('hide');

    })

    //登记新增按钮
    $('#myModal').on('click','.dengji',function(){

        //验证
        if(obj.time == '' || obj.consumption == ''){

            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'请填写红色必填项！', '');

        }else{

            //验证数字
            var reg = new RegExp("^[0-9]*$");

            if(!reg.test(obj.consumption)){

                _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'请填写正确格式的数字！', '');

            }else{

                optionButton('EnergyReportV2/SaveSewageData','新增成功','新增失败');

            }

        }

    })

    //表格编辑
    $('#all-reporting tbody').on('click','.option-bianji',function(){

        //loadding
        $('#theLoading').modal('show');

        //样式
        $('#all-reporting tbody').find('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        var id = $(this).attr('data-id');

        _id = id;

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#myModal'), '编辑', false, '' ,'', '保存');

        //类
        $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

        //可操作
        abledOption();

        //绑定数据
        bindData(id);
    })

    //编辑确定按钮
    $('#myModal').on('click','.bianji',function(){

        //验证
        if(obj.time == '' || obj.consumption == ''){

            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'请填写红色必填项！', '');

        }else{

            //验证数字
            var reg = new RegExp("^[0-9]*$");

            if(!reg.test(obj.consumption)){

                _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'请填写正确格式的数字！', '');

            }else{

                optionButton('EnergyReportV2/EditSewageData','编辑成功','编辑失败',true);

            }

        }

    })

    //表格删除
    $('#all-reporting tbody').on('click','.option-shanchu',function(){

        //loadding
        $('#theLoading').modal('show');

        //样式
        $('#all-reporting tbody').find('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        var id = $(this).attr('data-id');

        _id = id;

        //初始化
        modalInit();

        //模态框
        _moTaiKuang($('#myModal'), '确定要删除吗？', false, '' ,'', '删除');

        //类
        $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

        //可操作
        disAbledOption();

        //绑定数据
        bindData(id);
    })

    //删除确定按钮
    $('#myModal').on('click','.shanchu',function(){

        optionButton('EnergyReportV2/DelSewageData','删除成功','删除失败',true,true);

    })

    //导出
    //$('.excelButton').click(function(){
    //
    //    _FFExcel($('#all-reporting')[0]);
    //
    //})

    /*----------------------------------------------------其他方法------------------------------------*/

    //模态框初始化
    function modalInit(){

        //时间
        obj.time = '';
        //用盐量
        obj.consumption = '';

    }

    //是可操作
    function disAbledOption(){

        $('#myApp33').find('input').addClass('disabled-block').attr('disabled',true);


    }

    //不可操作
    function abledOption(){

        $('#myApp33').find('input').removeClass('disabled-block').attr('disabled',false);

    }

    //登记、编辑、删除方法flag的时候，传id
    function optionButton(url,successMeg,errorMeg,flag,flag1){

        if(flag1){

            prm = JSON.stringify({UserID:_userIdNum, PK_ID:_id});

        }else{

            var prm = {

                //日期
                f_DayDate:obj.time,
                //盐用量
                f_InputValue:obj.consumption,
                //用户id
                userID:_userIdNum,
                //是污水处理还是液氧0是污水处理1是液氧
                f_ValueType:1
            }

            if(flag){

                prm.pK_ID = _id;

            }

        }

        if(flag1){

            $.ajax({

                type:'post',

                url:_urls + url,

                timeout:_theTimes,

                data:prm,

                contentType:'application/json',

                beforeSend:_beforeSendFun,

                _completeFun:_completeFun,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result == 99){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,successMeg, '');

                        $('#myModal').modal('hide');

                        setTimeout(function(){

                            conditionSelect();

                        },600)


                    }else if(result == 3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,errorMeg, '');

                    }else if(result == 11){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'日期有重复', '');

                    }else{

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,result, '');

                    }

                },

                error:_errorFun

            })

        }else{

            $.ajax({

                type:'post',

                url:_urls + url,

                timeout:_theTimes,

                data:prm,

                //contentType:'application/json',

                beforeSend:_beforeSendFun,

                _completeFun:_completeFun,

                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result == 99){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,successMeg, '');

                        $('#myModal').modal('hide');

                        setTimeout(function(){

                            conditionSelect();

                        },600)


                    }else if(result == 3){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,errorMeg, '');

                    }else if(result == 11){

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'日期有重复', '');

                    }else{

                        _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,result, '');

                    }

                },

                error:_errorFun

            })

        }




    }

    //条件查询
    function conditionSelect(){

        if($('.modal-backdrop').length > 0){

            $('div').remove('.modal-backdrop');

            $('#theLoading').hide();
        }

        $('#theLoading').modal('show');

        var prm = {

            'monthDT':$('.datatimeblock').eq(0).val() + '/01',

            'f_ValueType':1

        }

        $.ajax({

            type:'post',

            url:_urls + 'EnergyReportV2/GetSewageDataByDT',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                $('#theLoading').modal('hide');

                _jumpNow($('#all-reporting'),result);

            },

            error:_errorFun

        })

    }

    //绑定数据
    function bindData(id){

        var prm = {

            id:id,

            f_ValueType:1

        }

        $.ajax({

            type:'get',

            url:_urls + 'EnergyReportV2/GetSewageDataByDT',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                //绑定数据
                if(result != null){

                    //时间
                    obj.time = result.f_DayDate.split(' ')[0];

                    //盐用量
                    obj.consumption = result.f_InputValue;

                    //执行人
                    obj.person = result.f_SysUserName;

                    //id
                    $('#person1').attr('data-attr',result.f_SysuserID);

                }


            },

            error:_errorFun1

        })

    }


})