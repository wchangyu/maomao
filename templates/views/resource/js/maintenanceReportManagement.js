/**
 * Created by admin on 2017/12/16.
 */
$(function (){
    /*-------------------------全局变量----------------------------*/
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //获取维修部门
    bxKShiData();

    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
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

    /*-------------------------表格初始化--------------------------*/
    //页面表格
    var _table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "iDisplayLength":50,//默认每页显示的条数
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
                text: '导出',
                className:'saveAs',
                header:true
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'序号',
                data:'indexNum'
            },
            {
                title:'维修项目',
                data:'wxxmName'
            },
            {
                title:'数量',
                data:'cnt'
            },
            {
                title:'占比（%）',
                data:'per'
            },
            {
                title:'备注',
                data:'wxxmMemo'
            }
        ]
    });
    _table.buttons().container().appendTo($('.excelButton'),_table.table().container());
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //给表格的标题赋时间
    $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + _initStart + '——' + _initEnd);
    /*-------------------------获取表格数据-----------------------*/

    //维修部门
    function bxKShiData(){

        var prm = {

            'userID':_userIdNum,
            'userName':_userIdName,
            'isWx': '1'

        }

        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                console.log(result);

                    var str = '<option value="">全部</option>';
                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].departNum +
                            '">' + result[i].departName + '</option>>';
                    }
                    $('#depart').empty().append(str);

                conditionSelect();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    };



    function conditionSelect(){
        //获取所有input框的值
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[0] + ' 00:00:00';
        realityEnd = moment(filterInput[1]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';

        //获取维修科室id
        var id = $('#depart').val();

        var prm = {
            'gdSt':realityStart,
            'gdEt':realityEnd,
            'wxKeshiNum': id,
            'userID':_userIdNum,
            'userName':_userIdName
        };

        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDRptWxxm',
            data:prm,
            success:function(result){
                //console.log(result);

                datasTable($("#scrap-datatables"),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })
    }
    /*--------------------------按钮功能------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal2').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal2'));
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal2').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal2'));
            }else{
                //给表格的标题赋时间
                $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + $('.min').val()  + '——' + $('.max').val());
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
    /*----------------------------方法------------------------------*/
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