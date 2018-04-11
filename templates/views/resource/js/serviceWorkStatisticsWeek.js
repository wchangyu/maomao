$(function(){
    /*------------------------------------------------时间-------------------------------------*/

    //日历
    _timeYMDComponentsFun($('.selectTime'));

    //默认结束时间
    var demoTime = moment().format('YYYY/MM/DD');

    //默认开始时间
    var demoStime = moment().subtract(6,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(demoStime);

    $('.datatimeblock').eq(1).val(demoTime);

    //加载科室
    getDepart();

    /*-----------------------------------------------表格初始化---------------------------------*/
    //值班记录
    var scrapDatatablesCol = [

        {
            title:'日期',
            data:'gdDate'
        },
        {
            title:'需求单位',
            data:'building'
        },
        {
            title:'科室或楼层',
            data:'bxKeshi'
        },
        {
            title:'通知发出时间',
            data:'shouliShij'
        },
        {
            title:'故障原因',
            data:'bxBeizhu'
        },
        {
            title:'执行班组',
            data:'wxKeshi'
        },
        {
            title:'任务完成时间',
            data:'wangongShij'
        },
        {
            title:'值班人',
            data:'shouliRen'
        },
        {
            title:'备注',
            data:'wxBeizhu'
        }

    ]

    _tableInit($('#scrap-datatables'),scrapDatatablesCol,2,false,'','','','',10,'');

    //按班组表格
    var wxContentByClassCol = [

        {
            title:'序号',
            data:'sn'
        },
        {
            title:'班组',
            data:'wxKeshi'
        },
        {
            title:'项次',
            data:'gdNum'
        },
        {
            title:'占比%',
            data:'percentage'
        }

    ]

    _tableInit($('#wxContentByClassTable'),wxContentByClassCol,2,false,'','','','',10,'');

    //按房屋表格
    var wxContentByHouseCol = [

        {
            title:'序号',
            data:'sn'
        },
        {
            title:'楼宇',
            data:'building'
        },
        {
            title:'项次',
            data:'gdNum'
        },
        {
            title:'占比%',
            data:'percentage'
        }

    ]

    _tableInit($('#wxContentByHouseTable'),wxContentByHouseCol,2,false,'','','','',10,'');

    //水电班按工作内容
    var wxContentOfHydroelectricCol = [

        {
            title:'序号',
            data:'sn'
        },
        {
            title:'维修项目',
            data:'wxclassname'
        },
        {
            title:'项次',
            data:'gdNum'
        },
        {
            title:'占比%',
            data:'percentage'
        },
        {
            title:'备注',
            data:'remark'
        }

    ]

    _tableInit($('#wxContentOfHydroelectric'),wxContentOfHydroelectricCol,2,false,'','','','',10,'');

    var wxContentByDepartmentCol =[

        {
            title:'序号',
            data:'sn'
        },
        {
            title:'科室名称',
            data:'bxKeshi'
        },
        {
            title:'项次',
            data:'gdNum'
        },
        {
            title:'占比%',
            data:'percentage'
        }

    ]

    _tableInit($('#wxContentByDepartment'),wxContentByDepartmentCol,2,false,'','','','',10,'');

    //某科室费用明细
    var allSectionCol = [

        {
            title:'科室名称',
            data:'bxKeshi'
        },
        {
            title:'材料名称',
            data:'wxClName'
        },
        {
            title:'规格',
            data:'size'
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'clShul'
        },
        {
            title:'单价',
            data:'wxClPrice'
        },
        {
            title:'合计金额',
            data:'clFee'
        },
        {
            title:'工时费',
            data:'gongshiFee'
        },
        {
            title:'总计金额',
            data:'gdFee'
        },
        {
            title:'备注',
            data:'wxBeizhu'
        }

    ]

    _tableInit($('#oneSectionTable'),allSectionCol,2,false,'','','','',10,'');

    //各科室总汇
    var oneSectionSummaryCol = [

        {
            title:'序号',
            data:'sn'
        },
        {
            title:'科室名称',
            data:'bxKeshi'
        },
        {
            title:'材料合计',
            data:'clFee'
        },
        {
            title:'工时合计',
            data:'gongshiFee'
        },
        {
            title:'科室总计',
            data:'gdFee'
        }

    ]

    _tableInit($('#oneSectionSummaryTable'),oneSectionSummaryCol,2,false,'','','','',10,'');

    var prmArr = ['1001','1002','1003','1004','1005','1007','1006'];

    //默认数据
    conditionSelect(prmArr[0],$('#scrap-datatables'));

    /*-----------------------------------------------按钮事件----------------------------------*/

    //选项卡事件
    $('.table-title span').click(function(){

        //选项卡样式修改
        $('.table-title').children('span').removeClass('spanhover');

        $(this).addClass('spanhover');

        //表格对应情况
        $('.table-title').next().children().addClass('hide-block');

        $('.table-title').next().children().eq($(this).index()).removeClass('hide-block');

    })

    //查询事件
    $('#selected').click(function(){

        //首先判断当前标签所对应的表格
        var index = $('.spanhover').index();

        //当前发送哪个数据
        conditionSelect(prmArr[index],$('.table').eq(index));


    })

    //点击标签加载数据
    $('.table-title span').click(function(){

        //首先判断当前标签所对应的表格
        var index = $('.spanhover').index();

        //当前发送哪个数据
        conditionSelect(prmArr[index],$('.table').eq(index));

    })

    //时间改变触发事件
    $('.selectTime').on('changeDate',function(){

        //获取选择的时间
        var nowSelect = $(this).val();

        //结束时间
        var selectEt = moment(nowSelect).add(6,'d').format('YYYY/MM/DD');

        //赋值
        $('.datatimeblock').eq(0).val(nowSelect);

        $('.datatimeblock').eq(1).val(selectEt);

    })

    //导出
    $('.excelButton').click(function(){

        //获取当前表格的id

        //首先判断当前标签所对应的表格
        var index = $('.spanhover').index();

        _FFExcel($('.table').eq(index)[0]);

    })

    //按科室查询费用明细
    $('.main-contents-table .btn-primary').click(function(){

        //首先判断当前标签所对应的表格
        var index = $('.spanhover').index();

        //当前发送哪个数据
        conditionSelect(prmArr[index],$('.table').eq(index));

    })

    //打印的时候，去掉翻译部分
    $('.table').next().addClass('noprint');

    /*------------------------------------------------其他方法---------------------------------*/

    function conditionSelect(num,table){

        var title = '服务热线'+ $('.datatimeblock').eq(0).val() + '到' + $('.datatimeblock').eq(1).val() + $('.spanhover').html();

        $('.table-block-title').html(title);

        //参数
        var prm = {

            'reportID':num,

            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:$('.datatimeblock').eq(0).val()
                },

                //结束时间
                {

                    name:'et',

                    value:moment($('.datatimeblock').eq(1).val()).endOf('months').format('YYYY/MM/DD')

                }

            ]

        }

        //判断是否是统计科室费用明细
        if(prm.reportID == '1007'){

            prm.requesparameters[2] = {

                name:'bxKeshiNum',

                value:$('#depart').val()

            }

        }

        //科室的时候，还要传科室的条件

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

                if(result.length == 0){

                    return false;

                }else{

                    var dataArr = _packagingTableData(result[1]);

                    _jumpNow(table,dataArr.reverse());

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

    //科室数据
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