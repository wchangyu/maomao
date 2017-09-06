$(function(){
    /*--------------------------------全局变量---------------------------------*/
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        format: "yyyy/mm",//选择日期后，文本框显示的日期格式
        language: "zh-CN" //汉化
    });

    //获得用户id
    var _userIdNum = sessionStorage.getItem('userName');

    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //设置初始时间
    var _initStart = moment().format('YYYY/MM');

    var _initEnd = moment().format('YYYY/MM');

    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    var realityStart = '';

    var realityEnd = '';

    //获得仓库
    getWarehouse();

    /*-------------------------------------表格初始化------------------------------*/

    var _tables = $('.main-contents-table .table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                //title:'商品分类',
                data:''
            },
            {
                //name: 'second',
                //title:'商品编码',
                data:''
            },
            {
                //title:'存放位置',
                data:''
            },
            {
                //title:'商品名称',
                data:''
            },
            {
                //title:'规格型号',
                data:''
            },
            {
                //title:'单位',
                data:''
            },
            {
                //title:'数量',
                data:''
            },
            {
                //title:'单价',
                data:''
            },
            {
                //title:'金额',
                data:''
            },
            {
                //title:'数量',
                data:''
            },
            {
                //title:'金额',
                data:''
            },
            {
                //title:'数量',
                data:''
            },
            {
                //title:'金额',
                data:''
            },
            {
                //title:'数量',
                data:''
            },
            {
                //title:'单价',
                data:''
            },
            {
                //title:'金额',
                data:''
            },
        ],
        //"rowsGroup": [
        //    'second:name',
        //    0,
        //    1,
        //],
    });

    _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    /*------------------------------------表格数据--------------------------------*/

    //conditionSelect();
    /*-------------------------------------按钮事件-------------------------------*/

    //查询按钮
    $('#selected').click(function(){
        //conditionSelect();
    })
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
            'st':realityStart,
            'et':realityEnd,
            'itemNum':filterInput[0],
            'itemName':filterInput[1],
            'inoutType':$('.tiaojian').val(),
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptInventory',
            data:prm,
            success:function(result){
                datasTable($('#scrap-datatables'),result)
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

    //获取仓库
    function getWarehouse(){
        var prm ={
            userID:_userIdNum,
            userName:_userIdName,
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){
                //console.log(result);
                var str = '<option value="">全部</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result.storageNum + '">' + result[i].storageName + '</option>';
                }
                $('#storage').append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})