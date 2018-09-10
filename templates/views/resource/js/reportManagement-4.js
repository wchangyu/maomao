$(function (){
    /*-------------------------全局变量----------------------------*/
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });
    //设置初始时间
    var _initStart = moment().startOf('month').format('YYYY/MM/DD');
    var _initEnd = moment().endOf('month').format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //实际发送时间
    var realityStart;
    var realityEnd;
    //获得用户名id
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名id
    var _userIdName = sessionStorage.getItem('realUserName');
    /*-------------------------表格初始化--------------------------*/
    //页面表格
    var _table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": true,
        "order":[],
        "pagingType":"full_numbers",
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                className:'saveAs',
                header:true
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'报修部门',
                data:'bxKeshi'
            },
            {
                title:'报修量',
                data:'gdNum'
            },
            {
                title:'完工量',
                data:'gdWgNum'
            },
            {
                title:'未完工量',
                data:'gdWwgNum'
            },
            {
                title:'维修耗时',
                data:'wxShij'
            }
        ],
        "columnDefs": [ { "orderable": false, "targets": ['0'] }],
        "drawCallback":drawFn
    });

    //重绘合计数据
    function drawFn(){

        var table = $('#scrap-datatables').DataTable();

        //表格中的每一个tr
        var tr = $('#scrap-datatables tbody').children('tr');

        //报修量
        var bxNum = 0;

        //完工量
        var wgNum = 0;

        //未完工量
        var wwgNum = 0;

        //耗时
        var time = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //报修量
                bxNum += Number(tr.eq(i).children().eq(1).html());

                //完工量
                wgNum += Number(tr.eq(i).children().eq(2).html());

                //未完工量
                wwgNum += Number(tr.eq(i).children().eq(3).html());

                //维修耗时
                time += Number(tr.eq(i).children().eq(4).html());

            }

        }

        //报修量
        $('#pageBXNum').html(bxNum);

        //完工量
        $('#pageWGNum').html(wgNum);

        //未完工量
        $('#pageWWGNum').html(wwgNum);

        //耗时
        $('#pageTime').html(time.toFixed(2));

    };

    _table.buttons().container().appendTo($('.excelButton'),_table.table().container());

    $('#scrap-datatables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": true,
        "order":[],
        "iDisplayLength":50,//默认每页显示的条数
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                className:'saveAs',
                header:true
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                name: 'second',
                title:'报修部门',
                data:'bxKeshi'
            },
            {
                title:'报修量',
                data:'gdNum'
            },
            {
                title:'完工量',
                data:'gdWgNum'
            },
            {
                title:'未完工量',
                data:'gdWwgNum'
            },
            {
                title:'维修部门',
                data:'wxKeshi'
            },
            {
                title:'维修耗时',
                data:'wxShij',
                render:function(data, type, full, meta){
                    return Number(data).toFixed(2);
                }
            }
        ],
        rowsGroup: [
            'second:name',
            0,
            1,
            2,
            3,
            4,
            5
        ],
        "drawCallback":drawFn1
    });

    //重绘合计数据
    function drawFn1(){

        var table = $('#scrap-datatables1').DataTable();

        //表格中的每一个tr
        var tr = $('#scrap-datatables1 tbody').children('tr');

        //报修量
        var bxNum = 0;

        //完工量
        var wgNum = 0;

        //未完工量
        var wwgNum = 0;

        //维修耗时
        var time = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //报修量
                bxNum += Number(tr.eq(i).children().eq(1).html());

                //完工量
                wgNum += Number(tr.eq(i).children().eq(2).html());

                //未完工量
                wwgNum += Number(tr.eq(i).children().eq(3).html());

                //耗时
                time += Number(tr.eq(i).children().eq(5).html());

            }

        }

        //报修量
        $('#pageBXNum1').html(bxNum);

        //完工量
        $('#pageWGNum1').html(wgNum);

        //未完工量
        $('#pageWWGNum1').html(wwgNum);

        //耗时
        $('#pageTimeNum1').html(time.toFixed(2));

    };

    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //给表格的标题赋时间
    $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + _initStart + '——' + _initEnd);
    $('#scrap-datatables1').find('caption').children('p').children('span').html(' ' + _initStart + '——' + _initEnd);
    /*-------------------------获取表格数据-----------------------*/
    conditionSelect();
    /*--------------------------按钮功能------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal2').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal2'));
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal2').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal2'));
            }else{
                $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + $('.min').val() + '——' + $('.max').val());
                $('#scrap-datatables1').find('caption').children('p').children('span').html(' ' + $('.min').val()+ '——' + $('.max').val());
                conditionSelect();
            }
        }

    })
    //重置按钮
    $('.resites').click(function(){
        //时间选为当天，其他输入框置为空
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })
    //提示框的确定
    $('.confirm1').click(function(){
        $('#myModal2').modal('hide');
    })
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
    /*----------------------------方法------------------------------*/
    //查询方法
    function conditionSelect(){
        //获取所有input框的值
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[0] + ' 00:00:00';
        realityEnd = moment(filterInput[1]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';

        tableInit();

        var prm = {
            'gdSt':realityStart,
            'gdEt':realityEnd,
            'wxKeshi':filterInput[3],
            'bxKeshi':filterInput[2],
            'userID':_userIdNum,
            'userName':_userIdName
        }

        tableInit();

        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDRptBxKeshi',
            data:prm,
            success:function(result){
                //给表格赋值
                if(result){

                    datasTable($("#scrap-datatables"),result.bxGd);

                    datasTable($("#scrap-datatables1"),result.bxwxGD);

                    //表格1

                    //报修量
                    var bxNum = 0;

                    //完工量
                    var wgNum = 0;

                    //未完工量
                    var wwgNum = 0;

                    //耗时
                    var time = 0;

                    for(var i=0;i<result.bxGd.length;i++){

                        var data = result.bxGd[i];

                        //报修量
                        bxNum += Number(data.gdNum);

                        //完工量
                        wgNum += Number(data.gdWgNum);

                        //未完工量
                        wwgNum += Number(data.gdWwgNum);

                        //超时
                        time += Number(data.wxShij);

                    }

                    //报修量
                    $('#dataBXNum').html(bxNum);

                    //完工量
                    $('#dataWGNum').html(wgNum);

                    //未完工量
                    $('#dataWWGNum').html(wwgNum);

                    //耗时
                    $('#dataTime').html(time.toFixed(2));


                    //表格2
                    //报修量
                    var bxNum1 = 0;

                    //完工量
                    var wgNum1 = 0;

                    //未完工量
                    var wwgNum1 = 0;

                    //耗时
                    var time1 = 0;

                    for(var i=0;i<result.bxwxGD.length;i++){

                        var data = result.bxwxGD[i];

                        //报修量
                        bxNum1 += Number(data.gdNum);

                        //完工量
                        wgNum1 += Number(data.gdWgNum);

                        //未完工量
                        wwgNum1 += Number(data.gdWwgNum);

                        //超时
                        time1 += Number(data.wxShij);

                    }

                    //报修量
                    $('#dataBXNum1').html(bxNum1);

                    //完工量
                    $('#dataWGNum1').html(wgNum1);

                    //未完工量
                    $('#dataWWGNum1').html(wwgNum1);

                    //耗时
                    $('#dataTimeNum1').html(time1.toFixed(2));

                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })
    }
    //提示框
    //模态框自适应
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        //$('#myModal2').find('.modal-body').html('起止时间不能为空');
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
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

    //表格初始化
    function tableInit(){

        $('.table').find('tfoot').find('td').html(0);

        //表格1
        $('.table').eq(0).find('tfoot').find('tr').eq(0).children().eq(0).html('小计');

        $('.table').eq(0).find('tfoot').find('tr').eq(1).children().eq(0).html('合计');


        //表格2
        $('.table').eq(1).find('tfoot').find('tr').eq(0).children().eq(0).html('小计');

        $('.table').eq(1).find('tfoot').find('tr').eq(1).children().eq(0).html('合计');

        $('.table').eq(1).find('tfoot').find('tr').eq(0).children().eq(4).html('');

        $('.table').eq(1).find('tfoot').find('tr').eq(1).children().eq(4).html('');

    }
})