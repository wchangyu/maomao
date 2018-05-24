$(function(){

    /*------------------------------------------时间插件--------------------------------------------*/

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //设置默认时间
    var nowTime = moment().subtract(1,'months').format('YYYY/MM/DD');

    //开始时间
    var st = moment(nowTime).startOf('months').format('YYYY/MM/DD');

    //结束时间
    var et = moment().format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(st);

    $('.datatimeblock').eq(1).val(et);

    //条件查询车站
    addStationDom($('#bumen').parent());

    /*------------------------------------------表格初始化---------------------------------------------*/

    var col = [

        {
            title:'料票号码',
            data:'plCode'
        },
        {
            title:'物品编码',
            data:'itemNum1'
        },
        {
            title:'物品名称',
            data:'itemName'
        },
        {
            title:'工单号码',
            data:'gdCode2'
        },
        {
            title:__names.department,
            data:'ddName'
        },
        {
            title:'请领人',
            data:'sign1',
            render:function(data, type, full, meta){

                var dataUrl = 'data:image/png;base64,';

                dataUrl = dataUrl + data;

                // 在image中載入圖檔，再畫到canvas呈現
                var img = new Image();

                img.src = dataUrl;

                if(data==''){

                    return '<div class="table-sign-img"></div>'

                }else{

                    return '<img class="table-sign-img" src="' + dataUrl +'">'

                }
            }

        },
        {
            title:'收料人',
            data:'sign2',
            render:function(data, type, full, meta){

                var dataUrl = 'data:image/png;base64,';

                dataUrl = dataUrl + data;

                // 在image中載入圖檔，再畫到canvas呈現
                var img = new Image();

                img.src = dataUrl;

                if(data==''){

                    return '<div class="table-sign-img"></div>'

                }else{

                    return '<img class="table-sign-img" src="' + dataUrl +'">'

                }
            }
        },
        {
            title:'发料人',
            data:'sign3',
            render:function(data, type, full, meta){

                var dataUrl = 'data:image/png;base64,';

                dataUrl = dataUrl + data;

                // 在image中載入圖檔，再畫到canvas呈現
                var img = new Image();

                img.src = dataUrl;

                if(data==''){

                    return '<div class="table-sign-img"></div>'

                }else{

                    return '<img class="table-sign-img" src="' + dataUrl +'">'

                }
            }
        },
        {
            title:'操作',
            "targets": -1,
            "data": '',
            render:function(data, type, full, meta){

                if(full.orderNum){
                    //a1工单号、a2出库单号、a3物品编号、a4仓库、a5序列号、a6车站
                    return '<a  target="_blank" href="materialOdd.html?a1=' + full.gdCode2 + '&a2=' + full.orderNum + '&a3=' + full.itemNum1 + '&a4=' + full.storageNum + '&a5=' + full.sn + '&a6=' + full.bxKeshiNum + '" class="data-option option-see btn default btn-xs green-stripe">签字</a>'

                }else{

                    return '<a target="_blank" href="materialOdd.html?b1=' + full.plCode + '&b2=' + full.gdCode2  + '&b3=' + full.itemNum1 + '" class="data-option option-see btn default btn-xs green-stripe">签字</a>'

                }

            }
        }

    ]

    _tableInit($('#scrap-datatables'),col,2,'','','');

    //维保车间
    //_getProfession('YWGD/ywGDGetWxBanzuStation',$('#bumen'),'stations','departNum','departName',conditionSelect);

    //维保组
    WxBanzuStationData();

    /*------------------------------------------按钮事件-----------------------------------------------*/

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        //input重置
        $('.condition-query').eq(0).find('input').val('');

        //时间重置
        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);

        //维保组车间
        $('.add-input-select').children('span').html('全部').attr('values','');

    })

    //导出
    $('.excelButton').click(function(){

        _FFExcel($('#scrap-datatables')[0]);

    })

    /*------------------------------------------其他方法-----------------------------------------------*/

    //条件查询
    function conditionSelect(AisWBZ,AisBZ){

        var prm = {

            //开始时间
            st:$('.datatimeblock').eq(0).val(),
            //结束时间
            et:moment($('.datatimeblock').eq(1).val()).add(1,'d').format('YYYY/MM/DD'),
            //维保车间
            wxKeshiNum:$('#bumen1').val(),
            //车站
            bxKeshiNum:$('.add-input-select').children('span').attr('values'),
            //票料号码
            pickListNum:$('.filterInput').eq(0).val(),
            //工单号码
            gdCode2:$('.filterInput').eq(1).val(),
            //出库单号码
            itemNum:$('.filterInput').eq(2).val(),
            //用户id
            userId:_userIdNum,
            //用户名
            userName:_userIdName

        }

        //判断是在维保组中还是维修班组中
        var wbzArr = [];

        if(AisWBZ){

            for(var i=0;i<_AWBZArr.length;i++){

                for(var j=0;j<_AWBZArr[i].wxBanzus.length;j++){

                    wbzArr.push(_AWBZArr[i].wxBanzus[j].departNum);

                }

            }

            prm.wxKeshis = wbzArr;

        }else if(AisBZ){

            prm.wxKeshi = _maintenanceTeam;

        }

        //确定维保组

        function successFun(result){

            _jumpNow($('#scrap-datatables'),result);

        }

        _mainAjaxFun('post','YWCK/ywCKGetPickList',prm,successFun)


    }

    //定制传参
    function WxBanzuStationData(){

        //维保组
        var AWBZArr = [];

        //维修班组
        var ABZArr = [];

        //标识是在维保组中
        var AisWBZ = false;

        //标识在维修班组中
        var AisBZ = false;

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:{

                //用户id
                userID:_userIdNum,
                //用户姓名
                userName:_userIdName
            },
            timeout:_theTimes,
            success:function(result){

                AWBZArr.length = 0;

                ABZArr.length = 0;

                //维保组下拉框
                var  WBZstr = '<option value="">全部</option>';

                //维修班组
                var WXBZstr = '<option value="">全部</option>'

                if(result){

                    if(result.stations){

                        for(var i=0;i<result.stations.length;i++){

                            if( _maintenanceTeam == result.stations[i].departNum ){

                                //在车间中
                                AisWBZ = true;

                                _AWBZArr.push(result.stations[i]);

                            }

                            WBZstr += '<option value="' + result.stations[i].departNum + '">' + result.stations[i].departName + '</option>';


                        }

                    }

                    if( result.wxBanzus ){

                        for(var i=0;i<result.wxBanzus.length;i++){

                            if(_maintenanceTeam == result.wxBanzus[i].departNum){

                                AisBZ = true;

                                _ABZArr.push(result.wxBanzus[i]);

                            }

                            WXBZstr += '<option value="' + result.wxBanzus[i].departNum + '">' + result.wxBanzus[i].departName + '</option>';

                        }

                    }

                    //赋值
                    $('#bumen1').empty().append(WBZstr);

                    $('#wxBz').empty().append(WXBZstr);

                    if(AisWBZ){

                        $('#bumen1').val(_maintenanceTeam);

                        $('#bumen1').attr('disabled',true).addClass('disabled-block');

                    }else if(AisBZ){

                        $('#wxBz').val(_maintenanceTeam);

                        //通过判断班组来确定维保组的值
                        for(var i=0;i<result.wxBanzus.length;i++){

                            if(_maintenanceTeam == result.wxBanzus[i].departNum){

                                $('#bumen1').val(result.wxBanzus[i].parentNum)

                                $('#bumen1').attr('disabled',true).addClass('disabled-block');

                            }

                        }

                    }else{

                        $('#bumen1').attr('disabled',false).removeClass('disabled-block');

                    }

                    conditionSelect(AisWBZ,AisBZ);


                }



            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(jqXHR.responseText);
            }

        })

    }

})