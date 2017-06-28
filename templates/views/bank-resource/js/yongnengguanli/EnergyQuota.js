/**
 * Created by admin on 2017/6/5.
 */
/**
 * Created by admin on 2017/6/2.
 */
/**
 * Created by admin on 2017/5/22.
 */

$(document).ready(function() {

    // 基于准备好的dom，初始化echarts实例
    //console.log('ok');

    var table = $('#dateTables').DataTable({
        "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "bPaginate": false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
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
                title:'编号',
                data:"index"

            },
            {
                title:'本行ID',
                data:"enterpriseID",
                class:'theHidden'
            },
            {
                title:'名称',
                data:"enterpriseName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,5)+'</span>'
                }
            },
            {
                title:'1月',
                data:"dingEValue",
                render:function(data, type, row, meta){
                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[0].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[0].toFixed(2)+'"/>'
                    }

                }
            },
            {
                title:'2月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[1].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[1].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'3月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[2].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[2].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'4月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[3].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[3].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'5月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[4].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[4].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'6月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[5].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[5].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'7月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[6].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[6].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'8月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[7].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[7].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'9月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[8].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[8].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'10月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[9].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[9].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'11月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[10].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[10].toFixed(2)+'"/>'
                    }
                }
            },
            {
                title:'12月',
                data:"dingEValue",
                render:function(data, type, row, meta){

                    if(row.enterpriseID != '0000'){

                        return '<input unselectable="on" readonly="readonly" class="month-data" value = "'+data[11].toFixed(2)+'"/>';
                    }else{
                        return '<input disabled="disabled" class="month-data month-datas" value = "'+data[11].toFixed(2)+'"/>'
                    }
                }
            }

        ]
    });
    _table = $('#dateTables').dataTable();

    //点击查询按钮时，获取后台数据
    $('.condition-query .top-refer').on('click',function(){
        //获取查询条件
        var type = $('.condition-query li').eq(0).find('select').val();
        var time = $('.condition-query li').eq(1).find('select').val();
        var theArea = $('.condition-query li').eq(2).find('select').val();

        //$('.show-title1').html(theArea);
        //$('.show-title2').html(type);
        //$('.show-title3').html(time);
        $('#theLoading').modal('show');

        getMainData();

    });

    //点击编辑按钮时，表格中数据切换为可编辑
    $('.top-operation .top-edit').on('click',function(){


        var now = parseInt(moment().year());


        if(compareYear < now){
            myAlter('过往年份数据无法编辑');
            return false;
        };


        $('.month-data').removeAttr('readOnly');
        $('.month-data').removeAttr('unselectable');

        $('.prompt').html('当前可编辑，编辑完成后请点击确定按钮进行提交。');


        $('.top-operation .top-btn').removeClass('onClick');

        $(this).addClass('onClick');

    });

    //点击确定按钮时，提交表格中的数据，并使其不可编辑。
    $('.top-operation .top-sure').on('click',function(){

        if(!checkedData('.month-data')){

            return false;
        }



        $('.top-operation .top-btn').removeClass('onClick');

        $(this).addClass('onClick');

        $('.month-data').attr('readOnly','readOnly');
        $('.month-data').attr('unselectable','on');

        $('.prompt').html('当前不可编辑，可点击右侧编辑按钮进行编辑。');

        var energyItemID = $('#energy-type').val();

        var postDate = $('#post-date').val();

        var thePostArr = postArr.concat(getArr);

        //console.log(thePostArr);


        $.ajax({
            type: 'post',
            url: IP + "/EnergyManage/PostBankDingEData",
            timeout: theTimes,
            data:{
                "f_EnergyItemId" : energyItemID,
                "f_Year" : compareYear,
                "bankDingEReturns" : thePostArr,
                'userID' : _userIdName
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success: function (data) {
                $('#theLoading').modal('hide');
                //console.log(data);

                if(data == 3){

                    myAlter('提交失败，请联系管理员!');
                    return false;
                }else if(data == 17){

                    myAlter('过往年数据只能查询!');
                    return false;
                }else if(data == 99){
                    myAlter('修改成功');

                    getMainData();
                };
                //表格中的数据


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    myAlter("超时");
                }
                myAlter("请求失败！");
            }
        });

    });

    //点击取消按钮时，表格数据回到最初。
    $('.top-operation .top-abolish').on('click',function(){

       myAlter1('确定取消之前操作吗？');

    });

    $('#my-alert1 .btn-primary').on('click',function(){

        $('.month-data').attr('readOnly','readOnly');
        $('.month-data').attr('unselectable','on');

        ajaxSuccess();
    });

});

var compareYear = 0;

//存放返回的所有数据
var getArr = [];

//存放要提交的数据
var postArr = [];

//存放查询对象
var pointArr = [];

//存放查询类型
var typeArr = [];

//获取能耗查询页面初始数据
function getStartData(){
    //获取查询类别
    $.ajax({
        type: 'get',
        url: IP + "/EnergyQuery/GetEnergyNormItemQuery",
        timeout: theTimes,
        data:{
            isShowStandardCoal : 0
        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {

        },
        success: function (data) {

            //console.log(data);
            typeArr = data;
            var html= '';
            for(var i=0; i<data.length;i++){
                html +=   '<option value="'+getUnitID(data[i].energyTypeID)+'" ids="'+data[i].energyTypeUnit+'">'+data[i].energyTypeName+'</option>'
            }

            $('#energy-type').html(html);

            //获取当前时间
            var year = parseInt(moment().year());

            var html1 = '';
            for(var i=-5; i<6; i++){
                var num = year + i;
                if(num == year){
                    html1 +=   '<option selected = "">'+num+'</option>'
                }else{
                    html1 +=   '<option >'+num+'</option>'
                }

            }

            $('#post-date').html(html1);


            //获取chart图中的数据

            getMainData();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }
    });


}
getStartData();

//获取页面初始数据
function getMainData(){


    var energyItemID = $('#energy-type').val();

    var unit;

    //console.log(typeArr);

    unit = $('#energy-type').find('option:selected').attr('ids');


    var title2 = $('#energy-type').find('option:selected').text();

    var postDate = $('#post-date').val();



    $.ajax({
        type: 'get',
        url: IP + "/EnergyManage/GetBankDingEData",
        timeout: theTimes,
        data:{
            energyItemCode : energyItemID,
            yearInt : postDate,
            userID : _userIdName
        },
        beforeSend: function () {

        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');

            if(data.length == 0){

                myAlter('无数据!');
                return false;
            };

            getArr = data;

            //表格中的数据

            dataArrs = [];

            postArr = [];

            $('.show-title1').html(title2);
            $('.show-title2').html(postDate);

            dataArrs = data;

            //console.log(dataArrs);

            deepCopy(dataArrs,postArr);


            var sumArr = [];

            for(var i=0; i<12; i++){
                var sum = 0;
               for(var j=0; j<dataArrs.length; j++){
                   sum += dataArrs[j].dingEValue[i];
               }

                sum = parseFloat(sum);

                sumArr.push(sum);

            }
            var theIndex = dataArrs.length + 1;

            var obj = {
                dingEValue : sumArr,
                enterpriseID : 0000,
                enterpriseName　: '四川央行总',
                index : theIndex
            };

            dataArrs.push(obj);

            compareYear = parseInt(postDate);

            //表格中的数据
            ajaxSuccess();

            //console.log(unit);

            changeData();

            $('.header-right-lists span').html(unit);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }
    });
};

//用户进行编辑操作时，对数据进行保存。
function changeData(){
    $('.month-data').on('blur',function(){

        var data = $(this).val();

        if(data == '' || isNaN(data) ||　data < 0){
            myAlter('请输入正确数据');
            getFocus1($(this));

            return false;
        }

        var id = $(this).parents('tr').find('.theHidden').html();

        var index = parseInt($(this).parent('td').index()) - 3;

        //console.log(index);

        $(postArr).each(function(i,o){
            //
            if(id == o.enterpriseID){
                o.dingEValue[index] = data;

                return false;
            }
        });
        var totalNum = 0;

        //console.log(postArr);

        for(var i=0; i<postArr.length; i++){

            totalNum += parseInt(postArr[i].dingEValue[index]);

        }

        totalNum = parseFloat(totalNum).toFixed(2);

        $('.month-datas').eq(index).val(totalNum);

        //console.log(postArr);

    });
};


//自定义时间时
$('.datatimeblock').on('change',function(){

    $('.show-date').css({
        display:'none'
    });


    if($(this).val() == '自定义'){
        $('#choose-date').modal('show');
        $('#choose-date input').val('');
    }


});
//关闭时间弹窗时
$('#choose-date .btn-default').on('click',function(){

    $('.datatimeblock').val('今天');

});
$('#choose-date .close').on('click',function(){

    $('.datatimeblock').val('今天');

});
//选定时间后
$('#choose-date .btn-primary').on('click',function(){

    if(!checkedNull('#choose-date')){
        return false;
    }
    var txt1 = $('#choose-date .add-input').eq(0).val();
    var txt2 = $('#choose-date .add-input').eq(1).val();

    var nowDate = getNewDate();

    //if(CompareDate(txt2,nowDate) == true){
    //    myAlter('结束日期不能大于当前日期');
    //    getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));
    //
    //    return false;
    //};


    if(CompareDate(txt2,txt1) == false){
        myAlter('结束日期必须大于开始日期');
        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

        return false;
    };

    var date = txt1 + '——' + txt2;

    //console.log(date);

    $('.show-date').css({
        display:'inline-block'
    });

    $('.show-date').val(date);

    $('#choose-date').modal('hide');

});

$('.show-date').on('focus',function(){

    $('#choose-date').modal('show');
    $('#choose-date input').val('');
});

//检验输入是否合理
function checkedData(dom){

    var length = $(dom).length;
    for(var i=0; i<length; i++){
        var data = $(dom).eq(i).val();
        if(data == ''){
            myAlter('数据不能为空');
            getFocus1($(dom).eq(i));
            return false;
        }else if(isNaN(data)){
            myAlter('数据输入错误');
            getFocus1($(dom).eq(i));
            return false;
        }
    }
    return true;
}