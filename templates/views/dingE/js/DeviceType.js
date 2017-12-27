/**
 * Created by admin on 2017/3/9.
 */

$(document).ready(function() {
    $('#theLoading').modal('show');
    $('input').attr('maxlength', '50');
    //调用获取后台数据方法，进行数据获取
    alarmHistory();
    //初始化table表单
    var table = $('#dateTables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging": false,
        "ordering": false,
        'searching': false,
        "sScrollY": '740px',
        'sScrollX':true,
        "bPaginate": false,
        "scrollCollapse": true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'paginate': {
                'first': '第一页',
                'last': '最后一页',
                'next': '下一页',
                'previous': '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [],
        "dom": 'B<"clear">lfrtip',
        //数据源
        'columns': [
            {
                title: '计量设备类型名称',
                data: "f_MeterTypeName"

            },
            {
                title: '计量设备ID',
                data: "pK_MeterType",
                class:'theHidden'

            },
            {
                title: '能耗类型',
                data: "f_EnergyName"
            },
            {
                title: '是否在线',
                data: 'f_onlineName'
            },
            {
                title: '默认上限值',
                data: 'f_WarnUp'
            },
            {
                title: '计量设备规格',
                data: 'f_MeterStandard'
            },
            {
                title: '量程',
                data: 'f_Range'
            },
            {
                title: '编辑操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn alter' data-toggle='modal' data-target='#alter-measure'>修改</button>"
            },
            {
                title: '删除操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn remove' data-toggle='modal' data-target='#remove-measure'>删除</button>"
            }
        ]
    });
    _table = $('#dateTables').dataTable();
    //给表格添加后台获取到的数据
    setData();
    hiddrenId();

    //select 优化动画
    var rotateNum = 1;
    $(document).on('click', function () {
        if ($('.add-select-block').is(':hidden')) {
            $('.add-select-block').css({
                display: 'none'
            });
            rotateNum = 2;
            var num = rotateNum * 180;
            var string = num + 'deg';
            $('.add-input-select').children('div').css({
                'transform': 'rotate(' + string + ')'
            })
        }

    });
    $('.add-input-select').click(function (e) {
        $('.add-select-block').not($(this).parents('.add-input-father').children('.add-select-block')).css({
            display: 'none'
        });
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        console.log('bb');
        $(this).parents('.add-input-father').children('.add-select-block').slideToggle('fast');
        $(this).children('div').css({

            'transform': 'rotate(' + string + ')'
        })

        e.stopPropagation();

    });
    $('.add-select-block li').on('click',function(){
        var text = $(this).html();
        var num0 = $(this).attr('ids');
        var num1 = $(this).attr('factor');
        var num2 = $(this).attr('unit');
        $(this).parents('.add-input-father').children('.add-select-block').slideToggle();
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').html(text);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('ids',num0);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('factor',num1);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('unit',num2);
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('div').css({

            'transform':'rotate('+string+')'
        })
    });

    $('.add-input-arrow').css({
        transform: 'rotate(0deg)'
    });

    //改变表计类型时
    $('.meter-type .add-select-block').on('click','li',function(){

        console.log(33);

        //判断当前是在线表还是手抄表
        if($(this).attr('ids') == '1'){

            //在线表默认上限值不可填写
            $(this).parents('.meter-type').next().find('label').removeClass('input-label');

            $(this).parents('.meter-type').next().find('.add-input').attr('disabled','disabled');

            $(this).parents('.meter-type').next().find('.add-input-block').addClass('can-not-import');

        }else{
            //手抄表默认上限值必须填写
            $(this).parents('.meter-type').next().find('label').addClass('input-label');

            $(this).parents('.meter-type').next().find('.add-input').removeAttr('disabled');

            $(this).parents('.meter-type').next().find('.add-input-block').removeClass('can-not-import');
        }

    });

    //添加操作

    $('#add-measure .btn-primary').on('click',function(){

        //判断输入是否正确
        if(!checkedNull('#add-measure') || !checkedNumber('#add-measure')){
            return false;
        };

        //获取要提交的数据

        var measureName = $("#add-measure .add-input").eq(0).val();
        var energyID = $("#add-measure .add-input").eq(1).find('span').attr('ids');
        var states = $("#add-measure .add-input").eq(2).find('span').attr('ids');
        var topNum = $("#add-measure .add-input").eq(3).val();
        var txt = $("#add-measure .add-input").eq(4).val();
        var range = $("#add-measure .add-input").eq(5).val();
        $.ajax({
            type: "post",
            url: IP + "/UnitMeter/AddMeterType",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            timeout:theTimes,
            data:{
                "pK_MeterType": 0,
                "f_MeterTypeName": measureName,
                "f_mtEnergyType": energyID,
                "f_mtOnline": states,
                "f_WarnUp":topNum,
                "f_MeterStandard": txt,
                "f_Range": range,
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
                $('#add-measure').modal('hide');
                $('#theLoading').modal('hide');
                if(data == 2){
                    myAlter('计量设备已存在');
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

                $('#add-measure').modal('hide');
                myAlter(num);
            }
        });
        //完成后清空input框
        $(this).parent().parent().parent().find('input').val('');
    });

    //修改操作
    $('#dateTables').on('click','.alter',function(){

        //获取要传的ID;
        var id = $(this).parent().parent().children().eq(1).html();
        for(var i=0; i < dataArr.length; i++){
            if(id == dataArr[i].pK_MeterType){
                var thisData = dataArr[i];
                break;
            }
        };
        console.log(thisData);
        //获取本行数据
        $.ajax({
            type: "get",
            timeout:theTimes,
            url: IP + "/UnitMeter/GetMeterTypeByID",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            data: {
                "PK_MeterType": id
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

        $('#alter-measure .add-input-select').eq(0).find('span').html(thisData.f_EnergyName);
        $('#alter-measure .add-input-select').eq(1).find('span').html(thisData.f_onlineName);
        $('#alter-measure .add-input-select').eq(0).find('span').attr('ids',thisData.f_mtEnergyType);
        $('#alter-measure .add-input-select').eq(1).find('span').attr('ids',thisData.f_mtOnline);
        $('#alter-measure .add-input').eq(0).val(thisData.f_MeterTypeName);
        $('#alter-measure .add-input').eq(3).val(thisData.f_WarnUp);
        $('#alter-measure .add-input').eq(4).val(thisData.f_MeterStandard);
        $('#alter-measure .add-input').eq(5).val(thisData.f_Range);

        //判断当前是在线表还是手抄表
        if(thisData.f_mtOnline == '1'){

            //在线表默认上限值不可填写
            $('#alter-measure .meter-type').next().find('label').removeClass('input-label');

              $('#alter-measure .meter-type').next().find('.add-input').attr('disabled','disabled');

              $('#alter-measure .meter-type').next().find('.add-input-block').addClass('can-not-import');

        }else{
            //手抄表默认上限值必须填写
              $('#alter-measure .meter-type').next().find('label').addClass('input-label');

              $('#alter-measure .meter-type').next().find('.add-input').removeAttr('disabled');

              $('#alter-measure .meter-type').next().find('.add-input-block').removeClass('can-not-import');
        }


        //点击提交按钮
        $('#alter-measure .btn-primary').off('click');
        $('#alter-measure .btn-primary').on('click',function(){

            //判断输入是否正确
            if(!checkedNull('#alter-measure') || !checkedNumber('#alter-measure')){
                return false;
            };

            //生成对应参数
            var measureName = $("#alter-measure .add-input").eq(0).val();
            var energyID = $("#alter-measure .add-input").eq(1).find('span').attr('ids');
            var states = $("#alter-measure .add-input").eq(2).find('span').attr('ids');
            var topNum = $("#alter-measure .add-input").eq(3).val();
            var txt = $("#alter-measure .add-input").eq(4).val();
            var range = $("#alter-measure .add-input").eq(5).val();

            postData.f_MeterTypeName = measureName;
            postData.f_mtEnergyType = energyID;
            postData.f_mtOnline = states;
            postData.f_WarnUp = topNum;
            postData.f_MeterStandard = txt;
            postData.f_Range = range;
            postData.userID = userName;

            console.log(postData);
            $.ajax({
                type: "post",
                timeout:theTimes,
                url: IP + "/UnitMeter/EditMeterType",
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
                    $('#alter-measure').modal('hide');
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
                    $('#alter-measure').modal('hide');
                    $('#theLoading').modal('hide');
                    console.log(textStatus);
                    if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }else{
                        myAlter(data.responseText.split('"')[3]);
                    }



                },

            });
        })

    });

    //删除操作

    $('#dateTables').on('click','.remove',function(){
        //获取要传的ID;

        var id = $(this).parent().parent().children().eq(1).html();
        var txt = $(this).parent().parent().children().eq(0).html();
        $('#remove-measure p b').html(txt);
        console.log(txt);
        //点击提交按钮
        $('#remove-measure .btn-primary').one('click',function(){
            $.ajax({
                type: "post",
                timeout:theTimes,
                url:IP + "/UnitMeter/DelMeterType",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
                data:{
                        "pK_MeterType": id,
                        "f_MeterTypeName": "string",
                        "f_mtEnergyType": 0,
                        "f_mtOnline": 0,
                        "f_WarnUp": 0,
                        "f_MeterStandard": "string",
                        "f_Range": 0,
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
                    $('#remove-measure').modal('hide');
                    ajaxSuccess();
                    if(data == 4){
                        myAlter('已关联计量设备，无法删除')
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
                    $('#remove-measure').modal('hide');
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
        url:IP + "/UnitMeter/GetAllMeterType",
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
            var num = dataArr.length;
            for(var i=0; i<num; i++){
               var num1 =  dataArr[i].f_mtEnergyType;
                var num2 = dataArr[i].f_mtOnline;
                var txt = getEnergyType(num1);
                dataArr[i].f_EnergyName = txt;
                var txt2 = getMtonline(num2);
                dataArr[i].f_onlineName = txt2;
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



//获取全部能耗类型
getAllEnergys('.energy-type');

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

//检验是否为数字
function checkedNumber(dom){
    var num = $(dom).find('.type-number').length;

    for(var i=0; i<num; i++){
        if($(dom).find('.type-number').eq(i).find('input').val() != ""){
            var txt = $(dom).find('.type-number').eq(i).find('input').val() / 1;

            if(isNaN(txt) || txt < 0 || txt == 0){
                var txt1 = $(dom).find('.type-number').eq(i).children('label').html().split('：')[0];
                console.log(txt1);
                myAlter(txt1 + " 必须为大于0的数字")
                getFocus1($(dom).find('.type-number').eq(i).find('input'));
                return false;
            }
        }

    }
    return true;
}