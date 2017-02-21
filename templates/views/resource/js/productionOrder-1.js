$(function(){
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd'
    });
    //设置初始时间
    var initStart = moment().format('YYYY-MM-DD');
    $('.datatimeblock').val(initStart);
    //初始化表格
    var table = $('#scrap-datatables').DataTable({
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
            'info': '第_PAGE_页/共_PAGES_页',
            "sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
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
                text: '保存为excel格式',
                className:'saveAs'
            }
        ],
        "ajax":'../resource/data/gongdanData.json',
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'序号',
                data:''
            },
            {
                title:'工单号',
                data:'gongdanhao'
            },
            {
                title:'工单状态',
                data:'gongdanzhuangtai'
            },
            {
                title:'报修科室',
                data:'baoxiukeshi'
            },
            {
                title:'维修事项',
                data:'weixiushixiang'
            },
            {
                title:'维修地点',
                data:'weixiudidian'
            },
            {
                title:'登记时间',
                data:'time'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "------"
            }
        ],
        "columnDefs": [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
        "order": [[1, 'asc']]
    });
    //给表格添加索引列
    table.on('order.dt search.dt',
        function() {
            table.column(0, {
                search: 'applied',
                order: 'applied'
            }).nodes().each(function(cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();
    //表格的搜索框
    //搜索
    //目前先认定开始时间和结束时间一致的情况下搜索出来
    $.fn.dataTable.ext.search.push(
        function( settings,data,dataIndex ){
            var min = $('.min').val() || '';
            var max = $('.max').val() || '';
            var minage = data[6] || '';
            if( (minage >= min) && (minage <= max) ){
                return true;
            }
            return false;
        }

    );
    function filterGlobal () {
        $('#scrap-datatables').DataTable().search(
            $('#global_filter').val()
        ).draw();
    }
    $('#selected').click(function(){
        table.draw();
        filterGlobal();
    })
    //鼠标行高亮
    var lastIdx = null;
    $('#scrap-datatables tbody')
        .on( 'mouseover', 'td', function () {
            var colIdx = table.cell(this).index();
            if ( colIdx !== lastIdx ) {
                $( table.cells().nodes() ).removeClass( 'highlight' );
                $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
            }
        } )
        .on( 'mouseleave', function () {
            $( table.cells().nodes() ).removeClass( 'highlight' );
        } )
        .on('dblclick','tr',function(){
            //当前行变色
            $('#scrap-datatables tbody').children('tr').css({'background':'#ffffff'});
            $(this).css({'background':'#FBEC88'});
            markSize ();
            $('.gongdanMarkBlock').hide();
            $('.workDone').show();
        })
    //弹窗中的表格
    var tables = $('#personTable').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "ajax":'../resource/data/gongdanData.json',
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:' ',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'工单状态',
                data:'gongdanzhuangtai'
            },
            {
                title:'报修科室',
                data:'baoxiukeshi'
            },
            {
                title:'维修事项',
                data:'weixiushixiang'
            },
            {
                title:'维修地点',
                data:'weixiudidian'
            },
            {
                title:'登记时间',
                data:'time'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "------"
            }
        ]
    });

    //弹出框的复选框选择
    $('#personTable tbody').on('click','input',function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    })
    //弹窗中的另一个表格
    var tabless = $('#personTables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "ajax":'../resource/data/gongdanData.json',
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:' ',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'工单状态',
                data:'gongdanzhuangtai'
            },
            {
                title:'报修科室',
                data:'baoxiukeshi'
            },
            {
                title:'维修事项',
                data:'weixiushixiang'
            },
            {
                title:'维修地点',
                data:'weixiudidian'
            },
            {
                title:'登记时间',
                data:'time'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "------"
            }
        ]
    });
    //弹出框的复选框选择
    $('#personTables tbody').on('click','input',function(){
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    })
    //弹窗切换表格效果
    $('.table-title span').click(function(){
        $('.table-title span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.tableHover').css({'z-index':0});
        $('.tableHover').eq($(this).index()).css({
            'z-index':1
        })
    });
    //close功能
    $('.closes').click(function(){
        $('.gongdanMark').hide();
    })
    $('.closee').click(function(){
        $('.gongdanMark').hide();
    })

    /*窗口改变遮罩也改变*/
    window.onresize = function(){
        var display =  $('.gongdanMark')[0].style.display;
        if(display == 'block'){
            markSize ();
        }
    }
    //遮罩大小改变
    function markSize (){
        var markWidth = document.documentElement.clientWidth;
        var markHeight = document.documentElement.clientHeight;
        var markBlockWidth = $('.gongdanMarkBlock').width();
        var markBlockHeight = $('.gongdanMarkBlock').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        var markBlockLeft = (markWidth - markBlockWidth)/2;
        $('.gongdanMark').css({'width':markWidth,'height':markHeight});
        $('.gongdanMark').show();
        $('.gongdanMarkBlock').css({'top':markBlockTop,'left':markBlockLeft});
    }

    //登记按钮功能
    $('.creatButton').click(function(){
        $('.gongdanMark').show();
        $('.gongdanMarkBlock').hide();
        markSize ();
        $('.createGongdan').show();
    })
    //新增表格初始化
    var tables1 = $('#personTable1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页',
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
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "ajax":'../resource/data/gongdanData.json',
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:' ',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'工单状态',
                data:'gongdanzhuangtai'
            },
            {
                title:'报修科室',
                data:'baoxiukeshi'
            },
            {
                title:'维修事项',
                data:'weixiushixiang'
            },
            {
                title:'维修地点',
                data:'weixiudidian'
            },
            {
                title:'登记时间',
                data:'time'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "------"
            }
        ]
    });
    var tabless1 = $('#personTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
                className:'hiddenButton'
            }
        ],
        "ajax":'../resource/data/gongdanData.json',
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:' ',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
            },
            {
                title:'工单状态',
                data:'gongdanzhuangtai'
            },
            {
                title:'报修科室',
                data:'baoxiukeshi'
            },
            {
                title:'维修事项',
                data:'weixiushixiang'
            },
            {
                title:'维修地点',
                data:'weixiudidian'
            },
            {
                title:'登记时间',
                data:'time'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "------"
            }
        ]
    });


    /*重置按钮的*/
    //点击重置按钮的时候，所有input框清空，时间还原成今天的
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.datatimeblock').val(initStart);
    })


    /*设置导出excel样式*/
    $('.saveAs').addClass('btn btn-success');
})