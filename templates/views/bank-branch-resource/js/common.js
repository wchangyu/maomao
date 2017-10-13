/**
 * Created by admin on 2017/5/23.
 */

var _userIdName = sessionStorage.getItem('userName');
var _url = sessionStorage.getItem('apiUrlPrefix');

var _urlLength = _url.length;

var IP1 = _url.substring(0,_urlLength-1);

var IP = IP1;

var theTimes = 30000;


var loginArr = JSON.parse(sessionStorage.getItem('enterPriseList'));

////console.log(loginArr);

//支行ID
var EnterpriseID;
//单位名称
var EnterpriseName;

if(loginArr.length > 0){

        EnterpriseID = loginArr[0].enterpriseID;
        EnterpriseName = loginArr[0].eprName;
}

//测试单位名称与ID
//EnterpriseID =  11001815;
//EnterpriseName = '眉山支行';

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

//给表格加入数据
function setDatas(arr){
        if(arr && arr.length>0){
                _table.fnAddData(arr);
                _table.fnDraw();
        }

}
//调用对应接口成功后
function ajaxSuccess(){


        _table.fnClearTable();

        setData();


}

function ajaxSuccess1(arr){


        _table.fnClearTable();

        setDatas(arr);
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
function myAlter1(string){
        $('#my-alert1').modal('show');
        $('#my-alert1 p b').html(string);
}

function CompareDate(d1,d2) {
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
};

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
                        ////console.log('ok');
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
                        ////console.log('ok');
                        that.blur();
                        $('.datepicker').css({
                                display:'none'
                        })

                });
                $('.month').one('click',function(){
                        ////console.log('ok');
                        that.blur();
                        $('.datepicker').css({
                                display:'none'
                        })

                });

        },100)

});
$('.chooseDate-year').on('focus',function(){
        var that = $(this);
        setTimeout(function(){
                $('.day').one('click',function(){
                        ////console.log('ok');
                        that.blur();
                        $('.datepicker').css({
                                display:'none'
                        })

                });
                $('.month').one('click',function(){
                        //console.log('ok');
                        that.blur();
                        $('.datepicker').css({
                                display:'none'
                        })

                });
                $('.year').one('click',function(){
                        //console.log('ok');
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
$('.chooseDate-year').datepicker(
    {
            startView: 2,
            maxViewMode: 2,
            minViewMode:2,
            language:  'zh-CN',
            todayHighlight: 1,
            format: 'yyyy'
    }
);

$('.chooseDates').on('focus',function(){
        //console.log('11');
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
function checkedNull1(dom){

        var checkNum = $(dom).find('.colorTip').length;

        for(var i=0; i<checkNum; i++){

                var val = $(dom).find('.colorTip').eq(i).next().find('input').val();

                var name = $(dom).find('.colorTip').eq(i).html().split('*')[0];

                if(val == ''){
                        myAlter('请输入'+ name + '!');
                        getFocus1($(dom).find('.colorTip').eq(i).next().find('input'));
                        return false;
                }

        }
        return true;
}

//检验是否必填项全部填写
function checkedNull(dom){
        var checkNum = $(dom).find('.input-label').length;

        for(var i=0; i< checkNum; i++){
                if( $(dom).find('.input-label').eq(i).next().find('input').val() == ''){
                        var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

                        //console.log(txt);
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

                        //console.log(txt);
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

//根据分项ID获取能耗单位
function getUnitByID(num){


        var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

        var txt = unitObj.alltypes;
        for(var i=0; i < txt.length; i++){
                if(num == txt[i].etid){
                        return txt[i].etunit;
                }
        }
};

//获取能耗单位
function getUnit(num){

        var  num1 = parseInt(num) * 100;

        var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

        var txt = unitObj.alltypes;
        for(var i=0; i < txt.length; i++){
                if(num1 == txt[i].ettype){
                        return txt[i].etunit;
                }
        }
};

//获取能耗名称
function getUnitName(num){
        var  num1 = parseInt(num) * 100;

        var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

        var txt = unitObj.alltypes;

        for(var i=0; i < txt.length; i++){
                if(num1 == txt[i].ettype){
                        return txt[i].etname;
                }
        }
};

function getUnitName1(num){

        var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

        var txt = unitObj.alltypes;

        for(var i=0; i < txt.length; i++){
                if(num == txt[i].etid){
                        return txt[i].etname;
                }
        }
};

//获取能耗类型
function getUnit1(num){

        var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

        var txt = unitObj.alltypes;

        for(var i=0; i < txt.length; i++){
                if(num == txt[i].etid){
                        return txt[i].ettype;
                }
        }
};


//获取开始结束日期
function getPostDate(postDate){
        var showTime = postDate;

        var selectType = '';

        var dateSign = '';

        var startDate = '';

        var endDate = '';

        if(postDate == '今天' ||　postDate == '本日'){

                dateSign = '小时';

                selectType = '日';

                startDate = getNewDate();

                //console.log(startDate);

                var now = new Date();

                var tomorrow = new Date(now.setDate(now.getDate()+1));

                endDate = getDate(tomorrow);

        }else if(postDate == '昨天'){

                dateSign = '小时';

                selectType = '日';

                endDate = getNewDate();


                var now = new Date();

                var yesterday = new Date(now.setDate(now.getDate()-1));

                startDate = getDate(yesterday);

                //console.log(startDate);

        }else if(postDate == '过去7天'){

                dateSign = '日';

                selectType = '日';

                var now = new Date();

                var tomorrow = new Date(now.setDate(now.getDate()+1));

                endDate = getDate(tomorrow);


                var yesterday = new Date(now.setDate(now.getDate()-7));

                startDate = getDate(yesterday);

                //console.log(startDate);
        }else if(postDate == '过去30天'){

                dateSign = '日';

                selectType = '日';

                var now = new Date();

                var tomorrow = new Date(now.setDate(now.getDate()+1));

                endDate = getDate(tomorrow);

                var yesterday = new Date(now.setDate(now.getDate()-30));

                startDate = getDate(yesterday);

                //console.log(startDate);
        }else if(postDate == '上周'){

                dateSign = '日';

                selectType = '周';


                startDate = moment().subtract(1,'week').startOf('week').add(1,'day').format('YYYY-MM-DD');

                endDate = moment().subtract(1,'week').endOf('week').add(2,'day').format('YYYY-MM-DD');

                //console.log(startDate,endDate);

        }else   if(postDate == '本月'){

                dateSign = '日';

                selectType = '月';

                endDate = moment().add(1, 'day').format('YYYY-MM-DD');

                startDate = moment().startOf('month').format('YYYY-MM-DD');

                //console.log(startDate);
        }else if(postDate == '上月'){

                dateSign = '日';

                selectType = '月';

                startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
                endDate = moment().startOf('month').format('YYYY-MM-DD');

                //console.log(startDate,endDate);
        }else if(postDate == '本季'){

                dateSign = '日';

                selectType = '季';

                var month = moment().month() + 1;

                var year = moment().year();

                //console.log(month);

                if(0 < month && month < 4){
                        startDate = year + '-1-1';
                        endDate = year + '-3-31';
                }else if(3 < month && month < 7){
                        startDate = year + '-4-1';
                        endDate = year + '-6-30';
                }else if(6 < month && month < 10){
                        startDate = year + '-7-1';
                        endDate = year + '-7-30';
                }else if(9 < month && month < 13){
                        startDate = year + '-10-1';
                        endDate = year + '-12-31';
                }


                //console.log(startDate,endDate);

        }else if(postDate == '本年' || postDate == '今年'){
                dateSign = '月';

                selectType = '年';

                endDate = moment().add(1, 'day').format('YYYY-MM-DD');



                startDate = moment().startOf('year').format('YYYY-MM-DD');

                //console.log(startDate,endDate);
        }else if(postDate == '上年'){
                dateSign = '月';

                selectType = '年';

                startDate = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD');

                endDate =  moment().startOf('year').format('YYYY-MM-DD');


        }else if(postDate == '自定义'){

                dateSign = '日';

                selectType = '自定义';

                startDate = $('.show-date').val().split('——')[0];

                startDate = moment(startDate).format('YYYY-MM-DD');

                var string =  $('.show-date').val().split('——')[1];

                var endArr = string.split('-');

                if(endArr.length == 3){
                        endDate =  moment(string).add(1,'day').format('YYYY-MM-DD');
                }else{

                        endDate =  moment(string).format('YYYY-MM-DD');

                }

                showTime = startDate + '——' + endDate;
                //console.log(startDate,endDate);
        }else if(postDate / 1){

                dateSign = '月';

                selectType = '年';

                startDate = postDate + '-1-1';
                endDate = (parseInt(postDate) + 1) + '-1-1';
        }

        return [postDate,startDate,endDate,dateSign,showTime,selectType];
};

//比较开始结束日期是否合理
function checkedDate(dom){

        var txt1 = $(dom).find('.startDate').val();
        var txt2 = $(dom).find('.endDate').val();

        var nowDate = getNewDate();

        //if(CompareDate(txt2,nowDate) == true){
        //        myAlter('结束日期不能大于当前日期');
        //        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));
        //
        //        return false;
        //};


        if(CompareDate(txt2,txt1) == false){
                myAlter('结束日期必须大于开始日期');
                getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

                return false;
        };

        return true;
};

//判断输入内容是否为数字
function checkedNum(dom){
        var num = $(dom).find('.type-number').length;
        for(var i=0; i<num; i++){
                if($(dom).find('.type-number').eq(i).val() != ''){
                        var txt = $(dom).find('.type-number').eq(i).val() / 1;

                        if(isNaN(txt)){
                                var txt1 = $(dom).find('.type-number').eq(i).parent().prev().html().split('*')[0];
                                //console.log(txt1);

                                myAlter(txt1 + '必须为数字');
                                getFocus1($(dom).find('.type-number').eq(i));
                                return false;
                        }
                }

        }
        return true;
}

//判断输入是否为电话号码

function checkedPhone(dom){
        var txt = $(dom).find('.type-phone').val();
        if(txt != ''){
                if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(txt))){


                        myAlter('手机号输入错误');
                        getFocus1($(dom).find('.type-number').eq(i));
                        return false;

                }
        }

        return true;
}

//截取数组
function getArr(arr){
        var shortArr = [];
        shortArr = arr.slice(0,10);
        //console.log(shortArr);

        return shortArr;
};

//点击自定义按钮时
$('.datatimeblock').on('change',function(){

        $('.show-date').css({
                display:'none'
        });

        var className = $(this).find("option:selected").prop("className");


        if(className == 'custom-time'){
                $('#choose-date').modal('show');
                $('#choose-date input').val('');
        }


});