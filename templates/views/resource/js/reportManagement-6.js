$(function (){
    /*-------------------------全局变量----------------------------*/
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
    var _initStart = moment().startOf('month').format('YYYY/MM/DD');
    var _initEnd = moment().endOf('month').format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //实际发送时间
    var realityStart;
    var realityEnd;
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    /*-------------------------表格初始化--------------------------*/
    //页面表格
    $('#scrap-datatables').DataTable({
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
                text: '保存为excel格式',
                className:'saveAs',
                header:true
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'维修部门',
                data:'wxKeshi'
            },
            {
                title:'任务量',
                data:'gdNum'
            },
            {
                title:'很满意',
                data:'gdHmy'
            },
            {
                title:'满意',
                data:'gdMy'
            },
            {
                title:'一般',
                data:'gdYb'
            },
            {
                title:'差',
                data:'gdC'
            },
            {
                title:'很差',
                data:'gdHc'
            },
            {
                title:'未评价',
                data:'gdWpj'
            },
            {
                title:'评价率',
                data:'pjl'
            },
            {
                title:'满意率',
                data:'myl'
            }
        ]
    });
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //给表格的标题赋时间
    $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + _initStart + ' 00:00:00' + '——' + _initEnd + ' 00:00:00');
    /*-------------------------获取表格数据-----------------------*/
    conditionSelect();
    function conditionSelect(){
        //获取所有input框的值
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[0] + ' 00:00:00';
        realityEnd = moment(filterInput[1]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            'gdSt':realityStart,
            'gdEt':realityEnd,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDRptMyd',
            data:prm,
            success:function(result){
                console.log(result);
                if(result.length == 0){
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                }else{
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                    table.fnAddData(result);
                    table.fnDraw();
                }
            }
        })
    }
    /*--------------------------按钮功能------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal2').modal({
                show:false,
                backdrop:'static'
            })
            $('#myModal2').find('.modal-body').html('起止时间不能为空');
            $('#myModal2').modal('show');
            moTaiKuang2();
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal2').modal({
                    show:false,
                    backdrop:'static'
                })
                $('#myModal2').find('.modal-body').html('起止时间不能大于结束时间');
                $('#myModal2').modal('show');
                moTaiKuang2();
            }else{
                //给表格的标题赋时间
                $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + $('.min').val() + ' 00:00:00' + '——' + $('.max').val() + ' 00:00:00');
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
    /*----------------------------模态框自适应------------------------------*/
    //提示框
    function moTaiKuang2(){
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = $('#myModal2').find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        $('#myModal2').find('.modal-dialog').css({'margin-top':markBlockTop});
    }
})