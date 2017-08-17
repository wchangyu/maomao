/**
 * Created by admin on 2017/2/22.
 */

var userName = 'xiaohong';
var IP1 = "http://192.168.1.104/BEEWebAPI/api";
var IP2 = 'http://211.100.28.180/DingEAPI/api';
var IP = IP1;

var theTimes = 30000;
var energyType = {
    "alltypes":[
        {"etid":"01",
            "ettype":"100",
            "etname":"电",
            "etunit":"kWh",
            "img":"totalEner.png",
            "color":"#bce3de",
            "img2":"electricity.png"
        },
        {"etid":"211",
            "ettype":"200",
            "etname":"水",
            "etunit":"t",
            "img":"totalWater.png",
            "color":"#fcbf92",
            "img2":"water.png"
        },
        {"etid":"311",
            "etname":"气",
            "ettype":"300",
            "etunit":"m3",
            "img":"totalQi.png",
            "color":"#b1cade",
            "img2":"gas.png"
        },
        {"etid":"412",
            "ettype":"400",
            "etname":"暖",
            "etunit":"MJ",
            "img":"",
            "color":"#b1cade",
            "img2":"hot.png"
        },
        {"etid":"511",
            "ettype":"500",
            "etname":"冷",
            "etunit":"MJ",
            "img":"",
            "color":"#b1cade",
            "img2":"cold.png"
        }
    ]};

//弹窗关闭时清空已输入过的信息

$('.modal-header .close').on('click',function(){
    $(this).parent().parent().parent().find('input').val('');
});
$('.modal-footer .btn-default').on('click',function(){

    $(this).parent().parent().parent().find('input').val('');

});


//检测输入值是否符合要求
function checkWord(password)
{
    $('.hint-text1').css({
        display:'inline-block'
    })
    var reg=/^[1-9][0-9]*$|^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/g;
    if(!reg.test(password)) {

        return false;
    }

    return true;
}


//给表格加入数据
function setData(){
    if(dataArr && dataArr.length>0){
        _table.fnAddData(dataArr);
        _table.fnDraw();

    }
}

//给表格加入数据a
function setDatas(arr){
    if(arr && arr.length>0){
        _table.fnAddData(arr);
        _table.fnDraw();
    }

}
//隐藏ID属性
function hiddrenId(){
    $('.theHidden').css({
        display:'none'
    })
}
//调用对应接口成功后
function ajaxSuccess(){


    _table.fnClearTable();
    alarmHistory();
    setData();
    hiddrenId();

}

//深拷贝的方法
function deepCopy(src,obj){

    obj = obj || (Array.isArray(src) ? [] : {});
    for(var i in src){
        if(src.hasOwnProperty(i)){
            if(typeof src[i] == 'object' && src[i]!=null){
                obj[i] = Array.isArray(src[i]) ? [] : {};
                deepCopy(src[i],obj[i]);
            }else{
                obj[i] = src[i];
            }
        }
    }
}


//获取对应的能耗类型
function getEnergyType(num){
    var txt = energyType.alltypes;
    for(var i=0; i < txt.length; i++){
        if(num == txt[i].ettype){
            return txt[i].etname;
        }
    }
}

//获取对应的能耗类型单位
function getEnergyUnit(num){
    var txt = energyType.alltypes;
    for(var i=0; i < txt.length; i++){
        if(num == txt[i].ettype){
            return txt[i].etunit;
        }
    }
}

//获取人员类别单位
function getPersonUnit(num){
    if(num == 0){
        return '人数'
    }else if(num == 1){
        return '人时'
    }
}

//获取手工调整状态
function getQuotaState(num){
    if(num == 0){
        return "禁用"
    }else if(num == 1){
        return '加减微调'
    }else if(num == 2){
        return '人工修订'
    }
}

//获取子账户表示
function getChildState(num){
    if(num == 0){
        return "累加"
    }else if(num == 1){
        return '累减'
    }else if(num == 2){
        return '公摊'
    }
}

//自定义弹窗
function myAlter(string){
    $('#my-alert').modal('show');
    $('#my-alert p b').html(string);
}

//获取全部能耗类型
function  getAllEnergys(dom){
    var arr1 = [];
    var arr2 = [];
    var txt = energyType.alltypes;
    var html2 = '';
    for(var i=0 ; i < txt.length; i++){
        var id = parseInt(txt[i].ettype);
        var type = txt[i].etname;
        arr1.push(id);
        arr2.push(type);
    }
    for(var i = 0 ; i < arr2.length; i++){

        html2 += '<li ids="'+arr1[i]+'">'+ arr2[i]+'</li>'
    }
    for(var i=0; i<$(dom).length; i++){
        $(dom).eq(i).find('.add-input-select').eq(0).find('span').html(arr2[0]);
        $(dom).eq(i).find('.add-select-block').eq(0).html(html2);
        $(dom).eq(i).find('.add-input-select').eq(0).find('span').attr('ids',arr1[0]);
    }
}

//获取焦点
function getFocus(dom){
    $('#check-text').on('click','.btn-primary',function(){
        dom.focus();
    });

};

function getFocus1(dom){
    $('#my-alert').one('click','.btn-primary',function(){
        dom.focus();
    });
}

$('.modal').attr('data-backdrop','static');

//判断仪表状态
function getMtonline(num){
    if(num == 0){
        return '手抄表'
    }else if(num == 1){
        return '在线表'
    }
};
//点击确定时触发
//$(document).on('keydown',function(e){
//    var theEvent = window.event || e;
//    var code = theEvent.keyCode || theEvent.which;
//
//    if(code == 13){
//        $('.in .btn-primary').click();
//        return false;
//    }
//})

//日期控件
$('.chooseDate').on('focus',function(){
    var that = $(this);
    setTimeout(function(){
        $('.day').one('click',function(){
            console.log('ok');
            that.blur();
            $('.datepicker').css({
                display:'none'
            })

        });
    },100)

});

