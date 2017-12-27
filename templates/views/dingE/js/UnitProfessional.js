/**
 * Created by admin on 2017/2/9.
 */



$(document).ready(function(){
    $('input').attr('maxlength','50');
    //调用获取后台数据方法，进行数据获取
    alarmHistory();
    //初始化table表单
    table = $('#dateTables').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "sScrollY": '700px',
        "bPaginate": false,
        "scrollCollapse": true,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                title:'单位专业',
                data:"f_SpecialtyName",
            },
            {
                title:'单位ID',
                data:"pK_Specialty",
                class:'theHidden'
            },
            {
                title:'系数K',
                data:'f_CoefficientK'

            },
            {
                title:'编辑操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn alter' data-toggle='modal' data-target='#alter-people'>修改</button>"
            },
            {
                title:'删除操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn remove' data-toggle='modal' data-target='#remove-people'>删除</button>"
            }
        ]
    });
    _table = $('#dateTables').dataTable();
    //给表格添加后台获取到的数据
    setData();
    hiddrenId();

    //添加操作
    $("#add-people").on('click',function(){
        $('#add-people .marks').css({
            display:'none'
        });
        $('#add-people .hint-text').css({
            display:'none'
        });
        $('#add-people .hooks').css({
            display:'none'
        });
    });

    $('#add-people .btn-primary').on('click',function(){
        var txt1 = $("#add-people .add-input").eq(0).val();
        var txt2 = $("#add-people .add-input").eq(1).val();
        var totalNum = 0;
        for(var i=0; i< $("#add-people .add-input").length; i++){

            var text = $("#add-people .add-input").eq(i).val();
            console.log(text);

            var title = $("#add-people .add-input").eq(i).parent().prev().html();
            var content = title.split('：')[0];

            $('#add-people .add-input').eq(i).on('focus',function(){
                $('#add-people .marks').eq(i).css({
                    display:'none'
                });
                $('#add-people .hint-text').eq(i).css({
                    display:'none'
                });
                $('#add-people .hooks').eq(i).css({
                    display:'none'
                });

            });
            if(text == ""){
                totalNum ++ ;
                console.log(totalNum);
                $('#add-people .marks').eq(i).css({
                    display:'inline-block'
                });
                $('#add-people .hint-text').eq(i).html(content + '不能为空');
                $('#add-people .hint-text').eq(i).css({
                    display:'inline-block',
                    color:'#c40000'
                });
                if( i == $("#add-people .add-input").length - 1 ){

                       return false;

                }


            }else if( i == 1){

                if(!checkWord(text)){
                    console.log('nimei');
                    $('#add-people .marks').eq(i).css({
                        display:'inline-block'
                    });
                    $('#add-people .hint-text').eq(i).html(content + '必须为正数');
                    $('#add-people .hint-text').eq(i).css({
                        display:'inline-block',
                        color:'#c40000'
                    });
                    return false;
                }
                if(totalNum != 0){
                    return false
                }
            }
        }
        $.ajax({
            type: "post",
            url: IP + "/SecondUnit/AddUnitSpecialty",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            timeout:theTimes,
            data:{
                "pK_Specialty": 0,
                "f_SpecialtyName": txt1,
                "f_CoefficientK": txt2,
                "f_Order": 0,
                "userID": userName
            },
            cache: false,
            async : false,
            dataType: "json",
            beforeSend:function(){
                $('#theLoading').modal('show');
            },
            complete:function(){
                $('#theLoading').modal('hide');
            },

            success: function (data)
            {
                console.log(data);

                $('#theLoading').modal('hide');
                if(data == 2){
                    myAlter('单位专业已存在');
                    return false;
                }
                if(data == 3){
                    myAlter('添加失败');
                    return false;
                }
                $('#add-people').modal('hide');
                ajaxSuccess();

            },
            error:function (data, textStatus, errorThrown) {
                var num = data.responseText.split('"')[3];
                console.log(data.responseText);
                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                $('#theLoading').modal('hide');

                $('#add-people').modal('hide');
                myAlter(num);
            }
        });
        //完成后清空input框
        $(this).parent().parent().parent().find('input').val('');
    });

    //修改操作
    $('#dateTables').on('click','.alter',function(e){
        //获取要传的ID;
        e = e || window.event;
        var tar = e.target || e.srcElement;
        var id = $(tar).parent().parent().children().eq(1).html();
        var txt1 = $(tar).parent().parent().children().eq(0).html();
        var txt2 = $(tar).parent().parent().children().eq(2).html();
        $('#alter-people .add-input').eq(0).val(txt1);
        $('#alter-people .add-input').eq(1).val(txt2);

        //点击提交按钮
        $('#alter-people .btn-primary').one('click',function(){

            var txt1 = $('#alter-people .add-input').eq(0).val();
            var txt2 =  $('#alter-people .add-input').eq(1).val();
            console.log(txt1);
            console.log(txt2);
            $.ajax({
                type: "post",
                timeout:theTimes,
                url: IP + "/SecondUnit/EditUnitSpecialty",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                data: {
                    "pK_Specialty": id,
                    "f_SpecialtyName": txt1,
                    "f_CoefficientK": txt2,
                    "f_Order": 0,
                    "userID": userName
                },
                cache: false,
                async : false,
                dataType: "json",
                beforeSend:function(){
                    $('#theLoading').modal('show');
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },
                success: function (data)

                {
                    console.log(data);

                    if(data == 2){
                        myAlter('单位专业已存在');
                        return false;
                    }
                    if(data == 3){
                        myAlter('修改失败');
                        return false;
                    }
                    $('#alter-people').modal('hide');
                    ajaxSuccess();


                },
                error:function (data, textStatus, errorThrown) {
                    console.log(textStatus);
                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }else{
                        myAlter(data.responseText.split('"')[3]);
                    }

                    $('#alter-people').modal('hide');
                },

            });
        })

    });

    //删除操作

    $('#dateTables').on('click','.remove',function(e){
        //获取要传的ID;
        e = e || window.event;
        var tar = e.target || e.srcElement;
        var id = $(tar).parent().parent().children().eq(1).html();
        var txt = $(this).parent().parent().children().eq(0).html();
        $('#remove-people p b').html(txt);
        console.log(txt);
        //点击提交按钮
        $('#remove-people .btn-primary').one('click',function(){
            $.ajax({
                type: "post",
                timeout:theTimes,
                url:IP + "/SecondUnit/DelUnitSpecialty",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                data:{
                    "pK_Specialty": id,
                    "f_SpecialtyName": "string",
                    "f_CoefficientK": 0,
                    "f_Order": 0,
                    "userID": userName
                },
                cache: false,
                async : false,
                dataType: "json",
                beforeSend:function(){
                    $('#theLoading').modal('show');
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },
                success: function (data)

                {
                    $('#remove-people').modal('hide');
                    ajaxSuccess();
                    if(data == 4){
                        myAlter('已被二级单位使用，无法删除')
                    }
                    if(data == 3){
                        myAlter('删除失败')
                    };
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    $('#remove-people').modal('hide');
                    myAlter(JSON.parse(XMLHttpRequest.responseText).message);
                }
            });
        })

    });

    //表格大小随窗口变化而改变
    window.onresize = function () {

        changeTable();
    }

});

var table;

//获取后台数据
function alarmHistory(){

    dataArr=[];
    $.ajax({
        type:'get',
        url:IP + "/SecondUnit/GetAllUnitSpecialty",
        async:false,
        timeout:theTimes,
        beforeSend:function(){

        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(result){
            console.log(result);
            for(var i=0;i<result.length;i++){
                dataArr.push(result[i]);
            }

        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);

            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        },

    });
};

//修改表格控件
function changeTable(){
    /*清空原表控件*/
    if (table) {
        table.destroy();
    }

    var W = $('.main-content-table').width();
    /*重新绘制Table*/
    table = $('#dateTables').DataTable({
        "bFilter": false,
        "bLengthChange": false,
        "autoWidth": true,  //用来启用或禁用自动列的宽度计算
        "searching": false,
        "ordering": false,
        "bPaginate": false, //翻页功能
        "bSort": false,
        "bProcessing": false,
        "scrollY": "700px",
        "sScrollX": W,
        "scrollCollapse": true,
        "sScrollXInner": "100%",
        "paging": false,
        "destroy": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'paginate': {
                'first':      '第一页',
                'last':       '最后一页',
                'next':       '下一页',
                'previous':   '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [

        ],
        "dom":'B<"clear">lfrtip',
        //数据源
        'columns':[
            {
                title:'单位行业',
                data:"f_SpecialtyName"
            },
            {
                title:'单位ID',
                data:"pK_Specialty",
                class:'theHidden'
            },
            {
                title:'系数K',
                data:'f_CoefficientK'

            },
            {
                title:'编辑操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn alter' data-toggle='modal' data-target='#alter-people'>修改</button>"
            },
            {
                title:'删除操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn remove' data-toggle='modal' data-target='#remove-people'>删除</button>"
            }
        ]
    });
    _table = $('#dateTables').dataTable();
    _table.fnClearTable();
    //给表格添加后台获取到的数据
    setData();
    hiddrenId();
};

