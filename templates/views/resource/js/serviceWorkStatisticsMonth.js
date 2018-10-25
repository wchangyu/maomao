$(function(){

    /*------------------------------------------------时间-------------------------------------*/

    //月份
    _monthDate($('.datatimeblock'));

    //默认上月
    var demoTime = moment().subtract(1,'months').format('YYYY/MM');

    $('.datatimeblock').val(demoTime);

    //加载科室
    getDepart();

    /*-----------------------------------------------表格初始化---------------------------------*/
    //值班记录
    var scrapDatatablesCol = [

        {
            title:'楼宇名称',
            data:'building'
        },
        {
            title:__names.office +'或楼层',
            data:'bxKeshi'
        },
        {
            title:'报修时间',
            data:'GDShij'
        },
        {
            title:'派单时间',
            data:'shoulShij'
        },
        {
            title:'故障描述',
            data:'BxBeizhu'
        },
        {
            title:'值班人',
            data:'shouliRen'
        },
        {
            title:'执行班组',
            data:'wxKeshi'
        },
        {
            title:'完工时间',
            data:'wangongShij'
        },

        {
            title:'处理结果',
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

    _tableInit($('#wxContentByClassTable'),wxContentByClassCol,2,false,'',drawFnByClass,'','',10,'');

    //重绘合计数据
    function drawFnByClass(){

        //表格中的每一个tr
        var tr = $('#wxContentByClassTable tbody').children('tr');

        //项次
        var num = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //项次
                num += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //项次
        $('#pageNumWXBZ').html(num);

    };

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

    _tableInit($('#wxContentByHouseTable'),wxContentByHouseCol,2,false,'',drawFnByHouse,'','',10,'');

    //重绘合计数据
    function drawFnByHouse(){

        //表格中的每一个tr
        var tr = $('#wxContentByHouseTable tbody').children('tr');

        //项次
        var num = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //项次
                num += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //项次
        $('#pageNumPointer').html(num);

    };

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

    _tableInit($('#wxContentOfHydroelectric'),wxContentOfHydroelectricCol,2,false,'',drawFnByHydroelectric,'','',10,'');

    //重绘合计数据
    function drawFnByHydroelectric(){

        //表格中的每一个tr
        var tr = $('#wxContentOfHydroelectric tbody').children('tr');

        //项次
        var num = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //项次
                num += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //项次
        $('#pageNumWXXM').html(num);

    };

    var wxContentByDepartmentCol =[

        {
            title:'序号',
            data:'sn'
        },
        {
            title:__names.office,
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

    _tableInit($('#wxContentByDepartment'),wxContentByDepartmentCol,2,false,'',drawFnByDepartment,'','',10,'');

    //重绘合计数据
    function drawFnByDepartment(){

        //表格中的每一个tr
        var tr = $('#wxContentByDepartment tbody').children('tr');

        //项次
        var num = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //项次
                num += Number(tr.eq(i).children().eq(2).html());

            }

        }

        //项次
        $('#pageNumBXKS').html(num);

    };

    //某报修科室费用明细
    var allSectionCol = [

        {
            title:__names.office + '名称',
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
            title:'报修日期',
            data:'gdShij'
        },
        {
            title:'报修内容',
            data:'bxBeizhu'
        },
        {
            title:'维修内容',
            data:'wxBeizhu'
        }

    ]

    _tableInit($('#oneSectionTable'),allSectionCol,2,false,'',drawFnallSection,'','',10,'');

    //重绘合计数据
    function drawFnallSection(){

        //表格中的每一个tr
        var tr = $('#oneSectionTable tbody').children('tr');

        //数量
        var num = 0;

        //单价
        var prince = 0;

        //合计金额
        var Amount = 0;

        //工时费
        var fee = 0;

        //总计金额
        var money = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //数量
                num += Number(tr.eq(i).children().eq(4).html());

                //合计金额
                Amount += Number(tr.eq(i).children().eq(6).html());

                //单价
                prince += Number(tr.eq(i).children().eq(5).html());

                //工时费
                fee += Number(tr.eq(i).children().eq(7).html());

                //总计金额
                money += Number(tr.eq(i).children().eq(8).html());

            }

        }

        //数量
        $('#pageKSFeeNum').html(num);

        //单价
        $('#pageKSFeePrince').html(prince.toFixed(2));

        //合计金额
        $('#pageKSFeeAmount').html(Amount.toFixed(2));

        //工时费
        $('#pageKSFeeWork').html(fee.toFixed(2));

        //总计金额
        $('#pageKSFeeAllMomey').html(money.toFixed(2));

    };

    //各报修科室总汇
    var oneSectionSummaryCol = [

        {
            title:'序号',
            data:'sn'
        },
        {
            title:__names.office,
            data:'bxKeshi'
        },
        {
            title:'材料合计',
            data:'clFee'
        },
        {
            title:'工时合计',
            data:'workFee'
        },
        {
            title:__names.office +'总计',
            data:'gdFee'
        }

    ]

    _tableInit($('#oneSectionSummaryTable'),oneSectionSummaryCol,2,false,'',drawFnBySectionSummary,'','',10,'');

    //重绘合计数据
    function drawFnBySectionSummary(){

        //表格中的每一个tr
        var tr = $('#oneSectionSummaryTable tbody').children('tr');

        //材料合计
        var CLFee = 0;

        //工时合计
        var GSFee = 0;

        //单位总计
        var ZJFee = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //材料合计
                CLFee += Number(tr.eq(i).children().eq(2).html());

                //工时合计
                GSFee += Number(tr.eq(i).children().eq(3).html());

                //单位总计
                ZJFee += Number(tr.eq(i).children().eq(4).html());

            }

        }

        //材料合计
        $('#pageFeeCL').html(CLFee.toFixed(2));

        //工时合计
        $('#pageFeeGS').html(GSFee.toFixed(2));

        //单位总计
        $('#pageFeeZJ').html(ZJFee.toFixed(2));

    };

    //某报修科室费用明细
    var allSectionWXCol = [
        {
            title:'工单号',
            data:'GDCode'
        },
        {
            title:'维修' + __names.office + '名称',
            data:'wxKeshi'
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
            title:'报修日期',
            data:'gdShij'
        },
        {
            title:'报修内容',
            data:'bxBeizhu'
        },
        {
            title:'维修内容',
            data:'wxBeizhu'
        }

    ]

    _tableInit($('#oneSectionTableWX'),allSectionWXCol,2,false,'',drawFnBySectionWX,'','',10,'');

    //重绘合计数据
    function drawFnBySectionWX(){

        //表格中的每一个tr
        var tr = $('#oneSectionTableWX tbody').children('tr');

        //材料数量
        var CLNum = 0;

        //单价合计
        var CLprince = 0;

        //材料合计
        var CLFee = 0;

        //工时合计
        var GSFee = 0;

        //单位总计
        var ZJFee = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //材料数量
                CLNum += Number(tr.eq(i).children().eq(5).html());

                //材料单价合计
                CLprince += Number(tr.eq(i).children().eq(6).html());

                //材料合计
                CLFee += Number(tr.eq(i).children().eq(7).html());

                //工时合计
                GSFee += Number(tr.eq(i).children().eq(8).html());

                //单位总计
                ZJFee += Number(tr.eq(i).children().eq(9).html());

            }

        }

        //材料数量
        $('#pageKSFeeNumWX').html(CLNum);

        //材料单价
        $('#pageKSFeePrinceWX').html(CLprince.toFixed(2));

        //材料合计
        $('#pageKSFeeAmountWX').html(CLFee.toFixed(2));

        //工时合计
        $('#pageKSFeeWorkWX').html(GSFee.toFixed(2));

        //单位总计
        $('#pageKSFeeAllMomeyWX').html(ZJFee.toFixed(2));

    };

    //各维修科室总汇
    var oneSectionSummaryWXCol = [

        {
            title:'序号',
            data:'sn'
        },
        {
            title:__names.office,
            data:'wxKeshi'
        },
        {
            title:'材料合计',
            data:'clFee'
        },
        {
            title:'工时合计',
            data:'workFee'
        },
        {
            title:__names.office +'总计',
            data:'gdFee'
        }

    ]

    _tableInit($('#oneSectionSummaryTableWX'),oneSectionSummaryWXCol,2,false,'',drawFnBySectionSummaryWX,'','',10,'');

    //重绘合计数据
    function drawFnBySectionSummaryWX(){

        //表格中的每一个tr
        var tr = $('#oneSectionSummaryTableWX tbody').children('tr');

        //材料合计
        var CLFee = 0;

        //工时合计
        var GSFee = 0;

        //单位总计
        var ZJFee = 0;

        //遍历行

        if(tr.length == 1 && tr.children().attr('class') == 'dataTables_empty'){



        }else{

            for(var i=0;i<tr.length;i++){

                //材料合计
                CLFee += Number(tr.eq(i).children().eq(2).html());

                //工时合计
                GSFee += Number(tr.eq(i).children().eq(3).html());

                //单位总计
                ZJFee += Number(tr.eq(i).children().eq(4).html());

            }

        }

        //材料合计
        $('#pageFeeCLWX').html(CLFee.toFixed(2));

        //工时合计
        $('#pageFeeGSWX').html(GSFee.toFixed(2));

        //单位总计
        $('#pageFeeZJWX').html(ZJFee.toFixed(2));

    };

    var prmArr = ['1001','1002','1003','1004','1005','1007','1006','1009','1008'];

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

        //表格初始化
        _datasTable($('.table').eq(index),[]);

        //当前发送哪个数据
        conditionSelect(prmArr[index],$('.table').eq(index));

    })

    //导出
    $('.excelButton').click(function(){

        //获取当前表格的id

        //首先判断当前标签所对应的表格
        var index = $('.spanhover').index();

        if(index == 0){

            _tableInit($('#scrap-datatables'),scrapDatatablesCol,2,false,'','','','','',true);

        }else if(index ==1){

            _tableInit($('#wxContentByClassTable'),wxContentByClassCol,2,false,'','','','','',true);

        }else if(index == 2){

            _tableInit($('#wxContentByHouseTable'),wxContentByHouseCol,2,false,'','','','','',true);

        }else if(index == 3){

            _tableInit($('#wxContentOfHydroelectric'),wxContentOfHydroelectricCol,2,false,'','','','','',true);

        }else if(index == 4){

            _tableInit($('#wxContentByDepartment'),wxContentByDepartmentCol,2,false,'','','','','',true);

        }else if(index == 5){

            _tableInit($('#oneSectionTable'),allSectionCol,2,false,'','','','','',true);

        }else if(index == 6){

            _tableInit($('#oneSectionSummaryTable'),oneSectionSummaryCol,2,false,'','','','','',true);

        }else if(index == 7){

            _tableInit($('#oneSectionTableWX'),allSectionWXCol,2,false,'','','','','',true);

        }else if(index == 8){

            _tableInit($('#oneSectionSummaryTableWX'),oneSectionSummaryWXCol,2,false,'','','','','',true);

        }

        _FFExcel($('.table').eq(index)[0]);

        if(index == 0){

            _tableInit($('#scrap-datatables'),scrapDatatablesCol,2,false,'','','','',10,'');

        }else if(index ==1){

            _tableInit($('#wxContentByClassTable'),wxContentByClassCol,2,false,'','','','',10,'');

        }else if(index == 2){

            _tableInit($('#wxContentByHouseTable'),wxContentByHouseCol,2,false,'','','','',10,'');

        }else if(index == 3){

            _tableInit($('#wxContentOfHydroelectric'),wxContentOfHydroelectricCol,2,false,'','','','',10,'');

        }else if(index == 4){

            _tableInit($('#wxContentByDepartment'),wxContentByDepartmentCol,2,false,'','','','',10,'');

        }else if(index == 5){

            _tableInit($('#oneSectionTable'),allSectionCol,2,false,'','','','',10,'');

        }else if(index == 6){

            _tableInit($('#oneSectionSummaryTable'),oneSectionSummaryCol,2,false,'','','','',10,'');

        }else if(index == 7){

            _tableInit($('#oneSectionTableWX'),allSectionWXCol,2,false,'','','','',10,'');

        }else if(index == 8){

            _tableInit($('#oneSectionSummaryTableWX'),oneSectionSummaryWXCol,2,false,'','','','',10,'');

        }

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

    //条件查询
    function conditionSelect(num,table){

        //表格初始化
        tableDataInit();

        //设置表头

        var title = '后勤服务热线' + $('.datatimeblock').val().split('/')[1] + '月' + $('.spanhover').html();

        $('.table-block-title').html(title);

        //参数
        var prm = {

            'reportID':num,

            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:$('.datatimeblock').val() + '/01'
                },
                //结束时间
                {

                    name:'et',

                    value:moment($('.datatimeblock').val() + "/01").endOf('months').format('YYYY/MM/DD')

                }
            ]

        };

        //判断是否是统计科室费用明细
        if(prm.reportID == '1007'){

            prm.requesparameters[2] = {

                name:'bxKeshiNum',

                value:$('#depart').val()

            }

        }

        //维修科室
        if(prm.reportID == '1009'){

            prm.requesparameters[2] = {

                name:'wxKeshiNum',

                value:$('#departWX').val()

            }

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

                        var dataArr = _packagingTableData(result[1]);

                        _jumpNow(table,dataArr.reverse());

                        if(num == '1002'){

                            var Num = 0;

                            //按维修班组
                            for(var i=0;i<dataArr.length;i++){

                                Num += Number(dataArr[i].gdNum);

                            }

                            $('#dataNumWXBZ').html(Num);


                        }else if(num == '1003' ){

                            //按楼宇
                            var Num = 0;

                            //按维修班组
                            for(var i=0;i<dataArr.length;i++){

                                Num += Number(dataArr[i].gdNum);

                            }

                            $('#dataNumPointer').html(Num);

                        }else if(num == '1004'){

                            //按维修项目
                            var Num = 0;

                            //按维修班组
                            for(var i=0;i<dataArr.length;i++){

                                Num += Number(dataArr[i].gdNum);

                            }

                            $('#dataNumWXXM').html(Num);

                        }else if(num == '1005'){

                            //按报修科室
                            var Num = 0;

                            for(var i=0;i<dataArr.length;i++){

                                Num += Number(dataArr[i].gdNum);

                            }

                            $('#dataNumBXKS').html(Num);

                        }else if(num == '1007'){

                            //按科室明细
                            //数量
                            var Num = 0;
                            //单价
                            var prince = 0;
                            //合计
                            var amount = 0;
                            //工时
                            var fee = 0;
                            //总计
                            var momey = 0;

                            for(var i=0;i<dataArr.length;i++){

                                var data = dataArr[i];

                                //数量
                                Num += Number(data.clShul);
                                //单价
                                prince += Number(data.wxClPrice);
                                //合计
                                amount += Number(data.clFee);
                                //工时
                                fee += Number(data.gongshiFee);
                                //总计金额
                                momey += Number(data.gdFee);
                            }

                            //数量
                            $('#dataKSFeeNum').html(Num);
                            //单价
                            //合计
                            $('#dataKSFeeAmount').html(amount.toFixed(2));
                            //工时
                            $('#dataKSFeeWork').html(fee.toFixed(2));
                            //总计金额
                            $('#dataKSFeeAllMomey').html(momey.toFixed(2));


                        }else if(num == '1006'){


                            //按科室总汇
                            //材料
                            var CLFee = 0;
                            //工时
                            var GSFee = 0;
                            //总计
                            var ZJFee = 0;

                            for(var i=0;i<dataArr.length;i++){

                                CLFee += Number(dataArr[i].clFee);

                                GSFee += Number(dataArr[i].workFee);

                                ZJFee += Number(dataArr[i].gdFee);

                            }

                            //材料
                            $('#dataFeeCL').html(CLFee.toFixed(2));
                            //工时
                            $('#dataFeeGS').html(GSFee.toFixed(2));
                            //总计
                            $('#dataFeeZJ').html(ZJFee.toFixed(2));

                        }else if(num == '1009'){

                            //按科室明细
                            //数量
                            var Num = 0;
                            //单价
                            var prince = 0;
                            //合计
                            var amount = 0;
                            //工时
                            var fee = 0;
                            //总计
                            var momey = 0;

                            for(var i=0;i<dataArr.length;i++){

                                var data = dataArr[i];

                                //数量
                                Num += Number(data.clShul);
                                //单价
                                prince += Number(data.wxClPrice);
                                //合计
                                amount += Number(data.clFee);
                                //工时
                                fee += Number(data.gongshiFee);
                                //总计金额
                                momey += Number(data.gdFee);
                            }

                            //数量
                            $('#dataKSFeeNumWX').html(Num);
                            //合计
                            $('#dataKSFeeAmountWX').html(amount.toFixed(2));
                            //工时
                            $('#dataKSFeeWorkWX').html(fee.toFixed(2));
                            //总计金额
                            $('#dataKSFeeAllMomeyWX').html(momey.toFixed(2));


                        }else if(num == '1008'){


                            //按科室总汇
                            //材料
                            var CLFee = 0;
                            //工时
                            var GSFee = 0;
                            //总计
                            var ZJFee = 0;

                            for(var i=0;i<dataArr.length;i++){

                                CLFee += Number(dataArr[i].clFee);

                                GSFee += Number(dataArr[i].workFee);

                                ZJFee += Number(dataArr[i].gdFee);

                            }

                            //材料
                            $('#dataFeeCLWX').html(CLFee.toFixed(2));
                            //工时
                            $('#dataFeeGSWX').html(GSFee.toFixed(2));
                            //总计
                            $('#dataFeeZJWX').html(ZJFee.toFixed(2));

                        }


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

                var str1 = '<option value="">全部</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].departNum + '">' + result[i].departName + '</option>'

                    if(result[i].isWx == 1){

                        str1 += '<option value="' + result[i].departNum + '">' + result[i].departName + '</option>'

                    }

                }

                $('#depart').empty().append(str);

                $('#departWX').empty().append(str1);


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

    //表格初始化
    function tableDataInit(){

        //按维修班组

        $('.table').find('#pageNumWXBZ').html(0);

        $('.table').find('#dataNumWXBZ').html(0);

        //按楼宇
        $('.table').find('#pageNumPointer').html(0);

        $('.table').find('#dataNumPointer').html(0);

        //按维修项目
        $('.table').find('#pageNumWXXM').html(0);

        $('.table').find('#dataNumWXXM').html(0);

        //按报修科室
        $('.table').find('#pageNumBXKS').html(0);

        $('.table').find('#dataNumBXKS').html(0);

        //单位费用
        $('.table').find('#pageKSFeeNum').html(0);

        $('.table').find('#pageKSFeeAmount').html(0);

        $('.table').find('#pageKSFeeWork').html(0);

        $('.table').find('#pageKSFeeAllMomey').html(0);

        $('.table').find('#dataKSFeeNum').html(0);

        $('.table').find('#dataKSFeeAmount').html(0);

        $('.table').find('#dataKSFeeWork').html(0);

        $('.table').find('#dataKSFeeAllMomey').html(0);

        $('.table').find('#pageKSFeePrince').html(0);

        //费用总汇
        $('.table').find('#pageFeeCL').html(0);

        $('.table').find('#pageFeeGS').html(0);

        $('.table').find('#pageFeeZJ').html(0);

        $('.table').find('#dataFeeCL').html(0);

        $('.table').find('#dataFeeGS').html(0);

        $('.table').find('#dataFeeZJ').html(0);


    }

});