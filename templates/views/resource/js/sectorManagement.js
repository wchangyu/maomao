$(function(){
    /*-----------------------------------------全局变量------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //验证必填项（非空）
    Vue.validator('notempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //新增用户登记对象
    var department = new Vue({
        el:'#department',
        data:{
            name:'',
            higherdepartment:'',
            order:''
        }
    })


    /*----------------------------------------表格初始化-----------------------------------------*/
    var table = $('#personal-table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "bStateSave":true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
        "columns": [
            {
                title:'部门名',
                data:'wxRName'
            },
            {
                title:'上级部门',
                data:'wxRen'
            },
            {
                title:'创建时间',
                data:'wxRName'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

            }
        ]
    });

    table.buttons().container().appendTo($('.excelButton'),table.table().container());

    //表格数据
    conditionSelect();
    /*----------------------------------------按钮事件-------------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    })

    //新增按钮
    $('.creatButton').click(function(){
        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');
        //初始化登记表
        department.name='';
        department.higherdepartment='';
        department.order=''
    });

    //操作确定按钮
    $('#myModal')
        //登记确定按钮功能
        .on('click','.dengji',function(){
            //发送请求
            editOrView('','登记成功!','登记失败!');
        })
        //编辑确定按钮功能
        .on('click','bianji',function(){
            //发送请求
            editOrView('','编辑成功!','编辑失败!');
        })
        //删除确定按钮功能
        .on('click','shanchu',function(){
            //发送请求
            editOrView('','删除成功!','删除失败!','false');
        });

    //表格操作
    $('#personal-table tbody')
        //查看
        .on('click','.option-see',function(){
            //详情框
            moTaiKuang($('#myModal'),'查看','flag');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData();
        })
        //编辑
        .on('click','.option-edit',function(){
            //详情框
            moTaiKuang($('#myModal'),'编辑');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData();
        })
        //删除
        .on('click','.option-delete',function(){
            //详情框
            moTaiKuang($('#myModal'),'确定要删除吗？');
            $('#myModal').find('.btn-primary').addClass('shanchu').removeClass('dengji').removeClass(('bianji'));
            //绑定数据
            bindingData();
        });


    /*---------------------------------------其他方法--------------------------------------------*/
    //模态框自适应
    function moTaiKuang(who,title,flag){
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
    };

    //修改提示信息
    function tipInfo(who,title,meg,flag){
        moTaiKuang(who,title,flag);
        who.find('.modal-body').html(meg);
    }

    //获取条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            "":filterInput[0],
            "":filterInput[1],
            "":$('#rybm').val(),
            "":$('#ryjs').val()
        }
        $.ajax({
            type:'get',
            url:'../resource/data/worker.json',
            data:'',
            success:function(result){
                console.log(result)
                datasTable($('#personal-table'),result.data)
            },
            error:function(){

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

    //编辑、登记方法
    function editOrView(url,successMeg,errorMeg,flag){
        //判断是编辑、登记、还是删除
        if(flag){
            var prm = {};
        }else{
            var prm = {
                "":department.name,
                "":department.higherdepartment,
                "":department.order
            };
        }
        //发送数据
        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                if(result == 99){
                    //提示登记成功
                    tipInfo($('#myModal1'),'提示',successMeg,'flag');
                    $('#myModal').modal('hide');
                }else if(result == 3){
                    //提示登记失败
                    tipInfo($('#myModal1'),'提示',errorMeg,'flag');
                }
            }
        })
    }

    //查看、删除绑定数据
    function bindingData(){
        //调用查看详情接口
        var prm = {

        }
        $.ajax({
            type:'post',
            url:_urls + '',
            data:prm,
            success:function(result){
                //获取数据
                //绑定数据
                department.name = "";
                department.higherdepartment = "";
                department.order = ""
            },
            error:function(){

            }
        })
    }
})