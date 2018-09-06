var Rate=function () {

    //chartView
    var mycv;

    window.onresize = function (ev) {
        if(mycv){
            mycv.resize();
        }
    }

    var addZeroToSingleNumber=function (num) {
        var curnum = "";
        if (num < 10) {
            curnum = "0" + num;
        }
        else {
            curnum += num;
        }
        return curnum;
    }

    //初始化时间控件
    var initdatetimepicker=function () {
        //var nowDt = new Date();
        //var year = nowDt.getFullYear();
        //var month = parseInt(nowDt.getMonth())+1;
        //var day = nowDt.getDate();
        //var dtstr = year + "-" + addZeroToSingleNumber(month) + "-" + addZeroToSingleNumber(day);
        var mt= moment(sessionStorage.sysDt);
        var nowDt=mt.format('YYYY-MM-DD');
        var startDt = mt.subtract(7, 'days').format('YYYY-MM-DD');
        $("#spDT").val(startDt);
        $("#epDT").val(nowDt);
        $('.rateDT').datetimepicker({
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            weekStart: true,
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startView: 2,
            minView: 2,
            minuteStep: 10,
            forceParse: 0,
            pickerPosition: "bottom-left"
        });
    }

    //获取负荷数据
    var getRateDs = function () {

        $('.noDataTip').remove();

        jQuery('#rateBusy').showLoading();
        mycv = echarts.init(document.getElementById('rateMain'));
        var sp = $('#spDT').val();
        var ep = $('#epDT').val();
        var url = sessionStorage.apiUrlPrefix + "RateEER/GetRateEERs";
        $.post(url,{
            pId:sessionStorage.PointerID,
            sp:sp,
            ep:ep,
            misc:sessionStorage.misc
        },function (res) {

            if(res.code===0){
                var miscstr
                    //= 'KW/KW';

                var maxeerVa = '';

                if(sessionStorage.misc == 1){

                    miscstr = 'KW/KW';

                    maxeerVa = 9;

                }else if(sessionStorage.misc == 2){

                    miscstr = 'KW/RT'

                    maxeerVa = 3;

                }

                var maxRateVa = res.rateMaxVa;
                var ys = [];
                for (var i = 0; i < res.ys.length; i++) {
                    var object = {};
                    if (i == 0) {
                        object.name = '负荷比例(%)';
                        object.type = 'bar';
                    }
                    else {
                        object.name = '冷站能效(' + miscstr + ')';
                        object.type = 'line';
                        object.yAxisIndex = 1;
                    }
                    object.data = [];
                    for (var j = 0; j < res.ys[i].length; j++) {
                        var obj = {};
                        obj.itemStyle = {};
                        obj.itemStyle.normal = {};
                        if (i == 0) {
                            obj.itemStyle.normal.color = "#007acc";
                        }
                        else {
                            obj.itemStyle.normal.color = "#c23531";
                        }
                        if (res.ys[i][j] === 0) {
                            obj.value = '';
                        }
                        else {
                            obj.value = res.ys[i][j];
                        }
                        object.data.push(obj);
                    }
                    ys.push(object);
                }
                var xs = [];
                var xsCNT = res.xs.length;
                for (var j = 0; j < xsCNT; j++) {
                    xs.push(res.xs[j]);
                }
                option = {
                    color: ['#007acc', '#c23531'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            //dataZoom: {
                            //    yAxisIndex: 'none'
                            //},
                            dataView: {

                                readOnly: true,

                                optionToContent: function(opt) {

                                    //thead
                                    var table = '<table class="table table-striped table-advance table-hover  dataTable no-footer">';

                                    var tables = '</table>';

                                    var thead = '<thead>';

                                    var theads = '</thead>';

                                    var tbody = '<tbody>';

                                    var tbodys = '</tbody>';

                                    //th
                                    var thStr = '<tr><th>时间</th>';

                                    for(var i=0;i<opt.series.length;i++){

                                        thStr += '<th>';

                                        thStr += opt.series[i].name;

                                        thStr += '</th>'

                                    }

                                    thStr += '</tr>';

                                    //td
                                    var tdStr = '';

                                    for(var i=0;i<opt.xAxis[0].data.length;i++){

                                        tdStr += '<tr>';

                                        //时间
                                        tdStr += '<td>';

                                        tdStr += opt.xAxis[0].data[i];

                                        tdStr += '</td>';

                                        for(var j=0;j<opt.series.length;j++){

                                            tdStr += '<td>';

                                            tdStr += opt.series[j].data[i].value;

                                            tdStr += '</td>';

                                        }

                                        tdStr += '</tr>';


                                    }

                                    return table + thead + thStr + theads + tbody + tdStr + tbodys + tables;



                                }

                            },
                            magicType: { type: ['line', 'bar'] },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    legend: {
                        data: ['负荷比例(%)', '冷站能效(' + miscstr + ')']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: xs
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '负荷比例(%)',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '冷站能效(' + miscstr + ')',
                            min: 0,
                            max: maxeerVa,
                            interval: maxeerVa / 10,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: ys
                };
                mycv.setOption(option);
                jQuery('#rateBusy').hideLoading();
            }else if(res.code===-1){

                var tip = res.msg;

                var str = '<div class="noDataTip" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">' + tip + '</div>'

                $('#rateMain').append(str);

                console.log('异常错误(负荷分析):' + res.msg);

                jQuery('#rateBusy').hideLoading();

            }else{

                jQuery('#rateBusy').hideLoading();

                var tip = '暂时没有获取到负荷比重数据';

                var str = '<div class="noDataTip" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">' + tip + '</div>'

                $('#rateMain').append(str);


            }
        })
    }

    //导出数据
    $('#exportBtn').click(function(){

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //时间
            sp:moment($('#spDT').val()).format('YYYY-MM-DD'),
            //结束时间
            ep:moment($('#epDT').val()).format('YYYY-MM-DD'),
            //单位
            misc:sessionStorage.misc

        }

        var url = sessionStorage.apiUrlPrefix + 'RateEER/ExportRateEERs?pId=' + sessionStorage.PointerID

                + '&sp=' + moment($('#spDT').val()).format('YYYY-MM-DD')

                + '&ep=' + moment($('#epDT').val()).format('YYYY-MM-DD')

                +'&misc=' + sessionStorage.misc

        $.ajax({

            type:'get',

            url: sessionStorage.apiUrlPrefix + 'RateEER/ExportRateEERs',

            data:prm,

            //发送数据之前
            beforeSend:function(){

                $('#exportBtn').html('导出中...').attr('disabled',true);

            },

            //发送数据完成之后
            complete:function(){

                $('#exportBtn').html('导出数据').attr('disabled',false);

            },

            timeout:_theTimes,

            success:function(result){
                window.open(url, "_self", true);

            },

            error:_errorFun1


        })

    })

    //表格
    var col = [

        {
            title:'名称',
            data:'chillerName',
            render:function(data, type, full, meta){
                return '<span data-attr="' + full.chillerID + '">' + data + '</span>'
            }

        },
        {
            title:'额定值',
            data:'f_Qmax',
            className:'EDValue'
        }


    ]

    _tableInit($('#tableED'),col,2,true,'','',true,'','',false);

    //额定值
    var tipName = '';

    var _thisTD = '';

    //额定负荷量设定
    $('#devOption').click(function(){

        //模态框
        _moTaiKuang($('#option-Modal'), '额定负荷量设定', '', '' ,'', '确定');

        //获取额定值
        DataED();

    })

    //点击修改额定值
    $('#tableED tbody').on('click','.EDValue',function(){

        tipName = $(this).prev().children('span').html();

        var str = '修改' + '<span style="font-weight: 400">' + tipName + '</span>' + '定额';

        //修改
        _moTaiKuang($('#edit-Modal'), str, '', '' ,'', '确定');

        //验证消息隐藏
        $('#tipError').hide();

        $('.editValue').val('');

        $('.editValue').val($(this).html());

        _thisTD = $(this);


    })

    //额定值输入验证
    $('#edit-Modal').on('keyup','.editValue',function(){

        $('#tipError').hide();

        var reg= /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;

        var value = $(this).val();

        if(!reg.test(value)){

            $('#tipError').show();

        }

    })

    //确定额定值
    $('#edit-Modal').on('click','.btn-primary',function(){

        //格式验证
        var o = $('#tipError').css('display');

        if(o == 'none'){

            //验证通过
            var value = $('.editValue').val();

            _thisTD.html(value);

            $('#edit-Modal').modal('hide');

            _thisTD = '';

        }

    })

    //点击确定修改
    $('#option-Modal').on('click','.btn-primary',function(){

        //获取数据
        var trs = $('#tableED tbody').children('tr');

        var arr = [];

        for(var i=0;i<trs.length;i++){

            var obj = {};

            obj.f_ChillerID = trs.eq(i).children().eq(0).children().attr('data-attr');

            obj.f_Qmax = trs.eq(i).children().eq(1).html();

            arr.push(obj);

        }

        var prm = {

            modifychillerqmaxvs:arr,

            pId:sessionStorage.PointerID

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'RateEER/ModifyChillerQMaxVs',

            timeout:_theTimes,

            beforeSend:function(){

                $('#tableED').showLoading();

            },

            complete:function(){

                $('#tableED').hideLoading();

            },

            data:prm,

            success:function(result){

                if(result.code == 0){

                    $('#option-Modal').modal('hide');

                    _moTaiKuang($('#tip-myModal'),'提示',true,true,'修改额定负荷量成功','');

                }else{

                    _moTaiKuang($('#tip-myModal'),'提示',true,true,'修改额定负荷量失败','');

                }
            },

            error:function(){

                _datasTable($('#tableED'),[]);

            }

        })


    })

    //获取额定负荷量的
    function DataED(){

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'RateEER/GetChillerQMaxVs',

            timeout:_theTimes,

            beforeSend:function(){

                $('#tableED').showLoading();

            },

            complete:function(){

                $('#tableED').hideLoading();

            },

            data:prm,

            success:function(result){

                var arr = [];

                if(result.code == 0){

                    if(result.chillerqmaxvs.length>0){

                        arr = result.chillerqmaxvs;

                    }

                }

                _datasTable($('#tableED'),arr);
            },

            error:function(){

                _datasTable($('#tableED'),[]);

            }

        })

    }


    return {
        init: function () {
            //初始化时间控件
            initdatetimepicker();
            //获取负荷数据
            getRateDs();
            $('#rateBtn').on('click',function () {
                getRateDs();
            })
        }
    }

}();