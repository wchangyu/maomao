/**
 * Created by admin on 2018/1/15.
 */
$(function(){

    var rightTableChart = echarts.init(document.getElementById('right-bottom-echart1'));

    //给table中echart循环赋值
    echartAssignment();

    function echartAssignment(){

        //获取需要赋值的数量
        var length = $('.right-bottom-table .right-bottom-echart').length;

        for(var i=0; i<length; i++){

            //获取当前ID
            var id = $('.right-bottom-table .right-bottom-echart').eq(i).attr('id');

            var rightTableChart = echarts.init(document.getElementById(id));

            rightTableChart.setOption(option1);
        }
    }


});
