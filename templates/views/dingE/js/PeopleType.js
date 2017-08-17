/**
 * Created by admin on 2017/2/9.
 */



$(document).ready(function(){
    $('#theLoading').modal('show');
    $('input').attr('maxlength','50');
    //调用获取后台数据方法，进行数据获取
    alarmHistory();
    //初始化table表单
    var table = $('#dateTables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
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
                title:'人员类别',
                data:"f_PersonType"

            },
            {
                title:'单位ID',
                data:"pK_PersonType",
                class:'theHidden'
            },
            {
                title:'单位',
                data:'f_IndexUnit'

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

    //select 优化动画
    var rotateNum = 1;
    $(document).on('click',function(){
        if($('.add-select-block').is(':hidden')){
            $('.add-select-block').css({
                display:'none'
            }) ;
            rotateNum = 2;
            var num = rotateNum * 180;
            var string = num + 'deg';
            $('.add-input-select').children('div').css({
                'transform':'rotate('+string+')'
            })
        }

    });
    $('.add-input-select').click(function(e){
        $('.add-select-block').not($(this).parents('.add-input-father').children('.add-select-block')).css({
            display:'none'
        });
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        console.log('bb');
        $(this).parents('.add-input-father').children('.add-select-block').slideToggle('fast');
        $(this).children('div').css({

            'transform':'rotate('+string+')'
        })

        e.stopPropagation();

    });
    $('.add-select-block li').on('click',function(){
        var text = $(this).html();

        $(this).parents('.add-input-father').children('.add-select-block').slideToggle();
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').html(text);
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('div').css({

            'transform':'rotate('+string+')'
        })
    });

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
        var txt2 = $("#add-people .add-input").eq(1).children('span').html();
        var num = toNumber(txt2);
        $('#add-people .add-input').eq(0).on('focus',function(){
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
        if(txt1 == ""){
            $('#add-people .marks1').css({
                display:'inline-block'
            });
            $('#add-people .hint-text1').html('人员类别不能为空');
            $('#add-people .hint-text1').css({
                display:'inline-block',
                color:'#c40000'
            })
            return false;

        }else{

        }
        $.ajax({
            type: "post",
            url: IP + "/SecondUnit/AddPersonType",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            timeout:theTimes,
            data:{
                "pK_PersonType": 0,
                "f_PersonType": txt1,
                "f_IndexUnit": num,
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
                $('#theLoading').modal('hide');

                if(data == 2){
                    myAlter('人员类别已存在');
                    return false;
                }
                if(data == 3){
                    myAlter('添加失败');
                    return false;
                }
                console.log(data);
                $('#add-people').modal('hide');
                ajaxSuccess();

            },
            error:function (data, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                var num = data.responseText.split('"')[3];
                console.log(data.responseText);
                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }

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
        $('#alter-people .add-input').eq(1).children('span').html(txt2);
        console.log(id);
        //点击提交按钮
        $('#alter-people .btn-primary').off('click');
        $('#alter-people .btn-primary').on('click',function(){
            console.log(id);
            var txt1 = $('#alter-people .add-input').eq(0).val();
            var txt2 =  $('#alter-people .add-input').eq(1).children('span').html();
            var num = toNumber(txt2);
            console.log(txt1);
            console.log(txt2);
            $.ajax({
                type: "post",
                timeout:theTimes,
                url: IP + "/SecondUnit/EditPersonType",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                data: {
                    "pK_PersonType": id,
                    "f_PersonType": txt1,
                    "f_IndexUnit": num,
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
                        myAlter('人员类别已存在');
                        return false;

                    };
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

    $('#dateTables').on('click','.remove',function(){
        //获取要传的ID;

        var id = parseInt($(this).parent().parent().children().eq(1).html());
        var txt = $(this).parent().parent().children().eq(0).html();
        $('#remove-people p b').html(txt);
        console.log(txt);
        //点击提交按钮
        $('#remove-people .btn-primary').one('click',function(){

            $.ajax({
                type: "post",
                timeout:theTimes,
                url:IP + "/SecondUnit/DelPersonType",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                data:{
                    "pK_PersonType": id,
                    "f_PersonType": "string",
                    "f_IndexUnit": 0,
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
                    if(data == 4){
                        myAlter('已被二级单位使用，无法删除')
                    }
                    if(data == 3){
                        myAlter('删除失败')
                    };
                    $('#remove-people').modal('hide');
                    ajaxSuccess();
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter(JSON.parse(XMLHttpRequest.responseText).message);
                }
            });
        })

    })
});

//获取后台数据
function alarmHistory(){
    dataArr=[];
    $.ajax({
        type:'get',
        url:IP + "/SecondUnit/GetAllPersonType",
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
            var num = dataArr.length;
            for(var i=0; i<num; i++){
                var txt = dataArr[i].f_IndexUnit;
                if(txt == 0){
                    dataArr[i].f_IndexUnit = "人年"
                }else if(txt == 1){
                    dataArr[i].f_IndexUnit = "人时"
                }
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
}

function toNumber(string){
    if(string == "人时"){
        string = 1;
    }else if(string == "人年"){
        string = 0;
    }
    return string;
}







