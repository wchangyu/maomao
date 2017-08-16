/**
 * Created by admin on 2017/2/17.
 */

$(document).ready(function(){

    $('input').attr('maxlength', '50');
    //调用获取后台数据方法，进行数据获取
    alarmHistory();
    //初始化table表单

        var table = $('#dateTables').DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            //是否分页
            "destroy": false,//还原初始化了的datatable
            "paging": true,
            "ordering": false,
            'searching': false,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第 _PAGE_ 页 / 总 _PAGES_ 页  总记录数为 _TOTAL_ 条',
                "sInfoEmpty": "记录数为0",
                "sInfoFiltered": "(全部记录数 _MAX_ 条)",
                'paginate': {
                    'first': '第一页',
                    'last': '最后一页',
                    'next': '下一页',
                    'previous': '上一页'
                },
                'infoEmpty': ''
            },
            'buttons': [

            ],
            "dom":'B<"clear">lfrtip',
            //数据源
            'columns':[
                {
                    title:'抄表名称',
                    data:'f_CycleName'

                },
                {
                    title:'抄表ID',
                    data:'pK_MTReadCycle',
                    class:'theHidden'

                },
                {
                    title:'抄表月份',
                    data:'f_ReadCycleST',
                    render:function(data, type, full, meta){
                        var txt1 = data.split(' ')[0].split('/')[0];
                        var txt2 = data.split(' ')[0].split('/')[1]
                        return txt1 + "-" + txt2;
                    }

                },
                {
                    title:'是否结算',
                    data:'f_ClearingDate',
                    render:function(data, type, full, meta){
                        if(data == ''){
                            return '未结算'
                        }else {
                            return '已结算'
                        }

                    }

                },
                {
                    title:'在线表数据状态',
                    data:'f_ImportOnlineMeter',
                    render:function(data, type, full, meta){
                        if(data == 0){
                            return '<span style="color:darkred">未导入</span>'
                        }else {
                            return '<span style="color:#307f7a">已导入</span>'
                        }

                    }

                },
                {
                    title:'在线表操作',
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='top-btn create-data' >导入数据</button>"
                },
                {
                    title:'编辑操作',
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='top-btn change-data' data-toggle='modal' data-target='#remove-deploy'>修改</button>"
                },
                {
                    title:'抄表登记详情',
                    data:'pK_MTReadCycle',
                    render:function(data, type, full, meta){
                        return  "<a class='theJump' href='MeterReading.html?id="+data+"'>登记查看</a>"

                    }


                },
                {
                    title:'删除操作',
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='top-btn remove-data' data-toggle='modal' data-target='#remove-measure'>删除</button>"
                }
            ]
        });
        _table = $('#dateTables').dataTable();
        //给表格添加后台获取到的数据
        setData();
        hiddrenId();



    //添加操作
    var relateNumber = 0;
    var relativeNum = 0;
    $('.add-read-meter').on('click',function(){

        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/IsRelevanceData",
            async: false,
            timeout: theTimes,
            data:{

            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                relateNumber = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                myAlter(JSON.parse(XMLHttpRequest.responseText).message);
            }
        });

    });



    $('#add-deploy .btn-primary').on('click',function(){

        //判断输入是否正确
        if(!checkedNull('#add-deploy')){
            return false;
        };

        //获取要提交的数据

        var meterName = $("#add-deploy .add-input").eq(0).val();
        var meterReadDate = $("#add-deploy .add-input").eq(1).val() + '-1';

        console.log(meterName,meterReadDate);

        if(relateNumber == 1){
            $('#change-relative').modal('show');
            $('#change-relative .btn-primary').one('click',function(){
                relativeNum = 1;
                $('#change-relative').modal('hide');
                $.ajax({
                    type: "post",
                    url: IP + "/UnitMeter/AddMTReadCycle",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                    timeout:theTimes,
                    data:{
                        "pK_MTReadCycle": 0,
                        "f_CycleName": meterName,
                        "f_ReadCycleST": meterReadDate,
                        "f_ClearingDate": "string",
                        "isRelevanceData": relativeNum,
                        "userID": userName
                    },
                    cache: false,
                    async : false,
                    dataType: "json",
                    beforeSend:function(){
                    },
                    complete:function(){
                        $('#theLoading').modal('hide');
                    },

                    success: function (data)
                    {
                        console.log(data);
                        $('#add-deploy').modal('hide');
                        $('#theLoading').modal('hide');
                        if(data == 2){
                            myAlter('抄表信息已存在');
                            return false;
                        }
                        if(data == 3){
                            myAlter('添加失败');
                            return false;
                        }

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

                        $('#add-deploy').modal('hide');
                        myAlter(num);
                    }
                });
            });

            $('#change-relative .btn-default').one('click',function(){
                relativeNum = 0;
                $.ajax({
                    type: "post",
                    url: IP + "/UnitMeter/AddMTReadCycle",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                    timeout:theTimes,
                    data:{
                        "pK_MTReadCycle": 0,
                        "f_CycleName": meterName,
                        "f_ReadCycleST": meterReadDate,
                        "f_ClearingDate": "string",
                        "isRelevanceData": relativeNum,
                        "userID": userName
                    },
                    cache: false,
                    async : false,
                    dataType: "json",
                    beforeSend:function(){
                    },
                    complete:function(){
                        $('#theLoading').modal('hide');
                    },

                    success: function (data)
                    {
                        console.log(data);
                        $('#add-deploy').modal('hide');
                        $('#theLoading').modal('hide');
                        if(data == 2){
                            myAlter('抄表信息已存在');
                            return false;
                        }
                        if(data == 3){
                            myAlter('添加失败');
                            return false;
                        }

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

                        $('#add-deploy').modal('hide');
                        myAlter(num);
                    }
                });
            });
        }else{
            relativeNum = 0;
            $.ajax({
                type: "post",
                url: IP + "/UnitMeter/AddMTReadCycle",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                timeout:theTimes,
                data:{
                    "pK_MTReadCycle": 0,
                    "f_CycleName": meterName,
                    "f_ReadCycleST": meterReadDate,
                    "f_ClearingDate": "string",
                    "isRelevanceData": relativeNum,
                    "userID": userName
                },
                cache: false,
                async : false,
                dataType: "json",
                beforeSend:function(){
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },

                success: function (data)
                {
                    console.log(data);
                    $('#add-deploy').modal('hide');
                    $('#theLoading').modal('hide');
                    if(data == 2){
                        myAlter('抄表信息已存在');
                        return false;
                    }
                    if(data == 3){
                        myAlter('添加失败');
                        return false;
                    }

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

                    $('#add-deploy').modal('hide');
                    myAlter(num);
                }
            });
        }



        //完成后清空input框
        $(this).parent().parent().parent().find('input').val('');
    });

    //生成在线表数据
    $('#dateTables ').on('click','.create-data',function(){
        var id = $(this).parents('tr').children().eq(1).html();
        console.log(id);
        var txt = $(this).parents('tr').children().eq(0).html();
        console.log(txt);

        $('#set-data').modal('show');

        $('#set-data p b').html(txt);

        $('#set-data .btn-primary').on('click',function(){
            $.ajax({
                type: 'post',
                url: IP + "/UnitMeter/OnlineDataToReadCycle",
                contentType:'application/json',
                async: false,
                timeout: theTimes,
                data:JSON.stringify({PK_MTReadCycle:id,UserID:userName}),
                beforeSend: function () {

                },

                complete: function () {

                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    $('#set-data').modal('hide');
                    console.log(data);
                    var txt = data.validateNumber;
                    if(txt == 99){
                        myAlter('在线表数据生成成功');
                        ajaxSuccess();
                    }else if(txt == 1){
                        myAlter('执行失败，请联系管理员')
                    }else if(txt == 3){
                        myAlter('执行失败')
                    }else if(txt == 7){
                        myAlter('无在线数据')
                    }else if(txt == 5){
                        var arr = data.f_mtNumberInfos;
                        var length = arr.length;
                        var html = '';
                        for(var i=0; i<length; i++){
                            html += arr[i].valueStr + " ";

                        }

                        myAlter("下列仪表故障"+ html);
                    }


                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    $('#set-data').modal('hide');
                    console.log(textStatus);

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    console.log('1111')
                    myAlter("请求失败！");
                }
            })
        });


    });

    //修改功能
    var postData = {};
    $('#dateTables').on('click',".change-data",function(){
        var txt = $(this).parents('tr').children().eq(3).html();
        var id = $(this).parents('tr').children().eq(1).html();
        if(txt == '已结算'){
            myAlter('已进行结算，无法修改');
            return false;
        }

        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/IsRelevanceData",
            async: false,
            timeout: theTimes,
            data:id,
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                relateNumber = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                myAlter("请求失败！");
            }
        });

        //获取要提交的数据
        $.ajax({
            type: "get",
            url: IP + "/UnitMeter/GetMTReadCycleByCycleID",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            timeout:theTimes,
            data:{
                cycleID : id
            },
            cache: false,
            async : false,
            dataType: "json",
            beforeSend:function(){
            },
            complete:function(){
                $('#theLoading').modal('hide');
            },

            success: function (data)
            {

                postData = data;
                console.log(postData);

               $("#remove-deploy .add-input").eq(0).val(postData.f_CycleName);
                var date = postData.f_ReadCycleST;
                var dateArr = date.split('/');

                var dateString = dateArr[0] +'-' +dateArr[1];
                $("#remove-deploy .add-input").eq(1).val(dateString);

            },
            error:function (data, textStatus, errorThrown) {
                var num = data.responseText.split('"')[3];
                console.log(data.responseText);
                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                $('#theLoading').modal('hide');

                $('#add-deploy').modal('hide');
                myAlter(num);
            }
        });

        $('#remove-deploy .btn-primary').off('click');
        $('#remove-deploy .btn-primary').on('click',function(){


            //判断输入是否正确
            if(!checkedNull('#remove-deploy')){
                return false;
            };


            var meterName = $("#remove-deploy .add-input").eq(0).val();
            var meterReadDate = $("#remove-deploy .add-input").eq(1).val() + '-1';

            console.log(meterName,meterReadDate);
            postData.f_CycleName = meterName;
            postData.f_ReadCycleST = meterReadDate;
            postData.userID = userName;

            if(relateNumber == 1){
                $('#change-relative').modal('show');
                $('#change-relative .btn-primary').one('click',function(){
                    relativeNum = 1;
                    $('#change-relative').modal('hide');

                    postData.isRelevanceData = relativeNum;
                    $.ajax({
                        type: "post",
                        url: IP + "/UnitMeter/EditMTReadCycle",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                        timeout:theTimes,
                        data:postData,
                        cache: false,
                        async : false,
                        dataType: "json",
                        beforeSend:function(){
                        },
                        complete:function(){
                            $('#theLoading').modal('hide');
                        },

                        success: function (data)
                        {
                            console.log(data);
                            $('#remove-deploy').modal('hide');
                            $('#theLoading').modal('hide');
                            if(data == 2){
                                myAlter('抄表信息已存在');
                                return false;
                            }
                            if(data == 3){
                                myAlter('修改失败');
                                return false;
                            }
                            if(data == 8){
                                myAlter('已结算，无法修改');
                                return false;
                            }
                            if(data == 11){
                                myAlter('日期重复，修改失败');
                                return false;
                            }


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

                            $('#add-deploy').modal('hide');
                            myAlter(num);
                        }
                    });
                });

                $('#change-relative .btn-default').one('click',function(){
                    relativeNum = 0;
                    postData.isRelevanceData = relativeNum;
                    $.ajax({
                        type: "post",
                        url: IP + "/UnitMeter/EditMTReadCycle",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                        timeout:theTimes,
                        data:postData,
                        cache: false,
                        async : false,
                        dataType: "json",
                        beforeSend:function(){
                        },
                        complete:function(){
                            $('#theLoading').modal('hide');
                        },

                        success: function (data)
                        {
                            console.log(data);
                            $('#add-deploy').modal('hide');
                            $('#theLoading').modal('hide');
                            if(data == 2){
                                myAlter('抄表信息已存在');
                                return false;
                            }
                            if(data == 3){
                                myAlter('修改失败');
                                return false;
                            }
                            if(data == 8){
                                myAlter('已结算，无法修改');
                                return false;
                            }
                            if(data == 11){
                                myAlter('日期重复，修改失败');
                                return false;
                            }


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

                            $('#add-deploy').modal('hide');
                            myAlter(num);
                        }
                    });
                });
            }else{
                relativeNum = 0;
                postData.isRelevanceData = relativeNum;
                console.log(postData);
                $.ajax({
                    type: "post",
                    url: IP + "/UnitMeter/EditMTReadCycle",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                    timeout:theTimes,
                    data:postData,
                    cache: false,
                    async : false,
                    dataType: "json",
                    beforeSend:function(){
                    },
                    complete:function(){
                        $('#theLoading').modal('hide');
                    },

                    success: function (data)
                    {
                        console.log(data);
                        $('#remove-deploy').modal('hide');
                        $('#theLoading').modal('hide');
                        if(data == 2){
                            myAlter('抄表信息已存在');
                            return false;
                        }
                        if(data == 3){
                            myAlter('修改失败');
                            return false;
                        }
                        if(data == 8){
                            myAlter('已结算，无法修改');
                            return false;
                        }
                        if(data == 11){
                            myAlter('日期重复，修改失败');
                            return false;
                        }

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

                        $('#add-deploy').modal('hide');
                        myAlter(num);
                    }
                });
            }



            //完成后清空input框
            $(this).parent().parent().parent().find('input').val('');
        });

    });

    //删除功能
    $('#dateTables').on('click',".remove-data",function(){
        //获取基本信息
        var txt = $(this).parents('tr').children().eq(0).html();
        var id = $(this).parents('tr').children().eq(1).html();
        if(txt == '已结算'){
            myAlter('已进行结算，无法删除');
            return false;
        }
        console.log(txt);

        $('#remove-measure p b').html(txt);


        $('#remove-measure .btn-primary').off('click');

        //点击提交按钮
        $('#remove-measure .btn-primary').on('click',function(){
            $.ajax({
                type: "post",
                url: IP + "/UnitMeter/DelMTReadCycle",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                timeout:theTimes,
                data:{
                    "pK_MTReadCycle": id,
                    "f_CycleName": "string",
                    "f_ReadCycleST": "string",
                    "f_ClearingDate": "string",
                    "isRelevanceData": 0,
                    "userID": userName
                },
                cache: false,
                async : false,
                dataType: "json",
                beforeSend:function(){
                },
                complete:function(){
                    $('#theLoading').modal('hide');
                },

                success: function (data)
                {
                    console.log(data);
                    $('#remove-measure').modal('hide');
                    $('#theLoading').modal('hide');
                    if(data == 4){
                        myAlter('存在抄表记录，无法删除');
                        return false;
                    }
                    if(data == 3){
                        myAlter('删除失败');
                        return false;
                    }
                    if(data == 8){
                        myAlter('已结算，无法删除');
                        return false;
                    }


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

                    $('#remove-measure').modal('hide');
                    myAlter(num);
                }
            });
        });


    });



});

$('.chooseDate').on('focus',function(){
    console.log('11');
    var that = $(this);
    setTimeout(function(){
        $('.month').one('click',function(){

            var mydate = new Date();
            var year = mydate.getFullYear();
            var month = (mydate.getMonth()+1);

            setTimeout(function(){
                var num1 = that.val().split('-')[0];
                var num2 = that.val().split('-')[1];
                console.log(num2 > month);
                if(num1 > year){
                    $('.datepicker').css({
                        display:'none'
                    })
                    myAlter('抄表月份大于当前日期，请重新填写');
                    getFocus1(that);
                    return false;
                }else if(num1 == year && num2 > month){
                    $('.datepicker').css({
                        display:'none'
                    })
                    myAlter('抄表月份大于当前日期，请重新填写');
                    getFocus1(that);
                    return false;
                }
                that.blur();
                $('.datepicker').css({
                    display:'none'
                })
            },100)


        });
    },100)

});

$('.chooseDate').on('blur',function(){
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = (mydate.getMonth()+1);

    var that = $(this);

    setTimeout(function(){
        var num1 = that.val().split('-')[0];
        var num2 = that.val().split('-')[1];

        if(num1 > year){
            $('.datepicker').css({
                display:'none'
            })
            myAlter('抄表月份大于当前日期，请重新填写');
            getFocus1(this);
            return false;
        }else if(num1 == year && num2 > month){
            $('.datepicker').css({
                display:'none'
            })
            myAlter('抄表月份大于当前日期，请重新填写');
            getFocus1(this);
            return false;
        }
    },200)

});

//获取后台数据
function alarmHistory(){
    dataArr=[];
    $.ajax({
        type:'get',
        url:IP + "/UnitMeter/GetAllMTReadCycle",
        async:false,
        timeout:theTimes,
        beforeSend:function(){
            $('#theLoading').modal('show');
        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(result){
            $('#theLoading').modal('hide');
            console.log(result);
            for(var i=0;i<result.length;i++){
                dataArr.push(result[i]);
            }
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        },

    });
}

$('.chooseDate').datepicker(
    {
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        language:  'zh-CN',
        todayHighlight: 1,
        format: 'yyyy-mm'
    }
);

//检验是否必填项全部填写
function checkedNull(dom){
    var checkNum = $(dom).find('.input-label').length;

    for(var i=0; i< checkNum; i++){
        if( $(dom).find('.input-label').eq(i).next().find('input').val() == ''){
            var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

            console.log(txt);
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
            return false;
        };
        if($(dom).find('.input-label').eq(i).next().find('.add-input-select').find('span').html() == ''){
            var txt = $(dom).children('.input-label').eq(i).html().split('：')[0];
            $('#check-text').modal('show');
            myAlter(txt + " 不能为空")
            return false;
        }
    }
    return true;
}

