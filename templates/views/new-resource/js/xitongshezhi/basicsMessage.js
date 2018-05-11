/**
 * Created by admin on 2018/5/3.
 */
$(function() {

    //获取全部车站
    getAlarmStation();

    //获取当前数据
    getPointerBaseInfo();

});

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

//获取当前页面信息
function getPointerBaseInfo(){

    //获取当前车站
    var pointerID = $('#alarm-station').val();

    //定义传递给后台的数据
    var ecParams = {
        "pointerID": pointerID

    };

    $.ajax({
        type:'get',
        url:sessionStorage.apiUrlPrefix + 'NJNDeviceShow/GetPointerBaseInfo',
        data:ecParams,
        beforeSend:function(){

            $('.out-body-container').showLoading();

        },
        success:function(result){

            $('.out-body-container').hideLoading();

            //console.log(result);

            //获取当前楼宇图片地址
            var imgUrl = result.pointerImgLocal;

            $('.left-body-container .left-top-picture').attr('src',imgUrl);

            //获取当前图片的宽度
            var imgWidth = $('.left-body-container').width();

            var imgHeight = imgWidth / 2.3;

            $('.left-body-container .left-top-picture').css({

                'height':imgHeight
            });

            //获取当前平台名称
            var pointerTerraceName = result.pointerTerraceName;

            $('.left-body-container .left-terrace-name').html(pointerTerraceName);

            //获取当前的平台介绍
            var terraceDesc = result.terraceDesc;

            $('.left-body-container .left-terrace-describe').html(terraceDesc);

            //获取客站名称
            var pointerName = result.pointerName;

            $('#alarm-datatables .pointer-name').html(pointerName);

            //获取客站等级
            var pointerGrade = result.pointerGrade;

            $('#alarm-datatables .pointer-grade').html(pointerGrade);

            //获取客站建筑面积
            var buildArea = result.buildArea;

            $('#alarm-datatables .building-area').html(buildArea);

            //获取站台规模
            var pointerScale = result.pointerScale;

            $('#alarm-datatables .platform-scale').html(pointerScale);

            //获取客站空调面积
            var airArea = result.airArea;

            $('#alarm-datatables .air-area').html(airArea);

            //获取客站投用时间
            var useDT = result.useDT;

            $('#alarm-datatables .use-time').html(useDT);

            //获取地理位置
            var locationName = result.locationName;

            $('#alarm-datatables .position').html(locationName);

            //获取气候带
            var climaticZone = result.climaticZone;

            $('#alarm-datatables .climatic').html(climaticZone);

            //绘制下方主体数据
            var tbodyHtml = drawTbodyData(result.subsystemDetailDatas);

            //页面赋值
            $('#system-datatables tbody').html(tbodyHtml);

        },
        error:function(jqXHR, textStatus, errorThrown){

            $('.out-body-container').hideLoading();
            console.log(jqXHR.responseText);
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求超时', '');

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请求失败', '');

            }
        }
    });
}

//绘制tbody中主体数据
function drawTbodyData(arr,addLength){

    var tbodyHtml = "";

    $(arr).each(function(i,o){

        tbodyHtml += "<tr>";

        $(o.subsystemDetails).each(function(k,j){

            if(k == 0){

                if(i == 2 || i== 4){

                    tbodyHtml += "";

                }else if(i == 1 || i==3){

                    tbodyHtml += "<td style='text-align:center;background: #E2E9F2;border:1px solid #DCDCDC' rowspan='2'>"+j+"</td>";

                }else{

                    tbodyHtml += "<td style='text-align:center;background: #E2E9F2;border:1px solid #DCDCDC'>"+j+"</td>";


                }


            }else{

                tbodyHtml += "<td style='text-align:center;background: #ffffff;border:1px solid #DCDCDC'>"+j+"</td>";

            }

        });

        tbodyHtml += "</tr>";

    });

    return tbodyHtml;
};