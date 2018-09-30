/**
 * Created by admin on 2018/9/28.
 */
//报警类型
function typeOfAlarm(){

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcType',
        success:function(result){

            //console.log(result);

            var html = ' <li class="the-select-message the-exc-type onChoose" data-id="-1">全部</li>';

            $(result).each(function(i,o){

                html += ' <li class="the-select-message the-exc-type " data-id="'+o.innerID+'">'+ o.cDtnName+'</li>';

            });

            $('.choose-exc ul').html(html);

            //获取能耗种类
            energyTypes();

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
};

//能耗种类
function energyTypes(){

    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllEnergyTypes',
        success:function(result){

            // console.log(result);

            var html = ' <li class="the-select-message the-energy-type onChoose" data-id="0">全部</li>';

            $(result).each(function(i,o){

                html += ' <li class="the-select-message the-energy-type " data-id="'+o.energyTypeID+'">'+ o.energyTypeName+'</li>';

            });

            $('.choose-energy ul').html(html);

            //获取报警数据
            alarmHistory();

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
};

//对返回的数据进行拼接 flag=true 则拼接全部数据
function jointHtml(dataArr,flag){

    var html = '';

    //遍历数据 放入页面中
    $(dataArr).each(function(i,o){

        if(!flag){

            if(i > 8){

                html +=   '<div class="warning-data all-warning-data">' +

                    '<div class="all-data-btn">' +

                    '<p>查看全部</p>' +

                    '</div>' +

                    '</div>';

                return  false;
            }
        }

        //历史报警数量
        var historyNum = o.rowDetailsExcDatas.length;

        //控制报警等级颜色
        var colorClass = '';

        //紧急报警
        if(o.priorityID == 3){

            colorClass = 'the-import';

            //普通报警
        }else  if(o.priorityID == 1){

            colorClass = '';

        }

        //控制是否能创建工单
        var creatOrderClass = '';

        if( o.dum && o.dNum != ''){

            colorClass = 'can-creat';

        }

        //控制是否定位到流程图
        var locationMonitorClass = userMonitorClass;

        if(o.isHavingProc != 0){

            locationMonitorClass += ' examine-monitor';
        }

        //时间
        var dataSplit = o.dataDate.split('T')[1].split(':');
        var dataJoin =o.dataDate.split('T')[0] + ' ' +dataSplit[0] + ':' + dataSplit[1];


        html += 	'<div class="warning-data">' +

            '<!--左侧栏目-->' +
            '<div class="left-warning-tab">' +
            '<p>时间</p>' +
            '<p>支路</p>' +
            '<p>楼宇名称</p>' +
            '<p>报警事件</p>' +
            '<p>报警类型</p>' +
            '<p>报警条件</p>' +
            '<p>此时数据</p>' +
            '<p>报警等级</p>' +
            '</div>' +

            '<!--右侧数据-->' +
            '<div class="right-warning-message">' +

            '<!--时间-->' +
            '<p class="dataDate">'+ dataJoin+'</p>' +

            '<!--支路-->' +
            '<p class="cName">'+ o.cName+'</p>' +

            '<!--楼宇-->' +
            '<p class="pointerName">'+ o.pointerName+'</p>' +

            '<!--报警事件-->' +
            '<p class="alarmSetName">'+ o.alarmSetName+'</p>' +

            '<!--报警类型-->' +
            '<p class="cDtnName">'+ o.cDtnName+'</p>' +

            '<!--报警条件-->' +
            '<p class="expression">'+ o.expression+'</p>' +

            '<!--此时数据-->' +
            '<p class="data">'+ o.data+'</p>' +

            '<!--报警等级-->' +
            '<p class="priority '+colorClass+'">'+ o.priority+'</p>' +

            '</div>' +

            '<!--生成工单按钮-->' +
            '<span class="create-order '+creatOrderClass+'" data-devNum ="'+o.dNum+'" data-pointer ="'+o.pointerID+'" data-cdata ="'+o.cdataID+'">生成工单</span>' +

            '<!--故障定位按钮-->' +
            '<span class="fault-location '+locationMonitorClass+'" data-pointer ="'+o.pointerID+'" data-cdata ="'+o.cdataID+'">故障定位</span>' +

            '<!--历史报警数量-->' +
            "<span class='history-alarm-num'>"+historyNum+"</span>" +

            '</div>';

    });

    html += '<div class="clearfix"></div>';

    //页面赋值
    $('.warning-data-container').html(html);

};

//获取工单信息
function getOrderMessage(dom){

    var prm = {

        //pointer
        pointerid:dom.attr('data-pointer'),

        //cdataId
        cdataid:dom.attr('data-cdata')

    };

    //console.log(prm);

    //获取设备信息
    $.ajax({

        type:'post',

        url:sessionStorage.apiUrlPrefix + 'NJNDeviceShow/ywDevGetDevInfo',

        data:JSON.stringify(prm),

        contentType:'application/json',

        timeout:_theTimes,

        success:function(result){

            $('#theLoading').modal('hide');

            if(result != null){

                //赋值
                //设备名称
                $('#devMC').val(result.devname);

                //设备编码(非必填)
                $('#devBM').val(result.dnum);

                //报修人信息
                $('#bxRen').val(userInfo.userName);

                //报修科室
                $('#bxSec').val(userInfo.departName);

                //设备系统
                $('#devSys').val(result.dsname);

                //设备分类
                $('#devMatter').val(result.dcname);

                //维修地点
                $('#wxAdd').val(result.devlocal);

                var thisTr =dom.parents('.warning-data');

                //报修备注
                var str = '1、时间：' + thisTr.find('.dataDate').html() + '；'

                    + '2、支路：' +  thisTr.find('.cName').html() + '；'

                    + '3、报警事件：' +  thisTr.find('.alarmSetName').html() + '；'

                    + '4、此时数据：' +  thisTr.find('.data').html() + '；'

                    + '5、报警等级：' +  thisTr.find('.priority').html() + '；';

                //报修备注
                $('#bxRem').val(str);

            }

        },

        error:_errorFun1

    });


};

//点击工单确定按钮
function postOrder(){

    //维修地点必填
    if($('#wxAdd').val() == ''){

        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        return false;

    }

    //后台接口地址
    var url = 'YWGD/ywGDCreDJDI';

    //参数
    var wxShix = "null";

    //如果设备分类由值，那么就传设备分类的值，如果没有就传null，维修事项也一样
    var dcname = $('#devMatter').val();

    if(dcname!=''){

        wxShix = dcname;

    }

    var prm = {

        //是否紧急
        'gdJJ':0,

        //设备名称
        'dName':'',
        //设备编码
        'dNum':'',
        //报修电话
        'bxDianhua':$('#bxTel').val() == ''?'123456':$('#bxTel').val(),
        //报修人信息
        'bxRen':$('#bxRen').val(),
        //维修地点
        'wxDidian':$('#wxAdd').val(),
        //报修部门
        'bxKeshi':$('#bxSec').val(),
        //报修部门编码
        'wxKeshiNum':userInfo.departNum,
        //设备分类
        'dcName':dcname,
        //设备分类编码***
        'dcNum':'',
        //报修备注
        'bxBeizhu':$('#bxRem').val(),
        //设备系统
        'wxShiX':wxShix,
        //设备系统编码***
        'wxShiXNum':'',
        //当前用户id
        'userID':_userIdNum,
        //工单来源*
        'gdSrc':3,
        //巡检任务编码
        'itkNum':'',
        //维修设备
        'wxShebei':$('#devBM').val()

    };

    var successFun = function(result){

        $('#theLoading').modal('hide');

        if(result == 3){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单创建失败！', '');

        }else{

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'工单创建成功！', '');

            $('#Creat-myModa').modal('hide');

            $('#myModal2').modal('hide');

            //刷新数据
            alarmHistory();

        }

    };

    //调用数据
    _mainAjaxFunComplete('post',url,prm,successFun,beforeSendFun,errorFun);

};

//绘制页面中的历史报警数据
function drawHistoryTable(historyArr){

    var html = "";


    $(historyArr).each(function(i,o){

        //时间
        var dataSplit = o.dataDate.split('T')[1].split(':');
        var dataJoin =o.dataDate.split('T')[0] + ' ' +dataSplit[0] + ':' + dataSplit[1];

        html += '<tr>' +
                //时间
            '<td>'+ dataJoin+'</td>'+

                //报警事件
            '<td>'+ o.alarmSetName+'</td>'+
                //报警类型
            '<td>'+ o.cDtnName+'</td>'+
                //报警条件
            '<td>'+ o.expression+'</td>'+
                //此时数据
            '<td>'+ o.data.toFixed(1)+'</td>'+
                //报警等级
            '<td>'+ o.priority+'</td>'+

            '</tr>'
    });

    $('#dateTables tbody').html(html);

}