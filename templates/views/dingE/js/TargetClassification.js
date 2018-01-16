/**
 * Created by admin on 2017/2/9.
 */

$(document).ready(function(){
    //给input框限定长度
    $('input').attr('maxlength','50');
    var rotateNum = 1;
    //点击下拉框时
    $('.add-select-block li').html();
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
    //下拉框中内容被点击时
    $('.add-select-block li').on('click',function(){
        var text = $(this).html();
        var id = $(this).attr('ids');

        $(this).parents('.add-input-father').children('.add-select-block').slideToggle();
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').html(text);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('ids',id);
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('div').css({

            'transform':'rotate('+string+')'
        })
    });

    //调用获取后台数据方法，进行数据获取
    alarmHistory();
    //初始化table表单
    var table = $('#dateTables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": true,//还原初始化了的datatable
        "pagingType":"full_numbers",
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
                title:'指标ID',
                data:"pK_IndexClass",
                class:'theHidden'
            },
            {
                title:'人员类别单位',
                data:"f_IndexUnit"
            },
            {
                title:'能耗类型',
                data:"f_EnergyTypeName"
            },
            {
                title:'能耗类型单位',
                data:"f_EnergyTypeUnit"

            },
            {
                title:'月指标',
                data:"f_MonthIndicator"

            },
            {
                title:'年指标',
                data:"f_YearIndicator"

            },
            {
                title:'编辑操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn alter' data-toggle='modal' data-target='#alter-type'>修改</button>"
            },
            {
                title:'删除操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn remove'  data-toggle='modal' data-target='#remove-type'>删除</button>"
            },
        ]
    })
    _table = $('#dateTables').dataTable();
    //给表格添加后台获取到的数据
    setData();
    hiddrenId();

    //按条件查询功能
    $('.condition-query .refer').on('click',function(){
        $('#theLoading').modal('show');
        var txt1 = $('.person-type').val();
        var txt2 = $('.energy-type').val();
        dataArr=[];
        $.ajax({
            type:'get',
            url:IP + "/SecondUnit/GetIndexClassByCondition",
            async:false,
            timeout:theTimes,
            data:{
                personTypeID: txt1,
                energyType: txt2
            },
            beforeSend:function(){

            },
            complete:function(){
                $('#theLoading').modal('hide');
            },
            success:function(result){
                for(var i=0;i<result.length;i++){
                    dataArr.push(result[i]);
                }
                var num = dataArr.length;
                for(var i=0; i<num; i++){
                    var txt = dataArr[i].f_EnergyType;
                    var nums = dataArr[i].f_IndexUnit;
                    dataArr[i].f_EnergyTypeName = getEnergyType(txt);
                    dataArr[i].f_EnergyTypeUnit = getEnergyUnit(txt);
                    dataArr[i].f_IndexUnit = getPersonUnit(nums);
                }
                _table.fnClearTable();
                setData();
                hiddrenId();
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);

                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                myAlter("请求失败！");
            }

        });

    });


    //当月指标填入时，自动生成年指标
    $('#add-type .add-input').eq(2).on('blur',function(){
        console.log('ok');
        var theNum = $('#add-type .add-input').eq(3).val();
        if( theNum == '' && checkWord($(this).val())){
            if($(this).val() % 1 === 0){
                var num = ($(this).val() *12);
            }else{
                var num = ($(this).val() *12).toFixed(2);
            }
            if(num != 0){
                $('#add-type .add-input').eq(3).val(num);
            }

        }
    });
    //当年指标填入时，自动生成月指标
    $('#add-type .add-input').eq(3).on('blur',function(){

        if( $('#add-type .add-input').eq(2).val() == '' && checkWord($(this).val())){

            var num = ($(this).val() / 12).toFixed(2);
            if(num != 0){
                $('#add-type .add-input').eq(2).val(num);
            }

        }
    });

    //添加操作
    $('#add-type .btn-primary').on('click',function(){
        //生成对应参数
        var txt1 = $("#add-type .add-input-select").eq(0).find('span').attr('ids');
        var txt2 = $("#add-type .add-input-select").eq(1).find('span').attr('ids');
        //生成指标
        var txt = $("#add-type .add-input").eq(2).val();
        var mouthTar = $("#add-type .add-input").eq(2).val() + "*{k}";
        var yearTar = $("#add-type .add-input").eq(3).val() + "*{k}";

        if($('#add-type .add-input').eq(4).find('span').html() == '无'){
             mouthTar = $("#add-type .add-input").eq(2).val();
             yearTar = $("#add-type .add-input").eq(3).val();
        };


        $('#add-type .add-input').eq(2).on('focus',function(){
            $('#add-type .marks').css({
                display:'none'
            });
            $('#add-type .hint-text').css({
                display:'none'
            });
            $('#add-type .hooks').css({
                display:'none'
            });

        });
        if(txt == ""){
            $('#add-type .marks1').css({
                display:'inline-block'
            });
            $('#add-type .hint-text1').html('请填写指标额度');
            $('#add-type .hint-text1').css({
                display:'inline-block',
                color:'#c40000'
            })
            return false;

        }else if(!checkWord(txt)){
            $('#add-type .marks1').css({
                display:'inline-block'
            });
            $('#add-type .hint-text1').html('指标额度必须为正数');
            $('#add-type .hint-text1').css({
                display:'inline-block',
                color:'#c40000'
            });
            return false;
        }
        $.ajax({
            type: "post",
            url: IP + "/SecondUnit/AddIndexClass",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            timeout:theTimes,
            data:{
                "pK_IndexClass": 0,
                "fK_PersonType_Class": txt1,
                "f_PersonType": "string",
                "f_IndexUnit": 0,
                "f_EnergyType": txt2,
                "f_MonthIndicator": mouthTar,
                "f_YearIndicator": yearTar,
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
                    myAlter('指标信息已存在')
                    return false;
                }
                if(data == 3){
                    myAlter('添加失败');
                    return false;
                }
                $('#add-type').modal('hide');
                ajaxSuccess();

            },
            error:function (data, textStatus, errorThrown) {
                //var num = data.responseText.split('"')[3];
                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }

                $('#add-type').modal('hide');
                myAlter(JSON.parse(XMLHttpRequest.responseText).message);
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
        for(var i=0; i < dataArr.length; i++){
            if(id == dataArr[i].pK_IndexClass){
                var thisData = dataArr[i];
                break;
            }
        };
        console.log(thisData);
        //获取本行数据
        $.ajax({
            type: "get",
            timeout:theTimes,
            url: IP + "/SecondUnit/GetIndexClassByID",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            data: {
                "PK_IndexClass": id,
            },
            cache: false,
            async : false,
            dataType: "json",
            beforeSend:function(){

            },
            complete:function(){

            },
            success: function (data)

            {
                postData = data;
                console.log(data);
            },
            error:function (data, textStatus, errorThrown) {
                console.log(textStatus);
                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }else{
                    myAlter(data.responseText.split('"')[3]);
                }

            }

        });

        $('#alter-type .add-input-select').eq(0).find('span').html(thisData.f_PersonType);
        $('#alter-type .add-input-select').eq(1).find('span').html(thisData.f_EnergyTypeName);
        $('#alter-type .add-input-select').eq(1).find('span').attr('ids',thisData.f_EnergyType);
        $('#alter-type .add-input-select').eq(0).find('span').attr('ids',thisData.fK_PersonType_Class);
        $('#alter-type .add-input').eq(2).val(thisData.f_MonthIndicator.split('*')[0]);
        $('#alter-type .add-input').eq(3).val(thisData.f_YearIndicator.split('*')[0]);
        var theTxt = thisData.f_MonthIndicator.indexOf('k');
        if(theTxt == -1){
            $('#alter-type .add-input-select').eq(2).find('span').html('无');
        }else{
            $('#alter-type .add-input-select').eq(2).find('span').html('*K');
        }

        console.log(postData);
        //点击提交按钮
        $('#alter-type .btn-primary').one('click',function(){
            //生成对应参数
            var txt1 = $("#alter-type .add-input-select").eq(0).find('span').attr('ids');
            var txt2 = $("#alter-type .add-input-select").eq(1).find('span').attr('ids');
            //生成指标
            var txt = $("#alter-type .add-input").eq(2).val();
            var mouthTar = $("#alter-type .add-input").eq(2).val() + "*{k}";
            var yearTar = $("#alter-type .add-input").eq(3).val() + "*{k}";

            if($('#alter-type .add-input').eq(4).find('span').html() == '无'){
                mouthTar = $("#alter-type .add-input").eq(2).val();
                yearTar = $("#alter-type .add-input").eq(3).val();
            };

            postData.f_EnergyType = txt2;
            postData.fK_PersonType_Class = txt1;
            postData.f_MonthIndicator = mouthTar;
            postData.f_YearIndicator = yearTar;
            postData.userID = userName;

            $.ajax({
                type: "post",
                timeout:theTimes,
                url: IP + "/SecondUnit/EditIndexClass",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
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
                    $('#theLoading').modal('hide');
                    $('#alter-type').modal('hide');
                    console.log(data);
                    if(data == 2){
                        myAlter('指标信息已存在')
                    }
                    if(data == 3){
                        myAlter('修改失败')
                    }

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

                    $('#alter-type').modal('hide');
                    $('#theLoading').modal('hide');
                },

            });
        })

    });

    //删除操作

    $('#dateTables').on('click','.remove',function(){
        //获取要传的ID;

        var id = parseInt($(this).parent().parent().children().eq(1).html());
        var txt = $(this).parent().parent().children().eq(0).html();
        $('#remove-type p b').html(txt);
        var postData;
        console.log(txt);

        //获取本行数据
        $.ajax({
            type: "get",
            timeout:theTimes,
            url: IP + "/SecondUnit/GetIndexClassByID",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            data: {
                "PK_IndexClass": id
            },
            cache: false,
            async : false,
            dataType: "json",
            beforeSend:function(){

            },
            complete:function(){

            },
            success: function (data)

            {
                postData = data;
                console.log(postData);
            },
            error:function (data, textStatus, errorThrown) {
                console.log(textStatus);
                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }else{
                    myAlter(data.responseText.split('"')[3]);
                }

            }

        });

        //点击提交按钮
        $('#remove-type .btn-primary').one('click',function(){
            postData.userID = userName;
            $.ajax({
                type: "post",
                timeout:theTimes,
                url:IP + "/SecondUnit/DelIndexClass",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                data:postData,
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
                    $('#remove-type').modal('hide');
                    if(data == 4){
                        myAlter('删除失败 有关联')
                    }
                    if(data == 3){
                        myAlter('删除失败')
                    }


                    ajaxSuccess();
                    $('#theLoading').modal('hide');
                    $('#remove-type').modal('hide');
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {

                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    $('#theLoading').modal('hide');
                    $('#remove-type').modal('hide');
                    myAlter(JSON.parse(XMLHttpRequest.responseText).message);

                }
            });
        })

    })
});

//获取后台数据
function alarmHistory(){

    var txt1 = $('.person-type').val();
    var txt2 = $('.energy-type').val();
    dataArr=[];
    oldData = [];
    $.ajax({
        type:'get',
        url:IP + "/SecondUnit/GetIndexClassByCondition",
        async:false,
        timeout:theTimes,
        data:{
            personTypeID: txt1,
            energyType: txt2
        },
        beforeSend: function () {
            $('#theLoading').modal('hide');
            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
            if($('.modal-backdrop').length > 0){
                $('div').remove('.modal-backdrop');
                $('#theLoading').hide();
            }
        },
        success:function(result){
            for(var i=0;i<result.length;i++){
                dataArr.push(result[i]);

            }
            var num = dataArr.length;
            for(var i=0; i<num; i++){
                var txt = dataArr[i].f_EnergyType;
                var nums = dataArr[i].f_IndexUnit;
                dataArr[i].f_EnergyTypeName = getEnergyType(txt);
                dataArr[i].f_EnergyTypeUnit = getEnergyUnit(txt);
                dataArr[i].f_IndexUnit = getPersonUnit(nums);
            }
           console.log(dataArr);
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);

            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }

    });
}

//点击确定时触发
$(document).on('keydown',function(e){
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;

    if(code == 13){
        $('.refer').click();
        return false;
    }
});

//用于存放人员类型的数组

var personType = [];

//获取人员类型

function  getPerson(){
    $.ajax({
        type:'get',
        url:IP + "/SecondUnit/GetAllPersonType",
        async:false,
        timeout:theTimes,
        beforeSend:function(){
            $('#theLoading').modal('show');
        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(result){
            for(var i=0;i<result.length;i++){
                personType.push(result[i]);
            }
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");

        }

    });
}
getPerson();
//获取全部能耗类型

function  getAllEnergy(dom){
    var arr1 = [];
    var arr2 = [];
    var txt = energyType.alltypes;
    var html1 = '<option value="-1">全部</option>';
    var html2 = '';
    for(var i=0 ; i < txt.length; i++){
        var id = parseInt(txt[i].ettype);
        var type = txt[i].etname;
        arr1.push(id);
        arr2.push(type);
    }
    for(var i = 0 ; i < arr2.length; i++){

        html1 += '<option value="'+arr1[i]+'">'+arr2[i] +'</option>';
        html2 += '<li ids="'+arr1[i]+'">'+ arr2[i]+'</li>'
    }
    $(dom).html(html1);
    $('#add-type .add-input-select').eq(1).find('span').html(arr2[0]);
    $('#add-type .add-select-block').eq(1).html(html2);
    $('#add-type .add-input-select').eq(1).find('span').attr('ids',arr1[0]);

    $('#alter-type .add-input-select').eq(1).find('span').html(arr2[0]);
    $('#alter-type .add-select-block').eq(1).html(html2);
    $('#alter-type .add-input-select').eq(1).find('span').attr('ids',arr1[0]);
}

//获取全部人员类别
function getAllPerson(dom){
    var personArr = [];
    var personArr1 = [];
    var html = '<option value="-1">全部</option>';
    var html2 = '';
    for(var i=0;i<personType.length;i++){
        personArr.push(personType[i].f_PersonType);
        personArr1.push(personType[i].pK_PersonType);
    }

    for(var i = 0 ; i < personArr.length; i++){

        html += '<option value="'+personArr1[i]+'">'+personArr[i] +'</option>';
        html2 += '<li ids='+personArr1[i]+'>'+ personArr[i]+'</li>'
    }
    $(dom).html(html);
    $('#add-type .add-input-select').eq(0).find('span').html(personArr[0]);
    $('#add-type .add-input-select').eq(0).find('span').attr('ids',personArr1[0]);
    $('#add-type .add-select-block').eq(0).html(html2);

    $('#alter-type .add-input-select').eq(0).find('span').html(personArr[0]);
    $('#alter-type .add-input-select').eq(0).find('span').attr('ids',personArr1[0]);
    $('#alter-type .add-select-block').eq(0).html(html2);
};


getAllEnergy('.energy-type');
getAllPerson('.person-type');