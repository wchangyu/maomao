$(function (){
    /*-------------------------全局变量----------------------------*/
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    //设置初始时间
    var _initStart = moment().format('YYYY/MM/DD');
    var _initEnd = moment().add(1,'day').format('YYYY/MM/DD');
    $('.min').val(_initStart);
    $('.max').val(_initEnd);
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    /*-------------------------表格初始化--------------------------*/
    //页面表格
    $('#scrap-datatables').DataTable({
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
                text: '保存为excel格式',
                className:'saveAs',
            }
        ],
        "dom":'B<"clear">lfrtip',
        "columns": [
            {
                title:'维修部门',
                data:'wxKeshi'
            },
            {
                title:'接工量',
                data:'gdNum'
            },
            {
                title:'完工量',
                data:'gdWgNum'
            },
            {
                title:'未完工量',
                data:'gdWwgNum'
            },
        ]
    });
    //报错时不弹出弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('')
    }
    //给表格的标题赋时间
    $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + _initStart + ' 00:00:00' + '——' + _initEnd + ' 00:00:00');
    /*------------------------echarts初始化-----------------------*/
    myChart = echarts.init(document.getElementById('echarts'));
    option = {
        title : {
            text: '维修班组工作量统计分析',
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
            data:['接工量','完工量','未完工量'],
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
                name:'完工量',
                type:'bar',
                barMaxWidth: '60',
                data:[]
            },
            {
                name:'未完工量',
                type:'bar',
                barMaxWidth: '60',
                data:[]
            }
        ]
    };
    /*-------------------------获取表格数据-----------------------*/
    conditionSelect();
    function conditionSelect(){
        //获取所有input框的值
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        console.log(filterInput);
        var prm = {
            'gdSt':filterInput[0],
            'gdEt':filterInput[1],
            'wxKeshi':'',
            'bxKeshi':'',
            'userID':_userIdName
        }
        $.ajax({
            type:'post',
            url:'http://192.168.1.196/BEEWebAPI/api/YWGD/ywGDRptWxKeshi',
            data:prm,
            success:function(result){
                console.log(result);
                //给表格赋值
                if(result.length == 0){
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                }else{
                    var table = $("#scrap-datatables").dataTable();
                    table.fnClearTable();
                    table.fnAddData(result);
                    table.fnDraw();
                }
                //给柱状图赋值
                var xZhou = [];
                var jgData = [];
                var dhData = [];
                var zzData = [];
                for(var i=0;i<result.length;i++){
                    xZhou.push(result[i].wxKeshi);
                    //接工量对象
                    jgData.push(result[i].gdNum);
                    dhData.push(result[i].gdWgNum);
                    zzData.push(result[i].gdWwgNum);
                }
                var yZhou = [jgData,dhData,zzData];
                for(var i=0;i<yZhou.length;i++){
                    option.series[i].data = yZhou[i]
                }
                option.xAxis[0].data = xZhou;
                myChart.setOption(option);
            }
        })
    }
    /*--------------------------按钮功能------------------------*/
    //查询按钮
    $('#selected').click(function(){
        //给表格的标题赋时间
        $('#scrap-datatables').find('caption').children('p').children('span').html(' ' + $('.min').val() + ' 00:00:00' + '——' + $('.max').val() + ' 00:00:00');
        conditionSelect();
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
    /*-------------------------echarts图自适应------------------*/
    window.onresize = function () {
        if(myChart){
            myChart.resize();
        }
    }
    /*----------------------------打印部分去掉的东西-----------------------------*/
    //导出按钮,每页显示数据条数,表格页码打印隐藏
    $('.dt-buttons,.dataTables_length,.dataTables_info,.dataTables_paginate').addClass('noprint')
})