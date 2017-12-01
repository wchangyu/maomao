$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //设备类型
    deviceType();

    //设备区域
    deviceArea();

    //设备系统
    deviceSystem();

    //设备部门
    deviceDep();

    //获取的所有数据
    var _allData = [];

    //存放所有设备的数组
    var _allDevice = [];

    //记录设备编码
    var _shebeiBM = '';

    //记录设备名称
    var _shebeiMC = '';

    //日历图年份的数组
    var _yearArr = [];

    //每个日历插件的位置
    var _distance = 20;

    //每个日历插件的index
    var _calendarIndex = 0;

    //echart每个日历数据
    var _calendarArr = [];

    //echarts当前点击对象信息
    var _thisInfo = {};

    //存放所有获得数据；
    var _blocks = [];

    //存放工单的数据
    var _gdData = [];

    //echarts图的个数，来重绘div的高度
    var _heights = 250;

    //存放所有维保组的数组
    var _InfluencingArr = [];

    //存放所有维修班组的数组
    var _bzArr = [];

    //选择设备
    $('#select-button').click(function(){

        _moTaiKuang($('#choiceDiv'), '选择设备', '', '' ,'', '选择');

    })

    //选择设备点击事件
    $('#browse-datatables tbody').on('click','tr',function(){
        //样式
        var $this = $(this)

        $('#browse-datatables tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        _shebeiMC = $.trim($this.find('.dNum').next().html());

        _shebeiBM = $.trim($this.find('.dNum').html());
    })

    //选择按钮确定事件
    $('#choiceDiv').find('.btn-primary').click(function(){

        $('#choiceDiv').modal('hide');

        $('#sbmc').val(_shebeiMC);

        $('#ggxh').val(_shebeiBM);

    })

    //查询
    $('#select-condi').click(function(){

        conditionSelect();

    })

    //$('#sbmc').val('H3C接入交换机');
    //
    //$('#ggxh').val('DE17100900016557');

    //巡检的vue对象
    var inspectionVue = new Vue({

        el:'#workDone',
        data:{
            //是否启用
            sfqy:'',
            //任务单号
            rwdh:'',
            //任务名称
            rwmc:'',
            //计划名称
            jhmc:'',
            //计划编号
            jhbm:'',
            //设备名称
            sbmc:'',
            //设备编码
            sbbm:'',
            //责任单位部门
            zrdwbm:'',
            //负责人
            fzr:'',
            //执行人
            zxr:''

        }

    });

    //当前巡检的id
    var _inspectionID = '';

    //保养的vue对象
    var maintainVue = new Vue({

        el:'#workDone1',
        data:{
            //是否启用
            sfqy:'',
            //任务单号
            rwdh:'',
            //任务名称
            rwmc:'',
            //计划名称
            jhmc:'',
            //计划编号
            jhbm:'',
            //设备名称
            sbmc:'',
            //设备编码
            sbbm:'',
            //责任单位部门
            zrdwbm:'',
            //负责人
            fzr:'',
            //执行人
            zxr:''

        }

    });

    //当前保养id
    var _maintainID = '';

    //设备vue
    var deviceVue = new Vue({

        el:'#myApp33',
        data:{
            //设备编码
            sbbm:'',
            //设备名称
            mingcheng:'',
            //拼音简码
            pinyin:'',
            //出厂编号
            bianhao:'',
            //车务段
            ssQY:'',
            //设备系统
            ssXT:'',
            //车站
            ssbumen:'',
            //设备类别
            zcLX:'',
            //产地
            chandi:'',
            //状态
            zhuangtai:'',
            //安装位置
            weizhi:'',
            //品牌
            pingpai:'',
            //规格型号
            guige:'',
            //供应商
            gongyingshang:'',
            //生产商
            shengchanshang:'',
            //使用年限
            nianxian:'',
            //保修期
            baoxiu:'',
        }

    });

    //二维码地址
    var _erweimaPath = 'http://ip/ApService/showQR.aspx';

    var stationsFlag = false;

    var wxBanzusFlag = false;

    /*---------------------------------------表格初始化------------------------------------*/
    var selectDevCol = [
        {
            title:'设备编号',
            data:'dNum',
            className:'dNum'
        },
        {
            title:'设备名称',
            data:'dName',
        },
        {
            title:'规格型号',
            data:'spec',
        },
        {
            title:'安装地点',
            data:'installAddress',
        },
        {
            title:'设备类型',
            data:'dcName'
        }
    ];

    _tableInit($('#browse-datatables'),selectDevCol,2,'','','');

    //巡检表格（步骤项目）
    var inspectionCol=[
        {
            title:'设备类型',
            data:'dcName'
        },
        {
            title:'步骤编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'步骤名称',
            data:'ditName'
        },
        {
            title:'步骤参考值',
            data:'stValue'
        },
        {
            title:'报警关系',
            data:'relation'
        }
    ];

    _tableInit($('#personTable1'),inspectionCol,2,'','','');

    //巡检表格（执行人）
    var inspectionPerson = [
        {
            title:'执行人员',
            data:'dipRen'
        },
        {
            title:'工号',
            data:'dipRenNum'
        },
        {
            title:'联系电话',
            data:'dipDh'
        }
    ];
    //添加执行人员表格
    _tableInit($('#personTable2'),inspectionPerson,2,'','','');

    //保养表格（步骤项目）
    var maintainCol = [
        {
            title:'设备类型',
            data:'dcName'
        },
        {
            title:'步骤编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'步骤名称',
            data:'ditName'
        },
        {
            title:'工作内容',
            data:'desc'
        },
        {
            title:'保养方式',
            data:'mtContent'
        }
    ];

    _tableInit($('#personTable11'),maintainCol,2,'','','');

    //添加执行人表格
    var maintainPerson = [
        {
            title:'执行人员',
            data:'dipRen',
            className:'dipRen'
        },
        {
            title:'工号',
            data:'dipRenNum',
            className:'dipRenNum'
        },
        {
            title:'联系电话',
            data:'dipDh',
            className:'dipDh'
        }
    ];

    _tableInit($('#personTable22'),maintainPerson,2,'','','');

    //总表格
    var tableCol = [

        {
            title:'操作内容',
            data:'eName',
        },
        {
            title:'编码',
            data:'eNum'
        },
        {
            title:'操作日期',
            data:'eDate'
        },
        {
            title:'操作',
            data:'eType',
            "render":function(data, type, full, meta){
                if(data == ''){

                    return ''

                }else if(data == 'gdInfos'){

                    for(var i=0;i<_gdData.length;i++){

                       if(full.eNum == _gdData[i].gdCode){

                           return "<span class='data-option option-see1 btn default btn-xs green-stripe'><a href='../gongdangunali/productionOrder_see.html?gdCode=" + full.eNum +
                               "&gdCircle=" + _gdData[i].gdCircle +
                               "' target='_blank' style='color:#3333333;'>查看</a></span>"

                       }

                    }

                }else if(data == 'diInfos'){

                    return "<span class='inspectionButton data-option option-see1 btn default btn-xs green-stripe'>查看</span>"

                }else  if(data == 'dmInfos'){

                    return "<span class='maintainButton data-option option-see1 btn default btn-xs green-stripe'>查看</span>"
                }
            }
        }

    ];

    _tableInit($('#scrap-datatables'),tableCol,1,'','','');

    //获取设备方法
    //InfluencingUnit(true);

    //条件查询
    conditionSelect();

    /*----------------------------------------echart图------------------------------------*/
    //给echarts的点击事件赋值
    var isFlag = '';

    //点击事件是否有效
    var isAlert = false;

    var myChart = echarts.init(document.getElementById('calender'));

    var option = {

        tooltip: {
            position: 'top',
            showContent:true,
            formatter:function(params){

                isAlert = true;

                //说明是真的，点击事件有效
                if(isFlag != 'false'){

                    _thisInfo = params;

                    isFlag = 'false';

                }

                //因为echarts不支持同一时多个对象，所以要通过时间再次比较

                var html = '';

                var type = '';

                //保存一个时间对应的多个事件的数组；
                var eventArr = [];

                var time = params.data[0].split(' ')[0];

                for(var i=0;i<_blocks.length;i++){

                    if(_blocks[i].eDate.indexOf(time)>=0){

                        eventArr.push(_blocks[i]);

                    }


                }

                for(var i=0;i<eventArr.length;i++){

                    if(eventArr[i].eType == 'gdInfos'){

                        type = '工单号'

                    }else if( eventArr[i].eType == 'diInfos' ){

                        type = '巡检编号'

                    }else if(eventArr[i].eType == 'dmInfos'){

                        type = '保养编号'

                    }else{

                        type = '设备编号'

                    }

                    html += eventArr[i].eName + ':' + eventArr[i].eDate +'<br>'

                        + type + ':' + eventArr[i].eNum + '<br>'

                }


                return html;


            }

        },
        visualMap: {
            min: 0,
            max: 1000,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: 'top',
            show:false
        },
        calendar: [],

        series: []

    };

    //myChart.setOption(option);

    $('#calender').click(function(){

        isFlag = 'true';

        if(!isAlert){

            return false

        }else{

            _moTaiKuang($('#historyDiv'), '当前设备信息', true, '' ,'', '');

            //保存一个时间对应的多个事件的数组；
            var eventArr = [];

            var time = _thisInfo.data[0].split(' ')[0];

            for(var i=0;i<_blocks.length;i++){

                if(_blocks[i].eDate.indexOf(time)>=0){

                    eventArr.push(_blocks[i]);

                }


            }

            var html = '';

            for(var i=0;i<eventArr.length;i++){

                var gdCircle = 0;

                if(eventArr[i].eType == 'gdInfos'){

                    for(var j=0;j<_gdData.length;j++){

                        if( eventArr[i].eNum == _gdData[j].gdCode){

                            gdCircle = _gdData[j].gdCircle;

                        }

                    }

                    html += '<li>' + eventArr[i].eName + ':' + eventArr[i].eDate +'</li>'
                        + '<li>工单号' + ':' +  '<a href="../gongdangunali/productionOrder_see.html?gdCode=' + eventArr[i].eNum + '&gdCircle=' + gdCircle +
                        ''+
                        '" target="_blank">' + eventArr[i].eNum +
                        '</a>' + '</li>'

                }else if(eventArr[i].eType == 'diInfos'){

                    html += '<li>' + eventArr[i].eName + ':' + eventArr[i].eDate +'</li>'

                        + '<li id="inspection">巡检编号' + ':' + '<span style="cursor: pointer">' + eventArr[i].eNum + '</span>' + '</li>'

                }else if(eventArr[i].eType == 'dmInfos'){

                    html += '<li>' + eventArr[i].eName + ':' + eventArr[i].eDate +'</li>'

                        + '<li id="maintain">保养编号' + ':' + '<span style="cursor: pointer">' + eventArr[i].eNum + '</span>' + '</li>'

                }else{

                    html += '<li>' + eventArr[i].eName + ':' + '<span>' + eventArr[i].eDate + '</span>' +'</li>'

                        + '<li>设备编码' + ':' + '<span>' + eventArr[i].eNum + '</span>' + '</li>'

                }



                $('#historyDiv').find('.modal-body').children().empty().append(html);


            }


        }

    })

    //其他地方点击屏蔽模态框
    $('#calender').on('mousemove','canvas',function(e){

        isAlert = false;

    })

    //巡检时候，点击巡检单号，弹出详情
    //首先根据巡检任务单号，确定信息，再根据dipNum来确定步骤项目
    $('#historyDiv').on('click','#inspection',function(){

        //初始化
        inspectionInit();

        //模态框
        _moTaiKuang($('#inspectionDetail'), '巡检详情', true, '' ,'', '');

        //发送请求，获得巡检任务详情
        _inspectionID = $(this).children('span').html();

        inspectionContent();

    })

    //保养
    $('#historyDiv').on('click','#maintain',function(){

        //初始化
        maintainInit();

        //模态框
        _moTaiKuang($('#maintainDetail'), '保养详情', true, '' ,'', '');

        //发送请求，获得巡检任务详情
        _maintainID = $(this).children('span').html();

        maintainContent();

    })

    var color = ['rgb(228,174,135)','rgb(211,118,107)','rgb(196,80,84)'];

    $('.echartChecked').on('click','.colortip',function(){

        if($(this).hasClass('check-img')){

            $(this).removeClass('check-img').css('background',color[$(this).index('.colortip')]);

        }else{

            $(this).addClass('check-img');

        }

    })

    //查询，确定选中的色块，选中的才显示。
    $('#select').click(function(){

        //初始化echarts图
        option.calendar = [];

        option.series = [];

        myChart.setOption(option);

        var arr = [];

        //确定选择的是哪些色块
        for(var i=0;i<$('.echartChecked').find('.colortip').length;i++){

            if( !$('.echartChecked').find('.colortip').eq(i).hasClass('check-img') ){

                arr.push($('.echartChecked').find('.colortip').eq(i).attr('id'));

            }

        }

        var checkedArr = [];

        for(var i=0;i<_allData.length;i++){

            for(var j=0;j<_allData[i].lcEvents.length;j++){

                if( arr.indexOf('repair-color')>=0 ){

                    if(_allData[i].lcEvents[j].eType == 'gdInfos'){

                        checkedArr.push(_allData[i].lcEvents[j]);


                    }

                }
                if( arr.indexOf('Inspection-color')>=0 ){

                    if(_allData[i].lcEvents[j].eType == 'diInfos'){

                        checkedArr.push(_allData[i].lcEvents[j]);


                    }

                }
                if( arr.indexOf('maintain-color')>=0 ){

                    if(_allData[i].lcEvents[j].eType == 'dmInfos'){

                        checkedArr.push(_allData[i].lcEvents[j]);


                    }

                }

            }


        }

        //重绘echarts图
        //确定时间(年份)，
        var yearArr = [];

        var yearUnqueArr = [];

        var dayArr = [];

        var dayUnqueArr = [];

        for(var i=0;i<checkedArr.length;i++){

            dayArr.push(checkedArr[i].eDate);

            yearArr.push(checkedArr[i].eDate.split(' ')[0].split('-')[0]);

        }

        //确定年份（去重之后）
        for(var i=0;i<yearArr.length;i++){

            if(yearUnqueArr.indexOf(yearArr[i])<0){

                yearUnqueArr.push(yearArr[i])

            }

        }

        //确定日期(去重之后)
        for(var i=0;i<dayArr.length;i++){

            if(dayUnqueArr.indexOf(dayArr[i])<0){

                dayUnqueArr.push(dayArr[i]);

            }

        }

        //重绘echarts图
        var height = _heights * yearUnqueArr.length;

        _yearArr.length = 0 ;

        $('#calender').height(height);

        //确定年份
        for(var i=0;i<yearUnqueArr.length;i++){

            var obj = {};

            obj.range = yearUnqueArr[i];

            obj.dayLabel = {};

            obj.dayLabel.nameMap = 'cn';

            obj.dayLabel.firstDay = 1;

            obj.monthLabel = {};

            obj.monthLabel.nameMap = 'cn';

            var top = _distance + i*260;

            obj.top = top;

            obj.cellSize = [];

            obj.cellSize[0] = 'auto';

            obj.cellSize[1] = 20;

            _yearArr.push(obj);


        }

        option.calendar = _yearArr;

        //确定日期时间
        _calendarArr.length = 0;

        for(var i=0;i<yearUnqueArr.length;i++){

            var obj = {};

            obj.type = 'heatmap';

            obj.coordinateSystem = 'calendar';

            obj.calendarIndex = _calendarIndex + i*1;

            obj.data = [];

            _calendarArr.push(obj);

        }

        option.series = _calendarArr;

        //显示色块
        for(var i=0;i<yearUnqueArr.length;i++){

            for(var j=0;j<checkedArr.length;j++){

                if(checkedArr[j].eDate.indexOf(yearUnqueArr[i])>=0){

                    var arr = [];

                    var values = 0;

                    arr[0] = checkedArr[j].eDate;

                    if(checkedArr[j].eType == 'gdInfos'){

                        values = 300;

                    }else if( checkedArr[j].eType == 'diInfos' ){

                        values = 600;

                    }else if( checkedArr[j].eType == 'dmInfos' ){

                        values = 900;

                    }

                    arr[1] = values;

                    option.series[i].data.push(arr);


                }

            }


        }

        myChart.setOption(option);

    })

    //重置
    $('#reset').click(function(){

        //去掉类
        $('.echartChecked').children('.colortip').removeClass('check-img');

        //颜色恢复
        for(var i=0;i<$('.echartChecked').children('.colortip').length;i++){

            $('.echartChecked').children('.colortip').eq(i).css('background',color[i]);

        }

        //数据所有
        conditionSelect();

    })




    /*-------------------------------------按钮事件-----------------------------------*/

    //tab选项卡
    $('.table-title span').click(function(){

        var $this = $(this);

        $this.parent('.table-title').children('span').removeClass('spanhover');

        $this.addClass('spanhover');

        var tabDiv = $(this).parents('.table-title').next().children('div');

        tabDiv.addClass('hide-block');

        tabDiv.eq($(this).index()).removeClass('hide-block');

    });

    //表格中的操作
    //巡检查看
    $('#scrap-datatables tbody').on('click','.inspectionButton',function(){

        //初始化
        inspectionInit();

        //模态框
        _moTaiKuang($('#inspectionDetail'), '巡检详情', true, '' ,'', '');

        //发送请求，获得巡检任务详情
        _inspectionID = $(this).parents('tr').children().eq(1).html();

        inspectionContent();

    })

    //保养查看
    $('#scrap-datatables tbody').on('click','.maintainButton',function(){

        //初始化
        maintainInit();

        //模态框
        _moTaiKuang($('#maintainDetail'), '保养详情', true, '' ,'', '');

        //发送请求，获得巡检任务详情
        _maintainID = $(this).children('span').html();

        maintainContent()

    })

    //查看设备详情
    $('#select-detail').click(function(){

        _moTaiKuang($('#divDetail'),'设备详情','flag','','','');

        //初始化
        deviceInit()

        //发送请求赋值
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:{
                dName:$('#sbmc').val(),
                dNum:$('#ggxh').val(),
                userID:_userIdNum,
                userName:_userIdName
            },
            timeout:_theTimes,
            success:function(result){
                console.log(result)
                //赋值
                //设备编码
                deviceVue.sbbm = result[0].dNum;
                //设备名称
                deviceVue.mingcheng = result[0].dName;
                //拼音简码
                deviceVue.pinyin = result[0].dPy;
                //出厂编号
                deviceVue.bianhao = result[0].factoryNum;
                //车务段
                deviceVue.ssQY = result[0].daName;
                //设备系统
                deviceVue.ssXT = result[0].dsName;
                //车站
                deviceVue.ssbumen = result[0].ddName;
                //设备类别
                deviceVue.zcLX = result[0].dcName;
                //产地
                deviceVue.chandi = result[0].devOrigin;
                //状态
                deviceVue.zhuangtai = result[0].status;
                //安装位置
                deviceVue.weizhi = result[0].installAddress;
                //品牌
                deviceVue.pingpai = result[0].brand;
                //规格型号
                deviceVue.guige = result[0].spec;
                //供应商
                deviceVue.gongyingshang = result[0].supName;
                //生产商
                deviceVue.shengchanshang = result[0].prodName;
                //使用年限
                deviceVue.nianxian = result[0].life;
                //保修期
                deviceVue.baoxiu = result[0].maintain;
                //购置日期
                $('#gouzhi').val(result[0].purDate);
                //安装日期
                $('#anzhuang').val(result[0].installDate);
                //设备原值
                $('#yuanzhi').val(result[0].devMoney);
                //描述
                $('#miaoshu').val(result[0].description);
                //技术资料
                $('.lujing').html(result[0].docPath)

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }

        })

    })

    //查看二维码
    //查看二维码
    $('.viewImage').click(function(){
        if( $('.QRcode').children().length == 0 ){
            $('.QRcode').empty();
            $('.QRcode').show();
            var str = '<img src="' + replaceIP(_erweimaPath,_urls) + '?asc=' + $('#ggxh').val() +
                '"' + 'style="width:100px;height:100px;"' +
                '>';
            $('.QRcode').append(str);
        }else{
            $('.QRcode').empty();
            $('.QRcode').hide();
        }

    });

    //设备条件查询
    $('#selected1').click(function(){

        choiceDevice(true,stationsFlag,wxBanzusFlag);

    });

    /*----------------------------------------其他方法-------------------------------------*/
    //设备类型
    function deviceType(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            dcName:'',
            dcNum:''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDCs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].dcNum +
                        '">'+result[i].dcName + '</option>'
                }

                $('#leixing').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //设备区域
    function deviceArea(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            daName:'',
            daNum:''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDAs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].daNum +
                        '">'+result[i].daName + '</option>'
                }

                $('#quyu').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //设备系统
    function deviceSystem(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            dsName:'',
            dsNum:''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDSs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].dsNum +
                        '">'+result[i].dsName + '</option>'
                }

                $('#xitong').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //设备部门
    function deviceDep(){

        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            ddName:'',
            ddNum:''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDDs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].ddNum +
                        '">'+result[i].ddName + '</option>'
                }

                $('#bumen').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        })

    }

    //设备条件查询
    //获取设备
    function choiceDevice(flag,station,bz){

        var prm = {
            'dName':$('#myModal3').find('.sbmc').val(),
            'dNum':$('#myModal3').find('.sbbm').val(),
            'spec':$('#myModal3').find('.ggxh').val(),
            'status':1,
            'daNum':$('#myModal3').find('#quyu').val(),
            'ddNum':$('#myModal3').find('#bumen').val(),
            'dsNum':$('#myModal3').find('#xitong').val(),
            'dcNum':$('#myModal3').find('#leixing').val(),
            'userID':_userIdNum,
            'userName':_userIdName
        };

        var arr = [];

        //如果在维修班组中，则传wxKeshi，如果是在所属维保组中，则传wxKeshis=[]
        if(bz){

            arr.length = 0;

            arr.push(sessionStorage.userDepartNum);

        }

        if(station){

            for(var i=0;i<_InfluencingArr.length;i++){

                if(_InfluencingArr[i].departNum == sessionStorage.userDepartNum){

                    for(var j=0;j<_InfluencingArr[i].wxBanzus.length;j++){

                        arr.push(_InfluencingArr[i].wxBanzus[j]);

                    }

                }

            }



        }

        prm.departNums = arr;

        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevsII',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            success:function(result){

                if(flag){

                    _allDevice.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allDevice.push(result[i]);

                    }

                }

                _datasTable($('#browse-datatables'),result);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }
        });

    }

    //巡检初始化
    function inspectionInit(){

        //是否启用
        inspectionVue.sfqy = '';
        //任务单号
        inspectionVue.rwdh = '';
        //任务名称
        inspectionVue.rwmc = '';
        //计划名称
        inspectionVue.jhmc = '';
        //计划编号
        inspectionVue.jhbm = '';
        //设备名称
        inspectionVue.sbmc = '';
        //设备编码
        inspectionVue.sbbm = '';
        //责任单位部门
        inspectionVue.zrdwbm = '';
        //负责人
        inspectionVue.fzr = '';
        //执行人
        inspectionVue.zxr = '';
        //时间初始化
        $('#inspectionDetail').find('.datatimeblock').val('');
        //备注
        $('#inspectionDetail').find('textarea').val('');
        //表格初始化
        var arr = [];
        _datasTable($('#personTable1'),arr);

        _datasTable($('#personTable2'),arr);

    }

    //保养初始化
    function maintainInit(){

        //是否启用
        maintainVue.sfqy = '';
        //任务单号
        maintainVue.rwdh = '';
        //任务名称
        maintainVue.rwmc = '';
        //计划名称
        maintainVue.jhmc = '';
        //计划编号
        maintainVue.jhbm = '';
        //设备名称
        maintainVue.sbmc = '';
        //设备编码
        maintainVue.sbbm = '';
        //责任单位部门
        maintainVue.zrdwbm = '';
        //负责人
        maintainVue.fzr = '';
        //执行人
        maintainVue.zxr = '';
        //时间初始化
        $('#maintainDetail').find('.datatimeblock').val('');
        //备注
        $('#maintainDetail').find('textarea').val('');
        //表格初始化
        var arr = [];
        _datasTable($('#personTable11'),arr);

        _datasTable($('#personTable22'),arr);

    }

    //条件查询
    function conditionSelect(){

        $.ajax({

            type:'post',
            url:_urls + 'YWDev/ywDevGetLifeCycle',
            data:{
                dNum:$('#ggxh').val(),
                userID:_userIdNum,
                userName:_userIdName
            },
            timeout:_theTimes,
            success:function(result){

                _allData.length = 0;

                if(result){

                    _allData.push(result);

                }

                //首先确定年份
                _yearArr.length = 0;

                var arr1 = [];

                _blocks.length = 0;

                _gdData.length = 0;

                if(result.gdInfos){

                    for(var i=0;i<result.gdInfos.length;i++){

                        _gdData.push(result.gdInfos[i]);

                    }

                }

                if(result.lcEvents){

                    for(var i=0;i<result.lcEvents.length;i++ ){

                        _blocks.push(result.lcEvents[i]);

                        var dates = result.lcEvents[i].eDate.split(' ')[0].split('-')[0];

                        if(dates != '' && arr1.indexOf(dates) <0 ){

                            arr1.push(dates);
                        }
                    }

                    arr1 = arr1.sort(_sortNumber);

                    var height = _heights * arr1.length;

                    $('#calender').height(height);

                    for(var i=0;i<arr1.length;i++){

                        var obj = {};

                        obj.range = arr1[i];

                        obj.dayLabel = {};

                        obj.dayLabel.nameMap = 'cn';

                        obj.dayLabel.firstDay = 1;

                        obj.monthLabel = {};

                        obj.monthLabel.nameMap = 'cn';

                        var top = _distance + i*260;

                        obj.top = top;

                        obj.cellSize = [];

                        obj.cellSize[0] = 'auto';

                        obj.cellSize[1] = 20;

                        _yearArr.push(obj);


                    }

                    option.calendar = _yearArr;

                    //series
                    _calendarArr.length = 0;

                    for(var i=0;i<arr1.length;i++){

                        var obj = {};

                        obj.type = 'heatmap';

                        obj.coordinateSystem = 'calendar';

                        obj.calendarIndex = _calendarIndex + i*1;

                        obj.data = [];

                        _calendarArr.push(obj);

                    }

                    option.series = _calendarArr;

                    //直观显示色块
                    for(var i = 0;i<result.lcEvents.length;i++){

                        for(var j=0;j<arr1.length;j++){

                            var date = result.lcEvents[i].eDate;

                            if( date != '' && date.indexOf(arr1[j]) >=0 ){

                                var values = 0;

                                if(result.lcEvents[i].eType == 'gdInfos'){

                                    values = 300;

                                }else if( result.lcEvents[i].eType == 'diInfos' ){

                                    values = 600;

                                }else if( result.lcEvents[i].eType == 'dmInfos' ){

                                    values = 900;

                                }else{

                                    values = 20;

                                }

                                var arr = [];

                                arr[0] = date;

                                arr[1] = values;

                                option.series[j].data.push(arr);

                            }

                        }

                    }

                    myChart.setOption(option);

                    //表格
                    _datasTable($('#scrap-datatables'),result.lcEvents);

                }


            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(JSON.parse(jqXHR.responseText).message);

                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){

                }
            }
        })

    }

    //巡检详情
    function inspectionContent(){

        $.ajax({

            type:'post',
            url:_urls + 'YWDevIns/YWDITGetTasks',
            data:{
                itkNum:_inspectionID,
                status:99,
                userID:_userIdNum,
                userName:_userIdName,
                isAllData:1
            },
            timeout:_theTimes,
            success:function(result){

                //是否启用
                inspectionVue.sfqy = result[0].status;
                //任务单号
                inspectionVue.rwdh = result[0].itkNum;
                //任务名称
                inspectionVue.rwmc = result[0].itkName;
                //计划名称
                inspectionVue.jhmc = result[0].dipName;
                //计划编号
                inspectionVue.jhbm = result[0].dipNum;
                //设备名称
                inspectionVue.sbmc = result[0].dName;
                //设备编码
                inspectionVue.sbbm = result[0].dNum;;
                //责任单位部门
                inspectionVue.zrdwbm = result[0].dipKeshi;
                //负责人
                inspectionVue.fzr = result[0].manager;
                //执行人
                inspectionVue.zxr = result[0].itkRen;
                //接单时间
                $('#inspectionDetail').find('#jdsj').val(result[0].tkRecTime);
                //开始时间
                $('#inspectionDetail').find('#kssj').val(result[0].tkTime);
                //完成时间
                $('#inspectionDetail').find('#wcsj').val(result[0].tkCompTime);
                //备注
                $('#inspectionDetail').find('textarea').val(result[0].remark);
                //表格初始化
                $.ajax({

                    type:'post',
                    url:_urls + 'YWDevIns/YWDIPGetItemAndMembers',
                    data:{
                        dipNum:inspectionVue.jhbm,
                        userID:_userIdNum,
                        userName:_userIdName,
                    },
                    timeout:_theTimes,
                    success:function(result){

                        _datasTable($('#personTable1'),result.dipItems);

                        _datasTable($('#personTable2'),result.dipMembers);

                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                        }
                    }

                })


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(JSON.parse(jqXHR.responseText).message);
                if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                }
            }

        })

    }

    //保养详情
    function maintainContent(){

        $.ajax({

            type:'post',
            url:_urls + 'YWDevMT/YWDMTGetTasks',
            data:{

                dipNum:_maintainID,
                status:99,
                userID:_userIdNum,
                userName:_userIdName,
                isAllData:1

            },
            timeout:_theTimes,
            success:function(result){

                //是否启用
                maintainVue.sfqy = result[0].status;
                //任务单号
                maintainVue.rwdh = result[0].itkNum;
                //任务名称
                maintainVue.rwmc = result[0].itkName;
                //计划名称
                maintainVue.jhmc = result[0].dipName;
                //计划编号
                maintainVue.jhbm = result[0].dipNum;
                //设备名称
                maintainVue.sbmc = result[0].dName;
                //设备编码
                maintainVue.sbbm = result[0].dNum;;
                //责任单位部门
                maintainVue.zrdwbm = result[0].dipKeshi;
                //负责人
                maintainVue.fzr = result[0].manager;
                //执行人
                maintainVue.zxr = result[0].itkRen;
                //接单时间
                $('#maintainDetail').find('#jdsj1').val(result[0].tkRecTime);
                //开始时间
                $('#maintainDetail').find('#kssj1').val(result[0].tkTime);
                //完成时间
                $('#maintainDetail').find('#wcsj1').val(result[0].tkCompTime);
                //备注
                $('#maintainDetail').find('textarea').val(result[0].remark);

                //表格初始化
                $.ajax({

                    type:'post',
                    url:_urls + 'YWDevMT/YWDMPGetItemAndMembers',
                    data:{
                        dipNum:maintainVue.jhbm,
                        userID:_userIdNum,
                        userName:_userIdName,
                    },
                    timeout:_theTimes,
                    success:function(result){

                        console.log(result);

                        _datasTable($('#personTable11'),result.dipItems);

                        _datasTable($('#personTable22'),result.dipMembers);

                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.parse(jqXHR.responseText).message);
                        if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                        }
                    }

                })


            }

        })

    }

    //系统详情初始化
    function deviceInit(){
        //设备编码
        deviceVue.sbbm = '';
            //设备名称
        deviceVue.mingcheng = '';
            //拼音简码
        deviceVue.pinyin = '';
            //出厂编号
        deviceVue.bianhao = '';
            //车务段
        deviceVue.ssQY = '';
            //设备系统
        deviceVue.ssXT = '';
            //车站
        deviceVue.ssbumen = '';
            //设备类别
        deviceVue.zcLX = '';
            //产地
        deviceVue.chandi = '';
            //状态
        deviceVue.zhuangtai = '';
            //安装位置
        deviceVue.weizhi = '';
            //品牌
        deviceVue.pingpai = '';
            //规格型号
        deviceVue.guige = '';
            //供应商
        deviceVue.gongyingshang = '';
            //生产商
        deviceVue.shengchanshang = '';
            //使用年限
        deviceVue.nianxian = '';
            //保修期
        deviceVue.baoxiu = '';

        //设备资料
        $('.lujing').html('');

        //input
        $('#divDetail').find('input').val('');

        //select
        $('#divDetail').find('select').val('');

        //textarea
        $('#divDetail').find('textarea').val('');
    }

    //IP替换
    function replaceIP(str,str1){
        var ip = /http:\/\/\S+?\//;  /*http:\/\/\S+?\/转义*/
        //var res = ip.exec(str1);  /*211.100.28.180*/
        var res = 'http://211.100.28.180/';
        str = str.replace(ip,res);
        return str;
    }

    //获取所属维保组和所属班组
    function InfluencingUnit(flag){
        var prm = {
            "id": 0,
            "ddNum": "",
            "ddName": "",
            "ddPy": "",
            "daNum": "",
            "userID": _userIdNum,
            "userName": _userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:prm,
            success:function(result){

                //所属车间
                _InfluencingArr.length = 0;
                //所属班组
                _bzArr.length = 0;

                for(var i=0;i<result.stations.length;i++){

                    _InfluencingArr.push(result.stations[i]);

                }

                for(var i=0;i<result.wxBanzus.length;i++){
                    _bzArr.push(result.wxBanzus[i]);

                }

                //首先判断是在车间还是维保组里(如果是在维保组里，加载该维保组的维修班组，如果是在维修班组里，直接发送维修班组即可);
                var stationsFlag = false;

                var wxBanzusFlag = false;

                for(var i=0;i<result.stations.length;i++){

                    if(sessionStorage.userDepartNum == result.stations[i].departNum){

                        stationsFlag = true;

                        break;

                    }else{

                        stationsFlag = false;

                    }
                }
                for(var i=0;i<result.wxBanzus.length;i++){
                    if(sessionStorage.userDepartNum == result.wxBanzus[i].departNum){
                        wxBanzusFlag = true;
                        break;
                    }else{
                        wxBanzusFlag = false;
                    }
                }

                choiceDevice(flag,stationsFlag,wxBanzusFlag);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

})