/**
 * Created by admin on 2017/4/25.
 */

$(document).ready(function(){

    var table0 = $('#dateTables0').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "ordering": false,
        "sScrollY": '615px',
        "bPaginate": false,
        'searching': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'search':'搜索:',
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
                title: '',
                data:null,
                render:function(data, type, row, meta){
                   return "<input type='checkbox' class='tableCheck'/>"
                }
            },
            {
                title:'id',
                data:'pK_AboveQuotaMain',
                class:'theHidden'
            },
            {
                title:'结算名称',
                data:'f_AccountName',
                class:'adjust-comment',
                render:function(data, type, row, meta){
                    var date1 =  row.f_AccountST.split(' ')[0];
                    var date2 = row.f_AccountET.split(' ')[0];
                    return data +  ' ('+ date1 + ' - ' + date2 + ')';
                }
            }
        ]
    });

    getLeftData();
    _table = $('#dateTables0').dataTable();
    //给表格添加后台获取到的数据
    setData();
    hiddrenId();

    //获取右侧表格
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
                title:'结算名称',
                data:'f_AccountName'

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
                title:'应缴费用(元)',
                data:'f_ShouldPay'


            },
            {
                title:'特殊加减费用(元)',
                data:'f_SpecialRebatePay'


            },
            {
                title:'百分比减免(%)',
                data:'f_PercentageReduction',
                render:function(data, type, row, meta){
                    return data * 100
                }

            },
            {
                title:'实收费用(元)',
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
                    }else if(data == 3){
                        return '<span ><b class="pay-not2" ></b><font>已缴完</font></span>'
                    }
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
                title:'查看详情',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='top-btn check-data'>查看</button>"
            },
        ]
    });

    $('.choose-period').on('click',function(){

        var dom = $('#dateTables0 tbody tr');
        var length = dom.length;
        var unitID =   $('.datatimeblock').val();
        console.log(unitID);
        seekArr = [];
        for(var i=0 ; i<length; i++){
            if(dom.eq(i).find("input[type='checkbox']").is(':checked')){
                seekArr.push(parseInt(dom.eq(i).children().eq(1).html()));
            }
        };
        console.log(seekArr);

        if(seekArr.length == 0){
            myAlter('请先选择未结算周期后进行查询');
            return false;
        }

        $.ajax({
            type: 'get',
            url: IP + "/AboveQuota/GetVerticalAboveQuota",
            async: false,
            timeout: theTimes,
            data:{
                unitID : unitID,
                aboveQuotaMains : seekArr
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {

            },
            success: function (data) {
                $('#theLoading').modal('hide');
                console.log(data);

                rightArr = [];
                var arr = data;

                for(var i=0; i< arr.length; i++){
                    rightArr.push(arr[i]);
                }
                _table = $('#dateTables1').dataTable();

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

    //查看详情按钮
    var table2 = $('#dateTables2').DataTable({
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

    $('#dateTables1').on('click','.check-data',function(){

        var id = $(this).parents('tr').find('td').eq(1).html();

        var unit = $(this).parents('tr').find('td').eq(0).html();

        var showData = [];

        console.log(id);

        for(var i=0; i<rightArr.length; i++){
            var pkID = rightArr[i].pK_AboveQuotaChild;
            if(id == pkID){
                showData = rightArr[i].aboveQuotaDetails;
            }
        }

        if(showData.length == 0){
            myAlter(unit + ' 未绑定计量仪表设备');
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
        $('#show-details1 .ament-data').eq(1).find('span').html(showData[0].f_EnergyQuota);

        //用能量
        $('#show-details1 .ament-data').eq(2).find('span').html(showData[0].f_EnergyValue);

        //实际用能量
        $('#show-details1').find('.add-input').eq(1).val(showData[0].f_EndResultEnergyValue);

        //超额用能量
        $('#show-details1 .ament-data').eq(3).find('span').html(showData[0].f_AboveEnergyValue);

        //应缴费用
        $('#show-details1 .ament-data').eq(4).find('span').html(showData[0].f_EnergyShouldPay);

        //备注
        $('#show-details1').find('.remarks').val(showData[0].f_SpecialEnergyComment);

        //特殊加减用能量
        $('#show-details1').find('.add-input').eq(0).val(showData[0].f_SpecialRebateEnergy);

        //重构表格
        var tableArr = showData[0].mtReturnReads;

        setTimeout(function(){
            _table = $('#dateTables2').dataTable();
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
                _table = $('#dateTables2').dataTable();
                _table.fnClearTable();
                setDatas(tableArr);
                hiddrenId();
            },10);

        });

        $(".tabs2 a").click(function(e){
            //e.preventDefault();
        });
    })

});

//右侧展示数据
var rightArr = [];
//左侧主表ID
var seekArr= [];

//获取左侧结算周期数据
function getLeftData(){

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

//获取所有的单位

getAllUnit()

function getAllUnit(){

    $.ajax({
        type: 'get',
        url: IP + "/SecondUnit/GetSecondUnitByCondition",
        async: false,
        timeout: theTimes,
        data:{
            unitName : '',
            cancelFlag : 0
        },
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {
            $('#theLoading').modal('hide');
            console.log(data);

            var html = '';
            for(var i=0; i<data.length; i++){
                var unitName = data[i].f_UnitName;
                var id = data[i].pK_Unit;
                html += ' <option value="'+id+'">'+unitName+'</option>';

            }
            $('.datatimeblock').html(html);

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
}

//左侧搜索是否显示
var showNum = 0;
$('.showOrHidden').on('click',function(){

    if(showNum % 2 == 0){
        $('.main-content-left').css({
            display:'none'
        });

        $('.main-content-right').css({
            marginLeft:'0px'
        });
    }else{
        $('.main-content-left').css({
            display:'block'
        });

        $('.main-content-right').css({
            marginLeft:'365px'
        });
    }


    showNum ++;
});