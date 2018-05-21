$(function(){

    /*----------------------------------------------创建vue对象---------------------------------------*/

    //vue对象
    var gdObj = new Vue({
        'el':'#gdDetail',
        data:{
            gdtype:'',
            xttype:'',
            bxtel:'',
            bxkesh:'',
            bxren:'',
            gztime:'',
            wxshx:'',
            sbtype:'',
            sbnum:'',
            sbname:'',
            azplace:'',
            wxbz:'',
            gzplace:'',
            wxcontent:'',
            gzcontent:'',
            //协助科室
            xzbz:''
        }
    });

    //所有的选框均不可输入，只做展示
    $('input').attr('disabled','disabled');
    $('textarea').attr('disabled','disabled');

    //材料列表
    var clListCol = [
        {
            title:'名称',
            data:'wxClName'
        },
        {
            title:'规格型号',
            data:'size',
            className:'bjbm'
        },
        {
            title:'数量',
            data:'clShul'
        },
        {
            title:'单价（元）',
            data:'wxClPrice'
        },
        {
            title:'金额（元）',
            data:'wxClAmount'
        }
    ];
    //表格初始化
    tableInit($('#cl-list'),clListCol,'2','','','');

    //执行人表格
    var fzrListCol = [
        {
            title:'工号',
            data:'wxRen',
            className:'workNum'
        },
        {
            title:'执行人名称',
            data:'wxRName'
        },
        //{
        //    title:'职位',
        //    data:'pos'
        //},
        {
            title:'联系电话',
            data:'wxRDh'
        }
    ];
    //表格初始化
    tableInit($('#fzr-list'),fzrListCol,'2','','','');

    tableInit($('#fzr-listX'),fzrListCol,'2','','','');

    getMessageToShow();

    //维修工时费表格
    var feeCol = [

        {
            title:'项目编码',
            data:'wxCl'
        },
        {
            title:'项目名称',
            data:'wxClName'
        },
        {
            title:'项目类别',
            data:'wxclassname'
        },
        {
            title:'工作费用',
            data:'wxClPrice',
            render:function(data, type, full, meta){
                return data.toFixed(2)
            }

        },
        {
            title:'数量',
            data:'clShul'
        },
        {
            title:'备注',
            data:'memo'
        }

    ]

    tableInit($('#fee-list'),feeCol,'2','','','',true);

    //获取数据
    function getMessageToShow(){
        //从地址栏获取需要传递给后台的数据
        var _prm = window.location.search;
        var splitPrm = _prm.split('&');
        //工单号
        var _gdCode = splitPrm[0].split('=')[1];
        //var _gdState = splitPrm[1].split('=')[1];
        //工单重派值
        var _gdCircle = splitPrm[1].split('=')[1];

        var prm = {
            "gdCode": _gdCode,
            //"gdZht": _gdState,
            "wxKeshi": "",
            "userID": _userIdNum,
            "userName":_userIdName,
            'gdCircle':_gdCircle
        };
        $.ajax({
            'type':'post',
            'url':_urls + 'YWGD/ywGDGetDetail',
            'data':prm,
            'success':function(result){
                //获取工单类型
                var gdType = '普通';
                if(result.gdJJ == 1){
                    gdType = '快速'
                }

                gdObj.gdtype = gdType;
                //系统类型
                gdObj.xttype = result.wxShiX;
                //报修电话
                gdObj.bxtel = result.bxDianhua;
                //报修科室
                if(result.bxKeshi == '请选择'){
                    gdObj.bxkesh = '';
                }else{
                    gdObj.bxkesh = result.bxKeshi;
                }
                //报修人
                gdObj.bxren = result.bxRen;
                //发现时间
                gdObj.gztime = result.gdFsShij;
                //维修事项
                gdObj.wxshx = result.wxXm;
                //设备类型
                gdObj.sbtype = result.dcName;
                //设备编码
                gdObj.sbnum = result.wxShebei;
                //设备名称
                gdObj.sbname = result.dName;
                //安装地点
                gdObj.azplace = result.installAddress;
                //维修班组
                gdObj.wxbz = result.wxKeshi;
                //故障位置
                gdObj.gzplace = result.wxDidian;
                //维修内容
                gdObj.wxcontent = result.wxBeizhu;
                //故障描述
                gdObj.gzcontent = result.bxBeizhu;
                //选择部门
                if(result.bxKeshi == '请选择'){
                    $('#depart').val('');
                }else{
                    $('#depart').val(result.wxKeshi);
                }
                $('#depart').val(result.wxKeshi);
                //验收人
                if(result.yanShouRenName == '请选择'){
                    $('#receiver').val('');
                }else{
                    $('#receiver').val(result.yanShouRenName);
                }
                //工时费
                //$('#hourFee').val(result.gongShiFee);
                //合计费用
                //$('#total').val(result.gdFee);

                _imgNum = result.hasImage;

                _imgBJNum = result.hasBjImage;

                //执行人表格
                var fzrArr = result.wxRens;
                _datasTable($('#fzr-list'),fzrArr);

                //右侧处理记录
                logInformation(0);

                //满意度或者申诉理由
                if(result.gdZht == 11){
                    $('.change-text').html('申诉理由');

                    $('#pingjia1').hide();

                    $('#pingjia').val(result.shenSuMemo);
                }else{
                    $('.change-text').html('满意度');
                    if(result.pingJia ==''){
                        $('#pingjia1').hide();
                    }else{
                        $('#pingjia1').show();
                        $('#pingjia1').html(getAppraise(result.pingJia));
                    }
                    $('#pingjia').val(result.pjBz);
                }


                var clArr = result.wxCls;

                //材料arr

                var clListArr = [];

                //费用arr
                var feeListArr = [];

                for(var i=0;i<clArr.length;i++){

                    if(clArr[i].type == 0){

                        //材料
                        clListArr.push(clArr[i]);


                    }else if( clArr[i].type == 1 ){

                        //费用
                        feeListArr.push(clArr[i]);

                    }

                }

                if(clListArr.length > 0){
                    _datasTable($('#cl-list'),clListArr);
                }

                //材料小计

                var clMoney = 0;

                for(var k=0;k<clListArr.length;k++){

                    clMoney += Number(clListArr[k].wxClAmount);
                }

                $('#total').val(clMoney.toFixed(2));

                //维修费用
                var feeMoney = result.gongShiFee;

                $('#totalFee').val(feeMoney.toFixed(2));

                _datasTable($('#fee-list'),feeListArr);

                //总计
                $('#zFee').val(result.gdFee.toFixed(2));

            },
            'error':function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

        //协助信息
        assistFun(_gdCode);

    };

    //获取日志信息（备件logType始终传2）
    function logInformation(logType){
        //从地址栏获取需要传递给后台的数据
        var _prm = window.location.search;
        var splitPrm = _prm.split('&');
        //工单号
        var _gdCode = splitPrm[0].split('=')[1];
        //var _gdState = splitPrm[1].split('=')[1];
        //工单重派值
        var _gdCircle = splitPrm[1].split('=')[1];
        var gdLogQPrm = {
            "gdCode": _gdCode,
            "logType": logType,
            "userID": _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetLog',
            data:gdLogQPrm,
            success:function(result){
                if(logType == 2){
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.deal-with-list').empty();
                    $('.deal-with-list').append(str);
                }else if(logType == 1){
                    var str = '';
                    for(var i=0;i<result.length;i++){
                        str += '<li><span class="list-dot"> </span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;' + result[i].logTitle + '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }else{
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //查看进程
    $('#viewProgress').click(function(){

        _moTaiKuang($('#myModal'), '处理记录', 'flag','','','');

    })
})

var _gdCode = window.location.search.split('=')[1].split('&')[0];

//获取评价信息
function getAppraise(num){
    if(num == 1){
        return '很差'
    }else if(num == 2){
        return '差'
    }else if(num == 3){
        return '一般'
    }else if(num == 4){
        return '好'
    }else if(num == 5){
        return '很好'
    }
}

//表格初始化
function tableInit(tableId,col,buttons,flag,fnRowCallback,drawCallback){
    var buttonVisible = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs'
        }
    ];
    var buttonHidden = [
        {
            extend: 'excelHtml5',
            text: '导出',
            className:'saveAs hiddenButton'
        }
    ];
    if(buttons == 1){
        buttons = buttonVisible;
    }else{
        buttons =  buttonHidden;
    }
    var _tables = tableId.DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        "iDisplayLength":50,//默认每页显示的条数
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            //'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //'info':'',
            //'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        'buttons':buttons,
        "columns": col,
        "fnRowCallback": fnRowCallback,
        "drawCallback":drawCallback
    });
    if(flag){
        _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
    }

}

//获取协助信息
function assistFun(gdCode){

    $.ajax({

        type:'post',

        url:_urls + 'YWGD/ywGDFZGetDetail',

        timeout:_theTimes,

        data:{

            'gdCode':gdCode

        },

        success:function(result){

            //维修科室
            $('#xzbz').val(result.wxKeshi);

            $('#departX').val(result.wxKeshi);
            //协助执行人
            _datasTable($('#fzr-listX'),result.wxRens);

        },

        error:_errorFun

    })

}

//获取工单维修项目
function feeFun(){

    var prm = {

        //工单号
        gdCode:'',
        //用户id
        "userID": _userIdNum,
        //用户名
        "userName": _userIdName

    }

    $.ajax({

        type:'post',

        url:_urls + '',

        data:prm,

        timeout:_theTimes,

        success:function(result){

            console.log(result);

        },

        error:function(jqXHR, textStatus, errorThrown){

            console.log(jqXHR.responseText);

        }

    })

}


