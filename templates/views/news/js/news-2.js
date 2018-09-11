$(function(){

    var _url = sessionStorage.getItem('apiUrlPrefix');
    //登陆者
    var _userID = sessionStorage.getItem('userName');
    //存放当前列表的所有数据
    var _allDataArr = [];
    //存放当前操作的id值
    var _thisRowID = '';

    //存放当前选中的企业id集合
    var enterpriseIdArr = getEnterprise();

    /*---------------------------------------表格初始化----------------------------------------*/

    var _tables = $('#browse-datatables').DataTable({
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
                data:'pK_NewsType',
                className:'ids'
            },
            {
                title:'栏目名称',
                data:'f_NewsTypeName'
            },
            {
                title:'单位名称',
                data:'enterpriseName',
                render:function(data, type, row, meta){

                    if(data == ''){
                        return '无';

                    }else{

                        return '<span class="enterprise" data-id="'+row.enterpriseID+'">'+data+'</span>';
                    }


                }
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent":
                "<span class='option-button option-edite option-edit'>编辑</span>" +
                "<span class='option-button option-delete option-del'>删除</span>"
            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    conditionSelect();
    /*-----------------------------------------按钮方法-----------------------------------------*/
    //新增按钮
    $('.creatButton').click(function(){
        //初始化
        $('#newsColum').val('');

        moTaiKuang($('#myModal1'),'新增栏目','');

        $('#myModal1').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');
    });
    //新增确定按钮
    $('#myModal1')
        .on('click','.dengji',function(){
            var newsType = {
                f_NewsTypeName:$('#newsColum').val(),
                userID:_userID
            }
            dataDBS('News/AddNewsType',newsType,'提示','flag','新增成功！');
        })
        .on('click','.bianji',function(){
            var pK_NewsType = {
                pK_NewsType:_thisRowID,
                f_NewsTypeName:$('#newsColum').val(),
                userID:_userID
            }
            dataDBS('News/EditNewsType',pK_NewsType,'提示','flag','编辑成功！');
        })
        .on('click','.shanchu',function(){
            var newsType = {
                pK_NewsType:_thisRowID,
                f_NewsTypeName:$('#newsColum').val(),
                userID:_userID
            }
            dataDBS('News/DelNewsType',newsType,'提示','flag','删除成功！');
        });
    //表格中编辑按钮
    $('#browse-datatables')
        .on('click','.option-edite',function(){
            //移除登记类，添加编辑类
            $('#myModal1').find('.btn-primary').removeClass('dengji').removeClass('shanchu').addClass('bianji');
            //获取当前企业id
            var enterpriseId = $(this).parents('tr').find('.enterprise').attr('data-id');

            kuangBS($(this),'编辑栏目',enterpriseId);
            trCss($(this));
        })
        .on('click','.option-delete',function(){
            //移除登记类，添加编辑类
            $('#myModal1').find('.btn-primary').removeClass('dengji').removeClass('bianji').addClass('shanchu');
            kuangBS($(this),'确定要删除吗？');
            trCss($(this));
        })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    /*----------------------------------------------其他方法------------------------------------------*/
    //模态框
    function moTaiKuang(who,title,flag,meg){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-title').html(title);
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
        if(meg){
            who.find('.modal-body').html(meg);
        }
    }

    //获取所有新闻条目
    function conditionSelect(){

        var postType = 'get';

        var postUrl = 'News/GetAllNewsType';

        //传递给后台的参数
        var prm = {

        };

        //如果是可选择企业的模式
        if(sessionStorage.showChooseUnit == 1){

             postType = 'post';

             postUrl = 'News/GetAllNewsTypeByEnterpriseID';

            //传递给后台的参数
             prm = {
                 "enterpriseIDs":  enterpriseIdArr,
                 "isEmptyEnterpriseNewsType": 1 //是否获取新闻栏目的企业ID为空的，0为不获取，1为获取为空的

            };
        }

        $.ajax({
            type:postType,
            url:_url + postUrl,
            data:prm,
            //beforeSend: function (xhr) {
            //    var access_token = sessionStorage.getItem('access_token');
            //
            //    //console.log(access_token);
            //
            //    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token + '');
            //},
            success:function(result){
                //console.log(result);
                _allDataArr = [];
                for(var i=0;i<result.length;i++){
                    _allDataArr.push(result[i]);
                    datasTable($('#browse-datatables'),result);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){

            }
        })
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

    //登记，编辑，删除确定按钮弹出框
    function dataDBS(url,prm,title,flag,meg){

        //如果是可选择企业的模式
        if(sessionStorage.showChooseUnit == 1){

            //当前选择的企业名称
            var eprName = $("#unit-select").find("option:selected").text();

            prm.enterpriseID = $('#unit-select').val();

            prm.enterpriseName = eprName;
        }

        if($('#newsColum').val()){
            $('.colorTip').hide();

            $('#theLoading').modal('show');

            $.ajax({
                type:'post',
                url:_url + url,
                data:prm,
                success:function(result){

                    $('#theLoading').modal('hide');

                    if(result == 99){
                        conditionSelect();
                        moTaiKuang($('#myModal'),title,flag,meg)
                        $('#myModal1').modal('hide');
                    }else if( result == 3){
                        $('#myModal1').modal('hide');
                        moTaiKuang($('#myModal'),'提示','flag','执行失败！');
                    }else if( result == 4 ){
                        $('#myModal1').modal('hide');
                        moTaiKuang($('#myModal'),'提示','flag','该新闻栏目下有新闻内容，不能进行删除操作！')
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){

                    $('#theLoading').modal('hide');

                }
            })
        }else{
            $('.colorTip').show();
        }

    }

    //编辑，删除弹出框
    function kuangBS($this,meg,enterpriseId){
        _thisRowID = $this.parents('tr').children('.ids').html();
        moTaiKuang($('#myModal1'),meg,'');
        for(var i=0;i<_allDataArr.length;i++){
            if(_allDataArr[i].pK_NewsType == _thisRowID){
                //赋值
                $('#newsColum').val(_allDataArr[i].f_NewsTypeName);

                if(enterpriseId){

                    $('#unit-select').val(enterpriseId);
                }

            }
        }
    }

    //click tr css change
    function trCss(el){

        var $this = el.parents('tr');
        $('#browse-datatables tbody').children('tr').removeClass('tables-hover');
        $this.addClass('tables-hover');

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