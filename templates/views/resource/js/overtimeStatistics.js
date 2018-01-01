$(function(){
    /*----------------------------------------------------变量---------------------------------------------*/

    //日历插件
    _dataComponentsFun($('.datatimeblock'));

    //默认时间为半年
    var now = moment().format('YYYY-MM-DD');

    var st = moment(now).subtract(6,'months').format('YYYY-MM-DD');

    $('.min').val(st);

    $('.max').val(now);

    //获取所有部门
    _getProfession('RBAC/rbacGetDeparts',$('#dep'),false,'departNum','departName');

    //获取表格数据
    getData();

    //导出
    $('.excelButton11').eq(0).on('click',function(){

        _FFExcel($('#reporting')[0]);

        //_exportExecl($('#reporting'));

    });

    //查询
    $('#selected').click(function(){

        getData();

    })

    //重置
    $('.resites').click(function(){

        //input清空
        $('.condition-query1').eq(0).find('input').val('');

        //时间初始化
        $('.min').val(st);

        $('.max').val(now);

        $('.condition-query1').eq(0).find('select').val('');

    })


    /*--------------------------------------------------其他方法--------------------------------------------*/
    //获得数据
    function getData(){

        var prm = {

            //所属部门
            departNum:$('#dep').val(),
            //开始时间
            begintime:$('.min').val(),
            //结束时间
            endtime:moment(now).add(1,'d').format('YYYY-MM-DD')

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/JBStatisticsDetails',
            data:prm,
            timeout:_theTimes,
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

                if(result){

                    if(result.riqi){

                        var arr = ['序号','姓名'];

                        //首先初始化表格
                        for(var i=0;i<result.riqi.length;i++){

                            var obj = result.riqi[i]

                            arr.push(obj.date);

                        }

                        arr.push('合计');

                        //标题
                        var col = [];

                        //数据
                        var data = ['sn','name'];

                        if(result.renList){

                            if(result.renList[0].riqiqianlist){

                                for(var i=0;i<result.renList[0].riqiqianlist.length;i++){

                                    data.push(result.renList[0].riqiqianlist[i].date);

                                }

                                data.push('summation');
                            }

                        }

                        for(var i=0;i<arr.length;i++){

                            var obj = {};

                            obj.title = arr[i];

                            obj.data = data[i];

                            col.push(obj);

                        }

                        //footer标签
                        //插入foot
                        var tfootStr = '';

                        for(var i=0;i<col.length-1;i++){

                            if(i==0){

                                tfootStr += '<td colspan="2">合计：</td>';

                            }else{

                                tfootStr += '<td></td>';

                            }


                        }

                        $('#reporting tfoot').children().empty().append(tfootStr);

                        _tableInit($('#reporting'),col,1,true,'',totalNum);

                        //表格数据赋值
                        var dataNum = [];

                        //序列号
                        var sn = 0;

                        //姓名
                        var name = '';

                        //合计
                        var summation = 0;

                        if(result.renList){

                            for(var i=0;i<result.renList.length;i++){

                                var obj = {};

                                //序列号
                                obj.sn = Number(i + 1);

                                //姓名
                                obj.name = result.renList[i].name;

                                //日期数据
                                for(var j=0;j<result.renList[i].riqiqianlist.length;j++){

                                    var attrName = result.renList[i].riqiqianlist[j].date;

                                    var attrNum = result.renList[i].riqiqianlist[j].qian;

                                    obj[attrName] = attrNum;

                                }

                                //合计
                                obj.summation = result.renList[i].summation;

                                dataNum.push(obj);

                            }

                        }

                        _datasTable($('#reporting'),dataNum);


                    }

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(jqXHR.responseText);
            }


        })

    }

    //计算合计
    function totalNum() {

        //首先把foot表格写出来
        var Ftd = $('#reporting tfoot').children().children();

        var Btr = $('#reporting tbody').children();

        var Hth = $('#reporting thead tr').children();

        //将每一列的数字累加
        for (var i = 2; i < Hth.length; i++) {

            var amount = 0

            for (var j = 0; j < Btr.length; j++) {

                var aa = Btr.eq(j).children().eq(i).html();

                amount += Number(aa);

            }

            Ftd.eq(i - 1).html(amount.toFixed(2));

        }

    }

})