$(function(){

    /*------------------------------------时间插件---------------------------------*/

    _monthDate11($('.abbrDT'));

    //获取默认时间
    var nowTime = moment(sessionStorage.sysDt).format('YYYY-MM');

    //console.log(nowTime);

    $('#spDT').val(nowTime);

    /*---------------------------------echarts----------------------------------*/

    var _mychart = echarts.init(document.getElementById('optionMatching'));

    var typePointArr = ['image://img/mi_yellow.png', 'image://img/mi_red.png', 'image://img/mi_green.png', 'image://img/mi_blue.png', 'image://img/round_yellow.png', 'image://img/round_red.png', 'image://img/round_green.png', 'image://img/round_blue.png','image://img/arrow_yellow.png', 'image://img/arrow_red.png', 'image://img/arrow_green.png', 'image://img/arrow_blue.png'];

    var option = {

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
                        + '冷量:'  + params.value[0] + 'KW<br/>'
                        + '能效：' + params.value[1] + 'KW/KW';
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
        //toolbox: {
        //    feature: {
        //        dataZoom: {},
        //        brush: {
        //            type: ['rect', 'polygon', 'clear']
        //        }
        //    }
        //},
        brush: {
        },
        legend: {
            data: [],
            left: 'center',
            top:20
        },
        xAxis : [
            {
                type : 'value',
                //scale:true,
                axisLabel : {
                    formatter: '{value} KW'
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
                    formatter: '{value} KW/KW'
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

                    //legendArr = result.lgs;

                    for(var i=0;i<result.lgs.length;i++){

                        var obj = {};

                        obj.name = result.lgs[i];

                        obj.icon = typePointArr[i];

                        //obj.fontSize = 20;

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

                            arr.symbolSize = 20;

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