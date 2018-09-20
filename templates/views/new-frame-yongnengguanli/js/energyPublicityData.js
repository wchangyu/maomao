/**
 * Created by admin on 2018/9/18.
 */
$(function(){

    //获取对象以及初始数据
    getEnterprise();

    //查询按钮
    $('.demand').click(function(){

        getEnergyPublicityData();

    });


});


//存放全部企业ID
var enterpriseIDArr = [];

//是否展示床位
var ifShowBed = false;

//获取后台数据
function getEnergyPublicityData(){

    //获取企业ID
    var enterpriseID = $('.choose-object-select .onChoose').attr('data-id');

    var postEnterPriseIDArr = [];

    //如果是全部的话 传其所属的所有企业ID
    if(enterpriseID == 0){

        postEnterPriseIDArr = enterpriseIDArr;
        //否则传当前企业ID
    }else{

        postEnterPriseIDArr = [enterpriseID];
    }

    //定义开始结束时间
    var startTime = '';
    var endTime = '';

    //获取时间
    var selectTime = $('.choose-time-select .onChoose').attr('data-id');

    //用户选择本月
    if(selectTime == 1){

        startTime = moment().startOf('month').format('YYYY-MM-DD');

        endTime = moment().endOf('month').add('1','days').format('YYYY-MM-DD');

        //用户选择本年
    }else  if(selectTime == 2){

        startTime = moment().startOf('year').format('YYYY-MM-DD');

        endTime = moment().endOf('year').add('1','days').format('YYYY-MM-DD');

        //用户选择上月
    }else if(selectTime == 3){

        startTime = moment().subtract('1','months').startOf('month').format('YYYY-MM-DD');

        endTime = moment().subtract('1','months').endOf('month').add('1','days').format('YYYY-MM-DD');

        //用户选择上年
    }else  if(selectTime == 2){

        startTime = moment().subtract('1','years').startOf('year').format('YYYY-MM-DD');

        endTime = moment().subtract('1','years').endOf('year').add('1','days').format('YYYY-MM-DD');
    }

    var ecParams = {

        "enterpriseIDs": postEnterPriseIDArr,
        "startTime": startTime,
        "endTime": endTime
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+'EnergyManageV2/GetEnergyPublicityData',
        data:ecParams,
        timeout:_theTimes,
        beforeSend: function () {
            $('#theLoading').modal('hide');
            $('#theLoading').modal('show');
        },
        complete: function () {
            $('#theLoading').modal('hide');
        },
        success:function(result){

            //console.log(result);

            //判断是否返回数据
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }


            //左上角整体数据
            var tableHtml1 = '';

            //总占地面积 建筑面积
            tableHtml1 +=   '<tr>' +
                '<td>总占地面积</td><td>'+result.landArea+'</td><td>平米</td>' +
                '</tr>'+
                '<tr>' +
                '<td>总建筑面积</td><td>'+result.buildArea.toFixed(2) +'</td><td>平米</td>';
            //判断是否需要展示床位

            if(result.beeWebMode == 0){

                ifShowBed = false;

                //高校模式不展示床位
                tableHtml1 +=  '</tr>';

            }else if(result.beeWebMode == 1){

                ifShowBed = true;

                //医院模式展示床位
                tableHtml1 +=  '</tr><tr><td>总床位数</td><td>'+result.bedNum+'</td><td>个</td></tr>';
            }


            $('#dateTables tbody').html(tableHtml1);

            //右侧楼宇数据
            var pointerArr = result.pointerEnergyItems.splice(0,50);

            _datasTable($('#dateTables1'),pointerArr);

            //右侧分户数据
            var officeEnergyItemsArr = result.officeEnergyItems.splice(0,50);

            _datasTable($('#dateTables3'),officeEnergyItemsArr);

            //左下角整体数据
            var energyArr = result.energyItemDatas;

            var tableHtml2 = '';

            //总用电数据
            var electricity1 = 0;
            //单位面积用电
            var electricity2 = 0;
            //单位床位用电
            var electricity3 = 0;

            //总用水数据
            var water1 = 0;
            //单位面积用水
            var water2 = 0;
            //单位床位用水
            var water3 = 0;

            //总用气数据
            var air1 = 0;

            //总用能数据
            var energy1 = 0;
            //单位面积用能
            var energy2 = 0;
            //单位床位用能
            var energy3 = 0;

            var unitObj = $.parseJSON(sessionStorage.getItem('allEnergyType'));

            var unitArr = unitObj.alltypes;

            $(unitArr).each(function(i,o){

                //获取当前能耗名称
                var etname = o.etname;

                //获取当前能耗单位
                var etunit = o.etunitZH;

                //获取当前能耗id
                var etid = o.etid;

                //遍历获取到的数组
                $(energyArr).each(function(i,o){

                    var totalData = o.energyData.toFixed(2);


                    //总能耗数据
                    if(o.energyItemId == etid && o.energyFlag == 1){

                        tableHtml2 +=

                            //总用电
                            '<tr>' +
                                //名称
                            '<td>总用'+etname+'</td>' +
                                //数值
                            '<td>'+ totalData+'</td>' +
                                //单位
                            '<td>'+etunit+'</td>' +
                            '</tr>';

                        //单位面积能耗
                    }else if(o.energyItemId == etid && o.energyFlag == 3){

                        tableHtml2 +=
                            //单位面积用电
                            '<tr>' +
                                //名称
                            '<td>单位面积用'+etname+'</td>' +
                                //数值
                            '<td>'+ totalData+'</td>' +
                                //单位
                            '<td>'+etunit+'/平米/天</td>' +
                            '</tr>';

                        //单位床位能耗
                    }else if(o.energyItemId == etid && o.energyFlag == 9){

                        if( ifShowBed == true){

                            tableHtml2 +=
                                //单位面积用电
                                '<tr>' +
                                    //名称
                                '<td>单位床位用'+etname+'</td>' +
                                    //数值
                                '<td>'+ totalData+'</td>' +
                                    //单位
                                '<td>'+etunit+'/床</td>' +
                                '</tr>';
                        }
                    }

                });
            });

            $(energyArr).each(function(i,o){

                //总用能数据
                if(o.energyItemId == '-2' && o.energyFlag == 1){

                    energy1 = o.energyData.toFixed(2);
                }

                //单位面积用能数据
                if(o.energyItemId == '-2' && o.energyFlag == 3){

                    energy2 = o.energyData.toFixed(2);
                }

                //单位床位用能数据
                if(o.energyItemId == '-2' && o.energyFlag == 9){

                    energy3 = o.energyData.toFixed(2);
                }

            });

            tableHtml2 +=
                //总用能
                '<tr>' +
                    //名称
                '<td>总用能(折算标煤)</td>' +
                    //数值
                '<td>'+ energy1+'</td>' +
                    //单位
                '<td>吨标煤</td>' +
                '</tr>'+

                    //单位面积用能(折算标煤)
                '<tr>' +
                    //名称
                '<td>单位面积用能(折算标煤)</td>' +
                    //数值
                '<td>'+ energy2+'</td>' +
                    //单位
                '<td>吨标煤/平米/天</td>' +
                '</tr>';

            if( ifShowBed == true){
                tableHtml2 +=
                    //单位床位用能(折算标煤)
                    '<tr>' +
                        //名称
                    '<td>单位床位用能(折算标煤)</td>' +
                        //数值
                    '<td>'+ energy3+'</td>' +
                        //单位
                    '<td>吨标煤/床</td>' +
                    '</tr>';
            }

            //给左下角表格赋值
            $('#dateTables2 tbody').html(tableHtml2);
        },
        error:function(jqXHR, textStatus, errorThrown){
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }

        }
    })
};

//获取对象数据
function getEnterprise(){

    //获取不带楼宇的区域位置
    var enterArr =  getPointerTree();

    //给页面select框赋值
    var html = '';

    $(enterArr).each(function(i,o){
        //nodeType 表示当前类型：0 区域 1 企业 2 楼宇
        if(o.nodeType == 0){

            html += '<li data-id="0" class="onChoose the-select-message the-object-type">'+ o.name+'</li>';


            $('.choose-object1 font').html(o.name);


        }else{

            html += '<li class="the-select-message the-object-type" data-id="'+ o.id+'">'+ o.name+'</li>';

            //存储全部企业ID
            enterpriseIDArr.push(o.id);
        }

    });

    $('.choose-object-select ul').html(html);

    getEnergyPublicityData();
};

//右上角楼宇table
var table = $('#dateTables1').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": false,
    'searching':false,
    'info':false,
    //"scrollY": '400px', //支持垂直滚动
    //"scrollCollapse": true,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'序号',
            data:null,
            render:function(data, type, full, meta){

                return meta.row + 1;
            }
        },
        {
            title:'名称',
            class:'',
            data:"pointerName"
        },
        {
            title:'建筑面积<br />(平米)',
            data:"buildArea",
            render:function(data, type, full, meta){

                return data.toFixed(2);
            }
        },
        {
            title:'床位数<br />(个)',
            data:"bedNum"
        },
        {
            title:'总用电量<br />(度)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData= 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '01' && o.energyFlag == 1){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'单位面积用电量<br />(度/平米/天)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '01' && o.energyFlag == 3){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'单位床位用电量<br />(度/床)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '01' && o.energyFlag == 9){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'总用水量<br />(吨)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '211' && o.energyFlag == 1){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'单位面积用水量<br />(吨/平米/天)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '211' && o.energyFlag == 3){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'单位床位用水量<br />(吨/床)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '211' && o.energyFlag == 9){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        }

    ],
    //是否显示床位
    createdRow: function(row,data,index){
        if(ifShowBed == false){

            $('td', row).eq(3).addClass('theHidden');
            $('#dateTables1 th').eq(3).addClass('theHidden');

            $('td', row).eq(6).addClass('theHidden');
            $('#dateTables1 th').eq(6).addClass('theHidden');

            $('td', row).eq(9).addClass('theHidden');
            $('#dateTables1 th').eq(9).addClass('theHidden');
        }

    }
});

//右下角table
var table1 = $('#dateTables3').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": false,
    'searching':false,
    'info':false,
    //"scrollY": '400px', //支持垂直滚动
    //"scrollCollapse": true,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'序号',
            data:null,
            render:function(data, type, full, meta){

                return meta.row + 1 ;
            }
        },
        {
            title:'名称',
            class:'',
            data:"officeName"
        },
        {
            title:'建筑面积<br />(平米)',
            data:"buildArea",
            render:function(data, type, full, meta){

                return data.toFixed(2);
            }
        },
        {
            title:'床位数<br />(个)',
            data:"bedNum"
        },
        {
            title:'总用电量<br />(度)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData= 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '01' && o.energyFlag == 1){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'单位面积用电量<br />(度/平米/天)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '01' && o.energyFlag == 3){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'单位床位用电量<br />(度/床)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '01' && o.energyFlag == 9){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'总用水量<br />(吨)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '211' && o.energyFlag == 1){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'单位面积用水量<br />(吨/平米/天)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '211' && o.energyFlag == 3){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        },
        {
            title:'单位床位用水量<br />(吨/床)',
            data:"energyItemDatas",
            render:function(data, type, full, meta){

                var thisData = 0;

                $(data).each(function(i,o){

                    if(o.energyItemId == '211' && o.energyFlag == 9){
                        thisData = o.energyData.toFixed(2);
                        return false;
                    }
                })

                return thisData
            }
        }

    ],
    //是否显示床位
    createdRow: function(row,data,index){
        if(ifShowBed == false){

            $('td', row).eq(3).addClass('theHidden');
            $('#dateTables3 th').eq(3).addClass('theHidden');

            $('td', row).eq(6).addClass('theHidden');
            $('#dateTables3 th').eq(6).addClass('theHidden');

            $('td', row).eq(9).addClass('theHidden');
            $('#dateTables3 th').eq(9).addClass('theHidden');
        }

    }
});