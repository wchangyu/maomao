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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'pK_AboveQuotaMain',
                class:'theHidden'
            },
            {
                title:'未结算名称',
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
                title:'单位性质',
                data:'f_UnitNatureName'

            },
            {
                title:'本行ID',
                data:'pK_AboveQuotaChild',
                class:'theHidden'

            },
            {
                title:'单位名称',
                data:'f_UnitName'


            },
            {
                title:'应缴费用(元)',
                data:'f_ShouldPay'


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
                        return '<span ><b class="pay-not1" ></b><font>已缴完</font></span>'
                    }
                }

            }
        ]
    });

    $('.choose-period').on('click',function(){

        var dom = $('#dateTables0 tbody tr');
        var length = dom.length;
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
            url: IP + "/AboveQuota/GetNoSettlementQuotaChild",
            async: false,
            timeout: theTimes,
            data:{
                aboveQuotaMainIDs : seekArr
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
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
                if(data.validateNumber == 10){
                    myAlter('超额用能缴费已完结');
                    return false;
                }

                rightArr = [];
                var arr = data.aboveQuotaChilds;

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

    //导出内部使用列表
    $('.top-btn1').on('click',function(){

        if(rightArr.length == 0){
            myAlter('当前无数据，无法导出');
            return false;
        }
        var postString = '';
        for(var i=0; i<seekArr.length; i++){
            var postID = parseInt(seekArr[i]);


            if(i == seekArr.length -1 ){
                postString += postID;
            }else{
                postString += postID + ',';
            }
        }
        //
        console.log(postString);



        $.ajax({
            type: 'get',
            url: IP + "/AboveQuota/GetAboveQuotaInsideReport",
            async: false,
            timeout: theTimes,
            data:{
                aboveQuotaMainIDs: postString
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

                window.open(IP + "/AboveQuota/GetAboveQuotaInsideReport?aboveQuotaMainIDs="+ postString+"");

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
    //导出财务使用列表
    $('.top-btn2').on('click',function(){

        if(rightArr.length == 0){
            myAlter('当前无数据，无法导出');
            return false;
        }

        var postString = '';

        $(seekArr).each(function(i,o){
            if(i == seekArr.length -1){
                postString += o;
            }else{
                postString += o + ','
            }
        });

        $.ajax({
            type: 'get',
            url: IP + "/AboveQuota/GetAboveQuotaFinanceReport",
            async: false,
            timeout: theTimes,
            data:{
                aboveQuotaMainIDs : postString

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

                window.open(IP + "/AboveQuota/GetAboveQuotaFinanceReport?aboveQuotaMainIDs="+ postString+"");

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
//右侧展示数据
var rightArr = [];
//左侧主表ID
var seekArr= [];

//获取左侧未结算周期数据
function getLeftData(){

    dataArr=[];
    $.ajax({
        type:'get',
        url:IP + "/AboveQuota/GetAboveQuotaMains",
        async:false,
        timeout:theTimes,
        data:{
            'payFinish' : 0
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