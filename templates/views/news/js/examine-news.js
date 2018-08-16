$(function(){
    var _url = sessionStorage.getItem('apiUrlPrefix');
    //登陆者
    var _userID = sessionStorage.getItem('userName');
    var _thisBM = '';

    //传递给后台的参数
    var prms = {

        "isApl": '',
        "eprName": '',
        "isRecommend": -1,
        "userID": _userIdNum
    };

    conditionSelect();

    //添加新闻
    $('.creatButton').on('click',function(){

        window.location.href = 'addNews.html';
    });

    ////获取新闻内容标题
    //$.ajax({
    //    type:'post',
    //    url:_url + 'HBYYG/GetNewsContentByType',
    //    data:prms,
    //    success:function(result){
    //        //动态创建span标签
    //        var spanStr = '';
    //        var tableStr = '';
    //        for(var i=0;i<result.length;i++){
    //            spanStr += '<span>' + result[i].fkName + '</span>';
    //            //动态的创建表格切换项
    //            tableStr += '<div class="main-contents-table"><table class="table table-striped table-bordered table-advance table-hover" cellspacing="0" width="100%"><thead></thead><tbody></tbody></table></div> '
    //        }
    //
    //        $('.table-title').append(spanStr);
    //        //选中的span设置样式
    //        $('.table-title').children('span').eq(0).addClass('spanhover');
    //        //插入页面中
    //        $('.tableBlock').append(tableStr);
    //        /*---------------------------------------表格初始化----------------------------------------*/
    //
    //        //表格区域设置样式
    //        $('.main-contents-table').hide();
    //        $('.main-contents-table').eq(0).show();
    //        //轮流赋值
    //        console.log(result);
    //        for(var i=0;i<result.length;i++){
    //            var tableBlock = $('.table').eq(i);
    //            datasTable(tableBlock,result[i].newsContents);
    //        }
    //    },
    //    error:function(jqXHR, textStatus, errorThrown){
    //        var info = JSON.parse(jqXHR.responseText).message;
    //        moTaiKuang($('#myModal'),'提示','flag',info);
    //    }
    //});

    //查询按钮
    $('#selected').on('click',function(){

        conditionSelect();

    });

    /*-----------------------------------------按钮方法--------------------------------------------*/
    $('.table-title').on('click','span',function(){
        $(this).parent().children('span').removeClass('spanhover');
        $(this).addClass('spanhover');
        var list = $(this).parent().next().children();
        list.hide();
        list.eq($(this).index()).show();
    });

    //删除
    $('.tableBlock').on('click','.option-delete',function(){
        var $thisMC = $(this).parents('tr').children('.names').html();
        _thisBM = $(this).parents('tr').children('.ids').html();
        moTaiKuang($('#myModal'),'确定要删除吗？','');
        $('#newsTitle').val($thisMC);
    });

    //删除确定
    $('#myModal').on('click','.shanchu',function(){
        $.ajax({
            type:'post',
            url:_url + 'News/DelNewsContent',
            contentType: 'application/json',
            data:JSON.stringify({
                "PK_NewsID":_thisBM,
                "UserID" : _userID}),
            success:function(result){
                if(result == 99){
                    //删除成功
                    moTaiKuang($('#myModal1'),'提示','flag','删除成功！')
                    conditionSelect();
                    $('#myModal').modal('hide');
                }else if( result == 3){
                    moTaiKuang($('#myModal1'),'提示','flag','执行失败！')
                }
            },
            error:function(jqXHR, textStatus, errorThrown){

            }
        })
    });

    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });

    /*----------------------------------------其他方法--------------------------------------------*/
    //表格赋值
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    //模态框
    function moTaiKuang(who,meg,flag,tip){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-title').html(meg);
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
        if(tip){
            who.find('.modal-body').html(tip);
        }
    }

    //获取新闻标题列表
    function conditionSelect(){

        //游泳馆名称
        var eprName = $('#eprName').val();

        //审批状态
        var isApl = $('#f_IsApproval').val();

        //传递给后台的参数
        var prm = {

            "isApl": isApl,
            "eprName": eprName,
            "isRecommend": 0, //是否是首页新闻 0不是 1是
            "userID": _userIdName
        };
        $.ajax({
            type:'post',
            url:_url + 'HBYYG/GetNewsContentByType',
            data:prm,
            success:function(result){
                //for(var i=0;i<result.length;i++){
                //    var tableBlock = $('.table').eq(i);
                //    datasTable(tableBlock,result[i].newsContents);
                //}

                _datasTable($('#scrap-datatables'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){

            }
        })
    }
});

//用户id
var _userIdName = sessionStorage.getItem('realUserName');

var _tables = $('#scrap-datatables').DataTable({
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
            className:'saveAs btn btn-success hiddenButton'
        }
    ],
    "columns": [
        {
            title:'编号',
            data:'id',
            className:'ids hidden'
        },
        {
            title:'新闻内容标题',
            data:'title',
            className:'names'
        },
        {
            title:'游泳馆名称',
            data:'fkName'
        },
        {
            title:'日期',
            data:'date'
        },
        {
            title:'作者',
            data:'author'
        },
        {
            title:'审批状态',
            data:'isApl',
            render:function(data, type, row, meta){

                if(data == 1){

                    return '审批通过';

                }else if(data == 0){

                    return '未审批'
                }else if(data == 2){

                    return '审批不通过';
                }
            }

        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            render:function(data, type, row, meta){

                var html =  "<span class='data-option option-edite btn default btn-xs green-stripe'><a href='../news/approveNews.html?id=" +
                    row.id + '&come=1' +
                    "'>查看</a></span>";

                if(row.isApl == 0){
                     html +=  "<span class='data-option option-edite btn default btn-xs green-stripe'><a href='../news/approveNews.html?id=" +
                         row.id + '&come=2' +
                         "'>审批</a></span>";
                }

                return  html;

            }

        }
    ],
    "aoColumnDefs": [
        {
            sDefaultContent: '',
            aTargets: [ '_all' ]
        }
    ]
});
