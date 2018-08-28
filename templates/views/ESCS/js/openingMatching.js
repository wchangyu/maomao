$(function(){

    /*------------------------------------时间插件---------------------------------*/

    //获取默认时间
    var nowTime = moment(sessionStorage.sysDt).format('YYYY-MM');

    $('#spDT').val(nowTime);

    _monthDate11($('.abbrDT'));

    /*---------------------------------echarts----------------------------------*/

    var _mychart = echarts.init(document.getElementById('optionMatching'));

    var color = [

                /*------------------------------------------------------------------------------------------------*/

                '#f7efca','#b9a05e','#e4c269','#adbf47','#92b25f',
                '#838f77','#a7c8bd','#3898a6','#5c92be','#91a4c5',
                '#a62937','#d1816a','#d37327','#d2c4aa','#9b405f',
                '#afa697','#b69c8d','#c1a8a1','#716676','#d0cc8d'

                ];

    var typePoint = [   'circle', 'rect', 'roundRect', 'triangle', 'diamond'

                     ];


    var pointerObj = [];

    for(var i=0;i<typePoint.length;i++){

        for(var j=0;j<color.length;j++){

            var obj = {};

            obj.color = color[j];

            obj.point = typePoint[i];

            pointerObj.push(obj);

        }

    }

    //首先将颜色打乱

    var typeColorArr = [];

    var typePointArr = [];

    pointerObj.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;});

    for(var i=0;i<pointerObj.length;i++){

        typeColorArr.push(pointerObj[i].color);

        typePointArr.push(pointerObj[i].point);

    }

    //首先将形状和组合拼接
    var option = {

        color:color,

        title:{

            subtext:'能效（KW/KW）'

        },
        grid: {
            left: '3%',
            right: '7%',
            bottom: '3%',
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
        brush: {
        },
        legend: {
            itemWidth:15,
            data: [],
            left: 'center',
            top:20
        },
        xAxis : [
            {
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
                }
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

                    var str = '<div class="noDataTipKJ" style="line-height: 40px;text-align: center;position: absolute;top: 45%;width: 100%">暂时没有冷机</div>'

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