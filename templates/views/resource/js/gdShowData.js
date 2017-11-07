$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });
    //设置初始时间
    var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');
    var _initEnd = moment().format('YYYY/MM/DD');

    /*--------------------------表格初始化---------------------------------------*/
    //页面表格
    var table = $('#scrap-datatables').DataTable(   {
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "bStateSave":true,
        "sScrollY": '515px',
        "bPaginate": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [

        ],
        "dom":'t<"F"lip>',
        "iDisplayLength":10,//默认每页显示的条数
        "columns": [
            //{
            //    title:'工单号',
            //    data:'gdCode',
            //    render:function(data, type, row, meta){
            //        return '<span class="gongdanId" gdCode="' + row.gdCode +
            //            '"' + "gdCircle=" + row.gdCircle +
            //            '></span><a href="productionOrder_see.html?gdCode=' +  row.gdCode +  '&userID=' + _userIdNum + '&userName=' + _userIdName + '&gdZht=' + row.gdZht + '&gdCircle=' + row.gdCircle +
            //            '"' +
            //            'target="_blank">' + data + '</a>'
            //    }
            //},
            {
                title:'工单号',
                data:'gdCode',
                render:function(data, type, row, meta){
                    return '<span class="gongdanId" gdCode="' + row.gdCode +
                        '"' + "gdCircle=" + row.gdCircle +
                        '></span><a href="../gongdanxitong/gdDetails.html?gdCode=' +  row.gdCode + '&gdCircle=' + row.gdCircle +
                        '"' +
                        'target="_blank">' + data + '</a>'
                }

            },
            //{
            //    title:'工单类型',
            //    data:'gdJJ',
            //    render:function(data, type, full, meta){
            //        if(data == 0){
            //            return '普通'
            //        }if(data == 1){
            //            return '快速'
            //        }
            //    }
            //},
            {
                title:'工单状态',
                data:null,
                className:'gongdanZt',
                render:function(data, type, full, meta){
                    return '已完成'
                }
            },
            //{
            //    title:'任务级别',
            //    data:'gdLeixing',
            //    render:function(data, type, full, meta){
            //        if(data == 1){
            //            return '一级任务'
            //        }if(data == 2){
            //            return '二级任务'
            //        }if(data == 3){
            //            return '三级任务'
            //        }if(data == 4){
            //            return '四级任务'
            //        }
            //    }
            //},
            {
                title:'工单状态值',
                data:'gdZht',
                className:'ztz'
            },
            //{
            //    title:'系统名称',
            //    data:'wxShiX'
            //},
            {
                title:'维修班组',
                data:'wxKeshi'
            },
            {
                title:'维修事项',
                data:'wxXm'

            },
            {
                title:'故障位置',
                data:'wxDidian'
            },
            {
                title:'故障描述',
                data:'bxBeizhu'
            },
            {
                title:'报修人',
                data:'bxRen'
            },
            //{
            //    title:'最新处理情况',
            //    data:'lastUpdateInfo'
            //},
            //{
            //    title:'受理时间',
            //    data:'shouLiShij'
            //},
            //{
            //    title:'故障发生时长',
            //    data:'timeSpan'
            //},
            {
                title:'关单人',
                data:'pjRenName'
            },
            {
                title:'维修人',
                data:'wxUserNames',
                render:function(data, type, full, meta){
                    return '<span class="wxUser" title="'+data+'">'+data+'</span>'
                }
            },
            //{
            //    title:'操作',
            //    "targets": -1,
            //    "data": null,
            //    "className":'noprint',
            //    "defaultContent": "<span class='data-option option-edit btn default btn-xs green-stripe'>查看</span>"
            //}
        ]
    });
    /*--------------------------echart初始化---------------------------------------*/
    var myChart = echarts.init(document.getElementById('energy-demand'));
    var myChart1 = echarts.init(document.getElementById('energy-demand1'));
    var myChart2 = echarts.init(document.getElementById('energy-demand2'));

    var myChart4 = echarts.init(document.getElementById('energy-demand4'));
    var myChart5 = echarts.init(document.getElementById('energy-demand5'));
    var myChart6 = echarts.init(document.getElementById('energy-demand6'));

    var myChart7 = echarts.init(document.getElementById('energy-demand7'));
    var myChart8 = echarts.init(document.getElementById('energy-demand8'));
    var myChart9 = echarts.init(document.getElementById('energy-demand9'));

// 指定图表的配置项和数据
    option = {
        title:{
            left:'center',
            top:'35%',
            text:'70%',
            textStyle:{
                fontSize:'14',
                color:'#e382a5'
            },
            subtext:['\n好'],
            subtextStyle:{
                fontSize:'14',
                color:'#e382a5'
            }

        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'工单',
                type:'pie',
                radius: ['70%', '90%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                data:[
                    {   value:335,
                        name:'已解决',
                        itemStyle : {
                            normal : {
                                color:'#e382a5',
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        }
                    },
                    {   value:120,
                        name:'未解决',
                        itemStyle : {
                            normal : {
                                color:'#bdc3bf',
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        }
                    }
                ]
            }
        ]
    };

    option1 = {
        title:{
            left:'center',
            top:'35%',
            text:'70%',
            textStyle:{
                fontSize:'14',
                color:'#3f8f9a'
            },
            subtext:['\n一般'],
            subtextStyle:{
                fontSize:'14',
                color:'#3f8f9a'
            }

        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'工单',
                type:'pie',
                radius: ['70%', '90%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                data:[
                    {   value:335,
                        name:'已解决',
                        itemStyle : {
                            normal : {
                                color:'#3f8f9a',
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        }
                    },
                    {   value:120,
                        name:'未解决',
                        itemStyle : {
                            normal : {
                                color:'#bdc3bf',
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        }
                    }
                ]
            }
        ]
    };

    option2 = {
        title:{
            left:'center',
            top:'35%',
            text:'70%',
            textStyle:{
                fontSize:'14',
                color:'#8c8c8c'
            },
            subtext:['\n差'],
            subtextStyle:{
                fontSize:'14',
                color:'#8c8c8c'
            }

        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'工单',
                type:'pie',
                radius: ['70%', '90%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                data:[
                    {   value:335,
                        name:'已解决',
                        itemStyle : {
                            normal : {
                                color:'#8c8c8c',
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        }
                    },
                    {   value:120,
                        name:'未解决',
                        itemStyle : {
                            normal : {
                                color:'#bdc3bf',
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        }
                    }
                ]
            }
        ]
    };

    myChart.setOption(option);
    myChart1.setOption(option1);
    myChart2.setOption(option2);

    myChart4.setOption(option);
    myChart5.setOption(option1);
    myChart6.setOption(option2);

    myChart7.setOption(option);
    myChart8.setOption(option1);
    myChart9.setOption(option2);
    //数据加载
    conditionSelect();

    /*----------------------------方法-----------------------------------------*/
    function conditionSelect(){

        var prm = {
            "gdCode":'',
            "gdSt":_initStart,
            "gdEt":_initEnd,
            "bxKeshi":'',
            "wxKeshi":'',
            "gdZht":'',
            "pjRen":'',
            //"shouliren": filterInput[7],
            "userID":_userIdNum,
            //故障位置
            "gdLeixing":'',
            "wxRen":'',
            "wxdidian":'',
            "isCalcTimeSpan":1,
            "userName":_userIdName
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetDJ',
            data:prm,
            async:false,
            success:function(result){
                datasTable($("#scrap-datatables"),result);
                //获取table高度
                var tableHeight = $('#scrap-datatables').height();
                if(result.length > 0){
                    var i=-1;
                    setInterval(function(){
                        i++;
                        var height = i * 520 * -1;
                        if(tableHeight + height < 0){
                            $('#scrap-datatables').css({
                                top:0
                            })
                            i = -1;
                        }else{
                            $('#scrap-datatables').css({
                                top:height+'px'
                            })
                        }
                    },10000)
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //dataTables表格填数据
    function datasTable(tableId,arr){
        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }


});