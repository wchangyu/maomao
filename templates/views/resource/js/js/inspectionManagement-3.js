$(function(){

    /*-----------------------------------------------时间插件----------------------------------------------*/

    _timeYMDComponentsFun($('.datatimeblock'));

    /*------------------------------------------------变量--------------------------------------------------*/
    //存放所有巡检内容的数组
    var _allDataArr = [];

    //存放未下发巡检内容数组
    var _weifenpeiArr = [];

    //启用数组
    var _qiyongArr = [];

    //禁用数组
    var _jinyongArr = [];

    //存放选择的设备名称；
    var _shebeiMC = '';

    //存放选择的设备编码
    var _shebeiBM = '';

    //存放所有设备
    var _allDevice = [];

    //存放所有部门
    var _allDepart = [];

    //存放所有供选择的巡检步骤数组
    var _allXJTMArr = [];

    //存放所有已选择的巡检步骤数组（左边）
    var _allXJSelect = [];

    //存放所有已选择的巡检步骤数组（右边）
    var _allNRSelect = [];

    //存放添加巡检步骤和通过内容选择步骤的数组
    var _QCArr = [];

    //所有执行人数组
    var _zxrArr = [];

    //添加执行人存放的数组
    var _zhixingRens = [];

    //存放状态值
    var _stateArr = [];

    //复选框选中的东西
    var _selectData = [];

    //选中的部门名称
    var _selectedDepName = '';

    //选中的部门编码
    var _selectedDepNum = '';

    //点击选择设备响应
    var _choiceDev = false;

    //点击选择部门响应
    var _choiceDep = false;

    //存放所有保养内容
    var _MTContentArr = [];

    //存放所有维保组的数组
    var _InfluencingArr = [];

    //存放所有维修班组的数组
    var _bzArr = [];

    //读出的departNum在维保组中标识
    var stationsFlag = false;

    //读出的departNum在班组中用标识
    var wxBanzusFlag = false;


    //巡检计划vue对象
    var workDone = new Vue({
        el:'#workDone',
        data:{
            //巡检计划编码
            jhbm:'',
            //巡检计划名称
            xjnrmc:'',
            //设备名称
            sbmc:'',
            //设备编码
            sbbm:'',
            //巡检部门
            xjbm:'',
            //负责人
            fzr:'',
            //周期单位
            zqdw:1,
            //周期单位下拉框
            options:[
                {text: '日', value: '1'},
                {text: '周', value: '2'},
                {text: '月', value: '3'}
            ],
            //启用状态
            sfqy:0,
            //启用状态下拉框
            options1:[
                {text: '未启用', value: '0'},
                {text: '启用', value: '1'},
                {text: '停用', value: '2'},
            ],
            //间隔周期
            jhzq:'',
            //生效时间
            sxsj:'',

        },
        methods:{
            //生效时间
            effectFun:function(){

                var mny = /^\+?[1-9][0-9]*$/;

                if(mny.test(workDone.sxsj)){

                    $('.effectError').hide();

                }else{

                    $('.effectError').show();

                }

            }
        }
    });

    Vue.validator('noempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //设备类型
    deviceType();

    //设备区域
    deviceArea();

    //设备系统
    deviceSystem();

    //设备部门
    deviceDep();

    /*------------------------------------------------表格初始化--------------------------------------------*/

    var col = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'设备编码',
            data:'dNum',
            className:'bianma',
            render:function(data, type, full, meta){
                return '<span data-num="' + full.dipNum +
                    '">' + data +
                    '</span>'
            }
        },
        {
            title:'设备名称',
            data:'dName'
        },
        {
            title:'巡检计划名称',
            data:'dipName'
        },
        {
            title:'巡检部门',
            data:'dipKeshi'
        },
        {
            title:'负责人',
            data:'manager'
        },
        {
            title:'是否启用',
            className:'isActive',
            data:'isActive',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '未下发'
                }if(data == 1){
                    return '已下发'
                }if(data ==2){
                    return '停用'
                }
            }
        },
        {
            title:'生效时间',
            data:'activeDate'
        },
        {
            title:'操作',
            "data": 'isActive',
            "render":function(data, type, full, meta){
                if(data == 0){
                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>" +
                        "<span class='data-option option-assign btn default btn-xs green-stripe' title='下发任务'>下发任务</span>"
                }if(data !=0){
                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                }
            }
        }
    ]

    _tableInit($('.main-contents-tables').find('.table'),col,1,'flag','','');

    //选择设备
    var selectDevCol = [
        {
            title:'设备编号',
            data:'dNum',
            className:'dNum'
        },
        {
            title:'设备名称',
            data:'dName',
        },
        {
            title:'规格型号',
            data:'spec',
        },
        {
            title:'安装地点',
            data:'installAddress',
        },
        {
            title:'设备类型',
            data:'dcName'
        }
    ];

    _tableInit($('#sbmcxz'),selectDevCol,2,'','','');

    //巡检步骤
    var stepCol = [
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
        },
        {
            title:'设备类型',
            data:'dcName'
        },
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
        }
    ];

    _tableInit($('#zhiXingPerson'),stepCol,2,'','','');

    //巡检项目
    var stepItem = [
        {
            title:'设备类型',
            data:'dcName'
        },
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
            title:'参考关系',
            data:'relation'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }
    ];

    _tableInit($('#personTable1'),stepItem,2,'','','');

    //从巡检任务中添加
    var contentItem = [
        {
            title:'巡检内容编码',
            data:'dicNum',
            className:'bianma'
        },
        {
            title:'巡检内容名称',
            data:'dicName',
            className:'mingcheng'
        },
        {
            title:'设备分类',
            data:'dicNum'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-seeNR btn default btn-xs green-stripe'>查看</span>"
        }
    ];

    _tableInit($('#zhiXingPerson1'),contentItem,2,'','','');

    //巡检内容查看详情表格
    var detailContent = [
        {
            title:'设备类型',
            data:'dcName'
        },
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
            title:'参考关系',
            data:'relation'
        }
    ];

    _tableInit($('#personTable3'),detailContent,2,'','','');

    //添加执行人
    var executorCol = [
        {
            title:'执行人员',
            data:'userName',
            className:'dipRen'
        },
        {
            title:'工号',
            data:'userNum',
            className:'dipRenNum'
        },
        {
            title:'联系电话',
            data:'mobile',
            className:'dipDh'
        },
        {
            class:'deleted',
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='tableDeleted data-option btn default btn-xs green-stripe'>删除</span>"
        }
    ];

    _tableInit($('#personTable2'),executorCol,2,'','','');

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
        }
    ];
    _tableInit($('#zhixingRenTable'),choiceWorkCol,2,'','','');

    //选择部门
    var departmentCol = [

        {
            title:'部门名',
            data:'departName'
        },
        {
            title:'部门编码',
            data:'departNum',
            className:'departNum'
        },
        {
            title:'上级部门',
            data:'parentNum'
        },

    ];

    _tableInit($('#department-table'),departmentCol,2,'','','');

    //添加表头复选框
    var creatCheckBox = '<div class="checker"><span><input type="checkbox"></span></div>';

    $('thead').find('.checkeds').prepend(creatCheckBox);

    //设备数据(true,获取所有设备到数组中)

    if(_loginUser.isWx == 0){

        //设备
        choiceDevice(true,stationsFlag,wxBanzusFlag);

        //数据
        conditionSelect(stationsFlag,wxBanzusFlag);

    }else if(_loginUser.isWx == 1){

        InfluencingUnit(true);

    }


    //获取所有巡检计划项目
    getTM(true);

    //获取巡检内容
    xjnrSelect(true);

    //获取部门
    getDepart(true);

    //获取执行人
    getExecutor();

    //导出按钮
    $('.excelButton').children('.dt-buttons').addClass('hidding');

    $('.excelButton').children('.dt-buttons').eq(0).removeClass('hidding');

    /*-------------------------------------------------按钮------------------------------------------------*/

    //条件查询-------------------------------------------------------
    //选项卡
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
        //导出按钮显示
        for( var i=0;i<$('.excelButton').children().length;i++ ){
            $('.excelButton').children().eq(i).addClass('hidding');
        };
        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
        //条件查询按钮显示问题
        var $xianshi = $('.xianshi');
        if($(this).html() == '全部'){
            $xianshi.attr('disabled',false);
        }else if($(this).html() == '未分配'){
            $xianshi.attr('disabled',true);
            $xianshi.eq(2).attr('disabled',false);
        }else if( $(this).html() == '启用'){
            $xianshi.attr('disabled',true);
            $xianshi.eq(1).attr('disabled',false);
        }else if( $(this).html() == '停用'){
            $xianshi.attr('disabled',true);
            $xianshi.eq(0).attr('disabled',false);
        }
    });

    //查询
    $('#selected').click(function(){

        conditionSelect(stationsFlag,wxBanzusFlag);

    })

    //添加
    $('.creatButton').click(function(){

        //模态框
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');

        //初始化
        detailedInit();

        var arr = [];

        _datasTable($('#personTable1'),arr);

        _datasTable($('#personTable2'),arr);

        //计划编码不可操作
        $('.jhbm').addClass('disabled-block');

        _QCArr.length = 0;

        _allXJSelect.length = 0;

        _allNRSelect.length = 0;

        _zhixingRens.length = 0;

        //添加类
        $('#myModal').find('.btn-primary').removeClass('bianij').addClass('dengji');

        //新增按钮显示
        $('.addButton').show();

        abledBlock();

    })

    //启用
    $('#qiyong').click(function(){
        _selectData = [];

        yesOrNo('YWDevIns/YWDIPActivePlans',1,'请选择要启用的数据','启用操作成功！','停用状态下才可以进行启用操作！');
        //flagQY = true;
    });

    //停用
    $('#jinyong').click(function(){

        _selectData = [];

        yesOrNo('YWDevIns/YWDIPActivePlans',2,'请选择要停用的数据','停用操作成功！','启用状态下才可以进行停用操作！');

        //flagQY = true;
    });

    //批量删除
    $('#batchDelete').click(function(){
        _selectData = [];

        yesOrNo('YWDevIns/YWDIPDelPlans',0,'请选择要删除的数据','批量删除操作成功')
    })

    //登记(确定按钮)
    $('#myModal').on('click','.dengji',function(){

        editRegister('YWDevIns/YWDIPAddPlan',false,'添加成功！','添加失败!');

    })

    //编辑（确定按钮）
    $('#myModal').on('click','.bianji',function(){

        editRegister('YWDevIns/YWDIPUptPlan',true,'编辑成功！','编辑失败!');

    })

    //删除（确定按钮）
    $('#myModal2').on('click','.dashanchu',function(){
        var prm = {
            dipNum:$('#xjtmbm').val(),

            userID:_userIdNum
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIPDelPlan',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){
                if(result == 99){

                    conditionSelect(stationsFlag,wxBanzusFlag);

                    $('#myModal2').modal('hide');
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    })

    //下发（确定按钮）
    $('#myModal').on('click','.fenpei',function(){
            var prm = {
                dipNum:workDone.jhbm,
                dipName:workDone.xjnrmc,
                dNum:workDone.sbbm,
                dName:workDone.sbmc,
                activeDate:$('#sxsj').val(),
                finishDate:$('#jssj').val(),
                circleUnit:workDone.zqdw,
                isActive:workDone.sfqy,
                stCircle:workDone.jhzq,
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/YWDIPAssignTask',
                data:prm,
                timeout:_theTimes,
                beforeSend: function () {
                    $('#theLoading').modal('hide');

                    $('#theLoading').modal('show');
                },

                complete: function () {

                    $('#theLoading').modal('hide');

                },
                success:function(result){
                    if(result == 99){

                        _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,'启动任务巡检成功！', '');

                        $('#myModal').modal('hide');

                        conditionSelect(stationsFlag,wxBanzusFlag);
                    }else{

                        _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,'启动任务巡检失败！', '');

                    }

                }
            })
        })

    //表格中的按钮操作
    $('.main-contents-tables').find('.table').find('tbody')
        .on('click','.option-see',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-tables').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');
            $thisTable.children('tbody').children('tr').children('.checkeds').find('span').removeClass('checked');
            $thiss.children('.checkeds').find('span').addClass('checked');

            //赋值
            ckOrBj($(this),true);

            //样式都置为不可操作
            $('#myModal').find('.btn-primary').hide();

            //步骤添加的查看按钮设为不可操作
            //新增按钮显示
            $('.addButton').hide();

            //删除按钮不可操作
            //$('#personTable1').find('.option-delete').addClass('hiddenButton');

            //不可编辑
            disabledBlock();
        })
        .on('click','.option-edite',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-tables').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');
            $thisTable.children('tbody').children('tr').children('.checkeds').find('span').removeClass('checked');
            $thiss.children('.checkeds').find('span').addClass('checked');
            var $this = $(this);
            _shebeiMC = $.trim($this.find('.bianma').next().html());
            _shebeiBM = $.trim($this.find('.bianma').html());
            ckOrBj($(this),false);
            //确定按钮显示，并且添加bianji类
            $('#myModal').find('.btn-primary').show().removeClass('dengji').removeClass('fenpei').addClass('bianji').html('编辑');
            //新增按钮显示
            $('.addButton').show();

            abledBlock();
        })
        .on('click','.option-delete',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-tables').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');
            $thisTable.children('tbody').children('tr').children('.checkeds').find('span').removeClass('checked');
            $thiss.children('.checkeds').find('span').addClass('checked');


            _moTaiKuang($('#myModal2'), '确定要删除吗？', '', '' ,'', '删除');

            $('#myModal2').find('.btn-primary').removeClass('xiaoshanchu').addClass('dashanchu');

            var $thisBM = $(this).parents('tr').children('.bianma').children().attr('data-num');
            var $thisMC = $(this).parents('tr').children('.bianma').next().next().html();

            $('#xjtmbm').val($thisBM);
            $('#xjtmmc').val($thisMC);
        })
        .on('click','.option-assign',function(){
            var $this = $(this);
            _shebeiMC = $.trim($this.find('.bianma').next().next().html());
            _shebeiBM = $.trim($this.find('.bianma').children().attr('data-num'));
            ckOrBj($(this),true);
            //确定按钮显示，并且添加分配类
            $('#myModal').find('.btn-primary').show().removeClass('dengji').removeClass('bianji').addClass('fenpei').html('启动任务巡检');

            disabledBlock();
        })

    //主表格选择
    var _table = $('.main-contents-tables').find('.table');

    //复选框点击事件（巡检内容）
    _table.find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //$(this).parents('tr').css({'background':'#FBEC88'});
            $(this).parents('tr').addClass('tables-hover');
            //如果所有复选框打钩，那么表头的复选框自动打钩；
            var rowNum = $(this).parents('.table').find('tbody').find('.checkeds').length;
            var selectNum =  $(this).parents('.table').find('tbody').find('.checked').length;
            if( rowNum == selectNum){
                $(this).parents('.table').find('thead').find('.checkeds').find('span').addClass('checked');
            }
        }else{
            $(this).parent($('span')).removeClass('checked');
            //$(this).parents('tr').css({'background':'#ffffff'});
            $(this).parents('tr').removeClass('tables-hover');
            //只要有一个复选框没选中，全选框不打勾，
            $(this).parents('.table').find('thead').find('.checkeds').find('span').removeClass('checked');
        }
    });

    //点击thead复选框tbody的复选框全选中
    _table.find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            _table.find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            //所有行的背景颜色置为黄色
            //_table.find('tbody').find('tr').css({'background':'#fbec88'})
            _table.find('tbody').find('tr').addClass('tables-hover');
        }else{
            _table.find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            //_table.find('tbody').find('tr').css({'background':'#ffffff'})
            _table.find('tbody').find('tr').removeClass('tables-hover')
        }
    });

    //设备---------------------------------------------------------

    //设备选择
    $('#choiceDev').click(function(){

        $('#theLoading').modal('show');

        //模态框
        _moTaiKuang($('#myModal3'), '选择设备', '', '' ,'', '选择');

        //初始化各项
        deviceInit();

        //表格数据初始化
        _datasTable($('#sbmcxz'),_allDevice);

        _choiceDev = true;

    })

    $('#myModal3').on('shown.bs.modal',function(){

        if(_choiceDev){

            $('#theLoading').modal('hide');

        }

        _choiceDev = false;

    })

    //设备选择点击
    $('#sbmcxz tbody').on('click','tr',function(){
        //样式
        var $this = $(this)

        $('#sbmcxz tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        _shebeiMC = $.trim($this.find('.dNum').next().html());

        _shebeiBM = $.trim($this.find('.dNum').html());
    })

    //设备选择确定按钮
    $('#myModal3').on('click','.selectSBMC',function(){

        $('#myModal3').modal('hide');

        $('#sbmc').val(_shebeiMC);

        $('#sbbm').val(_shebeiBM);

        workDone.sbmc = _shebeiMC;

        workDone.sbbm = _shebeiBM;

    });

    //设备查询
    $('#selected1').click(function(){

        //InfluencingUnit(false);

        choiceDevice(false,stationsFlag,wxBanzusFlag);

    })

    //选择部门------------------------------------------------------
    $('#choiceDep').click(function(){

        $('#theLoading').modal('show');

        //模态框
        _moTaiKuang($('#choiceDepart'), '选择部门', '', '' ,'', '选择');

        //初始化
        $('.sbmc1').val('');

        //表格数据初始化
        _datasTable($('#department-table'),_allDepart);

        _choiceDep = true;

    })

    $('#choiceDepart').on('shown.bs.modal',function(){

        if(_choiceDep){

            $('#theLoading').modal('hide');

        }

        _choiceDep = false;

    })

    //选择部门
    $('#department-table').on('click','tr',function(){

        //样式
        $('#department-table').find('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

        _selectedDepName = $(this).children().eq(0).html();

        _selectedDepNum = $(this).children('.departNum').html();


    })

    //选择部门确定按钮
    $('#choiceDepart').on('click','.btn-primary',function(){

        $('#choiceDepart').modal('hide');

        workDone.xjbm = _selectedDepName;

        $('.xjDep').attr('data-num',_selectedDepNum);

        //确定负责人下拉列表
        getLeading(_selectedDepNum);

        //确定执行人员列表
        $('#bm').val(_selectedDepNum);

    })

    //选择部门条件选择
    $('#selectedBM').click(function(){

        getDepart();

    })

    //添加项目步骤--------------------------------------------------

    //巡检步骤
    $('.zhiXingRenYuanButton').click(function(){

        //模态框
        _moTaiKuang($('#myModal1'), '选择巡检步骤项目', '', '' ,'', '选择');


        //初始化
        projectInit();

        //表格初始化
        _datasTable($('#zhiXingPerson'),_allXJTMArr);

    })

    //巡检步骤条件查询
    $('#selecte').click(function(){

        getTM();

    })

    //复选框点击事件（添加巡检步骤）
    $('#zhiXingPerson').find('tbody').on( 'click', 'input', function () {

        if($(this).parents('.checker').children('.checked').length == 0){

            $(this).parent($('span')).addClass('checked');

            $(this).parents('tr').addClass('tables-hover');

            //如果所有复选框打钩，那么表头的复选框自动打钩；
            var rowNum = $(this).parents('.table').find('tbody').find('.checkeds').length;

            var selectNum =  $(this).parents('.table').find('tbody').find('.checked').length;

            if( rowNum == selectNum){
                $(this).parents('.table').find('thead').find('.checkeds').find('span').addClass('checked');
            }

        }else{
            $(this).parent($('span')).removeClass('checked');

            $(this).parents('tr').removeClass('tables-hover');

            //只要有一个复选框没选中，全选框不打勾，
            $(this).parents('.table').find('thead').find('.checkeds').find('span').removeClass('checked');
        }
    });

    //点击thead复选框tbody的复选框全选中
    $('#zhiXingPerson').find('thead').find('input').click(function(){

        if($(this).parents('.checker').children('.checked').length == 0){

            $(this).parent('span').addClass('checked');

            //点击选中状态
            $('#zhiXingPerson').find('tbody').find('input').parents('.checker').children('span').addClass('checked');

            //所有行的背景颜色置为黄色
            $('#zhiXingPerson').find('tbody').find('tr').css({'background':'#fbec88'})
        }else{

            $(this).parent('span').removeClass('checked');

            $('#zhiXingPerson').find('tbody').find('input').parents('.checker').children('span').removeClass('checked');

            $('#zhiXingPerson').find('tbody').find('tr').css({'background':'#ffffff'})
        }

    });

    //选择步骤确定按钮
    $('#myModal1').on('click','.selectTableList',function(){

        var mergeArr = [];

        //_allXJSelect.length = 0;

        //找出所有选中的编码
        var list = $('#zhiXingPerson tbody').find('.checked');

        //通过比较巡检内容编码来确定是数组中的哪个数据
        for( var i=0;i<list.length;i++ ){

            var bianma = list.eq(i).parents('tr').children('.bianma').html();

            for(var j=0;j<_allXJTMArr.length;j++){

                var _allXJTMArrList = _allXJTMArr[j].ditNum;

                if( bianma == _allXJTMArrList ){

                    _allXJSelect.push(_allXJTMArr[j]);
                }
            }
        }


        for(var i=0;i<_allXJSelect.length;i++){

            mergeArr.push(_allXJSelect[i])

        };

        for(var i=0;i<_allNRSelect.length;i++){

            mergeArr.push(_allNRSelect[i]);

        };

        //去重
        _QCArr = unique(mergeArr,'ditNum');

        //放入表格中
        _datasTable($('#personTable1'),_QCArr);

        //模态框消失
        $('#myModal1').modal('hide');

    })

    //删除步骤
    $('#personTable1').find('tbody').on('click','.option-delete',function(){

        //样式
        var $this = $(this).parents('tr');

        $('#personTable1').children('tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        var $myModal = $('#myModal2');

        $myModal.find('.btn-primary').removeClass('dashanchu').addClass('xiaoshanchu');

        //删除框赋值
        var $thisRow = $(this).parents('tr');

        $('#xjtmbm').val($thisRow.find('.bianma').html());

        $('#xjtmmc').val($thisRow.find('.bianma').next().html());

        _moTaiKuang($myModal,'确定要删除吗？','','','','删除');

    })

    //删除步骤确定按钮
    $('.xiaoshanchu').click(function(){

        _QCArr.removeByValue($('#xjtmbm').val(),'ditNum');

        _datasTable($('#personTable1'),_QCArr);

        $('#myModal2').modal('hide');
    });


    //从内容添加-----------------------------------------------------------

    //从巡检内容中选择步骤
    $('.zhiXingRenYuanButton1').click(function(){

        _moTaiKuang($('#myModal6'),'从巡检内容中添加步骤','','','','选择');

        //初始化
        contentInit();

        //表格初始化
        _datasTable($('#zhiXingPerson1'),_MTContentArr);

    })

    //巡检内容调价查询
    $('#selecte1').click(function(){

        xjnrSelect();

    })

    //巡检内容下的步骤列表
    $('#myModal6').on('click','.option-seeNR',function(){

        //样式
        $('#zhiXingPerson1 tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        var $thisBM = $(this).parents('tr').children('.bianma').html();

        var prm = {
            dicNum:$thisBM,
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDICItems',
            data:prm,
            success:function(result){
                _allNRSelect.length = 0;

                for(var i=0;i<result.length;i++){

                    _allNRSelect.push(result[i]);

                }
                _datasTable($('#personTable3'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
    })

    $('#myModal6').on('click','.selectTableList1',function(){

        var mergeArr = [];

        for(var i=0;i<_allXJSelect.length;i++){

            mergeArr.push(_allXJSelect[i])

        };

        for(var i=0;i<_allNRSelect.length;i++){

            mergeArr.push(_allNRSelect[i]);

        };

        //去重
        _QCArr = unique(mergeArr,'ditNum');

        //放入表格中
        _datasTable($('#personTable1'),_QCArr);

        //模态框消失
        $('#myModal6').modal('hide');

    })

    //添加执行人-------------------------------------------------------------

    $('.zhiXingRenYuanButtons').click(function(){

        //模态框
        _moTaiKuang($('#myModal7'),'添加执行人','','','','选择');

        //初始化
        executorInit(_zxrArr);

        //赋值
        $('#bm').val(_selectedDepNum);

        getExecutor();

    })

    //执行人条件查询
    $('.zhixingButton').click(function(){

        getExecutor();

    })

    //选择执行人员
    //复选框点击事件
    $('#zhixingRenTable').find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            $(this).parents('tr').addClass('tables-hover');
            //如果所有复选框打钩，那么表头的复选框自动打钩；
            var rowNum = $(this).parents('.table').find('tbody').find('.checkeds').length;
            var selectNum =  $(this).parents('.table').find('tbody').find('.checked').length;
            if( rowNum == selectNum){
                $(this).parents('.table').find('thead').find('.checkeds').find('span').addClass('checked');
            }
        }else{
            $(this).parent($('span')).removeClass('checked');
            //$(this).parents('tr').css({'background':'#ffffff'});
            $(this).parents('tr').removeClass('tables-hover');
            //只要有一个复选框没选中，全选框不打勾，
            $(this).parents('.table').find('thead').find('.checkeds').find('span').removeClass('checked');
        }
    });

    //点击thead复选框tbody的复选框全选中
    $('#zhixingRenTable').find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            $('#zhixingRenTable').find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            $('#zhixingRenTable').find('tbody').find('tr').addClass('tables-hover');
        }else{
            $('#zhixingRenTable').find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            $('#zhixingRenTable').find('tbody').find('tr').removeClass('tables-hover')
        }
    });

    //选择执行人员的确定按钮
    $('.addZXR').click(function (){

        var zxrList = $('#zhixingRenTable').children('tbody').find('.checked');


        for(var i=0;i<_zxrArr.length;i++){
            for(var j=0;j<zxrList.length;j++){

                var bianma = zxrList.eq(j).parents('tr').children('.dipRenNum').html();

                if( _zxrArr[i].userNum == bianma ){

                    _zhixingRens.push(_zxrArr[i]);

                }
            }
        }

        var vas = unique(_zhixingRens,'userNum');

        _datasTable($('#personTable2'),vas);

        $('#myModal7').modal('hide');
    })

    //执行人员删除
    $('#personTable2 tbody').on('click','.tableDeleted',function(){

        var $thisBM = $(this).parents('tr').children('.dipRenNum').html();

        for(var i=0;i<_zhixingRens.length;i++){
            if(_zhixingRens[i]. userNum == $thisBM){
                $('.zxrGH').val(_zhixingRens[i].userNum);
                $('.zxrXM').val(_zhixingRens[i].userName);
                $('.zxrDH').val(_zhixingRens[i].mobile);
            }
        }
        _moTaiKuang($('#myModal8'),'确定要删除吗？','','','','删除');
    });

    //删除确定按钮
    $('.removeWorkerButton').click(function(){

        var $thisBM = $('.zxrGH').val();

        _zhixingRens.removeByValue($thisBM,'userNum');

        var vas = unique(_zhixingRens,'userNum');

        _datasTable($('#personTable2'),vas);

        $('#myModal8').modal('hide');
    })
    /*------------------------------------------------其他方法---------------------------------------------*/

    //功能性----------------------------------------------------
    function conditionSelect(station,bz){

        var arr = [];

        //如果在维修班组中，则传wxKeshi，如果是在所属维保组中，则传wxKeshis=[]
        if(bz){

            arr.length = 0;

            arr.push(sessionStorage.userDepartNum);

        }

        if(station){

            for(var i=0;i<_InfluencingArr.length;i++){

                if(_InfluencingArr[i].departNum == sessionStorage.userDepartNum){

                    for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){

                        arr.push(_InfluencingArr[i].wxBanzus[j]);

                    }

                }

            }

        }

        var prm={
            dNum:$('#sbfl').val(),
            dName:$('#sbmcs').val(),
            dipName:$('.filterInputs').val(),
            isActive:$('#yesNo').val(),
            userID:_userIdNum,
            wxDepartNums:arr
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIPGetPlans',
            data:prm,
            success:function(result){
                _allDataArr = [];
                _weifenpeiArr = [];
                _qiyongArr = [];
                _jinyongArr = [];
                for(var i=0;i<result.length;i++){
                    _allDataArr.push(result[i]);
                    if(result[i].isActive == 0){
                        _weifenpeiArr.push(result[i]);
                    }else if(result[i].isActive == 1){
                        _qiyongArr.push(result[i])
                    }else if(result[i].isActive == 2){
                        _jinyongArr.push(result[i])
                    }
                }
                _datasTable($('#scrap-datatables'),result);
                _datasTable($('#scrap-datatables1'),_weifenpeiArr);
                _datasTable($('#scrap-datatables2'),_qiyongArr);
                _datasTable($('#scrap-datatables3'),_jinyongArr);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }

    //模态框初始化
    function detailedInit(){

        //巡检计划编码
        workDone.jhbm = '';

        //巡检计划名称
        workDone.xjnrmc = '';

        //设备名称
        workDone.sbmc = '';

        //设备编码
        workDone.sbbm = '';

        //巡检部门
        workDone.xjbm = '';

        //负责人
        workDone.fzr = '';

        //周期单位
        workDone.zqdw = 1;

        //启用状态
        workDone.sfqy = 0;

        //间隔周期
        workDone.jhzq = '';

        //生效时间
        workDone.sxsj = '';

        //备注
        $('#beizhu').val('');

        $('#xjDep').removeAttr('data-num');

        $('#myModal').find('.datatimeblock').val('');

    }

    //设备选择初始化
    function deviceInit(){

        $('#myModal3').find('input').val('');

        $('#myModal3').find('li').find('select').val('');

        _datasTable($('#sbmcxz'),_allDevice);

    }

    //添加巡检项目初始化
    function projectInit(){

        $('#shebeileixings').val('');

        $('#filter_global2').children('input').val('');

        $('#zhiXingPerson').find('input').parent('span').removeClass('checked');

        $('#zhiXingPerson').find('tr').removeClass('tables-hover');

    }

    //巡检内容添加初始化
    function contentInit(){

        $('#shebeileixings1').val('');

        $('#filter_global1').children('input').val('');

        $('#zhiXingPerson1').find('tr').removeClass('tables-hover');

        _allNRSelect.length = 0;

        _datasTable($('#personTable3'),_allNRSelect);

    }

    //添加执行人初始化
    function executorInit(arr){

        $('#myModal7').find('input').val('');

        $('#myModal7').find('select').val('');


        if(arr){

            _datasTable($('#zhixingRenTable'),arr);

        }else{

            var arr = [];

            _datasTable($('#zhixingRenTable'),arr);
        }

    }

    //数组去重
    function unique(a,attr) {
        var res = [];

        for (var i = 0, len = a.length; i < len; i++) {
            var item = a[i];
            for (var j = 0, jLen = res.length; j < jLen; j++) {
                if (res[j][attr] === item[attr])
                    break;
            }

            if (j === jLen)
                res.push(item);
        }

        return res;
    }

    //登记、编辑
    function editRegister(url,flag,successMeg,errorMeg){

        if( workDone.xjnrmc == '' || $('#sbmc').val()=='' || workDone.sbbm == ''|| workDone.xjbm == '' || workDone.fzr == '' || workDone.jhzq === '' || $('#sxsj').val() == '' || $('#jssj').val()== '' ){

            _moTaiKuang($('#myModal5'),'提示','flag','istap','请填写红色必填项！','');

        }else{
            if(workDone.jhzq >=1 && isInteger(workDone.jhzq)){

                //验证时间

                var d1 = new Date($('#sxsj').val().replace(/\-/g, "\/"));

                var d2 = new Date($('#jssj').val().replace(/\-/g, "\/"));

                if($('#sxsj').val()!=""&&$('#jssj').val()!=""&&d1 >=d2){

                    _moTaiKuang($('#myModal5'),'提示','flag','istap','开始时间不能大于结束时间！','提示');

                    return false;
                }else{

                    var vas = unique(_QCArr,'ditNum');

                    var tableArr = [];

                    for(var i=0;i<vas.length;i++){

                        var obj = {};
                        //巡检条目编码
                        obj.ditNum = vas[i].ditNum;
                        //巡检计划编号
                        obj.ditName = vas[i].ditName;

                        tableArr.push(obj);
                    };

                    var personArr = [];

                    var vas1 = unique(_zhixingRens,'userNum');

                    for(var i=0;i<vas1.length;i++){

                        var obj = {};
                        obj.dipDh = vas1[i].mobile;
                        obj.dipRen = vas1[i].userName;
                        obj.dipRenNum = vas1[i].userNum;
                        obj.dipKeshi = $('.xjDep').attr('data-num');
                        personArr.push(obj);
                    }

                    var prm={

                        dipName:workDone.xjnrmc,
                        dNum:workDone.sbbm,
                        dName:workDone.sbmc,
                        dipKeshi:workDone.xjbm,
                        dipKeshiNum:$('.xjDep').attr('data-num'),
                        manager:workDone.fzr,
                        activeDate:$('#sxsj').val(),
                        stCircle:workDone.jhzq,
                        circleUnit:workDone.zqdw,
                        remark:$('#beizhu').val(),
                        isActive:workDone.sfqy,
                        dipItems:tableArr,
                        dipMembers:personArr,
                        finishDate:$('#jssj').val(),
                        userID:_userIdNum,
                        dateRange:workDone.sxsj
                    };
                    if(flag){

                        prm.dipNum=workDone.jhbm;

                    }

                    $.ajax({
                        type:'post',
                        url:_urls + url,
                        data:prm,
                        beforeSend: function () {
                            $('#theLoading').modal('hide');

                            $('#theLoading').modal('show');
                        },

                        complete: function () {

                            $('#theLoading').modal('hide');

                        },
                        success:function(result){

                            if(result == 99){

                                _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,successMeg, '');

                                $('#myModal').modal('hide');

                                conditionSelect(stationsFlag,wxBanzusFlag);

                            }else{

                                _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,errorMeg, '');

                            }

                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(JSON.parse(jqXHR.responseText).message);
                            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){

                            }
                        }
                    })

                }

            }else{

                _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,'请填写大于1的整数间隔周期!', '');

            }
        }

    }

    //数据绑定
    //查看/编辑赋值
    //查看/编辑赋值true的时候表格内容不可编辑
    function ckOrBj(el,flag){
        //确定按钮隐藏
        //var $myModal = $('#myModal');
        //moTaiKuang($myModal);
        _moTaiKuang($('#myModal'), '查看', 'flag', '' ,'', '');
        //设置数据
        var $thisBM = el.parents('tr').children('.bianma').children('span').attr('data-num');
        for(var i=0;i<_allDataArr.length;i++){
            if(_allDataArr[i].dipNum == $thisBM){
                //绑定数据
                workDone.jhbm = _allDataArr[i].dipNum;
                workDone.xjnrmc = _allDataArr[i].dipName;
                workDone.sbmc = _allDataArr[i].dName;
                workDone.sbbm = _allDataArr[i].dNum;
                workDone.xjbm = _allDataArr[i].dipKeshi;
                workDone.fzr = _allDataArr[i].manager;
                workDone.jhzq = _allDataArr[i].stCircle;
                workDone.zqdw = _allDataArr[i].circleUnit;
                workDone.sfqy = _allDataArr[i].isActive;
                $('#sxsj').val(_allDataArr[i].activeDate);
                $('#beizhu').val(_allDataArr[i].remark);
                $('#jssj').val(_allDataArr[i].finishDate);
                workDone.sxsj = _allDataArr[i].dateRange;
            }
        }
        //获取巡检步骤
        var prm = {
            dipNum:$thisBM,
            userID:_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIPGetItemAndMembers',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){

                _QCArr.length = 0;

                _zhixingRens.length = 0;

                for(var i=0;i<result.dipItems.length;i++){

                    _QCArr.push(result.dipItems[i]);

                }

                for(var i=0;i<result.dipMembers.length;i++){

                    var obj = {};
                    obj.userName = result.dipMembers[i].dipRen;

                    obj.userNum = result.dipMembers[i].dipRenNum;

                    obj.mobile = result.dipMembers[i].dipDh;

                    _zhixingRens.push(obj);

                }

                //找到存放所有巡检步骤的数组，比较
                _datasTable($('#personTable1'),_QCArr);

                _datasTable($('#personTable2'),_zhixingRens);

                if(flag){

                    $('#personTable1').find('.option-delete').attr('disabled',true);

                    $('#personTable2').find('.tableDeleted').attr('disabled',true);

                }else{

                    $('#personTable1').find('.option-delete').attr('disabled',false);

                    $('#personTable2').find('.tableDeleted').attr('disabled',false);

                }


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
    }

    //判断是不是整数
    function isInteger(obj) {
        return obj%1 === 0
    }

    //启用，禁用
    function yesOrNo(url,data,info,info2,info3){
        _stateArr = [];

        _selectData = _table.find('tbody').children('tr').find('.checked');

        if( _selectData.length ==0 ){
            alert(info);
        }else{
            var selectQiyongArr = [];
            for(var i=0;i<_selectData.length;i++){
                selectQiyongArr.push(_selectData.eq(i).parents('tr').children('.bianma').html());
            }

            for(var i=0;i<_allDataArr.length;i++){
                for(var j=0;j<selectQiyongArr.length;j++){
                    if(_allDataArr[i].dipNum == selectQiyongArr[j]){
                        _stateArr.push(_allDataArr[i].isActive);
                    }
                }
            }
            if(_stateArr.indexOf(data)<0){
                var prm = {
                    dipNums:selectQiyongArr,
                    isActive:data,
                    userID:_userIdName
                }
                $.ajax({
                    type:'post',
                    url:_urls + url,
                    data:prm,
                    beforeSend: function () {
                        $('#theLoading').modal('hide');

                        $('#theLoading').modal('show');
                    },

                    complete: function () {

                        $('#theLoading').modal('hide');

                    },
                    success:function(result){
                        if(result == 99){

                            conditionSelect(stationsFlag,wxBanzusFlag);

                            _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,info2, '');

                            //thead复选框不选中
                            $('.table thead').find('input').parent('span').removeClass('checked');
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                        }
                    }
                })
            }else{

                _moTaiKuang($('#myModal5'), '提示', 'flag', 'istap' ,info3, '');

            }
        }
    }

    //详情框不可操作
    function disabledBlock(){

        $('#myModal').find('input').attr('readonly','readonly').addClass('disabled-block');

        $('#myModal').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myModal').find('textarea').attr('readonly','readonly').addClass('disabled-block');

        $('#myModal').find('.datatimeblock').attr('disabled',true);

    }

    //详情框可操作
    function abledBlock(){

        $('#myModal').find('input').removeAttr('readonly').removeClass('disabled-block');

        $('#myModal').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#myModal').find('textarea').removeAttr('readonly').removeClass('disabled-block');

        $('.jhbm').attr('readonly','readonly').addClass('disabled-block');

        $('#myModal').find('.datatimeblock').attr('disabled',false);

    }

    //比较时间
    function timeComparison(st,et){

        var d1 = new Date(st.replace(/\-/g, "\/"));
        var d2 = new Date(et.replace(/\-/g, "\/"));

        if(st!=""&&et!=""&&d1 >=d2){



            return false;
        }else{



        }
    }

    //获取数据-------------------------------------------------
    //获取设备
    function choiceDevice(flag,station,bz){

        var prm = {
            'dName':$('#myModal3').find('.sbmc').val(),
            'dNum':$('#myModal3').find('.sbbm').val(),
            'spec':$('#myModal3').find('.ggxh').val(),
            'status':1,
            'daNum':$('#myModal3').find('#quyu').val(),
            'ddNum':$('#myModal3').find('#bumen').val(),
            'dsNum':$('#myModal3').find('#xitong').val(),
            'dcNum':$('#myModal3').find('#leixing').val(),
            'userID':_userIdNum,
            'userName':_userIdName
        };

        var arr = [];

        //如果在维修班组中，则传wxKeshi，如果是在所属维保组中，则传wxKeshis=[]
        if(bz){

            arr.length = 0;

            arr.push(sessionStorage.userDepartNum);

        }

        if(station){

            for(var i=0;i<_InfluencingArr.length;i++){

                if(_InfluencingArr[i].departNum == sessionStorage.userDepartNum){

                    for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){

                        arr.push(_InfluencingArr[i].wxBanzus[j]);

                    }

                }

            }



        }

        prm.departNums = arr;

        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevsII',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            success:function(result){

                if(flag){

                    _allDevice.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allDevice.push(result[i]);

                    }

                }

                _datasTable($('#sbmcxz'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });

    }

    //设备类型
    function deviceType(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            dcName:'',
            dcNum:''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDCs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].dcNum +
                        '">'+result[i].dcName + '</option>'
                }

                $('#leixing').empty().append(str);

                $('#shebeileixings').empty().append(str);

                $('#shebeileixings1').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //设备区域
    function deviceArea(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            daName:'',
            daNum:''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDAs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].daNum +
                        '">'+result[i].daName + '</option>'
                }

                $('#quyu').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //设备系统
    function deviceSystem(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            dsName:'',
            dsNum:''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDSs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].dsNum +
                        '">'+result[i].dsName + '</option>'
                }

                $('#xitong').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //设备部门
    function deviceDep(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            ddName:'',
            ddNum:''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDDs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].ddNum +
                        '">'+result[i].ddName + '</option>'
                }

                $('#bumen').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //获取所有巡检步骤项目
    function getTM(flag){
        //获取数据
        var prm = {
            dcNum:$('#shebeileixings').val(),
            ditName:$('#filter_global2').children().val(),
            userID:_userIdNum
        };

        $.ajax({
            type:'post',
            url: _urls + 'YWDevIns/YWDIGetDIItems',
            data:prm,
            async:false,
            success:function(result){

                if(flag){
                    _allXJTMArr.length

                    for(var i=0;i<result.length;i++){
                        _allXJTMArr.push(result[i]);
                    }

                }


                _datasTable($('#zhiXingPerson'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });
    }

    //巡检内容条件查询
    function xjnrSelect(flag){
        var prm={
            dicName:$('#filter_global1').find('input').val(),
            dcNum:$('#shebeileixings1').val(),
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDIGetDIContents',
            data:prm,
            success:function(result){
                if(flag){

                    _MTContentArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _MTContentArr.push(result[i]);

                    }
                }

                _datasTable($('#zhiXingPerson1'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })
    }


    //获取部门(true时，获得所有数组)
    function getDepart(flag){

        $.ajax({

            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:{

                userID:_userIdNum,
                userName:_userIdName,
                departName:$('.sbmc1').val()

            },
            timeout:_theTimes,
            success:function(result){

                if(flag){

                    _allDepart.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allDepart.push(result[i]);

                    }

                }

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

                _zxrArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _zxrArr.push(result[i]);

                }

                _datasTable($('#zhixingRenTable'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }


        })

    }

    //获取负责人
    function getLeading(departNum){

        var prm = {

            userID:_userIdNum,

            userName:_userIdName,

            departNum:departNum

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGetWXLeaders',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].userNum +
                        '">' + result[i].userName + '</option>'

                }

                $('#fzr').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }

        })

    }

    //获取所属维保组和所属班组
    function InfluencingUnit(flag){
        var prm = {
            "id": 0,
            "ddNum": "",
            "ddName": "",
            "ddPy": "",
            "daNum": "",
            "userID": _userIdNum,
            "userName": _userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:prm,
            success:function(result){

                //所属车间
                _InfluencingArr.length = 0;
                //所属班组
                _bzArr.length = 0;

                for(var i=0;i<result.stations.length;i++){

                    _InfluencingArr.push(result.stations[i]);

                }

                for(var i=0;i<result.wxBanzus.length;i++){
                    _bzArr.push(result.wxBanzus[i]);

                }

                //首先判断是在车间还是维保组里(如果是在维保组里，加载该维保组的维修班组，如果是在维修班组里，直接发送维修班组即可);

                for(var i=0;i<result.stations.length;i++){

                    if(sessionStorage.userDepartNum == result.stations[i].departNum){

                        stationsFlag = true;

                        break;

                    }else{

                        stationsFlag = false;

                    }
                }
                for(var i=0;i<result.wxBanzus.length;i++){
                    if(sessionStorage.userDepartNum == result.wxBanzus[i].departNum){
                        wxBanzusFlag = true;
                        break;
                    }else{
                        wxBanzusFlag = false;
                    }
                }

                choiceDevice(flag,stationsFlag,wxBanzusFlag);

                conditionSelect(stationsFlag,wxBanzusFlag);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }


})