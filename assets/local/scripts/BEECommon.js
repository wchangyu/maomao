/**
 * Created by admin on 2017/7/25.
 */

//  获取用户名
var _userIdName = sessionStorage.getItem('userName');

//从本地存储获取IP地址
var _url = sessionStorage.getItem('apiUrlPrefix');

var _urlLength = _url.length;

//定义共同的IP地址
var IP = _url.substring(0,_urlLength-1);

//定义ajax请求延迟报错时间
var theTimes = 30000;

//从本地存储中获取楼宇ID列表
function getPointersId(){

    //存放楼宇ID列表
    var pointerIdArr = [];

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));


    $(pointerArr).each(function(i,o){

        pointerIdArr.push(o.pointerID);
    });

    return pointerIdArr;
}

//从本地存储中获取分户ID列表
function getOfficesId(){

    //存放分户ID列表
    var officeIdArr = [];

    var officeArr = $.parseJSON(sessionStorage.getItem('offices'));


    $(officeArr).each(function(i,o){

        officeIdArr.push(o.f_OfficeID);
    });

    return officeIdArr;
}

//通过能耗类型获取能耗分项ID
function getUnitID(num){

    var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

    var txt = unitObj.alltypes;

    for(var i=0; i < txt.length; i++){
        if(num == txt[i].ettype){
            return txt[i].etid;
        }
    }
}

