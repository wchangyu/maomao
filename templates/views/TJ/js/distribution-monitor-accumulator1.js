/**
 * Created by admin on 2018/11/6.
 */
/**
 * Created by admin on 2018/10/24.
 */
$(function(){

    //echart页面赋值
    drawEchart();

});


// 指定图表的配置项和数据 用于蓄电池信息
var accmulatorOption = {

    tooltip:{
        trigger:'axis',
        axisPointer:{
            type:'shadow'
        },
        show:false,
        formatter:function (params) {
            var tar = params[1];
            var tars = params[0];
            return tar.name + '<br/>' + tar.seriesName + '  ' + tar.value + '<br/>' + tars.seriesName + '  ' + tars.value;
        }
    },
    toolbox:{
        show:false,
        feature:{
            mark:{show:true},
            dataView:{show:true, readOnly:false},
            restore:{show:true},
            saveAsImage:{show:true}
        }
    },
    grid:{
        left:'1%',
        right:'1%',
        bottom:'8%',
        top:"12%",
        borderColor:'#74839B',
        containLabel:true
    },
    xAxis:{
        show:'true',
        type : 'category',
        axisLabel: {
            color:'#959595' //刻度线标签颜色
        },
        axisLine:{
            show:false
        },
        axisTick:{
            show:false
        },
        data:['01','02','03','04','05','06','07','08','09','10']
    },
    yAxis:{
        type:'value',
        axisLabel: {
            color:'#959595' //刻度线标签颜色
        },
        splitNumber:4,
        axisLine:{
            show:false
        },
        axisTick:{
            show:false
        }
    },
    series:[
        {
            name:'当前值',
            type:'bar',
            stack:'总量',
            label:{
                normal:{
                    show:false,
                    position:'inside'
                }
            },
            itemStyle:{
                normal: {
                    color: '#4B85E5'
                }
            },
            data:[45,8],
            barMaxWidth:'25'
        }
    ]
};

//echart页面赋值
function drawEchart(){

    //获取echart长度
    var length = $('.bottom-echart-container').length;

    console.log(length);

    for(var i=0; i<length; i++){

        var echartDom = document.getElementsByClassName('bottom-echart-container')[i];

        var rightTableChart = echarts.init(echartDom);

        //定义随机数组
        var dataArr = [];

        //定义x轴
        var xArr = [];

        for(var k=0; k<21; k++){

            if(i == 0){

                dataArr.push(2 + randomNum(1))

            }else if(i == 1){

                dataArr.push(20 + randomNum(7))

            }else if(i == 2){

                dataArr.push(0.1 + randomNum(0.2))

            }

            if(k < 10){

                xArr.push( '0' + k);
            }else{

                xArr.push( '' + k);
            }
        }

        accmulatorOption.series[0].data = dataArr;

        accmulatorOption.xAxis.data = xArr;

        rightTableChart.setOption(accmulatorOption,true);

    }
}

//生成一个几以内的随机数 figure为几就是几以内
function randomNum(figure){

    //随机正负值
    var plusMinus = 1;

    //生成随机数
    var randomNum = (Math.random() * figure * plusMinus).toFixed(1);

    randomNum = parseFloat(randomNum);

    return randomNum;

}
