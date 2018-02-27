/**
 * Created by admin on 2017/12/19.
 */
$(function(){

    //获取员工信息
    getPersonMessage();

    //点击发送按钮
    $('#selected').on('click',function(){


        //判断用户是否有发送短信权限
        if(sessionStorage.userAuth){
            var userAuth = sessionStorage.userAuth;
            if(userAuth.charAt(30)!="1"){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'当前用户无发送短信权限', '');

                return false;
            }

        }

        //清空要传递的人员信息数组
        postPersonMessageArr.length = 0;

        var length = $('#personal-table .tableCheck').length;


        //获取ID
        for(var i=0; i<length; i++){

            if( $('#personal-table .tableCheck').eq(i).is(':checked')){
                //获取勾选的ID
               var  alterID = $('#personal-table .tableCheck').eq(i).parents('tr').find('.theHidden').html();
                $(personMessageArr).each(function(i,o){

                    if(alterID == o.lmid){

                        postPersonMessageArr.push(o);
                    }
                });

            }
        }

        //无要发送的人员时
        if(postPersonMessageArr.length == 0){

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请选择发送的人员', '');

            return false;
        }

        //发送短信
        getOneMessage();
    });


});

//存放所有人员信息
var personMessageArr = [];

//存放要传递的人员信息
 var postPersonMessageArr = [];


var table = $('#personal-table').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": false,
    'searching':true,
    "info":false,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'search':'搜索:',
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
            title:"<input type='checkbox' class='check-all'/>选择",
            "data": null,
            render:function(data, type, row, meta){

                return "<input type='checkbox' class='tableCheck'/>"

            }
        },
        {
            title:'编号',
            data:"index",
            render:function(data, type, row, meta){


                return meta.row + 1;

            }
        },
        {
            title:'本行ID',
            data:"lmid",
            class:'theHidden'
        },
        {
            title:'姓名',
            data:"lmName"
        },
        {
            title:'联系电话',
            data:"lmmp",
            render:function(data, type, full, meta){
                if(!data){
                    return '';
                }
                if(data.length > 12){
                    return '<span title="'+data+'">'+data.substring(0,12)+'...</span>'
                }else{
                    return '<span title="'+data+'">'+data+'</span>'
                }


            }
        },
        {
            title:'所属单位',
            data:"lmEprName"
        }

    ]
});

//_table = $('#dateTables').dataTable();

/*---------------------------------otherFunction------------------------------*/

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPersonMessage(){

    //判断用户是否有发送短信权限
    if(sessionStorage.userAuth){
        var userAuth = sessionStorage.userAuth;
        if(userAuth.charAt(30)!="1"){

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'当前用户无发送短信权限', '');

            $('#selected').attr('disabled','disabled');

            return false;
        }

    }

    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'Alarm/GetNoteLinkMans',
        data:{
            "eprName":''
        },
        beforeSend: function () {

            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        success:function(result){
            $('#theLoading').modal('hide');

            //console.log(result);

            //判断是否返回数据
            if(result == null ||　result.length == 0){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'无数据', '');

                return false;

            }

            personMessageArr = result;
            //
            //表格赋值
            _datasTable($('#personal-table'),result);

        },
        error:function(jqXHR, textStatus, errorThrown){

            $('#theLoading').modal('hide');

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');

            }else{

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');

            }


        }
    })
};

//根据ID获取一条数据 用于编辑
function getOneMessage(){

    //获取短信内容
    var messageContent = $('.condition-query textarea').val();

    //短信内容不能为空
    if(messageContent == ''){

        _moTaiKuang($('#myModal2'),'提示', true, 'istap','请填写发送内容' , '');

        return false;

    }


    var ecParams = {

        "noteLinkMans":postPersonMessageArr,
        "noteMessage":  messageContent,
        "userID": _userIdNum
    };

    console.log(ecParams);

    //return false;

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'Alarm/PostManToNote',
        data:ecParams,
        timeout:_theTimes,
        success:function(result){
            $('#theLoading').modal('hide');

            console.log(result);

            //判断是否返回数据
            if(result == 99){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'发送成功', '');

                return false;
            }

            //判断是否返回数据
            if(result == 3){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'发送失败', '');

                return false;
            }

            //判断是否返回数据
            if(result == 19){

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'短信内容超出上限', '');

                return false;
            }

            //判断是否返回数据

            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,result, '');


        },
        error:function(jqXHR, textStatus, errorThrown){

            $('#theLoading').modal('hide');

            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');

            }else{

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');

            }


        }
    })
};

//点击表格头部选择框 则勾选全部
$('#personal-table').on('click','.check-all',function(){

    if($(this).is(':checked')) {

        for(var i=0; i<$('.tableCheck').length; i++){

            $('.tableCheck').eq(i).prop('checked','checked');
        }
    }else{
        for(var i=0; i<$('.tableCheck').length; i++){

            $('.tableCheck').eq(i).prop('checked',false);
        }
    }
});




