$(function(){
    var table = $('#datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 1 页 / 总 1 页',
            'infoEmpty': '没有数据'
        },
        "dom":'B<"clear">lfrtip',
        'buttons': [
            {
                extend:'csvHtml5',
                text:'保存csv格式'
            },
            {
                extend: 'excelHtml5',
                text: '保存为excel格式'
            },
            {
                extend: 'pdfHtml5',
                text: '保存为pdf格式'
            }
        ],
        "ajax": "./work_parts/data/araming.json",
        "columns": [
            {
                "title": "编号",
                "class":"L-checkbox",
                "data":"serialNumber"
            },
            {
                "title": "名称",
                "data":"name",
                "class":"cname"
            },
            {
                "title": "报警类型",
                "data":"alarmType"
            },
            {
                "title": "报警条件",
                "data":"warningCondition"
            },
            {
                "title": "此时数据",
                "data":"atThisPointThedata"
            },
            {
                "title": "单位房间",
                "data":"uniteRoom"
            },
            {
                "title": "报警等级",
                "data":"alarmLevel"
            },
            {
                "title": "查看",
                "data":"seeing"
            },
            {
                "title": "阅读选择",
                "class":'L-checkbox',
                "targets": -1,
                "data": null,
                "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>未阅读"
            },
            {
                "title": "操作",
                "class":'L-button',
                //"data":"readingSelection",
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-success details-control'>显示/隐藏历史</button>"
            },
            {
                "title": "处理备注",
                "targets": -1,
                "data": null,
                "defaultContent": "<button class='btn btn-success' data-toggle='modal' data-target='#myModal'>点击处理</button>" +
                    "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
                    "<div class='modal-dialog' style='position: absolute;left: 50%;top:50%;margin-top: -87px;margin-left: -300px'>" +
                    "<div class='modal-content'>" +
                    "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel'>标题</h4><input type='text' class='modal-body'><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button><button type='button' class='btn btn-primary'>提交更改</button></div></div>" +
                "</div>" +
                "</div>" +
                "</div>"
            }
        ]
    });
    $('#datatables tbody').on('click', 'td .details-control', function () {
        var allData = [];
        $.ajax({
            type:'post',
            url:'./work_parts/data/history.json',
            async: false,
            success:function(result){
                console.log(result);
                for(var i=0;i<result.data.length;i++){
                    allData.push(result.data[i]);
                }
            }
        })
        //console.log(allData);["","","","",""];
        var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;
        var row = table.row( tr );
        //console.log(row.data())  //araming.json的第一行数据  object{"":"","":"","":""}
        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(allData) ).show();
            tr.addClass('shown');
        }
    } );
    var creatCheckBox = '<input type="checkbox">';
    $('.L-checkbox').prepend(creatCheckBox);
    $('#datatables tbody').on( 'click', 'input', function () {
        console.log($(this).parents('.checker').children('.checked').length);
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
            //console.log($(this).parents('.checker').children('ckecked').length);
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    } );
    $('.btn').click(function(){
        //var datatabless =
    })
})
function format ( d ) {
    var theader = '<table class="table">' +
        '<thead><tr><td>时间</td><td>编号</td><td>名字</td><td>报警类型</td><td>报警环境</td></tr></thead>';
    var theaders = '</table>';
    var tbodyer = '<tbody>'
    var tbodyers = '</tbody>';
    var str;
    for(var i=0;i< d.length;i++){
        str += '<tr><td>' + d[i].time +
            '</td><td>' + d[i].serialNumber +
            '</td><td>' + d[i].name +
            '</td><td>' + d[i].alarmType +
            '</td><td>' + d[i].warningCondition +
            '</td></tr>'
    }
    return theader + tbodyer + str + tbodyers + theaders;
}
