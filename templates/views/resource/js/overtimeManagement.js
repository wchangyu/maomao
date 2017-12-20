$(function(){

    /*----------------------------------------------------变量---------------------------------------------*/

    var datailVue = new Vue({

        el:'#myApp33',
        data:{

            //车站名称
            station:'',
            //事由说明
            reason:'',
            //故障描述
            faultDes:'',
            //相关工单
            aboutGD:'',
            //计划开始时间
            stTime:'',
            //计划结束时间
            etTime:'',
            //施工高度
            buildHeight:'',
            //加班人
            overtimeP:'',
            //时长类型
            moneyType:''
        },
        methods:{

            timeFun:function(){

                var e = e||window.event;

                var el = $(e.srcElement);

                _dataComponentsFun(el);

            },
            blurFun:function(){

                var e = e||window.event;

                var el = $(e.srcElement);

                var view = el.parent().children().eq(0);

                el.off('changeDate');

                el.on('changeDate',function(){

                    datailVue[view[0].__v_model.descriptor.raw] = el.val()

                })

            }

        }

    })

    //所有车站数据
    var _allCZ = [];

    //获取所有车站数据
    ajaxFun('YWDev/ywDMGetDDs', _allCZ);

    //当前选中的车站名称，
    var _thisCZName= '';

    //当前选中的车站编码
    var _thisCZNum = '';

    //加班人员列表
    var _JBPerson = [];

    //加班人员数据
    getRY(true);

    //选中加班人的数组（第三层）
    var _tempWorkerArr = [];

    //选中加班人的数组（第二层）

    var _selectedWorkerArr = [];

    //加班类型
    var _JBType = [];

    personType();

    //当前删除的执行人员的编码
    var _$thisWorkerBM = '';

    //所有工单
    var _gdArr = [];

    //相关工单
    GDselect(true);

    //已选择的工单数组
    var _gdSelected = [];



    /*-------------------------------------------------表格初始化----------------------------------------*/
    var tableListCol = [

        {
            title:'加班编号',
            data:'gdCode'
        },
        {
            title:'上报人姓名',
            data:'createUserName'
        },
        {
            title:'上报人编号',
            data:'createUser'
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

    ];

    _tableInit($('#table-list'),tableListCol,1,true,'','');

    conditionSelect();

    //加班人员表格
    var workerListCol = [

        {
            title:'人员编号',
            data:'userNum'
        },
        {
            title:'人员名称',
            data:'userName'
        },
        {
            title:'人员类型',
            render:function(data, type, full, meta){

                var str = '<select class="workerSelect"><option value="">请选择</option>';

                for(var i=0;i<_JBType.length;i++){

                    str += '<option value="' + _JBType[i].type +
                        '">' + _JBType[i].name + '</option>'

                }

                str += '</select>';

                return str

            }
        },
        {
            title:'操作',
            targets: -1,
            data: null,
            defaultContent: '<span class="data-option option-delete btn default btn-xs green-stripe">删除</span>'
        },

    ];

    _tableInit($('#worker-list'),workerListCol,2,true,'','');

    //车站表格
    var CZCol = [

        {
            title:'车站编码',
            data:'ddNum'
        },
        {
            title:'车站名称',
            data:'ddName'
        },
        {
            title:'所属',
            data:'daName'
        },
        {
            title:'拼音简写',
            data:'ddPy'
        }

    ];

    _tableInitS($('#sbmcxz'),CZCol,2,true,false,'','');

    //加班人员列表
    var col3 = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'zxrnum'
        },
        {
            title:'执行人员',
            data:'userName',
            className:'zxrname'
        },
        {
            title:'职位',
            data:'pos'
        },
        {
            title:'联系电话',
            data:'mobile',
            className:'zxrphone'
        }
    ];
    _tableInit($('#zhixingRenTable'),col3,2,true,'','');

    //工单列表
    var gdCol = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工单号',
            data:'gdCode2',
            className:'gdCodes',
            render:function(data, type, full, meta){
                return '<span data-gdCode="' + full.gdCode +
                    '" data-czCode="' + full.bxKeshiNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'工单状态',
            data:'gdZht',
            render:function(data, type, full, meta){
                if (data == 1) {
                    return '待下发'
                }
                if (data == 2) {
                    return '待分派'
                }
                if (data == 3) {
                    return '待执行'
                }
                if (data == 4) {
                    return '执行中'
                }
                if (data == 5) {
                    return '等待资源'
                }
                if (data == 6) {
                    return '待关单'
                }
                if (data == 7) {
                    return '任务关闭'
                }
                if (data == 999) {
                    return '任务取消'
                }
            }
        },
        {
            title:'督察督办责任人',
            data:'wxUserNames'
        },
        {
            title:'维修系统',
            data:'wxShiX'
        },
        {
            title:'所需备件',
            data:'wxClNames'
        },
        {
            title:'车站',
            data:'bxKeshi',
            className:'bxKS'
        }
    ];

    _tableInit($('#GD-table'),gdCol,2,'','','');


    /*----------------------------------------------------按钮事件------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //新增
    $('.creatButton').click(function(){

        $('#ADD-Modal').find('.datatimeblock').click();

        //初始化
        datilInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'新增','','','','新增');

        //是否可操作


        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
    })

    //新增确定按钮
    $('#ADD-Modal').on('click','.dengji',function(){

        optionButton('YWFZ/JiaBanAdd',true,'新增成功！','新增失败！');

    })

    //表格查看按钮
    $('#table-list').on('click','.option-see',function(){

        bindData($(this));

        //模态框
        _moTaiKuang($('#ADD-Modal'),'查看','flag','','','');

    })

    //车站------------------------------------------------------------------------------------

    //车站选择
    $('#ADD-Modal').on('click','#select-DEV',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //模态框
        _moTaiKuang($('#CZ-Modal'),'车站列表','','','','选择');


    })

    //车站模态框显示回调
    $('#CZ-Modal').on('shown.bs.modal',function(){

        //初始化
        $('#CZ-Modal').find('.gongdanContent').find('input').val(' ');

        //表格初始化
        _datasTable($('#sbmcxz'),_allCZ);

        $('#theLoading').modal('hide');

    })

    //车站表格点击事件
    $('#sbmcxz').on('click','tr',function(){

        //样式
        $('#sbmcxz tbody').children('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

    })

    //车站选择确定按钮
    $('#CZ-Modal').on('click','.selectSBMC',function(){

        //确定当前选中的设备编码、名称
        var info = $('#sbmcxz tbody').find('.tables-hover');

        _thisCZNum = info.children('td').eq(0).html();

        _thisCZName = info.children('td').eq(1).html();

        //模态框消失
        $('#CZ-Modal').modal('hide');

        //赋值
        datailVue.station = _thisCZName;

        $('#ADD-Modal').find('.station').attr('data-num',_thisCZNum);

    })

    //加班人-----------------------------------------------------------------------------------

    //加班人条件选择
    $('#Worker-Modal').on('click','.zhixingButton',function(){

        getRY(false);

    })

    //加班人选择
    $('#ADD-Modal').on('click','#select-WK',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //模态框
        _moTaiKuang($('#Worker-Modal'),'加班人列表','','','','选择');

    });

    //加班人模态框显示回调
    $('#Worker-Modal').on('shown.bs.modal',function(){

        //初始化
        //条件初始化
        $('#Worker-Modal').find('#zxName').val('');

        $('#Worker-Modal').find('#zxNum').val('');

        //表格初始化
        _datasTable($('#zhixingRenTable'),_JBPerson);

        //loadding消失
        $('#theLoading').modal('hide');

    })

    //执行人表格选择事件
    $('#zhixingRenTable tbody').on('click','tr',function(){

        //样式
        var flag = $(this).find('input').parent().hasClass('checked')

        if(flag){

            $(this).find('input').parent().removeClass('checked');

            $(this).removeClass('tables-hover');

        }else{

            $(this).find('input').parent().addClass('checked');

            $(this).addClass('tables-hover');
        }

    })

    //执行人表格确定事件
    $('#Worker-Modal').on('click','.addZXR',function(){

        //首先确定选中的执行人（第二层）

        var arr = $('#zhixingRenTable tbody').find('.checked');

        for(var i=0;i<arr.length;i++){

            var bm = arr.eq(i).parents('tr').children('td').eq(1).html();

            for(var j=0;j<_JBPerson.length;j++){

                if(_JBPerson[j].userNum == bm){

                    _tempWorkerArr.push(_JBPerson[j]);

                }

            }

        }

        //console.log(_tempWorkerArr);

        //_datasTable($('#worker-list'),_tempWorkerArr);

        $('#Worker-Modal').modal('hide');

        //首先判断第一层的数组中有没有第二层的数组中的（去重）;

        if(_selectedWorkerArr.length == 0){

            for(var i=0;i<_tempWorkerArr.length;i++){

                _selectedWorkerArr.push(_tempWorkerArr[i]);

            }

        }else{

            for(var i=0;i<_tempWorkerArr.length;i++){

                if(_selectedWorkerArr.indexOf(_tempWorkerArr[i])>=0){



                }else{

                    _selectedWorkerArr.push(_tempWorkerArr[i]);

                }

            }

        }

        //console.log(_selectedWorkerArr);

        _datasTable($('#worker-list'),_selectedWorkerArr);

    })

    //执行人静态删除
    $('#worker-list tbody').on('click','.option-delete',function(){

        //提示
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除吗？','删除');

        //添加类
        $('#DEL-Modal').find('.btn-primary').addClass('removeWorker');

        _$thisWorkerBM = $(this).parents('tr').children().eq(0).html();

    })

    //执行人静态删除确定按钮
    $('#DEL-Modal').on('click','.removeWorker',function(){

        for(var i=0;i<_selectedWorkerArr.length;i++ ){

            if(_$thisWorkerBM == _selectedWorkerArr[i].userNum){

                _selectedWorkerArr.remove(_selectedWorkerArr[i]);

            }

        }

        _datasTable($('#worker-list'),_selectedWorkerArr);

        //模态框消失
        $('#DEL-Modal').modal('hide');

    })

    //相关工单-------------------------------------------------------------------------------------

    $('#ADD-Modal').on('click','#select-GD',function(){

        //loadding显示
        $('#theLoading').modal('show');

        //模态框
        _moTaiKuang($('#GD-Modal'),'选择工单','','','','确定');

    })

    $('#GD-Modal').on('shown.bs.modal',function(){

        //初始化
        //条件初始化
        $('#GD-Modal').find('.condition-query').find('input').val('');

        $('#GD-Modal').find('.condition-query').find('select').val('');

        $('#gdzt').val(0);

        //表格初始化
        _datasTable($('#GD-table'),_gdArr);

        //loadding消失
        $('#theLoading').modal('hide');

    })

    //工单时间选择的日期插件
    _dataComponentsFun($('.gdTime'));

    //工单条件材料申请已审批
    $('#isExamine').click(function(){

        if( $(this).parent('.checked').length == 0 ){

            $(this).parent('span').addClass('checked');

        }else{

            $(this).parent('span').removeClass('checked');

        }

    })

    //工单条件选择
    $('#selectedGD').click(function(){

        GDselect()

    })

    //工单表格选择事件
    $('#GD-table').on('click','tr',function(){

        //样式
        var flag = $(this).find('input').parent().hasClass('checked')

        if(flag){

            $(this).find('input').parent().removeClass('checked');

            $(this).removeClass('tables-hover');

        }else{

            $(this).find('input').parent().addClass('checked');

            $(this).addClass('tables-hover');
        }

    })

    //工单选择确定按钮
    $('#GD-Modal').on('click','.selectSBMC',function(){

        _gdSelected.length = 0;

        //首先将选中的工单放到数组中
        var checked = $('#GD-table tbody').find('.checked').parents('td').next().children();

        for(var i=0;i<checked.length;i++){

            _gdSelected.push(checked.eq(i).html());

        }

        //模态框消失
        $('#GD-Modal').modal('hide');

        var str = '';

        for(var i=0;i<_gdSelected.length;i++){

            str += _gdSelected[i] + ','

        }

        //赋值
        datailVue.aboutGD = str.slice(0,-1);

    })

    /*----------------------------------------------------其他方法------------------------------------------*/

    //条件查询
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JiaBanGetAll',
            data:{
                //加班编号
                gdCode:$('.overtimeBM').val(),
                //上报人编号
                createUserName:$('.shangName').val(),
                //上报人姓名
                createUser:$('.shangNum').val(),
                //当前用户部门编号
                userdepartNum:_loginUser.departNum,
                //当前用户id
                userID:_userIdNum,
                //当前用户角色
                b_UserRole:_userRole
            },
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#table-list'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    }

    //初始化
    function datilInit(){

        //车站名称
        datailVue.station = '';
        //事由说明
        datailVue.reason = '';
        //故障描述
        datailVue.faultDes = '';
        //相关工单
        datailVue.aboutGD = '';
        //计划开始时间
        datailVue.stTime = '';
        //计划结束时间
        datailVue.etTime = '';
        //施工高度
        datailVue.buildHeight = '';
        //加班人
        datailVue.overtimeP = '';
        //时长类型
        datailVue.moneyType = '';

    }

    //登记、编辑、删除
    function optionButton(url,flag,successMeg,errorMeg){

        //获取加班人的人员类型
        var worker = $('#worker-list tbody').find('.workerSelect');

        for(var i=0;i<worker.length;i++){

           var word =  worker.eq(i).parents('tr');

           for(var j=0;j<_selectedWorkerArr.length;j++){

               if(word.children('td').eq(0).html() == _selectedWorkerArr[j].userNum){

                   _selectedWorkerArr[j].type = word.children('td').eq(2).children('.workerSelect').val();

               }

           }

        }

        var arr = [];

        for(var i=0;i<_selectedWorkerArr.length;i++){

            var obj = {};

            obj.userNum = _selectedWorkerArr[i].userNum;

            obj.userName = _selectedWorkerArr[i].userName;

            obj.type = _selectedWorkerArr[i].type;

            arr.push(obj);

        }

        var prm = {

            //车站名称
            ddName:datailVue.station,
            //车站编号
            ddNum:$('.station').attr('data-num'),
            //所属系统编号
            dcNum:'',
            //所属系统名称
            dcName:'',
            //事由说明
            reason:datailVue.reason,
            //故障描述
            descs:datailVue.faultDes,
            //报修工单编号
            gdCodeRef:datailVue.aboutGD,
            //计划开始时间
            planBeginTime:datailVue.stTime,
            //计划结束时间
            planStopTime:datailVue.etTime,
            //上报人编号
            createUser:_userIdNum,
            //上报人姓名
            createUserName:_userIdName,
            //时长类型
            moneyType:datailVue.moneyType,
            //高度
            height:datailVue.buildHeight,
            //所属部门编号
            departNum:_loginUser.departNum,
            //所属部门名称
            departName:_loginUser.departName,
            //加班人员集合
            jbRenList:arr


        };

        //if(flag){
        //
        //    prm.id = typeVue.id;
        //}

        $.ajax({

            type:'post',
            url:_urls + url,
            data:prm,
            timeout:_theTimes,
            success:function(result){

                console.log(result);

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap',successMeg,'');

                    conditionSelect();

                    $('#ADD-Modal').modal('hide');

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap',errorMeg,'');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    }

    //获取所有车站
    function ajaxFun(url,flag) {
        var prm = {
            'userID': _userIdNum
        }
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {

                if(flag){

                    _allCZ.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allCZ.push(result[i]);

                    }

                }

                //_datasTable($('#sbmcxz'),result);

                //选择工单的时候的车站
                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].ddNum +
                        '">' + result[i].ddName + '</option>';

                }

                $('.returnEmpty').empty().append(str);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //本部门人员数据
    function getRY(flag){
        var prm = {
            "userName2": $('#zxName').val(),
            "userNum": $('#zxNum').val(),
            "departNum": _loginUser.userDepartNum,
            "roleNum": "",
            "userID": _userIdNum,
            "userName":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXRens',
            data:prm,
            success:function(result){

                if(flag){

                    _JBPerson.length = 0;

                    for(var i=0;i<result.length;i++){

                        _JBPerson.push(result[i]);

                    }

                }

                _datasTable($('#zhixingRenTable'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //人员类型
    function personType(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JBRenTypeGetAll',
            data:{
                name:''
            },
            success:function(result){

                _JBType.length = 0;

                for(var i=0;i<result.length;i++){

                    _JBType.push(result[i]);

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //工单
    function GDselect(flag){

        var gdrealityStart = '';

        var gdrealityEnd = '';

        if($('.gdTime').eq(0).val() == ''){
            gdrealityStart = ''
        }else{
            gdrealityStart = moment($('.gdTime').eq(0).val()).format('YYYY/MM/DD') + ' 00:00:00'
        }
        if($('.gdTime').eq(1).val() == ''){
            gdrealityEnd = ''
        }else{
            gdrealityEnd = moment($('.gdTime').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }

        var prm = {
            gdCode2:$('#gdcode').val(),
            gdSt:gdrealityStart,
            gdEt:gdrealityEnd,
            gdZht:$('#gdzt').val(),
            gdZhts:[0,1,2,3,4,5,6],
            userID:_userIdNum,
            userName:_userIdName,
            bxKeshiNum:$('#station').val()
        }
        if($('#isExamine').parent('.checked').length != 0){

            prm.isApplyWxCl = 1

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetZh2',
            data:prm,
            timeout:30000,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(flag){

                    _gdArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _gdArr.push(result[i]);

                    }

                }

                _datasTable($('#GD-table'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //数据绑定
    function bindData($this){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        //发送请求
        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JiaBanGetAll',
            data:{

            },
            success:function(result){

                console.log(result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

})