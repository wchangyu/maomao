$(function(){
    /*--------------------------全局变量初始化设置----------------------------------*/
    //获得用户名
    var _userIdNum = sessionStorage.getItem('userName');
    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //获取所属班组
    var _wxBan = sessionStorage.getItem("userDepartName");
    //所属班组编码
    var _wxBanNum = sessionStorage.getItem("userDepartNum");
    //默认刷新时间
    var _refresh = sessionStorage.getItem("gongdanInterval");
    //是否有提示声音
    var _ifAutio = false;

    if(_refresh==0){
        _refresh = 1;
    }

    $('#department').html(_wxBan);
    //开始/结束时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd',     forceParse: 0
    });
    //设置初始时间
    var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');
    var _initEnd = moment().add(1,'d').format('YYYY/MM/DD');

    var _lastTime = '';

    //var _initStart = moment().format('YYYY/MM/DD HH:mm:ss');

    //var _initEnd =

    var mytime = moment().format('YYYY/MM/DD HH:mm:ss');

    formatTime(mytime);

    weekChange(mytime);

    function formatTime(time){

        var year = time.split(' ')[0].split('/')[0];

        var month = time.split(' ')[0].split('/')[1];

        var day = time.split(' ')[0].split('/')[2];

        var hour = time.split(' ')[1].split(':')[0];

        var min = time.split(' ')[1].split(':')[1];

        var str = year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + min;

        var week = moment().day();

        str += weekChange(week);

        $('.header-date').html(str);

    }

    //30秒刷新一次页面时间
    setInterval(function(){

        //刷新页面时间
        formatTime(moment().format('YYYY/MM/DD HH:mm:ss'));

    },30000);


    //echart图自适应
    //浏览器echarts自适应

    //表格自适应

    window.onresize = function () {
        if(myChart && myChart4 && myChart7){
            myChart.resize();
            myChart4.resize();
            myChart7.resize();
        }
        //固定表头的时候
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
    };

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
        "sScrollY": '548px',
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
                class:'gd-code',
                render:function(data, type, row, meta){

                    if(row.color){

                        return  '<span style="color: green">'+ data + '</span>';

                    }else if(row.gdZht == 2){

                        return  '<span style="color: #c00000">'+ data + '</span>';

                    }else if( row.gdZht == 4 ){

                        return '<span style="color: #4472c4">'+ data + '</span>';

                    }else if( row.gdZht == 5 ){

                        return '<span style="color: #ffcf00">'+ data + '</span>';

                    }else{
                        return '<span style="color: #333333">'+ data + '</span>';
                    }


                }

            },
            {
                title:'工单状态',
                data:'gdZht',
                className:'gongdanZt',
                render:function(data, type, row, meta){
                    if(row.color){

                        if (data == 1) {
                            return '待下发'
                        }
                        else if (data == 2) {
                            return '<span style="color: green">'+ '待分派' + '</span>'
                        }
                        else if (data == 3) {
                            return '待执行'
                        }
                        else if (data == 4) {
                            return '<span style="color: green">'+ '执行中' + '</span>';
                        }
                        else if (data == 5) {
                            return '<span style="color: green">'+ '等待资源' + '</span>';
                        }
                        else if (data == 6) {
                            return '待关单'
                        }
                        else if (data == 7) {
                            return '任务关闭'
                        }
                        else if (data == 11) {
                            return '申诉'
                        }
                        else if (data == 999) {
                            return '任务取消'
                        }

                    }else if (data == 1) {
                        return '待下发'
                    }
                    else if (data == 2) {
                        return '<span style="color: #c00000">'+ '待分派' + '</span>'
                    }
                    else if (data == 3) {
                        return '待执行'
                    }
                    else if (data == 4) {
                        return '<span style="color: #4472c4">'+ '执行中' + '</span>';
                    }
                    else if (data == 5) {
                        return '<span style="color: #ffcf00">'+ '等待资源' + '</span>';
                    }
                    else if (data == 6) {
                        return '待关单'
                    }
                    else if (data == 7) {
                        return '任务关闭'
                    }
                    else if (data == 11) {
                        return '申诉'
                    }
                    else if (data == 999) {
                        return '任务取消'
                    }
                }
            },

            {
                title:'报修科室',
                data:'bxKeshi',
                render:function(data, type, row, meta){
                    if(row.color){

                        return  '<span style="color: green">'+ data + '</span>';

                    }else if(row.gdZht == 2){

                        return '<span style="color: #c00000">'+ data + '</span>';

                    }else if( row.gdZht == 4 ){

                        return '<span style="color: #4472c4">'+ data + '</span>';

                    }else if( row.gdZht == 5 ){

                        return '<span style="color: #ffcf00">'+ data + '</span>';

                    }else{

                        return '<span style="color: #333333">'+ data + '</span>';

                    }
                }
            },
            {
                title:'故障位置',
                data:'wxDidian',
                render:function(data, type, row, meta){
                    if(row.color){

                        return  '<span style="color: green">'+ data + '</span>';

                    }if(row.gdZht == 2){

                        return '<span style="color: #c00000">'+ data + '</span>';

                    }else if( row.gdZht == 4 ){

                        return '<span style="color: #4472c4">'+ data + '</span>';

                    }else if( row.gdZht == 5 ){

                        return '<span style="color: #ffcf00">'+ data + '</span>';

                    }else{

                        return '<span style="color: #333333">'+ data + '</span>';

                    }
                }
            },
            {
                title:'维修事项',
                data:'wxXm',
                render:function(data, type, row, meta){
                    if(row.color){

                        return  '<span style="color: green">'+ data + '</span>';

                    }else if(row.gdZht == 2){

                        return '<span style="color: #c00000;cursor: pointer;" title="' + data +
                            '">'+ data + '</span>';

                    }else if( row.gdZht == 4 ){

                        return '<span style="color: #4472c4;cursor: pointer;" title="' + data +
                            '">'+ data + '</span>';

                    }else if( row.gdZht == 5 ){

                        return '<span style="color: #ffcf00;cursor: pointer;" title="' + data +
                            '">'+ data + '</span>';

                    }else{

                        return '<span style="color: #333333;cursor: pointer;" title="' + data +
                            '">'+ data + '</span>';

                    }
                }
            },
            {
                title:'故障描述',
                data:'bxBeizhu',
                render:function(data, type, row, meta){
                    if(row.color){

                        return  '<span style="color: green">'+ data + '</span>';

                    }else if(row.gdZht == 2){

                        return '<span style="color: #c00000">'+ data + '</span>';

                    }else if( row.gdZht == 4 ){

                        return '<span style="color: #4472c4">'+ data + '</span>';

                    }else if( row.gdZht == 5 ){

                        return '<span style="color: #ffcf00">'+ data + '</span>';

                    }else{

                        return '<span style="color: #333333">'+ data + '</span>';

                    }
                }
            },
            {
                title:'报修人',
                data:'bxRen',
                render:function(data, type, row, meta){
                    if(row.color){

                        return  '<span style="color: green">'+ data + '</span>';

                    }else if(row.gdZht == 2){

                        return '<span style="color: #c00000">'+ data + '</span>';

                    }else if( row.gdZht == 4 ){

                        return '<span style="color: #4472c4">'+ data + '</span>';

                    }else if( row.gdZht == 5 ){

                        return '<span style="color: #ffcf00">'+ data + '</span>';

                    }else{

                        return '<span style="color: #333333">'+ data + '</span>';

                    }
                }
            },
            {
                title:'维修人',
                data:'wxUserNames',
                render:function(data, type, row, meta){
                    if(row.color){

                        return  '<span style="color: green">'+ data + '</span>';

                    }else if(row.gdZht == 2){

                        return '<span class="wxUser" style="color: #c00000" title="'+data+'">'+data+'</span>';

                    }else if( row.gdZht == 4 ){

                        return '<span class="wxUser" style="color: #4472c4" title="'+data+'">'+data+'</span>';

                    }else if( row.gdZht == 5 ){

                        return '<span style="color: #ffcf00">'+ data + '</span>';

                    }else{

                        return '<span class="wxUser" style="color: #333333" title="'+data+'">'+data+'</span>';

                    }
                }
            },
        ]
    });

    /*--------------------------echart初始化---------------------------------------*/
    var myChart = echarts.init(document.getElementById('energy-demand'));

    var myChart4 = echarts.init(document.getElementById('energy-demand4'));

    var myChart7 = echarts.init(document.getElementById('energy-demand7'));

// 指定图表的配置项和数据
    var option = {
        title:{
            left:'center',
            top:'35%',
            text:'',
            textStyle:{
                fontSize:'14',
                color:'#e382a5'
            },
            //subtext:['\n好'],
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
                    {   value:0,
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
                    {   value:0,
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

    myChart4.setOption(option);
    //
    myChart7.setOption(option);
    //数据加载
    conditionSelect();

    gdShowData();

    /*----------------------------方法-----------------------------------------*/
    //定义定时器
    var timer;
    //条件数据
    function conditionSelect(){

        //更新时间
        _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');
        _initEnd = moment().add(1,'d').format('YYYY/MM/DD');

        var wxKeshiNum =  _wxBanNum;

        if( !_wxBanNum){
            return false;
        }

        var prm = {
            "gdCode":'',
            "gdSt":_initStart,
            "gdEt":_initEnd,
            "bxKeshi":'',
            "wxKeshiNum":wxKeshiNum,
            "gdZht":'',
            "pjRen":'',
            //"shouliren": filterInput[7],
            "userID":_userIdNum,
            //故障位置
            "gdLeixing":'',
            "wxRen":'',
            "wxdidian":'',
            "isCalcTimeSpan":1,
            "userName":_userIdName,
            "gdZhts":['2','4','5']
            //"wxKeshiNum":_wxBanNum
        };
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDGetDJ',
            data:prm,
            async:false,
            success:function(result){

                var dataArr = [];

                $(result).each(function(i,o){

                    //待分派的放在前面
                    if(o.gdZht == 2){

                        dataArr.unshift(o);
                        //存在待分派，可提示声音
                        _ifAutio = true;

                    }else {

                        dataArr.push(o);
                    }
                });

                //声音
                var audioStr = '<audio src="../resource/song/alert.mp3" id="audioMain" controls="controls" autoplay="autoplay" style="display: none"></audio>';

                var alarmSong = sessionStorage.alarmSong || 0;

                if( alarmSong > 0){

                    if($('#audioMain')){
                        $('#content').children('audio').remove();
                    }

                    var childNode= document.getElementsByTagName('audio')[0];


                    if(!childNode &&  _ifAutio){

                        $('#content').append(audioStr);

                        _ifAutio = false;
                    }
                }

                //协助数据
                assistFun(dataArr);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
                setTimeout(function(){
                    conditionSelect();
                },_refresh * 1000 * 60);
            }
        })
    }

    var scrollTable = function(){
        var i = -1;
        var tableHeight = $('#scrap-datatables').height();
        return function(){
            i++;
            var height = i * 548 * -1;

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
        }
    }();

    //左侧数据
    function gdShowData(){

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDRptgdtongji',
            data:{

                wxKeshiNum:_wxBanNum,
                userID:_userIdNum,
                userName:_userIdName

            },
            timeout:30000,
            beforeSend: function () {
                //myChart.showLoading();
                //myChart4.showLoading();
                //myChart7.showLoading();
            },
            success:function(result){

                $('#orderD').html(result.todayorder);

                $('#orderDF').html(result.todayorderfinish);

                $('#orderM').html(result.monthorder);

                $('#orderMF').html(result.monthorderfinish);

                $('#orderY').html(result.yearorder);

                $('#orderYF').html(result.yearorderfinish);


                //本日
                option.series[0].data[0].value = Number(result.todayorderfinish);

                option.series[0].data[1].value = Number(result.todayorder) - Number(result.todayorderfinish);

                var values = 0;

                if( Number(result.todayorder) == 0 ){

                    values = 0;

                }else{

                    values = (Number(result.todayorderfinish)/Number(result.todayorder))*100
                }

                option.title.text = values.toFixed(1) + '%';

                option.series[0].data[0].itemStyle.normal.color='#ce005b';

                option.title.textStyle.color = '#ce005b';

                myChart.setOption(option);

                //本月

                option.series[0].data[0].value = Number(result.monthorderfinish);

                option.series[0].data[1].value = Number(result.monthorder) - Number(result.monthorderfinish);

                var values = 0;

                if( Number(result.monthorder) == 0 ){

                    values = 0;

                }else{

                    values = (Number(result.monthorderfinish)/Number(result.monthorder))*100
                }

                option.title.text = values.toFixed(1) + '%';

                option.series[0].data[0].itemStyle.normal.color='#4a6dac';

                option.title.textStyle.color = '#4a6dac';

                myChart4.setOption(option);


                //本年
                option.series[0].data[0].value = Number(result.yearorderfinish);

                option.series[0].data[1].value = Number(result.yearorder) - Number(result.yearorderfinish);

                var values = 0;

                if( Number(result.yearorder) == 0 ){

                    values = 0;

                }else{

                    values = (Number(result.yearorderfinish)/Number(result.yearorder)) *100
                }

                option.title.text = values.toFixed(1) + '%';

                option.series[0].data[0].itemStyle.normal.color='#8e8e8e';

                option.title.textStyle.color = '#8e8e8e';

                myChart7.setOption(option);


                setTimeout(function(){
                    gdShowData();
                },_refresh * 1000 * 60);

            },
            error:function(jqXHR, textStatus, errorThrown){
                setTimeout(function(){
                    gdShowData();
                },_refresh * 1000 * 60);
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

    //星期几转换
    function weekChange(num){

        if(num == 0){

            return '  星期日'

        }else if(num == 1){

            return '  星期一'

        }else if(num == 2){

            return '  星期二'

        }else if(num == 3){

            return '  星期三'

        }else if(num == 4){

            return '  星期四'

        }else if(num == 5){

            return '  星期五'

        }else if(num == 6){

            return '  星期六'

        }

    }

    //协助数据
    function assistFun(arr){

        var prm = {

            //工单号
            gdCode:'',
            //状态
            gdZht: 2

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/GetGongdanFZList',

            data:prm,

            success:function(result){

                for(var i=0;i<result.length;i++){

                    //arr.push(result[i]);

                    result[i].color = 'green';

                    arr.push(result[i]);

                }

                console.log(arr);

                datasTable($("#scrap-datatables"),arr);
                //获取table高度
                var tableHeight = $('#scrap-datatables').height();

                if(timer){
                    clearInterval(timer);
                }

                if(result.length > 0){

                    var i=-1;
                    timer = setInterval(function(){
                        i++;
                        var height = i * 548 * -1;

                        if( tableHeight + height <= 0){
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

                setTimeout(function(){
                    conditionSelect();
                },_refresh * 1000 * 60);

            },

            error:function(XMLHttpRequest, textStatus, errorThrown){

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    console.log('请求超时');

                }else{

                    console.log('请求失败');

                }

                datasTable($("#scrap-datatables"),arr);
                //获取table高度
                var tableHeight = $('#scrap-datatables').height();

                if(timer){
                    clearInterval(timer);
                }

                if(result.length > 0){

                    var i=-1;
                    timer = setInterval(function(){
                        i++;
                        var height = i * 548 * -1;

                        if( tableHeight + height <= 0){
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

                setTimeout(function(){
                    conditionSelect();
                },_refresh * 1000 * 60);

            }

        })

    }

});