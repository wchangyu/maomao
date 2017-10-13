$(function(){
    //记录能耗种类
    var _ajaxEcType = '';

    //记录能耗种类名称
    var _ajaxEcTypeWord = '';

    //读取能耗种类
    _getEcType('initPointers');

    _getEcTypeWord();

    //默认能耗种类
    _ajaxEcType =_getEcTypeValue();

    _ajaxEcTypeWord = _getEcTypeWord();

    //楼宇ztree树
    var _pointerZtree = _getPointerZtree($("#allPointer"));

    //科室ztree树
    var _officeZtree = _getOfficeZtree($("#allOffices"));

    //楼宇搜索功能
    _searchPO($(".tipess"),"allPointer",$(".tipes"),"allOffices");

    //记录开始时间
    var _nowTimeStart;

    //记录结束时间
    var _nowTimeEnd;

    //环比开始时间
    var _huanTimeStart;

    //环比结束时间
    var _huanTimeEnd;

    //同比开始时间
    var _tongTimeStart;

    //同比结束时间
    var _tongTimeEnd;

    //记录当前选择的时间颗粒度
    var _ajaxType;

    //记录当前日期颗粒度
    var _ajaxDateType;

    //当前选中的区域名称
    var _pointerNames;

    //默认上日
    timeYesterday();

	//默认加载数据
	getPointerData();

    /*---------------------------------echart-----------------------------------*/
    //环比折线图
    var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

    //环比柱折图
    var myChartTopRight = echarts.init(document.getElementById('rheader-content-17'));

    //同比折线图
    var myChartBottomLeft = echarts.init(document.getElementById('rheader-content-18'));

    //电-同比分析-柱折图
    var myChartBottomRight = echarts.init(document.getElementById('rheader-content-19'));

    //柱状图配置项
    var optionBar = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['本期用电','上期用电'],
            top:'30',
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                show:'true',
                type : 'category',
                data:[]
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'本期用电',
                type:'bar',
                data:[],
                barMaxWidth: '60',
            },
            {
                name:'上期用电',
                type:'bar',
                data:[],
                barMaxWidth: '60',
            }
        ]
    };

    //柱折图配置项
    var optionLineBar = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['累计值', '比较斜率'],
            top:'30'
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['bar', 'line']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['本期','上期']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        grid: {
            left: '20%',
            right: '10%'
        },
        series : [
            {
                name:'累计值',
                type:'bar',
                barMaxWidth: '50',
                data:[],
                itemStyle:{
                    normal:{
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = [
                                '#d53a35','#2f4554','#FCCE10','#E87C25','#27727B',
                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        },
                    }
                }
            },
            {
                name:'比较斜率',
                type:'line',
                data:[],
            }
        ]
    };

    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        //先判断获取的是楼宇还是科室
        var o = $('.tree-3')[0].style.display;
        var a = $('.tree-2')[0].style.display;
        if(a == 'none'){
            //楼宇数据
            getPointerData();
        }else{
            //科室数据
            getOfficeData();
        }

    });

	//时间选择
	$('.time-options').click(function(){
		$('.time-options').removeClass('time-options-1');
		$(this).addClass('time-options-1');
		var sss = $('.time-options-1').index('.time-options');
		if(sss == 0){
			timeYesterday();
		}else if(sss == 1){
			timeLastWeek();
		}else if(sss == 2){
			timeLastMonth();
		}else if(sss == 3){
			timeLastYear();
		}
	});

	//能耗选择
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});

    //楼宇科室选择
    $('.left-middle-tab').click(function(){
        $('.tree-1').hide();
        $('.tree-1').eq($(this).index()).show();
        if($(this).index() == 0){
            _getEcType('initPointers');
        }else if ($(this).index() == 1){
            _getEcType('initOffices');
        }
    })

    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft && myChartTopRight && myChartBottomLeft && myChartBottomRight){
            myChartTopLeft.resize();
            myChartTopRight.resize();
            myChartBottomLeft.resize();
            myChartBottomRight.resize();
        }
    };
    /*---------------------------------otherFunction------------------------------*/
    //上日、上周、上月、上年
    //上日时间
    function timeYesterday(){
        _nowTimeStart = moment().subtract(1,'d').format('YYYY/MM/DD');
        _nowTimeEnd = moment().format('YYYY/MM/DD');


        _huanTimeStart = moment().subtract(2,'d').format('YYYY/MM/DD');
        _huanTimeEnd = moment().subtract(1,'d').format('YYYY/MM/DD');

        _tongTimeStart = moment().subtract(1,'year').subtract(1,'d').format('YYYY/MM/DD');
        _tongTimeEnd = moment().subtract(1,'year').format('YYYY/MM/DD');

        _ajaxType = '小时';
        _ajaxDateType = '日';
    }

    //上周时间(无环比)
    function timeLastWeek(){
        _nowTimeStart = moment().subtract(7,'d').startOf('week').add(1,'d').format('YYYY/MM/DD');
        _nowTimeEnd = moment().subtract(7,'d').endOf('week').add(2,'d').format('YYYY/MM/DD');

        _huanTimeStart = moment().subtract(14,'d').startOf('week').add(1,'d').format('YYYY/MM/DD');
        _huanTimeEnd = moment().subtract(14,'d').endOf('week').add(2,'d').format('YYYY/MM/DD');

        _ajaxType = '日';
        _ajaxDateType = '周';
    }

    //上月时间
    function timeLastMonth(){
        _nowTimeStart = moment().subtract(1,'month').startOf('month').format('YYYY/MM/DD');
        _nowTimeEnd = moment().subtract(1,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');

        _huanTimeStart = moment().subtract(2,'month').startOf('month').format('YYYY/MM/DD');
        _huanTimeEnd = moment().subtract(2,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');

        _tongTimeStart = moment().subtract(1,'year').subtract(1,'month').startOf('month').format('YYYY/MM/DD');
        _tongTimeEnd = moment().subtract(1,'year').subtract(1,'month').endOf('month').add(1,'d').format('YYYY/MM/DD');

        _ajaxType = '日';
        _ajaxDateType = '月';
    }

    //上年时间
    function timeLastYear(){
        _nowTimeStart = moment().subtract(1,'year').startOf('year').format('YYYY/MM/DD');
        _nowTimeEnd = moment().subtract(1,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');

        _huanTimeStart = moment().subtract(2,'year').startOf('year').format('YYYY/MM/DD');
        _huanTimeEnd = moment().subtract(2,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');

        _tongTimeStart = moment().subtract(2,'year').startOf('year').format('YYYY/MM/DD');
        _tongTimeEnd = moment().subtract(2,'year').endOf('year').add(1,'d').format('YYYY/MM/DD');

        _ajaxType = '月';
        _ajaxDateType = '年';
    }

    //区域位置数据
    function getPointerData(){
        //定义存放返回数据的数组（本期 X Y）
        var allData = [];
        var allDataX = [];
        var allDataY = [];
        var totalAllData = 0;
        //(环比)
        var huanData = [];
        var huanDataY = [];
        var huanTotalData = 0;
        //(同比)
        var tongData = [];
        var tongDataY = [];
        var tongTotalData = 0;
        //确定楼宇id
        var pts = _pointerZtree.getSelectedPointers(),pointerID;

        if(pts.length > 0){
            pointerID = pts[0].pointerID;
            _pointerNames = pts[0].pointerName;
        }
        if(!pointerID) { return; }
        //存放要传的楼宇集合
        var postPointerID = [];

        $(pts).each(function(i,o){

            postPointerID.push(o.pointerID)
        });

        //定义获得本期数据的参数
        var ecParams = {
            'ecTypeId':_ajaxEcType,
            'pointerID':pointerID,
            'pointerIds':postPointerID,
            'startTime':_nowTimeStart,
            'endTime':_nowTimeEnd,
            'dateType':_ajaxType
        }

        //环比(前一天，前一周，前一个月，前一年)
        var huanParams = {
            'ecTypeId':_ajaxEcType,
            'pointerID':pointerID,
            'pointerIds':postPointerID,
            'startTime':_huanTimeStart,
            'endTime':_huanTimeEnd,
            'dateType':_ajaxType
        }

        //同比(去年的同一时期，没有周，环比和同比的年一样)
        var tongParams = {
            'ecTypeId':_ajaxEcType,
            'pointerID':pointerID,
            'pointerIds':postPointerID,
            'startTime':_tongTimeStart,
            'endTime':_tongTimeEnd,
            'dateType':_ajaxType
        }

        //发送本期请求
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
            data:ecParams,
            beforeSend:function(){
                //myChartTopLeft.showLoading({
                //    text:'获取数据中',
                //    effect:'whirling'
                //});
                //myChartTopRight.showLoading({
                //    text:'获取数据中',
                //    effect:'whirling'
                //});
            },
            success:function(result){
                //myChartTopLeft.hideLoading();
                //myChartTopRight.hideLoading();
                allData.length = 0;
                for(var i=0;i<result.length;i++){
                    allData.push(result[i]);
                }
                //发送环比请求
                $.ajax({
                    type:'post',
                    url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
                    data:huanParams,
                    beforeSend:function(){
                        //myChartTopLeft.showLoading({
                        //    text:'获取数据中',
                        //    effect:'whirling'
                        //});
                        //myChartTopRight.showLoading({
                        //    text:'获取数据中',
                        //    effect:'whirling'
                        //});
                    },
                    success:function(result){
                        //myChartTopLeft.hideLoading();
                        //myChartTopRight.hideLoading();
                        totalAllData = 0;
                        huanTotalData = 0;
                        allDataX.length = 0;
                        allDataY.length = 0;
                        huanData.length = 0;
                        huanDataY.length = 0;
                        for(var i=0;i<result.length;i++){
                            huanData.push(result[i]);
                        }
                        //绘制echarts
                        if( _ajaxDateType == '日' ){
                            $('.right-top').eq(1).css({'opacity':1});
                            $('.right-top').eq(0).css({'opacity':1});
                            //确定x轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                if(allDataX.indexOf(dataJoin)<0){
                                    allDataX.push(dataJoin);
                                }
                            }
                            //确定本期y轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataJoin == allDataX[j]){
                                        allDataY.push(allData[i].data);
                                        totalAllData += allData[i].data;
                                    }
                                }
                            }
                            //确定环比的y轴
                            for(var i=0;i<huanData.length;i++){
                                var dataSplit = huanData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataJoin == allDataX[j]){
                                        huanDataY.push(huanData[i].data);
                                        huanTotalData += huanData[i].data;
                                    }
                                }
                            }
                        }else{
                            if(_ajaxDateType == '周'){
                                $('.right-top').eq(1).css({'opacity':0});
                            }else{
                                $('.right-top').eq(1).css({'opacity':1});
                            }
                            //确定本期的x轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[0];
                                if(allDataX.indexOf(dataSplit)<0){
                                    allDataX.push(dataSplit);
                                }
                            }
                            //确定本期的y轴数据
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[0];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataSplit == allDataX[j]){
                                        allDataY.push(allData[i].data);
                                        totalAllData += allData[i].data;
                                    }
                                }
                            }
                            //确定环比y轴数据
                            for(var i=0;i<huanData.length;i++){
                                huanDataY.push(huanData[i].data);
                                huanTotalData += huanData[i].data;
                            }
                        };
						//给echarts赋值
						//环比柱状图
						optionBar.xAxis[0].data = allDataX;
						optionBar.series[0].data = allDataY;
						optionBar.series[1].data = huanDataY;
						myChartTopLeft.setOption(optionBar);
						//电-环比分析-柱状图
						optionLineBar.series[0].data[0] = totalAllData;
						optionLineBar.series[0].data[1] = huanTotalData;
						optionLineBar.series[1].data[0] = totalAllData;
						optionLineBar.series[1].data[1] = huanTotalData;
						myChartTopRight.setOption(optionLineBar);
                        //计算总和
                        //总电div
                        var aa = parseFloat(totalAllData.toFixed(2));
                        var bb = parseInt(huanTotalData.toFixed(2));
                        $('.right-top').eq(0).find(".content-left-top-tips span:eq(0)").html(aa);
                        $('.huanbizhi').html(bb);
                        if(aa>bb){
                            $('.content-left-top-arrow').eq(0).css({
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                background: 'url(../resource/img/prompt-arrow1.png)no-repeat -3px -5px',
                                'background-size': '90%',
                                'margin-right': '-30px',
                            })
                        }else{
                            $('.content-left-top-arrow').eq(0).css({
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                background: 'url(../resource/img/prompt-arrow2.png)no-repeat -3px -5px',
                                'background-size': '90%',
                                'margin-right': '-30px',
                            })
                        }

                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                            huanData = [];
                            myChartTopLeft.hideLoading();
                            myChartTopRight.hideLoading();
                        }
                    }
                });
                //发送同比请求
                $.ajax({
                    type:'post',
                    url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndPointer',
                    data:tongParams,
                    success:function(result){
                        totalAllData = 0;
                        tongTotalData = 0;
                        allDataX.length = 0;
                        allDataY.length = 0;
                        tongDataY.length = 0;
                        tongData.length = 0;
                        for(var i=0;i<result.length;i++){
                            tongData.push(result[i]);
                        }
                        if( _ajaxDateType == '日' ){
                            $('.right-top').eq(1).css({'opacity':1});
                            $('.right-top').eq(0).css({'opacity':1});
                            //确定x轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                if(allDataX.indexOf(dataJoin)<0){
                                    allDataX.push(dataJoin);
                                }
                            }
                            //确定本期y轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataJoin == allDataX[j]){
                                        allDataY.push(allData[i].data);
                                        totalAllData += allData[i].data;
                                    }
                                }
                            };
                            //确定环比的y轴
                            for(var i=0;i<tongData.length;i++){
                                var dataSplit = tongData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataJoin == allDataX[j]){
                                        tongDataY.push(tongData[i].data);
                                        tongTotalData += tongData[i].data;
                                    }
                                }
                            };
                        }else{
                            if(_ajaxDateType == '周'){
                                $('.right-top').eq(1).css({'opacity':0});
                            }else{
                                $('.right-top').eq(1).css({'opacity':1});
                            }
                            //确定本期的x轴
                            //确定本期的x轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[0];
                                if(allDataX.indexOf(dataSplit)<0){
                                    allDataX.push(dataSplit);
                                }
                            }
                            //确定本期的y轴数据
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[0];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataSplit == allDataX[j]){
                                        allDataY.push(allData[i].data);
                                        totalAllData += allData[i].data;
                                    }
                                }
                            }
                            //确定环比y轴数据
                            for(var i=0;i<tongData.length;i++){
                                tongDataY.push(tongData[i].data);
                                tongTotalData += tongData[i].data;
                            }
                        };
                        //给echarts赋值
                        //环比柱状图
                        optionBar.xAxis[0].data = allDataX;
                        optionBar.series[0].data = allDataY;
                        optionBar.series[1].data = tongDataY;
                        myChartBottomLeft.setOption(optionBar);
                        //电-环比分析-柱状图
                        optionLineBar.series[0].data[0] = totalAllData;
                        optionLineBar.series[0].data[1] = tongTotalData;
                        optionLineBar.series[1].data[0] = totalAllData;
                        optionLineBar.series[1].data[1] = tongTotalData;
                        myChartBottomRight.setOption(optionLineBar);
                        //总电div
                        var aa = parseFloat(totalAllData.toFixed(2));
                        var bb = parseFloat(tongTotalData.toFixed(2));
                        $('.right-top').eq(1).find(".content-left-top-tips span:eq(0)").html(aa);
                        $('.tongbizhi').eq(0).html(bb);
                        if(aa>bb){
                            $('.content-left-top-arrow').eq(1).css({
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                background: 'url(../resource/img/prompt-arrow1.png)no-repeat -3px -5px',
                                'background-size': '90%',
                                'margin-right': '-30px',
                            })
                        }else{
                            $('.content-left-top-arrow').eq(1).css({
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                background: 'url(../resource/img/prompt-arrow2.png)no-repeat -3px -5px',
                                'background-size': '90%',
                                'margin-right': '-30px',
                            })
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                            tongData = [];
                        }
                    }
                })
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    allData = [];
                    myChartTopLeft.hideLoading();
                    myChartTopRight.hideLoading();
                }
            }
        })
    }

    //科室位置
    function getOfficeData(){
        //确定选中的科室id
        //定义存放返回数据的数组（本期 X Y）
        var allData = [];
        var allDataX = [];
        var allDataY = [];
        var totalAllData = 0;
        //(环比)
        var huanData = [];
        var huanDataY = [];
        var huanTotalData = 0;
        //(同比)
        var tongData = [];
        var tongDataY = [];
        var tongTotalData = 0;
        //确定楼宇id
        var ofs = _officeZtree.getSelectedOffices(),officeID;

        for(var i=0;i<ofs.length;i++){
            officeID = ofs[i].f_OfficeID;
            officeNames = ofs[i].f_OfficeName;
        }
        if(!ofs) { return; }
        //存放要传的楼宇集合
        var postOfficeID = [];

        $(ofs).each(function(i,o){

            postOfficeID.push(o.officeID)
        });

        //定义获得本期数据的参数
        var ecParams = {
            'ecTypeId':_ajaxEcTypeWord,
            'officeId':officeID,
            'startTime':_nowTimeStart,
            'endTime':_nowTimeEnd,
            'dateType':_ajaxType
        }

        //环比(前一天，前一周，前一个月，前一年)
        var huanParams = {
            'ecTypeId':_ajaxEcTypeWord,
            'officeId':officeID,
            'startTime':_huanTimeStart,
            'endTime':_huanTimeEnd,
            'dateType':_ajaxType
        }

        //同比(去年的同一时期，没有周，环比和同比的年一样)
        var tongParams = {
            'ecTypeId':_ajaxEcTypeWord,
            'officeId':officeID,
            'startTime':_tongTimeStart,
            'endTime':_tongTimeEnd,
            'dateType':_ajaxType
        }

        //发送本期请求
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
            data:ecParams,
            beforeSend:function(){
                //myChartTopLeft.showLoading({
                //    text:'获取数据中',
                //    effect:'whirling'
                //});
                //myChartTopRight.showLoading({
                //    text:'获取数据中',
                //    effect:'whirling'
                //});
            },
            success:function(result){
                //myChartTopLeft.hideLoading();
                //myChartTopRight.hideLoading();
                allData.length = 0;
                for(var i=0;i<result.length;i++){
                    allData.push(result[i]);
                }
                //发送环比请求
                $.ajax({
                    type:'post',
                    url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
                    data:huanParams,
                    beforeSend:function(){
                        //myChartTopLeft.showLoading({
                        //    text:'获取数据中',
                        //    effect:'whirling'
                        //});
                        //myChartTopRight.showLoading({
                        //    text:'获取数据中',
                        //    effect:'whirling'
                        //});
                    },
                    success:function(result){
                        //myChartTopLeft.hideLoading();
                        //myChartTopRight.hideLoading();
                        totalAllData = 0;
                        huanTotalData = 0;
                        allDataX.length = 0;
                        allDataY.length = 0;
                        huanData.length = 0;
                        huanDataY.length = 0;
                        for(var i=0;i<result.length;i++){
                            huanData.push(result[i]);
                        }
                        //绘制echarts
                        if( _ajaxDateType == '日' ){
                            $('.right-top').eq(1).css({'opacity':1});
                            $('.right-top').eq(0).css({'opacity':1});
                            //确定x轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                if(allDataX.indexOf(dataJoin)<0){
                                    allDataX.push(dataJoin);
                                }
                            }
                            //确定本期y轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataJoin == allDataX[j]){
                                        allDataY.push(allData[i].data);
                                        totalAllData += allData[i].data;
                                    }
                                }
                            }
                            //确定环比的y轴
                            for(var i=0;i<huanData.length;i++){
                                var dataSplit = huanData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataJoin == allDataX[j]){
                                        huanDataY.push(huanData[i].data);
                                        huanTotalData += huanData[i].data;
                                    }
                                }
                            }
                        }else{
                            if(_ajaxDateType == '周'){
                                $('.right-top').eq(1).css({'opacity':0});
                            }else{
                                $('.right-top').eq(1).css({'opacity':1});
                            }
                            //确定本期的x轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[0];
                                if(allDataX.indexOf(dataSplit)<0){
                                    allDataX.push(dataSplit);
                                }
                            }
                            //确定本期的y轴数据
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[0];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataSplit == allDataX[j]){
                                        allDataY.push(allData[i].data);
                                        totalAllData += allData[i].data;
                                    }
                                }
                            }
                            //确定环比y轴数据
                            for(var i=0;i<huanData.length;i++){
                                huanDataY.push(huanData[i].data);
                                huanTotalData += huanData[i].data;
                            }
                        };
                        //给echarts赋值
                        //环比柱状图
                        optionBar.xAxis[0].data = allDataX;
                        optionBar.series[0].data = allDataY;
                        optionBar.series[1].data = huanDataY;
                        myChartTopLeft.setOption(optionBar);
                        //电-环比分析-柱状图
                        optionLineBar.series[0].data[0] = totalAllData;
                        optionLineBar.series[0].data[1] = huanTotalData;
                        optionLineBar.series[1].data[0] = totalAllData;
                        optionLineBar.series[1].data[1] = huanTotalData;
                        myChartTopRight.setOption(optionLineBar);
                        //计算总和
                        //总电div
                        var aa = parseFloat(totalAllData.toFixed(2));
                        var bb = parseInt(huanTotalData.toFixed(2));
                        $('.right-top').eq(0).find(".content-left-top-tips span:eq(0)").html(aa);
                        $('.huanbizhi').html(bb);
                        if(aa>bb){
                            $('.content-left-top-arrow').eq(0).css({
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                background: 'url(../resource/img/prompt-arrow1.png)no-repeat -3px -5px',
                                'background-size': '90%',
                                'margin-right': '-30px',
                            })
                        }else{
                            $('.content-left-top-arrow').eq(0).css({
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                background: 'url(../resource/img/prompt-arrow2.png)no-repeat -3px -5px',
                                'background-size': '90%',
                                'margin-right': '-30px',
                            })
                        }

                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                            huanData = [];
                            myChartTopLeft.hideLoading();
                            myChartTopRight.hideLoading();
                        }
                    }
                });
                //发送同比请求
                $.ajax({
                    type:'post',
                    url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
                    data:tongParams,
                    success:function(result){
                        totalAllData = 0;
                        tongTotalData = 0;
                        allDataX.length = 0;
                        allDataY.length = 0;
                        tongDataY.length = 0;
                        tongData.length = 0;
                        for(var i=0;i<result.length;i++){
                            tongData.push(result[i]);
                        }
                        if( _ajaxDateType == '日' ){
                            $('.right-top').eq(1).css({'opacity':1});
                            $('.right-top').eq(0).css({'opacity':1});
                            //确定x轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                if(allDataX.indexOf(dataJoin)<0){
                                    allDataX.push(dataJoin);
                                }
                            }
                            //确定本期y轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataJoin == allDataX[j]){
                                        allDataY.push(allData[i].data);
                                        totalAllData += allData[i].data;
                                    }
                                }
                            };
                            //确定环比的y轴
                            for(var i=0;i<tongData.length;i++){
                                var dataSplit = tongData[i].dataDate.split('T')[1].split(':');
                                var dataJoin = dataSplit[0] + ':' + dataSplit[1];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataJoin == allDataX[j]){
                                        tongDataY.push(tongData[i].data);
                                        tongTotalData += tongData[i].data;
                                    }
                                }
                            };
                        }else{
                            if(_ajaxDateType == '周'){
                                $('.right-top').eq(1).css({'opacity':0});
                            }else{
                                $('.right-top').eq(1).css({'opacity':1});
                            }
                            //确定本期的x轴
                            //确定本期的x轴
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[0];
                                if(allDataX.indexOf(dataSplit)<0){
                                    allDataX.push(dataSplit);
                                }
                            }
                            //确定本期的y轴数据
                            for(var i=0;i<allData.length;i++){
                                var dataSplit = allData[i].dataDate.split('T')[0];
                                for(var j=0;j<allDataX.length;j++){
                                    if(dataSplit == allDataX[j]){
                                        allDataY.push(allData[i].data);
                                        totalAllData += allData[i].data;
                                    }
                                }
                            }
                            //确定环比y轴数据
                            for(var i=0;i<tongData.length;i++){
                                tongDataY.push(tongData[i].data);
                                tongTotalData += tongData[i].data;
                            }
                        };
                        //给echarts赋值
                        //环比柱状图
                        optionBar.xAxis[0].data = allDataX;
                        optionBar.series[0].data = allDataY;
                        optionBar.series[1].data = tongDataY;
                        myChartBottomLeft.setOption(optionBar);
                        //电-环比分析-柱状图
                        optionLineBar.series[0].data[0] = totalAllData;
                        optionLineBar.series[0].data[1] = tongTotalData;
                        optionLineBar.series[1].data[0] = totalAllData;
                        optionLineBar.series[1].data[1] = tongTotalData;
                        myChartBottomRight.setOption(optionLineBar);
                        //总电div
                        var aa = parseFloat(totalAllData.toFixed(2));
                        var bb = parseFloat(tongTotalData.toFixed(2));
                        $('.right-top').eq(1).find(".content-left-top-tips span:eq(0)").html(aa);
                        $('.tongbizhi').eq(0).html(bb);
                        if(aa>bb){
                            $('.content-left-top-arrow').eq(1).css({
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                background: 'url(../resource/img/prompt-arrow1.png)no-repeat -3px -5px',
                                'background-size': '90%',
                                'margin-right': '-30px',
                            })
                        }else{
                            $('.content-left-top-arrow').eq(1).css({
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                background: 'url(../resource/img/prompt-arrow2.png)no-repeat -3px -5px',
                                'background-size': '90%',
                                'margin-right': '-30px',
                            })
                        }
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                            tongData = [];
                        }
                    }
                })
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    allData = [];
                    myChartTopLeft.hideLoading();
                    myChartTopRight.hideLoading();
                }
            }
        })
    }

})
