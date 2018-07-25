$(function(){
    var _url = sessionStorage.getItem('apiUrlPrefix');
    //登陆者
    var _userID = sessionStorage.getItem('userName');
    var _thisBM = '';
    //获取新闻内容标题
    $.ajax({
        type:'get',
        url:_url + 'News/GetAllNewsTypeContent',
        success:function(result){
            //动态创建span标签
            var spanStr = '';
            var tableStr = '';
            for(var i=0;i<result.length;i++){
                spanStr += '<span>' + result[i].f_NewsTypeName + '</span>';
                //动态的创建表格切换项
                tableStr += '<div class="main-contents-table"><table class="table table-striped table-advance table-hover" cellspacing="0" width="100%"><thead></thead><tbody></tbody></table></div> '
            }
            $('.table-title').append(spanStr);
            //选中的span设置样式
            $('.table-title').children('span').eq(0).addClass('spanhover');
            //插入页面中
            $('.tableBlock').append(tableStr);
            /*---------------------------------------表格初始化----------------------------------------*/
            var _tables = $('.table').DataTable({
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
                        data:'pK_NewsID',
                        className:'ids hidden'
                    },
                    {
                        title:'新闻内容标题',
                        data:'f_NewsTitle',
                        className:'names'
                    },
                    {
                        title:'日期',
                        data:'f_PublishDate'
                    },
                    {
                        title:'作者',
                        data:'f_Author'
                    },
                    {
                        title:'是否推荐',
                        data:'f_IsRecommend',
                        render:function(data, type, row, meta){

                            if(data == 1){

                                return '已推荐';
                            }else{
                                return '未推荐'
                            }
                        }

                    },
                    {
                        title:'操作',
                        "targets": -1,
                        "data": null,
                        render:function(data, type, row, meta){
                            return  "<span class='option-button option-edite option-qiye'><a href='../news/news-4.html?id=" +
                                row.pK_NewsID + '&come=2' +
                                "'>查看</a></span>" +
                                "<span class='option-button option-edite option-edit'><a href='../news/news-1.html?id=" +
                                row.pK_NewsID + '&flag=1' +
                                "'>编辑</a></span>" +
                                "<span class='option-button option-delete option-del'>删除</span>"

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
            //表格区域设置样式
            $('.main-contents-table').hide();
            $('.main-contents-table').eq(0).show();
            //轮流赋值
            console.log(result);
            for(var i=0;i<result.length;i++){
                var tableBlock = $('.table').eq(i);
                datasTable(tableBlock,result[i].newsContents);
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            var info = JSON.parse(jqXHR.responseText).message;
            moTaiKuang($('#myModal'),'提示','flag',info);
        }
    });
    conditionSelect();
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
    })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
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
        $.ajax({
            type:'get',
            url:_url + 'News/GetAllNewsTypeContent',
            success:function(result){
                for(var i=0;i<result.length;i++){
                    var tableBlock = $('.table').eq(i);
                    datasTable(tableBlock,result[i].newsContents);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){

            }
        })
    }
})