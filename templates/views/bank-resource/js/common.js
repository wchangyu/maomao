/**
 * Created by admin on 2017/5/23.
 */

var _userIdName = sessionStorage.getItem('userName');
var IP1 = "http://192.168.1.109/BEEWebAPI/api";
var IP2 = 'http://211.100.28.180/DingEAPI/api';
var IP = IP1;

var theTimes = 30000;

//弹窗关闭时清空已输入过的信息

$('.modal-header .close').on('click',function(){
        $(this).parent().parent().parent().find('input').val('');
});
$('.modal-footer .btn-default').on('click',function(){

        $(this).parent().parent().parent().find('input').val('');

});

//给表格加入数据
function setData(){
        if(dataArrs && dataArrs.length>0){
                _table.fnAddData(dataArrs);
                _table.fnDraw();

        }
}
//调用对应接口成功后
function ajaxSuccess(){


        _table.fnClearTable();

        setData();


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

//自定义弹窗
function myAlter(string){
        $('#my-alert').modal('show');
        $('#my-alert p b').html(string);
}

function CompareDate(d1,d2)
{
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
}



function getFocus1(dom){
        $('#my-alert').one('click','.btn-primary',function(){
                dom.focus();
        });
}

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
$('.chooseDate-month').on('focus',function(){
        var that = $(this);
        setTimeout(function(){
                $('.day').one('click',function(){
                        console.log('ok');
                        that.blur();
                        $('.datepicker').css({
                                display:'none'
                        })

                });
                $('.month').one('click',function(){
                        console.log('ok');
                        that.blur();
                        $('.datepicker').css({
                                display:'none'
                        })

                });

        },100)

});

$('.chooseDate-month').datepicker(
    {
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        language:  'zh-CN',
        todayHighlight: 1,
        format: 'yyyy-mm'
    }
);
$('.chooseDates').on('focus',function(){
        console.log('11');
})
//选择日期插件
$('.chooseDate').datepicker(
    {
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd'
    }
);

//检验是否必填项全部填写
function checkedNull(dom){
        var checkNum = $(dom).find('.input-label').length;

        for(var i=0; i< checkNum; i++){
                if( $(dom).find('.input-label').eq(i).next().find('input').val() == ''){
                        var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

                        console.log(txt);
                        myAlter(txt + " 不能为空")
                        getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
                        return false;
                };
                if($(dom).find('.input-label').eq(i).next().find('.add-input-select').find('span').html() == ''){
                        var txt = $(dom).children('.input-label').eq(i).html().split('：')[0];
                        $('#check-text').modal('show');
                        myAlter(txt + " 不能为空")
                        return false;
                };
                if( $(dom).find('.input-label').eq(i).next().find('textarea').val() == ''){
                        var txt = $(dom).find('.input-label').eq(i).next().find('textarea').parent().prev().html().split('：')[0];

                        console.log(txt);
                        myAlter(txt + " 不能为空")
                        getFocus1($(dom).find('.input-label').eq(i).next().find('textarea'));
                        return false;
                };
        }
        return true;
}

//获取当前年月日
function getNewDate(){

        var mydate = new Date();
        var str = "" + mydate.getFullYear() + "-";
        str += (mydate.getMonth()+1) + "-";
        str += mydate.getDate() + "";
        return str;
}
//获取某个日期
function getDate(mydate){
        var str = "" + mydate.getFullYear() + "-";
        str += (mydate.getMonth()+1) + "-";
        str += mydate.getDate() + "";
        return str;
}

//获取上个月开始结束日期
function getLastMonth(){
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;


        if(month == 1){
                year = parseInt(year) - 1;
                startDate = year +'-' + 12 + '-' + '1';
                endDate = year +'-' + 12 + '-' + '31';
        }else if(month == 3){

                month = parseInt(month) - 1;
                startDate = year +'-' + month + '-' + '1';
                if(year%4==0 && year%100!=0 || year%400==0){

                        endDate = year +'-' + month + '-' + '29';
                }else{
                        endDate = year +'-' + month + '-' + '28';
                }
        }else if(month == 2 || month == 4 || month == 6 || month == 9 || month == 11 || month == 8){
                month = parseInt(month) - 1;
                startDate = year +'-' + month + '-' + '1';

                endDate = year +'-' + month + '-' + '31';

        }else{
                month = parseInt(month) - 1;
                startDate = year +'-' + month + '-' + '1';

                endDate = year +'-' + month + '-' + '30';

        }
}

//获取能耗单位
function getUnit(num){
        var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

        var txt = unitObj.alltypes;
        console.log(unitObj);
        for(var i=0; i < txt.length; i++){
                if(num == txt[i].etid){
                        return txt[i].etunit;
                }
        }
};

//获取能耗名称
function getUnitName(num){
        var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

        var txt = unitObj.alltypes;
        console.log(unitObj);
        for(var i=0; i < txt.length; i++){
                if(num == txt[i].etid){
                        return txt[i].etname;
                }
        }
};