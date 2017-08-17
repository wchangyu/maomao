/**
 * Created by admin on 2017/7/25.
 */
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

//获取开始结束日期
function getPostDate(postDate){


    var startDate = '';

    var endDate = '';

    if(postDate == '日'){


        startDate = getNewDate();

        var now = new Date();

        var tomorrow = new Date(now.setDate(now.getDate()+1));

        endDate = getDate(tomorrow);

    }else if(postDate == '周'){

        startDate = moment().startOf('week').add(1,'day').format('YYYY-MM-DD');

        endDate = moment().endOf('week').add(2,'day').format('YYYY-MM-DD');


    }else  if(postDate == '月'){

        endDate = moment().add(1, 'day').format('YYYY-MM-DD');

        startDate = moment().startOf('month').format('YYYY-MM-DD');

    }else if(postDate == '年'){

        endDate = moment().add(1, 'day').format('YYYY-MM-DD');

        startDate = moment().startOf('year').format('YYYY-MM-DD');
    }

    return [startDate,endDate];
}

//根据能耗类型获取能耗单位
function getUnitByType(num){


    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;
    for(var i=0; i < txt.length; i++){
        if(num == txt[i].ettype){
            return txt[i].etunit;
        }
    }
};
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


//获取除水之外的需要展示分项ID
function getShownUnitID(){

    var showUnitIDArr = [];

    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;

    $(txt).each(function(i,o){

        if(o.isShowItem == 1 && o.etid != 211){

            showUnitIDArr.push(o.etid);
        }
    });

    return showUnitIDArr;
}

//获取所有需要展示分项ID
function getAllShownUnitID(){

    var showUnitIDArr = [];

    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;

    $(txt).each(function(i,o){

        if(o.isShowItem == 1){

            showUnitIDArr.push(o.etid);
        }
    });

    return showUnitIDArr;
}

//获取当前的能耗类型所对应的最大值配置

function getMaxEnergyData(date,id){

    var maxNum = 0;

    $.ajax({
        type: 'get',
        url: '../../../assets/local/configs/BEECommConfig.json',
        timeout: theTimes,
        async: false,
        beforeSend: function () {

        },
        complete: function () {

        },
        success: function (data) {

            $(data.allEnergyType.alltypes).each(function(i,o){

                if(id == o.etid){

                    if(date == '日'){
                        maxNum = o.dayMax;
                    }else if(date == '周'){
                        maxNum = o.weekMax;
                    }else if(date == '月'){
                        maxNum = o.monthMax;
                    }else if(date == '年'){
                        maxNum = o.yearMax;
                    }

                }

            });

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            myChart3.hideLoading();
            $('#theLoading').modal('hide');
            //console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                myAlter("超时");
            }else{
                myAlter("请求失败！");
            }

        }
    });

    return maxNum;

};

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
