$(function(){

    /*------------------------------------时间插件---------------------------------*/

    //获取默认时间
    var nowTime = moment(sessionStorage.sysDt).format('YYYY-MM');

    $('#spDT').val(nowTime);

    _monthDate11_EN($('.abbrDT'));

    /*---------------------------------echarts----------------------------------*/

    var _mychart = echarts.init(document.getElementById('optionMatching'));

    var typeColorArr = [

                /*------------------------------------------------------------------------------------------------*/

                '#d8deea','#e8d9ae','#eceaf5','#738f9b','#b7e4c7','#f5b740','#66707a','#756389','#bed7de','#763634',

                /*------------------------------------------------------------------------------------------------*/

                '#76c5f0','#257fb3','#375078','#59b3b1','#57bdd6','#9eadca','#303787','#564975','#496e67','#875765',

                /*-------------------------------------------------------------------------------------------------*/

                '#ac88b8','#decad5','#a29783','#a9d61b','#5bb290','#38aa48','#d9f0de','#b6c8d2','#3c5e68','#9dcd43',

                /*-------------------------------------------------------------------------------------------------*/

                '#0aa971','#d75926','#e22043','#df3423','#914a5c','#d86234','#e9e719','#f3ae08','#fbab00','#e77830',

                /*-------------------------------------------------------------------------------------------------*/

                '#f3c567','#f7c318','#b95845','#ae8454','#cd9b44','#732a33','#b56331','#89752e','#724b2a','#b0461f',

                /*------------------------------------------------------------------------------------------------*/

                '#ba6d25','#d3692b','#d3692b','#74572b','#d5b177','#e49641','#877439','#d8bc03','#c18c3c','#b36a64',

                /*------------------------------------------------------------------------------------------------*/

                '#225765','#eddea7','#eeffcb','#99ccbb','#75ab87','#004677','#feff99','#ffffdb','#99ffcd','#59ca78',

                /*------------------------------------------------------------------------------------------------*/

                '#12111f','#423443','#ebddac','#dcbc89','#887976','#322455','#febd57','#a87766','#a8ab76','#549a78',

                /*------------------------------------------------------------------------------------------------*/

                '#dceef0','#a9bbbb','#549a9a','#004677','#b9eff1','#1fbeba','#212445','#676799','#eedfdc','#a8accf',

                /*------------------------------------------------------------------------------------------------*/

                '#0c59ab','#43abde','#bae0cb','#02007b','#0024cd','#009ef2','#ccffff','#a9bbbb','#768888','#bdbacb'

                ];

    var typePoint = [

        'circle', 'rect', 'roundRect', 'triangle', 'diamond'

                     ];

    //首先将颜色打乱

    var typePointArr = [];

    for(var i=0;i<20;i++){

        for(var j=0;j<typePoint.length;j++){

            typePointArr.push(typePoint[j]);

        }

    }

    //首先将形状和组合拼接
    var option = {

        color:typeColorArr,
        grid: {
            left: '4%',
            right: '7%',
            bottom: '6%',
            containLabel: true
        },
        tooltip : {
            // trigger: 'axis',
            showDelay : 0,
            formatter : function (params) {

                if (params.value.length > 1) {
                    return params.seriesName + ' :<br/>'
                        + '冷量:'  + params.value[0] + ' （KW）<br/>'
                        + '能效：' + params.value[1] + ' （KW/KW）';
                }
                else {
                    return params.seriesName + ' :<br/>'
                        + params.name + ' : '
                        + params.value + '- ';
                }
            },
            axisPointer:{
                show: true,
                type : 'cross',
                lineStyle: {
                    type : 'dashed',
                    width : 1
                }
            },



        },
        toolbox: {
            feature: {
                saveAsImage:{

                    title:'saveAsImage'

                },
                dataView: {

                    title:'dataView',

                    readOnly:true,

                    optionToContent: function(opt) {

                        //thead
                        var table = '<table class="table table-striped table-advance table-hover  dataTable no-footer">';

                        var tables = '</table>';

                        var thead = '<thead>';

                        var theads = '</thead>';

                        var tbody = '<tbody>';

                        var tbodys = '</tbody>';

                        //th
                        var thStr = '<tr><th>对象</th><th>冷量(KW)</th><th>能效(KW/KW)</th></tr>';

                        //td
                        var tdStr = '';

                        //遍历
                        for(var i=0;i<opt.series.length;i++){

                            for(var j=0;j<opt.series[i].data.length;j++){

                                tdStr += '<tr><td>' + opt.series[i].name + '</td>';

                                tdStr += '<td>' + opt.series[i].data[j].value[0] + '</td>';

                                tdStr += '<td>' + opt.series[i].data[j].value[1] + '</td>';

                                tdStr += '</tr>'

                            }

                        }


                        return table + thead + thStr + theads + tbody + tdStr + tbodys + tables;



                    },

                    lang:['DataView','Close','Refresh']

                },
                brush:{

                    show:false

                },
            }
        },
        legend: {
            itemWidth:15,
            data: [],
            left: 'center',
            top:20,
            width:'80%'
        },
        xAxis : [
            {

                name:'Cooling Tonnage (KW)',
                nameLocation:'center',
                nameGap:30,
                nameTextStyle:{

                    fontWeight:'bold',

                },
                type : 'value',
                //scale:true,
                axisLabel : {
                    formatter: '{value}'
                },
                splitLine: {
                    show: false
                },
                data:[]
            }
        ],
        yAxis : [
            {
                type : 'value',
                scale:true,
                axisLabel : {
                    formatter: '{value}'
                },
                splitLine: {
                    show: false
                },
                name:'Plantroom Energy Efficiency Ratio (EER)(KW/KW)',
                nameLocation:'center',
                nameGap:30,
                nameTextStyle:{
                    fontWeight:'bold'

                },
            }
        ],
        series : []
    };

    //默认加载
    conditionSelected();

    /*----------------------------------按钮事件---------------------------------*/

    $('#aroBtn').click(function(){

        conditionSelected();

    })

    //数据导出
    $('#exportBtn').click(function(){

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //时间
            sp:moment($('#spDT').val()).format('YYYY-MM-DD')

        }

        var url = sessionStorage.apiUrlPrefix + 'OpenMachineGrps/ExportOpenMachineGrpScatterplots?pId=' + sessionStorage.PointerID +

            '&sp=' + moment($('#spDT').val()).format('YYYY-MM-DD')

        $.ajax({

            type:'get',

            url: sessionStorage.apiUrlPrefix + 'OpenMachineGrps/ExportOpenMachineGrpScatterplots',

            data:prm,

            //发送数据之前
            beforeSend:function(){

                $('#exportBtn').html('Export...').attr('disabled',true);

            },

            //发送数据完成之后
            complete:function(){

                $('#exportBtn').html('Export Data').attr('disabled',false);

            },

            timeout:_theTimes,

            success:function(result){
                window.open(url, "_self", true);

            },

            error:_errorFun1


        })

    })

    window.onresize = function(){

        if(_mychart){

            _mychart.resize();

        }

    }

    /*------------------------------------其他方法---------------------------------*/

    function conditionSelected(){

        $('.noDataTipKJ').hide();

        var prm = {

            //楼宇
            pId:sessionStorage.PointerID,
            //时间
            sp:moment($('#spDT').val()).format('YYYY-MM-DD')

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'OpenMachineGrps/GetOpenMachineGrpScatterplots',

            data:prm,

            beforeSend:function(){

                $('#optionMatching').showLoading();

            },

            complete:function(){

                $('#optionMatching').hideLoading();

            },

            success:function(result){

                //图例
                var legendArr = [];

                //横坐标
                var dataX = [];

                //纵坐标
                var dataY = [];

                if(result.code == 0){

                    for(var i=0;i<result.lgs.length;i++){

                        var obj = {};

                        obj.name = result.lgs[i];

                        obj.icon = typePointArr[i];

                        //obj.textStyle = pointerArr[i].textStyle;

                        legendArr.push(obj);

                    }

                    dataX = result.xs;

                    for(var i=0;i<result.ys.length;i++){

                        var obj = {};

                        obj.name = legendArr[i].name;

                        obj.type = 'scatter';

                        var data = [];

                        for(var j=0;j<result.ys[i].length;j++){

                            var arr = {};

                            arr.value = [Number(result.ys[i][j].cv),Number(result.ys[i][j].nx)];

                            arr.symbol = typePointArr[i];

                            arr.symbolSize = 5;

                            arr.itemStyle = {

                                color:typeColorArr[i]

                            }

                            data.push(arr);

                        }

                        obj.data = data;

                        dataY.push(obj);

                    }

                }else{

                    var str = '<div class="noDataTipKJ" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">noData</div>'

                    $('#optionMatching').append(str);

                }

                //图例
                option.legend.data = legendArr;

                //横坐标
                option.xAxis[0].data = dataX;

                //纵坐标
                option.series = dataY;

                _mychart.setOption(option,true);


            },

            error:_errorFun1

        })


    }



})