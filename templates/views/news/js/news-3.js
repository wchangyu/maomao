$(function(){
    var _url = sessionStorage.getItem('apiUrlPrefix');
    //登陆者
    var _userID = sessionStorage.getItem('userName');
    var _thisBM = '';

    //存放当前选中的企业id集合
    var enterpriseIdArr = getEnterprise();

    //获取新闻内容标题
    if(sessionStorage.showChooseUnit != 1){

        $.ajax({
            type:'get',
            url:_url + 'News/GetAllNewsTypeContent',
            success:function(result){
                getContentTiele(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                moTaiKuang($('#myModal'),'提示','flag',info);
            }
        });

    }else{

        //传递给后台的参数
        var prm = {
                "":  enterpriseIdArr

            };

        $.ajax({
            type:'post',
            url:_url + 'News/GetAllNewsTypeContentByEnterpriseID',
            data:prm,
            success:function(result){

                getContentTiele(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                moTaiKuang($('#myModal'),'提示','flag',info);
            }
        });

    }

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

        $('#theLoading').modal('show');

        $.ajax({
            type:'post',
            url:_url + 'News/DelNewsContent',
            contentType: 'application/json',
            data:JSON.stringify({
                "PK_NewsID":_thisBM,
                "UserID" : _userID}),
            success:function(result){

                $('#theLoading').modal('hide');

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

                $('#theLoading').modal('hide');

            }
        })
    });

    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });

    /*----------------------------------------其他方法--------------------------------------------*/

    //获取新闻内容标题
    function getContentTiele(result,flag){

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
        for(var i=0;i<result.length;i++){
            var tableBlock = $('.table').eq(i);
            datasTable(tableBlock,result[i].newsContents);
        }
    }

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

        var postType = 'get';

        var postUrl = 'News/GetAllNewsTypeContent';

        //传递给后台的参数
        var prm = {

        };

        //如果是可选择企业的模式
        if(sessionStorage.showChooseUnit == 1){

            postType = 'post';

            postUrl = 'News/GetAllNewsTypeContentByEnterpriseID';

            //传递给后台的参数
            prm = {
                "":  enterpriseIdArr

            };
        }

        $.ajax({
            type:postType,
            url:_url + postUrl,
            data:prm,
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

    //获取企业id列表
    function getEnterprise(){

        //从session中获取全部企业信息
        var strPointers = sessionStorage.pointers;
        var tempAllPointers = [];

        if(strPointers){
            tempAllPointers = JSON.parse(strPointers);
        }

        var html = "";

        //获取企业列表
        var _enterpriseArr = unique(tempAllPointers,'enterpriseID');

        $(_enterpriseArr).each(function(i,o){

            html += '<option value="'+ o.enterpriseID+'">'+ o.eprName+'</option>'

        });

        //页面赋值
        $('#unit-select').html(html);

        //如果不是可选择企业的模式
        if(sessionStorage.showChooseUnit == 0){

            //隐藏选择框
            $('.choose-unit').hide();

        }

        //存放企业id集合
        var _enterpriseIdArr = [];

        $(_enterpriseArr).each(function(i,o){

            _enterpriseIdArr.push(o.enterpriseID);
        });

        return _enterpriseIdArr;

    };

    //数组去重
    function unique(a,attr) {

        var res = [];

        for (var i = 0, len = a.length; i < len; i++) {
            var item = a[i];
            for (var j = 0, jLen = res.length; j < jLen; j++) {
                //console.log(i + '' + res);
                if (res[j][attr] === item[attr]){
                    //console.log(333);
                    break;
                }

            }
            if (j === jLen){

                res.push(item);

            }

        }

        return res;
    };

});