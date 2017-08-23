/**
 * Created by admin on 2017/8/22.
 */
$(document).ready(function(){

    //知识浏览表格
    $('#browse-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页  共 _TOTAL_ 条数据',
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

        ],
        //'ajax':'./work_parts/data/assetsbrow.json',
        "columns": [
            {
                title:'知识编号',
                data:'',
                class:'hidden',
                render:function(data, index, row, meta){
                    return '00' + meta.row;
                }
            },
            {
                title:'知识ID',
                data:'pK_KnowledgeID',
                class:'hidden'
            },
            {
                title:'知识标题',
                data:'f_KnowleTitle'
            },
            {
                title:'摘要',
                data:'f_KnowleDigest'
            },
            {
                title:'关键词',
                data:'f_KnowleKeyword'
            },
            {
                title:'附件个数',
                data:'knowLedgeFiles',
                render:function(data, type, row, meta){

                    var length = data.length;

                    return length;
                }

            },
            {
                title:'录入时间',
                data:'f_KnowleCreateDT'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
            }
        ]
    });
    _table =$('#browse-datatables').dataTable();

    //查询功能
    $('.condition-query .btn1').on('click',function(){

        getShowKnowledgeData();
    });

    //查看知识库
    $('#browse-datatables_wrapper tbody').on('click','.option-see',function(){


        //获取当前id
        var _postID = $(this).parents('tr').find('td').eq(1).html();

        //根据ID获取后台数据
        $.ajax({
            type: 'get',
            url: _urls + "YWKnowledge/GetOneKnowledge",
            timeout: theTimes,
            data:{
                'knowledgeID': _postID
            },
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success: function (data) {
                $('#theLoading').modal('hide');
                $('#see-myModal').modal('show');
                $('#see-myModal .btn-primary').removeClass('hidden');
                console.log(data);
                //标题
                $('#see-myModal .knowledge-title').val(data.f_KnowleTitle);
                //摘要
                $('#see-myModal .textarea1').val(data.f_KnowleDigest);
                //关键字
                $('#see-myModal .textarea2').val(data.f_KnowleKeyword);
                //内容
                $('#see-myModal .textarea3').val(data.f_KnowleContent);
                //附件
                var fileHtml = '';
                if(data.knowLedgeFiles.length == 0){
                    $('#see-myModal .btn-primary').addClass('hidden');
                }
                $(data.knowLedgeFiles).each(function(i,o){

                    var fileName = o.f_FileAllPath.split("/").pop();

                    var string1 = "bmp,jpg, png ,tiff,gif,pcx,tga,exif,fpx,svg,psd";

                    console.log(o.f_FilePath);

                    if(string1.indexOf(o.f_FileExtension) != -1){
                        fileHtml += '<div id="' + o.pK_KnowledgeFileID + '" class="file-item thumbnail">' +
                            '<img src="'+ o.f_FilePath+'">' +
                            '<div class="info">' + fileName + '</div>' +
                            '<div><a href="'+o.f_FilePath+'" title="右击文件另存为">下载</a></div>'+
                            '</div>'

                    }else{
                        fileHtml += '<div id="' + o.pK_KnowledgeFileID  + '" class="file-item thumbnail">' +
                            '<span>不能预览</span>' +
                            '<div class="info">' +  fileName + '</div>' +
                            '<div><a href="'+o.f_FilePath+'" title="右击文件另存为">下载</a></div>'+
                            '</div>'
                    }


                });
                //把附件放到页面中
                $('#see-myModal .uploader-list-show').html(fileHtml);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        });

    });

});

//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");

//获取用户名
var _userIdName = sessionStorage.getItem('userName');

//页面展示数据
var _knowledgeDataArr = [];

////对表格进行重绘
//ajaxSuccess1(_knowledgeDataArr);

//获取后台初始数据

getShowKnowledgeData();

function getShowKnowledgeData(){

    //获取关键字
    var searchContent = $('.top-key-word').val();
    //获取搜索项
    var searchItemArr = [];

    for(var i=0; i<$('.rct-form-control').length; i++){
        if($('.rct-form-control').eq(i).is(':checked')){

            searchItemArr.push($('.rct-form-control').eq(i).val())
        }
    };

    console.log(searchItemArr);


    $.ajax({
        type: 'get',
        url: _urls + "YWKnowledge/GetSearchKnowledges",
        timeout: theTimes,
        data:{
            "searchModel.searchContent" : searchContent,
            "searchModel.searchItems": searchItemArr
        //
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
            _knowledgeDataArr = data;

            //对表格进行重绘
            ajaxSuccess1(_knowledgeDataArr)

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });
};

//点击回车键时触发
$(document).on('keydown',function(e){
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;

    if(code == 13){
        $('.btn1').click();
        return false;
    }
});

//给选中的行加高亮属性
$('#browse-datatables tbody').on('click','tr',function(){

    $('#browse-datatables tbody tr').removeClass('tables-hover');

    $(this).addClass('tables-hover');
});
