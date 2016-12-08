$(function(){
    //显示时间；
    $('.real-time').html(showStartRealTime + '到' + showStartRealTime);
    //指定楼宇为全部；
    getPointerID();
    //获取历史警报
    alarmHistory();
    //表格初始化
    table = $('#datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "paging": true,
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [
            {
                extend:'csvHtml5',
                text:'保存csv格式'
            },
            {
                extend: 'excelHtml5',
                text: '保存为excel格式',
            },
            {
                extend: 'pdfHtml5',
                text: '保存为pdf格式',
            }
        ],
        "columns": [
            {
                "title":"时间",
                "data":"dataDate",
                "render":function(data,type,row,meta){
                    return data.split('T')[0] + ' ' + data.split('T')[1];
                }
            },
            {
                "title": "支路",
                "class":"L-checkbox",
                "data":"cName"
            },
            {
                "title": "单位",
                "data":"pointerName"
            },
            {
                "title": "报警类型",
                "data":"cDtnName"
            },
            {
                "title": "报警条件",
                "data":"expression"
            },
            {
                "title": "此时数据",
                "data":"data"
            },
            {
                "title": "单位房间",
                "data":"rowDetailsExcDatas"
            },
            {
                "title": "报警等级",
                "data":"flag"
            },
            {
                "title": "阅读选择",
                "class":'L-checkbox',
                "targets": -1,
                "data": "flag",
                "render":function(data,type,row,meta){
                    if(data>0){
                        return "<div class='checker'><span class='checked'><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div>已阅读";
                    }else{
                        return "<div class='checker'><span><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div>未阅读";
                    }
                }
            },
            {
                "class":"alaLogID",
                "data":"alaLogID",
                "visible":"false"
            },
            {
                "title": "查看",
                "class":'L-button',
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-success details-control' data-alaLogID=''>显示/隐藏历史</button>"
            },
            {
                "title": "处理备注",
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-success' data-toggle='modal' data-target='#myModal'>点击处理</button>" +
                "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
                "<div class='modal-dialog'style='position: absolute;left: 50%;top:50%;margin-top: -87px;margin-left: -300px'>" +
                "<div class='modal-content'>" +
                "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel'>标题</h4><input type='text' class='modal-body'><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button><button type='button' class='btn btn-primary'>提交更改</button></div></div>" +
                "</div>" +
                "</div>" +
                "</div>"
            }
        ]
    });
    setData();
    $('#datatables tbody').on( 'click', 'input', function () {
        //console.log($(this).parents('.checker').children('.checked').length);
        var $this = $(this);
        $(this).parents('tr').css({background:'red'});
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //console.log($(this).parents('.checker').children('ckecked').length);
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    } );
    $('.logoToRead').click(function(){

        logoToRead();
    })
});
//指定能耗种类的类型为全部；
var _ajaxEcType = " ";
//指定全部报警类型为全部；
var excTypeInnderId = " ";
var pointerID = [];
function getPointerID(){
    var getPointers = JSON.parse(sessionStorage.getItem('pointers'));
    for(var i=0;i<getPointers.length;i++){
        pointerID.push(getPointers[i].pointerID)
    }
}
//实时数据（开始）；
var startRealTime = moment().format('YYYY/MM/DD') + " 00:00:00";
var endRealTime = moment().add(1,'d').format('YYYY/MM/DD') + " 00:00:00";
var showStartRealTime = moment().format('YYYY-MM-DD');
//获取历史数据
var dataArr = [];
function alarmHistory(){
    var prm = {
        'st' : startRealTime,
        'et' : endRealTime,
        'pointerIds' : pointerID,
        'excTypeInnderId' : excTypeInnderId,
        'energyType' : _ajaxEcType,
    };
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
        async:false,
        data:prm,
        success:function(result){
            console.log(result);
            var pcids = [];
            for(var i=0;i<result.length;i++){
                //dataArr.push(result[i]);
                if(!existItem(pcids,result[i])){  //没有存在相同的pointerID&&cdataID；确保pcids数组中所有pointerID和csataID不同
                    pcids.push({"pointerID":result[i].pointerID,"cdataID":result[i].cdataID});
                }
            }
            for(var i= 0,len=pcids.length,lenD=result.length;i<len;i++){ //推荐写法
                for(var j= 0;j<lenD;j++){ //遍历pcids里的pointerID和cdataID属性
                    if(pcids[i].pointerID==result[j].pointerID && pcids[i].cdataID== result[j].cdataID){
                        dataArr.push(result[j]);  //因为后台返回的数据是降序，所以只要有一个就push到dataArr中
                        break;  //跳处循环；
                    }
                }
            }

        }
    });
}
//去重
function existItem(arr,item){ //遍历数组中的所有数，如果有相同的pointerID&&cdataID，返回true，如果没有的话返回false；
    for(var i= 0,len=arr.length;i<len;i++){
        if(arr[i].pointerID==item.pointerID && arr[i].cdataID==item.cdataID){
            return true;
        }
    }
    return false;
}
function setData(){
    var table = $("#datatables").dataTable();
    table.fnClearTable();
    table.fnAddData(dataArr);
    table.fnDraw();
}
//标识阅读功能
var logoToReadID = [];
function logoToRead (){
    logoToReadID = [];
    var pitchOn = $('.choice').parent('.checked'); //包含结果的数组的object
    for(var i=0;i<$('.choice').length;i++){
        //if($('.choice').eq(i).parent('.checked'))
        if($('.choice').eq(i).parent('.checked').length != 0){
            logoToReadID.push($('.choice').eq(i).parent('.checked').parents('tr').children('.alaLogID').html())
        }
    }
    var alaLogIDs = {
        alaLogIDs:logoToReadID
    }
    $.ajax(
        {
            'type':'post',
            'url':sessionStorage.apiUrlPrefix + 'Alarm/UpdateAlarmReaded',
            'async':false,
            'data':alaLogIDs,
            'success':function(result){
                console.log(result);
            }
        }
    )
}