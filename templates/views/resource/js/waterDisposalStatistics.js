$(function(){

    /*---------------------------------------------------------时间插件--------------------------------------------------*/

    //默认按日初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //日期选择
    $('#timeType').change(function(){

        $('.timeShow').hide();

        if($(this).val() == 'day'){

            _timeYMDComponentsFun($('.datatimeblock'));

            var data = moment().format('YYYY/MM/DD');

            $('.datatimeblock').eq(0).val(data);

        }else if($(this).val() == 'month'){

            _monthDate($('.datatimeblock'));

            var data = moment().format('YYYY/MM');

            $('.datatimeblock').eq(0).val(data)

        }else if($(this).val() == 'year'){

            _yearDate($('.datatimeblock'));

            var data = moment().format('YYYY');

            $('.datatimeblock').eq(0).val(data);

        }else if($(this).val() == 'week'){

            _timeYMDComponentsFun($('.datatimeblock'));

            var data = moment().format('YYYY/MM/DD');

            var startData = moment(data).startOf('week').add(1,'d').format('YYYY/MM/DD');

            var endData = moment(data).endOf('week').add(1,'d').format('YYYY/MM/DD');

            $('.datatimeblock').eq(0).val(startData);

            $('.datatimeblock').eq(1).val(endData);

            $('.timeShow').show();

        }else if($(this).val() == 'custom'){

            _timeYMDComponentsFun($('.datatimeblock'));

            var data = moment().format('YYYY/MM/DD');

            $('.datatimeblock').eq(0).val(data);

            $('.datatimeblock').eq(1).val(data);

            $('.timeShow').show();

        }

    });

    //默认时间
    var nowTime = moment().format('YYYY/MM/DD');

    $('.datatimeblock').val(nowTime);

    /*-------------------------------------------------------表格初始化---------------------------------------------------*/
    var col = [

        {
            title:'日期',
            data:'日期',
            className:'rowOne',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data

                }

            }

        },
        {
            title:'用电量（度）',
            data:'用电量（度）',
            className:'rowOne',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'污水排放量（吨）',
            data:'污水排放量（吨）',
            className:'rowOne',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data

                }

            }
        },
        //{
        //    title:'余氯（mg/L）',
        //    data:'',
        //    className:'mergeCo',
        //    render:function(data, type, full, meta){
        //
        //        if(data == ''){
        //
        //            return ''
        //
        //        }else{
        //
        //            return data
        //        }
        //
        //    }
        //},
        {
            title:'00:00',
            data:'cl1',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'02:00',
            data:'cl2',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'04:00',
            data:'cl3',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'06:00',
            data:'cl4',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'08:00',
            data:'cl5',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'10:00',
            data:'cl6',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'12:00',
            data:'cl7',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'14:00',
            data:'cl8',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'16:00',
            data:'cl9',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'18:00',
            data:'cl10',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'20:00',
            data:'cl11',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'22:00',
            data:'cl12',
            className:'rowTwo',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'盐用量（公斤）',
            data:'盐用量（公斤）',
            className:'rowOne',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        },
        {
            title:'PH1',
            data:'PH1',
            className:'rowOne',
        },
        {
            title:'PH2',
            data:'PH2',
            className:'rowOne',
        },
        {
            title:'执行人',
            data:'执行人',
            className:'rowOne',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data
                }

            }
        }

    ]

    //_tableInit($('#all-reporting'),col,2,false,'','','','',10,'');

    //重绘表头
    function headerFun(thead, data, start, end, display){

        var rowOne = $(thead).find('.rowOne');

        var rowTwo = $(thead).find('.rowTwo');

        var mergeCo = $(thead).find('.mergeCo');

        var spanStr = '<th class="sorting_disabled mergeCo" colspan="12">余氯（mg/L）</th>';

        rowOne.attr('rowspan',2);

        //在创建一个tr
        var trStr = '<tr></tr>';

        if($('.table thead').children().length == 1){

            $('.table thead').children().eq(0).children().eq(2).after(spanStr);

            $('.table thead').append(trStr);

            $('.table thead').children().eq(1).append(rowTwo);

        }

    }

    initTable($('#all-reporting'),col,headerFun);

    conditionSelect();

    /*------------------------------------------------------按钮事件-----------------------------------------------------*/

    $('#selected').click(function(){

        conditionSelect();

    })

    //导出
    $('.excelButton').click(function(){

        _FFExcel($('#all-reporting')[0]);

    })

    //打印
    $('.dataTables_length').parent().addClass('noprint');

    /*-----------------------------------------------------其他方法------------------------------------------------------*/

    function conditionSelect(){

        //开始时间
        var st = '';
        //结束时间
        var et = '';

        if($('#timeType').val() == 'day'){

            st = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD');

        }else if($('#timeType').val() == 'month'){

            st = moment($('.datatimeblock').eq(0).val()).startOf('months').format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(0).val()).endOf('months').format('YYYY/MM/DD');

        }else if($('#timeType').val() == 'year'){

            st = moment($('.datatimeblock').eq(0).val()).startOf('years').format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(0).val()).endOf('years').format('YYYY/MM/DD');

        }else if($('#timeType').val() == 'week'){

            st = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(1).val()).format('YYYY/MM/DD');

        }else if($('#timeType').val() == 'custom'){

            st = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD');

            et = moment($('.datatimeblock').eq(1).val()).format('YYYY/MM/DD');

        }

        var prm = {

            'reportID':'101',
            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:st
                },
                //结束时间
                {

                    name:'et',

                    value:et

                }
            ]

        }

        _mainAjaxFun('post','YWFZ/GetFroms',prm,successFun);

        function successFun(result){

            if(result != null){

                //初始化表格

                var dataArr = _packagingTableData(result[1]);

                _jumpNow($('#all-reporting'),dataArr);

            }

        }


    }

    //表格初始化
    //表格初始化
    function initTable(table,arr,headerCallBack,footerCallBack,fnRowCallback,drawCallback){
        var table =  table.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": false,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": true,
            "ordering": false,
            "pagingType":"full_numbers",
            "bStateSave":true,
            "aLengthMenu": [ 10, 25, 50, 100],
            "iDisplayLength":25,//默认每页显示的条数
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '共 _TOTAL_ 条数据',
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
            "columns": arr,
            "headerCallback":headerCallBack,
            "footerCallback": footerCallBack,
            "fnRowCallback": fnRowCallback,
            "drawCallback":drawCallback
        });
        //table.buttons().container().appendTo($('.excelButton'),table.table().container());
    }

})