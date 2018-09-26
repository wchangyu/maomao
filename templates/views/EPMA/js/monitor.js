var Monitor = function () {
  
    var oTable=null;

    var col = [

        {
            title:'数据时间',
            data:'time'
        },
        {
            title:'监测设备',
            data:'dev'
        },
        {
            title:'数据',
            data:'data'
        },
        {
            title:'单位',
            data:'unit'
        }

    ]

    _tableInit($("#table"),col,2,false,'','','','',50,'','','暂时没有获取到实时数据');

    var getMonitorDs = function () {
        jQuery('#IsBusy').showLoading();
        var url = sessionStorage.apiUrlPrefix + "Monitor/GetMonitorInstDs";
        $.post(url,{
            sSearch:sessionStorage.PointerID,
            misc:sessionStorage.misc
        },function (res) {

            var dataArr=[];

            if(res.aaData.length>0) {

                for(var i=0;i<res.aaData.length;i++){

                    var obj = {};

                    obj.time = res.aaData[i][0];

                    obj.dev = res.aaData[i][1];

                    obj.data = res.aaData[i][2];

                    obj.unit = res.aaData[i][3];

                    dataArr.push(obj);

                }

            }

            _datasTable($('#table'),dataArr);

            jQuery('#IsBusy').hideLoading();
        });
    }

    //结算调整弹窗中 生成超额用能通知单
    $('#monitorBtn').on('click',function(){

        _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'无数据，生成失败!', '');

        return false;

        jQuery('#IsBusy').showLoading();

        var url = sessionStorage.apiUrlPrefix + "Monitor/ExportMonitorInstDs";

        $.ajax({
            type: 'get',
            url: url,
            data:{

                sSearch : sessionStorage.PointerID

            },
            success: function (xml,textStatus, xhr) {

                jQuery('#IsBusy').hideLoading();

                var status =  xhr.status;

                if(status == 204){

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'无数据，生成失败!', '');

                    return false;
                };

                window.open(sessionStorage.apiUrlPrefix + "Monitor/ExportMonitorInstDs?sSearch="+ sessionStorage.PointerID);

            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

                jQuery('#IsBusy').hideLoading();

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }


            }
        });

    });


    return {
        init: function () {
            //查询实时数据
            getMonitorDs()

        }
    }

}();