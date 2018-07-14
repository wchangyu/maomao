$(function(){

    /*-------------------------------------时间插件-----------------------------------*/

    _timeYMDComponentsFun11($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY-MM-DD');

    var st = moment(nowTime).startOf('months').format('YYYY-MM-DD');

    var et = moment(nowTime).endOf('months').format('YYYY-MM-DD');

    $('.min').val(st);

    $('.max').val(et);

    conditionSelect();

    /*-------------------------------------表格初始化----------------------------------*/


    /*-------------------------------------按钮事件------------------------------------*/

    $('#selected').click(function(){

        conditionSelect();

    })


    /*------------------------------------获取数据-------------------------------------*/

    function conditionSelect(){

        var prm = {

            'reportID':'104',

            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:$('.min').val()
                },
                //结束时间
                {

                    name:'et',

                    value:$('.max').val()

                }
            ]

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWFZ/GetFroms',

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

                if(result != null){

                    if(result.length == 0){

                        return false;

                    }else{

                        //var dataArr = _packagingTableData(result[1]);

                        console.log(result);

                        //_jumpNow(table,dataArr.reverse());

                    }

                }

            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }

        })

    }


})