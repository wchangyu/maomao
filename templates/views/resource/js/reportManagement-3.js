$(function (){
    /*-------------------------全局变量----------------------------*/
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().startOf('month').format('YYYY/MM/DD');
    var _initEnd = moment().endOf('month').format('YYYY/MM/DD');
    //显示时间
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //实际发送时间
    var realityStart;
    var realityEnd;
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    /*-------------------------表格初始化--------------------------*/
    //页面表格
    var _table = $('#scrap-datatables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            //"sInfoFiltered": "（数据库中共为 _MAX_ 条记录）",
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs',
                header:true
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'姓名',
                data:'shouliren'
            },
            {
                title:'接工量',
                data:'gdNum'
            },
            {
                title:'电话报修量',
                data:'gdDh'
            },
            {
                title:'自主登记量',
                data:'gdZz'
            },
            {
                title:'系统工单',
                data:'gdXt'
            }
        ]
    });
    _table.buttons().container().appendTo($('.excelButton'),_table.table().container());
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //给表格的标题赋时间
    $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + _initStart + '——' + _initEnd);
    /*------------------------echarts初始化-----------------------*/
    //柱状图
    myChart = echarts.init(document.getElementById('echarts'));
    option = {
        title : {
            text: '调度员工作量统计分析',
            textStyle:{
                color:'#777',
                fontFamily:'微软雅黑',
                fontSize:'23',
                fontWeight:'normal'
            },
            left:'center'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['接工量','电话报修','自主登记'],
            left:'left'
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'接工量',
                type:'bar',
                barMaxWidth: '60',
                data:[]
            },
            {
                name:'电话报修',
                type:'bar',
                barMaxWidth: '60',
                data:[]
            },
            {
                name:'自主登记',
                type:'bar',
                barMaxWidth: '60',
                data:[]
            }
        ]
    };
    //饼图
    myChart1 = echarts.init(document.getElementById('echarts1'));
    option1 = {
        title : {
            text: '报修方式统计占比',
            textStyle:{
                color:'#777',
                fontFamily:'微软雅黑',
                fontSize:'23',
                fontWeight:'normal'
            },
            left:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['自主登记量','电话报修量']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:35, name:'自主登记量'},
                    {value:310, name:'电话报修量'},
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    /*-------------------------获取表格数据-----------------------*/
    conditionSelect();
    /*--------------------------按钮功能------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //判断起止时间是否为空
        if( $('.min').val() == '' || $('.max').val() == '' ){
            $('#myModal2').find('.modal-body').html('起止时间不能为空');
            moTaiKuang($('#myModal2'));
        }else {
            //结束时间不能小于开始时间
            if( $('.min').val() > $('.max').val() ){
                $('#myModal2').find('.modal-body').html('起止时间不能大于结束时间');
                moTaiKuang($('#myModal2'));
            }else{
                //给表格的标题赋时间
                $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + $('.min').val() + '——' + $('.max').val());
                conditionSelect();
            }
        }
    })
    //重置按钮
    $('.resites').click(function(){
        //时间选为当天，其他输入框置为空
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        $('.min').val(_initStart);
        $('.max').val(_initEnd);
    })
    //提示框的确定
    $('.confirm1').click(function(){
        $('#myModal2').modal('hide');
    })
    /*-------------------------echarts图自适应------------------*/
    window.onresize = function () {
        if(myChart && myChart1){
            myChart.resize();
            myChart1.resize();
        }
    }
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
    /*----------------------------方法------------------------------*/
    //查询方法
    function conditionSelect(){
        //获取所有input框的值
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        realityStart = filterInput[0] + ' 00:00:00';
        realityEnd = moment(filterInput[1]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var prm = {
            'gdSt':realityStart,
            'gdEt':realityEnd,
            'wxKeshi':'',
            'bxKeshi':'',
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDRptDdzx',
            data:prm,
            success:function(result){
                //给表格赋值
                if(result.length == 0){
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                    //echarts图
                    $('#echarts').hide();
                    $('#echarts1').hide();
                }else{
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                    table.fnAddData(result);
                    table.fnDraw();
                    //echarts图
                    $('#echarts').show();
                    $('#echarts1').show();
                    //给柱状图赋值
                    var xZhou = [];
                    var jgData = [];
                    var dhData = [];
                    var zzData = [];
                    for(var i=0;i<result.length;i++){
                        xZhou.push(result[i].shouliren);
                        //接工量对象
                        jgData.push(result[i].gdNum);
                        dhData.push(result[i].gdDh);
                        zzData.push(result[i].gdZz);
                    }
                    var yZhou = [jgData,dhData,zzData];
                    for(var i=0;i<yZhou.length;i++){
                        option.series[i].data = yZhou[i]
                    }
                    option.xAxis[0].data = xZhou;
                    myChart.setOption(option);
                    //给饼图（只计算电话报修量总量、自主登记量总量）
                    var dhTotal = 0;
                    var zzTotal = 0;
                    console.log(result);
                    for(var i=0;i<result.length;i++){
                        dhTotal += result[i].gdDh;
                        zzTotal += result[i].gdZz;
                    }
                    option1.series[0].data[1].value = dhTotal;
                    option1.series[0].data[0].value = zzTotal;
                    myChart1.setOption(option1);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })
    }
    //提示框
    //模态框自适应
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        //$('#myModal2').find('.modal-body').html('起止时间不能为空');
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
    }
})