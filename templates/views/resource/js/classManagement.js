$(function(){

    /*------------------------------------变量--------------------------------------------*/

    //获取时间段
    timeRange();

    //新增Vue对象
    var classVue = new Vue({

        el:'#myApp33',
        data:{

            //名称
            'cname':'',
            //周期单位
            'periodicunit':'',
            //时间段
            'timeslot':''
        },
        methods:{

            cycleFun:function(){

                $('.cycle-block').hide();

                if(classVue.periodicunit == 1){

                    $('.cycle-block-week').show();

                }else if(classVue.periodicunit == 2){

                    $('.cycle-block-month').show();

                }else{

                    $('.cycle-block').eq(0).show();

                }

            }

        }

    })

    /*------------------------------------表格初始化--------------------------------------*/

    var tableListCol = [
        {
            title:'名称',
            data:'name',
            className:'Tname',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.id + '">'+ data +'</span>'

            }
        },
        {
            title:'编码',
            data:'bccode',
            className:'bccode'
        },
        {
            title:'周期单位',
            data:'period',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '周'

                }else{

                    return '月'

                }

            }
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            "defaultContent":"<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }

    ]

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    conditionSelect();

    //记录当前id
    var _$thisID = '';

    //记录当前编码
    var _$thisCode = '';

    /*-------------------------------------按钮事件---------------------------------------*/

    //新增
    $('.creatButton').click(function(){

        //loadding显示
        $('#theLoading').modal('show');

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'新增','','','','新增');

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        //是否可操作
        abledOption();

        //loadding消失
        $('#theLoading').modal('hide');

    })

    //月的复选框
    $('.cycle-block-month').on('click','input',function(){

        var flag = $(this).parent('span').hasClass('checked');

        if(flag){

            $(this).parent('span').removeClass('checked');

        }else{

            $(this).parent('span').addClass('checked');

        }

    })

    //新增确定按钮
    $('#ADD-Modal').on('click','.dengji',function(){

        optionSureButton('YWFZ/BanCiAdd',false,'新增成功！','新增失败!');

    })

    //查看
    $('#table-list tbody').on('click','.option-see',function(){

        bindData($(this));

        //模态框
        _moTaiKuang($('#ADD-Modal'),'查看','flag','','','');

        //不可操作
        disabledOption();

    })

    //编辑
    $('#table-list tbody').on('click','.option-edit',function(){

        //数据绑定
        bindData($(this));

        //模态框
        _moTaiKuang($('#ADD-Modal'),'编辑','','','','保存');

        //可操作
        abledOption();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

    })

    //编辑确定按钮
    $('#ADD-Modal').on('click','.bianji',function(){

        optionSureButton('YWFZ/BanCiUpdate',true,'编辑成功！','编辑失败!');

    })

    //删除
    $('#table-list tbody').on('click','.option-delete',function(){

        bindData($(this));

        //模态框
        _moTaiKuang($('#ADD-Modal'),'确定要删除吗？','','','','删除');

        //可操作
        disabledOption();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('dengji').removeClass('bianij').addClass('shanchu');

    })

    //删除确定按钮
    $('#ADD-Modal').on('click','.shanchu',function(){

        optionSureButton('YWFZ/BanCiDelete',true,'删除成功！','删除失败!');

    })

    //静态添加班次
    $('.addStatic').on('click',function(){

        //给每一天赋值

        //通过判断选中的是周还是月

        var values = $('#time-slot').val();

        if( classVue.periodicunit == 1 ){

            $('.cycle-block-week').find('.time-range').val(values);

        }else{

            $('.cycle-block-month').find('.time-range').val(values);

        }

    })

    /*-------------------------------------其他方法---------------------------------------*/

    //条件查询获取列表
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/BanCiGetAll',
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result.length != 0 ){

                    _datasTable($('#table-list'),result);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //获取时间段
    function timeRange(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/KQShiJianDuanGetAll',
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].id +
                        '">' + result[i].name + '</option>';

                }

                $('#time-slot').empty().append(str);

                $('.time-range').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //初始化
    function detailedInit(){

        //名称
        classVue.cname = '';
        //周期单位
        classVue.periodicunit = '';
        //时间段
        classVue.timeslot = '';

        //默认打开全部勾选
        var  checkWeek = $('.cycle-block-week').children('li');

        for(var i=0;i<checkWeek.length;i++){

            checkWeek.find('span').addClass('checked');

        }

        var  checkMonth = $('.cycle-block-month').children('li');

        for(var i=0;i<checkMonth.length;i++){

            checkMonth.find('span').addClass('checked');

        }

        //默认不显示
        $('#ADD-Modal').find('.cycle-block').hide();

        $('#ADD-Modal').find('.cycle-block').eq(0).show();

        //周显示值初始化
        $('.cycle-block-week').find('input').parent('span').addClass('checked');

        //周select初始化
        $('.cycle-block-week').find('select').val('');

        //月显示值初始化
        $('.cycle-block-month').find('input').parent('span').addClass('checked');

        //月select初始化
        $('.cycle-block-month').find('select').val('');
    }

    //数据绑定
    function bindData($this){

        //样式修改
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        _$thisID = $this.parents('tr').children('.Tname').children().attr('data-num');

        _$thisCode = $this.parents('tr').children('.bccode').html();

        //数据绑定
        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/BanCiReturnOne',
            data:{
                id:_$thisID
            },
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                //首先将所有复选框清空
                $('.cycle-block').find('input').parent().removeClass('checked');

                $('.cycle-block').find('select').val('');

                //班次名称
                classVue.cname = result.name;

                //周期单位
                classVue.periodicunit = result.period;

                //时间段
                classVue.timeslot = '';

                $('.cycle-block').hide();

                var inputNum;

                var selectNum;

                if( result.period == 1 ){

                    inputNum = $('.cycle-block-week').find('input');

                    selectNum = $('.cycle-block-week').find('select');

                    $('.cycle-block-week').show();

                    $('.cycle-block-month').hide();

                }else if(result.period == 2){

                    inputNum = $('.cycle-block-month').find('input');

                    selectNum = $('.cycle-block-month').find('select');

                    $('.cycle-block-month').show();

                    $('.cycle-block-week').hide();

                }else{

                    $('.cycle-block').eq(0).show();

                }

                if(result.banCiDetailList){

                    //再根据返回值，勾选
                    for(var i=0;i<result.banCiDetailList.length;i++ ){

                        for(var i=0;i<inputNum.length;i++){

                            for(var j=0;j<result.banCiDetailList.length;j++){

                                if(result.banCiDetailList[j].selectedday == (i + 1)){

                                    inputNum.eq(i).parent().addClass('checked');

                                    selectNum.eq(i).val(result.banCiDetailList[j].sjDid);

                                }

                            }


                        }

                    }


                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //模态框可操作
    function disabledOption(){

        $('#ADD-Modal').find('select').attr('disabled',true).addClass('disabled-block');

        $('#ADD-Modal').find('input').attr('disabled',true).addClass('disabled-block');

    }

    //模态框可操作
    function abledOption(){

        $('#ADD-Modal').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#ADD-Modal').find('input').attr('disabled',false).removeClass('disabled-block');

    }

    //optionSureButton true 编辑、删除 false 添加
    function optionSureButton(url,flag,successMeg,errorMeg){

        //验证非空
        if( classVue.cname == '' || classVue.periodicunit == '' ){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请填写红色必填项！', '');

        }else{

            //确定班组名称
            var time = '';

            if( classVue.timeslot == '' ){

                time = '';

            }else{

                time = $('#time-slot').children('option:selected').html();

            }

            //确定周期天数
            var arr = [];

            if( classVue.periodicunit == 1 ){

                var inputNum = $('.cycle-block-week').find('input');

                var selectNum = $('.cycle-block-week').find('select');

                //使用each遍历
                inputNum.each(function(index,dom){

                    if(inputNum.eq(index).parent().hasClass('checked')){

                        var obj = {};

                        //具体天 周
                        obj.selectedday = Number(index + 1);

                        //班次id
                        obj.sjDid = selectNum.eq(index).val();

                        arr.push(obj);
                    }

                })


            }else if( classVue.periodicunit == 2 ){

                var inputNum = $('.cycle-block-month').find('input');

                var selectNum = $('.cycle-block-month').find('select');

                //使用each遍历
                inputNum.each(function(index,dom){

                    if(inputNum.eq(index).parent().hasClass('checked')){

                        var obj = {};

                        //具体天 周
                        obj.selectedday = Number(index + 1);

                        //班次id
                        obj.sjDid = selectNum.eq(index).val();

                        arr.push(obj);
                    }

                })

            }else{

                arr = [];

            }

            var prm = {

                //班次名称
                name:classVue.cname,
                //周期
                period:classVue.periodicunit,
                //时间段id
                sjDid:classVue.timeslot,
                //时间段名称
                sjDname:time,
                //具体天周:
                BanCiDetailList:arr
            }

            if(flag){

                prm.id = _$thisID;

                prm.bccode = _$thisCode;

            }

            $.ajax({

                type:'post',
                url:_urls + url,
                data:prm,
                timeout:_theTimes,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success:function(result){

                    if(result == 99){

                        _moTaiKuang($('#myModal2'),'提示','flag','istap',successMeg,'');

                        $('#ADD-Modal').modal('hide');

                        conditionSelect();

                    }else{

                        _moTaiKuang($('#myModal2'),'提示','flag','istap',errorMeg,'');

                    }

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }

            })

        }



    }

})