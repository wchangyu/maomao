$(function(){

    /*------------------------------------------------------时间插件-------------------------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));

    //设置初始时间
    var now = moment().format('YYYY/MM/DD');

    var st = moment(now).subtract(6,'months').format('YYYY/MM/DD');

    $('.condition-query').eq(0).find('.min').val(st);

    $('.condition-query').eq(0).find('.max').val(now);

    /*------------------------------------------------------变量------------------------------------------------*/
    //当前选中的巡检计划编码
    var _thisPlanBM = '';

    //第一层选中待下发设备数组
    var _firstTaskArr = [];

    //当前选中的待下发设备数组
    var _secondTaskArr = [];

    //第一层选中的执行人
    var _firstPersonArr = [];

    //第二层选中的执行人
    var _secondPersonArr = [];

    //当前设备任务的id
    var _thisDevID ='';

    //当前选中的任务的部门
    var _thisDepNum = '';

    //当前选中的执行人的工号
    var _thisPersonNum = '';

    //部门
    getDepart();

    /*------------------------------------------------------表格初始化-------------------------------------------*/
    //主表格
    var mainCol = [

        {
            title:'巡检计划名称',
            data:'dipName'
        },
        {
            title:'巡检计划编码',
            data:'dipNum',
            className:'dipNum'
        },
        {
            title:'巡检部门',
            data:'keShi',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.keShiNum + '">' + data + '</span>'

            }
        },
        {
            title:'已下发',
            data:'fenpei'
        },
        {
            title:'待下发',
            data:'notfenpei'
        },
        {
            title:'操作',
            "data": 'isActive',
            "render":function(data, type, full, meta){

                return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                    "<span class='data-option option-edite btn default btn-xs green-stripe'>下发</span>"

            }
        }

    ];

    _tableInit($('#scrap-datatables'),mainCol,1,true,'','','','');

    $('#theLoading').modal('show');

    conditionSelect();

    //查看详情
    var detailCol = [

        {
            title:'设备编码',
            data:'dNum'
        },
        {
            title:'设备名称',
            data:'dName'
        },
        {
            title:'巡检编码',
            data:'dipNum'
        },
        {
            title:'巡检名称',
            data:'dipName'
        },
        {
            title:'巡检任务编码',
            data:'itkNum'
        },
        {
            title:'巡检任务名称',
            data:'itkName'
        },
        {
            title:'状态',
            data:'isAllot',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '已下发'

                }else{

                    return '待下发'

                }
            }
        },
        {
            title:'执行人',
            data:'memberLike'
        },
        {
            title:'巡检部门',
            data:'keShi'
        }
    ];

    _tableInit($('#detail-table'),detailCol,2,'','','','','',10);

    //所有下发列表
    var IssuedCol = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'设备编码',
            data:'dNum',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.id + '">' + data + '</span>'
            }
        },
        {
            title:'设备名称',
            data:'dName'
        },
        {
            title:'巡检计划名称',
            data:'dipName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.dipNum + '">' + data + '</span>'
            }
        },
        {
            title:'巡检任务名称',
            data:'itkName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.itkNum + '">' + data + '</span>'
            }
        },
        {
            title:'状态',
            data:'IsAllot',
            render:function(data, type, full, meta){

                if(data == 1){
                    return '已下发'
                }else{
                    return '待下发'
                }
            }
        },
        {
            title:'巡检部门',
            data:'keShi'
        },
        {
            title:'时间',
            data:'tkTime',
            render:function(data, type, full, meta){

                if(data != ''){

                    return data.split('T')[0];

                }else{

                    return ''

                }
            }
        }
    ];

    _tableInit($('#Issued-table'),IssuedCol,2,'','','','','',10);

    //已选中的将要下发的列表
    var selectedIssuedCol = [

        {
            title:'设备编码',
            data:'dNum',
            render:function(data, type, full, meta){

                return '<span data-id="' + full.id + '">' + data + '</span>'
            }
        },
        {
            title:'设备名称',
            data:'dName'
        },
        {
            title:'巡检计划名称',
            data:'dipName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.dipNum + '">' + data + '</span>'
            }
        },
        {
            title:'巡检任务名称',
            data:'itkName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.itkNum + '">' + data + '</span>'
            }
        },
        {
            title:'巡检部门',
            data:'keShi'
        },
        {
            title:'时间',
            data:'tkTime',
            render:function(data, type, full, meta){

                if(data.indexOf('T')>=0){

                    if(data != ''){

                        return data.split('T')[0];

                    }else{

                        return ''

                    }

                }else{

                    return data

                }


            }
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": '<span class="data-option option-del btn default btn-xs green-stripe">删除</span>'
        }

    ];

    _tableInit($('#selected-Issued-table'),selectedIssuedCol,2,'','','','','',10);

    //选择执行人
    var choiceWorkCol = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'dipRenNum',
        },
        {
            title:'执行人员',
            data:'userName',
            className:'dipRen'
        },
        {
            title:'联系电话',
            data:'mobile',
            className:'dipDh'
        },

    ];
    _tableInit($('#zhixingRenTable'),choiceWorkCol,2,'','','');

    //已选中的执行人列表
    var selectedPersonCol = [

        {
            title:'工号',
            data:'userNum',
            className:'dipRenNum',
        },
        {
            title:'执行人员',
            data:'userName',
            className:'dipRen'
        },
        {
            title:'联系电话',
            data:'mobile',
            className:'dipDh'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": '<span class="data-option option-del btn default btn-xs green-stripe">删除</span>'
        }
    ];

    _tableInit($('#selected-Person-table'),selectedPersonCol,2,'','','','','',10);

    //添加表头复选框
    var creatCheckBox = '<div class="checker"><span><input type="checkbox"></span></div>';

    $('thead').find('.checkeds').prepend(creatCheckBox);

    /*--------------------------------------------------------按钮事件------------------------------------------*/

    //【查询】
    $('#selected').click(function(){

        $('#theLoading').modal('show');

        conditionSelect();

    })

    //【重置】
    $('.reset').click(function(){

        $('.condition-query').eq(0).find('input').val('');

        $('.condition-query').eq(0).find('.min').val(st);

        $('.condition-query').eq(0).find('.max').val(now);

    })

    //表格【查看】
    $('#scrap-datatables tbody').on('click','.option-see',function(){

        //样式
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //计划编码赋值
        _thisPlanBM = $(this).parents('tr').children().eq(1).html();

        //初始化
        var arr = [];

        _datasTable($('#detail-table'),arr);

        //模态框
        _moTaiKuang($('#Detail-Modal'),'查看','flag','','','');

        //数据绑定
        seeDetail();

    })

    //表格【下发】
    $('#scrap-datatables tbody').on('click','.option-edite',function(){

        //初始化
        IssueInit();

        //计划编码赋值
        _thisPlanBM = $(this).parents('tr').children().eq(1).html();

        //当前班组
        _thisDepNum = $(this).parents('tr').children().eq(2).children().attr('data-num');

        //模态框
        _moTaiKuang($('#Issued-Modal'),'下发', '', '' ,'', '下发');

        //获取已选中的执行人
        selectedPersonList();

    })

    //下发表格的【多选】
    $('#Issued-table tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent().removeClass('checked');

            //全选按钮不勾选
            $('#Issued-table thead').find('input').parent().removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent().addClass('checked');

            var trLength = $('#Issued-table tbody').children('tr').length;

            var hoverLength = $('#Issued-table tbody').children('.tables-hover').length;

            if(trLength == hoverLength){

                //全选按钮勾选
                $('#Issued-table thead').find('input').parent().addClass('checked');

            }else{

                //全选按钮不勾选
                $('#Issued-table thead').find('input').parent().removeClass('checked');

            }

        }

    })

    //全选
    $('#Issued-table thead').on('click','input',function(){

        if($(this).parent().hasClass('checked')){

            $(this).parent().removeClass('checked');

            $('#Issued-table tbody').children('tr').removeClass('tables-hover');

            $('#Issued-table tbody').find('input').parent().removeClass('checked');

        }else{

            $(this).parent().addClass('checked');

            $('#Issued-table tbody').children('tr').addClass('tables-hover');

            $('#Issued-table tbody').find('input').parent().addClass('checked');

        }

    })

    //【选择要下发的设备列表】
    $('#Issued-Modal').find('.selectTaskButton').click(function(){

        //初始化
        var arr = [];

        _datasTable($('#Issued-table'),arr);

        //全选按钮不勾选
        $('#Issued-table thead').find('input').parent().removeClass('checked');

        //模态框
        _moTaiKuang($('#Issued-List-Modal'),'选择要下发的任务','','','','选择');

        //获取待下发列表
        IssuedDetail();

    })

    //第二层设备选择按钮
    $('#Issued-List-Modal').find('.btn-primary').click(function(){

        //选择
        var checkedArr = $('#Issued-table tbody').children('.tables-hover');

        _secondTaskArr.length = 0;

        for(var i=0;i<checkedArr.length;i++){

            var obj = {};

            //id
            obj.id = checkedArr.eq(i).children().eq(1).children().attr('data-id');

            //设备编码
            obj.dNum = checkedArr.eq(i).children().eq(1).children().html();

            //设备名称
            obj.dName = checkedArr.eq(i).children().eq(2).html();

            //巡检计划名称
            obj.dipName = checkedArr.eq(i).children().eq(3).children().html();

            //巡检任务名称
            obj.itkName = checkedArr.eq(i).children().eq(4).children().html();

            //巡检任务编号
            obj.itkNum = checkedArr.eq(i).children().eq(4).children().attr('data-num');

            //巡检部门
            obj.keShi =  checkedArr.eq(i).children().eq(6).html();

            //时间
            obj.tkTime = checkedArr.eq(i).children().eq(7).html();

            _secondTaskArr.push(obj);

        }

        //模态框消失
        $('#Issued-List-Modal').modal('hide');

        //与_firstTaskArr去重
        if(_firstTaskArr.length == 0){

            for(var i=0;i<_secondTaskArr.length;i++){

                _firstTaskArr.push(_secondTaskArr[i]);

            }

        }else{

            //重复的数组
            var arr = [];

            for(var i=0;i<_secondTaskArr.length;i++){

                for(var j=0;j<_firstTaskArr.length;j++){

                    if(_secondTaskArr[i].id == _firstTaskArr[j].id){

                        arr.push(_secondTaskArr[i]);

                    }

                }

            }

            //去重
            for(var i=0;i<arr.length;i++){

                _secondTaskArr.remove(arr[i]);

            }

            for(var i=0;i<_secondTaskArr.length;i++){

                _firstTaskArr.push(_secondTaskArr[i]);

            }

        }

        _datasTable($('#selected-Issued-table'),_firstTaskArr);

    })

    //第一层设备删除按钮
    $('#selected-Issued-table tbody').on('click','.option-del',function(){

        //样式
        $('#selected-Issued-table tbody').children().removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //模态框
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除吗？','删除');

        //类
        $('#DEL-Modal').find('.btn-primary').removeClass('del-Person').addClass('del-Task');

        _thisDevID = $(this).parents('tr').children().eq(0).children().attr('data-id');

    })

    //第一层设备删除确定按钮
    $('#DEL-Modal').on('click','.del-Task',function(){

        _firstTaskArr.removeByValue(_thisDevID,'id');

        _datasTable($('#selected-Issued-table'),_firstTaskArr);

        //模态框
        $('#DEL-Modal').modal('hide');

    })

    //【选择执行人】
    $('#Issued-Modal').find('.selectPersonButton').click(function(){

        //初始化
        $('#Person-Modal').find('.executor-li').find('input').val('');

        $('#bm').val('');

        $('#bm').val(_thisDepNum);

        //表格全选按钮初始化
        $('#zhixingRenTable thead').find('input').parent().removeClass('checked');

        //模态框
        _moTaiKuang($('#Person-Modal'), '执行人列表', '', '' ,'', '选择');

        //获取执行人列表
        getExecutor();
    })

    //执行人条件查询
    $('.zhixingButton').click(function(){

        getExecutor();

    })

    //执行人tr选择
    $('#zhixingRenTable tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent().removeClass('checked');

            $('#zhixingRenTable thead').find('input').parent().removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent().addClass('checked');

            var trLength = $('#zhixingRenTable tbody').children('tr').length;

            var hoverLength = $('#zhixingRenTable tbody').children('.tables-hover').length;

            if(trLength == hoverLength){

                $('#zhixingRenTable thead').find('input').parent().addClass('checked');

            }else{

                $('#zhixingRenTable thead').find('input').parent().removeClass('checked');

            }

        }

    })

    //全选
    $('#zhixingRenTable thead').on('click','input',function(){

        if($(this).parent().hasClass('checked')){

            $(this).parent().removeClass('checked');

            $('#zhixingRenTable tbody').children('tr').removeClass('tables-hover');

            $('#zhixingRenTable tbody').find('input').parent().removeClass('checked');

        }else{

            $(this).parent().addClass('checked');

            $('#zhixingRenTable tbody').children('tr').addClass('tables-hover');

            $('#zhixingRenTable tbody').find('input').parent().addClass('checked');

        }

    })

    //执行人弹窗确定事件
    $('#Person-Modal').on('click','.addZXR',function(){

        var checkedArr = $('#zhixingRenTable tbody').children('.tables-hover');

        _secondPersonArr.length = 0;

        //重复的数组
        var arr = [];

        for(var i=0;i<checkedArr.length;i++){

            var obj = {};
            //工号
            obj.userNum = checkedArr.eq(i).children('').eq(1).html();
            //姓名
            obj.userName = checkedArr.eq(i).children('').eq(2).html();
            //联系电话
            obj.mobile = checkedArr.eq(i).children('').eq(3).html();
            //部门
            obj.dipKeshi = $('#bm').val();

            _secondPersonArr.push(obj);

        }

        if(_firstPersonArr.length == 0){

            for(var i=0;i<_secondPersonArr.length;i++){

                _firstPersonArr.push(_secondPersonArr[i]);

            }

        }else{

            //去重
            for(var i=0;i<_secondPersonArr.length;i++){

                for(var j=0;j<_firstPersonArr.length;j++){

                    if(_secondPersonArr[i].userNum == _firstPersonArr[j].userNum){

                        arr.push(_secondPersonArr[i]);

                    }

                }

            }

            for(var i=0;i<arr.length;i++){

                _secondPersonArr.remove(arr[i]);

            }

            for(var i=0;i<_secondPersonArr.length;i++){

                _firstPersonArr.push(_secondPersonArr[i]);

            }

        }

        console.log(_firstPersonArr);

        _datasTable($('#selected-Person-table'),_firstPersonArr);

        $('#Person-Modal').modal('hide');

    })

    //第一层执行人表格删除按钮
    $('#selected-Person-table tbody').on('click','.option-del',function(){

        //样式
        $('#selected-Person-table tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //模态框
        _moTaiKuang($('#DEL-Modal'),'提示','','istap','确定要删除吗？','删除');

        //类
        $('#DEL-Modal').find('.btn-primary').removeClass('del-Task').addClass('del-Person');

        //赋值
        _thisPersonNum = $(this).parents('tr').children().eq(0).html();

    })

    //第一层执行人删除确定按钮
    $('#DEL-Modal').on('click','.del-Person',function(){

        _firstPersonArr.removeByValue(_thisPersonNum,'userNum');

        _datasTable($('#selected-Person-table'),_firstPersonArr);

        $('#DEL-Modal').modal('hide');

    })

    //下发
    $('#Issued-Modal').on('click','.btn-primary',function(){

        ensureIssued();

    })

    /*--------------------------------------------------------其他方法------------------------------------------*/

    //条件查询
    function conditionSelect(){

        var prm = {
            //巡检任务编号
            itkNum:$('.condition-query').eq(0).find('input').eq(1).val(),
            //巡检任务名称
            itkName:$('.condition-query').eq(0).find('input').eq(0).val(),
            //开始时间
            ditST:$('.condition-query').eq(0).find('input').eq(2).val(),
            //结束时间
            ditET:moment($('.condition-query').eq(0).find('input').eq(3).val()).add(1,'d').format('YYYY/MM/DD'),
            //当前用户
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName,
            //当前角色
            b_UserRole:_userRole,
            //当前用户所属部门
            b_DepartNum:_maintenanceTeam

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWDevIns/YWDITGetTasKsAllot',
            timeout:_theTimes,
            data:prm,
            success:function(result){

                $('#theLoading').modal('hide');

                _datasTable($('#scrap-datatables'),result);
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

    //数据绑定(已分配、未分配)
    function IssuedDetail(){

        $.ajax({

            type:'post',
            url:_urls + 'YWDevIns/YWDITGetPlanTasKs',
            data:{
                //巡检计划编号
                dipNum:_thisPlanBM,
                //用户id
                userID: _userIdNum,
                //用户名
                userName: _userIdName,
                //开始时间
                ditST:$('.min').val(),
                //结束时间
                ditET:moment($('.max').val()).add(1,'d').format('YYYY/MM/DD')

            },
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

            },
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#Issued-table'),result);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //模态框消失
                $('#theLoading').modal('hide');
                //失败提示
                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }

        })

    }

    //查看详情
    function seeDetail(){

        $.ajax({

            type:'post',
            url:_urls + 'YWDevIns/YWDITGetTasKsDetails',
            data:{
                //巡检计划编号
                dipNum:_thisPlanBM,
                //用户id
                userID: _userIdNum,
                //用户名
                userName: _userIdName,
                //开始时间
                ditST:$('.min').val(),
                //结束时间
                ditET:moment($('.max').val()).add(1,'d').format('YYYY/MM/DD')

            },
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

            },
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#detail-table'),result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //模态框消失
                $('#theLoading').modal('hide');
                //失败提示
                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }

        })

    }

    //已选中的执行人
    function selectedPersonList(){

        $.ajax({

            type:'post',
            url:_urls + 'YWDevIns/YWDIPGetItemAndMembers',
            data:{

                //计划编码
                dipNum:_thisPlanBM,
                //当前用户
                userID:_userIdNum,
                //当前用户名
                userName:_userIdName,
                //当前角色
                b_UserRole:_userRole,
                //当前用户所属部门
                b_DepartNum:_maintenanceTeam

            },
            timeout:_theTimes,
            success:function(result){

                if(result.dipMembers){

                    _firstPersonArr.length = 0;

                    for(var i=0;i<result.dipMembers.length;i++){

                        var obj = {};

                        //工号
                        obj.userNum = result.dipMembers[i].dipRenNum;

                        //用户名
                        obj.userName = result.dipMembers[i].dipRen;

                        //手机
                        obj.mobile = result.dipMembers[i].dipDh;

                        _firstPersonArr.push(obj);

                    }

                    _datasTable($('#selected-Person-table'),_firstPersonArr);

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

    //获取部门
    //获取部门(true时，获得所有数组)
    function getDepart(){

        $.ajax({

            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:{

                userID:_userIdNum,
                userName:_userIdName,
                departName:$('.sbmc1').val(),
                isWx:1
            },
            timeout:_theTimes,
            success:function(result){

                //根据筛选部门

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>'


                }

                $('#bm').empty().append(str);

                _datasTable($('#department-table'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //获取执行人
    function getExecutor(){

        var prm = {

            userName2:$('#zxName').val(),
            userNum:$('#zxNum').val(),
            zxPhone:$('#zxPhone').val(),
            departNum:$('#bm').val(),
            userID:_userIdNum,
            userName:_userIdName

        }
        $.ajax({

            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#zhixingRenTable'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }


        })

    }

    //下发
    function ensureIssued(){

        if(_firstTaskArr.length == 0 || _firstPersonArr.length == 0){

            _moTaiKuang($('#myModal2'),'提示',true,'istap','任务以及执行人列表均不能为空！','');

        }else{

            $('#Issued-Modal').modal('hide');

            //首先获取所选巡检任务的编码
            var taskArr = [];

            for(var i=0;i<_firstTaskArr.length;i++){

                var obj = {};

                obj.itkNum =  _firstTaskArr[i].itkNum;

                taskArr.push(obj);

            }

            var personArr = [];

            //执行人编码
            for(var i=0;i<_firstPersonArr.length;i++){

                var obj = {};

                //执行人姓名
                obj.itkRenNum = _firstPersonArr[i].userNum;

                //执行人工号
                obj.itkRen = _firstPersonArr[i].userName;

                personArr.push(obj);

            }

            $.ajax({

                type:'post',
                url:_urls + 'YWDevIns/YWDITTasKsAllot',
                data:{
                    //巡检任务集合
                    taskIDModelList:taskArr,
                    //执行人集合
                    memberModelList:personArr,
                    //当前用户
                    userID:_userIdNum,
                    //当前用户名
                    userName:_userIdName,
                    //当前角色
                    b_UserRole:_userRole,
                    //当前用户所属部门
                    b_DepartNum:_maintenanceTeam

                },
                timeout:_theTimes,
                success:function(result){

                    if(result == 99){

                        $('#Issued-Modal').modal('hide');

                        _moTaiKuang($('#myModal2'),'提示',true,'istap','下发任务成功!','');

                        conditionSelect();

                    }else{

                        _moTaiKuang($('#myModal2'),'提示',true,'istap','下发任务失败!','');

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

    }

    //下发初始化
    function IssueInit(){

        var arr = [];

        //任务表格
        _datasTable($('#selected-Issued-table'),arr);

        //执行人表格
        _datasTable($('#selected-Person-table'),arr);

    }

})