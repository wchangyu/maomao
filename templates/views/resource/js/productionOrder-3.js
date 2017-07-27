$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名id
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //实际发送时间
    var realityStart;
    var realityEnd;
    //工单号
    var gdCode = '';
    //查看详细信息的Vue形式
    var workDones = new Vue({
        el:'#workDones',
        data:{
            rwlx:'',
            telephone:'',
            person:'',
            place:'',
            section:'',
            matter:'',
            sbSelect:'',
            sbLX:'',
            sbMC:'',
            azAddress:'',
            remarks:'',
            weixiukeshis:'',
            wxremark:'',
            gdly:1
        },
        methods: {
            selectLine:function(){
                //首先将select子元素清空；
                $('.cjz').empty();
                //获得选中的线路的value
                var values = $('#lineRoute').val();
                if(values == ''){
                    //所有车站
                    ajaxFun('YWDev/ywDMGetDDsII',_allDataBM,$('.cjz'),'ddName','ddNum','flag');
                }else{
                    console.log()
                    for(var i=0;i<_lineArr.length;i++){
                        if(values == _lineArr[i].dlNum){
                            //创建对应的车站
                            var str = '<option value="">请选择</option>';
                            for(var j=0;j<_lineArr[i].deps.length;j++){
                                str += '<option value="' + _lineArr[i].deps[j].ddNum +
                                    '">'+ _lineArr[i].deps[j].ddName + '</option>';
                            }
                            $('.cjz').append(str);
                        }
                    }
                }
            }
        }
    });
    //所有负责人列表
    var _allZXRArr = [];
    //已选择的执行人数组
    var _zhixingRens = [];
    //存放设备系统的所有数据
    var _allDataXT = [];
    //存放设备部门的所有数据
    var _allDataBM = [];
    //设备系统
    ajaxFun('YWDev/ywDMGetDSs',_allDataXT,$('.xitong'),'dsName','dsNum');
    //设备部门
    ajaxFun('YWDev/ywDMGetDDsII',_allDataBM,$('.cjz'),'ddName','ddNum','flag');
    //保存上一条登记信息的对象
    var _obj = {};
    //保存上一条信息中责任人的对象
    var _fzrObj = {};
    //保存图片数量
    var _imgNum = 0;
    //保存所有部门的数组
    var _departmentArr = [];
    //当前选中的部门的对象
    var _determineDeObj = {};
    //记录当前工单的状态
    var _gdState = 0;
    //分配工长执行成功标识，
    var _leaderFlag = false;
    //更新维修备注成功标识
    var _wxBZFlag = false;
    //更新状态成功标识
    var _upDateStateFlag = false;
    //编辑成功标识
    var _editFlag = false;
    //标记部门是默认的还是手动选择的，如果是默认的话1，手动选择为2
    var _autoOrHand = 1;
    //重发值
    var _gdCircle = 0;
    //重发成功标识
    var _reSendFlag = false;

    //存放所有线路的数据
    var _lineArr = [];
    /*---------------------------------表格初始化---------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'sSearch':'查询',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs',
                exportOptions:{
                    columns:[0,1,2,4,5,6,7]
                }
            },
        ],
        'columns':[
            {
                title:'工单号',
                data:'gdCode2',
                className:'gongdanId',
                render:function(data, type, row, meta){
                    return '<span gdCode="' +  row.gdCode +
                        '"' + "gdCircle=" + row.gdCircle +
                        '>' +  data +
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
                "defaultContent": "<span class='data-option option-option btn default btn-xs green-stripe'>下发</span>" +
                "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>"

            }
        ]
    });
    //自定义按钮位置
    table.buttons().container().appendTo($('.excelButton'),table.table().container());
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    };
    conditionSelect();

    lineRouteData($('#lineRoute'));
    //已选择的执行人表格
    var col = [
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
    tableInit($('#personTable1'),col);
    //待选择执行人表格
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
    tableInit($('#zhixingRenTable'),col3);
    //添加表头复选框
    var creatCheckBox = '<input type="checkbox">';
    $('thead').find('.checkeds').prepend(creatCheckBox);
    var _personTable1 = $('#personTable1');
    _personTable1.find('tbody').on( 'click', 'input', function () {
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    });
    /*------------------------------------表格绑定事件---------------------------*/
    $('#scrap-datatables tbody')
        .on('click','.option-option',function(){
            _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
            //工单来源显示
            $('.gdly').parents('li').hide();
            //数据绑定
            editOrOption($(this),'flag');
            //改变确定按钮类名
            $('#myModal').find('.btn-primary').addClass('paigongButton').removeClass('dengji').removeClass('bianji').html('下发');
            //图片区域隐藏
            $('.showImage').hide();
        })
        .on('click','.option-edit',function(){
            _gdCircle = $(this).parents('tr').children('.gongdanId').children('span').attr('gdcircle');
            //工单来源显示
            $('.gdly').parents('li').hide();
            //数据绑定
            editOrOption($(this));
            //改变确定按钮类名
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('paigongButton').html('确定');
            //图片区域隐藏
            $('.showImage').hide();
        })
    /*----------------------------------按钮事件---------------------------------*/
    //选择执行人按钮；
    $('.zhiXingRenYuanButton').click(function (){
        //模态框显示
        moTaiKuang($('#myModal7'),'添加责任人');
        //获得所有ztree节点数据；
        getDpartment();
        console.log(_autoOrHand);
        if(_autoOrHand == 1){
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
        }else {
            if($.isEmptyObject(_determineDeObj)){
                $('#xzmc').val('');
                $('#zxbm').val('');
                $('#zxName').val('');
                $('#zxNum').val('');
            }else{
                $('#xzmc').val(_determineDeObj.name);
                $('#zxbm').val(_determineDeObj.id);
                $('#zxName').val(_determineDeObj.userName);
                $('#zxNum').val(_determineDeObj.userNum);
            }
        }
        fzr();
        var fn1 = function( row, data, index ) {
            for(var i=0;i<_zhixingRens.length;i++){
                if(data.userNum == _zhixingRens[i].userNum){
                    $('td:eq(0)', row).parents('tr').addClass('tables-hover');
                    $('td:eq(0)', row).addClass(' checkeds');
                    $('td:eq(0)', row).html( '<div class="checker"><span class="checked"><input type="checkbox"></span></div> ' );
                }
            }

        }
        tableInit(_zhixingRenTable,col3,fn1);
    });
    var _zhixingRenTable = $('#zhixingRenTable');
    //复选框点击事件
    _zhixingRenTable.find('tbody').on( 'click', 'input', function () {
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
    _zhixingRenTable.find('thead').find('input').click(function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            //点击选中状态
            _zhixingRenTable.find('tbody').find('input').parents('.checker').children('span').addClass('checked');
            _zhixingRenTable.find('tbody').find('tr').addClass('tables-hover');
        }else{
            _zhixingRenTable.find('tbody').find('input').parents('.checker').children('span').removeClass('checked');
            _zhixingRenTable.find('tbody').find('tr').removeClass('tables-hover')
        }
    });
    //增加负责人确定按钮（静态）
    $('.addZXR').click(function (){
        var zxrList = _zhixingRenTable.children('tbody').find('.checked');
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
        datasTable($('#personTable1'),_zhixingRens);
    })
    //删除负责任人按钮
    $('#personTable1 tbody').on('click','.tableDeleted',function(){
        var $thisBM = $(this).parents('tr').children('.wxRen').html();
        for(var i=0;i<_zhixingRens.length;i++){
            if(_zhixingRens[i].userNum == $thisBM){
                $('.zxrGH').val(_zhixingRens[i].userNum);
                $('.zxrXM').val(_zhixingRens[i].userName);
                $('.zxrDH').val(_zhixingRens[i].mobile);
            }
        }
        moTaiKuang($('#myModal8'),'确认要删除吗？');
    });
    //删除负责人确定按钮
    $('.removeWorkerButton').click(function(){
        var $thisBM = $('.zxrGH').val();
        _zhixingRens.removeByValue($thisBM,'userNum');
        datasTable($('#personTable1'),_zhixingRens);
    });
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    // 登记按钮
    $('.creatButton').click(function(){
        $('.gdly').parents('li').show();
        //修改确定按钮
        moTaiKuang($('#myModal'),'登记');
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('paigongButton').removeClass('bianji').html('登记');
        //初始化弹窗
        //样式初始化
        $('#workDones').find('input').attr('disabled',false).removeClass('disabled-block');
        $('#workDones').find('select').attr('disabled',false).removeClass('disabled-block');
        $('#workDones').find('textarea').attr('disabled',false).removeClass('disabled-block');
        //数据初始化
        workDones.picked = 0;
        $('#workDones').find('.inpus').parent('span').removeClass('checked');
        $('#workDones').find('#twos1').parent('span').addClass('checked');
        workDones.rwlx = 4;
        workDones.telephone = '';
        workDones.person = '';
        workDones.place = '';
        workDones.sbSelect = '';
        workDones.sbLX = '';
        workDones.sbMC = '';
        workDones.azAddress = '';
        workDones.weixiukeshis = '';
        workDones.remarks = '';
        _zhixingRens = [];
        datasTable($('#personTable1'),_zhixingRens);
    });
    $('#myModal')
        //登记
        .on('click','.dengji',function(){
        //判断必填项是否都填了
        if( workDones.telephone == '' || workDones.person == '' || workDones.place == '' || workDones.matter == '' || workDones.wxKeshi  == '' ){
            moTaiKuang($('#myModal4'),'提示');
            $('#myModal4').find('.modal-body').html('请填写红色必填项！')
        }else{
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
            var gdInfo = {
                gdJJ:workDones.picked,
                gdLeixing:workDones.rwlx,
                bxDianhua:workDones.telephone,
                bxRen:workDones.person,
                wxDidian:workDones.place,
                bxKeshi:$('.cjz').eq(0).children('option:selected').html(),
                wxShiX:$('.xitong').eq(0).children('option:selected').html(),
                wxShebei:workDones.sbSelect,
                dcName:workDones.sbLX,
                dName:workDones.sbMC,
                installAddress:workDones.azAddress,
                wxKeshi:workDones.weixiukeshis,
                bxBeizhu:workDones.remarks,
                //gdWxLeaders:fzrArr,
                gdSrc:1,
                bxKeshiNum:workDones.section,
                wxShiXNum:workDones.matter,
                userId:_userIdNum,
                userName:_userIdName,
            }
            //判断_obj和_fzrObjext是否为空
            if( $.isEmptyObject(_obj) && $.isEmptyObject(_fzrObj) ){
                //为空，添加
                _obj = {
                    gdJJ:workDones.picked,
                    gdLeixing:workDones.rwlx,
                    bxDianhua:workDones.telephone,
                    bxRen:workDones.person,
                    wxDidian:workDones.place,
                    bxKeshi:$('.cjz').eq(0).children('option:selected').html(),
                    wxShiX:$('.xitong').eq(0).children('option:selected').html(),
                    wxShebei:workDones.sbSelect,
                    dcName:workDones.sbLX,
                    dName:workDones.sbMC,
                    installAddress:workDones.azAddress,
                    wxKeshi:workDones.weixiukeshis,
                    bxBeizhu:workDones.remarks,
                    //gdWxLeaders:fzrArr,
                    gdSrc:1,
                    userId:_userIdNum,
                    userName:_userIdName,
                    gdCodeSrc:workDones.gdly,
                    bxKeshiNum:workDones.section,
                    wxShiXNum:workDones.matter
                };
                _fzrObj = fzrArr;
                var gdInfo1 = {
                    gdJJ:workDones.picked,
                    gdLeixing:workDones.rwlx,
                    bxDianhua:workDones.telephone,
                    bxRen:workDones.person,
                    wxDidian:workDones.place,
                    bxKeshi:$('.cjz').eq(0).children('option:selected').html(),
                    wxShiX:$('.xitong').eq(0).children('option:selected').html(),
                    wxShebei:workDones.sbSelect,
                    dcName:workDones.sbLX,
                    dName:workDones.sbMC,
                    installAddress:workDones.azAddress,
                    wxKeshi:workDones.weixiukeshis,
                    bxBeizhu:workDones.remarks,
                    gdWxLeaders:fzrArr,
                    gdSrc:1,
                    userID:_userIdNum,
                    userName:_userIdName,
                    gdCodeSrc:workDones.gdly,
                    bxKeshiNum:workDones.section,
                    wxShiXNum:workDones.matter
                }
                $.ajax({
                    type:'post',
                    url:_urls + 'YWGD/ywGDCreDJ',
                    data:gdInfo1,
                    success:function(result){
                        if(result == 99){
                            moTaiKuang($('#myModal4'),'提示','flag');
                            $('#myModal4').find('.modal-body').html('添加成功！');
                            $('#myModal').modal('hide');
                            //更新状态
                            conditionSelect()
                        }else{
                            moTaiKuang($('#myModal4'),'提示','flag');
                            $('#myModal4').find('.modal-body').html('添加失败！');
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                         console.log(jqXHR.responseText);
                    }
                })
            }else{
                //不为空，判断是否相等
                if( isEqual(_obj,gdInfo) && objectInArr(_fzrObj,fzrArr)){
                    moTaiKuang($('#myModal4'),'提示');
                    $('#myModal4').find('.modal-body').html('不能重复添加！');
                }else{
                    var gdInfo1= {
                        gdJJ:workDones.picked,
                        gdLeixing:workDones.rwlx,
                        bxDianhua:workDones.telephone,
                        bxRen:workDones.person,
                        wxDidian:workDones.place,
                        bxKeshi:$('.cjz').eq(0).children('option:selected').html(),
                        wxShiX:$('.xitong').eq(0).children('option:selected').html(),
                        wxShebei:workDones.sbSelect,
                        dcName:workDones.sbLX,
                        dName:workDones.sbMC,
                        installAddress:workDones.azAddress,
                        wxKeshi:workDones.weixiukeshis,
                        bxBeizhu:workDones.remarks,
                        gdWxLeaders:fzrArr,
                        gdSrc:1,
                        userID:_userIdNum,
                        userName:_userIdName,
                        bxKeshiNum:workDones.section,
                        wxShiXNum:workDones.matter
                    }
                    $.ajax({
                        type:'post',
                        url:_urls + 'YWGD/ywGDCreDJ',
                        data:gdInfo1,
                        success:function(result){
                            if(result == 99){
                                //更新状态
                                upData();
                                if(_upDateStateFlag == true){
                                    moTaiKuang($('#myModal4'),'提示','flag');
                                    $('#myModal4').find('.modal-body').html('添加成功！');
                                    $('#myModal').modal('hide');
                                }
                                //更新状态
                                conditionSelect()
                            }else{
                                moTaiKuang($('#myModal4'),'提示','flag');
                                $('#myModal4').find('.modal-body').html('添加失败！');
                            }
                        },
                        error:function(jqXHR, textStatus, errorThrown){
                            console.log(jqXHR.responseText);
                        }
                    })
                }
            }
        }
    })
        //编辑
        .on('click','.bianji',function(){
            upDateWXRemark();
            editGD();
            //根据三个状态值提示
            if( _wxBZFlag && _editFlag ){
                moTaiKuang($('#myModal4'),'提示','flag');
                $('#myModal4').find('.modal-body').html('工单编辑成功！');
                $('#myModal').modal('hide');
            }else{
                var str = '';
                if( _wxBZFlag == false ){
                    str += '维修内容修改失败，'
                }else{
                    str += '维修内容修改成功，'
                }
                if( _editFlag == false ){
                    str += '工单编辑失败！'
                }else{
                    str += '工单编辑成功！'
                }
            }
            conditionSelect();
        })
        //下发
        .on('click','.paigongButton',function(){
            //先判断是第一次下发还是重发
            if(_gdState == 5){
                //调用重发接口
                upDateWXRemark();
                _gdCircle = parseInt(_gdCircle) + 1;
                reSend();
                assigFZR();
                if(_leaderFlag && _wxBZFlag && _reSendFlag){
                    moTaiKuang($('#myModal4'),'提示','flag');
                    $('#myModal4').find('.modal-body').html('工单下发成功！')
                    $('#myModal').modal('hide');
                }else{
                    var str = '';
                    if( _leaderFlag == false ){
                        str += '工长增加失败，'
                    }else{
                        str += '工长增加成功，'
                    }
                    if( _wxBZFlag == false ){
                        str += '维修备注修改失败，'
                    }else{
                        str += '维修备注修改成功，'
                    }
                    if( _reSendFlag == false ){
                        str += '工单重发失败！'
                    }else{
                        str += '工单重发成功！'
                    }
                    moTaiKuang($('#myModal4'),'提示','flag');
                    $('#myModal4').find('.modal-body').html(str);
                }
            }else{
                //更新负责人
                assigFZR();
                upDateWXRemark();
                upData();
                //根据三个状态值提示
                if(_leaderFlag && _wxBZFlag && _upDateStateFlag){
                    moTaiKuang($('#myModal4'),'提示','flag');
                    $('#myModal4').find('.modal-body').html('工单下发成功！')
                    $('#myModal').modal('hide');
                }else{
                    var str = '';
                    if( _leaderFlag == false ){
                        str += '工长增加失败，'
                    }else{
                        str += '工长增加成功，'
                    }
                    if( _wxBZFlag == false ){
                        str += '维修备注修改失败，'
                    }else{
                        str += '维修备注修改成功，'
                    }
                    if( _upDateStateFlag == false ){
                        str += '工单下发失败！'
                    }else{
                        str += '工单下发成功！'
                    }
                    moTaiKuang($('#myModal4'),'提示','flag');
                    $('#myModal4').find('.modal-body').html(str);
                }
            }

            conditionSelect();
        })
        //获取图片
        .on('click','#viewImage',function(){
            if(_imgNum){
                var str = '';
                for(var i=0;i<_imgNum;i++){
                    str += '<img class="viewIMG" src="http://211.100.28.180/ApService/dimg.aspx?gdcode=' + gdCode + '&no=' + i +
                        '">'
                }
                $('.showImage').html('');
                $('.showImage').append(str);
                $('.showImage').show();
            }else{
                $('.showImage').html('没有图片');
                $('.showImage').show();
            }
        })
        //图片详情
        .on('click','.viewIMG',function(){
            moTaiKuang($('#myModal5'),'图片详情','flag');
            var imgSrc = $(this).attr('src')
            $('#myModal5').find('img').attr('src',imgSrc);
        });
    //查询
    $('#selected').on('click',function(){
        conditionSelect();
    });

    //重置
    $('.resites').click(function(){
        $('.filterInput').val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })

    $('#myModal7').on('click','.xzDepartment',function(){
        _departmentArr = [];
        $('#tree-block').show();
        //加载部门
        getDpartment()
    })
    //选择部门确定按钮
    $('.determineDepartment').click(function(){
        _autoOrHand = 2;
        $('#tree-block').hide();
    })
    //选择部门取消按钮
    $('.close-tree').click(function(){
        $('#tree-block').hide();
        //_determineDeObj.pId = '';
        //_determineDeObj.name = '';
        //_determineDeObj.id = '';
        //$('#xzmc').val('');
        //$('#zxbm').val('');
    })
    //条件查询人员
    $('.zhixingButton').click(function(){
        _determineDeObj.userName = $('#zxName').val();
        _determineDeObj.userNum = $('#zxNum').val();
        fzr();
    })
    //不打印部分
    noPrint($('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate'));
    /*------------------------------------其他方法-------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[2] + ' 00:00:00';
        realityEnd = moment(filterInput[3]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            'gdCode2':filterInput[0],
            'gdSt':realityStart,
            'gdEt':realityEnd,
            'bxKeshi':filterInput[1],
            'wxKeshi':'',
            "gdZht": 0,
            "gdZhts": [
                1,5
            ],
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            async:false,
            data:prm,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //dataTables表格填数据
    function datasTable(tableId,arr){
        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    //模态框自适应
    function moTaiKuang(who,title,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        who.find('.modal-title').html(title);
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    }
    //表格初始化方法
    function tableInit(tableID,col,fun){
        tableID.DataTable({
            'autoWidth': false,  //用来启用或禁用自动列的宽度计算
            'paging': true,   //是否分页
            'destroy': true,//还原初始化了的datatable
            'searching': true,
            'ordering': false,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
                'sSearch':'查询',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":'t<"F"lip>',
            'buttons': [
                {
                    extend: 'excelHtml5',
                    text: '保存为excel格式',
                },
            ],
            'columns':col,
            'rowCallback': fun
        })
    }
    //获得负责人列表数据
    function fzr(){
        var prm = {
            "userName2": $('#zxName').val(),
            "userNum": $('#zxNum').val(),
            "departNum": $('#zxbm').val(),
            "roleNum": "",
            "userID": _userIdNum,
            "userName":_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXLeaders',
            data:prm,
            success:function(result){
                console.log(result);
                _allZXRArr =[];
                for(var i=0;i<result.length;i++){
                    _allZXRArr.push(result[i]);
                }
                datasTable($('#zhixingRenTable'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //获取部门数据
    function getDpartment(){
        var prm = {
            "departName":"",
            "userID": "mch"
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
    //数组删除指定元素的值
    Array.prototype.removeByValue = function(val,attr) {
        for(var i=0; i<this.length; i++) {
            if(this[i][attr] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //数组删除指定索引
    Array.prototype.remove=function(obj){
        for(var i =0;i <this.length;i++){
            var temp = this[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <this.length;j++){
                    this[j]=this[j+1];
                }
                this.length = this.length-1;
            }
        }
    }
    //更新状态
    function upData(){
        var gdInfo = {
            gdCode :gdCode,
            gdZht : 2,
            wxKeshi:'',
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            async:false,
            success:function(result){
                if(result == 99){
                    _upDateStateFlag = true;
                }else{
                    _upDateStateFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //ajaxFun（select的值）
    function ajaxFun(url,allArr,select,text,num,flag){
        var prm = {
            'userID':_userIdNum
        }
        prm[text] = '';
        $.ajax({
            type:'post',
            url:_urls + url,
            async:false,
            data:prm,
            success:function(result){
                //给select赋值
                var str = '<option value="">请选择</option>';
                if(flag){
                    for(var i=0;i<result.length;i++){
                        str += '<option' + ' value="' + result[i][num] +'"' + 'bm="' + result[i].departNum +
                            '">' + result[i][text] + '</option>'
                        allArr.push(result[i]);
                    }
                }else{
                    for(var i=0;i<result.length;i++){
                        str += '<option' + ' value="' + result[i][num] +'">' + result[i][text] + '</option>'
                        allArr.push(result[i]);
                    }
                }
                select.append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //判断两个对象是否相同
    function isEqual(obj1,obj2){
        for(var name in obj1){
            if(obj1[name]!==obj2[name]) return false;
        }
        for(var name in obj2){
            if(obj1[name]!==obj2[name]) return false;
        }
        return true;
    }
    //数组中的对象比较
    function objectInArr(arr1,arr2){
        for(var i=0;i<arr1.length;i++){
            for(var j=0;j<arr2.length;j++){
                if( isEqual(arr1[i],arr2[j]) ){
                    return true;
                }else{
                    return false;
                }
            }
        }
    }
    //编辑、下发的数据绑定
    function editOrOption(el,flag){
        //清空一下执行人数组
        _zhixingRens = [];
        //当前行变色
        var $this = el.parents('tr');
        currentTr = $this;
        currentFlat = true;
        $('#scrap-datatables tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');
        //获取数据
        var gongDanState = $this.children('.ztz').html();
        var gongDanCode = $this.children('.gongdanId').children('span').attr('gdCode');
        gdCode = gongDanCode;
        _gdState = gongDanState;
        var prm = {
            'gdCode':gongDanCode,
            'gdZht':gongDanState,
            'userID':_userIdNum,
            'userName':_userIdName,
            'gdCircle':_gdCircle
        }
        //每次获取弹出框中执行人员的数量
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            async:false,
            data:prm,
            success:function(result){
                if(result.gdJJ == 1){
                    $('#workDones').find('.inpus').parent('span').removeClass('checked');
                    $('#workDones').find('#ones1').parent('span').addClass('checked');
                }else{
                    $('#workDones').find('.inpus').parent('span').removeClass('checked');
                    $('#workDones').find('#twos1').parent('span').addClass('checked');
                }
                //selecrt绑定值
                if(result.bxKeshiNum == ''){
                    workDones.section = 0;
                }else{
                    workDones.section = result.bxKeshiNum;
                }
                if(result.wxShiXNum == ''){
                    workDones.matter = 0;
                }else{
                    workDones.matter = result.wxShiXNum;
                }
                //绑定弹窗数据
                workDones.rwlx = result.gdLeixing;
                workDones.telephone = result.bxDianhua;
                workDones.person = result.bxRen;
                workDones.place = result.wxDidian;
                workDones.sbSelect = result.wxShebei;
                workDones.sbLX = result.dcName;
                workDones.sbMC = result.dName;
                workDones.azAddress = result.installAddress;
                workDones.weixiukeshis = result.wxKeshi;
                workDones.remarks = result.bxBeizhu;
                _imgNum = result.hasImage;
                workDones.wxremark = result.wxBeizhu;
                _gdCircle = result.gdCircle;
                //负责人(初始化);
                //fzr = result.gdWxLeaders;
                for(var i=0;i<result.gdWxLeaders.length;i++){
                    var obj = {};
                    obj.userName = result.gdWxLeaders[i].wxRName;
                    obj.userNum = result.gdWxLeaders[i].wxRen;
                    obj.mobile = result.gdWxLeaders[i].wxRDh;
                    _zhixingRens.push(obj);
                }
                datasTable($('#personTable1'),_zhixingRens);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });
        //查看的时候，均不可操作。
        if(flag){
            $('#workDones').find('input').attr('disabled',true).addClass('disabled-block');
            $('#workDones').find('select').attr('disabled',true).addClass('disabled-block');
            $('#workDones').find('textarea').attr('disabled',true).addClass('disabled-block');
            moTaiKuang($('#myModal'),'工单详情');
            //显示选择负责人按钮
            $('.zhiXingRenYuanButton').show();

        }else{
            $('#workDones').find('input').attr('disabled',false).removeClass('disabled-block');
            $('#workDones').find('select').attr('disabled',false).removeClass('disabled-block');
            $('#workDones').find('textarea').attr('disabled',false).removeClass('disabled-block');
            $('#workDones').find('.inpus').attr('disabled',true);
            moTaiKuang($('#myModal'),'编辑工单');
            //隐藏选择负责人按钮
            $('.zhiXingRenYuanButton').hide();
        }
        $('#wxremark').attr('disabled',false).removeClass('disabled-block');
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
                showIcon:false
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
                    $('#xzmc').val(_determineDeObj.name);
                    $('#zxbm').val(_determineDeObj.id);
                },
            }
        };
        var zTreeObj = $.fn.zTree.init($("#deparmentTree"), setting, _departmentArr);
    }
    //更新维修备注
    function upDateWXRemark(){
        var prm = {
            "gdCode": gdCode,
            "gdZht": _gdState,
            "wxKeshi": '',
            "wxBeizhu": workDones.wxremark,
            "userID": _userIdNum,
            "userName":_userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptWxBeizhu',
            data:prm,
            async:false,
            success:function(result){
                if(result == 99){
                    _wxBZFlag = true;
                }else{
                    _wxBZFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //分配负责人
    function assigFZR(){
        var best = $('#personTable1 tbody').find('.checked').parents('tr').children('.wxRen').html();
        var fzrArr = [];
        for(var i=0;i<_zhixingRens.length;i++){
            var obj = {};
            obj.wxRen = _zhixingRens[i].userNum;
            obj.wxRName = _zhixingRens[i].userName;
            obj.wxRDh = _zhixingRens[i].mobile;
            obj.gdCode = gdCode;
            if(_zhixingRens[i].userNum == best){
                obj.wxRQZ = 1;
            }else{
                obj.wxRQZ = 0;
            }
            fzrArr.push(obj);
        }
        //分配负责人
        var gdWR = {
            gdCode : gdCode,
            gdWxRs : fzrArr,
            userID : _userIdNum,
            userName : _userIdName,
            gdZht:_gdState,
            gdCircle:_gdCircle
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDAddWxLeader',
            data:gdWR,
            async:false,
            success:function(result){
                if(result == 99){
                    _leaderFlag = true;
                }else{
                    _leaderFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
             }
        })
    }
    //编辑的确定按钮
    function editGD(){
        if( workDones.telephone == '' || workDones.person == '' || workDones.place == '' || workDones.matter == '' || workDones.wxKeshi  == '' ){
            moTaiKuang($('#myModal4'),'提示');
            $('#myModal4').find('.modal-body').html('请填写红色必填项！')
        }else{
            var gdInfo= {
                gdCode:gdCode,
                gdJJ:workDones.picked,
                bxDianhua:workDones.telephone,
                bxRen:workDones.person,
                wxDidian:workDones.place,
                bxKeshi:$('.cjz').eq(0).children('option:selected').html(),
                wxShiX:$('.xitong').eq(0).children('option:selected').html(),
                wxShebei:workDones.sbSelect,
                dcName:workDones.sbLX,
                dName:workDones.sbMC,
                installAddress:workDones.azAddress,
                wxKeshi:workDones.weixiukeshis,
                bxBeizhu:workDones.remarks,
                gdSrc:1,
                userID:_userIdNum,
                gdLeixing:workDones.rwlx,
                userName:_userIdName,
                bxKeshiNum:workDones.section,
                wxShiXNum:workDones.matter
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDUpt',
                data:gdInfo,
                async:false,
                success:function(result){
                    if(result == 99){
                        _editFlag = true;
                    }else{
                        _editFlag = false;
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                 }
            })
        }
    }
    //不打印部分
    function noPrint(el){
        el.addClass('noprint')
    }
    //重发接口
    function reSend(){
        var gi = {
            "gdCode": gdCode,
            "gdZht": 2,
            "gdCircle": _gdCircle,
            "userID": _userIdNum,
            "userName": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZhtChP',
            data:gi,
            async:false,
            success:function(result){
                if(result == 99){
                    _reSendFlag = true;
                }else{
                    _reSendFlag = false;
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
    //线路
    function lineRouteData(el) {
        var prm = {
            'userID':_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetDLines',
            data:prm,
            success:function(result){
                _lineArr = [];
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    _lineArr.push(result[i]);
                    str += '<option value="' + result[i].dlNum +
                        '">' + result[i].dlName +'</option>'
                }
                el.append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }
})