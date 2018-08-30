/**
 * Created by admin on 2018/8/27.
 */
$(function(){

    //点击诊断 开始诊断
    $('.top-choose-type-container .choose-type').on('click',function(){

        $('.top-choose-type-container .choose-type').removeClass('choose');

        $(this).addClass('choose');

        $('.bottom-result-container').find('.bottom-specific-result').html('');

        //页面诊断信息赋值
        addResultData();

    });


    //点击供配电 跳转供配电页面
    $('.bottom-result-container ').on('click','.specific-result-container',function(){

        //获取当前索引
        var index = $(this).index();

        if(index == 0){

            window.location.href= 'distribution-monitor1.html';
        }

    });
});

//存放诊断信息
var diagnosticArr = [

    {
        "num":1,
        "data1":"风险：PO-TA变压器三相温差大于2°",
        "data2":"描述：Ta＞Tb超过48小时，温差最高3.5℃",
        "data3":"报警情况：无对应状态",
        "data4":"建议：现场检查变压器散热风扇"
    },
    {
        "num":1,
        "data1":"风险：2#冷机冷凝压力高",
        "data2":"描述：Ta＞Tb超过48小时，温差最高3.5℃",
        "data3":"报警情况：对应报警频次1.5次/天",
        "data4":"建议：清洗冷凝器翅片，机组维保"
    },
    {
        "num":0,
        "data1":"",
        "data2":"",
        "data3":"",
        "data4":""
    },
    {
        "num":1,
        "data1":"风险：PUE中等，CLF高",
        "data2":"精密空调冷冻水阀平均开度45%，平均送风温度19.6℃，机房冷通道平均温度20.4℃",
        "data3":"报警情况：无报警",
        "data4":"建议：提高冷机出水温度2℃"
    },
    {
        "num":-1,
        "data1":"工单数量：255",
        "data2":"未完成工单：未完成工单34%",
        "data3":"工单总工时：835人工时",
        "data4":"总等待工时：364小时",
        "data5":"知识库：资料库完整度65%",
        "data6":"专家意见库：新增3条，UPS 0.2条/台；冷机 4条/台"
    },
    {
        "num":0
    }
];

//用于判断是否诊断完成
var resultNum = 0;

//页面诊断信息赋值
function addResultData(){

    $('.diagnostic-container').showLoading();

    $(diagnosticArr).each(function(i,o){

        setTimeout(function(){

            resultNum++;

            var html = "";

            //上方诊断结果条数
            if(o.num == 0){

                html += '<p class="green-result">诊断结果<span class="result-num">0</span>条</p>';

            }else if(o.num == -1){

                html += '<p class="red-result">诊断结果</p>';

            }else{

                html += '<p class="red-result">诊断结果<span class="result-num">1</span>条</p>';
            }

            //
            var dataArr = transform(o);

            $(dataArr).each(function(k,j){

                if(k != 0){

                    html += '  <p>'+j+'</p>';
                }

            });

            //页面赋值
            $('.bottom-result-container').find('.bottom-specific-result').eq(i).html(html);

            //诊断完成
            if(resultNum == diagnosticArr.length){

                $('.diagnostic-container').hideLoading();

                resultNum = 0;
            }

        },1000 * (i+1));

    });

}

//对象转化为数组
function transform(obj){

    var arr = [];
    for(var item in obj){
        arr.push(obj[item]);
    }

    return arr;

};