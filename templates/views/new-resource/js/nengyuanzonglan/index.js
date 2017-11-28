/**
 * Created by admin on 2017/11/28.
 */
$(function(){

    //获取左侧医院统计数据
    getTopPageData();

    //获取当年气象参数
    getWeatherParam();

    //获取实时能耗

});

//获取左侧医院统计数据
function getTopPageData(){
    //传递给后台的数据
    var ecParams = {

    };
    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetTopPageDataStatist',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){


        },
        success:function(result){

            console.log(result);
            //给页面中赋值
            var html = '';
            $(result).each(function(i,o){

                html += '<p>'+ o.statistName+':<span>'+ o.statistValue+'</span></p>'
            });
            //清除浮动
             html += '<div class="clearfix"></div>';

            $('.left-middle-main1').html(html);
        },
        error:function(jqXHR, textStatus, errorThrown){
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};

//获取当年气象参数
function getWeatherParam(){
    //传递给后台的数据
    var ecParams = {

    };
    //发送请求
    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix+'EnergyTopPageV2/GetWeatherParam',
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){

        },
        success:function(result){

            console.log(result);
            //给页面中赋值

        },
        error:function(jqXHR, textStatus, errorThrown){
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请求失败', '');
            }

        }
    })
};