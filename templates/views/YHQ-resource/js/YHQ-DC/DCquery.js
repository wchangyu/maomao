$(function(){

    //重置
    $('#')

    /*---------------------------------时间插件--------------------------------------*/

    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).subtract(7,'days').format('YYYY-MM-DD');

    $('#spDT').val(st);

    $('#epDT').val(nowTime);

    _timeYMDComponentsFun11($('.abbrDT'));

    //餐厅数据
    RestaurantType();

    /*---------------------------------表格初始化------------------------------------*/

    var col = [
        {
            title:'选择',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){

                //已完成&月结&未支付的

                var str = '';

                if(full.orderZht == 60 && full.payed == 0  && full.payType == 2){

                    str = '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox" value=""></span></div>'

                }else{

                    str = ''

                }

                //str = '<div class="checker" data-id="' + full.id + '"><span><input type="checkbox" value=""></span></div>'

                return str

            }
        },
        {
            title:'订单号',
            data:'ordered'
        },
        {
            title:'订餐日期',
            data:'orderdt',
            render:function(data, type, full, meta){

                return data.split('T')[0]

            }

        },
        {
            title:'订餐人',
            data:'userName'
        },
        {
            title:'订单状态',
            data:'orderZht',
            render:function(data, type, full, meta){

                return DCStatus(data)

            }
        },
        {
            title:'三餐类型',
            data:'mmn'
        },
        {
            title:'电话',
            data:'phone'
        },
        {
            title:'操作',
            render:function(data, type, full, meta){

                var str = '<span class="option-button option-see option-in" data-attr="' + full.ordered + '">' + '详情</span>';



                if(full.orderZht == 10){

                    //确认+完成+取消+编辑+详情

                    //编辑
                    str += '<span class="option-button option-edit option-in" data-attr="' + full.ordered + '">' + '编辑</span>' +
                            //确认
                        '<span class="option-button option-confirm option-in" data-attr="' + full.ordered + '">' + '确认接单</span>' +
                            //完成
                        '<span class="option-button option-complete option-in" data-attr="' + full.ordered + '">' + '完成</span>' +
                            //取消
                        '<span class="option-button option-cancel option-in" data-attr="' + full.ordered + '">' + '取消</span>'


                }else if(full.orderZht == 30){

                    //完成 + 取消
                    //完成
                    str += '<span class="option-button option-complete option-in" data-attr="' + full.ordered + '">' + '完成</span>' +
                            //取消
                        '<span class="option-button option-cancel option-in" data-attr="' + full.ordered + '">' + '取消</span>'


                }else if(full.orderZht == 40){

                    //完成
                    str += '<span class="option-button option-complete option-in" data-attr="' + full.ordered + '">' + '完成</span>'

                }


                return str;


            }

        }

    ]

    _tableInit($('#table1'),col,'2','','','','','','',true);

    conditionSelect1();

    /*---------------------------------按钮事件------------------------------------*/

    //批量支付
    $('#batchPay').click(function(){

        //首先判断订餐人编号是否选择
        if($('#DC-personCon').val() == '' && $('#DC-personCon').attr('data-num') == undefined){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择要支付的订餐人','');

            return false;

        }

        var currentTr= $('#table1').find('.tables-hover');

        if(currentTr.length == 0){

            _moTaiKuang($('#tip-Modal'),'提示',true,true,'请选择要批量支付的订单','');

            return false;

        }

        var arr = [];

        for(var i=0;i<currentTr.length;i++){

            var obj = {};

            obj.ordered = currentTr.eq(i).children().eq(1).html();

            arr.push(obj)

        }

        var prm = {

            //订餐人编号
            userNum:$('#DC-personCon').attr('data-num'),

            //订单集合
            ordermodels:arr

        }

        _mainAjaxFunCompleteNew('post','YHQDC/orderlistbatchMoney',prm,$('.content-top'),function(result){

            if(result.code == 99){



            }

            _moTaiKuang($('#tip-Modal'),'提示',true,true,result.message,'');

        })


    })

    //主表格
    $('#table1 tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })

    //条件查询的订餐人编号删除
    $('#removeDep').click(function(){

        $(this).prev().val('');

        $(this).prev().removeAttr('data-num');

    })

    //重置
    $('#resetBtn1').click(function(){

        //餐厅
        $('#DC-restaurant-con').val(0);

        //开始事件
        $('#spDT').val(st);

        //结束事件
        $('#epDT').val(nowTime);

        //订单号
        $('#DC-numCon').val('');

        //是否支付
        $('#isPay').val(-1);

        $('#DC-personCon').val('');

        $('#DC-personCon').removeAttr('data-num');

    })

    //查询
    $('#selectBtn1').click(function(){

        conditionSelect1();

    })

    /*---------------------------------其他方法--------------------------------------*/

    //餐厅
    function RestaurantType(){

        var prm = {

            departnum:_userBM

        }

        $.ajax({

            type:'post',

            url:_urls + 'YHQDC/ReturndepartDiningRooms',

            data:prm,

            async:false,

            timeout:_theTimes,

            success:function(result){

                var str1 = '<option value="0">全部</option>';

                if(result.code == 99){

                    for(var i=0;i<result.data.length;i++){

                        str1 += '<option value="' + result.data[i].id + '">' + result.data[i].diningroom + '</option>';

                    }

                }

                $('#DC-restaurant-con').append(str1);


            },

            error: function(XMLHttpRequest, textStatus, errorThrown){

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时');

                }else{

                    console.log('请求失败');

                }

            }

        })


    }

    //条件查询
    function conditionSelect1(){

        var prm = {

            // 餐厅id
            dinningroomid:$('#DC-restaurant-con').val(),
            //开始时间
            begintime:$('#spDT').val(),
            //结束时间
            endtime:moment($('#epDT').val()).add(1,'d').format('YYYY-MM-DD'),
            //订单号
            ordered:$('#DC-numCon').val(),
            //订餐人编号
            userNum:$('#DC-personCon').attr('data-num'),
            //部门
            departnum:_userBM,

            payed:$('#isPay').val()

        }

        _mainAjaxFunCompleteNew('post','YHQDC/Returndetailorderlist',prm,$('.content-top'),function(result){

            var arr = []

            if(result.code == 99){

                arr = result.data;

            }

            _datasTable($('#table1'),arr);

        })


    }

})

var _DCquery = true;