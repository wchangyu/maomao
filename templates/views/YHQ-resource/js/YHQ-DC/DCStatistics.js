$(function(){

    /*---------------------------------时间插件--------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    //餐厅数据
    RestaurantType();

    /*----------------------------------表格初始化-----------------------------------*/

    //菜品统计
    var col = [

        {
            title:'菜品名称',
            data:'cookname'
        },
        {
            title:'数量',
            data:'num'
        },
        {
            title:'总价（元）',
            data:'price'
        }

    ]

    _tableInit1($('#table'),col,'2','','',drawFnCol,'','','',true,'','','',true);

    //重绘合计数据
    function drawFnCol(){

        //表格中的每一个tr
        var tr = $('#table tbody').children('tr');

        //数量
        var num = 0;

        //总价
        var money = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //数量
                num += Number(tr.eq(i).children().eq(1).html());

                //总价
                money += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //数量
        $('#DCNum').html(num);

        //总价
        $('#DCMoney').html(money.toFixed(2));

    };

    //三餐类型
    var threeCol = [

        {
            title:'三餐类型',
            data:'mmn'
        },
        {
            title:'数量',
            data:'ordernum'
        },
        {
            title:'总价（元）',
            data:'paysum'
        }

    ]

    _tableInit1($('#three-table'),threeCol,'2','','',drawFnthreeCol,'','','',true,'','','',true);

    //重绘合计数据
    function drawFnthreeCol(){

        //表格中的每一个tr
        var tr = $('#three-table tbody').children('tr');

        //数量
        var num = 0;

        //总价
        var money = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //数量
                num += Number(tr.eq(i).children().eq(1).html());

                //总价
                money += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //数量
        $('#three-DCNum').html(num);

        //总价
        $('#three-DCMoney').html(money.toFixed(2));

    };

    //支付类型
    var payCol = [

        {
            title:'支付方式',
            data:'payType',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '当面结账'
                }else if(data == 2){

                    return '月结'
                }
            }

        },
        {
            title:'数量',
            data:'ordernum'
        },
        {
            title:'总价（元）',
            data:'paysum'
        }

    ]

    _tableInit1($('#pay-table'),payCol,'2','','',drawFnpayCol,'','','',true,'','','',true);

    //重绘合计数据
    function drawFnpayCol(){

        //表格中的每一个tr
        var tr = $('#pay-table tbody').children('tr');

        //数量
        var num = 0;

        //总价
        var money = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //数量
                num += Number(tr.eq(i).children().eq(1).html());

                //总价
                money += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //数量
        $('#pay-DCNum').html(num);

        //总价
        $('#pay-DCMoney').html(money.toFixed(2));

    };

    //用户类型
    var userCol = [

        {
            title:'顾客类型',
            data:'userType',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '医护订餐'
                }else if(data == 2){

                    return '病户订餐'
                }
            }

        },
        {
            title:'数量',
            data:'ordernum'
        },
        {
            title:'总价（元）',
            data:'paysum'
        }

    ]

    _tableInit1($('#user-table'),userCol,'2','','',drawFnuserCol,'','','',true,'','','',true);

    //重绘合计数据
    function drawFnuserCol(){

        //表格中的每一个tr
        var tr = $('#user-table tbody').children('tr');

        //数量
        var num = 0;

        //总价
        var money = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //数量
                num += Number(tr.eq(i).children().eq(1).html());

                //总价
                money += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //数量
        $('#user-DCNum').html(num);

        //总价
        $('#user-DCMoney').html(money.toFixed(2));

    };

    //订餐报表
    OrderReport();

    threeOrderReport();

    payReport();

    userReport();

    /*-----------------------------------按钮事件------------------------------------*/

    //tab切换
    $('.nav-tabs-lg').on('click','li',function(){

        $('.table-block').hide();

        $('.table-block').eq($(this).index()).show();

    })


    /*---------------------------------其他方法--------------------------------------*/

    //餐厅
    function RestaurantType(){

        var prm = {

            departnum:_userBM

        }

        $.ajax({

            type:'post',

            url:_urls + 'YHQDC/ReturndepartDiningRooms',

            data:prm,

            async:false,

            timeout:_theTimes,

            success:function(result){

                var str1 = '';

                if(result.code == 99){

                    for(var i=0;i<result.data.length;i++){

                        str1 += '<option value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

                    }

                }

                $('#DC-restaurant-con').append(str1);


            },

            error: function(XMLHttpRequest, textStatus, errorThrown){

                if(el){

                    el.hideLoading();

                }

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时');

                }else{

                    console.log('请求失败');

                }

            }

        })


    }

    //订餐报表
    function OrderReport(){

        var prm = {

            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:$('#epDT').val(),
            //餐厅
            dinningroomid:$('#DC-restaurant-con').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/StatisticsOrderCaipin',prm,$('.content-top'),function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

            }

            _datasTable($('#table'),arr);

        })


    }

    //三餐类型报表
    function threeOrderReport(){

        var prm = {

            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:$('#epDT').val(),
            //餐厅
            dinningroomid:$('#DC-restaurant-con').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/StatisticsOrderMmn',prm,$('.content-top'),function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

            }

            _datasTable($('#three-table'),arr);

        })


    }

    //支付方式报表
    function payReport(){

        var prm = {

            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:$('#epDT').val(),
            //餐厅
            dinningroomid:$('#DC-restaurant-con').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/StatisticsOrderPayType',prm,$('.content-top'),function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

            }

            _datasTable($('#pay-table'),arr);

        })


    }

    //支付方式报表
    function userReport(){

        var prm = {

            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:$('#epDT').val(),
            //餐厅
            dinningroomid:$('#DC-restaurant-con').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/StatisticsOrderUserType',prm,$('.content-top'),function(result){

            var arr = [];

            if(result.code == 99){

                arr = result.data;

            }

            _datasTable($('#user-table'),arr);

        })


    }

    //表格初始化
    //基本表格初始换(buttons=1按钮显示，其他按钮隐藏,dom是真的时候，不显示分页和翻页,导出列,每页显示列数,最后一个是否分页,无数据提示)；
    function _tableInit1(tableId,col,buttons,flag,fnRowCallback,drawCallback,domFlag,arr,num,isPaging,headerCallback,noDataTip,footerCallback,order){

        var buttonVisible = [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs L-condition-button',
                exportOptions:{
                    columns:arr
                }
            }
        ];
        var buttonHidden = [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs hiddenButton'
            }
        ];
        if(buttons == 1){
            buttons = buttonVisible;
        }else{
            buttons =  buttonHidden;
        }

        var dom;

        if(domFlag){

            dom = 't<"F">'

        }else{

            dom = 't<"F"lip>';

        }

        var length = 50;

        if(num){

            length = num;

        }else{

            length = 50;

        }

        var isPag = true;

        if(isPaging){

            isPag = false;

        }else{

            isPag = true;

        }

        var noDataStr = '没有数据';

        if(noDataTip){

            noDataStr = noDataTip

        }

        var isOrder = false;

        if(order){

            isOrder = true;

        }

        var _tables = tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": isPag,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": isOrder,
            "bProcessing":true,
            "iDisplayLength":length,//默认每页显示的条数
            'language': {
                'emptyTable': noDataStr,
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":dom,
            'buttons':buttons,
            "columns": col,
            "fnRowCallback": fnRowCallback,
            "drawCallback":drawCallback,
            "headerCallback":headerCallback,
            "footerCallback":footerCallback,
            columnDefs : [ {
                targets : 0,
                "orderable" : false
            } ],
            "order" : [ [ 1, 'asc' ] ]
        });

        if(flag){
            _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
        }

        //报错时不弹出弹框
        $.fn.dataTable.ext.errMode = function(s,h,m){
            console.log('')
        }

    }

})