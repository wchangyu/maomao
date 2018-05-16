$(function(){

    /*---------------------------------------------时间插件------------------------------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));

    /*---------------------------------------------变量----------------------------------------------------*/

    //设备类型
    _getProfession('YWDev/ywDMGetDCs',$('#sblx'),false,'dcNum','dcName');

    //查看详情vue对象
    var detailVue = new Vue({

        //元素
        el:'#workDone1',
        data:{

            //任务单号
            rwdh:'',
            //任务名称
            rwmc:'',
            //计划编号
            jhbm:'',
            //计划名称
            jhmc:'',
            //设备编码
            sbbm:'',
            //设备名称
            sbmc:'',
            //责任单位部门
            zrdwbm:'',
            //责任人
            fzr:'',
            //执行人
            zxr:''
        }

    })

    //工单详情vue对象
    var gdVue = new Vue({

        //元素
        el:'#myApp33',
        data:{
            //工单号
            gdcode:'',
            //设备名称
            sbmc:'',
            //设备编码
            sbbm:'',
            //报修电话
            telephone:'',
            //报修人信息
            person:'',
            //维修地点
            place:'',
            //报修部门
            section:'',
            //设备系统
            system:'',
            //设备分类
            matter:'',
            //报修备注
            remarks:'',
            //维修备注
            wxbz:''

        }

    })

    //记录当前任务单号
    var _thisTaskBM = '';

    /*--------------------------------------------表格初始化-----------------------------------------------*/

    var mainCol = [

        {
            title:'任务单号',
            data:'itkNum',
            className:'bianma',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.dipNum +
                    '">' + data +
                    '</span>'

            }
        },
        {
            title:'任务名称',
            data:'itkName'
        },
        {
            title:'设备名称',
            data:'dName'
        },
        {
            title:'设备编码',
            data:'dNum',
            className:'dNum'
        },
        {
            title:'状态',
            data:'status',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '未接单'
                }if(data == 1){
                    return '执行中'
                }if(data == 2){
                    return '完成'
                }
            }
        },
        {
            title:'责任单位部门',
            data:'dipKeshi'
        },
        {
            title:'责任人',
            data:'manager'
        },
        {
            title:'执行人',
            data:'itkRen'
        },
        {
            title:'操作',
            "data": 'gdCode',
            render:function(data){

                if(data == ''){
                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-gongdan btn default btn-xs green-stripe'>创建工单</span>"
                }else{
                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-gongdans btn default btn-xs green-stripe' data-num='" + data +
                        "'>查看工单</span>"
                }
            }
        }

    ];

    _tableInit($('#scrap-datatables'),mainCol,1,true,'','','','','','');

    //数据
    conditionSelect();

    //异常任务表格
    var abnormalCol = [

        {
            title:'步骤编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'步骤名称',
            data:'ditName'
        },
        {
            title:'步骤参考值',
            data:'stValue'
        },
        {
            title:'报警关系',
            data:'relation'
        },
        {
            title:'巡检结果',
            className:'tableInputBlock',
            data:'res',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '正常'
                }if(data ==2){
                    return '异常'
                }
            }
        },
        {
            title:'结果记录',
            className:'tableInputBlock',
            data:'record'
        },
        {
            title:'异常故障描述',
            className:'tableInputBlock',
            data:'exception'
        }
    ];

    _tableInit($('#personTable1s'),abnormalCol,2,false,'','','','','','');

    /*---------------------------------------------按钮方法------------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    });

    //重置
    $('.reset').click(function(){

        $('.condition-query').eq(0).find('input').val('');

        $('.condition-query').eq(0).find('select').val('');

    });

    //表格【查看】按钮
    $('#scrap-datatables tbody').on('click','.option-see',function(){

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal1'), '查看', true, '' ,'', '');

        //赋值
        detailBind($(this));

    })

    //表格【创建工单】
    $('#scrap-datatables tbody').on('click','.option-gongdan',function(){

        //初始化
        gdInit();

        //数据绑定
        gdBind($(this));

        //模态框
        _moTaiKuang($('#myModal2'),'创建工单','','','','创建');

        //是否可操作
        gdAbled();

        //工单号隐藏
        $('.gdcodehide').hide();

        //电话允许输入
        $('#bxTel').removeClass('disabled-block').attr('disabled',false);

    })

    //表格【查看工单】
    $('#scrap-datatables tbody').on('click','.option-gongdans',function(){

        //初始化
        gdInit();

        //样式
        $('#scrap-datatables tbody').children().removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //数据绑定
        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:{

                //工单号
                gdCode: $(this).attr('data-num'),
                //用户id
                userID: _userIdNum,
                //用户名
                userName: _userIdName,

            },
            beforeSend: function () {

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

            },
            timeout:_theTimes,
            success:function(result){

                //工单号
                gdVue.gdcode = result.gdCode;
                //设备名称
                gdVue.sbmc = result.dName;
                //设备编码
                gdVue.sbbm = result.wxShebei;
                //报修电话
                gdVue.telephone = result.bxDianhua;
                //报修人信息
                gdVue.person = result.bxRen;
                //维修地点
                gdVue.place = result.wxDidian;
                //报修部门
                gdVue.section = result.bxKeshi;
                //设备系统
                gdVue.system = result.wxShiX;
                //设备分类
                gdVue.matter = result.dcName;
                //报修备注
                gdVue.remarks = result.bxBeizhu;
                //维修备注
                gdVue.wxbz = result.wxBeizhu;

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }

        })

        //模态框
        _moTaiKuang($('#myModal2'),'创建工单','','','','创建');

        //是否可操作
        gdDisAbled();

        //工单号显示
        $('.gdcodehide').show();

    })

    //【创建工单】确定按钮
    $('#myModal2').on('click','.dengji',function(){

        //验证
        if(gdVue.sbmc == '' || gdVue.sbbm == '' || gdVue.telephone == '' || gdVue.person == '' || gdVue.place == '' || gdVue.section == '' || gdVue.system == '' || gdVue.matter == ''){

            _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,'请输入红色必填项！', '');

        }else{

            var prm = {

                //是否紧急
                'gdJJ':0,
                //设备名称
                'dName':gdVue.sbmc,
                //设备编码
                'dNum':gdVue.sbbm,
                //报修电话
                'bxDianhua':gdVue.telephone,
                //报修人信息
                'bxRen':gdVue.person,
                //维修地点
                'wxDidian':gdVue.place,
                //报修部门
                'bxKeshi':gdVue.section,
                //报修部门编码
                'wxKeshiNum':$('#section').attr('data-num'),
                //设备分类
                'dcName':gdVue.matter,
                //设备分类编码
                'dcNum':$('#matter').attr('data-num'),
                //报修备注
                'bxBeizhu':gdVue.remarks,
                //维修备注
                'wxBeizhu':gdVue.wxbz,
                //设备系统
                'wxShiX':gdVue.system,
                //设备系统编码
                'wxShiXNum':$('#system').attr('data-num'),
                //当前用户id
                'userID':_userIdNum,
                //工单来源
                'gdSrc':3,
                //巡检任务编码
                'itkNum':_thisTaskBM,
                //维修设备
                'wxShebei':gdVue.sbbm

            }

            $.ajax({

                type:'post',
                url:_urls + 'YWGD/ywGDCreDJDI',
                data:prm,
                timeout:_theTimes,
                success:function(result){

                    if(result == 3){

                        _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,'工单创建失败！', '');

                    }else{

                        _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,'工单创建成功！', '');

                        $('#myModal2').modal('hide');

                        conditionSelect();

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        myAlter("超时");
                    }else{
                        myAlter("请求失败！");
                    }

                }

            })

        }

    })

    /*---------------------------------------------其他方法------------------------------------------------*/
    //条件查询
    function conditionSelect(){

        var area = $('.condition-query').eq(0)

        var prm = {

            //设备编码
            dNum:area.find('input').eq(0).val(),
            //设备名称
            dName:area.find('input').eq(1).val(),
            //设备类型
            dcNum:area.find('select').eq(0).val(),
            //巡检任务编码
            itkNum:area.find('input').eq(2).val(),
            //巡检任务名称
            itkName:area.find('input').eq(3).val(),
            //单位部门
            dipKeshi:area.find('input').eq(4).val(),
            //责任人
            manager:area.find('input').eq(5).val(),
            //开始时间
            ditST:area.find('input').eq(6).val(),
            //结束时间
            ditET:area.find('input').eq(7).val(),
            //用户id
            userID:_userIdNum,
            //用户名称
            userName:_userIdName,
            //用户角色
            b_UserRole:_userRole,
            //用户部门
            b_DepartNum:_loginUser.departNum

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWDevIns/ywITKGetExceptions',
            data:prm,
            //beforeSend: function () {
            //
            //    $('#theLoading').modal('show');
            //},
            //complete: function () {
            //
            //    $('#theLoading').modal('hide');
            //
            //},
            timeout:_theTimes,
            success:function(result){

                _jumpNow($('#scrap-datatables'),result);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        })


    }

    //详情模态框初始化
    function detailInit(){

        //任务单号
        detailVue.rwdh = '';
        //任务名称
        detailVue.rwmc = '';
        //计划编号
        detailVue.jhbm = '';
        //计划名称
        detailVue.jhmc = '';
        //设备编码
        detailVue.sbbm = '';
        //设备名称
        detailVue.sbmc = '';
        //责任单位部门
        detailVue.zrdwbm = '';
        //责任人
        detailVue.fzr = '';
        //执行人
        detailVue.zxr = '';
        //接单时间、开始时间、完成时间
        $('#workDone1').find('.datatimeblock').val('');
        //备注
        $('#workDone1').find('textarea').val('');
        //表格初始化
        var arr = [];
        //赋值
        _datasTable($('#personTable1s'),arr);
    }

    //详情赋值
    function detailBind(el){

        //样式
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

        $.ajax({

            type:'post',
            url:_urls + 'YWDevIns/ywITKGetExceptions',
            data:{
                //巡检任务编码
                itkNum:el.parents('tr').children().eq(0).children().html(),
                //用户id
                userID:_userIdNum,
                //用户名称
                userName:_userIdName,
                //用户角色
                b_UserRole:_userRole,
                //用户部门
                b_DepartNum:_loginUser.departNum
            },
            beforeSend: function () {

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            timeout:_theTimes,
            success:function(result){

                //任务单号
                detailVue.rwdh = result[0].itkNum;
                //任务名称
                detailVue.rwmc = result[0].itkName;
                //计划编号
                detailVue.jhbm = result[0].dipNum;
                //计划名称
                detailVue.jhmc = result[0].dipName;
                //设备编码
                detailVue.sbbm = result[0].dNum;
                //设备名称
                detailVue.sbmc = result[0].dName;
                //责任单位部门
                detailVue.zrdwbm = result[0].dipKeshi;
                //责任人
                detailVue.fzr = result[0].manager;
                //执行人
                detailVue.zxr = result[0].itkRenName;
                //接单时间
                $('#jdsjs').val(result[0].tkRecTime);
                //完成时间
                $('#wcsjs').val(result[0].tkCompTime);
                //开始时间
                $('#kssjs').val(result[0].tkTime);
                //备注
                $('#beizhus').val(result[0].remark);
                //表格初始化
                _datasTable($('#personTable1s'),result[0].itkecItems);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    console.log("超时");
                }else{
                    console.log("请求失败！");
                }

            }

        })


    }

    //工单详情初始化
    function gdInit(){
        //工单号
        gdVue.gdcode = '';
        //设备名称
        gdVue.sbmc = '';
        //设备编码
        gdVue.sbbm = '';
        //报修电话
        gdVue.telephone = '';
        //报修人信息
        gdVue.person = '';
        //维修地点
        gdVue.place = '';
        //报修部门
        gdVue.section = '';
        //设备系统
        gdVue.system = '';
        //设备分类
        gdVue.matter = '';
        //报修备注
        gdVue.remarks = '';
        //维修备注
        gdVue.wxbz = '';

    }

    //gd数据绑定
    function gdBind(el){

        //样式
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        el.parents('tr').addClass('tables-hover');

        _thisTaskBM = el.parents('tr').children().eq(0).children().html()

        $.ajax({

            type:'post',
            url:_urls + 'YWDevIns/ywITKGetExceptions',
            data:{
                //巡检任务编码
                itkNum:_thisTaskBM,
                //用户id
                userID:_userIdNum,
                //用户名称
                userName:_userIdName,
                //用户角色
                b_UserRole:_userRole,
                //用户部门
                b_DepartNum:_loginUser.departNum
            },
            beforeSend: function () {

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

            },
            timeout:_theTimes,
            success:function(result){

                //工单号
                gdVue.gdcode = result[0].gdCode;
                //设备名称
                gdVue.sbmc = result[0].dName;
                //设备编码
                gdVue.sbbm = result[0].dNum;
                //报修电话
                gdVue.telephone = result[0].phone;
                //报修人信息
                gdVue.person = result[0].itkRenName;
                //维修地点
                gdVue.place = result[0].installAddress;
                //报修部门
                gdVue.section = result[0].dipKeshi;
                //报修部门编码
                $('#section').attr('data-num',result[0].dipKeshiNum);
                //设备分类
                gdVue.matter = result[0].dcName;
                //绑定值
                $('#matter').attr('data-num',result[0].dcNum);
                //设备系统
                gdVue.system = result[0].dsName;
                //绑定值
                $('#system').attr('data-num',result[0].dsNum);
                //报修备注(异常描述)
                if(result[0].itkecItems){

                    var str = '';

                    for(var i=0;i<result[0].itkecItems.length;i++){

                        str += (i + 1) + '、' + result[0].itkecItems[i].exception + '    ';

                    }
                }
                //报修备注赋值
                gdVue.remarks = str;
                //维修备注
                gdVue.wxbz = '';

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    console.log("超时");
                }else{
                    console.log("请求失败！");
                }

            }

        })

    }

    //工单可操作
    function gdAbled(){

        $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#myApp33').find('textarea').attr('disabled',false).removeClass('disabled-block');

        $('.auto-fill').addClass('disabled-block').attr('disabled',true);

    }

    //工单不可操作
    function gdDisAbled(){

        $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');

    }
})