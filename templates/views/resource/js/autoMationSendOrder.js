/**
 * Created by admin on 2018/4/25.
 */
$(function(){


    //设备系统
    DevList('YWDev/ywDMGetDSs',$('#select-devsystem'),'dsNum','dsName');

    //设备类别
    DevList('YWDev/ywDMGetDCs',$('#select-devtype'),'dcNum','dcName');

    //获取全部车站
    getAlarmStation();

    //获取后台数据
    ywGetAlarmSetGD(true);

    //点击查询按钮
    $('.demand-button').on('click',function(){

        //获取后台数据
        ywGetAlarmSetGD();
    });

    //点击确定按钮
    $('.bottom-btn-success').on('click',function(i,o){

        //给后台提交数据
         ywAlarmSetGDUpt();
    });
});

//存放所有获取的数组
var dataArr = [];

//设备
function DevList(url,el1,attrNum,attrName){

    var prm ={
        //当前用户id
        userID:_userIdNum,
        //当前用户名
        userName:_userIdName
    };

    $.ajax({
        type:'post',
        url:_urls + url,
        data:prm,
        timeout:_theTimes,
        success:function(result){

            var str = '<option value="">全部</option>';

            for(var i=0;i<result.length;i++){

                str += '<option value="' + result[i][attrNum] + '">' + result[i][attrName] + '</option>';

            }

            el1.empty().append(str);

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    })

};

//获取全部车站
function getAlarmStation(){

    //存放楼宇ID列表
    var levelHtml = "<option value=''>全部</option>";

    var pointerArr = $.parseJSON(sessionStorage.getItem('pointers'));

    $(pointerArr).each(function(i,o){

        levelHtml += "<option value='"+ o.pointerID+"'>"+ o.pointerName+"</option>"
    });

    $('#alarm-station').html(levelHtml);

};

//获取后台数据
function ywGetAlarmSetGD(flag){

    //获取车站
    var ddNum= $('#alarm-station').val();

    //获取设备系统
    var dsNum = $('#select-devsystem').val();

    //获取设备类型
    var dcNum = $('#select-devtype').val();

    //定义传递给后台的数据
    var ecParams = {};

     ecParams = {
        //"typeID": 0,
        //"areaID": areaId,
        "dsNum": dsNum,
        "dcNum": dcNum,
        "ddNum": ddNum,
        userID:_userIdNum,
        userName:_userIdName,
        "b_UserRole": _userRole,
        "b_DepartNum": _userBM
    };

    //第一次调用获取全部的
    if(flag){

        ecParams = {
            //"typeID": 0,
            //"areaID": areaId,
            "dsNum": "",
            "dcNum": "",
            "ddNum": "",
            userID:_userIdNum,
            userName:_userIdName,
            "b_UserRole": _userRole,
            "b_DepartNum": _userBM
        };
    }

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'NJNDeviceShow/ywGetAlarmSetGD',
        data:ecParams,
        beforeSend:function(){

            $("#entry-datatables").showLoading();

        },
        success:function(result){

            //console.log(result);

            dataArr.length = 0;

            $("#entry-datatables").hideLoading();

            //页面赋值
            var tbodyHtml = "";

            $(result).each(function(i,o){

                dataArr.push(o);

                tbodyHtml += "<tr>";

                //监测因子名称
                tbodyHtml += "<td>"+ o.cNameT+"</td>";

                //故障名称
                tbodyHtml += "<td>"+ o.alarmName+"</td>";

                //系统派单条件
                tbodyHtml += "<td>"+ o.cNameT+"</td><td>";

                //flag为1 默认选中
                if(o.flag == 1){

                    tbodyHtml += '<input type="checkbox" class="table-checkbox" checked="checked"/>';

                }else{

                    tbodyHtml += '<input type="checkbox" class="table-checkbox" />';

                }

                tbodyHtml += "</td></tr>";

            });

            //表格赋值
            $('#entry-datatables tbody').html(tbodyHtml);
        },
        error:function(jqXHR, textStatus, errorThrown){
            $("#entry-datatables").hideLoading();
            console.log(jqXHR.responseText);
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求失败', '');

            }
        }
    });
};

//给后台提交数据
function ywAlarmSetGDUpt(){

    var postDataArr = [];

    //获取当前传递给后台的数组
    $(dataArr).each(function(i,o){

        //获取当前数据自动派单的状态
        var dom = $('#entry-datatables tbody').find('input').eq(i);

        var ifChoose = dom.is(':checked');

        if(ifChoose){

            o.flag = 1

        }else{

            o.flag = 0;
        }

        postDataArr.push(o);

    });


    var prm ={
        "alarmgis": postDataArr,
        userID:_userIdNum,  //当前用户id
        userName:_userIdName,  //当前用户名
        "b_UserRole": _userRole,
        "b_DepartNum": _userBM
    };

    $.ajax({
        type:'post',
        url:_urls + 'NJNDeviceShow/ywAlarmSetGDUpt',
        data:prm,
        timeout:_theTimes,
        success:function(result){

            //获取后台数据
            ywGetAlarmSetGD();

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    })

};
