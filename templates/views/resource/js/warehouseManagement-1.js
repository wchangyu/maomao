$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //存放选中的物料编码
    var _thisBianhao,_thisMingcheng;
    //登记列表vue信息
    var myApp33 = new Vue({
        el:'#myApp33',
        data:{
            'bianhao':'',
            'mingcheng':'',
            'xiaxian':'',
            'shangxian':'',
            'danwei':'',
            'flbianma':'',
            'flmingcheng':'',
            'guige':'',
            'yanse':'',
            'miaoshu':'',
            'gonghuoshang':'',
            'beizhu':''
        }
    })
    //修改
    var myApp44 = new Vue({
        el:'#myApp44',
        data:{
            'bianhao':'',
            'mingcheng':'',
            'xiaxian':'',
            'shangxian':'',
            'danwei':'',
            'flbianma':'',
            'flmingcheng':'',
            'guige':'',
            'yanse':'',
            'miaoshu':'',
            'gonghuoshang':'',
            'beizhu':''
        }
    })
    //存放当前列表的数据
    var allData = [];
    /*-------------------------------------表格初始化------------------------------*/
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
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
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
                className:'saveAs'
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'物料编码',
                className:'bianma',
                data:'itemNum'
            },
            {
                title:'物料名称',
                className:'mingcheng',
                data:'itemName'
            },
            {
                title:'预警下限',
                data:'minNum'
            },
            {
                title:'预警上限',
                data:'maxNum'
            },
            {
                title:'单位',
                data:'unitName'
            },
            {
                title:'分类编码',
                data:'cateNum'
            },
            {
                title:'分类名称',
                data:'cateName'
            },
            {
                title:'规格',
                data:'size'
            },
            {
                title:'颜色',
                data:'color',
            },
            {
                title:'主要供货商',
                data:'cusName'
            },
            {
                title:'描述',
                data:'description'
            },
            {
                title:'备注',
                data:'remark'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-edit'>编辑</span><span class='data-option option-delete'>删除</span>"
            }
        ],
    });
    /*-------------------------------------页面加载调用----------------------------*/
    conditionSelect();
    /*-------------------------------------按钮事件-------------------------------*/
    //登记按钮
    $('.creatButton').on('click',function(){
        moTaiKuang($('#myModal'));
        //获取填写的数据
    })
    //登记按钮；
    $('.dengji').click(function(){
        //获取填写数据
        var prm ={
            'ItemName':myApp33.mingcheng,
            'MinNum':myApp33.xiaxian,
            'MaxNum':myApp33.shangxian,
            'UnitName':myApp33.danwei,
            'CateNum':myApp33.flbianma,
            'CateName':myApp33.flmingcheng,
            'Size':myApp33.guige,
            'Color':myApp33.yanse,
            'Description':myApp33.miaoshu,
            'CusName':myApp33.gonghuoshang,
            'remark':myApp33.beizhu,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKAddItem',
            data:prm,
            success:function(result){
                if(result == 99){
                    //成功后刷新列表，并且提示添加成功；
                    $('#myModal2').find('.modal-body').html('添加成功!');
                    moTaiKuang($('#myModal2'));
                    conditionSelect();
                }
            }
        })
    })
    //重置按钮
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
    });
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    });
    //修改弹窗确认按钮
    $('.xiugai').click(function(){
        var prm = {
            'ItemNum':myApp44.bianhao,
            'ItemName':myApp44.mingcheng,
            'MinNum':myApp44.xiaxian,
            'MaxNum':myApp44.shangxian,
            'UnitName':myApp44.danwei,
            'CateNum':myApp44.flbianma,
            'CateName':myApp44.flmingcheng,
            'Size':myApp44.guige,
            'Color':myApp44.yanse,
            'Description':myApp44.miaoshu,
            'CusName':myApp44.gonghuoshang,
            'remark':myApp44.beizhu,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKEditItem',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.modal-body').html('修改成功！');
                    moTaiKuang($('#myModal2'))
                    //刷新列表
                    conditionSelect();
                    $('#myModal1').modal('hide');
                }
            }
        })
    });
    //修改td操作按钮
    $('.option-edit').bind('click',function(){
        //首先绑定原有的信息
        var wlBianMa = $(this).parents('tr').find('.bianma').html();
        var wlMingCheng = $(this).parents('tr').find('.mingcheng').html();
        for(var i = 0;i<allData.length;i++){
            if(allData[i].itemNum == wlBianMa && allData[i].itemName == wlMingCheng){
                //绑定信息
                myApp44.bianhao = allData[i].itemNum;
                myApp44.mingcheng = allData[i].itemName;
                myApp44.xiaxian = allData[i].minNum;
                myApp44.shangxian = allData[i].maxNum;
                myApp44.danwei = allData[i].unitName;
                myApp44.flbianma = allData[i].cateNum;
                myApp44.flmingcheng = allData[i].cateName;
                myApp44.guige = allData[i].size;
                myApp44.yanse = allData[i].color;
                myApp44.gonghuoshang = allData[i].cusName;
                myApp44.miaoshu = allData[i].description;
                myApp44.beizhu = allData[i].remark;
                moTaiKuang($('#myModal1'));
            }
        }

    });
    //删除弹窗确认按钮
    $('.shanchu').bind('click',function(){
        var prm = {
            'ItemNum':_thisBianhao,
            'ItemName':_thisMingcheng,
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelItem',
            data:prm,
            success:function(result){
                if(result == 99){
                    $('#myModal2').find('.modal-body').html('删除成功！');
                    moTaiKuang($('#myModal2'));
                    conditionSelect();
                }
            }
        })
    });
    //删除td操作按钮
    $('.option-delete').bind('click',function(){
        var wlBianMa = $(this).parents('tr').find('.bianma').html();
        var wlMingCheng = $(this).parents('tr').find('.mingcheng').html();
        _thisBianhao = wlBianMa;
        _thisMingcheng = wlMingCheng;
        $('#myModal3').find('.modal-body').html('确定要删除吗？');
        moTaiKuang($('#myModal3'))
        //删除按钮
    })
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    });
    /*------------------------------------其他方法-------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            'ItemNum':filterInput[0],
            'itemName':filterInput[1],
            'cateName':filterInput[2],
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            async:false,
            data:prm,
            success:function(result){
                //console.log(result)
                allData = result;
                datasTable($("#scrap-datatables"),result);
            }
        })
    }
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
})