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
        })

    //webuploader
    var $list=$("#thelist");//上传区域
    var $btn =$("#ctlBtn");//上传按钮
    var thumbnailWidth = 100;
    var thumbnailHeight = 100;
    //初始化设置
    var uploader = WebUploader.create({
        //选完文件是否上传
        /*auto:true,*/
        //swf的路径
        swf:'webuploader/Uploader.swf',
        //文件接收服务端
        server:'http://webuploader.duapp.com/server/fileupload.php',
        pick: '#picker',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });
    //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '<p class="state">等待上传...</p>' +
                '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.append( $li );

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    });
    //文件上传进度
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );
    });
    //文件成功，失败处理
    uploader.on( 'uploadSuccess', function( file ) {
        $( '#'+file.id ).find('p.state').text('已上传');
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错00');
    });
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });
    $('#ctlBtn').click(function(){
        uploader.upload();
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
        //alert($(this).index());
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
    //待派工的上传下载功能
    //webuploader
    var $list1=$("#thelist1");//上传区域
    var $btn1 =$("#ctlBtn1");//上传按钮
    var thumbnailWidth1 = 100;
    var thumbnailHeight1 = 100;
    //初始化设置
    var uploader = WebUploader.create({
        //选完文件是否上传
        /*auto:true,*/
        //swf的路径
        swf:'webuploader/Uploader.swf',
        //文件接收服务端
        server:'http://webuploader.duapp.com/server/fileupload.php',
        pick: '#picker1',
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });
    //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '<p class="state">等待上传...</p>' +
                '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list1.append( $li );

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth1, thumbnailHeight1 );
    });
    //文件上传进度
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );
    });
    //文件成功，失败处理
    uploader.on( 'uploadSuccess', function( file ) {
        $( '#'+file.id ).find('p.state').text('已上传');
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错00');
    });
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });
    $('#ctlBtn1').click(function(){
        uploader.upload();
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

    /*按回车键跳到下一个表格*/
    document.onkeypress = function EnterPress(e){ //传入 event
        var e = e || window.event;
        if(e.keyCode == 13){
            //获取所有input控件
            //console.log($('input'));
            console.log(e.target);
        }
    }
})