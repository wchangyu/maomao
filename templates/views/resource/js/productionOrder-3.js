//工单号
var _gdCode = '';

$(function(){

    /*--------------------------------------时间插件---------------------------------*/
    _timeYMDComponentsFun($('.condition-query').eq(0).find('.datatimeblock'));

    var now = moment().format('YYYY/MM/DD');

    var st = moment(now).subtract(6,'months').format('YYYY/MM/DD');

    //显示时间
    $('.min').val(st);

    $('.max').val(now);

    //datatimepicker故障发生时间；

    _timeHMSComponentsFun($('.otime'),1);

    /*-------------------------------------变量---------------------------------------*/

    //同一车站未闭环
    $('.table-caption').html('同一'+ __names.department +'未闭环的工单');

    //基本信息模态框
    var detaileVue = new Vue({

        el:'#workDones',
        data:{

            //工单号
            gdCode:'',
            //工单状态
            state:'',
            //工单类型
            picked:0,
            //任务来源
            gdly:1,
            //任务级别
            rwlx:4,
            //报修电话
            telephone:'',
            //报修人信息
            person:'',
            //故障位置
            place:'',
            //线路
            lineRoute:'',
            //车站
            section:'',
            //系统类型
            matter:'',
            //设备编码
            sbSelect:'',
            //设备名称
            sbMC:''

        }

    });

    //未闭环工单模态框
    var unclosedLoop = new Vue({

        el:'#myApp33',
        data:{

            //工单类型
            picked:'',
            //工单来源
            gdly:'',
            //任务级别
            rwlx:'',
            //报修电话
            telephone:'',
            //报修人信息
            person:'',
            //故障位置
            place:'',
            //车站
            section:'',
            //系统类型
            matter:'',
            //设备编码
            sbSelect:'',
            //设备名称
            sbMC:'',
            //维修班组
            sections:''

        }

    })

    //验证必填项（非空）
    Vue.validator('persons', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val = val.replace(/^\s+|\s+$/g, '');

        return /[^.\s]{1,500}$/.test(val);

    })

    //系统类型
    _getProfession('YWDev/ywDMGetDSs', $('.xitong'),false, 'dsNum' ,'dsName');

    //线路数组
    var _lineArr = [];

    //线路
    _ajaxFun('YWGD/ywGetDLines', _lineArr, $('.line-route'), 'dlName', 'dlNum' );

    var _stationArr = [];

    //车站
    stationData();
    //_ajaxFun('YWDev/ywDMGetDDs', _stationArr, $('.cjz'), 'ddName', 'ddNum' );

    //所有负责人数组
    var _allZXRArr = [];

    //保存所有部门的数组
    var _departmentArr = [];

    //标记部门是默认的还是手动选择的，如果是默认的话1，手动选择为2
    var _autoOrHand = 1;

    //当前选中的部门的对象
    var _determineDeObj = {};

    //已选择的执行人数组
    var _zhixingRens = [];

    //当前工单状态
    var _gdStatus = '';

    //当前工单
    var _gdCircle = '';

    //记录维修内容修改是否执行完成
    var _wxIsComplete = false;

    //记录维修内容修改是否执行成功
    var _wxIsSuccess = false;

    //负责人是否执行完成
    var _fzrIsComplete = false;

    //负责人是否执行成功
    var _fzrIsSuccess = false;

    //状态转换是否完成
    var _ztChangeIsComplete = false;

    //状态转换是否成功
    var _ztChangeIsSuccess = false;

    //重发是否完成
    var _reSendIsComplete = false;

    //重发是否完成
    var _reSendIsSuccess = false;

    //编辑是否完成
    var _editIsComplete = false;

    //编辑是否成功
    var _editIsSuccess = false;

    //维修科室
    var _wxObj = {};

    //条件查询车站
    addStationDom($('#bumen').parent());

    /*-------------------------------------表格初始化----------------------------------*/

    //受理表格
    var col1 = [
        {
            title:'工单号',
            data:'gdCode2',
            className:'gongdanId',
            render: function (data, type, row, meta) {
                return '<span gdCode="' + row.gdCode +
                    '" gdCircle="' + row.gdCircle +
                    '" gdZtz="' + row.gdZht +
                    '">' + data +
                    '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }if(data == 1){
                    return '快速'
                }
            }
        },
        {
            title:'工单状态',
            data:'gdZht',
            className:'gongdanZt',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '待下发'
                }if(data == 2){
                    return '待分派'
                }if(data == 3){
                    return '待执行'
                }if(data == 4){
                    return '执行中'
                }if(data == 5){
                    return '等待资源'
                }if(data == 6){
                    return '待关单'
                }if(data == 7){
                    return '任务关闭'
                }if(data == 999){
                    return '任务取消'
                }
            }
        },
        {
            title:'状态码',
            data:'gdZht',
            className:'ztz'
        },
        {
            title:__names.department,
            data:'bxKeshi'
        },
        {
            title:'设备类型',
            data:'wxShiX'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'登记时间',
            data:'gdShij'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "className":'noprint',
            "defaultContent": "<span class='data-option option-option btn default btn-xs green-stripe'>下发</span>" +
            "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>"

        }
    ];

    var _exportCol = [0,1,2,4,5,6,7];

    _tableInit($('#scrap-datatables'),col1,1,true,'','','',_exportCol);

    //权限
    _WxBanzuStationData(conditionSelect);

    //负责人表格初始化
    //已选择的执行人表格
    var fzrCol = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'工号',
            data:'userNum',
            className:'wxRen'
        },
        {
            title:'执行人员',
            data:'userName',
            className:'wxRName'
        },
        {
            title:'联系电话',
            data:'mobile',
            className:'wxRDh'
        },
        {
            class:'deleted',
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='tableDeleted data-option btn default btn-xs green-stripe'>删除</span>"
        }
    ];
    _tableInit($('#personTable1'),fzrCol,2,false,'','',true,_exportCol);

    //选择执行人表格初始化
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
    _tableInit($('#zhixingRenTable'),col3,2,false,'','','','');

    //负责人
    fzr(true);

    //同一车站未闭环工单
    var col2 = [
        {
            title:'工单号',
            data:'gdCode2',
            className:'gongdanId',
            render: function (data, type, row, meta) {
                return '<span gdCode="' + row.gdCode +
                    '" gdCircle="' + row.gdCircle +
                    '" gdZtz="' + row.gdZht +
                    '">' + data +
                    '</span>'
            }
        },
        {
            title:'工单类型',
            data:'gdJJ',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '普通'
                }if(data == 1){
                    return '快速'
                }
            }
        },
        {
            title:'工单状态',
            data:'gdZht',
            className:'gongdanZt',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '待下发'
                }if(data == 2){
                    return '待分派'
                }if(data == 3){
                    return '待执行'
                }if(data == 4){
                    return '执行中'
                }if(data == 5){
                    return '等待资源'
                }if(data == 6){
                    return '待关单'
                }if(data == 7){
                    return '任务关闭'
                }if(data == 999){
                    return '任务取消'
                }
            }
        },
        {
            title:'状态码',
            data:'gdZht',
            className:'ztz'
        },
        {
            title:'车站',
            data:'bxKeshi'
        },
        {
            title:'设备类型',
            data:'wxShiX'
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'登记时间',
            data:'gdShij'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "className":'noprint',
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"

        }
    ];
    _tableInit($('#table-other'),col2,2,false,'','','','');

    //未闭环执行人员
    var col4 = [
        {
            class:'checkeds',
            "targets": -1,
            "data": 'wxRQZ',
            render:function(data, type, row, meta){
                if(data == 1){
                    return "<div class='checker'><span class='checked'><input type='checkbox'></span></div>"
                }else{
                    return "<div class='checker'><span><input type='checkbox'></span></div>"
                }
            }
        },
        {
            title:'执行人员',
            data:'wxRName'
        },
        {
            title:'工号',
            data:'wxRen'
        },
        {
            title:'联系电话',
            data:'wxRDh'
        }
    ];
    _tableInit($('#personTable10'),col4,2,false,'','',true,'');

    //未闭环维修材料
    //查看备件表格
    var col5 = [
        {
            title:'备件编码',
            data:'wxCl'
        },
        {
            title:'备件名称',
            data:'wxClName'
        },
        {
            title:'数量',
            data:'clShul'
        }
    ];
    _tableInit($('#personTables10'),col5,2,false,'','',true,'');
    /*-------------------------------------按钮事件------------------------------------*/

    //主表格操作-------------------------------------------------------------------------
    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        //input，select，textarea清空
        $('.condition-query').eq(0).find('input').val('');

        //时间初始化
        $('.condition-query').eq(0).find('.datatimeblock').eq(0).val(st);

        $('.condition-query').eq(0).find('.datatimeblock').eq(1).val(now);

        //车站初始化
        $('#bumen').parent().next().find('span').removeAttr('values').html('全部');

    })

    //登记
    $('.creatButton').click(function(){

        //loadding
        $('#theLoading').modal('show');

        //初始化
        detailedInit();

        //模态框
        _moTaiKuang($('#myModal'), '登记', '', '' ,'', '登记')

        //是否可操作
        abledOption();

        //类名
        $('#myModal').find('.modal-footer').children('.btn-primary').addClass('dengji');

        //隐藏不需要的部分
        $('#myModal').find('.seeBlock').hide();

        //loadding消失
        $('#theLoading').modal('hide');

        //线路显示隐藏
        //线路显示
        if( __routeShow){

            $('.routeShow').show();

        }else{

            $('.routeShow').hide();

        }

        //执行人按钮隐藏
        $('.zhiXingRenYuanButton').parents('.divBlock').show();

    })

    //登记确定按钮
    $('#myModal').on('click','.dengji',function(){

        editRegister('YWGD/ywGDCreDJ',false,'登记成功！','登记失败！')

    })

    //取消
    $('.zuofei').click(function(){
        //判断是否选了工单
        if(_gdCode == ''){

            _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'请选择要取消的工单！', '');

        }else{

            //弹出取消弹窗
            _moTaiKuang($('#myModal9'), '取消', '', '' ,'', '取消');

        }
    })

    //取消确定按钮
    //取消确定按钮
    $('#myModal9').on('click','.btn-primary',function(){

        //先保存了取消理由，再取消工单
        var prm = {
            //工单号
            'gdCode':_gdCode,
            //取消理由
            'wxBeizhu':$('#myModal9').find('textarea').val(),
            //用户id
            'userID':_userIdNum,
            //用户名
            'userName':_userIdName,
            'gdZht':'0'
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptWxBeizhu',
            data:prm,
            success:function(result){
                if(result == 99){
                    var prm = {
                        'gdCode':_gdCode,
                        'userID':_userIdNum,
                        'userName':_userIdName
                    }
                    $.ajax({
                        type:'post',
                        url:_urls + 'YWGD/ywGDDel',
                        data:prm,
                        beforeSend: function () {
                            $('#theLoading').modal('show');
                        },
                        complete: function () {
                            $('#theLoading').modal('hide');
                        },
                        success:function(result){
                            if(result == 99){
                                _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'工单取消成功！', '');
                                $('#myModal9').modal('hide');
                                conditionSelect()
                            }else{
                                _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'工单取消失败！', '');
                            }
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR.responseText);
                        }
                    })
                }else{
                    _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'工单取消失败！', '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    });

    //表格按钮【下发】
    $('#scrap-datatables tbody').on('click','.option-option',function(e){

        //初始化
        detailedInit();

        //绑定数据
        bindData($(this));

        //模态框
        _moTaiKuang($('#myModal'),'下发','','','','下发');

        //是否可操作
        disabledOption();

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').addClass('paigongButton').removeClass('dengji').removeClass('bianji');

        //显示需要的部分
        $('#myModal').find('.seeBlock').show();

        $('.routeShow').hide();

        //执行人按钮显示
        $('.zhiXingRenYuanButton').parents('.divBlock').show();

        //阻止事件冒泡
        e.stopPropagation();

        $('.associated-station').hide();

    })

    //表格按钮【编辑】
    $('#scrap-datatables tbody').on('click','.option-edit',function(e){

        //初始化
        detailedInit();

        //模态框
        bindData($(this));

        //绑定数据
        _moTaiKuang($('#myModal'),'编辑','','','','保存');

        //类
        $('#myModal').find('.modal-footer').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('paigongButton');

        //是否可操作
        abledOption();

        //显示需要的部分
        $('#myModal').find('.seeBlock').hide();

        if( __routeShow){

            $('.routeShow').show();

        }else{

            $('.routeShow').hide();

        }

        //执行人按钮隐藏
        $('.zhiXingRenYuanButton').parents('.divBlock').hide();

        //阻止事件冒泡
        e.stopPropagation();

        $('.associated-station').hide();

    })

    //【下发确定按钮】
    $('#myModal').on('click','.paigongButton',function(){

        //首先判断是否选择了负责人
        if(_zhixingRens.length){

            $('#theLoading').modal('show');

            //先判断是第一次下发还是重发
            if(_gdStatus == 5){

                //调用重发接口
                upDateWXRemark(3);

                _gdCircle = parseInt(_gdCircle) + 1;

                reSend(3);

                assigFZR(3);

            }else{
                //更新负责人

                upData(2);

                assigFZR(2);

                upDateWXRemark(2);

            }

        }else{

            _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'请选择工长', '');

        }

    })

    //【编辑确定按钮】
    $('#myModal').on('click','.bianji',function(){

        if( detaileVue.telephone == '' || detaileVue.person == '' || detaileVue.place == '' || detaileVue.matter == '' || detaileVue.section  == '' ){

            _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{

            $('#theLoading').modal('show');

            //维修备注
            upDateWXRemark(1);
            //编辑
            editRegister('YWGD/ywGDUpt',true,'','');
        }

    })

    //当点击表格的时候，将所有的未闭环表格显示出来
    $('#scrap-datatables tbody').on('click','tr',function(){

        //样式
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

        var gdCode = $(this).children('.gongdanId').children().attr('gdcode');

        var gdStatus = $(this).children('.gongdanId').children().attr('gdztz');

        var gdCircle = $(this).children('.gongdanId').children().attr('gdcircle');

        var cheStr = '';

        _gdCode = gdCode;

        //获取车间
        var prm = {

            //工单号
            'gdCode':gdCode,
            //工单状态
            'gdZht':gdStatus,
            //当前用户id
            'userID':_userIdNum,
            //当前用户名
            'userName':_userIdName,
            //重派值
            'gdCircle':gdCircle

        }
        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(result){

                    cheStr = result.bxKeshiNum;

                    //获取同一车站的段未闭环工单
                    var prm = {
                        "gdZht": 0,
                        'gdZhts':[1,2,3,4,5,6],
                        'userID':_userIdNum,
                        'userName':_userIdName,
                        'bxKeshiNum':cheStr,
                        'gdCircle':gdCircle
                    }
                    $.ajax({
                        type:'post',
                        url:_urls + 'YWGD/ywGDGetZh2',
                        data:prm,
                        beforeSend: function () {
                            $('#theLoading').modal('show');
                        },
                        complete: function () {
                            $('#theLoading').modal('hide');
                        },
                        success:function(result){
                            var arr = [];

                            for(var i=0;i<result.length;i++){

                                if(_gdCode != result[i].gdCode ){

                                    arr.push(result[i]);

                                }
                            }

                            if(arr.length>0){

                                $(".associated-station").show();

                                _datasTable($("#table-other"),arr);

                            }else{

                                $(".associated-station").hide();

                            }
                        }
                    })

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    })

    //未闭环工单【查看】
    $('#table-other tbody').on('click','.option-see',function(){

        //初始化
        unLoopInit();

        //模态框
        _moTaiKuang($('#myModal0'),'查看','flag','','','');

        //绑定数据
        unLoopBindData($(this));

        //不可操作
        unLoopDisAbled();

    })

    //第一层模态框-------------------------------------------------------------------------

    //线路、车站联动
    $('.line-route').on('change',function(){

        var values = $(this).val();

        var about = $(this).parents('.floatLi').next().find('select');

        var str = '<option value="">请选择</option>';

        if(values == ''){

            //所有车站
            for(var i=0;i<_stationArr.length;i++){

                str += '<option value="' + _stationArr[i].ddNum +
                    '">' + _stationArr[i].ddName + '</option>'

            }


        }else{

            for(var i=0;i<_lineArr.length;i++){

                if(values == _lineArr[i].dlNum){

                    for(var j=0;j<_lineArr[i].deps.length;j++){

                        str += '<option value="' + _lineArr[i].deps[j].ddNum + '">' + _lineArr[i].deps[j].ddName + '</option>'

                    }
                }
            }
        }

        $(about).empty().append(str);

    })

    //选择执行人
    $('#myModal').on('click','.zhiXingRenYuanButton',function(){

        //初始化
        //输入框
        $('#myModal7').find('.gongdanList').find('input').val('');

        //表格数据初始化
        _datasTable($('#zhixingRenTable'),_allZXRArr);

        //模态框
        _moTaiKuang($('#myModal7'), '添加责任人', '', '' ,'', '添加负责人');

        //根据已选择的车站，确定部门
        //点击的时候获得选择的车间的bm的值
        var bm = $('.cjz').children('option:selected').attr('bm');

        var mc = '';

        //通过部门编码找部门名称
        for(var i=0;i<_departmentArr.length;i++){

            if(_departmentArr[i].id == bm){

                mc = _departmentArr[i].name;

            }
        }

        //加载负责人数据
        $('#xzmc').val(mc);
        $('#zxbm').val(bm);
        $('#zxName').val('');
        $('#zxNum').val('');

        //数据加载
        fzr();
    })

    //已选择的执行人的删除按钮
    $('#personTable1 tbody').on('click','.tableDeleted',function(){

        //样式
        $('#personTable1 tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        var $thisBM = $(this).parents('tr').children('.wxRen').html();

        for(var i=0;i<_zhixingRens.length;i++){

            if(_zhixingRens[i].userNum == $thisBM){

                $('.zxrGH').val(_zhixingRens[i].userNum);

                $('.zxrXM').val(_zhixingRens[i].userName);

                $('.zxrDH').val(_zhixingRens[i].mobile);
            }
        }

        _moTaiKuang($('#myModal8'), '确认要删除吗？', '', '' ,'', '删除');

    })

    //删除负责人静态按钮
    $('.removeWorkerButton').click(function(){

        var $thisBM = $('.zxrGH').val();

        _zhixingRens.removeByValue($thisBM,'userNum');

        _datasTable($('#personTable1'),_zhixingRens);

        //模态框消失
        $('#myModal8').modal('hide');

    });

    //表格中的input事件
    $('#personTable1').find('tbody').on( 'click', 'input', function () {

        if($(this).parents('.checker').children('.checked').length == 0){

            $(this).parent($('span')).addClass('checked');

        }else{

            $(this).parent($('span')).removeClass('checked');

        }
    });

    //第二层模态框------------------------------------------------------------------------

    //条件选择负责人
    $('#myModal7').on('click','.zhixingButton',function(){

        fzr();

    })

    //选择部门
    $('#myModal7').on('click','.xzDepartment',function(){

        _departmentArr = [];

        $('#tree-block').show();

        //加载部门
        getDpartment()
    })

    //选择部门确定按钮
    $('.determineDepartment').click(function(){

        $('#xzmc').val(_determineDeObj.name);

        $('#zxbm').val(_determineDeObj.id);

        $('#tree-block').hide();

        //初始化执行人表格
        var arr = [];

        _datasTable($('#zhixingRenTable'),arr);

    })

    //选择部门取消按钮
    $('.close-tree').click(function(){

        $('#tree-block').hide();

    })

    //表格选择执行人事件(点击表格就选中)
    $('#zhixingRenTable tbody').on('click','tr',function(){

        var lengths = $(this).find('input').parent('.checked').length

        if(lengths == 0){

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }else{

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }

    })

    //确定执行人
    $('#myModal7').on('click','.addZXR',function(){

        //维修班组不可为空
        if( $('#xzmc').val() == '' || $('#zxbm').val() == '' ){

            _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'请选择维修班组！', '');

        }else{

            var zxrList = $('#zhixingRenTable').children('tbody').find('.checked');

            for(var i=0;i<_allZXRArr.length;i++){

                for(var j=0;j<zxrList.length;j++){

                    var bianma = zxrList.eq(j).parents('tr').children('.zxrnum').html();

                    if( _allZXRArr[i].userNum == bianma ){

                        if(_zhixingRens.length == 0){

                            _zhixingRens.push(_allZXRArr[i]);

                        }else{
                            var isExist = false;

                            for(var z=0;z<_zhixingRens.length;z++){

                                if(_zhixingRens[z].userNum == _allZXRArr[i].userNum){

                                    isExist = true;

                                    break;
                                }
                            }
                            if(isExist){

                            }else{

                                _zhixingRens.push(_allZXRArr[i]);

                            }
                        }
                    }
                }
            }

            _datasTable($('#personTable1'),_zhixingRens);

            //模态框消失
            $('#myModal7').modal('hide');

            //维修班组信息
            _wxObj.wxName = $('#xzmc').val();

            _wxObj.wxNum = $('#zxbm').val();

        }


    })

    /*-------------------------------------其他方法------------------------------------*/

    function conditionSelect(){

        //获取条件
        var filterInput = [];

        var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');

        for (var i = 0; i < filterInputValue.length; i++) {

            filterInput.push(filterInputValue.eq(i).val());

        }

        var values = '';

        var flag = $('#bumen').parent('div').next().find('span').attr('values');

        if( typeof flag == 'undefined' ){

            values = '';

        }else{

            values = flag;

        }

        var prm = {
            //工单号
            'gdCode2': filterInput[0],
            //开始时间
            'gdSt': $('.min').val(),
            //结束时间
            'gdEt': moment($('.max').val()).add(1,'d').format('YYYY/MM/DD'),
            //车站
            'bxKeshiNum': values,
            //工单状态
            "gdZht": 1,
            //当前用户id
            'userID': _userIdNum,
            //当前用户姓名
            'userName': _userIdName,
        };

        var wbzArr = [];

        if(_AisWBZ){

            for(var i=0;i<_AWBZArr.length;i++){

                for(var j=0;j<_AWBZArr[i].wxBanzus.length;j++){

                    wbzArr.push(_AWBZArr[i].wxBanzus[j].departNum);

                }

            }

            prm.wxKeshis = wbzArr;

        }else if(_AisBZ){

            prm.wxKeshi = _maintenanceTeam;

        }

        $.ajax({
            type: 'post',
            url: _urls + 'YWGD/ywGDGetDJ',
            timeout:30000,
            data: prm,
            success: function (result) {

                _datasTable($("#scrap-datatables"), result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }
        })

    }

    //模态框初始化
    function detailedInit(){

        //工单号
        detaileVue.gdCode = '';
        //工单状态
        detaileVue.state = '';
        //工单类型
        detaileVue.picked = 0;
        //任务来源
        detaileVue.gdly = 1;
        //任务级别
        detaileVue.rwlx = 4;
        //报修电话
        detaileVue.telephone = '';
        //报修人信息
        detaileVue.person = '';
        //故障位置
        detaileVue.place = '';
        //线路
        detaileVue.lineRoute = '';
        //车站
        detaileVue.section = '';
        //系统类型
        detaileVue.matter = '';
        //设备编码
        detaileVue.sbSelect = '';
        //设备名称
        detaileVue.sbMC = '';
        //发生时间
        $('#workDones').find('.otime').val('');
        //工单登记时间
        $('#workDones').find('.dtime').val('');
        //故障描述
        $('#workDones').find('.remarkDes').val('');
        //维修内容
        $('#workDones').find('#wxremark').val('');
        //单选按钮
        $('#uniform-twos1').parents('.input-blockeds').find('input').parent('span').removeClass('checked');

        $('#uniform-twos1').children('span').addClass('checked');
        //查看图片初始化
        _imgNum = 0;

        $('.showImage').html('没有图片');
        //表格初始化
        var arr = [];
        _datasTable($('#personTable1'),arr);

    }

    //编辑、登记
    //登记方法
    function editRegister(url,flag,successMeg,errorMeg){

        //验证非空
        if(detaileVue.phone == '' || detaileVue.person == '' || detaileVue.place == '' || detaileVue.section == '' || detaileVue.matter == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag','istap', '请填写红色必填项!', '');

        }else{

            //车站名称
            var cheStr = '';

            if($('#workDones').find('.cjz').val() == ''){

                cheStr = '';

            }else{

                cheStr = $('#workDones').find('.cjz').children('option:selected').html();

            }

            var xtStr = '';

            if($('#workDones').find('.xitong').val() == ''){

                xtStr = ''

            }else{

                xtStr = $('#workDones').find('.xitong').children('option:selected').html();

            }

            //执行人数组
            var best = $('#personTable1 tbody').find('.checked').parents('tr').children('.wxRen').html();

            var fzrArr = [];

            for(var i=0;i<_zhixingRens.length;i++){
                var obj = {};
                obj.wxRen = _zhixingRens[i].userNum;
                obj.wxRName = _zhixingRens[i].userName;
                obj.wxRDh = _zhixingRens[i].mobile;
                if(_zhixingRens[i].userNum == best){
                    obj.wxRQZ = 1;
                }else{
                    obj.wxRQZ = 0;
                }
                fzrArr.push(obj);
            }

            var prm = {
                //工单类型
                gdJJ: detaileVue.picked,
                //工单编号来源
                gdCodeSrc: detaileVue.gdly,
                //任务级别
                gdLeixing: detaileVue.rwlx,
                //报修电话
                bxDianhua: detaileVue.telephone,
                //报修人
                bxRen: detaileVue.person,
                //故障位置
                wxDidian: detaileVue.place,
                //线路（不传）
                //车站名称
                bxKeshi:cheStr,
                //车站编码
                bxKeshiNum: detaileVue.section,
                //系统类型名称
                dcName:xtStr,
                //系统类型编码
                dcNum:detaileVue.matter,
                //设备编码
                dNum: detaileVue.sbSelect,
                //维修设备（设备编码）
                wxShebei: detaileVue.sbSelect,
                //设备名称
                dName: detaileVue.sbMC,
                //故障发生时间
                gdFsShij:$('.otime').val(),
                //故障描述
                bxBeizhu: $('#workDones').find('.remarkDes').eq(0).val(),
                //用户id
                userID: _userIdNum,
                //维修事项
                wxKeshi: '',
                //工单来源
                'gdSrc': 1,
                //维修事项
                wxShiX:xtStr,
                //维修事项编码
                wxShiXNum:detaileVue.matter,
                //安装地点
                installAddress:'',
                //执行人
                gdWxLeaders:fzrArr

            };

            if(flag){

                prm.gdCode = _gdCode;

            }

            if(flag){

                //编辑方法
                $.ajax({

                    type:'post',
                    url:_urls + url,
                    data:prm,
                    timeout:_theTimes,
                    success:function(result){

                        _editIsComplete = true;

                        if(result == 99){

                            _editIsSuccess = true;

                        }else{

                            _editIsSuccess = false;

                        }

                        editeWXbz();

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        _editIsComplete = true;

                        _editIsSuccess = false;

                        console.log(jqXHR.responseText);
                    }

                })

            }else{

                //登记方法
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

                            _moTaiKuang($('#myModal4'),'提示',true,'istap',successMeg,'');

                            $('#myModal').modal('hide');

                            conditionSelect();

                        }else{

                            _moTaiKuang($('#myModal4'),'提示',true,'istap',errorMeg,'');

                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        console.log(jqXHR.responseText);
                    }

                })

            }


        }

    }

    //获得负责人列表数据
    function fzr(flag){
        var prm = {
            "userName2": $('#zxName').val(),
            "userNum": $('#zxNum').val(),
            "departNum": $('#zxbm').val(),
            "userID": _userIdNum,
            "userName":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXLeaders',
            data:prm,
            success:function(result){

                if(flag){

                    _allZXRArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allZXRArr.push(result[i]);

                    }

                }

                _datasTable($('#zhixingRenTable'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //车站列表
    function stationData(){

        $.ajax({

            type:'post',
            url:_urls + 'YWDev/ywDMGetDDsII',
            data:{
                //当前用户id
                'userID': _userIdNum,
                //当前用户姓名
                'userName': _userIdName
            },
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option' + ' value="' + result[i].ddNum +'"' + 'bm="' + result[i].departNum +
                        '">' + result[i].ddName + '</option>';
                }

                $('#myModal').find('.cjz').empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(jqXHR.responseText);
            }

        })

    }

    getDpartment();

    //获取部门数据
    function getDpartment(){
        var prm = {
            "departName":"",
            //"userID": "mch"
            "userID": _userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            async:false,
            success:function(result){

                for(var i=0;i<result.length;i++){
                    var obj = {};
                    obj.id = result[i].departNum;
                    obj.pId = result[i].parentNum;
                    obj.name = result[i].departName;
                    if(obj.pId == ''){
                        obj.open = true;
                    }
                    _departmentArr.push(obj);
                }

                departmentTree();
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //ztree树
    function departmentTree(){
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all'
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false,
            },
            callback: {
                onClick: function(e,treeId,treeNode){
                    //取消全部打钩的节点
                    zTreeObj.checkNode(treeNode,!treeNode.checked,true);
                    //输出选中节点
                    var selectedNode = zTreeObj.getSelectedNodes();
                    for(var i=0;i<selectedNode.length;i++){
                        _determineDeObj.pId = selectedNode[i].pId;
                        _determineDeObj.name = selectedNode[i].name;
                        _determineDeObj.id = selectedNode[i].id;
                    }
                },
                beforeClick:function(){

                    $('#deparmentTree').find('.curSelectedNode').removeClass('curSelectedNode');

                },
                onCheck:function(e,treeId,treeNode){

                    $('#deparmentTree').find('.curSelectedNode').removeClass('curSelectedNode');

                    $('#deparmentTree').find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                    //取消全部打钩的节点
                    zTreeObj.checkNode(treeNode,true,true);
                    //输出选中节点
                    var selectedNode = zTreeObj.getCheckedNodes(true);
                    for(var i=0;i<selectedNode.length;i++){
                        _determineDeObj.pId = selectedNode[i].pId;
                        _determineDeObj.name = selectedNode[i].name;
                        _determineDeObj.id = selectedNode[i].id;
                    }

                }
            }
        };
        var zTreeObj = $.fn.zTree.init($("#deparmentTree"), setting, _departmentArr);
    }

    //数据绑定
    function bindData($this){

        //样式
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        _gdCode = $this.parents('tr').children('.gongdanId').children().attr('gdcode');

        _gdStatus = $this.parents('tr').children('.gongdanId').children().attr('gdztz');

        _gdCircle = $this.parents('tr').children('.gongdanId').children().attr('gdcircle');

        var prm = {

            //工单号
            'gdCode':_gdCode,
            //工单状态
            'gdZht':_gdStatus,
            //当前用户id
            'userID':_userIdNum,
            //当前用户名
            'userName':_userIdName,
            //重派值
            'gdCircle':_gdCircle

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                //数据绑定
                //工单号
                detaileVue.gdCode = result.gdCode2;
                //工单状态
                detaileVue.state = stateTransform(result.gdZht);
                //工单类型
                detaileVue.picked = result.gdJJ;
                //任务来源
                detaileVue.gdly = result.gdCodeSrc;
                //任务级别
                detaileVue.rwlx = result.gdLeixing;
                //报修电话
                detaileVue.telephone = result.bxDianhua;
                //报修人信息
                detaileVue.person = result.bxRen;
                //故障位置
                detaileVue.place = result.wxDidian;
                //线路(没有)
                //车站
                detaileVue.section = result.bxKeshiNum;
                //系统类型
                detaileVue.matter = result.wxShiXNum;
                //设备编码
                detaileVue.sbSelect = result.wxShebei;
                //设备名称
                detaileVue.sbMC = result.dName;
                //发生时间
                $('#workDones').find('.otime').val(result.gdFsShij);
                //工单登记时间
                $('#workDones').find('.dtime').val(result.gdShij);
                //故障描述
                $('#workDones').find('.remarkDes').val(result.bxBeizhu);
                //维修内容
                $('#workDones').find('#wxremark').val(result.wxBeizhu);
                //单选按钮
                $('#uniform-twos1').parents('.input-blockeds').find('input').parent('span').removeClass('checked');

                $('#uniform-twos1').children('span').addClass('checked');
                //查看图片初始化
                _imgNum = result.hasImage;
                //执行人
                _zhixingRens.length = 0;

                for(var i=0;i<result.gdWxLeaders.length;i++){

                    var obj = {};

                    obj.userName = result.gdWxLeaders[i].wxRName;

                    obj.userNum = result.gdWxLeaders[i].wxRen;

                    obj.mobile = result.gdWxLeaders[i].wxRDh;

                    _zhixingRens.push(obj);
                }
                //表格初始化
                _datasTable($('#personTable1'),_zhixingRens);


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    function stateTransform(ztz){
        if (ztz == 1) {
            return '待下发'
        }
        if (ztz == 2) {
            return '待分派'
        }
        if (ztz == 3) {
            return '待执行'
        }
        if (ztz == 4) {
            return '执行中'
        }
        if (ztz == 5) {
            return '等待资源'
        }
        if (ztz == 6) {
            return '待关单'
        }
        if (ztz == 7) {
            return '任务关闭'
        }
        if (ztz == 999) {
            return '任务取消'
        }
    }

    //可操作
    function abledOption(){

        $('#workDones').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#workDones').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#workDones').find('textarea').attr('disabled',false).removeClass('disabled-block');

        //单选框
        $('#uniform-ones1').parent().removeClass('disabled-block');

    }

    //不可操作
    function disabledOption(){

        $('#workDones').find('input').attr('disabled',true).addClass('disabled-block');

        $('#workDones').find('select').attr('disabled',true).addClass('disabled-block');

        $('#workDones').find('textarea').attr('disabled',true).addClass('disabled-block');

        //单选框
        $('#uniform-ones1').parent().addClass('disabled-block');

        //维修内容可以编辑
        $('#wxremark').attr('disabled',false).removeClass('disabled-block');

    }

    //更新维修备注（flag判断进行什么操作。1、编辑，2、下发，3、重发）；
    function upDateWXRemark(flag){
        var prm = {
            //工单
            "gdCode": _gdCode,
            //工单状态值
            "gdZht": _gdStatus,
            //维修科室
            "wxKeshi": '',
            //维修备注
            "wxBeizhu": $('#wxremark').val(),
            //用户名id
            "userID": _userIdNum,
            //用户名
            "userName":_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptWxBeizhu',
            data:prm,
            success:function(result){

                _wxIsComplete = true;

                if(result == 99){

                    _wxIsSuccess = true;

                }else{

                    _wxIsSuccess = false;

                }
                //判断编辑工单和维修备注是否成功
                if(flag == 1){

                    editeWXbz();

                }else if(flag == 2){

                    firstXF();

                }else if(flag == 3){

                    secondXF();

                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                _wxIsComplete = true;

                _wxIsSuccess = false;

                console.log(jqXHR.responseText);
            }
        })
    }

    //分配负责人
    function assigFZR(flag){

        var best = $('#personTable1 tbody').find('.checked').parents('tr').children('.wxRen').html();

        var fzrArr = [];

        for(var i=0;i<_zhixingRens.length;i++){

            var obj = {};

            obj.wxRen = _zhixingRens[i].userNum;

            obj.wxRName = _zhixingRens[i].userName;

            obj.wxRDh = _zhixingRens[i].mobile;

            obj.gdCode = _gdCode;

            if(_zhixingRens[i].userNum == best){

                obj.wxRQZ = 1;

            }else{

                obj.wxRQZ = 0;

            }

            fzrArr.push(obj);
        }
        //分配负责人
        var gdWR = {
            //工单号
            gdCode : _gdCode,
            //负责人
            gdWxRs : fzrArr,
            //用户id
            userID : _userIdNum,
            //用户名
            userName : _userIdName,
            //状态值
            gdZht:_gdStatus,
            //重发值
            gdCircle:_gdCircle
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDAddWxLeader',
            data:gdWR,
            success:function(result){

                _fzrIsComplete = true;

                if(result == 99){

                    _fzrIsSuccess = true;

                }else{

                    _fzrIsSuccess = false;

                }
                if(flag == 2){

                    firstXF();

                }else if(flag == 3){

                    secondXF();

                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                _fzrIsComplete = true;

                _fzrIsSuccess = false;

                console.log(jqXHR.responseText);
            }
        })
    }

    //第一次下发
    function upData(flag){
        var gdInfo = {
            //工单号
            gdCode :_gdCode,
            //状态值
            gdZht : 2,
            //维修科室
            wxKeshi:_wxObj.wxName,
            //维修科室编码
            wxKeshiNum:_wxObj.wxNum,
            //当前用户id
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            success:function(result){

                _ztChangeIsComplete = true;

                if(result == 99){

                    _ztChangeIsSuccess = true;

                }else{

                    _ztChangeIsSuccess = false;

                }
                if(flag == 2){

                    firstXF();

                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                _ztChangeIsComplete = true;

                _ztChangeIsSuccess = false;

                console.log(jqXHR.responseText);
            }
        })
    }

    //重发接口
    function reSend(flag){
        var gi = {
            //工单号
            "gdCode": _gdCode,
            //工单状态
            "gdZht": 2,
            //重发值
            "gdCircle": _gdCircle,
            //用户id
            "userID": _userIdNum,
            //用户名
            "userName": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZhtChP',
            data:gi,
            success:function(result){

                _reSendIsComplete = true;

                if(result == 99){

                    _reSendIsSuccess = true;

                }else{

                    _reSendIsSuccess = false;

                }
                if(flag == 3){

                    secondXF();

                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                _reSendIsComplete = true;

                _reSendIsSuccess = false;

                console.log(jqXHR.responseText);
            }
        })
    }

    //第一次下发(2)
    function firstXF(){

        if( _ztChangeIsComplete && _fzrIsComplete && _wxIsComplete ){

            //根据三个状态值提示
            if(_fzrIsSuccess && _wxIsSuccess && _ztChangeIsSuccess){

                _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'工单下发成功！', '');

                $('#myModal').modal('hide');

                conditionSelect();

            }else{

                var str = '';

                if( _fzrIsSuccess == false ){

                    str += '工长增加失败，'

                }else{

                    str += '工长增加成功，'

                }

                if( _wxIsSuccess == false ){

                    str += '维修备注修改失败，'

                }else{

                    str += '维修备注修改成功，'

                }

                if( _ztChangeIsSuccess == false ){

                    str += '工单下发失败！'

                }else{

                    str += '工单下发成功！'

                }

                _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,str, '');
            }

            $('#theLoading').modal('hide');

        }
    }

    //重发（3）
    function secondXF(){

        if( _wxIsComplete && _reSendIsComplete && _fzrIsComplete){

            if(_fzrIsSuccess && _wxIsSuccess && _reSendIsSuccess){

                _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'工单下发成功！', '');

                $('#myModal').modal('hide');

                conditionSelect()

            }else{
                var str = '';

                if( _fzrIsSuccess == false ){

                    str += '工长增加失败，'

                }else{

                    str += '工长增加成功，'

                }
                if( _wxIsSuccess == false ){

                    str += '维修备注修改失败，'

                }else{

                    str += '维修备注修改成功，'

                }
                if( _reSendIsSuccess == false ){

                    str += '工单重发失败！'

                }else{

                    str += '工单重发成功！'

                }

                _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,str, '');
            }

            $('#theLoading').modal('hide');

        }
    }

    //编辑、维修备注回调函数
    function editeWXbz(){

        if(_editIsComplete && _wxIsComplete){

            //根据三个状态值提示
            if( _wxIsSuccess && _editIsSuccess ){

                _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,'工单编辑成功！', '');

                $('#myModal').modal('hide');

                conditionSelect();

            }else{

                var str = '';

                if( _wxIsSuccess == false ){

                    str += '维修内容修改失败，'

                }else{

                    str += '维修内容修改成功，'

                }
                if( _editIsSuccess == false ){

                    str += '工单编辑失败！'

                }else{

                    str += '工单编辑成功！'

                }

                _moTaiKuang($('#myModal4'), '提示', 'flag', 'istap' ,str, '');

            }

            $('#theLoading').modal('hide');

        }

    }

    //初始化
    function unLoopInit(){

        //工单类型
        unclosedLoop.picked = '';
        //工单来源
        unclosedLoop.gdly = '';
        //任务级别
        unclosedLoop.rwlx = '';
        //报修电话
        unclosedLoop.telephone = '';
        //报修人信息
        unclosedLoop.person = '';
        //故障位置
        unclosedLoop.place = '';
        //车站
        unclosedLoop.section = '';
        //系统类型
        unclosedLoop.matter = '';
        //设备编码
        unclosedLoop.sbSelect = '';
        //设备名称
        unclosedLoop.sbMC = '';
        //维修班组
        unclosedLoop.sections = '';
        //发生时间
        $('#myApp33').find('.otime').val('');
        //工单登记时间
        $('#myApp33').find('.dtime').val('');
        //故障描述
        $('#myApp33').find('.remarks').val('');
        //维修内容
        $('#myApp33').find('.wxbeizhu').val('');
        //表格
        var arr = [];
        //执行人员表格
        _datasTable($('#personTable10'),arr);
        //维修材料表格
        _datasTable($('#personTables10'),arr);
    }

    //绑定数据
    function unLoopBindData($this){

        //样式修改
        $('#table-other tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        var gdCode = $this.parents('tr').children('.gongdanId').children('').attr('gdcode');

        var gdCircle = $this.parents('tr').children('.gongdanId').children('').attr('gdcircle');

        var gdStatus = $this.parents('tr').children('.gongdanId').children('').attr('gdztz');

        var prm = {
            //工单号
            'gdCode':gdCode,
            //状态
            'gdZht':gdStatus,
            //用户id
            'userID':_userIdNum,
            //用户名
            'userName':_userIdName,
            //重发值
            'gdCircle':gdCircle

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                //工单类型
                unclosedLoop.picked = result.gdJJ;
                //工单来源
                unclosedLoop.gdly = result.gdCodeSrc;
                //任务级别
                unclosedLoop.rwlx = result.gdLeixing;
                //报修电话
                unclosedLoop.telephone = result.bxDianhua;
                //报修人信息
                unclosedLoop.person = result.bxRen;
                //故障位置
                unclosedLoop.place = result.wxDidian;
                //车站
                unclosedLoop.section = result.bxKeshi;
                //系统类型
                unclosedLoop.matter = result.wxShiX;
                //设备编码
                unclosedLoop.sbSelect = result.wxShebei;
                //设备名称
                unclosedLoop.sbMC = result.dName;
                //维修班组
                unclosedLoop.sections = result.wxKeshi;
                //发生时间
                $('#myApp33').find('.otime').val(result.gdFsShij);
                //工单登记时间
                $('#myApp33').find('.dtime').val(result.gdShij);
                //故障描述
                $('#myApp33').find('.remarks').val(result.bxBeizhu);
                //维修内容
                $('#myApp33').find('.wxbeizhu').val(result.wxBeizhu);
                //执行人员表格
                _datasTable($('#personTable10'),result.wxRens);
                //维修材料表格
                _datasTable($('#personTables10'),result.wxCls);

                //单选按钮
                if(result.gdJJ == 1){

                    $('.inpus').parent('span').removeClass('checked');

                    $('#ones').parent('span').addClass('checked');

                }else{

                    $('.inpus').parent('span').removeClass('checked');

                    $('#twos').parent('span').addClass('checked');

                }
                //备件图片
                _imgNum = result.hasImage;
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

        //处理过程
        logInformation(0,gdCode);
    }

    //处理过程（日志）
    function logInformation(logType,code){


        var gdLogQPrm = {
            "gdCode": code,
            "logType": logType,
            "userID": _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetLog',
            data:gdLogQPrm,
            success:function(result){
                if(logType == 2){
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.deal-with-list').empty();
                    $('.deal-with-list').append(str);
                }else if(logType == 1){
                    var str = '';
                    for(var i=0;i<result.length;i++){
                        str += '<li><span class="list-dot"> </span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;' + result[i].logTitle + '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }else{
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //不可操作
    function unLoopDisAbled(){

        $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');

        $('#uniform-ones').parent('div').attr('disabled',true).addClass('disabled-block');

    }
})