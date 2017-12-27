/**
 * Created by admin on 2017/5/8.
 */
$(document).ready(function(){


    //console.log(dataArr);
    //初始化页面table表单
    //console.log(dataArr1);

    var table = $('#dateTables').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging": true,
        "ordering": false,
        'searching': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页  总记录数为 _TOTAL_ 条',
            "sInfoEmpty": "记录数为0",
            "sInfoFiltered": "(全部记录数 _MAX_ 条)",
            'paginate': {
                'first': '第一页',
                'last': '最后一页',
                'next': '下一页',
                'previous': '上一页'
            },
            'infoEmpty': ''
        },
        'buttons': [],
        "dom": 'B<"clear">lfrtip',
        //数据源
        'columns': [
            {
                title: '计量设备类型',
                data: 'f_MeterTypeName',
                class: 'theHidden'

            },
            {
                title: '抄表数据ID',
                data: 'pK_MTRead',
                class: 'theHidden'
            },
            {
                title: '能耗类型',
                data: 'f_mtEnergyType',
                render: function (data, type, full, meta) {
                    return getEnergyType(data);
                },
                class: 'theHidden'

            },
            {
                title: '表号（代号）',
                data: 'f_mtNumber',
                class: 'theHidden'

            },
            {
                title: '二级单位',
                data: 'f_UnitName',
                class: 'theHidden'

            },
            {
                title: '抄表周期名称',
                data: 'f_CycleName',

            },
            {
                title: '抄表月份',
                data: 'f_ReadCycleST',

            },
            {
                title: '绑定楼宇',
                data: 'pointerName',
                class: 'theHidden'

            },
            {
                title: '计量区域',
                data: 'f_MeasureArea',
                class: 'theHidden'

            },
            {
                title: '安装位置',
                data: 'f_InstalPosition',
                class: 'theHidden'

            },
            {
                title: '抄表起始日期',
                data: 'f_ReadST'

            },
            {
                title: '抄表结束日期',
                data: 'f_ReadET'

            },
            {
                title: '抄表起数',
                data: 'f_ReadStartNum'

            },
            {
                title: '抄表止数',
                data: 'f_ReadEndNum'

            },

            {
                title: '倍率',
                data: 'f_Rate'

            },
            {
                title: '圈数',
                data: 'f_CycleNum'

            },
            {
                title: '用能量',
                data: 'f_EnergyValue'

            },
            {
                title: '抄表人',
                data: 'f_ReadPerson'

            },
            {
                title: '是否结算',
                data: 'f_IsClearing',
                render: function (data, type, full, meta) {
                    if (data == 0) {
                        return '未结算'
                    } else {
                        return '已结算'
                    }
                    ;
                }

            }
        ]
    });

    _table = $('#dateTables').dataTable();

    //给表格添加后台获取到的数据
    setData();
    hiddrenId();

    var table1 = $('#dateTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "ordering": false,
        'searching':false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
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
                title:'计量设备类型',
                data:'f_MeterTypeName'

            },
            {
                title:'抄表数据ID',
                data:'pK_MTRead',
                class:'theHidden'
            },
            {
                title:'能耗类型',
                data:'f_mtEnergyType',
                render:function(data, type, full, meta){
                    return getEnergyType(data);
                }

            },
            {
                title:'表号（代号）',
                data:'f_mtNumber'

            },
            {
                title:'二级单位',
                data:'f_UnitName'

            },
            {
                title:'抄表周期名称',
                data:'f_CycleName',
                class:'theHidden'

            },
            {
                title:'抄表月份',
                data:'f_ReadCycleST',
                class:'theHidden',
                render:function(data, type, full, meta){
                    if(data){
                        var txt1 = data.split(' ')[0].split('/')[0];
                        var txt2 = data.split(' ')[0].split('/')[1];
                        return txt1 + "-" + txt2;
                    }else{
                        return '';
                    }

                }

            },
            {
                title:'绑定楼宇',
                data:'pointerName'

            },
            {
                title:'计量区域',
                data:'f_MeasureArea'

            },
            {
                title:'安装位置',
                data:'f_InstalPosition'

            }
        ]
    });

    _table = $('#dateTables1').dataTable();


    //给表格添加后台获取到的数据
    setDatas(dataArr1);
    hiddrenId();

    //点击左侧仪表，对其数据进行展示

    $('.ztree li ul li .level1').on('click',function(){

        $('.ztree font').removeClass('onClicks');


        var id = $(this).find('.treeFont').attr('ids');

        $(this).find('.treeFont').addClass('onClicks');

        isShow = $('.onClicks').attr('isshare');

        console.log(isShow);

        if(isShow == 0){
            $('.add-btn').css({
                display:'none'
            })
        }else if(isShow == 1){
            $('.add-btn').css({
                display:'inline-block'
            })
        }

        startID = id;
        console.log(startID);


        _table = $('#dateTables').dataTable();
        //给表格添加后台获取到的数据
        ajaxSuccess();

        _table = $('#dateTables1').dataTable();
        _table.fnClearTable();

        //给表格添加后台获取到的数据
        setDatas(dataArr1);
        hiddrenId();


    });

    //更改公摊比例

    var table2 = $('#dateTables2').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        //是否分页
        "destroy": false,//还原初始化了的datatable
        "paging":false,
        "ordering": false,
        'searching':false,
        "sScrollY": '210px',
        "bPaginate": false,
        "scrollCollapse": true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 件',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'search':'搜索:',
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
                title:'二级单位',
                data:'f_UnitName'

            },
            {
                title:'本行ID',
                data:'pK_UnitMeter',
                class:'theHidden'

            },

            {
                title:'建档日期',
                data:'f_FilingDT'

            },

            {
                title:'建档起数',
                data:'f_FilingNumber'
            },
            {
                title:'<img src="img/asterisk.png"/>公摊比例(%)',
                data:'f_EquallyShared',
                render:function(data, type, row, meta){
                    return '<input class="wait-change0" style="width:90px;border-radius:5px;" value="'+data * 100+'" >'
                }

            },
            {
                title:'变更原因',
                "targets": -1,
                "data": null,
                "class":'theReson',
                "defaultContent": '<textarea class="wait-change1" name="yj" txt="注销原因" cols="35" rows="2" style="resize:none;" class="wait-push4 wait-push" maxlength="60">'
            }
        ]
    });

    $('.add-btn').on('click',function(){

        $('#change-meter').modal('show');

        getShareMessage();

        console.log(shareObj);

        //弹窗中显示具体数据

        $('#change-meter').find('.ament-data').eq(0).find('span').html(shareObj.f_mtNumber);

        $('#change-meter').find('.ament-data').eq(1).find('span').html(shareObj.f_MeasureArea);

        $('#change-meter').find('.ament-data').eq(2).find('span').html(getEnergyType(shareObj.f_mtEnergyType));

        $('#change-meter').find('.ament-data').eq(3).find('span').html(getMtonline(shareObj.f_mtNumber));

        $('#change-meter').find('.add-input').eq(0).val(shareObj.f_ReadET);

        $('#change-meter').find('.add-input').eq(1).val(shareObj.f_ReadEndNum);

        if(shareObj.f_mtOnline == 1){

            $('#change-meter').find('.add-input').eq(2).val(shareObj.meterEndDate);

            $('#change-meter').find('.add-input').eq(3).val(shareObj.meterEndNumber);
        }



        $('#change-meter').find('.add-input').eq(4).val(shareObj.f_CycleNum);

        $('#change-meter').find('.add-input').eq(5).val(shareObj.f_ReadPerson);

        var range = shareObj.f_Range;

        $('#change-meter .cycle-number').attr('range',range);

        setTimeout(function(){

            _table = $('#dateTables2').dataTable();

            tableArr = shareObj.unitEquallyShareds;
            //给表格添加后台获取到的数据
            _table.fnClearTable();
            setDatas(tableArr);
            hiddrenId();

            tableChanges();
        },270);

        //提交操作时
        $('#change-meter .btn-primary').off('click');

        $('#change-meter .btn-primary').on('click',function(){

            //检验是否填写正确
            if(!checkedNull('#change-meter') || !checkedNumber('#change-meter') || !checkedCycle('#change-meter') || !CompareDate('#change-meter') || !checkedEndNum1('#change-meter') || !checkedShareNum('#change-meter')){
                return false;
            };


            shareObj.meterEndDate = $('#change-meter').find('.add-input').eq(2).val();

            shareObj.meterEndNumber = $('#change-meter').find('.add-input').eq(3).val();

            shareObj.f_CycleNum = $('#change-meter').find('.add-input').eq(4).val();

            shareObj.f_ReadPerson = $('#change-meter').find('.add-input').eq(5).val();

            shareObj.unitEquallyShareds = tableArr;

            shareObj.userID = userName;

            console.log(shareObj);

            $.ajax({
                type: 'post',
                url: IP + "/UnitMeter/PostMeterUnitEquallyShared",
                async: false,
                timeout: theTimes,
                data:shareObj,
                beforeSend: function () {

                },

                complete: function () {

                },
                success: function (data) {
                    $('#theLoading').modal('hide');
                    console.log(data);

                    if(data.validateNumber == 1){
                        myAlter('参数错误，请联系管理员');
                        return false;
                    }
                    if(data.validateNumber == 3){
                        myAlter('执行失败，请联系管理员');
                        return false;
                    }
                    if(data.validateNumber == 14){
                        myAlter('公摊比例总和超过1');
                        return false;
                    }

                    $('#change-meter').modal('hide');

                    if(data.validateNumber == 5){

                        var html = '';
                        for(var i=0; i<data.f_mtNumberInfos.length; i++){
                            if(i == data.f_mtNumberInfos.length-1){
                                html +='<span style="font-weight: 400">'+data.f_mtNumberInfos[i].key + ' : ' +data.f_mtNumberInfos[i].valueStr + '。</span>'
                            }else{
                                html += '<span style="font-weight: 400">'+data.f_mtNumberInfos[i].key + ' : ' +data.f_mtNumberInfos[i].valueStr + '，</span><br />'
                            }

                        }
                        theHint = html;
                        myAlter(html);
                    }

                    _table = $('#dateTables').dataTable();
                    //给表格添加后台获取到的数据
                    ajaxSuccess();

                    _table = $('#dateTables1').dataTable();
                    _table.fnClearTable();

                    //给表格添加后台获取到的数据
                    setDatas(dataArr1);
                    hiddrenId();

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#theLoading').modal('hide');
                    console.log(textStatus);
                    $('#change-meter').modal('hide');
                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                        ajaxTimeoutTest.abort();
                        myAlter("超时");
                    }
                    myAlter("请求失败！");
                }
            })
        })



    })
});

//存放仪表ID
var startID;

//存放公摊比例信息
var shareObj = {};
//存放公摊比例列表
var tableArr = [];

var isShow = 0;

dataArr = [];

dataArr1 = [];

//改变公摊比例时
function tableChanges(){

    //改变公摊比例
    $('.wait-change0').on('blur',function(){
        var id = $(this).parents('tr').find('.theHidden').html();
        var txt = $(this).val();

        if(isNaN(txt)){

            return false;
        }else{

            for(var i=0; i<tableArr.length; i++){
                if(id == tableArr[i].pK_UnitMeter){

                    tableArr[i].f_EquallyShared = txt / 100;
                }
            }
        }


    });

    //输入改变原因
    $('.wait-change1').on('blur',function(){
        var id = $(this).parents('tr').find('.theHidden').html();

        var txt = $(this).val();


        for(var i=0; i<tableArr.length; i++){
            if(id == tableArr[i].pK_UnitMeter){

                tableArr[i].f_CancelComment = txt;
            }
        }
    });


};

//获取左侧手工仪表列表
var setting = {
    //check: {
    //    enable: true,
    //    chkStyle: "radio",
    //    chkboxType: { "Y": "s", "N": "ps" }
    //},
    view: {
        nameIsHTML: true,
        showTitle :false
    },
    data: {
        simpleData: {
            enable: true
        }
    }

};
var zNodes =[

];

//得到左侧树状图的数据
function getBuildTree(){
    $.ajax({
        type: 'get',
        url: IP + "/UnitMeter/GetAllPointerAndMeterView",
        async: false,
        timeout: theTimes,
        beforeSend: function () {

        },

        complete: function () {

        },
        success: function (data) {
            console.log(data);

            if(data.length == 0){

                myAlter('无计量设备');

                return false;
            }

            buildArr = data;


            zNodes =[

            ];

            startID = data[0].pointerAndMeterChilds[0].meterID;
            console.log(startID);
            for(var i=1; i<data.length+1; i++){
                var id0 = data[i-1].pointerID;
                var name0 = data[i-1].pointerName;
                var name00 = "<font ids='"+id0+"'>"+ name0+"</font>";
                var meterArr = data[i-1].pointerAndMeterChilds;
                var obj = {id:i, pId:0, name:name00, open:true, iconOpen:"img/1_open.png",iconClose:"img/1_close.png"};
                zNodes.push(obj);


                for(var j=1; j<meterArr.length+1; j++){
                    var name1 = meterArr[j-1].f_mtNumber;
                    var id11 = meterArr[j-1].meterID;
                    //获取子账户类型
                    var state = meterArr[j-1].childAccounts;

                    var type = '';

                    var isShare = 0;

                    $(state).each(function(i,o){

                        if(o == 2){
                            isShare = 1;
                        }
                        var sign = getChildState(o);
                        if(i == state.length - 1){
                            type += sign;
                        }else{
                            type += sign + ','
                        }


                    });

                    var names;

                    if(isShare == 0){
                        names = "<font color='#307f7a' isShare = '0' class='treeFont' ids='"+id11+"'>"+ name1+" ("+type+")</font>";
                    }else if(isShare == 1){
                        names = "<font color='#307f7a' isShare = '1' class='treeFont' ids='"+id11+"'>"+ name1+" ("+type+")</font>";
                    }




                    var id1 = i+'' + j + '';
                    var id2 = parseInt(id1);
                    var obj1 =  { id:id2, pId:i, name:names,icon:"css/lib/img/diy/2.png"};

                    zNodes.push(obj1)
                }

            }
            console.log(zNodes);
            $.fn.zTree.init($("#treeMultiple"), setting, zNodes);

            $('.treeFont').eq(0).click();
            $('.treeFont').eq(0).addClass('onClicks');

            isShow = $('.treeFont').eq(0).attr('isshare');

            console.log(isShow);

            if(isShow == 0){
                $('.add-btn').css({
                    display:'none'
                })
            }

            //调用获取后台数据方法，进行数据获取
            alarmHistory();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        }
    })

}

getBuildTree();

//获取后台数据
function alarmHistory(){
    dataArr=[];
    dataArr1 = [];
    console.log(startID);
    $.ajax({
        type:'get',
        url:IP + "/UnitMeter/GetAllReadByMeterID",
        async:false,
        data:{
            meterID:startID
        },
        timeout:theTimes,
        beforeSend:function(){
            $('#theLoading').modal('show');
        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(result){
            $('#theLoading').modal('hide');
            console.log(result);

            for(var i=0;i<result.length;i++){
                dataArr.push(result[i]);
            }

            if(dataArr.length > 0){
                dataArr1.push(dataArr[0]);
            }

        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        },

    });


}

//获取对应仪表中的公摊比例信息
function getShareMessage(){
    shareArr = [];
    console.log(startID);
    $.ajax({
        type:'get',
        url:IP + "/UnitMeter/GetMeterUnitEquallyShared",
        //async:false,
        data:{
            PK_Meter:startID
        },
        timeout:theTimes,
        beforeSend:function(){
            $('#theLoading').modal('show');
        },
        complete:function(){
            $('#theLoading').modal('hide');
        },
        success:function(result){
            $('#theLoading').modal('hide');
            console.log(result);
            shareObj = result;

        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            $('#theLoading').modal('hide');
            console.log(textStatus);

            if(textStatus=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                myAlter("超时");
            }
            myAlter("请求失败！");
        },

    });

}

//搜索功能
//搜索功能
//首先判断搜索框的状态(目的：通过判断是否有empty类来判断input中是否有内容)；
$('#key').bind('blur',blurKey);
$('#key').bind('focus',focusKey);
//input标签内容改变的触发事件(input和propertychange)事件
//　input事件是IE之外的大多数浏览器支持的事件，在value改变时实时触发，但是通过js改变value时不会触发；propertychange事件是任何属性改变都会触发，而input却只在value改变时触发，input要通过addEventListener()来注册，propertychange注册方法与一般事件相同。
$('#key').bind('input',seachNode);
//目的就是判断搜索框内是不是输入了内容
function blurKey(e){
    //如果失去焦点的时候，搜索框没有内容的时候添加empty类
    if($('#key').val()==''){
        $('#key').addClass('empty');
    }  //起了初始化的作用
}
//获得焦点的时候，搜索框移除empty类
function focusKey(e){

    if($('#key')){

        $('#key').removeClass('empty');

    }
}
//模糊搜索
//nodeList存放的是搜索出来的zTree节点；
var nodeList = [];
//目的是为了区分是不是重新输入了搜索关键字，如果一样的话就不变，不一样的话重新构建
var lastValue = '';
function seachNode(e){
    //首先获得要搜索的zTree树
    var zTree = $.fn.zTree.getZTreeObj("treeMultiple");
    //获得input里的输入内容
    //var value = $('#key').val();
    //这里为了更精确，用trim来去掉value的首尾空格
    var value = $.trim($('#key').val());
    var keyType = 'name';
    //判断如果输入框的内容和上次输入的一样，就不执行了，如果不一样再执行
    if (lastValue === value)
        return;
    lastValue = value;
    if (value === "") {
        $('.tip').hide();
        //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
        //获取 zTree 的全部节点数据
        //如果input是空的则显示全部；
        zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;
        return;
    }
    //依据：nodeList = zTree.getNodesByParamFuzzy(keyType,value) ;这是zTree自带的模糊搜索的功能keyType是需要模糊匹配的属性名称，value是需要模糊匹配的属性值
    //根据节点数据的属性搜索，获取条件模糊匹配的节点数据 JSON 对象集合
    nodeList = zTree.getNodesByParamFuzzy(keyType,value);
    //console.log(nodeList); //[onject](父节点，子孙节点都是以属性的形式存在)
    //console.log(nodeList);  输出的是对象
    //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。(免去用户自行编写递归遍历全部节点的麻烦)
    nodeList = zTree.transformToArray(nodeList);
    //console.log(nodeList);//[object,object,object,object,object];
    //只要是nodeList是父元素，子孙元素也是会查找出来的；
    //得到的数组
    if(nodeList.length == 0){
        //显示提示div（抱歉......）
        $('.tip').show();
    }else{
        $('.tip').hide();
    }
    updateNodes();
}
//选中之后更新节点
function updateNodes(){
    //首先选中树
    //获取 id 为 tree 的 zTree 对象
    var zTree = $.fn.zTree.getZTreeObj("treeMultiple");
    //获取 zTree 的全部节点数据
    //console.log(zTree.getNodes());
    var allNode = zTree.transformToArray(zTree.getNodes());
    //console.log(allNode);所有节点不管是父子孙都输出
    //指定被隐藏的节点 JSON 数据集合hideNodes();
    zTree.hideNodes(allNode);
    //zTree都是可以在控制台输出的，只是界面显示不出来
    //zTree.showNodes(nodeList);
    //遍历nodeList第n个nodeList
    for(var n in nodeList){
        findParent(zTree,nodeList[n]);
    }
    zTree.showNodes(nodeList);
}
//整理选出来的节点的关系
function findParent(zTree,node){
    //展开 / 折叠 指定的节点（需要 展开 / 折叠 的节点数据，expandFlag = true表示展开节点，操作是否影响子节点，focus = true 表示 展开 / 折叠 操作后，通过设置焦点保证此焦点进入可视区域内）
    zTree.expandNode(node,true,false,false);
    //pNode父节点getParentNode（）获取 treeNode 节点的父节点。
    var pNode = node.getParentNode();
    //console.log(pNode);//得到搜索节点后的父节点和祖先节点
    if(pNode != null){
        nodeList.push(pNode);
        findParent(zTree,pNode);
    }
}

//选择日期插件
$('.chooseDate').datepicker(
    {
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd'
    }
);

//检验是否必填项全部填写
function checkedNull(dom){
    var checkNum = $(dom).find('.input-label').length;

    for(var i=0; i< checkNum; i++){
        if( $(dom).find('.input-label').eq(i).next().find('input').val() == ''){
            var txt = $(dom).find('.input-label').eq(i).next().find('input').parent().prev().html().split('：')[0];

            console.log(txt);
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.input-label').eq(i).next().find('input'));
            return false;
        };
        if($(dom).find('.input-label').eq(i).next().find('.add-input-select').find('span').html() == ''){
            var txt = $(dom).children('.input-label').eq(i).html().split('：')[0];
            $('#check-text').modal('show');
            myAlter(txt + " 不能为空")
            return false;
        };
        if( $(dom).find('.input-label').eq(i).next().find('textarea').val() == ''){
            var txt = $(dom).find('.input-label').eq(i).next().find('textarea').parent().prev().html().split('：')[0];

            console.log(txt);
            myAlter(txt + " 不能为空")
            getFocus1($(dom).find('.input-label').eq(i).next().find('textarea'));
            return false;
        };
    }
    return true;
}

//检验圈数输入是否正确
function checkedCycle(dom){
    var num = $(dom).find('.read-start').length;

    for(var i=0; i<num; i++){
        var startNum = parseInt($(dom).find('.read-start').eq(i).val());
        var endNum = parseInt($(dom).find('.read-end').eq(i).val());
        var txt = parseInt($(dom).find('.cycle-number').eq(i).val());
        if(txt % 1 !== 0 || txt < 0 ){
            myAlter('圈数输入错误');
            getFocus1($(dom).find('.cycle-number').eq(i));
            return false;
        }else if(endNum < startNum && txt == 0){
            myAlter('止数小于起数，圈数必须大于0');
            $(this).parents('.deploy-form').find('.add-input').eq(4).val('');
            getFocus1($(dom).find('.cycle-number').eq(i));
            return false
        }

    }
    return true;
}

//检验开始结束日期设置是否合理
function CompareDate(dom) {
    var num = $(dom).find('.startDates').length;

    for(var i=0; i<num; i++){
        var d1 = $(dom).find('.startDates').eq(i).val().split(" ")[0].split("/").join('-');
        var d2 = $(dom).find('.endDates').eq(i).val();

        if((new Date(d1.replace(/-/g,"\/"))) < (new Date(d2.replace(/-/g,"\/")))){

        }else{
            myAlter('结束日期必须大于开始日期');
            getFocus1($(dom).find('.endDates').eq(i));
            return false;
        }


    }
    return true;

}

//检验更换仪表中的终止读数
function checkedEndNum1(dom){
    var num1 = $(dom).find('.end-number').val();
    var num2 = $(dom).find('.cycle-number').attr('range');
    if(parseFloat(num1) > parseFloat(num2)){
        myAlter('设备终止读数不能大于量程');
        getFocus1($(dom).find('.end-number'));
        return false
    }
    return true;
}

//检验是否为数字
function checkedNumber(dom){
    var num = $(dom).find('.type-number').length;

    for(var i=0; i<num; i++){
        if($(dom).find('.type-number').eq(i).find('input').val() != ""){
            var txt = $(dom).find('.type-number').eq(i).find('input').val() / 1;

            if(isNaN(txt) || txt < 0 ){
                var txt1 = $(dom).find('.type-number').eq(i).children('label').html().split('：')[0];
                console.log(txt1);
                myAlter(txt1 + " 必须为非负数字")
                getFocus1($(dom).find('.type-number').eq(i).find('input'));
                return false;
            }
        }

    }
    return true;
}

//检验二级单位公摊表中的公摊比例输入
function checkedShareNum(dom){

    var node = $(dom).find('.wait-change0');

    var total = 0;

    console.log(node.length);
   for(var i=0; i<node.length; i++) {

       var share = $(node).eq(i).val();

       if (share == '') {
           myAlter('公摊比例不能为空');
           getFocus1($(node).eq(i));
           return false;
       }

       if (isNaN(share) || share < 0 || share == 0 || share > 100) {
           myAlter('公摊比例必须为大于0小于100的数字');
           getFocus1($(node).eq(i));
           return false;
       }

       total += share;

       if (total > 100) {
           myAlter('公摊比例总和不能大于100%');
           getFocus1($(node).eq(0));
           return false;
       }

   };

    return true;
}

//左侧搜索是否显示
var showNum = 0;
$('.showOrHidden').on('click',function(){

    if(showNum % 2 == 0){
        $('.main-content-left').css({
            display:'none'
        });

        $('.main-content-right').css({
            marginLeft:'0px'
        });
    }else{
        $('.main-content-left').css({
            display:'block'
        });

        $('.main-content-right').css({
            marginLeft:'365px'
        });
    }


    showNum ++;
});