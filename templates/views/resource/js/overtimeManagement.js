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

                _timeHMSComponentsFun(el,1);

            },
            blurFun:function(attr){

                var e = e||window.event;

                var el = $(e.srcElement);

                var view = el.parent().children().eq(0);

                var error = el.parents('li').find('.multiple-condition');

                el.off('changeDate');

                el.on('changeDate',function(){

                    datailVue[view[0].__v_model.descriptor.raw] = el.val()

                })

                //验证消息消失

                if($(this)[0][attr] != ''){

                    error.hide();

                }

            },
            timeFormat:function(attr){

                var e = e||window.event;

                var el = $(e.srcElement);

                //var mny = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29) (d{2}):(d{2})$/;

                var mny = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d$/;

                var $this = $(this)[0][attr];

                var error = el.parents('li').find('.multiple-condition');

                if( mny.test($this) ){

                    error.hide();

                }else{

                    error.show();

                }

            },
            naturalNumber:function(attr){

                var mny = /^\+?[1-9][0-9]*$/;

                var $this = $(this)[0][attr];

                var e = e||window.event;

                var error = $(e.srcElement).parents('li').find('.multiple-condition')

                if( $this == '' ){

                    error.show();

                }else{

                    if(mny.test($this)){

                        error.hide();

                    }else{

                        error.show();

                    }

                }


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
    //getRY(true);

    //选中加班人的数组（第三层）
    var _tempWorkerArr = [];

    //选中加班人的数组（第二层）

    var _selectedWorkerArr = [];

    //加班类型
    var _JBType = [];

    personType();

    //当前删除的执行人员的编码
    var _$thisWorkerBM = '';

    //当前删除的人员的id
    var _$thisWorkerID = '';

    //所有工单
    var _gdArr = [];

    //相关工单
    GDselect(true);

    //已选择的工单数组
    var _gdSelected = [];

    //当前选中的加班编号
    var _thisJBBM = '';

    //当前选中的加班的id
    var _thisJBID = '';

    //标记当前进行的是登记操作
    var _signFlag = false;

    //当前操作的$(this)对象
    var _$this = '';

    //部们列表
    _WxBanzuStationData(_BZ);

    function _BZ(){

        _BZList($('#depart'),getRY(true));

    }

    /*-------------------------------------------------表格初始化----------------------------------------*/
    var tableListCol = [
        //{
        //    title:'加班id',
        //    data:'id',
        //},
        {
            title:'加班编号',
            data:'gdCode',
            className:'Tcode',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.id + '">' + data + '</span>'

            }
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
            title:__names.department,
            data:'ddName'
        },
        {
            title:'事由说明',
            data:'reason'
        },
        {
            title:'上级审批',
            data:'shenp1UserName'
        },
        {
            title:'调度中心审批',
            data:'shenp2UserName'
        },
        {
            title: '操作',
            "targets": -1,
            "data": null,
            "className": 'noprint',
            render:function(data, type, full, meta){

                //判断两个审批人，只要有一个不为空，就不能审批 full.isexamine =1显示审批，反之不显示
                if(full.isexamine == 1){

                    //full.shenp1UserName == ''说明肯定没有审核过

                    if(full.shenp1UserName == ''){

                        return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                            "<span class='data-option option-shenhe btn default btn-xs green-stripe'>审核</span>"+
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

                    }else{

                        //说明一级审批已过，显示二级审批

                        if(full.shenp2UserName == ''){

                            return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +

                                "<span class='data-option option-shenhe btn default btn-xs green-stripe'>审核</span>"

                        }else{

                            //二级审核已过
                            return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"

                        }



                    }



                }else if(full.isexamine == 0){

                    if(full.shenp1UserName == '' ){

                        return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

                    }else{

                        return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"

                    }

                }

            }
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
            data:'type',
            render:function(data, type, full, meta){

                var str = '<select class="workerSelect"><option value="">请选择</option>';

                if(data){

                    for(var i=0;i<_JBType.length;i++){

                        if( _JBType[i].id == data ){

                            str += '<option value="' + _JBType[i].id +
                                '" selected>' + _JBType[i].name + '</option>'

                        }else{

                            str += '<option value="' + _JBType[i].id +
                                '">' + _JBType[i].name + '</option>'

                        }

                    }



                }else{

                    for(var i=0;i<_JBType.length;i++){

                        str += '<option value="' + _JBType[i].id +
                            '">' + _JBType[i].name + '</option>'

                    }

                }

                str += '</select>';

                return str

            }
        },
        {
            title:'操作',
            targets: -1,
            data: 'id',
            render:function(data, type, full, meta){

                if(_signFlag){

                    return '<span data-id="' + data +
                        '" class="data-option option-delete btn default btn-xs green-stripe">删除</span>'

                }else{

                    return '<span data-id="' + data +
                        '" class="data-option option-edit btn default btn-xs green-stripe">编辑</span>'
                        +
                        '<span data-id="' + data +
                        '" class="data-option option-delete btn default btn-xs green-stripe">删除</span>'

                }



            }
        },

    ];

    _tableInit($('#worker-list'),workerListCol,2,true,'','',true,'');

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

            title:'部门',
            data:'departName'

        },
        {
            title:'联系电话',
            data:'mobile',
            className:'zxrphone'
        },
        {
            title:'人员类型',
            data:null,
            render:function(data, type, full, meta){

                var str = '<select class="workerSelect"><option value="">请选择</option>';

                for(var i=0;i<_JBType.length;i++){

                    str += '<option value="' + _JBType[i].id +
                        '">' + _JBType[i].name + '</option>'

                }

                str += '</select>';

                return str

            }
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

    //加班表格的操作----------------------------------------------------------------------------

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【新增】
    $('.creatButton').click(function(){

        //表示当前是登记操作
        _signFlag = true;

        //清除数组
        _selectedWorkerArr.length = 0;

        _tempWorkerArr.length = 0;

        $('#ADD-Modal').find('.datatimeblock').click();

        //初始化
        datilInit();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'新增','','','','新增');

        //是否可操作
        abledOption();

        //添加类
        $('#ADD-Modal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

    })

    //【新增确定】按钮
    $('#ADD-Modal').on('click','.dengji',function(){

        optionButton('YWFZ/JiaBanAdd',false,'新增成功！','新增失败！');

    })

    //表格【查看】按钮
    $('#table-list').on('click','.option-see',function(){

        //表示当前不是登记操作
        _signFlag = false;

        //初始化
        datilInit();

        //数据绑定
        bindData($(this),false);

        //模态框
        _moTaiKuang($('#ADD-Modal'),'查看','flag','','','');

    })

    //表格【编辑】按钮
    $('#table-list').on('click','.option-edit',function(){

        //表示当前不是登记操作
        _signFlag = false;

        //初始化
        datilInit();

        //数据绑定
        bindData($(this),true);

        $('#ADD-Modal').find('.datatimeblock').click();

        //模态框
        _moTaiKuang($('#ADD-Modal'),'编辑','','','','保存');

        //添加类
        $('#ADD-Modal').find('.modal-footer').children('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');

    })

    //表格【编辑确定】按钮
    $('#ADD-Modal').on('click','.bianji',function(){

        optionButton('YWFZ/JiaBanUpdate',true,'编辑成功！','编辑失败！');

    })

    //表格【删除】按钮
    $('#table-list').on('click','.option-delete',function(){

        //表示当前不是登记操作
        _signFlag = false;

        //初始化
        datilInit();

        //数据绑定
        bindData($(this),false);

        //模态框
        _moTaiKuang($('#ADD-Modal'),'确定要删除吗？','','','','删除');

        //添加类
        $('#ADD-Modal').find('.modal-footer').children('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');

    })

    //表格【删除确定】按钮
    $('#ADD-Modal').on('click','.shanchu',function(){

        optionButton('YWFZ/JiaBanDelete',true,'删除成功！','删除失败！');

    })

    //表格【审核】按钮
    $('#table-list').on('click','.option-shenhe',function(){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        _thisJBBM = $(this).parents('tr').children('td').eq(0).children().html();

        //初始化
        $('#examine-Modal').find('#examineBlock').find('input').val('');

        $('#examine-Modal').find('#examineBlock').find('textarea').val('');

        $('#radioblock').find('input').parent('span').removeClass('checked');

        $('#radioblock').find('input').eq(0).parent('span').addClass('checked');


        //赋值
        $('#examineBlock').children('li').find('input').val(_thisJBBM);

        //模态框
        _moTaiKuang($('#examine-Modal'),'审核','','','','审核');

    })

    //表格【审核确定】按钮
    $('#examine-Modal').on('click','.shenhe',function(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JiaBanShenpi',
            data:{
                //加班编码
                gdCode:_thisJBBM,
                //当前用户编号
                userNum:_userIdNum,
                //当前用户名
                username:_userIdName,
                //当前用户部门编号
                userdepartNum:_loginUser.departNum,
                //当前用户角色
                userRole:_loginUser.role,
                //审批意见
                shenpopinion:$('#examineBlock').find('textarea').val(),
                //审批结果
                isexamine:$('#radioblock').find('.checked').children().attr('attr-value')
            },
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','审核成功！','');

                    conditionSelect();

                    $('#examine-Modal').modal('hide');

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','审核失败！','');


                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    })

    //审核单选按钮事件
    $('#radioblock').on('click','input',function(){

        $('#radioblock').find('input').parent('span').removeClass('checked');

        $(this).parent('span').addClass('checked');

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

        if( !_signFlag ){

            _tempWorkerArr.length = 0;

        }

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
    $('#zhixingRenTable tbody').on('click','tr',function(e){

        if(e.target.className === 'workerSelect'){

            return

        }

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

        //首先要判断是登记还是编辑情况
        //首先确定选中的执行人（第二层）

        var arr = $('#zhixingRenTable tbody').find('.checked');

        if(_signFlag){

            for(var i=0;i<arr.length;i++){

                var bm = arr.eq(i).parents('tr').children('td').eq(1).html();

                var type = arr.eq(i).parents('tr').children('td').eq(1).attr('data-type');

                for(var j=0;j<_JBPerson.length;j++){

                    if(_JBPerson[j].userNum == bm){

                        _JBPerson[j].type = type;

                        _tempWorkerArr.push(_JBPerson[j]);

                    }

                }

            }

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

            _datasTable($('#worker-list'),_selectedWorkerArr);

        }else{

            _tempWorkerArr.length = 0;

            for(var i=0;i<arr.length;i++){

                var bm = arr.eq(i).parents('tr').children('td').eq(1).html();

                var type = arr.eq(i).parents('tr').children('td').eq(1).attr('data-type');

                for(var j=0;j<_JBPerson.length;j++){

                    if(_JBPerson[j].userNum == bm){

                        if(_selectedWorkerArr.length == 0){

                            _JBPerson[j].type = type;

                            _tempWorkerArr.push(_JBPerson[j]);

                        }else{

                            for(var k=0;k<_selectedWorkerArr.length;k++){

                                if(_selectedWorkerArr[k].userNum == _JBPerson[j].userNum ){

                                    break;

                                }else if(k == _selectedWorkerArr.length-1){

                                    _JBPerson[j].type = type;

                                    _tempWorkerArr.push(_JBPerson[j]);

                                }

                            }

                        }

                    }

                }

            }

            if(_tempWorkerArr.length == 0){

                _moTaiKuang($('#myModal2'),'提示','flag','istap','人员已存在!','');

                $('#Worker-Modal').modal('hide');

            }else{


                if(_tempWorkerArr.length == 1){

                    //调接口
                    $.ajax({

                        type:'post',
                        url:_urls + 'YWFZ/JBRenAdd',
                        data:{

                            //加班编号
                            gdCode:_thisJBBM,
                            //人员编号
                            userNum:_tempWorkerArr[0].userNum,
                            //人员姓名
                            userName:_tempWorkerArr[0].userName,
                            //人员类型
                            type:_tempWorkerArr[0].type,

                        },
                        beforeSend: function () {
                            $('#theLoading').modal('show');
                        },
                        complete: function () {
                            $('#theLoading').modal('hide');
                        },
                        timeout:_theTimes,
                        success:function(result){

                            if(result == 99){

                                _moTaiKuang($('#myModal2'),'提示','flag','istap','添加人员成功!','');

                                $('#Worker-Modal').modal('hide');

                                refreshWorker();

                            }else{

                                _moTaiKuang($('#myModal2'),'提示','flag','istap','添加人员失败!','');

                            }

                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR.responseText);
                        }

                    })

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','一次只能添加一个值班人!','');

                }

            }


        }



    })

    //执行人静态删除
    $('#worker-list tbody').on('click','.option-delete',function(){

        //提示
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除吗？','删除');

        //添加类
        $('#DEL-Modal').find('.btn-primary').addClass('removeWorker');

        _$thisWorkerBM = $(this).parents('tr').children().eq(0).html();

        _$thisWorkerID = $(this).attr('data-id');

        _$this = $(this);

    })

    //执行人静态删除确定按钮(同时调用接口);
    $('#DEL-Modal').on('click','.removeWorker',function(){

        //如果_signFlag = true,只执行静态删除操作，如果是false执行静态同时发送请求

        if(_signFlag){

            for(var i=0;i<_selectedWorkerArr.length;i++ ){

                if(_$thisWorkerBM == _selectedWorkerArr[i].userNum){

                    _selectedWorkerArr.remove(_selectedWorkerArr[i]);

                }

            }

            _datasTable($('#worker-list'),_selectedWorkerArr);

            //模态框消失
            $('#DEL-Modal').modal('hide');

        }else{

            $.ajax({

                type:'post',
                url:_urls + 'YWFZ/JBRenDelete',
                data:{

                    id:_$thisWorkerID

                },
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                timeout:_theTimes,
                success:function(result){

                    if(result == 99){

                        $('#DEL-Modal').modal('hide');

                        _moTaiKuang($('#myModal2'),'提示','flag','istap','加班人删除成功!','');

                        refreshWorker();

                    }else{

                        //提示删除失败
                        _moTaiKuang($('#myModal2'),'提示','flag','istap','加班人删除失败!','');

                    }

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }

            })

        }

    })

    //执行人人员类型
    $('#zhixingRenTable').on('change','.workerSelect',function(){

        $(this).parents('tr').children('td').eq(1).attr('data-type',$(this).val());

    })

    //执行人表格【编辑】
    $('#worker-list').on('click','.option-edit',function(){

        $(this).removeClass('option-edit').addClass('option-save').html('保存');

        $(this).parents('tr').find('select').attr('disabled',false).removeClass('disabled-block');

        _$this = $(this);

    })

    //执行人表格【保存】
    $('#worker-list').on('click','.option-save',function(){

        _$this = $(this);

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JBRenUpdate',
            data:{
                //id
                id:$(this).attr('data-id'),

                //人员编号
                userNum:$(this).parents('tr').children('td').eq(0).html(),

                //人员名称
                userName:$(this).parents('tr').children('td').eq(1).html(),

                //type
                type:$(this).parents('tr').find('select').val(),

                //加班编号
                gdCode:_thisJBBM
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','加班人员修改成功！','');

                    _$this.removeClass('option-save').addClass('option-delete ').html('编辑');

                    _$this.parents('tr').find('select').attr('disabled',true).addClass('disabled-block');

                }else{

                    _moTaiKuang($('#myModal2'),'提示','flag','istap','加班人员修改失败！','');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

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

        //状态值select初始化
        $('#gdzt').val(0);

        //材料申请已审批的checked
        $('#isExamine').parents('span').addClass('checked');

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

        var arr = [];

        _datasTable($('#worker-list'),arr);

    }

    //登记、编辑、删除（登记的时候是false，编辑，删除的时候是true）;
    function optionButton(url,flag,successMeg,errorMeg){

        //非空验证
        if( datailVue.station == '' || datailVue.reason == '' || datailVue.faultDes == '' || datailVue.aboutGD == '' || datailVue.stTime == '' || datailVue.etTime == '' || datailVue.buildHeight == '' ||  datailVue.moneyType == '' || _selectedWorkerArr.length == 0 ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请输入红色必填项', '');

        }else{

            //验证开始时间和结束时间
            if(!timeCompare(datailVue.stTime,datailVue.etTime)){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'开始时间要小于结束时间', '');

                return false;

            }

            //验证加班时长格式

            var o = $('#ADD-Modal').find('.multiple-condition');

            var isShow = false;

            for(var i=0;i< o.length;i++){

                if(o.eq(i).css('display') != 'none'){

                    isShow = true;

                    break;

                }

            }

            if(isShow){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请输入正确的格式', '');

                return false;

            }

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
                moneyType:Number(datailVue.moneyType),
                //高度
                height:datailVue.buildHeight,
                //所属部门编号
                departNum:_loginUser.departNum,
                //所属部门名称
                departName:_loginUser.departName,


            };

            if(flag){

                //工单code
                prm.gdCode = _thisJBBM;

                //id
                prm.id = _thisJBID;

            }else{

                //加班人员集合
                prm.jbRenList = arr;

            }

            $.ajax({

                type:'post',
                url:_urls + url,
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                timeout:_theTimes,
                success:function(result){

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

                //选择车站按钮可操作
                $('#select-DEV').attr('disabled',false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //本部门人员数据
    function getRY(flag){

        var prm = {
            "username": $('#zxName').val(),
            "usernum": $('#zxNum').val(),
            "userID": _userIdNum,
            "userName":_userIdName,

        }

        if(flag){

            prm.departnum = _maintenanceTeam;

        }else{

            var depart = '';

            if( $('#depart').val() == '' ){

                depart = _maintenanceTeam;

            }else{

                depart = $('#depart').val();

            }

            prm.departnum = depart;

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWFZ/ReturnUserList',
            data:prm,
            success:function(result){

                if(flag){

                    _JBPerson.length = 0;

                    for(var i=0;i<result.length;i++){

                        _JBPerson.push(result[i]);

                    }

                }

                _datasTable($('#zhixingRenTable'),result);

                $('#select-WK').attr('disabled',false);
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
            success:function(result){

                if(flag){

                    _gdArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _gdArr.push(result[i]);

                    }

                }

                _datasTable($('#GD-table'),result);

                $('#select-GD').attr('disabled',false);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //数据绑定（查看、删除false 编辑 true）;
    function bindData($this,flag){

        //样式
        $('#table-list tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        _thisJBBM = $this.parents('tr').children('td').eq(0).children().html();

        _thisJBID = $this.parents('tr').children('td').eq(0).children().attr('data-num');

        //发送请求
        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JiaBanReturnOne',
            data:{
                //当前加班编号
                gdCode:_thisJBBM
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            timeout:_theTimes,
            success:function(result){

                //数据绑定
                //车站名称
                datailVue.station = result.ddName;

                $('#ADD-Modal').find('.station').attr('data-num',result.ddNum);

                //事由说明
                datailVue.reason = result.reason;

                //故障描述
                datailVue.faultDes = result.descs;

                //相关工单
                datailVue.aboutGD = result.gdCodeRef;

                //计划开始时间
                datailVue.stTime = result.planBeginTime.split('T')[0] + ' ' + result.planBeginTime.split('T')[1];

                //计划结束时间
                datailVue.etTime = result.planStopTime.split('T')[0] + ' ' + result.planStopTime.split('T')[1];

                //施工高度
                datailVue.buildHeight = result.height;

                //加班人
                datailVue.overtimeP = '';
                //时长类型
                datailVue.moneyType = result.moneyType;

                //将加班人push到_selectedWorkerArr中

                _selectedWorkerArr.length = 0;

                //加班人
                if(result.jbRenList){

                    _datasTable($('#worker-list'),result.jbRenList);

                    _selectedWorkerArr = result.jbRenList;

                }else{

                    var arr = [];

                    _datasTable($('#worker-list'),arr);

                }


                //操作性
                if(flag){

                    //可操作
                    abledOption();

                    //表格中的select不可操作
                    $('#ADD-Modal').find('select').attr('disabled',true).addClass('disabled-block');

                }else{

                    //不可操作
                    disabledOption();

                }


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //不可操作
    function disabledOption(){

        //input框不能操作
        $('#ADD-Modal').find('input').attr('disabled',true).addClass('disabled-block');

        //select框不能操作
        $('#ADD-Modal').find('select').attr('disabled',true).addClass('disabled-block');

        //选择按钮不可操作
        $('.select-CZ').attr('disabled',true);

        //表格中的按钮是否能操作
        $('#worker-list').find('.option-delete,.option-edit').attr('disabled',true);
    }

    //可操作
    function abledOption(){

        //input框能操作
        $('#ADD-Modal').find('input').attr('disabled',false).removeClass('disabled-block');

        //select框能操作
        $('#ADD-Modal').find('select').attr('disabled',false).removeClass('disabled-block');

        //车站不能输入
        $('.station').attr('disabled',true);

        //相关工单也不能输入
        $('.aboutGD').attr('disabled',true);

        //表格中的按钮是否能操作
        $('#worker-list').find('.option-delete').attr('disabled',false);

        //选择按钮可操作
        $('.select-CZ').attr('disabled',false);

    }

    //局部刷新人员列表
    function refreshWorker(){

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JiaBanReturnOne',
            data:{

                gdCode:_thisJBBM
            },
            success:function(result){


                if(result){

                    if(result.jbRenList){

                        _datasTable($('#worker-list'),result.jbRenList);

                        _selectedWorkerArr.length = 0;

                        _selectedWorkerArr = result.jbRenList;

                        $('#worker-list').find('select').attr('disabled',true).addClass('disabled-block');

                    }else{

                        _selectedWorkerArr.length = 0;

                        _datasTable($('#worker-list'),_selectedWorkerArr);
                    }

                }


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //时间比大小,st<et返回真
    function timeCompare(st,et){

        var stValue = st;

        stValue = stValue.replace(/-/g,"/");

        var etValue = et;

        etValue = etValue.replace(/-/g,"/");

        var stNum = new Date(Date.parse(stValue));

        var etNum = new Date(Date.parse(etValue));

        //结束时间必须大于结束时间
        if(stNum < etNum){

            return true;

        }else{


            return false;

        }

    }


})