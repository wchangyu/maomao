/**
 * Created by admin on 2018/4/23.
 */
$(function(){

    //获取报警等级
    getAlarmLevel();

    //获取全部车站
    getAlarmStation();

    //

});

//获取报警等级
function getAlarmLevel(){

    var levelHtml = "<option value='0'>全部</option>";

    $(alarmLevel).each(function(i,o){

        levelHtml += "<option value='"+ o.id+"'>"+ o.name+"</option>"
    });

    $('#alarm-level').html(levelHtml);
};

//获取全部车站
function getAlarmStation(){

    //存放楼宇ID列表
    var levelHtml = "";

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));

    $(pointerArr).each(function(i,o){

        levelHtml += "<option value='"+ o.pointerID+"'>"+ o.pointerName+"</option>"
    });

    $('#alarm-station').html(levelHtml);

};