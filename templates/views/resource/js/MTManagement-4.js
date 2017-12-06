$(function(){
    /*--------------------------------------------全局变量----------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //获取登陆者信息
    var _loginUser = JSON.parse(sessionStorage.getItem("userInfo"));

    //时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });
    //获取设备类型
    var prm = {
        "dcNum": "",
        "dcName": "",
        "dcPy": "",
        "userID": "mch"
    };
    $.ajax({
        type:'post',
        url:_urls + 'YWDev/ywDMGetDCs',
        data:prm,
        success:function(result){
            var str = '<option value="">全部</option>';
            for(var i=0;i<result.length;i++){
                str += '<option value="' + result[i].dcNum + '">' + result[i].dcName + '</option>'
            }
            $('#sblx').append(str);
        }
    });
    //存放所有数据的列表
    var _allDataArr = [];
    //接单页面vue对象
    var workDone = new Vue({
        el:'#workDone',
        data:{
            sfqy:0,
            rwdh:'',
            rwmc:'',
            sbmc:'',
            sbbm:'',
            zrdwbm:'',
            fzr:'',
            zxr:'',
            zysm:'',
            jhbm:''
        }
    });
    var workDone1 = new Vue({
        el:'#workDone1',
        data:{
            sfqy:0,
            rwdh:'',
            rwmc:'',
            sbmc:'',
            sbbm:'',
            zrdwbm:'',
            fzr:'',
            zxr:'',
            zysm:'',
            jhbm:''
        }
    });
    var tmtable = new Vue({
        el:'#tmtable',
        data:{
            tmbm:'',
            tmmc:'',
            tmckz:'',
            bjgx:'',
            xjjg:'',
            jgjl:'',
            ycms:''
        }
    })
    //设备条目
    var _tiaoMuArr = [];
    var prm = {
        ditName:'',
        dcNum:'',
        userID:_userIdName
    };
    $.ajax({
        type:'post',
        url: _urls + 'YWDevMT/YWDMGetDMItems',
        data:prm,
        async:false,
        success:function(result){
            _tiaoMuArr = [];
            for(var i=0;i<result.length;i++){
                _tiaoMuArr.push(result[i]);
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
            }
        }
    });
    //选中的数组
    var _allXJSelect = [];
    //记住填写的巡检结果的index值
    var _index = 0;

    //存放所有维保组的数组
    var _InfluencingArr = [];

    //存放所有维修班组的数组
    var _bzArr = [];

    //读出的departNum在维保组中标识
    var stationsFlag = false;

    //读出的departNum在班组中用标识
    var wxBanzusFlag = false;
    /*-------------------------------------------表格初始化-------------------------------------------*/
    var _tables =  $('.main-contents-table').find('.table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
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
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success'
            }
        ],
        "columns": [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success'
            }
        ],
        "columns": [
            {
                title:'任务单号',
                data:'itkNum',
                className:'bianma'
            },
            {
                title:'任务名称',
                data:'itkName'
            },
            {
                title:'设备类型',
                data:'dcNum'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:'设备编码',
                data:'dNum'
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
                title:'任务时间',
                data:'tkTime'
            },
            {
                title:'操作',
                "data": 'status',
                "render":function(data, type, full, meta){
                    if(data == 0){
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>接单</span>"
                    }if(data ==1){
                        return "<span class='data-option option-sees btn default btn-xs green-stripe'>执行中</span>"
                    }if(data ==2){
                        return "<span class='data-option option-sees btn default btn-xs green-stripe'>完成</span>"
                    }
                }
            }
        ]
    });
    //数据为空时，禁止弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('');
    }
    //巡检条目已选结果表格
    var col1=[
        {
            title:'设备类型',
            data:'dcName'
        },
        {
            title:'条目编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'条目名称',
            data:'ditName'
        },
        {
            title:'工作内容',
            data:'desc'
        },
        {
            title:'保养方式',
            data:'mtContent'
        }
    ];
    tableInit($('#personTable1'),col1);
    var col5 = [
        {
            title:'执行人员',
            data:'dipRen'
        },
        {
            title:'工号',
            data:'dipRenNum'
        },
        {
            title:'联系电话',
            data:'dipDh'
        }
    ];
    //添加执行人员表格
    tableInit($('#personTable2'),col5);
    //执行中的条目表格
    var col2 = [
        {
            title:'条目编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'条目名称',
            data:'ditName'
        },
        {
            title:'工作内容',
            data:'desc'
        },
        {
            title:'保养方式',
            data:'mtContent'
        }
    ];
    tableInit($('#personTable1s'),col2);
    //初始数据
    //conditionSelect();
    //设备数据(true,获取所有设备到数组中)

    if(_loginUser.isWx == 0){

        //数据
        conditionSelect(stationsFlag,wxBanzusFlag);

    }else if(_loginUser.isWx == 1){

        InfluencingUnit();

    }

    /*-------------------------------------------按钮事件---------------------------------------------*/
    $('#selected').click(function(){
        conditionSelect(stationsFlag,wxBanzusFlag);
    })
    $('.main-contents-table').find('.table')
        .on('click','.option-see',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-table').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');

            var $thisBM = $(this).parents('tr').children('.bianma').html();
            moTaiKuang($('#myModal'));
            //赋值
            for(var i=0;i<_allDataArr.length;i++){
                if(_allDataArr[i].itkNum == $thisBM){
                    workDone.sfqy = _allDataArr[i].isActive;
                    workDone.rwdh = _allDataArr[i].itkNum;
                    workDone.rwmc = _allDataArr[i].itkName;
                    workDone.sbmc = _allDataArr[i].dName;
                    workDone.sbbm = _allDataArr[i].dNum;
                    workDone.zrdwbm = _allDataArr[i].dipKeshi;
                    workDone.fzr = _allDataArr[i].manager;
                    workDone.zxr = _allDataArr[i].itkRen;
                    workDone.jhbm = _allDataArr[i].dipNum;
                    $('#jdsj').val(_allDataArr[i].tkRecTime);
                    $('#kssj').val(_allDataArr[i].tkTime);
                    $('#wcsj').val(_allDataArr[i].tkCompTime);
                    $('#beizhu').val(_allDataArr[i].remark);
                }
            }
            //加载表格下属条目和执行人
            var prm = {
                dipNum:workDone.jhbm,
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevMT/YWDMPGetItemAndMembers',
                data:prm,
                success:function(result){

                    //找到存放所有巡检条目的数组，比较
                    _allXJSelect = [];
                    for(var j=0;j<_tiaoMuArr.length;j++){
                        for(var i=0;i<result.dipItems.length;i++){
                            if( result.dipItems[i].ditNum == _tiaoMuArr[j].ditNum ){
                                _allXJSelect.push(_tiaoMuArr[j]);
                            }
                        }
                    }
                    datasTable($('#personTable1'),_allXJSelect);
                    datasTable($('#personTable2'),result.dipMembers);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }
            });
        })
        .on('click','.option-sees',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-table').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            moTaiKuang($('#myModal1'));
            //赋值
            for(var i=0;i<_allDataArr.length;i++){
                if(_allDataArr[i].itkNum == $thisBM){
                    workDone1.sfqy = _allDataArr[i].isActive;
                    workDone1.rwdh = _allDataArr[i].itkNum;
                    workDone1.rwmc = _allDataArr[i].itkName;
                    workDone1.sbmc = _allDataArr[i].dName;
                    workDone1.sbbm = _allDataArr[i].dNum;
                    workDone1.zrdwbm = _allDataArr[i].dipKeshi;
                    workDone1.fzr = _allDataArr[i].manager;
                    workDone1.zxr = _allDataArr[i].itkRen;
                    workDone1.jhbm = _allDataArr[i].dipNum;
                    $('#jdsjs').val(_allDataArr[i].tkRecTime);
                    $('#kssjs').val(_allDataArr[i].tkTime);
                    $('#wcsjs').val(_allDataArr[i].tkCompTime);
                    $('#beizhus').val(_allDataArr[i].remark);
                }
            };
            var prm = {
                dipNum:workDone1.jhbm,
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevMT/YWDMPGetItemAndMembers',
                data:prm,
                success:function(result){
                    console.log(result);
                    _allXJSelect = [];
                    //找到存放所有巡检条目的数组，比较
                    for(var j=0;j<_tiaoMuArr.length;j++){
                        for(var i=0;i<result.dipItems.length;i++){
                            if( result.dipItems[i].ditNum == _tiaoMuArr[j].ditNum ){
                                _allXJSelect.push(_tiaoMuArr[i]);
                            }
                        }
                    }
                    datasTable($('#personTable1s'),_allXJSelect);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }
            });
        })
    $('#personTable1s tbody')
        .on('click','.option-edite',function(){
            //样式
            var $this = $(this).parents('tr');
            $('#personTable1s tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');

            _index = $(this).parents('tr').index();
            moTaiKuang($('#myModal3'));
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            for(var i=0;i<_tiaoMuArr.length;i++){
                if( _tiaoMuArr[i].ditNum == $thisBM ){
                    tmtable.tmbm = _tiaoMuArr[i].ditNum;
                    tmtable.tmmc = _tiaoMuArr[i].ditName;
                    tmtable.tmckz = _tiaoMuArr[i].stValue;
                    tmtable.bjgx = _tiaoMuArr[i].relation;
                    tmtable.xjjg = '';
                    tmtable.jgjl = '';
                    tmtable.ycms = '';
                }
            }
        })
    //tab选项卡
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
    });
    //接单
    $('#myModal').on('click','.jiedan',function(){
        var prm = {
            itkNum:workDone.rwdh,
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevMT/ywMTKRecTask',
            data:prm,
            success:function(result){
                if(result == 99){
                    moTaiKuang($('#myModal5'));
                    $('#myModal5').find('.modal-body').html('接单成功！');
                    $('#myModal').modal('hide');
                    conditionSelect(stationsFlag,wxBanzusFlag);
                }
            }
        })
    });
    //执行
    $('#myModal1').on('click','.zhixing',function(){
        var prm = {
            "itkNum": workDone1.rwdh,
            "remark": $('#beizhus').val(),
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevMT/ywMTKFinishTask',
            data:prm,
            success:function(result){
                if(result == 99){
                    moTaiKuang($('#myModal5'));
                    $('#myModal5').find('.modal-body').html('执行成功！');
                    $('#myModal1').modal('hide');
                    conditionSelect(stationsFlag,wxBanzusFlag);
                }
            }
        })
    });
    //弹窗关闭按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    /*--------------------------------------------其他方法--------------------------------------------*/
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

        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            itkNum:filterInput[0],
            itkName:filterInput[1],
            dcNum:$('#sblx').val(),
            dNum:filterInput[2],
            dName:filterInput[3],
            dipKeshi:filterInput[4],
            manager:filterInput[5],
            ditST:filterInput[6],
            ditET:filterInput[7],
            isAllData:0,
            userID:_userIdName,
            wxDepartNums:arr
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevMT/YWDMTGetTasks',
            data:prm,
            success:function(result){
                console.log(result);
                _allDataArr = [];
                var jiedanArr = [];
                var zhixingArr = [];
                for(var i=0;i<result.length;i++){
                    _allDataArr.push(result[i]);
                    if(result[i].status == 0){
                        jiedanArr.push(result[i]);
                    }else if(result[i].status == 1){
                        zhixingArr.push(result[i]);
                    }
                }
                datasTable($('#scrap-datatables'),result);
                datasTable($('#scrap-datatables1'),jiedanArr);
                datasTable($('#scrap-datatables2'),zhixingArr);
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
    //确定新增弹出框的位置
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
    }
    //表格初始化
    function tableInit(tableId,col){
        tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": true,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": false,
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
            "dom":'B<"clear">lfrtip',
            'buttons':[
                {
                    extend: 'excelHtml5',
                    text: '导出',
                    className:'saveAs hidding'
                }
            ],

            "columns": col
        })
    }

    //获取所属维保组和所属班组
    function InfluencingUnit(){
        var prm = {
            "id": 0,
            "ddNum": "",
            "ddName": "",
            "ddPy": "",
            "daNum": "",
            "userID": _userIdName,
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

                conditionSelect(stationsFlag,wxBanzusFlag);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }
})