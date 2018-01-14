
$(document).ready(function(){

    $('input').attr('maxlength','50');
    $('.add-comment').attr('maxlength','200');

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
            'lengthMenu': '每页 _MENU_ 件',
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
                title:'单位',
                data:'f_UnitName'

            },
            {
                title:'单位ID',
                data:'fK_Unit_AboveChild',
                class:'theHidden'

            },
            {
                title:'本行ID',
                data:'pK_AboveQuotaChild',
                class:'theHidden'

            },
            {
                title:'结算时间段',
                data:'f_AccountST',
                render:function(data, type, row, meta){
                    var date1 = data.split(' ')[0];
                    var date2 = row.f_AccountET.split(' ')[0];
                    return ''+ date1 + ' - ' + date2 + '';
                }

            },
            {
                title:'应缴费用',
                data:'f_ShouldPay'

            },
            {
                title:'特殊加减费用',
                data:'f_SpecialRebatePay'

            },
            {
                title:'百分比减免(%)',
                data:'f_PercentageReduction',
                render:function(data, type, row, meta){

                    return data * 100;
                }

            },
            {
                title:'实收费用',
                data:'f_ActualPay'

            },
            {
                title:'缴费状态',
                data:'f_PayState',
                render:function(data, type, row, meta){
                  if(data == 0){
                        return '<span ><b class="pay-not0" ></b><font>未超额</font></span>'
                  }else if(data == 1){
                      return '<span ><b class="pay-not1" ></b><font>未缴费</font></span>'
                  }
                }

            },
            {
                title:'修改费用',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn create-data' data-toggle='modal' data-target='#alter-cost'>修改</button>"
            },
            {
                title:'查看详情',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn change-data' data-toggle='modal' data-target='#remove-deploy'>查看</button>"
            }

        ]
    });
    _table = $('#dateTables').dataTable();
    dataArr = [];

    //查寻指定日期下的超额用能列表
    $('.main-content .condition-query .top-refer').on('click',function(){


        console.log('ok');

        dataArr = [];
        var txt1 = $('.refer-unit-table .startDate').val();
        var txt2 = $('.refer-unit-table .endDate').val();
        if(txt1 == '' || txt2 == ''){

            myAlter('请正确输入时间段后进行查询');
            return false;
        }

        $('#theLoading').modal('show');

        $.ajax({
            type: 'get',
            url: IP + "/AboveQuota/GetUnitAboveQuotas",
            async: true,
            timeout: theTimes,
            data:{
                accountSTStr : txt1,
                accountETStr : txt2,
                quotaAccountWay : accountWay,
                userID : userName,
                unitVirtualID : -1
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {


                $('#theLoading').modal('hide');
                console.log(data);
                if(data.validateNumber == 1){
                    myAlter('参数错误，请联系管理员');
                    return false;
                }
                if(data.validateNumber == 3){
                    myAlter('执行失败，请联系管理员');
                    return false;
                }
                isWrong = 0;
                $('.the-wrong').css({
                    display:'none'
                });
                theHint = '';
                if(data.validateNumber == 5){
                    isWrong = 1;
                    $('.the-wrong').css({
                        display:'inline-block'
                    });
                    var html = '';
                   for(var i=0; i<data.f_mtNumberInfos.length; i++){
                       if(i == data.f_mtNumberInfos.length-1){
                           html +='<span style="font-weight: 400">'+data.f_mtNumberInfos[i].key + ' : ' +data.f_mtNumberInfos[i].valueStr + '。</span>'
                       }else{
                           html += '<span style="font-weight: 400">'+data.f_mtNumberInfos[i].key + ' : ' +data.f_mtNumberInfos[i].valueStr + '，</span><br />'
                       }

                   }
                    theHint = html;
                    myAlter(html);

                }
                var arr = data.aboveQuotaChilds;

                for(var i=0; i< arr.length; i++){
                        dataArr.push(arr[i]);
                }
                _table = $('#dateTables').dataTable();
                _table.fnClearTable();
                setData();
                hiddrenId();

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
    });

    //修改费用
    $('#dateTables').on('click','.create-data',function(){

        var id = $(this).parents('tr').children().eq(1).html();

        var getData = {};
        //找到是dataArr中的第几项
        var importNum = 0;

        for(var i=0; i<dataArr.length; i++){
            if(id == dataArr[i].fK_Unit_AboveChild){
                importNum = i;
                getData = dataArr[i];
            }
        }
        //console.log(getData);

        $('#alter-cost .add-input').eq(0).val(getData.f_ShouldPay);
        $('#alter-cost .add-input').eq(1).val(getData.f_SpecialRebatePay);


        $('#alter-cost .btn-primary').off('click');
        $('#alter-cost .btn-primary').on('click',function(){

            if(!checkedNull('#alter-cost') || !checkedSmallChange('#alter-cost')){
                return false;
            };

            //特殊加减费用
            dataArr[importNum].f_SpecialRebatePay = parseFloat($('#alter-cost .smallChange').val());

            //实收费用
            var num1 = parseFloat(dataArr[importNum].f_ShouldPay);
            var num2 = parseFloat($('#alter-cost .smallChange').val());
            var rate = dataArr[importNum].f_PercentageReduction;
            var pay = (num1 + num2) * (1 - rate);
            dataArr[importNum].f_ActualPay = pay;

            dataArr[importNum].f_SpecialComment = $('#alter-cost .add-input').eq(2).val();

            //缴费状态
            if(pay > 0){
                dataArr[importNum].f_PayState = 1;
            }else{
                dataArr[importNum].f_PayState = 0;
            }

            _table = $('#dateTables').dataTable();
            _table.fnClearTable();
            setData();
            hiddrenId();

            $('#alter-cost').modal('hide');
        });

    });

    //查看详情按钮
    var table1 = $('#dateTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "ordering": false,
        'searching':false,
        "sScrollY": '180px',
        "bPaginate": false,
        "scrollCollapse": true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
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
                title:'表名',
                data:'f_mtNumber'

            },
            {
                title:'子账户标识',
                data:'f_ChildAccount',
                render:function(data, type, full, meta){
                    if(data == 0){
                        return '累加'
                    }else if(data == 1){
                        return '累减'
                    }else if(data ==2){
                        return '公摊'
                    }

                }

            },
            {
                title:'倍率',
                data:'f_ReadRate',
                class:'thePower'

            },
            {
                title:'起数',
                data:'f_ReadStartNum'

            },
            {
                title:'止数',
                data:'f_ReadEndNum'
            } ,
            {
                title:'用量',
                data:'f_EnergyValue',
                render:function(data, type, full, meta){

                    return data.toFixed(2);
                }
            }
        ]
    });

    $('#dateTables').on('click','.change-data',function(){

        var id = $(this).parents('tr').children().eq(1).html();

        //存放获得到的数据
        var getArr = [];



        deepCopy(dataArr,getArr);


        var unit = $(this).parents('tr').children().eq(0).html();

        var importNum = 0;


        for(var i=0; i<getArr.length; i++){
            if(id == getArr[i].fK_Unit_AboveChild){
                importNum = i;
                getDate = getArr[i];
            }
        }

        console.log(getDate);

        var showData = getDate.aboveQuotaDetails;



        if(showData.length == 0){
            myAlter(unit + '未绑定计量仪表设备');
            return false;
        }else{
            $('#show-details').modal('show');
        }
        var html = '';
        console.log(showData);
        for(var i=0; i<showData.length; i++){
            var type = getEnergyType(showData[i].f_EnergyType);
            if(i == 0){
                html += '<a href="#" hidefocus="true" class="active">'+type+'</a>'
            }else {
                html += '<a href="#" hidefocus="true" >'+type+'</a>'
            }
        }

        //上方选项卡添加数据
        $('.tabs').html(html);

        //给下方数据统计中添加数据

        //用电单价
        $('.ament-data').eq(0).find('b').html('用' + getEnergyType(showData[0].f_EnergyType) + '单价：');
        $('.ament-data').eq(0).find('span').html(showData[0].f_EnergyPrice);

        //定额量
        $('.ament-data').eq(1).find('span').html(showData[0].f_EnergyQuota.toFixed(2));

        //用能量
        $('.ament-data').eq(2).find('span').html(showData[0].f_EnergyValue.toFixed(2));

        //实际用能量
        $('#show-details').find('.add-input').eq(1).val(showData[0].f_EndResultEnergyValue.toFixed(2));

        //超额用能量
        $('.ament-data').eq(3).find('span').html(showData[0].f_AboveEnergyValue.toFixed(2));

        //应缴费用
        $('.ament-data').eq(4).find('span').html(showData[0].f_EnergyShouldPay);

        //备注
        $('#show-details').find('.remarks').val(showData[0].f_SpecialEnergyComment);

        //特殊加减用能量
        $('#show-details').find('.add-input').eq(0).val(showData[0].f_SpecialRebateEnergy);

        //重构表格
        var tableArr = showData[0].mtReturnReads;

        setTimeout(function(){
            _table = $('#dateTables1').dataTable();
            _table.fnClearTable();
            setDatas(tableArr);
            hiddrenId();
        },300);

        //控制是否跳转
        var jumpNum = 0;

        $(".tabs1 a").on('touchstart mousedown',function(e){
            //e.preventDefault();

            var that = $(this);

            setTimeout(function(){

                if(jumpNum == 1){
                    return false;
                }

                $(".tabs1 .active").removeClass('active');
                that.addClass('active');
                var num = that.index();

                $('.ament-data').eq(0).find('b').html('用' + getEnergyType(showData[num].f_EnergyType) + '单价：');
                $('.ament-data').eq(0).find('span').html(showData[num].f_EnergyPrice);

                //定额量
                $('.ament-data').eq(1).find('span').html(showData[num].f_EnergyQuota);

                //用能量
                $('.ament-data').eq(2).find('span').html(showData[num].f_EnergyValue.toFixed(2));

                //实际用能量
                $('#show-details').find('.add-input').eq(1).val(showData[num].f_EndResultEnergyValue.toFixed(2));

                $('#show-details').find('.add-input').eq(0).val(showData[num].f_SpecialRebateEnergy);

                $('#show-details').find('.remarks').val(showData[num].f_SpecialEnergyComment);

                //超额用能量
                $('.ament-data').eq(3).find('span').html(showData[num].f_AboveEnergyValue.toFixed(2));

                //应缴费用
                $('.ament-data').eq(4).find('span').html(showData[num].f_EnergyShouldPay.toFixed(2));

                //重构表格
                var tableArr = showData[num].mtReturnReads;
                _table = $('#dateTables1').dataTable();
                _table.fnClearTable();
                setDatas(tableArr);
                hiddrenId();
            },10);

        });

        $(".tabs1 a").click(function(e){
            //e.preventDefault();
        });

        //修改特殊微调用能量时

        $('.smallEnergy').off('blur');
        $('.smallEnergy').on('blur',function(){
            var theNum = $('.active').index();
            //特殊加减用能量
            var smallNum = parseFloat($(this).val());

            if(isNaN(smallNum) && smallNum != ''){
                jumpNum = 1;
                myAlter('特殊加减用能量必须为数字');
                getFocus1($(this));
                return false;
            }

            //实际用能量
            var bigNum = parseFloat($('.actualEnergy').val());
            //用能量
            var num = parseFloat($('#show-details .ament-data').eq(2).find('span').html());

            if(smallNum + num < 0){
                jumpNum = 1;
                myAlter('当前特殊加减用能量输入错误，请重新输入');
                getFocus1($(this));
                return false;
            }
        //
            bigNum = smallNum + num;

            $('.actualEnergy').val(bigNum);
            //定额量
            var quota =  parseFloat($('#show-details .ament-data').eq(1).find('span').html());

            $('#show-details .ament-data').eq(3).find('span').html(bigNum - quota);

            //单价
            var price = parseFloat($('#show-details .ament-data').eq(0).find('span').html());

            $('#show-details .ament-data').eq(4).find('span').html((bigNum - quota) * price);

            showData[theNum].f_SpecialRebateEnergy = smallNum;

            showData[theNum].f_EndResultEnergyValue = bigNum;

            showData[theNum].f_AboveEnergyValue = bigNum - quota;

            showData[theNum].f_EnergyShouldPay = (bigNum - quota) * price;


            jumpNum = 0;

        });

        $('.remarks').off('blur');
        $('.remarks').on('blur',function(){
            var theNum0 = $('.active').index();
            console.log($(this).val());

            showData[theNum0].f_SpecialEnergyComment = $(this).val();
        });

        //提交更改到内存中
        $('#show-details .btn-primary').off('click');

        $('#show-details .btn-primary').on('click',function(){

            dataArr[importNum].aboveQuotaDetails = showData;

            var pay = 0;
            for(var i=0; i<showData.length; i++){
                pay += showData[i].f_EnergyShouldPay;
            }
            dataArr[importNum].f_ShouldPay = pay;
            //特殊加减费用
            var num1 = parseFloat(dataArr[importNum].f_SpecialRebatePay);

            var num2 = pay;

            var rate = dataArr[importNum].f_PercentageReduction;
            var realPay = (num1 + num2) * (1 - rate);
            dataArr[importNum].f_ActualPay = realPay;


            //缴费状态
            if(realPay > 0){
                dataArr[importNum].f_PayState = 1;
            }else{
                dataArr[importNum].f_PayState = 0;
            }

            _table = $('#dateTables').dataTable();
            _table.fnClearTable();
            setData();
            hiddrenId();


            $('#show-details').modal('hide');
        });


    });

    //临时生成超额用能列表

    $('.condition-query .top-btn2').on('click',function(){

        console.log(isWrong);

        if(dataArr.length == 0){
            myAlter('当前无用能信息，无法生成 !');
            return false;
        }

        if(isWrong == 1){
           $('#theHint'  ).modal('show');
            $('#theHint p b').html('二级单位用能信息表生成过程中存在错误，是否继续生成临时超额用能列表?');


        }else{
            //打开模态框
            $('#product-list').modal('show');

            $('#product-list .add-input').eq(0).val(dataArr[0].f_AccountST.split(' ')[0]);

            $('#product-list .add-input').eq(1).val(dataArr[0].f_AccountET.split(' ')[0]);
        }


    });

    $('#theHint .btn-primary').on('click',function(){
        $('#product-list').modal('show');

        $('#product-list .add-input').eq(0).val(dataArr[0].f_AccountST.split(' ')[0]);

        $('#product-list .add-input').eq(1).val(dataArr[0].f_AccountET.split(' ')[0]);
    });

    $('#product-list .btn-primary').on('click',function(){

            var txt = $('#product-list .add-input').eq(2).val();
            if(txt == ''){
                myAlter('请填写结算名称');
                getFocus1(('#product-list .add-input').eq(2));
                return false;
            }

            $('#sure-product').modal('show');
    });

    $('#sure-product .btn-primary').on('click',function(){

        //进行提交到后台的操作
        var txt = $('#product-list .add-input').eq(2).val();
        var startDate = $('#product-list .add-input').eq(0).val();
        var endDate = $('#product-list .add-input').eq(1).val();
        var theState = 1;

        console.log(dataArr[0]);
        for(var i=0; i<dataArr.length; i++){
            var state = dataArr[i].f_PayState;
            if(state == 1 || state == 2){
                theState = 0;
                break;
            }
        }

        $.ajax({
            type: 'post',
            url: IP + "/AboveQuota/PostUnitAboveQuota",
            async: false,
            timeout: theTimes,
            data:{
                "pK_AboveQuotaMain": 0,
                "f_AccountName": txt,
                "f_AccountST": startDate,
                "f_AccountET": endDate,
                "f_AccountUserID": userName,
                "f_IsPayFinish": theState,
                "f_AccountWay": accountWay,
                "f_IsFinanceFlow": 0,
                "aboveQuotaChilds": dataArr,
                "userID": userName
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                $('#sure-product').modal('hide');
                $('#product-list').modal('hide');

                console.log(data);
                if(data.validateNumber == 1){
                    myAlter('参数错误，请联系管理员')
                    return false;
                };
                if(data.validateNumber == 99){
                    myAlter('成功生成超额用能列表')
                    return false;
                };
                if(data.validateNumber == 3){
                    myAlter('执行失败');
                    return false;
                };
                if(data.validateNumber == 5){
                    var html = '';
                    for(var i=0; i<data.f_mtNumberInfos.length; i++){
                        if(i == data.f_mtNumberInfos.length-1){
                            html +='<span style="font-weight: 400">'+data.f_mtNumberInfos[i].key + ' : ' +data.f_mtNumberInfos[i].valueStr + '。</span>'
                        }else{
                            html += '<span style="font-weight: 400">'+data.f_mtNumberInfos[i].key + ' : ' +data.f_mtNumberInfos[i].valueStr + '，</span><br />'
                        }

                    }
                    myAlter(html);
                    return false;

                }


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                $('#sure-product').modal('hide');
                $('#product-list').modal('hide');
                console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    myAlter("超时");

                }else{
                    myAlter("请求失败！");
                }

            }
        });

    })

    //查看错误信息时
    $('.openWrong').on('click',function(){
        myAlter(theHint);
    });

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

//存放错误信息
var theHint;

//表示是否存在问题
var isWrong;

//存放定额结算方式
var accountWay;

//获取定额结算方式
function getAccountWay(){


    $.ajax({
        type: 'get',
        url: IP + "/AboveQuota/GetQuotaAccountWay",
        async: false,
        timeout: theTimes,
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);
            accountWay = data;

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
};

getAccountWay();

//选择日期插件
$('.chooseDate').datepicker(
    {
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd'
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
        };
        if( $(dom).find('.input-label').eq(i).next().find('textarea').val() == ''){
            var txt = $(dom).find('.input-label').eq(i).next().find('textarea').parent().prev().html().split('：')[0];

            console.log(txt);
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.input-label').eq(i).next().find('textarea'));
            return false;
        };
    }
    return true;
}

//判断加减微调值是否合理
function checkedSmallChange(dom){

    var num1 = parseFloat($(dom).find('.shouldPay').val());

    var num2 = parseFloat($(dom).find('.smallChange').val());

    if(num1 + num2 < 0){
        myAlter('加减费用输入不合理，请重新输入');
        getFocus1($(dom).find('.smallChange'));
        return false;
    }

    return true;

}