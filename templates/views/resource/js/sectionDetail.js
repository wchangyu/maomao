$(function(){

    //科室
    getDepart();

    /*------------------------------------------时间插件--------------------------------------------*/

    //月份
    _monthDate($('.datatimeblock'));

    //默认上月
    var demoTime = moment().subtract(1,'months').format('YYYY/MM');

    $('.datatimeblock').val(demoTime);

    /*-----------------------------------------表格初始化-------------------------------------------*/

    //所有科室材料工时明细
    var allSectionCol = [

        {
            title:'科室名称',
            data:'departName'
        },
        {
            title:'材料名称',
            data:'materialName'
        },
        {
            title:'规格',
            data:'size'
        },
        {
            title:'单位',
            data:'unit'
        },
        {
            title:'数量',
            data:'num'
        },
        {
            title:'单价',
            data:'prince'
        },
        {
            title:'金额合计',
            data:'amount'
        },
        {
            title:'工时费',
            data:'timeFee'
        },
        {
            title:'备注',
            data:'remark'
        }

    ]

    _tableInit($('#allSectionTable'),allSectionCol,2,false,'','','','','','');

    //某科室材料工时明细
    _tableInit($('#oneSectionTable'),allSectionCol,2,false,'','','','','','');

    //各科室总汇
    var oneSectionSummaryCol = [

        {
            title:'科室名称',
            data:'departName'
        },
        {
            title:'材料数量',
            data:'materialNum'
        },
        {
            title:'总金额',
            data:'amount'
        },
        {
            title:'总工时',
            data:'workingHours'
        },
        {
            title:'备注',
            data:'remark'
        }

    ]

    _tableInit($('#oneSectionSummaryTable'),oneSectionSummaryCol,2,false,'','','','','','');

    /*----------------------------------------按钮事件-----------------------------------------------*/

    //选项卡事件
    $('.table-title span').click(function(){

        //选项卡样式修改
        $('.table-title').children('span').removeClass('spanhover');

        $(this).addClass('spanhover');

        //表格对应情况
        $('.table-title').next().children().addClass('hide-block');

        $('.table-title').next().children().eq($(this).index()).removeClass('hide-block');

    })

    /*-----------------------------------------其他方法----------------------------------------------*/

    //科室方法
    function getDepart(){

        var prm = {

            userID:_userIdNum

        }

        $.ajax({

            type:'post',

            url:_urls +'RBAC/rbacGetDeparts',

            data:prm,

            timeout:_theTimes,

            success:function(result){

                console.log(result);

                var str = '<option value="">全部</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].departNum + '">' + result[i].departName + '</option>'

                }

                $('#depart').empty().append(str);

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