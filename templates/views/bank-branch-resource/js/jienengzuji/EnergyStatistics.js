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
    console.log('ok');

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
                title:'选择',
                "data": null,
                render:function(data, type, row, meta){

                    return "<input type='checkbox' class='tableCheck'/>"


                }
            },
            {
                title:'编号',
                data:"f_ProjectNum"

            },
            {
                title:'本行ID',
                data:"pK_EnergySaving",
                class:'theHidden'
            },
            {
                title:'支行名称',
                data:"enterpriseName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,5)+'</span>'
                }
            },
            {
                title:'支行名称',
                data:"enterpriseName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,5)+'</span>'
                }
            },
            {
                title:'项目名称',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,5)+'</span>'
                }
            },
            {
                title:'项目编号',
                data:"f_ProjectNum",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },
            {
                title:'项目内容',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },
            {
                title:'项目金额',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },
            {
                title:'开始时间',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },
            {
                title:'结束时间',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },
            {
                title:'验收时间',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },
            {
                title:'涉及支路',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },
            {
                title:'责任部门',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },
            {
                title:'结束时间',
                data:"f_ProjectName",
                render:function(data, type, full, meta){

                    return '<span title="'+data+'">'+data.substring(0,10)+'</span>'
                }
            },


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

        getMainData();

    });

    //点击新增按钮时，弹出新增弹窗
    $('.top-operation .top-add').on('click',function(){

        $('#add-item').modal('show');

    });

    //点击新增按钮时
    $('#add-item .btn-primary').on('click',function(){

        //对输入内容进行验证
        if(!checkedNull1('#add-item') ||　!checkedDate('#add-item') ||　!checkedNum('#add-item') ||　!checkedPhone('#add-item')){
            return false;
        }
        var postArr = [];
        console.log($('#add-item .input-blockeds').length);

        for(var i=0; i<$('#add-item .input-blockeds').length; i++){

            var val = $('#add-item .input-blockeds').eq(i).find('input').val();


            postArr.push(val);
        }

        console.log(postArr);



        $.ajax({
            type: 'post',
            url: IP + "/EnergySavingTrack/AddEnergySavingData",
            timeout: theTimes,
            data:{
                "pK_EnergySaving": 0,
                "fK_Enterprise_Saving": EnterpriseID,
                "enterpriseName": EnterpriseName,
                "f_ProjectName": postArr[0],
                "f_ProjectNum": postArr[1],
                "f_ProjectContent": postArr[2],
                "f_ProjectPrice": postArr[3],
                "f_StartDate": postArr[4],
                "f_EndDate": postArr[5],
                "f_CheckAcceptDate": postArr[6],
                "f_InvolveBranch": postArr[7],
                "f_Department": postArr[8],
                "f_DirectorName": postArr[9],
                "f_DepartmentPhone": postArr[10],
                "f_linkPhone": postArr[11],
                "f_Executor": postArr[12],
                "f_ExecutorName": postArr[13],
                "f_ExecutorPhone": postArr[14],
                "userID": _userIdName
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success: function (data) {
                $('#theLoading').modal('hide');

                console.log(data);


                if(data == 3){

                    myAlter('执行失败，请联系管理员!');
                    return false;
                };


                getMainData();

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        });

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

        console.log(thePostArr);


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
                console.log(data);

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
                console.log(textStatus);

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


//获取页面初始数据
function getMainData(){

    var priceFlag = $('#energy-type').val();

    var postDate = $('#post-date').val();

    var dateArr = getPostDate(postDate);

    var title1 = $('#energy-type').find("option:selected").text();

    var title2 = $('#post-date').find("option:selected").text();

    var startDate = dateArr[1];

    var endDate = dateArr[2];


    $.ajax({
        type: 'get',
        url: IP + "/EnergySavingTrack/GetSavingDataByEnterpriseID",
        timeout: theTimes,
        data:{
            'enterpriseID' : EnterpriseID,
            'ST' : startDate,
            'ET':endDate,
            'priceFlag' : priceFlag
        },
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success: function (data) {
            $('#theLoading').modal('hide');

            console.log(data);
            return false;

            if(data.length == 0){

                myAlter('无数据!');
                return false;
            };

            getArr = data;

            //表格中的数据

            dataArrs = [];

            postArr = [];

            $('.show-title1').html(title1);
            $('.show-title2').html(title2);

            dataArrs = data;

            console.log(dataArrs);

            deepCopy(dataArrs,postArr);


            //表格中的数据
            ajaxSuccess();


            $('.header-right-lists span').html(unit);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};



getMainData();

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

    $('.datatimeblock').val('今年');

});
$('#choose-date .close').on('click',function(){

    $('.datatimeblock').val('今年');

});
//选定时间后
$('#choose-date .btn-primary').on('click',function(){

    if(!checkedNull('#choose-date')){
        return false;
    }
    var txt1 = $('#choose-date .add-input').eq(0).val();
    var txt2 = $('#choose-date .add-input').eq(1).val();

    var nowDate = getNewDate();

    if(CompareDate(txt2,nowDate) == true){
        myAlter('结束日期不能大于当前日期');
        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

        return false;
    };


    if(CompareDate(txt2,txt1) == false){
        myAlter('结束日期必须大于开始日期');
        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

        return false;
    };

    var date = txt1 + '——' + txt2;

    console.log(date);

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


