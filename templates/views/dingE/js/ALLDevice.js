/**
 * Created by admin on 2017/2/13.
 */


var rotateNum = 1;
$(document).ready(function(){

    //select 优化动画

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
        var num3 = $(this).attr('type');
        var num4 = $(this).attr('range');
        console.log(num4);
        $(this).parents('.add-input-father').children('.add-select-block').slideToggle();
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').html(text);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('ids',num0);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('factor',num1);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('unit',num2);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('type',num3);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('range',num4);
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('div').css({

            'transform':'rotate('+string+')'
        })
    });

    $('#theLoading').modal('show');
    $('input').attr('maxLength', '50');
    //调用获取后台数据方法，进行数据获取
    alarmHistory();

    //初始化表格
    var table = $('#dateTables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": true,//还原初始化了的datatable
        "paging":true,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页  总记录数为 _TOTAL_ 条',
            "sInfoEmpty" : "记录数为0",
            "sInfoFiltered" : "(全部记录数 _MAX_ 条)",
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
                title:'计量设备名称',
                data:'f_MeterTypeName'

            },
            {
                title:'本行ID',
                data:'pK_Meter',
                class:'theHidden'

            },
            {
                title:'计量设备ID',
                data:'fK_MeterType_Meter',
                class:'theHidden'
            },
            {
                title:'能耗类型',
                data:'f_EnergyName'

            },
            {
                title:'是否在线',
                data:'f_onlineName'

            },
            {
                title:'表号或代号',
                data:'f_mtNumber'

            },
            {
                title:'表号或代号类型',
                data:'f_mtNumberFlag',
                class:'theHidden'
            },
            {
                title:'二级单位',
                data:'f_UnitName'

            },
            {
                title:'绑定楼宇',
                data:'pointerName'
            },
            {
                title:'计量区域',
                data:'f_MeasureArea'
            },
            {
                title:'在线计量设备',
                data:'cNameT'
            },
            {
                title:'出厂编号',
                data:'f_FactoryNumber'

            },
            {
                title:'倍率',
                data:'f_Rate'

            },
            {
                title:'建档日期',
                data:'f_FilingDT'

            },
            {
                title:'建档起数',
                data:'f_FilingNumber'

            },
            {
                title:'最后止数',
                data:'f_ReadEndNum'

            },
            {
                title:'抄表日期',
                data:'f_ReadET'

            },
            {
                title:'报警上限',
                data:'f_WarnUp'

            },
            {
                title:'报警下限',
                data:'f_WarnDown'

            },
            {
                title:'安装位置',
                data:'f_InstalPosition'

            },
            {
                title:'计量区域',
                data:'f_MeasureArea'

            }
        ]
    })
    _table = $('#dateTables').dataTable();
    //给表格添加后台获取到的数据
    setData();
    hiddrenId();

    //查询功能
    $('.top-refer').on('click',function(){
        var num1 = $(this).parents('.condition-query').children().eq(0).children('select').val();
        var num2 = $(this).parents('.condition-query').children().eq(1).children('select').val();
        var num3 = $(this).parents('.condition-query').children().eq(2).find('.datatimeblock').val();

        console.log(num1,num2,num3);
        dataArr=[];
        $.ajax({
            type:'get',
            url:IP + "/UnitMeter/GetMeterByCondition",
            async:false,
            timeout:theTimes,
            data:{
                'F_MTEnergyType' : num1,
                'F_MTOnline' : num2,
                'F_MTNumber' :num3
            },
            beforeSend:function(){

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
                _table.fnClearTable();
                setData();
                hiddrenId();

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
    });

    //添加功能
    $('.top-btn1').on('click',function(){

    });
    $('#add-meter .btn-primary').on('click',function(){

        //判断输入是否正确
        if(!checkedNull('#add-meter') || !checkedNumber('#add-meter') || !checkedStartNum('#add-meter')){
            console.log('ok');
            return false;
        };

        //获取要提交的数据
        var number0 =  $("#add-meter .add-input").eq(0).find('span').attr('factor');
        var meterID = $("#add-meter .add-input").eq(0).find('span').attr('ids');
        var number = $("#add-meter .add-input").eq(1).val();
        var numberID = $("#add-meter .add-input").eq(2).find('span').attr('ids');
        var buildID = $("#add-meter .add-input").eq(3).attr('ids');

        var instrumentID = $("#add-meter .add-input").eq(4).attr('ids');
        console.log(instrumentID);
        var factoryNum = $("#add-meter .add-input").eq(5).val();
        var location = $("#add-meter .add-input").eq(6).val();

        var area = $("#add-meter .add-input").eq(7).val();
        var rate = $("#add-meter .add-input").eq(8).val();
        var buildDate;

        if(number0 == 0){

            buildDate = $("#add-meter .add-input").eq(9).val();
        }else{

            if($("#add-meter .bookbuilding").eq(0).find('span').html() != ''){
                buildDate = $("#add-meter .bookbuilding").eq(0).find('span').html();
            }else{
                buildDate = $("#add-meter .add-input").eq(9).val();
            }

        };



        var startNum = $("#add-meter .add-input").eq(10).val();
        var warnDown = $("#add-meter .add-input").eq(11).val();
        var warnUp = $("#add-meter .add-input").eq(12).val();

        $.ajax({
            type: "post",
            url: IP + "/UnitMeter/AddMeter",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            timeout:theTimes,
            data:{
                "pK_Meter": 0,
                "fK_MeterType_Meter":meterID,
                "f_mtNumber": number,
                "f_mtNumberFlag": numberID,
                "f_FactoryNumber": factoryNum,
                "f_Rate": rate,
                "f_FilingDT": buildDate,
                "f_FilingNumber": startNum,
                "f_WarnDown": warnDown,
                "f_WarnUp": warnUp,
                "f_InstalPosition": location,
                "f_MeasureArea": area,
                "f_PointerID": buildID,
                "f_cDataID": instrumentID,
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

                $('#theLoading').modal('hide');
                if(data == 2){
                    myAlter('计量设备已存在');
                    getFocus1($('#add-meter .add-input').eq(1));
                    return false;
                }
                if(data == 3){
                    myAlter('添加失败');
                    return false;
                }
                if(data == 6){
                    myAlter('数采仪编号重复');
                    return false;
                }
                if(data == 13){
                    myAlter('仪表计量区域重复');
                    return false;
                }
                $('#add-meter').modal('hide');

                ajaxSuccess();
                //完成后清空input框
                $(this).parent().parent().parent().find('input').val('');

            },
            error:function (data, textStatus, errorThrown) {
                var num = data.responseText.split('"')[3];
                console.log(data.responseText);
                if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                $('#theLoading').modal('hide');

                $('#add-meter').modal('hide');
                myAlter(num);
                //完成后清空input框
                $(this).parent().parent().parent().find('input').val('');
            }
        });

    });

    //修改功能
    $('.top-btn2').on('click',function(){
        var dom = $('.onFocus');
        if(dom.length == 0){
            myAlter('请选中一行数据进行操作');
            return false;
        }

        var index = $(dom).index() + 1;
        var id = dom.children().eq(1).html();
        var txt = $(dom).children().eq(2).html();
        var postData;
        //获取后台数据
        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/GetDingEMeterByMeterID",
            async: false,
            timeout: theTimes,
            data:{
                meterID:id
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');

                postData = data;
                console.log(meterType);
                for(var i=0 ; i<meterType.length;i++){
                    if(data.fK_MeterType_Meter == meterType[i].pK_MeterType){
                        $('#alter-meter').find('.add-input').eq(0).find('span').html(meterType[i].f_MeterTypeName);
                        $('#alter-meter').find('.add-input').eq(0).find('span').attr('ids',meterType[i].pK_MeterType);
                        $('#alter-meter').find('.add-input').eq(0).find('span').attr('factor',meterType[i].f_mtOnline);
                        $('#alter-meter').find('.add-input').eq(0).find('span').attr('unit',meterType[i].f_WarnUp);
                        $('#alter-meter').find('.add-input').eq(0).find('span').attr('type',meterType[i].f_mtEnergyType);
                        $('#alter-meter').find('.add-input').eq(0).find('span').attr('range',meterType[i].f_Range);

                    }
                }
                $('#alter-meter').find('.add-input').eq(1).val(data.f_mtNumber);
                var num = data.f_mtNumberFlag;
                $('#alter-meter').find('.add-input').eq(2).find('span').attr('ids',num);
                if(num == 0){
                    $('#alter-meter').find('.add-input').eq(2).find('span').html('表号');
                }else{
                    $('#alter-meter').find('.add-input').eq(2).find('span').html('代号');
                };

                for(var i=0; i<buildMessage.length; i++){
                    if(data.f_PointerID == buildMessage[i].pointerID){
                        $('#alter-meter').find('.add-input').eq(3).val(buildMessage[i].pointerName);
                        $('#alter-meter').find('.add-input').eq(3).attr('ids',data.f_PointerID);
                    }
                };

                var instrument = dom.children().eq(10).html();
                $('#alter-meter').find('.add-input').eq(4).val(instrument);
                $('#alter-meter').find('.add-input').eq(4).attr('ids',data.f_cDataID);

                $('#alter-meter').find('.add-input').eq(5).val(data.f_FactoryNumber);
                $('#alter-meter').find('.add-input').eq(6).val(data.f_InstalPosition);
                $('#alter-meter').find('.add-input').eq(7).val(data.f_MeasureArea );
                $('#alter-meter').find('.add-input').eq(8).val(data.f_Rate);

                $('#alter-meter').find('.add-input').eq(10).val(data.f_FilingNumber);
                $('#alter-meter').find('.add-input').eq(11).val(data.f_WarnDown);
                $('#alter-meter').find('.add-input').eq(12).val(data.f_WarnUp);

                $('#alter-meter').find('.rate').find('.add-input').attr('disabled','true');

                if($('#alter-meter').find('.add-input').eq(0).find('span').attr('factor') == 1){
                    getNumbered1('#alter-meter');
                    $('#alter-meter').find('.number-machine').find('img').attr('data-target','#choose-instrument');
                    $('#alter-meter').find('.number-machine').find('img').css({
                        display:'inline-block'
                    });

                    $('#alter-meter').find('.number-machine').find('.add-input').removeAttr('placeHolder');

                    $('#alter-meter').find('.bookbuilding').find('.add-input').css('disabled',"true");
                    $('#alter-meter').find('.bookbuilding').eq(0).find('.add-input').css({
                        display:'none'
                    });

                    $('#alter-meter').find('.bookbuilding').eq(0).find('.add-input-block').css({

                        backgroundColor: 'rgb(235, 235, 228)'
                    });

                    $('#alter-meter').find('.bookbuilding').eq(0).find('span').css({
                        display:'inline-block'
                    });
                    $('#alter-meter').find('.bookbuilding').eq(0).find('span').html(data.f_FilingDT);
                    $('#alter-meter').find('.bookbuilding').eq(1).find('.add-input').attr('disabled','true');

                    $('#alter-meter').find('.get-online-message').removeAttr('disabled');
                    $('#alter-meter').find('.get-online-message').addClass('top-btn');

                    $('#alter-meter').find('.type-number').eq(2).find('.add-input').attr('placeHolder','不可输入');
                    $('#alter-meter').find('.type-number').eq(2).find('.add-input').attr('disabled','true');
                    $('#alter-meter').find('.type-number').eq(3).find('.add-input').attr('disabled','true');
                    $('#alter-meter').find('.type-number').eq(3).find('.add-input').attr('placeHolder','不可输入');
                    $('#alter-meter').find('.type-number').eq(3).find('label').removeClass('input-label');


                }else{
                    $('#alter-meter').find('.number-machine').find('.add-input').removeAttr('data-target');
                    $('#alter-meter').find('.number-machine').find('.add-input').attr('placeHolder','不可输入');
                    $('#alter-meter').find('.number-machine').find('img').css({
                        display:'none'
                    });

                    if($('#add-meter').find('.rate').find('span').attr('type') == 100){
                        $('#add-meter').find('.rate').find('.add-input').removeAttr('disabled');
                    }

                    $('#alter-meter').find('.bookbuilding').find('.add-input').removeAttr('disabled');
                    $('#alter-meter').find('.bookbuilding').eq(0).find('.add-input').css({
                        display:'inline-block'
                    });
                    $('#alter-meter').find('.bookbuilding').eq(0).find('span').css({
                        display:'none'
                    });
                    $('#alter-meter').find('.bookbuilding').eq(0).find('.add-input').val(data.f_FilingDT);


                    $('#alter-meter').find('.get-online-message').attr('disabled','true');
                    $('#alter-meter').find('.get-online-message').removeClass('top-btn');

                    $('#alter-meter').find('.bookbuilding').eq(1).find('.add-input').removeAttr('disabled');

                    $('#alter-meter').find('.type-number').eq(2).find('.add-input').attr('placeHolder','');
                    $('#alter-meter').find('.type-number').eq(2).find('.add-input').removeAttr('disabled');
                    $('#alter-meter').find('.type-number').eq(3).find('.add-input').removeAttr('disabled');
                    $('#alter-meter').find('.type-number').eq(3).find('.add-input').removeAttr('placeHolder');
                    $('#alter-meter').find('.type-number').eq(3).find('label').addClass('input-label');
                }

                changeColor()

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

        //提交修改时
        $('#alter-meter .btn-primary').off('click')
        $('#alter-meter .btn-primary').on('click',function() {

            //判断输入是否正确
            if (!checkedNull('#alter-meter') || !checkedNumber('#alter-meter') || !checkedStartNum('#alter-meter')) {
                console.log('ok');
                return false;
            };

            //获取要提交的数据
            var number0 =  $("#alter-meter .add-input").eq(0).find('span').attr('factor');
            var meterID = $("#alter-meter .add-input").eq(0).find('span').attr('ids');
            var number = $("#alter-meter .add-input").eq(1).val();
            var numberID = $("#alter-meter .add-input").eq(2).find('span').attr('ids');
            var buildID = $("#alter-meter .add-input").eq(3).attr('ids');

            var instrumentID = $("#alter-meter .add-input").eq(4).attr('ids');

            var factoryNum = $("#alter-meter .add-input").eq(5).val();
            var location = $("#alter-meter .add-input").eq(6).val();

            var area = $("#alter-meter .add-input").eq(7).val();
            var rate = $("#alter-meter .add-input").eq(8).val();
            var buildDate;
            if(number0 == 0){
                buildDate = $("#alter-meter .add-input").eq(9).val();
            }else{

                if($("#alter-meter .bookbuilding").eq(0).find('span').html() != ''){
                    buildDate = $("#alter-meter .bookbuilding").eq(0).find('span').html();
                }else{
                    buildDate = $("#alter-meter .add-input").eq(9).val();
                }
            };
            console.log(buildDate);
            var startNum = $("#alter-meter .add-input").eq(10).val();
            var warnDown = $("#alter-meter .add-input").eq(11).val();
            var warnUp = $("#alter-meter .add-input").eq(12).val();


            postData.pK_Meter = id;
            postData.fK_MeterType_Meter = meterID;
            postData.f_mtNumberFlag = numberID;
            postData.f_mtNumber = number;
            postData.f_PointerID = buildID;
            postData.f_cDataID = instrumentID;
            postData.f_FactoryNumber = factoryNum;
            postData.f_InstalPosition = location;
            postData.f_MeasureArea = area;
            postData.f_Rate = rate;
            postData.f_FilingDT = buildDate;
            postData.f_FilingNumber = startNum;
            postData.f_WarnDown =  warnDown;
            postData.f_WarnUp = warnUp;
            postData.userID = userName;

            console.log(postData);
            $.ajax({
                type: 'post',
                url: IP + "/UnitMeter/EditDingEMeter",
                async: false,
                timeout: theTimes,
                data:postData,
                beforeSend: function () {

                },

                complete: function () {

                },
                success: function (data) {
                    console.log(data);

                    $('#theLoading').modal('hide');
                    if(data == 2){
                        myAlter('计量设备已存在');
                        getFocus1($('#add-meter .add-input').eq(1));
                        return false;
                    }
                    if(data == 3){
                        myAlter('修改失败');
                        return false;
                    }
                    if(data == 6){
                        myAlter('数采仪编号重复');
                        return false;
                    }
                    if(data == 13){
                        myAlter('仪表计量区域重复');
                        return false;
                    }
                    $('#alter-meter').modal('hide');
                    jumpNow();


                    $('#dateTables tr').eq(index).addClass('onFocus');

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    $('#alter-meter').modal('hide');
                    console.log(textStatus);

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter(JSON.parse(XMLHttpRequest.responseText).message);
                }
            })
        });

    });

    //删除功能
    $('.top-btn5').on('click',function() {
        var dom = $('.onFocus');
        if(dom.length == 0){
            myAlter('请选中一行数据进行操作');
            return false;
        }

        var index = $(dom).index() + 1;
        var id = dom.children().eq(1).html();
        var txt = $(dom).children().eq(5).html();

        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/IsMeterReadData",
            async: false,
            timeout: theTimes,
            data:{
                PK_Meter:id
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                if(data == 0){
                    $('#remove-meter').modal('show');

                    $("#remove-meter p").html('确定删除计量设备 <span style="color:red">'+txt+'</span> 吗?');
                }else if(data == 1){
                    $('#remove-meter').modal('show');
                    $('#remove-meter p').html('已有抄表数据，是否继续删除？')
                }else if(data == 2){
                    $('#remove-meter').modal('hide');
                    myAlter('已关联二级单位，无法删除!');
                    return false;
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                myAlter("请求失败！");
                return false;
            }


        });

        $('#remove-meter').off('click');
        $('#remove-meter').on('click','.btn-primary',function(){

            $.ajax({
                type: 'post',
                url: IP + "/UnitMeter/DelDingEMeter",
                async: false,
                timeout: theTimes,
                data:{
                    "pK_Meter": id,
                    "fK_MeterType_Meter": 0,
                    "f_MeterTypeName": "string",
                    "f_mtEnergyType": 0,
                    "f_mtOnline": 0,
                    "f_mtNumber": "string",
                    "f_mtNumberFlag": 0,
                    "f_FactoryNumber": "string",
                    "f_Rate": 0,
                    "f_FilingDT": "string",
                    "f_FilingNumber": 0,
                    "f_ReadEndNum": 0,
                    "f_ReadET": "string",
                    "f_WarnDown": 0,
                    "f_WarnUp": 0,
                    "f_InstalPosition": "string",
                    "f_MeasureArea": "string",
                    "pointerName": "string",
                    "cNameT": "string",
                    "f_UnitName": "string",
                    "f_ChildAccount": 0,
                    "f_EquallyShared": 0,
                    "f_CancelFlag": 0,
                    "f_CancelDT": "string",
                    "f_CancelComment": "string",
                    "f_CancelUserID": "string",
                    "userID": userName
                },
                beforeSend: function () {

                },

                complete: function () {

                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    $('#remove-meter').modal('hide');
                    console.log(data);
                    if(data == 3){
                        myAlter('删除失败')
                    }else if(data == 4){
                        myAlter('已关联二级单位，删除失败')
                    }
                    jumpNow();


                    $('#dateTables tr').eq(index).addClass('onFocus');


                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    $('#remove-meter').modal('hide');
                    console.log(textStatus);

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter(JSON.parse(XMLHttpRequest.responseText).message);
                }
            });
        });
        $('#remove-meter').on('click','.btn-default',function(){
            $('#remove-meter').modal('hide');
        })
    });

});

function changeColor(){
    $('.add-input-block').css({

        backgroundColor: 'white'
    });
    $('.add-input:disabled').parent('.add-input-block').css({

        backgroundColor: 'rgb(235, 235, 228)'
    });

}
changeColor();

//楼宇搜索功能
//数采仪搜索功能
$(function(){
    // search-test-inner --->  最外层div
    // search-value --->  input 输入框
    // search-value-list --->  搜索结果显示div
    // search-li --->  搜索条目
    new SEARCH_ENGINE("search-test-inner0","search-value0","search-value-list0","search-li0");




});

//点击确定时触发
$(document).on('keydown',function(e){
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;

    if(code == 13){
        $('.top-refer').click();
        return false;
    }
});

//获取后台数据
function alarmHistory(){
    dataArr=[];
    $.ajax({
        type:'get',
        url:IP + "/UnitMeter/GetMeterByCondition",
        async:false,
        timeout:theTimes,
        data:{
            'F_MTEnergyType' : -1,
            'F_MTOnline' : -1,
            'F_MTNumber' :''
        },
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


function SEARCH_ENGINE(dom,searchInput,searchResultInner,searchList){

    //存储拼音+汉字+数字的数组
    this.searchMemberArray = [];

    //作用对象
    this.dom = $("." + dom);

    //搜索框
    this.searchInput = "." + searchInput;

    //搜索结果框
    this.searchResultInner = this.dom.find("." + searchResultInner);

    //搜索对象的名单列表
    this.searchList = this.dom.find("." + searchList);

    //转换成拼音并存入数组
    this.transformPinYin();

    //绑定搜索事件
    this.searchActiveEvent();

}

SEARCH_ENGINE.prototype = {
    //-----------------------------【转换成拼音，并将拼音、汉字、数字存入数组】
    transformPinYin : function(){

        //临时存放数据对象
        $("body").append('<input type="text" class="hidden pingying-box">');
        var $pinyin = $("input.pingying-box");

        for(var i=0;i<this.searchList.length;i++){

            //存放名字，转换成拼音
            $pinyin.val(this.searchList.eq(i).attr("data-name"));

            //汉字转换成拼音
            var pinyin = $pinyin.toPinyin().toLowerCase().replace(/\s/g,"");

            //汉字
            var cnCharacter = this.searchList.eq(i).attr("data-name");

            //数字
            var id = this.searchList.eq(i).attr("data-id");

            //倍率

            var rate = this.searchList.eq(i).attr("data-rate");

            //存入数组
            this.searchMemberArray.push(pinyin + "&" + cnCharacter + "&" + id + "&" + rate);
        }

        //删除临时存放数据对象
        $pinyin.remove();
    },

    //-----------------------------【模糊搜索关键字】
    fuzzySearch : function(type,val){
        var s;
        var returnArray = [];

        //拼音
        if(type === "pinyin"){
            s = 0;
        }
        //汉字
        else if(type === "cnCharacter"){
            s = 1;
        }
        //数字
        else if(type === "digital"){
            s = 1;
        }

        for(var i=0;i<this.searchMemberArray.length;i++){
            //包含字符
            if(this.searchMemberArray[i].split("&")[s].indexOf(val) >= 0){
                returnArray.push(this.searchMemberArray[i]);
            }
        }

        return returnArray;

    },

    //-----------------------------【输出搜索结果】
    postMemberList : function(tempArray){
        var html = '';

        //有搜索结果
        console.log(tempArray);
        if(tempArray.length > 0){

            html += '<li class="tips">搜索结果（' + tempArray.length + '）</li>';

            for(var i=0;i<tempArray.length;i++){
                var sArray = tempArray[i].split("&");

                html += '<li>';

                //判断是否在线

                html += '<span class="name" id="'+sArray[2]+'" rate="'+sArray[3] +'">' + sArray[1] + '</span>';
                html += '</li>';

            }
        }
        //无搜索结果
        else{

            if($(this.searchInput).val() != ""){
                html += '<li class="tips">无搜索结果……</li>';
            }else{
                this.searchResultInner.html("");
            }
        }
        this.searchResultInner.html(html);
    },

    //-----------------------------【绑定搜索事件】
    searchActiveEvent : function(){

        var searchEngine = this;

        $(document).on('keyup',this.searchInput,function(){
            //使默认的展示项关闭
            $('#ul1').css({
                'display':'none'
            });
            $(this).parent().parent().children('.search-value-list').css({
                display:'block'
            });
            //临时存放找到的数组
            var tempArray = [];

            var val = $(this).val();

            //判断拼音的正则
            var pinYinRule = /^[A-Za-z]+$/;

            //判断汉字的正则
            var cnCharacterRule = new RegExp("^[\\u4E00-\\u9FFF]+$","g");

            //判断整数的正则
            var digitalRule = /^[-\+]?\d+(\.\d+)?$/;

            //只搜索3种情况
            //拼音
            if(pinYinRule.test(val)){
                tempArray = searchEngine.fuzzySearch("pinyin",val);
            }
            //汉字
            else if(cnCharacterRule.test(val)){
                tempArray = searchEngine.fuzzySearch("cnCharacter",val);
            }
            //数字
            else if(digitalRule.test(val)){

                tempArray = searchEngine.fuzzySearch("digital",val);
            }
            else{
                searchEngine.searchResultInner.html('<li class="tips">无搜索结果……</li>');
            }

            searchEngine.postMemberList(tempArray);
            buildClick();
        });

    }
};

function showAll(){
    $('.search-value-list').css({
        display:'none'
    });
    $('#ul1').css({
        display:'block'
    });
    $('#ul1 li').css({
        display:'block'
    });

}

$('.search-value').on('focus',function(){
    if($(this).val() != ""){
        $('.search-value-list').css({
            display:'block'
        });
        $("#ul1").css({
            display:'none'
        })
    }
});

//当点击楼宇时触发

 function buildClicks(){
    $('.seek-ul li').on('click',function(){
        console.log('11');
        var txt = $(this).html();
        var id = $(this).attr('data-id');
        var rate = $(this).attr('data-rate');
        $(this).parents('.search-test-inner').find('input').val(txt);
        $(this).parents('.search-test-inner').find('input').attr('ids',id);
        if(rate){
            $(this).parents('.search-test-inner').find('input').attr('rate',rate);
        }
    });
}


function buildClick(){
    $('.search-value-list li').on('click',function(){
        console.log('ok');
        var txt = $(this).children().html();
        var id = $(this).children().attr('id');
        var rate = $(this).attr('data-rate');
        $(this).parents('.search-test-inner').find('input').val(txt);
        $(this).parents('.search-test-inner').find('input').attr('ids',id);
        if(rate){
            $(this).parents('.search-test-inner').find('input').attr('rate',rate);
        }
    });
}

$('.chooseDate').datepicker(
    {
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd'
    }
);

//点击table中某一行时
$('#dateTables tbody').on('click','tr',function(){
    $('tr').removeClass('onFocus');
    $(this).addClass('onFocus');

});

//存放仪表类型
var meterType = [];

function getMeterType(){
    $.ajax({
        type: 'get',
        url: IP + "/UnitMeter/GetAllMeterType",
        async: false,
        timeout: theTimes,
        beforeSend: function () {

        },
        complete: function () {

        },
        success: function (result) {
            $('#theLoading').modal('hide');
            console.log(result);
            for (var i = 0; i < result.length; i++) {
                meterType.push(result[i]);
            }
            var num = meterType.length;
            for (var i = 0; i < num; i++) {
                var num1 = meterType[i].f_mtEnergyType;
                var num2 = meterType[i].f_mtOnline;
                var txt = getEnergyType(num1);
                meterType[i].f_EnergyName = txt;
                var txt2 = getMtonline(num2);
                meterType[i].f_onlineName = txt2;
            }

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
    })
}
getMeterType();


//把仪表类型放到页面中
function putMeterType(dom){
    var arr0 = [];
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    var arr4 = [];
    var arr5 = [];
    var txt = meterType;
    var html2 = '';
    for(var i=0 ; i < txt.length; i++){
        var id = parseInt(txt[i].pK_MeterType);
        var type = txt[i].f_MeterTypeName;
        var state = txt[i].f_mtOnline;
        var topNum = txt[i].f_WarnUp;
        var num0 = txt[i].f_mtEnergyType;
        var range = txt[i].f_Range;
        arr0.push(state);
        arr1.push(id);
        arr2.push(type);
        arr3.push(topNum);
        arr4.push(num0);
        arr5.push(range);
    }
    for(var i = 0 ; i < arr2.length; i++){

        html2 += '<li ids="'+arr1[i]+'" factor="'+ arr0[i]+'" unit="'+arr3[i]+'" type="'+arr4[i]+'" range="'+arr5[i]+'">'+ arr2[i]+'</li>'
    }
    for(var i=0; i<$(dom).length; i++){
        $(dom).eq(i).find('.add-input-select').eq(0).find('span').html(arr2[0]);
        $(dom).eq(i).find('.add-select-block').eq(0).html(html2);
        $(dom).eq(i).find('.add-input-select').eq(0).find('span').attr('ids',arr1[0]);
        $(dom).eq(i).find('.add-input-select').eq(0).find('span').attr('factor',arr0[0]);
        $(dom).eq(i).find('.add-input-select').eq(0).find('span').attr('unit',arr3[0]);
        $(dom).eq(i).find('.add-input-select').eq(0).find('span').attr('type',arr4[0]);
        $(dom).eq(i).find('.add-input-select').eq(0).find('span').attr('range',arr5[0]);
    }
    if(arr0[0] == 0){

        $('#add-meter').find('.number-machine').find('.number-machine').find('.add-input').attr('placeHolder','不可输入');
        $('#add-meter').find('.number-machine').find('.add-input').attr('disabled',"true");
        $('#add-meter').find('.number-machine').find('img').removeAttr('data-target');
        $('#add-meter').find('.number-machine').find('img').css({
            display:'none'
        });

        $('#add-meter').find('.rate').find('.add-input').attr('placeHolder','');
        $('#add-meter').find('.rate').find('.add-input').val(1);
        $('#add-meter').find('.rate').find('.add-input').removeAttr('disabled');

        $('#add-meter').find('.get-online-message').attr('disabled','true');
        $('#add-meter').find('.get-online-message').removeClass('top-btn');

        $('#add-meter').find('.type-number').eq(2).find('.add-input').attr('placeHolder','');
        $('#add-meter').find('.type-number').eq(2).find('.add-input').removeAttr('disabled');
        $('#add-meter').find('.type-number').eq(3).find('.add-input').removeAttr('disabled');

        $('#alter-meter').find('.get-online-message').attr('disabled','true');
        $('#add-meter').find('.get-online-message').removeClass('top-btn');

        if(arr4[0] != 100){
            $('#add-meter').find('.rate').find('.add-input').attr('disabled','true');
        }

    }else if(arr0[0] == 1){
        $('#add-meter').find('.number-machine').find('.add-input').attr('placeHolder','从在线计量设备列表中选择');
        $('#add-meter').find('.number-machine').find('img').attr('data-target','#choose-instrument');
        $('#add-meter').find('.number-machine').find('img').css({
            display:'inline-block'
        });

        $('#add-meter').find('.rate').find('.add-input').attr('placeHolder','自动获取');
        $('#add-meter').find('.rate').find('.add-input').val('');
        $('#add-meter').find('.rate').find('.add-input').attr('disabled',"true");

        $('#add-meter').find('.bookbuilding').find('.add-input').attr('disabled',"true");
        $('#add-meter').find('.bookbuilding').eq(0).find('.add-input').css({
            display:'none'
        });
        $('#add-meter').find('.bookbuilding').eq(0).find('span').css({
            display:'inline-block'
        });



        $('#add-meter').find('.type-number').eq(2).find('.add-input').attr('placeHolder','不可输入');
        $('#add-meter').find('.type-number').eq(2).find('.add-input').attr('disabled','true');
        $('#add-meter').find('.type-number').eq(3).find('.add-input').attr('disabled','true');

        $('#add-meter').find('.type-number').eq(3).find('.add-input').attr('placeHolder','不可输入');
        $('#add-meter').find('.type-number').eq(3).find('label').removeClass('input-label');

        $('#add-meter').find('.get-online-message').addClass('top-btn');
        $('#alter-meter').find('.get-online-message').removeAttr('disabled');
    }
    $(dom).eq(0).parent().parent().find('.add-input').eq(12).val(arr3[0]);
    changeColor()
};

$('.top-btns').on('click',function(){
    console.log('11');
    $('#add-meter').find('input').val('');
    $('#add-meter .choose-building').find('span').html('');

    putMeterType('.meter-type');

    //仪表类型改变时 报警上限 数采仪编号 跟着改变
    $('.add-select-meter li').off('click');
    $('.add-select-block li').off('click');

    $('.add-select-meter li').on('click',function(){
        var num = $(this).attr('unit');
        var num0 = $(this).attr('factor');
        var num1 = $(this).attr('type');
        var txt = $(this).parents('.deploy-form').find('.build-number').find('input').val();

        $(this).parents('.deploy-form').find('.bookbuilding').eq(1).find('input').val('');
        $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('input').val('');
        $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('span').html('');

        $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('span').html('');
        console.log(txt);
        //手抄表
        if(num0 == 0){
            console.log(44);

            $(this).parents('.deploy-form').find('.number-machine').find('.add-input').attr('placeHolder','不可输入');
            $(this).parents('.deploy-form').find('.number-machine').find('img').css({
                display:'none'
            });
            $(this).parents('.deploy-form').find('.number-machine').find('.add-input').attr('disabled',"true");
            $(this).parents('.deploy-form').find('.number-machine').find('img').removeAttr('data-target');
            $(this).parents('.deploy-form').find('.number-machine').find('.add-input').val('');

            $(this).parents('.deploy-form').find('.rate').find('.add-input').attr('placeHolder','');
            $(this).parents('.deploy-form').find('.rate').find('.add-input').val(1);
            $(this).parents('.deploy-form').find('.rate').find('.add-input').removeAttr('disabled');
            if(num1 != 100){
                $(this).parents('.deploy-form').find('.rate').find('.add-input').attr('disabled',"true");
            }


            $(this).parents('.deploy-form').find('.get-online-message').attr('disabled','true');
            $(this).parents('.deploy-form').find('.get-online-message').removeClass('top-btn');

            $(this).parents('.deploy-form').find('.bookbuilding').find('.add-input').removeAttr('disabled');

            $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('.add-input').css({
                display:'inline-block'
            });
            $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('span').css({
                display:'none'
            });

            $(this).parents('.deploy-form').find('.type-number').eq(2).find('.add-input').attr('placeHolder','');
            $(this).parents('.deploy-form').find('.type-number').eq(2).find('.add-input').removeAttr('disabled');
            $(this).parents('.deploy-form').find('.type-number').eq(3).find('.add-input').removeAttr('disabled');

            $(this).parents('.deploy-form').find('.type-number').eq(3).find('.add-input').removeAttr('placeHolder');
            $(this).parents('.deploy-form').find('.type-number').eq(3).find('label').addClass('input-label');


        }else {
            $(this).parents('.deploy-form').find('.number-machine').find('.add-input').attr('placeHolder','从在线计量设备列表中选择');

            $(this).parents('.deploy-form').find('.number-machine').find('img').attr('data-target','#choose-instrument');
            $(this).parents('.deploy-form').find('.number-machine').find('.add-input').val('');

            $(this).parents('.deploy-form').find('.number-machine').find('img').css({
                display:'inline-block'
            });

            $(this).parents('.deploy-form').find('.rate').find('.add-input').attr('placeHolder','自动获取');
            $(this).parents('.deploy-form').find('.rate').find('.add-input').val('');
            $(this).parents('.deploy-form').find('.rate').find('.add-input').attr('disabled',"true");

            $(this).parents('.deploy-form').find('.get-online-message').removeAttr('disabled');
            $(this).parents('.deploy-form').find('.get-online-message').addClass('top-btn');

            $(this).parents('.deploy-form').find('.bookbuilding').find('.add-input').attr('disabled',"true");
            $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('.add-input').css({
                display:'none'
            });
            $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('span').css({
                display:'block'
            });

            $(this).parents('.deploy-form').find('.type-number').eq(2).find('.add-input').attr('placeHolder','不可输入');
            $(this).parents('.deploy-form').find('.type-number').eq(2).find('.add-input').attr('disabled','true');
            $(this).parents('.deploy-form').find('.type-number').eq(3).find('.add-input').attr('disabled','true');

            $(this).parents('.deploy-form').find('.type-number').eq(3).find('.add-input').attr('placeHolder','不可输入');
            $(this).parents('.deploy-form').find('.type-number').eq(3).find('label').removeClass('input-label');


            var doms = $('.in');
            console.log(doms.attr('id'));
            if(doms.attr('id') == 'add-meter'){
                if(txt != ''){
                    console.log('111');
                    getNumbered('#add-meter');
                }
            }else{
                if(txt != ''){
                    console.log('222');
                    getNumbered1('#alter-meter');
                }
            }


        }
        $(this).parents('.deploy-form').find('.add-input').eq(12).val(num);
        changeColor()

    });
    $('.add-select-block li').on('click',function(){
        var text = $(this).html();
        var num0 = $(this).attr('ids');
        var num1 = $(this).attr('factor');
        var num2 = $(this).attr('unit');
        var num3 = $(this).attr('type');
        var num4 = $(this).attr('range');
        $(this).parents('.add-input-father').children('.add-select-block').slideToggle();
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').html(text);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('ids',num0);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('factor',num1);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('unit',num2);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('type',num3);
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('span').attr('range',num4);
        rotateNum++;
        var num = rotateNum * 180;
        var string = num + 'deg';
        $(this).parents('.add-input-father').children('.add-input-block').children('.add-input-select').children('div').css({

            'transform':'rotate('+string+')'
        })
    });
});

//存放楼宇信息
var buildMessage = [];

function getBuildMessage(){
    $.ajax({
        type: 'post',
        url: IP + "/Pointer/GetAllPointers",
        async: false,
        timeout: theTimes,
        beforeSend: function () {

        },
        complete: function () {

        },
        success: function (result) {
            $('#theLoading').modal('hide');
            for (var i = 0; i < result.length; i++) {
                buildMessage.push(result[i]);
            }

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
    })
}

getBuildMessage();
//把楼宇信息放入页面中
function putBuild(dom){
    var arr1 = [];
    var arr2 = [];
    var txt = buildMessage;
    var html2 = '';
    for(var i = 0 ; i < txt.length; i++){
        var id = parseInt(txt[i].pointerID);
        var type = txt[i].pointerName;
        arr1.push(id);
        arr2.push(type);
    }
    for(var i = 0 ; i < arr2.length; i++){

        html2 += '<li class="titles search-li search-li0" data-name="'+arr2[i]+'" data-id="'+ arr1[i]+'">'+ arr2[i]+'</li>'
    }

        $(dom).html(html2);
        buildClicks()
}
putBuild('#ul1');

//点击楼宇提交按钮时
$('#choose-building').on('click','.btn-primary',function(){
    var txt = $('#choose-building .search-value').val();
    var id = $('#choose-building .search-value').attr('ids');

    if( txt != ""){
        $('#choose-building').modal('hide');
        $('.in .add-input').eq(3).val(txt);
        $('.in .add-input').eq(3).attr('ids',id);

    }else{
        myAlter('请选择楼宇后进行提交');
        return false;
    }
    var doms = $('.in');
    console.log(doms.attr('id'));
    if(doms.attr('id') == 'add-meter'){

            console.log('111');

            getNumbered('#add-meter');
        $("#add-meter").find('.add-input').eq(4).val('');
        $("#add-meter").find('.add-input').eq(4).attr('ids','');
        $("#add-meter").find('.bookbuilding').eq(0).find('span').html('');
        $("#add-meter").find('.bookbuilding').eq(1).find('input').val('');

    }else{

            console.log('222');
            getNumbered1('#alter-meter');

        $("#alter-meter").find('.add-input').eq(4).val('');
        $("#alter-meter").find('.add-input').eq(4).attr('ids','');
        $("#alter-meter").find('.bookbuilding').eq(0).find('span').html('');
        $("#alter-meter").find('.bookbuilding').eq(1).find('input').val('');

    }


});

//点击在线计量设备提交按钮时
$('#choose-instrument').on('click','.btn-primary',function(){
    var txt = $('#choose-instrument .search-value').val();
    var id = $('#choose-instrument .search-value').attr('ids');
    var rate = $('#choose-instrument .search-value').attr('rate');
    if( txt != ""){
        $('#choose-instrument').modal('hide');
        $('.in .add-input').eq(4).val(txt);
        $('.in .add-input').eq(4).attr('ids',id);
        $('.in .add-input').eq(4).attr('rate',rate);

        $('.in .add-input').eq(8).val(rate);

        $(".in").find('.bookbuilding').eq(0).find('span').html('');
        $(".in").find('.bookbuilding').eq(1).find('input').val('');

    }else{
        myAlter('请选择在线计量设备后进行提交');
    }
});




//仪表类型改变时 报警上限 在线计量设备编号 跟着改变
$('.add-select-meter li').on('click',function(){
   var num = $(this).attr('unit');
    var num0 = $(this).attr('factor');
    var num1 = $(this).attr('type');
    var txt = $(this).parents('.deploy-form').find('.build-number').find('input').val();

    $(this).parents('.deploy-form').find('.bookbuilding').eq(1).find('input').val('');
    $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('input').val('');
    $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('span').html('');

    $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('span').html('');
    console.log(txt);
    if(num0 == 0){


        $(this).parents('.deploy-form').find('.number-machine').find('.add-input').attr('placeHolder','不可输入');
        $(this).parents('.deploy-form').find('.number-machine').find('.add-input').attr('disabled',"true");
        $(this).parents('.deploy-form').find('.number-machine').find('img').removeAttr('data-target');
        $(this).parents('.deploy-form').find('.number-machine').find('.add-input').val('');

        $(this).parents('.deploy-form').find('.rate').find('.add-input').attr('placeHolder','');
        $(this).parents('.deploy-form').find('.rate').find('.add-input').val(1);
        $(this).parents('.deploy-form').find('.rate').find('.add-input').removeAttr('disabled');
        if(num1 != 100){
            $(this).parents('.deploy-form').find('.rate').find('.add-input').attr('disabled',"true");
        }


        $(this).parents('.deploy-form').find('.get-online-message').attr('disabled','true');
        $(this).parents('.deploy-form').find('.get-online-message').removeClass('top-btn');

        $(this).parents('.deploy-form').find('.bookbuilding').find('.add-input').removeAttr('disabled');

        $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('.add-input').css({
            display:'inline-block'
        });
        $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('span').css({
            display:'none'
        });

    }else {
        $(this).parents('.deploy-form').find('.number-machine').find('.add-input').attr('placeHolder','从在线计量设备列表中选择');

        $(this).parents('.deploy-form').find('.number-machine').find('img').attr('data-target','#choose-instrument');
        $(this).parents('.deploy-form').find('.number-machine').find('.add-input').val('');

        $(this).parents('.deploy-form').find('.rate').find('.add-input').attr('placeHolder','自动获取');
        $(this).parents('.deploy-form').find('.rate').find('.add-input').val('');
        $(this).parents('.deploy-form').find('.rate').find('.add-input').attr('disabled',"true");

        $(this).parents('.deploy-form').find('.get-online-message').removeAttr('disabled');
        $(this).parents('.deploy-form').find('.get-online-message').addClass('top-btn');

        $(this).parents('.deploy-form').find('.bookbuilding').find('.add-input').attr('disabled',"true");
        $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('.add-input').css({
            display:'none'
        });
        $(this).parents('.deploy-form').find('.bookbuilding').eq(0).find('span').css({
            display:'block'
        });

        var doms = $('.in');
        if(doms.attr('id') == '#add-meter'){
            if(txt != ''){
                console.log('111');
                getNumbered('#add-meter');
            }
        }else{
            if(txt != ''){
                console.log('222');
                getNumbered1('#alter-meter');
            }
        }


    }
    $(this).parents('.deploy-form').find('.add-input').eq(12).val(num);

});

var numbered = [];

//获取新增中的在线计量设备编号
function getNumbered(dom){
    numbered = [];
    setTimeout(function(){
        var txt1 = $(dom).find('.add-input').eq(0).children('span').attr('type');
        var txt2 = $(dom).find('.add-input').eq(3).attr('ids');

        console.log(txt1,txt2);
        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/GetPtCCodeByAddMeter",
            async: false,
            timeout: theTimes,
            data:{
                pointerID:txt2,
                energyType:txt1
            },
            beforeSend: function () {

            },
            complete: function () {

            },
            success: function (result) {
                $('#theLoading').modal('hide');
                console.log(result);
                for (var i = 0; i < result.length; i++) {
                    numbered.push(result[i]);
                }
                putNumbered('#ul2');

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
        })
    })

};

//获取修改中的在线计量设备编号
function getNumbered1(dom){
    numbered = [];
    var txt1 = $(dom).find('.add-input').eq(0).children('span').attr('type');
    var txt2 = $(dom).find('.add-input').eq(3).attr('ids');
    var txt3 = $(dom).find('.add-input').eq(4).attr('ids');
    console.log(txt2,txt3);
    if(!txt3){
        console.log('nnn');
        txt3 = 0;
    }
    setTimeout(function(){

        console.log(txt3);
        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/GetPtCCodeByEditMeter",
            async: false,
            timeout: theTimes,
            data:{
                pointerID:txt2,
                F_CDataID:txt3,
                energyType:txt1
            },
            beforeSend: function () {

            },
            complete: function () {

            },
            success: function (result) {
                $('#theLoading').modal('hide');
                console.log(result);
                for (var i = 0; i < result.length; i++) {
                    numbered.push(result[i]);
                }
                putNumbered('#ul2');

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
        })
    })

};

//将在线计量设备编号放入页面中

function putNumbered(dom){
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    var txt = numbered;
    var html2 = '';
    for(var i = 0 ; i < txt.length; i++){
        var id = parseInt(txt[i].cDataID);
        var name = txt[i].cNameT;
        var rate1 = txt[i].rate;
        arr1.push(id);
        arr2.push(name);
        arr3.push(rate1);
    }
    for(var i = 0 ; i < arr2.length; i++){

        html2 += '<li class="titles search-li1 search-li" data-name="'+arr2[i]+'" data-id="'+ arr1[i]+'" data-rate="'+ arr3[i]+'">'+ arr2[i]+'</li>';

    }
    $(dom).html(html2);
    buildClicks();
    new SEARCH_ENGINE("search-test-inner1","search-value1","search-value-list1","search-li1");
};

//点击关闭时清空
function removeSeek(dom){
    $(dom).on('click','.close',function(){
        $(this).parent().find('.search-value-list').css({
            display:'none'
        });
        $(this).parent().find('.seek-ul').css({
            display:'block'
        });
        $(this).parent().find('input').val('');
    });
    $(dom).on('click','.btn-default',function(){
        $(this).parents('.modal-header').find('.search-value-list').css({
            display:'none'
        });
        $(this).parents('.modal-header').find('.seek-ul').css({
            display:'block'
        });
        $(this).parents('.modal-header').find('input').val('');
    });
    setTimeout(function(){
        $(dom).on('click','.btn-primary',function(){
            $(this).parents('.modal-header').find('.search-value-list').css({
                display:'none'
            });
            $(this).parents('.modal-header').find('.seek-ul').css({
                display:'block'
            });
            $(this).parents('.modal-header').find('input').val('');
        });
    },100)

}

removeSeek('#choose-building');
removeSeek('#choose-instrument');

//点击在线计量设备后的放大镜时
$('.number-machine').on('click','img',function(){

  var txt = $(this).parents('.deploy-form').find('.build-number').find('input').val();
    console.log(txt);
    if(txt == ''){
        myAlter('请输入楼宇编号进行获取');
        return false;
    }
});

//获取建档信息
$('.get-online-message').on('click',function(){
   var id1 =  $(this).parents('.deploy-form').find('.build-number').find('.add-input').attr('ids');
    var id2 =  $(this).parents('.deploy-form').find('.number-machine').find('.add-input').attr('ids');
    var that = $(this);
    console.log(id1,id2);
    if(!id1){
        myAlter('请输入楼宇编号');
        return false;
    }else if(!id2){
        myAlter('请输入在线计量设备编号');
        return false;
    }else{
        $.ajax({
            type: 'get',
            url: IP + "/UnitMeter/GetOnlineMeterFilingData",
            async: false,
            timeout: theTimes,
            data:{
                pointerID:id1,
                F_CDataID:id2
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                if(data.returnFlag == 0){
                    myAlter('无建档信息，请联系管理员');
                    return false;
                }else if(data.returnFlag == 2){
                    myAlter('参数错误，请联系管理员');
                    return false;
                }else{
                    var txt1 = data.f_FilingDT;
                    var txt2 = data.f_FilingNumber;

                    that.parents('.deploy-form').find('.bookbuilding').eq(0).find('span').html(txt1);
                    that.parents('.deploy-form').find('.bookbuilding').eq(0).find('span').css({
                        display:'inline-block'
                    });
                    that.parents('.deploy-form').find('.bookbuilding').eq(0).find('input').css({
                        display:'none'
                    });
                    that.parents('.deploy-form').find('.bookbuilding').eq(1).find('.add-input').val(txt2);

                    that.parents('.deploy-form').find('.bookbuilding').eq(0).find('.add-input').removeAttr('disabled');
                    that.parents('.deploy-form').find('.bookbuilding').eq(1).find('.add-input').removeAttr('disabled');
                    that.parents('.deploy-form').find('.bookbuilding').eq(1).find('.add-input').parent().css({

                        backgroundColor: 'rgb(255, 255, 255)'
                    });
                }


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
        })
    }
});

//检验是否必填项全部填写
function checkedNull(dom){
    var checkNum = $(dom).find('.input-label').length;

    var online = $(dom).find('.add-input').eq(0).find('span').attr('factor');

    for(var i=0; i< checkNum; i++){
        if(i==3){
            console.log(11);
            if(online == 1){
                console.log(22);
                if( $(dom).find('.input-label').eq(i).next().find('span').html() == ''){
                    var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

                    console.log(txt);
                    myAlter(txt + " 不能为空");
                    getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
                    return false;
                };
            }
        }else if(i == 9){
            if(online == 0){
                if( $(dom).find('.input-label').eq(i).next().find('input').val() == ''){
                    var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

                    console.log(txt);
                    myAlter(txt + " 不能为空");
                    getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
                    return false;
                };
            }
        }else if(i==7){
            if(online == 0){
                if( $(dom).find('.input-label').eq(i).next().find('input').val() == '' ){
                    var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

                    console.log(txt);
                    myAlter(txt + " 不能为空");
                    getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
                    return false;
                };
            }else{
                if( $(dom).find('.input-label').eq(i).next().find('span').html() == '' && $(dom).find('.input-label').eq(i).next().find('input').val() == ''){
                    var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

                    console.log(txt);
                    myAlter(txt + " 不能为空");
                    getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
                    return false;
                };
            }
        }else{
            if( $(dom).find('.input-label').eq(i).next().find('input').val() == ''){
                var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

                console.log(txt);
                myAlter(txt + " 不能为空");
                getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
                return false;
            };
            if($(dom).find('.input-label').eq(i).next().find('.add-input-select').find('span').html() == ''){
                var txt = $(dom).children('.input-label').eq(i).html().split('：')[0];
                $('#check-text').modal('show');
                myAlter(txt + " 不能为空");
                return false;
            }
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

            if(isNaN(txt) || txt < 0 ){
                var txt1 = $(dom).find('.type-number').eq(i).children('label').html().split('：')[0];
                console.log(txt1);
                myAlter(txt1 + " 必须为非负数字")
                getFocus1($(dom).find('.type-number').eq(i).find('input'));
                return false;
            }
        }

    }
    return true;
}

//提交更改后跳转到当前页
function jumpNow(){
    var txt = $('#dateTables_paginate').children('span').children('.current').html();

    ajaxSuccess();
    var num = txt - 1;
    var dom = $('#dateTables_paginate').children('span').children().eq(num);
    console.log(txt);
    console.log(dom);
    dom.click();

}

//检验建档起数
function checkedStartNum(dom){
    var range = $(dom).find('.add-input').eq(0).find('span').attr('range');


        if(parseFloat($(dom).find('.start-number').find('input').val()) > parseFloat(range)){

                var txt1 = $(dom).find('.start-number').children('label').html().split('：')[0];
                console.log(txt1);
                myAlter(txt1 + " 必须小于量程");
                getFocus1($(dom).find('.start-number').find('input'));
                return false;

        }

    return true;
}

$('.bookbuilding span').on('click',function(){

    var theTime = $(this).html();

    if(theTime != ''){
        $(this).css({
            display:'none'
        });

        $(this).next().css({
            display:'inline-block'
        });
        $(this).next().val(theTime);
         $(this).html('');
    }

});

$('#alter-meter  .start-number .add-input-block').on('click',function(){

   $(this).find('input').removeAttr('disabled');

    $(this).css({
        background:'rgb(255, 255, 255)'
    })
});

