/**
 * Created by admin on 2017/4/24.
 */

$(document).ready(function(){
    $('input').attr('maxlength','50');
    $('.add-comment').attr('maxlength','200');

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

    alarmHistory();

    //初始化表格

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
                title:'结算名称',
                data:'f_AccountName'

            },
            {
                title:'本行ID',
                data:'pK_AboveQuotaMain',
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
                title:'定额结算方式',
                data:'f_AccountWay',
                render:function(data, type, row, meta){
                    if(data == 0){
                        return '月'
                    }else if(data == 1){
                        return '年'
                    }else if(data == 2){
                        return '日'
                    }
                }

            },
            {
                title:'用能结算生成日期',
                data:'f_AccountCreateDT'


            },
            {
                title:'经办人',
                data:'f_AccountUserID',
                render:function(data, type, row, meta){

                    return data;
                }

            },
            {
                title:'是否缴费完结',
                data:'f_IsPayFinish',
                render:function(data, type, row, meta){
                    if(data == 0){
                        return '<span ><b class="pay-not0" ></b><font>未完结</font></span>'
                    }else if(data == 1){
                        return '<span ><b class="pay-not1" ></b><font>已完结</font></span>'
                    }
                }

            },
            {
                title:'结算调整状态',
                data:'f_IsFinanceFlow',
                render:function(data, type, row, meta){
                    if(data == 0){
                        return '结算可调整'
                    }else if(data == 1){
                        return '结算调整完毕'
                    }
                }

            },
            {
                title:'结算调整',
                "data":'f_IsFinanceFlow',
                render:function(data, type, row, meta){

                    return "<button class='top-btn change-quote'>查看详情</button>"
                }
            },
            {
                title:'财务登记',
                "data":'f_IsFinanceFlow',
                render:function(data, type, row, meta){
                    if(data == 0){
                        return '无'
                    }else if(data == 1){
                        return "<button class='top-btn change-data'>查看详情</button>"
                    }

                }
            }

        ]
    });
    _table = $('#dateTables').dataTable();
    //给表格添加后台获取到的数据
    setData();
    hiddrenId();

    //结算调整功能
    var leftArr;

    //是否结算调整完毕
    var isReadyNum = 0;

    var table1 = $('#dateTables1').DataTable({
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
                    }else if(data == 2){
                        return '<span ><b class="pay-not1" ></b><font>未缴完</font></span>'
                    }else if(data ==3){
                        return '<span ><b class="pay-not2" ></b><font>已缴完</font></span>'
                    }
                }

            },
            {
                title:'修改加减费用',
                "data": null,
                render:function(data, type, row, meta){
                  if(isReadyNum == 1){
                      return '无'
                  }else{
                      return "<button class='top-btn create-data' data-toggle='modal' data-target='#alter-cost'>修改</button>"
                  }
                }
            },
            {
                title:'查看详情',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn check-data'>查看</button>"
            },
            {
                title:'超额用能通知单',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn change-data'>生成</button>"
            }

        ]
    });

    var table3 = $('#dateTables3').DataTable({
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

    $('#dateTables').on('click','.change-quote',function(){

        $('#theLoading').modal('show');

        $('#change-quote').modal('show');

        isReadyNum = 0;
        $('#change-quote .btn-primary').css({
            display:'inline-block'
        });
        $('#show-details .smallEnergy').removeAttr('disabled');
        $('#show-details .smallEnergy').parent().css({
            background:'white'
        })
        $('#show-details textarea').removeAttr('disabled');
        $('#show-details textarea').parent().css({
            background:'white'
        })


        var postID = $(this).parents('tr').find('td').eq(1).html();

        var head = $(this).parents('tr').find('td').eq(0).html();

        var isReady = $(this).parents('tr').find('td').eq(7).html();

        if(isReady == '结算调整完毕'){

            isReadyNum = 1;

            $('#change-quote .btn-primary').css({
                display:'none'
            });
            $('#show-details .smallEnergy').attr('disabled','disabled');
            $('#show-details .smallEnergy').parent().css({
                background:'rgb(235, 235, 228)'
            })
            $('#show-details textarea').attr('disabled','disabled');
            $('#show-details textarea').parent().css({
                background:'rgb(235, 235, 228)'
            })

        }

        $('#change-quote .add-title').html(head +' 超额用能调整');

        $.ajax({
            type: 'get',
            url: IP + "/AboveQuota/GetAboveQuotaChildByMainID",
            async: false,
            timeout: theTimes,
            data:{
                aboveQuotaMain:postID,
                unitName : '',
                unitVirtualID : -1
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                leftArr = [];

                var arr0 = [];
                for(var i=0; i<data.length; i++){
                    arr0.push(data[i]);
                }

                deepCopy(arr0,leftArr);



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

        setTimeout(function(){
            _table = $('#dateTables1').dataTable();
            _table.fnClearTable();
            setDatas(leftArr);
            hiddrenId();
        },280);

        //搜索功能

        $('.top-refer').off('click');

        $('.top-refer').on('click',function(){

            var txt = $('#change-quote .condition-query').find('input').val();

            $.ajax({
                type: 'get',
                url: IP + "/AboveQuota/GetAboveQuotaChildByMainID",
                async: false,
                timeout: theTimes,
                data:{
                    aboveQuotaMain:postID,
                    unitName : txt,
                    unitVirtualID : -1
                },
                beforeSend: function () {

                },

                complete: function () {

                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    console.log(data);
                    leftArr = [];

                    var arr0 = [];
                    for(var i=0; i<data.length; i++){
                        arr0.push(data[i]);
                    }

                    deepCopy(arr0,leftArr);

                    _table = $('#dateTables1').dataTable();
                    _table.fnClearTable();
                    setDatas(leftArr);
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



        $('#dateTables1').off('click');

        //结算调整弹窗中，查看详情

        $('#dateTables1').on('click','.check-data',function(){

            //本行ID
            var getID = $(this).parents('tr').children().eq(2).html();

            var id = $(this).parents('tr').children().eq(1).html();

            //存放获得到的数据
            var getArr = [];



            deepCopy(leftArr,getArr);


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
            $('.ament-data').eq(4).find('span').html(showData[0].f_EnergyShouldPay.toFixed(2));

            //备注
            $('#show-details').find('.remarks').val(showData[0].f_SpecialEnergyComment);

            //特殊加减用能量
            $('#show-details').find('.add-input').eq(0).val(showData[0].f_SpecialRebateEnergy.toFixed(2));

            //重构表格
            var tableArr = showData[0].mtReturnReads;

            setTimeout(function(){
                _table = $('#dateTables3').dataTable();
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
                    $('.ament-data').eq(2).find('span').html(showData[num].f_EnergyValue);

                    //实际用能量
                    $('#show-details').find('.add-input').eq(1).val(showData[num].f_EndResultEnergyValue);

                    $('#show-details').find('.add-input').eq(0).val(showData[num].f_SpecialRebateEnergy);

                    $('#show-details').find('.remarks').val(showData[num].f_SpecialEnergyComment);

                    //超额用能量
                    $('.ament-data').eq(3).find('span').html(showData[num].f_AboveEnergyValue);

                    //应缴费用
                    $('.ament-data').eq(4).find('span').html(showData[num].f_EnergyShouldPay);

                    //重构表格
                    var tableArr = showData[num].mtReturnReads;
                    console.log(tableArr);
                    _table = $('#dateTables3').dataTable();
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

                leftArr[importNum].aboveQuotaDetails = showData;

                console.log(showData,getID);

                $.ajax({
                    type: 'post',
                    url: IP + "/AboveQuota/PostEditSpecialRebateEnergy",
                    async: false,
                    timeout: theTimes,
                    data:{
                        pK_AboveQuotaChild: getID,
                        aboveQuotaDetails:showData,
                        userID : userName
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
                        if(data.validateNumber == 5){
                            var html = '';
                            for(var i=0; i<data.aqDetailInfos.length; i++){
                                if(i == data.aqDetailInfos.length-1){
                                    html +='<span style="font-weight: 400">'+data.aqDetailInfos[i].key + ' : ' +data.aqDetailInfos[i].valueStr + '。</span>'
                                }else{
                                    html += '<span style="font-weight: 400">'+data.aqDetailInfos[i].key + ' : ' +data.aqDetailInfos[i].valueStr + '，</span><br />'
                                }

                            }
                            myAlter(html);
                        }

                        $('#show-details').modal('hide');
                        if(data.validateNumber == 99){
                            myAlter('修改成功');
                        }


                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $('#theLoading').modal('hide');
                        $('#show-details').modal('hide');
                        console.log(textStatus);

                        if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                            ajaxTimeoutTest.abort();
                            myAlter("超时");
                        }
                        myAlter("请求失败！");
                    }
                });

                $.ajax({
                    type: 'get',
                    url: IP + "/AboveQuota/GetAboveQuotaChildByMainID",
                    async: false,
                    timeout: theTimes,
                    data:{
                        aboveQuotaMain:postID,
                        unitName : '',
                        unitVirtualID : -1
                    },
                    beforeSend: function () {
                        $('#theLoading').modal('show');
                    },

                    complete: function () {

                    },
                    success: function (data) {
                        $('#theLoading').modal('hide');
                        leftArr = [];

                        var arr0 = [];
                        for(var i=0; i<data.length; i++){
                            arr0.push(data[i]);
                        }

                        deepCopy(arr0,leftArr);

                        _table = $('#dateTables1').dataTable();
                        _table.fnClearTable();
                        setDatas(leftArr);
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


        });

        //结算调整弹窗中 修改加减费用
        $('#dateTables1').on('click','.create-data',function(){

            var id = $(this).parents('tr').children().eq(1).html();

            var importID = $(this).parents('tr').children().eq(2).html();

            var getData = {};
            //找到是dataArr中的第几项
            var importNum = 0;

            for(var i=0; i<leftArr.length; i++){
                if(id == leftArr[i].fK_Unit_AboveChild){
                    importNum = i;
                    getData = leftArr[i];
                }
            }
            console.log(getData);

            $('#alter-cost .add-input').eq(0).val(getData.f_ShouldPay);
            $('#alter-cost .add-input').eq(1).val(getData.f_SpecialRebatePay);


            $('#alter-cost .btn-primary').off('click');
            $('#alter-cost .btn-primary').on('click',function(){

                if(!checkedNull('#alter-cost') || !checkedSmallChange('#alter-cost')){
                    return false;
                };

               var theValue = parseFloat($('#alter-cost .smallChange').val());

                var comments = $('#alter-cost .add-input').val();

                $.ajax({
                    type: 'post',
                    url: IP + "/AboveQuota/PostEditSpecialRebatePay",
                    async: false,
                    timeout: theTimes,
                    contentType: 'application/json',
                    data:JSON.stringify({
                        "aboveQuotaChildID":importID,
                        "specialRebatePay" : theValue,
                        "specialComment": comments,
                        "userID" : userName}),
                    beforeSend: function () {

                    },

                    complete: function () {

                    },
                    success: function (data) {
                        $('#theLoading').modal('hide');
                        console.log(data);


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

                $.ajax({
                    type: 'get',
                    url: IP + "/AboveQuota/GetAboveQuotaChildByMainID",
                    async: false,
                    timeout: theTimes,
                    data:{
                        aboveQuotaMain:postID,
                        unitName : '',
                        unitVirtualID : -1
                    },
                    beforeSend: function () {

                    },

                    complete: function () {

                    },
                    success: function (data) {
                        $('#theLoading').modal('hide');
                        leftArr = [];

                        var arr0 = [];
                        for(var i=0; i<data.length; i++){
                            arr0.push(data[i]);
                        }

                        deepCopy(arr0,leftArr);

                        console.log(leftArr);

                        _table = $('#dateTables1').dataTable();
                        _table.fnClearTable();
                        setDatas(leftArr);
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



                $('#alter-cost').modal('hide');
            });

        });

        //结算调整弹窗中 生成超额用能通知单
        $('#dateTables1').on('click','.change-data',function(){

            //本行ID
            var getID = $(this).parents('tr').children().eq(1).html();

            $.ajax({
                type: 'get',
                url: IP + "/AboveQuota/GetAboveQuotaUnitEnergyReport",
                async: false,
                timeout: theTimes,
                data:{
                    aboveQuotaMain : postID,
                    unitID :getID
                },
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },

                complete: function () {

                },
                success: function (xml,textStatus, xhr) {
                    $('#theLoading').modal('hide');
                     var status =  xhr.status;
                    console.log(status);
                    if(status == 204){
                        myAlter('无数据，生成失败');
                        return false;
                    };

                    window.open(IP + "/AboveQuota/GetAboveQuotaUnitEnergyReport?aboveQuotaMain="+ postID+"&unitID="+getID+"");

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

        //结算调整弹窗中 生成全部超额用能通知单
        $('#change-quote .export-data').off('click');
        $('#change-quote .export-data').on('click',function(){

            if(leftArr.length == 0){
                myAlter('当前无数据，无法导出');
                return false;
            }
            $.ajax({
                type: 'get',
                url: IP + "/AboveQuota/GetAboveQuotaUnitEnergyReport",
                async: false,
                timeout: theTimes,
                data:{
                    aboveQuotaMain : postID,
                    unitID :-1
                },
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },

                complete: function () {

                },
                success: function (xml,textStatus, xhr) {
                    $('#theLoading').modal('hide');
                    var status =  xhr.status;
                    console.log(status);
                    if(status == 204){
                        myAlter('无数据，生成失败');
                        return false;
                    };

                    window.open(IP + "/AboveQuota/GetAboveQuotaUnitEnergyReport?aboveQuotaMain="+ postID+"&unitID=-1");

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

        //导出超额用能收费单
        $('#change-quote .export-cost').off('click');
        $('#change-quote .export-cost').on('click',function(){

            if(leftArr.length == 0){
                myAlter('当前无数据，无法导出');
                return false;
            }

            $.ajax({
                type: 'get',
                url: IP + "/AboveQuota/GetAboveQuotaReportByMainID",
                async: false,
                timeout: theTimes,
                data:{
                    aboveQuotaMain : postID,
                    unitName :''
                },
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },

                complete: function () {

                },
                success: function (xml,textStatus, xhr) {
                    $('#theLoading').modal('hide');
                    var status =  xhr.status;
                    console.log(status);
                    if(status == 204){
                        myAlter('无数据，生成失败');
                        return false;
                    };

                    window.open(IP + "/AboveQuota/GetAboveQuotaReportByMainID?aboveQuotaMain="+ postID+"&unitName=");

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


        //结算调整完毕按钮

        $('#change-quote .btn-primary').off('click');
        $('#change-quote .btn-primary').on('click',function(){

            $.ajax({
                type: 'post',
                url: IP + "/AboveQuota/PostIntoFinanceFlow",
                async: false,
                timeout: theTimes,
                contentType: 'application/json',
                data: JSON.stringify({
                    aboveQuotaMain:postID,
                    userID : userName
                }),
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
                    $('#change-quote').modal('hide');
                    if(data.validateNumber == 5){
                        var html = '';
                        for(var i=0; i<data.aqDetailInfos.length; i++){
                            if(i == data.aqDetailInfos.length-1){
                                html +='<span style="font-weight: 400">'+data.aqDetailInfos[i].key + ' : ' +data.aqDetailInfos[i].valueStr + '。</span>'
                            }else{
                                html += '<span style="font-weight: 400">'+data.aqDetailInfos[i].key + ' : ' +data.aqDetailInfos[i].valueStr + '，</span><br />'
                            }

                        }
                        myAlter(html);
                    }
                    _table = $('#dateTables').dataTable();
                    ajaxSuccess();

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

        })
    });


    //财务登记功能
    var rightArr;

    var rightID;

    var table2 = $('#dateTables2').DataTable({
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
                title:'票据号',
                data:'f_Bill'

            },
            {
                title:'特殊费用备注',
                data:'f_SpecialComment'

            },
            {
                title:'付费状态',
                data:'f_PayState',
                render:function(data, type, row, meta){
                    if(data == 0){
                        return '<span ><b class="pay-not0" ></b><font>未超额</font></span>'
                    }else if(data == 1){
                        return '<span ><b class="pay-not1" ></b><font>未缴费</font></span>'
                    }else if(data == 2){
                       return '<span ><b class="pay-not1" ></b><font>未缴完</font></span>'
                    }else if(data ==3){
                        return '<span ><b class="pay-not2" ></b><font>已缴完</font></span>'
                    }
                }

            },
            {
                title:'转账登记',
                data:'f_PayState',
                render:function(data, type, row, meta){
                    if(data == 0){
                        return '无'
                    }else if(data == 3){
                        return "<button class='top-btn examine-it'>查看</button>"
                    }else{
                        return "<button class='top-btn check-in'>登记</button>"
                    }
                }
            },
            {
                title:'票据操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn add-bill'>添加票据</button>"
            },
            {
                title:'查看详情',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn check-data'>查看</button>"
            }

        ]
    });

    var table4 = $('#dateTables4').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "ordering": false,
        'searching':false,
        "sScrollY": '260px',
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
                title:'已收金额',
                data:'f_PayAmount'

            },
            {
                title:'本行ID',
                data:'pK_AQPayDetails',
                class:'theHidden'

            },
            {
                title:'付费状态',
                data:'f_PayDetailsState',
                render:function(data, type, row, meta){
                  if(data == 0){
                      return '自转账'
                  }else if(data == 1){
                      return '财务扣款'
                  }
                }

            },
            {
                title:'缴费日期',
                data:'f_PayDT',
                render:function(data, type, row, meta){
                    return data.split(' ')[0]
                }

            },
            {
                title:'登记人',
                data:'f_PayUserID'

            },
            {
                title:'备注',
                data:'f_PayComment',
                class:'adjust-comment',
                render:function(data, type, row, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            } ,
            {
                title:'修改',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn change' data-toggle='modal' data-target=''>修改</button>"
            },
            {
                title:'删除',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn delete' data-toggle='modal' data-target=''>删除</button>"
            }

        ]
    });

    var table5 = $('#dateTables5').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "ordering": false,
        'searching':false,
        "sScrollY": '240px',
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
                title:'已收金额',
                data:'f_PayAmount'

            },
            {
                title:'本行ID',
                data:'pK_AQPayDetails',
                class:'theHidden'

            },
            {
                title:'付费状态',
                data:'f_PayDetailsState',
                render:function(data, type, row, meta){
                    if(data == 0){
                        return '自转账'
                    }else if(data == 1){
                        return '财务扣款'
                    }
                }

            },
            {
                title:'缴费日期',
                data:'f_PayDT'


            },
            {
                title:'登记人',
                data:'f_PayUserID'

            },
            {
                title:'备注',
                data:'f_PayComment',
                class:'adjust-comment',
                render:function(data, type, row, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            }
        ]
    });

    var table6 = $('#dateTables6').DataTable({
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
                data:'f_EnergyValue'
            }

        ]
    });

    $('#dateTables').on('click','.change-data',function(){

        $('#account-register').modal('show');

        var id = $(this).parents('tr').find('td').eq(1).html();

        rightID = id;

        var head = $(this).parents('tr').find('td').eq(2).html();

        $('#account-register .add-title').html(head +' 超额用能二级单位列表');

        $.ajax({
            type: 'get',
            url: IP + "/AboveQuota/GetAboveQuotaChildByFinance",
            async: false,
            timeout: theTimes,
            data:{
                aboveQuotaMain:id,
                unitName : '',
                payState : -1
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                rightArr = [];

                var arr0 = [];
                for(var i=0; i<data.length; i++){
                    arr0.push(data[i]);
                }

                deepCopy(arr0,rightArr);

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

        setTimeout(function(){
            _table = $('#dateTables2').dataTable();
            _table.fnClearTable();
            setDatas(rightArr);
            hiddrenId();
        },280);

        //查询功能
        $('#account-register .top-refer1').off('click');
        $('#account-register .top-refer1').on('click',function(){

            var txt = $('#account-register .condition-query').find('input').val();
            var payNum = $('#account-register .condition-query').find('select').val();

            $.ajax({
                type: 'get',
                url: IP + "/AboveQuota/GetAboveQuotaChildByFinance",
                async: false,
                timeout: theTimes,
                data:{
                    aboveQuotaMain:id,
                    unitName : txt,
                    payState :  payNum
                },
                beforeSend: function () {

                },

                complete: function () {

                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    console.log(data);
                    rightArr = [];

                    var arr0 = [];
                    for(var i=0; i<data.length; i++){
                        arr0.push(data[i]);
                    }

                    deepCopy(arr0,rightArr);

                    _table = $('#dateTables2').dataTable();
                    _table.fnClearTable();
                    setDatas(rightArr);
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

        //导出超额用能收费单
        $('#account-register .top-export').off('click')
        $('#account-register .top-export').on('click',function(){

            $.ajax({
                type: 'get',
                url: IP + "/AboveQuota/GetAboveQuotaReportByFinance",
                async: false,
                timeout: theTimes,
                data:{
                    aboveQuotaMain : id,
                    unitName :'',
                    payState : -1
                },
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },

                complete: function () {

                },
                success: function (xml,textStatus, xhr) {
                    $('#theLoading').modal('hide');
                    var status =  xhr.status;
                    console.log(status);
                    if(status == 204){
                        myAlter('无数据，生成失败');
                        return false;
                    };

                    window.open(IP + "/AboveQuota/GetAboveQuotaReportByMainID?aboveQuotaMain="+ id+"&unitName=");

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
        })

    });

    //票据操作功能
    $('#dateTables2').on('click','.add-bill',function(){

        $('#bill-import').modal('show');

        var unitName = $(this).parents('tr').find('td').eq(0).html();
        var id = $(this).parents('tr').find('td').eq(2).html();

        var bill = $(this).parents('tr').find('td').eq(7).html();

        $('#bill-import .add-input').eq(0).val(unitName);

        $('#bill-import .add-input').eq(1).val(bill);

        $('#bill-import .btn-primary').off('click');

        $('#bill-import .btn-primary').on('click',function(){

            if(!checkedNull('#bill-import')){
                return false;
            };

            var txt = $('#bill-import .add-input').eq(1).val();

            $.ajax({
                type: 'post',
                url: IP + "/AboveQuota/PostEditAboveQuotaBill",
                async: false,
                timeout: theTimes,
                contentType: 'application/json',
                data: JSON.stringify({
                    aboveQuotaChildID : id,
                    bill : txt,
                    userID:userName
                }),
                beforeSend: function () {

                },

                complete: function () {

                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    $('#bill-import').modal('hide');
                    console.log(data);
                    if(data == 3){
                        myAlter('执行失败');
                        return false;
                    }

                    $('#account-register .top-refer1').click();

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    $('#bill-import').modal('hide');
                    console.log(textStatus);

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter("请求失败！");
                }
            })

        });

    });

    //转账登记功能
    $('#dateTables2').on('click','.check-in',function(){

        $('#transfer-register').modal('show');

        childrenID = $(this).parents('tr').find('td').eq(2).html();

        //获取后台数据
        $.ajax({
            type: 'get',
            url: IP + "/AboveQuota/GetAQPayDetails",
            async: false,
            timeout: theTimes,
            data:{
                aboveQuotaChildID : childrenID
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                var unitName = data.aqPayDetails.f_UnitName;

                var pay = data.aqPayDetails.receivableCost;

                $('#transfer-register').find('.ament-data').eq(0).find('span').html(unitName);

                $('#transfer-register').find('.ament-data').eq(1).find('span').html(pay);

                $('#transfer-register').find('.add-input').eq(0).val('');

                $('#transfer-register').find('.add-input').eq(2).val('');

                console.log(data.aqPayDetails.payDetails);
                if(data.aqPayDetails.payDetails.length == 0){
                    thePay = [];
                }else{
                    deepCopy(data.aqPayDetails.payDetails,thePay);
                }


                setTimeout(function(){
                    _table = $('#dateTables4').dataTable();
                    _table.fnClearTable();
                    setDatas(thePay);
                    hiddrenId();
                },250);
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

        //提交更改时
        $('#transfer-register .btn-primary').off('click');
        $('#transfer-register .btn-primary').on('click',function(){

            var txt1 = $('#transfer-register').find('.ament-data').eq(0).find('span').html();

            var txt2 = parseFloat($('#transfer-register').find('.ament-data').eq(1).find('span').html());

            console.log(txt1,txt2,thePay);

            $.ajax({
                type: 'post',
                url: IP + "/AboveQuota/PostAQPayDetails",
                async: false,
                timeout: theTimes,
                data:{
                    "pK_AboveQuotaChild":childrenID,
                    "f_UnitName": txt1,
                    "receivableCost":txt2,
                    "payDetails":thePay,
                    "userID": userName
                },
                beforeSend: function () {

                },

                complete: function () {

                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    console.log(data);
                    if(data== 3){
                        myAlter('提交失败，请联系管理员');
                        return false;
                    }

                    $('#transfer-register').modal('hide');

                    $('#account-register .top-refer1').click();


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

        });

        //删除功能
        $('#dateTables4').off('click');
        $('#dateTables4').on('click','.delete',function(){

            $('#remove-cost').modal('show');
            var num = $(this).parent().parent().index();

            var pay = parseFloat($(this).parents('tr').find('td').eq(0).html());
            var cost = parseFloat($('#transfer-register .ament-data').eq(1).find('span').html());


            $('#remove-cost .btn-primary').one('click',function(){

                $('#remove-cost').modal('hide');

                $('#transfer-register .ament-data').eq(1).find('span').html(cost + pay )
                thePay.splice(num,1);
                _table = $('#dateTables4').dataTable();
                _table.dataTable().fnClearTable();
                setDatas(thePay);

            });



        });

        //修改操作

        $('#dateTables4').on('click','.change',function(){

            var cost = parseFloat($('#transfer-register').find('.ament-data').eq(1).find('span').html());

            var num = $(this).parent().parent().index();

            var pays = parseFloat($(this).parents('tr').find('td').eq(0).html());
            var state = $(this).parents('tr').find('td').eq(2).html();
            var stateID;
            if(state == '自转账'){
                stateID = 0
            }else{
                stateID = 1;
            }
            var comment = $(this).parents('tr').find('.adjust-comment').find('span').attr('title');

            $('#change-transfer').modal('show');

            console.log(pays);

            $('#change-transfer .add-input').eq(0).val(pays);



            $('#change-transfer').find('.add-input-select').children('span').html(state);
            $('#change-transfer').find('.add-input-select').children('span').attr('ids',stateID);
            $('#change-transfer .add-input').eq(2).val(comment);

            $('#change-transfer .btn-primary').off('click');
            $('#change-transfer .btn-primary').on('click',function(){

                var comment = $('#change-transfer').find('.add-input').eq(2).val();

                var stateID = $('#change-transfer').find('.add-input-select').children('span').attr('ids');

                var pay = $('#change-transfer').find('.add-input').eq(0).val();

                var date = show();

                if(pay == '' || isNaN(pay) || pay < 0 || pay == 0){
                    myAlter('收费金额必须为大于0的数字');
                    getFocus1( $('#change-transfer').find('.add-input').eq(0));
                    return false;
                }

                if(parseFloat(pay - pays) > cost ){
                    myAlter('收费金额不能大于应收费用');
                    getFocus1( $('#change-transfer').find('.add-input').eq(0));
                    return false;
                }

                $('#transfer-register').find('.ament-data').eq(1).find('span').html(cost + pays - parseFloat(pay));

                var obj = {
                    "pK_AQPayDetails": 0,
                    "fK_AboveChild_PayDetails": parseInt(childrenID),
                    "f_PayDetailsState": parseInt(stateID),
                    "f_PayAmount": parseFloat(pay),
                    "f_PayDT": date,
                    "f_PayUserID": userName,
                    "f_PayComment": comment
                };
                thePay[num] = obj;
                console.log(thePay);
                _table = $('#dateTables4').dataTable();
                _table.dataTable().fnClearTable();


                //给表格添加后台获取到的数据
                setDatas(thePay);
                hiddrenId();

                $('#change-transfer').modal('hide');

            })
        });

    });

    //转账登记中的查看按钮
    $('#dateTables2').on('click','.examine-it',function(){

        $('#transfer-check').modal('show');

        childrenID = $(this).parents('tr').find('td').eq(2).html();

        //获取后台数据
        $.ajax({
            type: 'get',
            url: IP + "/AboveQuota/GetAQPayDetails",
            async: false,
            timeout: theTimes,
            data:{
                aboveQuotaChildID : childrenID
            },
            beforeSend: function () {

            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);
                var unitName = data.aqPayDetails.f_UnitName;

                var pay = data.aqPayDetails.receivableCost;

                $('#transfer-check').find('.ament-data').eq(0).find('span').html(unitName);

                $('#transfer-check').find('.ament-data').eq(1).find('span').html(pay);

                deepCopy(data.aqPayDetails.payDetails,thePay);

                setTimeout(function(){
                    _table = $('#dateTables5').dataTable();
                    _table.fnClearTable();
                    setDatas(thePay);
                    hiddrenId();
                },250);
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

    //查看详情
    $('#dateTables2').on('click','.check-data',function(){

        //
        var id = $(this).parents('tr').find('td').eq(2).html();

        var showData = [];
        for(var i=0; i<rightArr.length; i++){
            var pkID = rightArr[i].pK_AboveQuotaChild;
            if(id == pkID){
                showData = rightArr[i].aboveQuotaDetails;
            }
        }

        if(showData.length == 0){
            myAlter(unit + '未绑定计量仪表设备');
            return false;
        }else{
            $('#show-details1').modal('show');
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
        $('.tabs2').html(html);

        //给下方数据统计中添加数据

        //用电单价
        $('#show-details1 .ament-data').eq(0).find('b').html('用' + getEnergyType(showData[0].f_EnergyType) + '单价：');
        $('#show-details1 .ament-data').eq(0).find('span').html(showData[0].f_EnergyPrice);

        //定额量
        $('#show-details1 .ament-data').eq(1).find('span').html(showData[0].f_EnergyQuota.toFixed(2));

        //用能量
        $('#show-details1 .ament-data').eq(2).find('span').html(showData[0].f_EnergyValue.toFixed(2));

        //实际用能量
        $('#show-details1').find('.add-input').eq(1).val(showData[0].f_EndResultEnergyValue.toFixed(2));

        //超额用能量
        $('#show-details1 .ament-data').eq(3).find('span').html(showData[0].f_AboveEnergyValue.toFixed(2));

        //应缴费用
        $('#show-details1 .ament-data').eq(4).find('span').html(showData[0].f_EnergyShouldPay.toFixed(2));

        //备注
        $('#show-details1').find('.remarks').val(showData[0].f_SpecialEnergyComment);

        //特殊加减用能量
        $('#show-details1').find('.add-input').eq(0).val(showData[0].f_SpecialRebateEnergy.toFixed(2));

        //重构表格
        var tableArr = showData[0].mtReturnReads;

        setTimeout(function(){
            _table = $('#dateTables6').dataTable();
            _table.fnClearTable();
            setDatas(tableArr);
            hiddrenId();
        },300);

        //控制是否跳转
        var jumpNum = 0;

        $(".tabs2 a").on('touchstart mousedown',function(e){
            //e.preventDefault();

            var that = $(this);

            setTimeout(function(){

                if(jumpNum == 1){
                    return false;
                }

                $(".tabs2 .active").removeClass('active');
                that.addClass('active');
                var num = that.index();

                $('#show-details1 .ament-data').eq(0).find('b').html('用' + getEnergyType(showData[num].f_EnergyType) + '单价：');
                $('#show-details1 .ament-data').eq(0).find('span').html(showData[num].f_EnergyPrice);

                //定额量
                $('#show-details1 .ament-data').eq(1).find('span').html(showData[num].f_EnergyQuota);

                //用能量
                $('#show-details1 .ament-data').eq(2).find('span').html(showData[num].f_EnergyValue);

                //实际用能量
                $('#show-details1').find('.add-input').eq(1).val(showData[num].f_EndResultEnergyValue);

                $('#show-details1').find('.add-input').eq(0).val(showData[num].f_SpecialRebateEnergy);

                $('#show-details1').find('.remarks').val(showData[num].f_SpecialEnergyComment);

                //超额用能量
                $('#show-details1 .ament-data').eq(3).find('span').html(showData[num].f_AboveEnergyValue);

                //应缴费用
                $('#show-details1 .ament-data').eq(4).find('span').html(showData[num].f_EnergyShouldPay);

                //重构表格
                var tableArr = showData[num].mtReturnReads;
                console.log(tableArr);
                _table = $('#dateTables6').dataTable();
                _table.fnClearTable();
                setDatas(tableArr);
                hiddrenId();
            },10);

        });

        $(".tabs2 a").click(function(e){
            //e.preventDefault();
        });

    });



});

//点击确定时触发
$(document).on('keydown',function(e){
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;

    if(code == 13){
        var dom = $('.in').attr('id');
        console.log(dom);
        if(dom == 'change-quote'){

            $('#change-quote .top-refer').click();

        }else if(dom == 'account-register'){

            $('#account-register .top-refer1').click();

        }


        return false;
    }
});

//获取后台数据
function alarmHistory(){
    dataArr=[];
    $.ajax({
        type:'get',
        url:IP + "/AboveQuota/GetAboveQuotaMains",
        async:false,
        timeout:theTimes,
        data:{
            'payFinish' : -1
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


//选择日期插件
$('.chooseDate').datepicker(
    {
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd'
    }
);


//二级单位转账登记中添加按钮
thePay = [];
var childrenID;
$('.add-row-count').on('click',function(){

    var txt1 = $(this).prev().children('.add-input').val();

    var txt2 = $(this).parent().prev().find('.add-input-select').children('span').attr('ids');

    var pay = $(this).parent().prev().prev().find('.add-input').val();

    var date = show();

    var cost = parseFloat($(this).parents('form').find('.ament-data').eq(1).find('span').html());



    console.log(txt1,txt2,pay);


    if(pay == '' || isNaN(pay) || pay < 0 || pay == 0){
        myAlter('收费金额必须为大于0的数字');
        getFocus1( $(this).parent().prev().prev().find('.add-input'));
        return false;
    }

    if(parseFloat(pay) > cost ){
        myAlter('收费金额不能大于应收费用');
        getFocus1( $(this).parent().prev().prev().find('.add-input'));
        return false;
    }

    $(this).parents('form').find('.ament-data').eq(1).find('span').html(cost - parseFloat(pay));

    var obj = {
        "pK_AQPayDetails": 0,
        "fK_AboveChild_PayDetails": parseInt(childrenID),
        "f_PayDetailsState": parseInt(txt2),
        "f_PayAmount": parseFloat(pay),
        "f_PayDT": date,
        "f_PayUserID": userName,
        "f_PayComment": txt1
    };

    _table = $('#dateTables4').dataTable();
    _table.dataTable().fnClearTable();
    thePay.push(obj);

    //给表格添加后台获取到的数据
    setDatas(thePay);
    hiddrenId();
});




//获取当前日期
function show(){
    var mydate = new Date();
    var str = "" + mydate.getFullYear() + "/";
    str += (mydate.getMonth()+1) + "/";
    str += mydate.getDate() + "";
    return str;
}

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