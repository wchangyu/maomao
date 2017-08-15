$(function(){
    /*-------------------------------全局变量-------------------------------------------------*/
    //获得用户ID
    var _userIdNum = sessionStorage.getItem('userName');

    //获得用户名

    var _userIdName = sessionStorage.getItem('realUserName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //时间初始化
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language: 'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });

    //设置初始时间(主表格时间)
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');

    //选择设备时间
    var _initStartSB = '';
    var _initEndSB = '';

    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);

    //时间参数
    var slrealityStart = '';

    var slrealityEnd = '';

    //存放线路数组
    var _lineArr = [];

    //影响单位
    var  _InfluencingArr = [];

    //影响单位
    InfluencingUnit();

    //车间
    ajaxFun('YWDev/ywDMGetDDs', $('#station'), 'ddName', 'ddNum');

    //线路
    lineRouteData($('#line-point'));

    //获取分类原因
    classificationReasons();

    /*------------------------------表格初始化-----------------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType": "full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
            'infoEmpty': '没有数据',
            'paginate': {
                "previous": "上一页",
                "next": "下一页",
                "first": "首页",
                "last": "尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className: 'saveAs',
                header: true,
                exportOptions: {
                    columns: [0, 1, 2, 4, 5, 6, 7]
                }
            }
        ],
        "dom": 't<"F"lip>',
        "columns": [
            {
                title: '工单号',
                data: 'gdCode2',
                className: 'gongdanId',
                render: function (data, type, row, meta) {
                    return '<span gdCode="' + row.gdCode +
                        '"' + "gdCircle=" + row.gdCircle +
                        '>' + data +
                        '</span>'
                }
            },
            {
                title: '工单类型',
                data: 'gdJJ',
                render: function (data, type, full, meta) {
                    if (data == 0) {
                        return '普通'
                    }
                    if (data == 1) {
                        return '快速'
                    }
                }
            },
            {
                title: '工单状态',
                data: 'gdZht',
                className: 'gongdanZt',
                render: function (data, type, full, meta) {
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
                title: '状态值',
                data: 'gdZht',
                className: 'ztz'
            },
            {
                title: '车站',
                data: 'bxKeshi'
            },
            {
                title: '设备类型',
                data: 'wxShiX'
            },
            {
                title: '故障位置',
                data: 'wxDidian'
            },
            {
                title: '登记时间',
                data: 'gdShij'
            },
            {
                title: '操作',
                "targets": -1,
                "data": null,
                "className": 'noprint',
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>"
            }
        ]
    });

    //自定义按钮位置
    table.buttons().container().appendTo($('.excelButton'), table.table().container());

    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function (s, h, m) {
        console.log('')
    };

    //条件查询
    conditionSelect();
    /*------------------------------按钮点击功能----------------------------------------------*/
    //线点、车站联动
    $('#line-point').change(function(){
        //首先将select子元素清空；
        $('#station').empty();
        //获得选中的线路的value
        var values = $('#line-point').val();
        if(values == ''){
            //所有车站
            ajaxFun('YWDev/ywDMGetDDs', $('#station'), 'ddName', 'ddNum');
        }else{
            for(var i=0;i<_lineArr.length;i++){
                if(values == _lineArr[i].dlNum){
                    //创建对应的车站
                    var str = '<option value="">请选择</option>';
                    for(var j=0;j<_lineArr[i].deps.length;j++){
                        str += '<option value="' + _lineArr[i].deps[j].ddNum +
                            '">'+ _lineArr[i].deps[j].ddName + '</option>';
                    }
                    $('#station').append(str);
                }
            }
        }
    });

    //影响单位、用户分类联动
    $('#influence-unite').change(function(){
        var values = $('#influence-unite').val();
        $('#userClass').empty();
        if(values == ''){
            InfluencingUnit('flag');
        }else{
            for(var i=0;i<_InfluencingArr.length;i++){
                if(values == _InfluencingArr[i].departNum){
                    var str = '<option value="">请选择</option>';
                    for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){
                        str += '<option value="' + _InfluencingArr[i].wxBanzus[j].departNum +
                            '">' + _InfluencingArr[i].wxBanzus[j].departName + '</option>'
                    }
                    $('#userClass').append(str);
                }
            }
        }
    });

    //查询
    $('#selected').click(function(){
        conditionSelect();
    })

    /*------------------------------其他方法-------------------------------------------------*/
    //ajaxFun（select的值）
    function ajaxFun(url, select, text, num) {
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            async: false,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
                }
                select.append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //线路数据
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

    //条件查询
    function conditionSelect(){
        if($('.datatimeblock').eq(0).val() == ''){
            slrealityStart = ''
        }else{
            slrealityStart = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD') + ' 00:00:00';
        }
        if($('.datatimeblock').eq(1).val() == ''){
            slrealityEnd = ''
        }else{
            slrealityEnd = moment($('.datatimeblock').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }
        var prm = {
            gdCode2:$('#gdcode').val(),
            gdSt:slrealityStart,
            gdEt:slrealityEnd,
            userID:_userIdNum,
            userName:_userIdName
        };
        var userArr = [];
        var cheArr = [];
        if($('#line-point').val() != '' && $('#userClass').val() == ''){
            for(var i=0;i<_InfluencingArr.length;i++){
                if( $('#line-point').val() == _InfluencingArr[i].departNum ){
                    for(var j = 0;j<_InfluencingArr[i].wxBanzus.length;j++){
                        userArr.push(_InfluencingArr[i].wxBanzus[j].departNum);
                    }
                }
            }
            prm.wxKeshis = userArr;
        }else{
            prm.wxKeshi = $('#userClass').val();
        }
        if( $('#line').val() != '' && $('#station').val() == ''){
            var values = $('#line').val();
            for(var i=0;i<_lineArr.length;i++){
                if( values == _lineArr[i].dlNum ){
                    for(var j=0;j<_lineArr[i].deps.length;j++){
                        cheArr.push(_lineArr[i].deps[j].ddNum);
                    }
                }
            }
            prm.bxKeshiNums = cheArr;
        }else{
            prm.bxKeshiNum = $('#station').val()
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetZh2',
            data:prm,
            async:false,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }


    //获取到影响单位、用户分类
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
                var str = '<option value="">请选择</option>';
                var str1 = '<option value="">请选择</option>';
                if(flag){
                    for(var i=0;i<result.wxBanzus.length;i++){
                        str1 += '<option value="' + result.wxBanzus[i].departNum +
                            '">' + result.wxBanzus[i].departName + '</option>';
                    }
                    $('#userClass').append(str1);
                }else{
                    _InfluencingArr = [];
                    for(var i=0;i<result.stations.length;i++){
                        _InfluencingArr.push(result.stations[i]);
                        str += '<option value="' + result.stations[i].departNum +
                            '">' + result.stations[i].departName + '</option>';
                    }
                    for(var i=0;i<result.wxBanzus.length;i++){
                        str1 += '<option value="' + result.wxBanzus[i].departNum +
                            '">' + result.wxBanzus[i].departName + '</option>';
                    }
                    $('#influence-unite').append(str);
                    $('#userClass').append(str1);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
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

    //获取到分类原因
    function classificationReasons(){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDengdyy',
            data:prm,
            success:function(result){
                console.log(result);
                var str = '<option>请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].reasonNum + '">' + result[i].reasonDesc + '</option>';
                }
                $('#cause-classification').append(str);
            }
        })
    }
})