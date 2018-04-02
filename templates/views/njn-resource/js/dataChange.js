$(function(){

    /*---------------------------------------------------数据--------------------------------------------------*/

    //取值；
    function getValue(el,index,type){

        var num = el.children('li').eq(index).children('input').val();

        if(type == 'string'){

            return num == ''?0:num

        }else if( type == 'number' ){

            return num == ''?0:Number(num)

        }else if( type == 'int' ){

            return num == ''?0:parseInt(num)

        }

    }

    //读取能耗
    var _energyArr = [];

    energyFun();

    function energyFun(){

        var arr = JSON.parse(sessionStorage.getItem('allEnergyType'));

        var arr1 = [];

        if(arr.alltypes){

            if(arr.alltypes.length>0){

                for(var i=0;i<arr.alltypes.length;i++){

                    if(arr.alltypes[i].etname == '电' || arr.alltypes[i].etname == '水' || arr.alltypes[i].etname == '汽' ){

                        arr1.push(arr.alltypes[i]);

                    }

                }

                for(var i=0;i<arr1.length;i++){

                    if( arr1[i].etname == '电' ){

                        _energyArr[0] = arr1[i].etid;

                    }else if( arr1[i].etname == '水' ){

                        _energyArr[1] = arr1[i].etid;

                    }else if( arr1[i].etname == '汽' ){

                        _energyArr[2] = arr1[i].etid;

                    }

                }

            }

        }

    }

    /*--------------------------------------------------ztree树---------------------------------------------*/

    //楼宇树
    var pointerObj;

    var _departmentArr = [];

    getSessionStoragePointer();

    //首先将sessionStorage的内容写入html中
    function getSessionStoragePointer(){

        var jsonText1=sessionStorage.getItem('pointers');

        var htmlTxet1 = JSON.parse(jsonText1);

        if(htmlTxet1){
            //楼宇树
            _departmentArr = getCompactArr(htmlTxet1,false,true)

            zTreeFun();

            //获取楼宇id
            readData();

        }


    }

    //ztree树
    function zTreeFun(){
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                chkboxType: { "Y": "s", "N": "ps" },
                radioType:'all',
                nocheckInherit: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            view:{
                showIcon:false,
            },
            callback: {

                onClick: function(e,treeId,treeNode){

                    //取消全部打钩的节点
                    pointerObj.checkNode(treeNode,!treeNode.checked,true);

                },
                beforeClick:function(){

                    $('#ztreeStation').find('.curSelectedNode').removeClass('curSelectedNode');

                },

                onCheck:function(e,treeId,treeNode){

                    $('#ztreeStation').find('.curSelectedNode').removeClass('curSelectedNode');

                    $('#ztreeStation').find('.radio_true_full_focus').next('a').addClass('curSelectedNode');

                    //取消全部打钩的节点
                    pointerObj.checkNode(treeNode,true,true);


                }

            }
        };

        pointerObj = $.fn.zTree.init($("#ztreeStation"), setting, _departmentArr);
    }

    //获取正确的Ztree树结构数据
    function getCompactArr(tempAllPointers,isCheckAll,flag){

        var _districArr = unique(tempAllPointers,'districtID');
        var _enterpriseArr = unique(tempAllPointers,'enterpriseID');
        var _pointerArr = unique(tempAllPointers,'pointerID');

        var arr = [];
        for(var i=0;i<_districArr.length;i++){

            var obj = {};
            obj.districtID = _districArr[i].districtID;
            obj.districtName = _districArr[i].districtName;
            obj.parent = '';
            obj.children = [];

            for(var j=0;j<_enterpriseArr.length;j++){
                var obj1 = {};
                obj1.enterpriseID = _enterpriseArr[j].enterpriseID;
                obj1.eprName = _enterpriseArr[j].eprName;
                obj1.parent = obj.districtID;
                obj1.children = [];

                if( _enterpriseArr[j].districtID == _districArr[i].districtID){

                    obj.children.push(obj1);
                }
                for(var z=0;z<_pointerArr.length;z++){

                    if(_pointerArr[z].enterpriseID == _enterpriseArr[j].enterpriseID){
                        var obj11 = {};
                        obj11.pointerID = _pointerArr[z].pointerID;
                        obj11.pointerName = _pointerArr[z].pointerName;
                        obj11.parent = obj1.enterpriseID;

                        obj1.children.push(obj11);
                    }

                }
            }
            arr.push(obj);
        }
        var ztreeArr = [];
        for(var i=0;i<arr.length;i++){
            var obj = {};
            obj.name = arr[i].districtName;
            obj.id = arr[i].districtID;
            obj.pId = arr[i].parent;
            //当前类型：0 区域 1 企业 2 楼宇
            obj.nodeType = 0;

            //
            //if(isCheckAll == false){
            //
            //    obj.checked=false;
            //}
            if(flag){
                obj.nocheck=true;
            }
            ztreeArr.push(obj);
            for(var j=0;j<arr[i].children.length;j++){
                var obj1 = {};
                obj1.name = arr[i].children[j].eprName;
                obj1.id = arr[i].children[j].enterpriseID;
                obj1.pId = arr[i].children[j].parent;
                //当前类型：0 区域 1 企业 2 楼宇
                obj1.nodeType = 1;
                //if(isCheckAll == false){
                //
                //    obj1.nocheck=true;
                //}
                //判断是否打开当前页的Pointer列表
                if(flag){
                    obj1.nocheck=true;
                    if(sessionStorage.curPointerId){

                    }else{
                        if(i == 0 && j == 0){
                            obj1.open = true;
                            obj.open = true;
                        }
                    }
                }else{
                    if(i == 0 && j == 0){
                        obj1.open = true;
                        obj.open = true;
                    }
                }
                ztreeArr.push(obj1);
                for(var z=0;z<arr[i].children[j].children.length;z++){
                    var obj11 = {};
                    obj11.name = arr[i].children[j].children[z].pointerName;
                    obj11.id = arr[i].children[j].children[z].pointerID;
                    obj11.pId = arr[i].children[j].children[z].parent;
                    //当前类型：0 区域 1 企业 2 楼宇
                    obj11.nodeType = 2;
                    if(sessionStorage.curPointerId){
                        var id = sessionStorage.curPointerId;
                        if( obj11.id == id){
                            if(flag){
                                obj11.checked = true;
                                obj1.open = true;
                                obj.open = true;
                                $('#onOff1').html(arr[i].children[j].children[z].pointerName);
                            }
                        }

                    }else{
                        if(isCheckAll == false && i == 0 && j == 0 && z == 0){

                            if(flag){
                                if(sessionStorage.curPointerId){

                                }else{
                                    sessionStorage.curPointerId = obj11.id;
                                    obj11.checked = true;

                                }
                            }
                        }
                    }


                    ztreeArr.push(obj11);
                }
            }
        }

        //console.log(ztreeArr);
        return ztreeArr;
    }

    //默认选中
    //获取勾选的id名
    pointerObj = $.fn.zTree.getZTreeObj("ztreeStation");

    var ptsName = pointerObj.getCheckedNodes(true);

    $('.show-name').html(ptsName[0].name);

    /*---------------------------------------------------按钮事件--------------------------------------------*/

    //提交
    $('.button-submit').click(function(){

        conditionSelect();

    })

    //选择区域
    $('.button-block .btn').click(function(){

        //获取勾选的id名
        pointerObj = $.fn.zTree.getZTreeObj("ztreeStation");

        var ptsName = pointerObj.getCheckedNodes(true);

        $('.show-name').html(ptsName[0].name);

        //获取数据
        readData();

    })

    //开关点击
    $('.switch-button').click(function(){

        if($(this).hasClass('button-on')){

            $(this).removeClass('button-on').addClass('button-off');

        }else{

            $(this).removeClass('button-off').addClass('button-on');

        }

    })

    /*------------------------------------------------------其他方法--------------------------------------------*/

    //提交修改数据
    function conditionSelect(){

        pointerObj = $.fn.zTree.getZTreeObj("ztreeStation");

        //获取楼宇id
        var pts = pointerObj.getCheckedNodes(true);

        var obj = {

            //设备监控
            TPDevMonitorReturnNew:{

                //暖通系统
                hvacAirsOBJ:{

                    //冷热源效率
                    hvacAirData:{

                        //输入蒸汽
                        rcVa:getValue($('.HVAC'),0,'string'),

                        //输出蒸汽
                        qeVa:getValue($('.HVAC'),2,'string'),

                        //换热能效
                        nxVa:getValue($('.HVAC'),4,'string'),

                        //季节选择
                        ty:$('#season-range').val()

                    },

                    //电功率
                    elecPowe:getValue($('.HVAC'),6,'number'),

                    //报警点
                    alarmNum:getValue($('.HVAC'),8,'int'),

                    //监测点
                    cDataIDNum:getValue($('.HVAC'),10,'int'),

                    //运行中
                    runNum:getValue($('.HVAC'),1,'int'),

                    //故障中
                    faultNum:getValue($('.HVAC'),3,'int'),

                    //维修中
                    repairNum:getValue($('.HVAC'),5,'int'),

                    //运行占比
                    runPercent:getValue($('.HVAC'),7,'number'),

                    //总台数
                    allNum:getValue($('.HVAC'),9,'number'),

                    //开关
                    switch:$('.HVAC-button').hasClass('button-on')?1:0

                },

                //照明系统
                lightSysOBJ:{

                    //站房运行中
                    houseLightRunNum:getValue($('.LIGHT'),0,'int'),

                    //站房故障中
                    houseLightFaultNum:getValue($('.LIGHT'),2,'int'),

                    //站房维修中
                    houseLightRepairNum:getValue($('.LIGHT'),4,'int'),

                    //站房运行占比
                    houseLightRunPercent:getValue($('.LIGHT'),6,'number'),

                    //站房回数
                    houseLightAllNum:getValue($('.LIGHT'),8,'int'),

                    //电功率
                    elecPower:getValue($('.LIGHT'),10,'number'),

                    //站台运行中
                    platformLightRunNum:getValue($('.LIGHT'),1,'int'),

                    //站台故障中
                    platformLightFaultNum:getValue($('.LIGHT'),3,'int'),

                    //站台维修中
                    platformLightRepairNum:getValue($('.LIGHT'),5,'int'),

                    //站台运行占比
                    platformLightRunPercent:getValue($('.LIGHT'),7,'int'),

                    //站台回数
                    platformLightAllNum:getValue($('.LIGHT'),9,'int'),

                    //报警点
                    alarmNum:getValue($('.LIGHT'),11,'int'),

                    //监测点
                    cDataIDNum:getValue($('.LIGHT'),13,'int'),

                    //开关
                    switch:$('.LIGHT-button').hasClass('button-on')?1:0

                },

                //电梯系统
                elevatorSysOBJ:{

                    //直梯
                    verticalLadder:{

                        //运行中
                        runNum:getValue($('.ELEVATOR'),0,'int'),

                        //故障中
                        faultNum:getValue($('.ELEVATOR'),2,'int'),

                        //维修中
                        repairNum:getValue($('.ELEVATOR'),4,'int'),

                        //运行占比
                        runPercent:getValue($('.ELEVATOR'),6,'number'),

                        //总台数
                        allNum:getValue($('.ELEVATOR'),8,'int')

                    },

                    //扶梯
                    escalator:{

                        //运行中
                        runNum:getValue($('.ELEVATOR'),1,'int'),

                        //故障中
                        faultNum:getValue($('.ELEVATOR'),3,'int'),

                        //维修中
                        repairNum:getValue($('.ELEVATOR'),5,'int'),

                        //运行占比
                        runPercent:getValue($('.ELEVATOR'),7,'number'),

                        //总台数
                        allNum:getValue($('.ELEVATOR'),9,'int')


                    },

                    //电功率
                    elecPower:getValue($('.ELEVATOR'),10,'number'),

                    //报警点
                    alarmNum:getValue($('.ELEVATOR'),11,'int'),

                    //监测点
                    cDataIDNum:getValue($('.ELEVATOR'),13,'int'),

                    //开关
                    switch:$('.ELEVATOR-button').hasClass('button-on')?1:0

                },

                //动环系统
                rotaryFaceSysOBJ:{

                    //运行中
                    runNum:getValue($('.RING'),0,'int'),

                    //故障中
                    faultNum:getValue($('.RING'),2,'int'),

                    //维修中
                    repairNum:getValue($('.RING'),4,'int'),

                    //运行占比
                    runPercent:getValue($('.RING'),6,'number'),

                    //机房数
                    machineRoomNum:getValue($('.RING'),8,'int'),

                    //电功率
                    elecPower:getValue($('.RING'),10,'number'),

                    //室内温度
                    indoorTemp:getValue($('.RING'),1,'number'),

                    //室内湿度
                    indoorHumidity:getValue($('.RING'),3,'number'),

                    //报警点
                    alarmNum:getValue($('.RING'),5,'int'),

                    //监测点
                    cDataIDNum:getValue($('.RING'),7,'int'),

                    //开关
                    switch:$('.RING-button').hasClass('button-on')?1:0

                },

                //给排水
                sendDrainWaterOBJ:{

                    //运行中
                    runNum:getValue($('.WaterSupply'),0,'int'),

                    //故障中
                    faultNum:getValue($('.WaterSupply'),2,'int'),

                    //维修中
                    repairNum:getValue($('.WaterSupply'),4,'int'),

                    //运行占比
                    runPercent:getValue($('.WaterSupply'),6,'number'),

                    //总台数
                    allSetNumber:getValue($('.WaterSupply'),8,'int'),

                    //电功率
                    elecPower:getValue($('.WaterSupply'),1,'number'),

                    //报警点
                    alarmNum:getValue($('.WaterSupply'),3,'int'),

                    //监测点
                    cDataIDNum:getValue($('.WaterSupply'),5,'int'),

                    //开关
                    switch:$('.water-button').hasClass('button-on')?1:0

                },

                //消防系统
                fireControlSysOBJ:{

                    //运行中
                    runNum:getValue($('.FireControl'),0,'int'),

                    //故障中
                    faultNum:getValue($('.FireControl'),2,'int'),

                    //维修中
                    repairNum:getValue($('.FireControl'),4,'int'),

                    //运行占比
                    runPercent:getValue($('.FireControl'),6,'number'),

                    //总台数
                    allSetNumber:getValue($('.FireControl'),8,'int'),

                    //电功率
                    elecPower:getValue($('.FireControl'),1,'number'),

                    //报警点
                    alarmNum:getValue($('.FireControl'),3,'int'),

                    //监测点
                    cDataIDNum:getValue($('.FireControl'),5,'int'),

                    //开关
                    switch:$('.fire-button').hasClass('button-on')?1:0

                },

                //自动售检票
                sellCheckTicketOBJ:{

                    //运行中
                    runNum:getValue($('.TicketsForSale'),0,'int'),

                    //故障中
                    faultNum:getValue($('.TicketsForSale'),2,'int'),

                    //维修中
                    repairNum:getValue($('.TicketsForSale'),4,'int'),

                    //运行占比
                    runPercent:getValue($('.TicketsForSale'),6,'number'),

                    //总台数
                    allSetNumber:getValue($('.TicketsForSale'),8,'int'),

                    //故障率
                    faultPower:getValue($('.TicketsForSale'),1,'number'),

                    //报警点
                    alarmNum:getValue($('.TicketsForSale'),3,'int'),

                    //监测点
                    cDataIDNum:getValue($('.TicketsForSale'),5,'int'),

                    //开关
                    switch:$('.ticket-button').hasClass('button-on')?1:0


                },

                //能源管理
                energyManagerOBJ:{

                    //分项数据
                    energyKeyValues:[

                        {
                            //id
                            energyItemID:_energyArr[0],

                            //能耗
                            energyData:getValue($('.ENERGY'),0,'number')

                        },

                        {
                            //id
                            energyItemID:_energyArr[1],

                            //能耗
                            energyData:getValue($('.ENERGY'),2,'number')

                        },

                        {
                            //id
                            energyItemID:_energyArr[2],

                            //能耗
                            energyData:getValue($('.ENERGY'),4,'number')

                        }

                    ],

                    //总能耗
                    allEnergyData:getValue($('.ENERGY'),6,'number'),

                    //分项费用
                    allEnergyCosts:[

                        {
                            //id
                            energyItemID:_energyArr[0],

                            //费用
                            energyData:Number(0)

                        },

                        {
                            //id
                            energyItemID:_energyArr[1],

                            //费用
                            energyData:Number(0)

                        },

                        {
                            //id
                            energyItemID:_energyArr[2],

                            //费用
                            energyData:Number(0)

                        }

                    ],

                    //总费用
                    allEnergyCostData:Number(0),

                    //报警点
                    alarmNum:getValue($('.ENERGY'),1,'number'),

                    //监测点
                    cDataIDNum:getValue($('.ENERGY'),3,'number'),

                    //开关
                    switch:$('.ENERGY-button').hasClass('button-on')?1:0

                },

                //设备监控总开关
                switch:$('.equipmentSystem-button').hasClass('button-on')?1:0

            },

            //安全运行天数
            safeRunningDays:{

                //天数
                dayNum:getValue($('.safeRunningDays'),0,'number'),

                //开关
                switch:$('.safe-button').hasClass('button-on')?1:0

            },

            //节能减排
            energyConservation:{

                //累计节电量
                electricSave:getValue($('.energyConservation'),0,'number'),

                //累计节水量
                waterSave:getValue($('.energyConservation'),2,'number'),

                //累计节汽量
                steamSave:getValue($('.energyConservation'),4,'number'),

                //累计减排量
                emissionReduction:getValue($('.energyConservation'),6,'number'),

                //开关
                switch:$('.energy1-button').hasClass('button-on')?1:0

            },

            //设备报警
            equipmentAlarm:{

                //设备报警
                alarmDev:getValue($('.equipmentAlarm'),0,'number'),

                //开关
                switch:$('.equipment-button').hasClass('button-on')?1:0

            },

            //运维联动
            perationMaintenance:{

                //工单响应
                responseGD:{

                    //运行中
                    running:getValue($('.responseGD'),0,'number'),

                    //派单中
                    dispatch:getValue($('.responseGD'),1,'number'),

                    //已完成
                    complete:getValue($('.responseGD'),2,'number'),

                },

                //工单分布
                distributionGD:{

                    //暖通系统
                    hvacAirsOBJ:getValue($('.distributionGD'),0,'number'),

                    //照明系统
                    lightSysOBJ:getValue($('.distributionGD'),1,'number'),

                    //电梯系统
                    elevatorSysOBJ:getValue($('.distributionGD'),2,'number'),

                    //动环系统
                    rotaryFaceSysOBJ:getValue($('.distributionGD'),3,'number'),

                    //给排水
                    sendDrainWaterOBJ:getValue($('.distributionGD1'),0,'number'),

                    //消防系统
                    fireControlSysOBJ:getValue($('.distributionGD1'),1,'number'),

                    //自动售检票
                    sellCheckTicketOBJ:getValue($('.distributionGD1'),2,'number'),

                    //能源管理
                    energyManagerOBJ:getValue($('.distributionGD1'),3,'number')

                },

                //工单量
                numberGD:$('.numberGD').children('input').val() == ''?0:Number($('.numberGD').children('input').val()),

                //开关
                switch:$('.GD-button').hasClass('button-on')?1:0

            },

            //设备故障报警占比
            faultAlarmDev:{

                //工单响应
                responseGD:{

                    //运行中
                    running:getValue($('.responseGD1'),0,'number'),

                    //派单中
                    dispatch:getValue($('.responseGD1'),1,'number'),

                    //已完成
                    complete:getValue($('.responseGD1'),2,'number'),

                },

                //工单分布
                distributionGD:{

                    //暖通系统
                    hvacAirsOBJ:getValue($('.distributionGD2'),0,'number'),

                    //照明系统
                    lightSysOBJ:getValue($('.distributionGD2'),1,'number'),

                    //电梯系统
                    elevatorSysOBJ:getValue($('.distributionGD2'),2,'number'),

                    //动环系统
                    rotaryFaceSysOBJ:getValue($('.distributionGD2'),3,'number'),

                    //给排水
                    sendDrainWaterOBJ:getValue($('.distributionGD3'),0,'number'),

                    //消防系统
                    fireControlSysOBJ:getValue($('.distributionGD3'),1,'number'),

                    //自动售检票
                    sellCheckTicketOBJ:getValue($('.distributionGD3'),2,'number'),

                    //能源管理
                    energyManagerOBJ:getValue($('.distributionGD3'),3,'number')

                },

                //工单量
                numberGD:$('.numberGD1').children('input').val() == ''?0:Number($('.numberGD1').children('input').val()),

                //开关
                switch:$('.fault-button').hasClass('button-on')?1:0


            },

        }

        var prm = {

            //数据
            "fileStr":JSON.stringify(obj),

            //楼宇id
            "pointerID":pts[0].id,

            //用户id
            "userID":_userIdNum

        };

        console.log(prm);

        $.ajax({

            type:'post',

            url:_urls + 'NJNDeviceShow/SaveNJNConfigToFile',

            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

            },

            data:prm,
            timeout:_theTimes,

            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'提交成功!', '');


                    readData();

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'提交失败!', '');

                }

            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }


        })

    }

    //读取数据
    function readData(){

        //获取楼宇
        pointerObj = $.fn.zTree.getZTreeObj("ztreeStation");

        //获取楼宇id
        var pts = pointerObj.getCheckedNodes(true);

        $.ajax({

            type:'get',

            url:_urls + 'NJNDeviceShow/GetNJNConfigToFile',

            data:{

                pointerID:pts[0].id
            },

            timeout:_theTimes,

            success:function(result){

                if(result == ''){

                    $('.switch-button').removeClass('button-on').addClass('button-off');


                }else{

                    var result1 = JSON.parse(result);
                    console.log(result1);


                    //赋值
                    //暖通系统
                    var hvac = $('.HVAC').children('li');

                    if(result1.TPDevMonitorReturnNew){

                        if(result1.TPDevMonitorReturnNew.hvacAirsOBJ){

                            var obj = result1.TPDevMonitorReturnNew.hvacAirsOBJ;

                            //类型
                            $('.season-range').val(obj.hvacAirData.ty);

                            //输入蒸汽
                            hvac.eq(0).children('input').val(obj.hvacAirData.rcVa);

                            //输出蒸汽
                            hvac.eq(2).children('input').val(obj.hvacAirData.qeVa);

                            //换能能效
                            hvac.eq(4).children('input').val(obj.hvacAirData.nxVa);

                            //电功率
                            hvac.eq(6).children('input').val(obj.elecPowe);

                            //报警点
                            hvac.eq(8).children('input').val(obj.alarmNum);

                            //监测点
                            hvac.eq(10).children('input').val(obj.cDataIDNum);

                            //运行中
                            hvac.eq(1).children('input').val(obj.runNum);

                            //故障中
                            hvac.eq(3).children('input').val(obj.faultNum);

                            //维修中
                            hvac.eq(5).children('input').val(obj.repairNum);

                            //运行占比
                            hvac.eq(7).children('input').val(obj.runPercent);

                            //总台数
                            hvac.eq(9).children('input').val(obj.allNum);

                            //开关
                            switchStatus((obj.switch == 1),$('.HVAC-button'));

                        }

                        //开关
                        switchStatus((result1.TPDevMonitorReturnNew.switch == 1),$('.equipmentSystem-button'));

                    }

                    //照明系统
                    var light = $('.LIGHT').children('li');

                    if(result1.TPDevMonitorReturnNew){

                        if(result1.TPDevMonitorReturnNew.lightSysOBJ){

                            var obj = result1.TPDevMonitorReturnNew.lightSysOBJ;

                            //站房运行中
                            light.eq(0).children('input').val(obj.houseLightRunNum);

                            //站房故障中
                            light.eq(2).children('input').val(obj.houseLightFaultNum);

                            //站房维修中
                            light.eq(4).children('input').val(obj.houseLightRepairNum);

                            //站房运行占比
                            light.eq(6).children('input').val(obj.houseLightRunPercent);

                            //站房回数
                            light.eq(8).children('input').val(obj.houseLightAllNum);

                            //电功率
                            light.eq(10).children('input').val(obj.elecPower);

                            //站台运行中
                            light.eq(1).children('input').val(obj.platformLightRunNum);

                            //站台故障中
                            light.eq(3).children('input').val(obj.platformLightFaultNum);

                            //站台维修中
                            light.eq(5).children('input').val(obj.platformLightRepairNum);

                            //站台运行占比
                            light.eq(7).children('input').val(obj.platformLightRunPercent);

                            //站台回数
                            light.eq(9).children('input').val(obj.platformLightAllNum);

                            //报警点
                            light.eq(11).children('input').val(obj.alarmNum);

                            //监测点
                            light.eq(13).children('input').val(obj.cDataIDNum);

                            //开关
                            switchStatus((obj.switch == 1),$('.LIGHT-button'));

                        }

                    }

                    //电梯系统
                    var elevator = $('.ELEVATOR').children('li');

                    if(result1.TPDevMonitorReturnNew){

                        if(result1.TPDevMonitorReturnNew.elevatorSysOBJ){

                            var obj = result1.TPDevMonitorReturnNew.elevatorSysOBJ;

                            //直梯运行中
                            elevator.eq(0).children('input').val(obj.verticalLadder.runNum);

                            //直梯故障中
                            elevator.eq(2).children('input').val(obj.verticalLadder.faultNum);

                            //直梯维修中
                            elevator.eq(4).children('input').val(obj.verticalLadder.repairNum);

                            //直梯运行占比
                            elevator.eq(6).children('input').val(obj.verticalLadder.runPercent);

                            //直梯数
                            elevator.eq(8).children('input').val(obj.verticalLadder.allNum);

                            //电功率
                            elevator.eq(10).children('input').val(obj.elecPower);

                            //扶梯运行中
                            elevator.eq(1).children('input').val(obj.escalator.runNum);

                            //扶梯故障中
                            elevator.eq(3).children('input').val(obj.escalator.faultNum);

                            //扶梯维修中
                            elevator.eq(5).children('input').val(obj.escalator.repairNum);

                            //扶梯运行占比
                            elevator.eq(7).children('input').val(obj.escalator.runPercent);

                            //扶梯数
                            elevator.eq(9).children('input').val(obj.escalator.allNum);

                            //报警点
                            elevator.eq(11).children('input').val(obj.alarmNum);

                            //监测点
                            elevator.eq(13).children('input').val(obj.cDataIDNum);

                            //开关
                            switchStatus((obj.switch == 1),$('.ELEVATOR-button'));

                        }

                    }

                    //动环系统
                    var rotary = $('.RING').children('li');

                    if(result1.TPDevMonitorReturnNew){

                        if(result1.TPDevMonitorReturnNew.rotaryFaceSysOBJ){

                            var obj = result1.TPDevMonitorReturnNew.rotaryFaceSysOBJ;

                            //运行中
                            rotary.eq(0).children('input').val(obj.runNum);

                            //故障中
                            rotary.eq(2).children('input').val(obj.faultNum);

                            //维修中
                            rotary.eq(4).children('input').val(obj.repairNum);

                            //运行占比
                            rotary.eq(6).children('input').val(obj.runPercent);

                            //机房数
                            rotary.eq(8).children('input').val(obj.machineRoomNum);

                            //电功率
                            rotary.eq(10).children('input').val(obj.elecPower);

                            //室内温度
                            rotary.eq(1).children('input').val(obj.indoorTemp);

                            //室内湿度
                            rotary.eq(3).children('input').val(obj.indoorHumidity);

                            //报警点
                            rotary.eq(5).children('input').val(obj.alarmNum);

                            //监测点
                            rotary.eq(7).children('input').val(obj.cDataIDNum);

                            //开关
                            switchStatus((obj.switch == 1),$('.RING-button'));

                        }

                    }

                    //给排水
                    var water = $('.WaterSupply').children('li');

                    if(result1.TPDevMonitorReturnNew){

                        if(result1.TPDevMonitorReturnNew.sendDrainWaterOBJ){

                            var obj = result1.TPDevMonitorReturnNew.sendDrainWaterOBJ;

                            //运行中
                            water.eq(0).children('input').val(obj.runNum);

                            //故障中
                            water.eq(2).children('input').val(obj.faultNum);

                            //维修中
                            water.eq(4).children('input').val(obj.repairNum);

                            //运行占比
                            water.eq(6).children('input').val(obj.runPercent);

                            //总台数
                            water.eq(8).children('input').val(obj.allSetNumber);

                            //电功率
                            water.eq(1).children('input').val(obj.elecPower);

                            //报警点
                            water.eq(3).children('input').val(obj.alarmNum);

                            //监测点
                            water.eq(5).children('input').val(obj.cDataIDNum);

                            //开关
                            switchStatus((obj.switch == 1),$('.water-button'));

                        }

                    }

                    //消防系统
                    var fire = $('.FireControl').children('li');

                    if(result1.TPDevMonitorReturnNew){

                        if(result1.TPDevMonitorReturnNew.fireControlSysOBJ){

                            var obj = result1.TPDevMonitorReturnNew.fireControlSysOBJ;

                            //运行中
                            fire.eq(0).children('input').val(obj.runNum);

                            //故障中
                            fire.eq(2).children('input').val(obj.faultNum);

                            //维修中
                            fire.eq(4).children('input').val(obj.repairNum);

                            //运行占比
                            fire.eq(6).children('input').val(obj.runPercent);

                            //总台数
                            fire.eq(8).children('input').val(obj.allSetNumber);

                            //电功率
                            fire.eq(1).children('input').val(obj.elecPower);

                            //报警点
                            fire.eq(3).children('input').val(obj.alarmNum);

                            //监测点
                            fire.eq(5).children('input').val(obj.cDataIDNum);

                            //开关
                            switchStatus((obj.switch == 1),$('.fire-button'));

                        }

                    }

                    //自动售检票
                    var sellCheck = $('.TicketsForSale').children('li');

                    if(result1.TPDevMonitorReturnNew){

                        if(result1.TPDevMonitorReturnNew.sellCheckTicketOBJ){

                            var obj = result1.TPDevMonitorReturnNew.sellCheckTicketOBJ;

                            //运行中
                            sellCheck.eq(0).children('input').val(obj.runNum);

                            //故障中
                            sellCheck.eq(2).children('input').val(obj.faultNum);

                            //维修中
                            sellCheck.eq(4).children('input').val(obj.repairNum);

                            //运行占比
                            sellCheck.eq(6).children('input').val(obj.runPercent);

                            //总台数
                            sellCheck.eq(8).children('input').val(obj.allSetNumber);

                            //故障率
                            sellCheck.eq(1).children('input').val(obj.faultPower);

                            //报警点
                            sellCheck.eq(3).children('input').val(obj.alarmNum);

                            //监测点
                            sellCheck.eq(5).children('input').val(obj.cDataIDNum);

                            //开关
                            switchStatus((obj.switch == 1),$('.ticket-button'));

                        }

                    }

                    //能源管理
                    var energy = $('.ENERGY').children('li');

                    if(result1.TPDevMonitorReturnNew){

                        if(result1.TPDevMonitorReturnNew.energyManagerOBJ){

                            var obj = result1.TPDevMonitorReturnNew.energyManagerOBJ;

                            //用电量
                            energy.eq(0).children('input').val(obj.energyKeyValues[0].energyData);

                            //用水量
                            energy.eq(2).children('input').val(obj.energyKeyValues[1].energyData);

                            //蒸汽量
                            energy.eq(4).children('input').val(obj.energyKeyValues[2].energyData);

                            //总能耗
                            energy.eq(6).children('input').val(obj.allEnergyData);

                            //报警点
                            energy.eq(1).children('input').val(obj.alarmNum);

                            //监测点
                            energy.eq(3).children('input').val(obj.cDataIDNum);

                            //开关
                            switchStatus((obj.switch == 1),$('.ENERGY-button'));


                        }

                    }

                    //安全运行天数
                    var safe = $('.safeRunningDays').children('li');

                    if(result1.safeRunningDays){

                        var obj = result1.safeRunningDays;

                        //天数
                        safe.eq(0).children('input').val(obj.dayNum);

                        //开关
                        switchStatus((result1.safeRunningDays.switch == 1),$('.safe-button'));

                    }

                    //设备报警
                    var equipment = $('.equipmentAlarm').children('li');

                    if(result1.equipmentAlarm){

                        var obj = result1.equipmentAlarm;

                        equipment.eq(0).children('input').val(obj.alarmDev);

                        //开关
                        switchStatus((result1.equipmentAlarm.switch == 1),$('.equipment-button'));

                    }

                    //运维联动
                    if(result1.perationMaintenance){

                        //工单响应
                        if(result1.perationMaintenance.responseGD){

                            var response = $('.responseGD').children('li');

                            var obj = result1.perationMaintenance.responseGD;

                            //运行中
                            response.eq(0).children('input').val(obj.running);

                            //派单中
                            response.eq(1).children('input').val(obj.dispatch);

                            //已完成
                            response.eq(2).children('input').val(obj.complete);

                        }

                        //工单分布
                        if(result1.perationMaintenance.distributionGD){

                            var distribution = $('.distributionGD').children('li');

                            var obj = result1.perationMaintenance.distributionGD;

                            //暖通系统
                            distribution.eq(0).children('input').val(obj.hvacAirsOBJ);

                            //照明系统
                            distribution.eq(1).children('input').val(obj.lightSysOBJ);

                            //电梯系统
                            distribution.eq(2).children('input').val(obj.elevatorSysOBJ);

                            //动环系统
                            distribution.eq(3).children('input').val(obj.rotaryFaceSysOBJ);

                            var distribution1 = $('.distributionGD1').children('li');

                            //给排水
                            distribution1.eq(0).children('input').val(obj.sendDrainWaterOBJ);

                            //消防系统
                            distribution1.eq(1).children('input').val(obj.fireControlSysOBJ);

                            //自动售检票系统
                            distribution1.eq(2).children('input').val(obj.sellCheckTicketOBJ);

                            //能源管理
                            distribution1.eq(3).children('input').val(obj.energyManagerOBJ);

                        }

                        //工单量
                        $('.numberGD').val(result1.perationMaintenance.numberGD);

                        //开关
                        switchStatus((result1.perationMaintenance.switch == 1),$('.GD-button'));

                    }

                    //设备故障报警占比
                    if(result1.faultAlarmDev){

                        //工单响应
                        if(result1.faultAlarmDev.responseGD){

                            var response = $('.responseGD1').children('li');

                            var obj = result1.perationMaintenance.responseGD;

                            //运行中
                            response.eq(0).children('input').val(obj.running);

                            //派单中
                            response.eq(1).children('input').val(obj.dispatch);

                            //已完成
                            response.eq(2).children('input').val(obj.complete);

                        }

                        //工单分布
                        if(result1.faultAlarmDev.distributionGD){

                            var distribution = $('.distributionGD2').children('li');

                            var obj = result1.perationMaintenance.distributionGD;

                            //暖通系统
                            distribution.eq(0).children('input').val(obj.hvacAirsOBJ);

                            //照明系统
                            distribution.eq(1).children('input').val(obj.lightSysOBJ);

                            //电梯系统
                            distribution.eq(2).children('input').val(obj.elevatorSysOBJ);

                            //动环系统
                            distribution.eq(3).children('input').val(obj.rotaryFaceSysOBJ);

                            var distribution1 = $('.distributionGD3').children('li');

                            //给排水
                            distribution1.eq(0).children('input').val(obj.sendDrainWaterOBJ);

                            //消防系统
                            distribution1.eq(1).children('input').val(obj.fireControlSysOBJ);

                            //自动售检票系统
                            distribution1.eq(2).children('input').val(obj.sellCheckTicketOBJ);

                            //能源管理
                            distribution1.eq(3).children('input').val(obj.energyManagerOBJ);

                        }

                        //工单量
                        $('.numberGD1').val(result1.faultAlarmDev.numberGD);

                        //开关
                        switchStatus((result1.faultAlarmDev.switch == 1),$('.fault-button'));

                    }

                    //节能减排
                    var conservation = $('.energyConservation').children('li');

                    if(result1.energyConservation){

                        var obj = result1.energyConservation;

                        //累计节电量
                        conservation.eq(0).children('input').val(obj.electricSave);

                        //累计节水量
                        conservation.eq(2).children('input').val(obj.waterSave);

                        //累计节气量
                        conservation.eq(4).children('input').val(obj.steamSave);

                        //累计减排量
                        conservation.eq(6).children('input').val(obj.emissionReduction);

                        //开关
                        switchStatus((result1.energyConservation.switch == 1),$('.energy1-button'));

                    }

                }


            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求超时', '');

                }else{

                    _moTaiKuang($('#tip-Modal'), '提示', 'flag', 'istap' ,'请求失败', '');

                }

            }

        })

    }

    //开关状态判断
    function switchStatus(expression,el){

        if(expression){

            el.removeClass('button-off').addClass('button-on');

        }else{

            el.removeClass('button-on').addClass('button-off');

        }

    }
})