/**
 * Created by admin on 2018/9/16.
 * 公共函数
 */
/*---------------------------数据验证-----------------------------------*/

//正则表达式变量统一定义
//正整数验证规则，允许包含0
var positiveInt="^[1-9]\d*|0$";


//Jquery Validate表单验证，验证不通过返回False
function formValidate(formOBJ){
    var flag= formOBJ.valid();
    return flag;
}

/*-----------------------------数据格式化--------------------------*/
//重写toFixed方法，让数字进行四舍五入后也能返回数字



/*--------------------------模态框设置--------------------------*/
//控制模态框的设置:用不到的参数一定要传'',modalOBJ模态框对象;出title模态框标题；
// isShowPrimarybtn是否显示btn-primary样式按钮，True表示显示,buttonName为要显示的内容;False表示隐藏btn-primary样式按钮
//isShowBody是否修改主体内容，True要修改，bodyContent为具体显示的主体内容，False表示内容不变。
function modalShowSetting(modalOBJ, title, isShowPrimaryBtn,buttonName, isShowBody ,bodyContent) {
    modalOBJ.modal({
        show: false,//当初始化时显示模态框。
        backdrop: 'static'//指定一个静态的背景，当用户点击模态框外部时不会关闭模态框
    })
    modalOBJ.find('.modal-title').html(title);
    modalOBJ.modal('show');//手动打开模态框
  /* var markHeight = document.documentElement.clientHeight;
    var markBlockHeight = modalOBJ.find('.modal-dialog').height();
    var markBlockTop = (markHeight - markBlockHeight) / 2;

    console.log(markHeight+","+markBlockHeight+","+markBlockTop);

    modalOBJ.find('.modal-dialog').css({'margin-top': markBlockTop});*/
    if (!isShowPrimaryBtn) {
        modalOBJ.find('.btn-primary').hide();
    } else {
        modalOBJ.find('.btn-primary').show();
        modalOBJ.find('.modal-footer').children('.btn-primary').html(buttonName);
    }
    if(isShowBody){
        modalOBJ.find('.modal-body').html(bodyContent);
    }
}

/*------------------------表格公共方法------------------------------*/
//datatables表格赋值
//datatableOBJ表格对象，dataArr赋值数组
function createTablesData(tableOBJ,dataArr) {
    var table = tableOBJ.dataTable();
    if (dataArr.length == 0) {
        table.fnClearTable();
        table.fnDraw();
    } else {
        table.fnClearTable();
        table.fnAddData(dataArr);
        table.fnDraw();
    }
};

/*--------------------------ZTree公共方法-----------------------------*/

//生成Ztree配置,只方法只支持 简单数据模式，即enable为true,所以传过来的数据需要已经转换好
//ztreeOBJ表示Ztree对象
//sourceData数据源
//isShowchk是否显示单选框或复选框，True表示显示，False表示不显示
//createChkStyle是单选框还是复选框，checkbox表示选框，radio表示单选框
function initZtreeData(ztreeOBJ, sourceData, isShowchk, createChkStyle){
    var selectNodefocus="."+createChkStyle+"_true_full_focus";
    var setting = {
        check: {
            enable: isShowchk,
            chkStyle:createChkStyle,
            radioType: "all",
        },
        data: {
            key: {
                title: "title"
            },
            simpleData: {
                enable: true,
            }
        },
        view: {
            showIcon: false
        },
        callback: {
            onClick:function (event,treeId,treeNode){
                treeOBJ.checkNode(treeNode,!treeNode.checked,true);

                //如果该树还有支路数据需要进行楼宇和支路的联动，可以进入如下步骤：
                if($("#allBranch").length>0 && treeId!='allBranch'){
                   //console.log(treeOBJ.getCheckedNodes());
                    initBranchZtreeData(treeOBJ);
                }
            },
            beforeClick:function(treeId,treeNode){
               $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');
            },
            beforeCheck:function(treeId,treeNode){

               // treeOBJ.checkNode(treeNode,!treeNode.checked,false);
                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');
               // if(treeNode.checked==true){ }
               //return false;
            },
            onCheck:function(event,treeId,treeNode){

                $('#' + treeId).find(selectNodefocus).next('a').addClass('curSelectedNode');

                //如果该树还有支路数据需要进行楼宇和支路的联动，可以进入如下步骤：
                if($("#allBranch").length>0 && treeId!='allBranch'){
                    //console.log(treeOBJ.getCheckedNodes());
                    initBranchZtreeData(treeOBJ);
                }
            }
        }
    };

    ////判断是单选框还是复选框
    //if(createChkStyle !=""){
    //    setting.check.chkStyle = 'checkbox';
    //}
    treeOBJ = $.fn.zTree.init(ztreeOBJ, setting, sourceData);
};



/*--------------------------------日期设置------------------------------*/

//初始化天日期选择控件
function initDayCalendar (sourceOBJ){
    sourceOBJ.datetimepicker('remove');//移除日期时间选择器。同时移除已经绑定的event、内部绑定的对象和HTML元素。
    sourceOBJ.datetimepicker({
        format: 'yyyy-mm-dd',  //显示格式可为yyyymm/yyyy-mm-dd/yyyy.mm.dd
        weekStart: 1,  	//0-周日,6-周六 。默认为0
        autoclose: true,
        startView: 2,  	//打开时显示的视图。0-'hour' 1-'day' 2-'month' 3-'year' 4-'decade'
        minView: 3,  	//最小时间视图。默认0-'hour'
// 	maxView: 4, 	//最大时间视图。默认4-'decade'
// 	todayBtn:true, 	//true时"今天"按钮仅仅将视图转到当天的日期。如果是'linked'，当天日期将会被选中。
// 	todayHighlight:true,	//默认值: false,如果为true, 高亮当前日期。
        initialDate: new Date(),	//初始化日期.默认new Date()当前日期,当前日期是弹窗展示的初始日期
        forceParse: true,  	//当输入非格式化日期时，强制格式化。默认true
        bootcssVer:3,	//显示向左向右的箭头
        language: 'zh-CN' //语言
    });
}

//初始化月日期选择控件
function initMonthCalendar (sourceOBJ){
    sourceOBJ.datetimepicker('remove');//移除日期时间选择器。同时移除已经绑定的event、内部绑定的对象和HTML元素。
    sourceOBJ.datetimepicker({
        format: 'yyyy-mm',  //显示格式可为yyyymm/yyyy-mm-dd/yyyy.mm.dd
        weekStart: 1,  	//0-周日,6-周六 。默认为0
        autoclose: true,
        startView: 3,  	//打开时显示的视图。0-'hour' 1-'day' 2-'month' 3-'year' 4-'decade十年，选年'
        minView: 3,  	//最小时间视图。默认0-'hour'
// 	maxView: 4, 	//最大时间视图。默认4-'decade'
// 	todayBtn:true, 	//true时"今天"按钮仅仅将视图转到当天的日期。如果是'linked'，当天日期将会被选中。
// 	todayHighlight:true,	//默认值: false,如果为true, 高亮当前日期。
        initialDate: new Date(),	//初始化日期.默认new Date()当前日期,当前日期是弹窗展示的初始日期
        forceParse: true,  	//当输入非格式化日期时，强制格式化。默认true
        bootcssVer:3,	//显示向左向右的箭头
        language: 'zh-CN' //语言
    });
}

//初始化年日期选择控件
function initYearCalendar (sourceOBJ){
    sourceOBJ.datetimepicker('remove');//移除日期时间选择器。同时移除已经绑定的event、内部绑定的对象和HTML元素。
    sourceOBJ.datetimepicker({
        format: 'yyyy',  //显示格式可为yyyymm/yyyy-mm-dd/yyyy.mm.dd
        weekStart: 1,  	//0-周日,6-周六 。默认为0
        autoclose: true,
        startView: 4,  	//打开时显示的视图。0-'hour' 1-'day' 2-'month' 3-'year' 4-'decade'
        minView: 4,  	//最小时间视图。默认0-'hour'
// 	maxView: 4, 	//最大时间视图。默认4-'decade'
// 	todayBtn:true, 	//true时"今天"按钮仅仅将视图转到当天的日期。如果是'linked'，当天日期将会被选中。
// 	todayHighlight:true,	//默认值: false,如果为true, 高亮当前日期。
        initialDate: new Date(),	//初始化日期.默认new Date()当前日期,当前日期是弹窗展示的初始日期
        forceParse: true,  	//当输入非格式化日期时，强制格式化。默认true
        bootcssVer:3,	//显示向左向右的箭头
        language: 'zh-CN' //语言
    });
}

/**---------------------业务相关公共方法--------------------------------------*/
//加载支路数据
function  initBranchZtreeData(pointerZtree){
    var selectPointerIDs=  getSelectPointerID(pointerZtree);
    var url='http://localhost/BEEWebAPI/api/BranchV2/GetAllBranches';
    var parm={
        "pointerIds":selectPointerIDs,
        "serviceType":$(".main_left_energyType li.selectItem").attr("energyType"),
        "isShowTree":1,
    }
    $.ajax({
        type:"post",
        url:url,
        data:parm,
        success:function(result){
           var treeData= branchToZtreeData(result)
            initPointerToBranchZtreeData($("#allBranch"),treeData,true,"radio");
            fuzzySearch('allBranch','#ztreeBranchKey',null,true,'#ztreeBranchResult'); //初始化模糊搜索方法
        }
    });
}

//将获取到的支路数据转换成树使用的数据
function branchToZtreeData(sourceData){
    var treeData=[];
    var isFirstChecked=false;
    var isChecked=false;
    for(var index in sourceData){//遍历楼宇
        if(index==0){
            treeData.push({//type为0表示楼宇
                id:  sourceData[index].pointerID, pId:'0', name:sourceData[index].pointerName ,
                title: sourceData[index].pointerName ,type:0,open:true,checked:false
            });
        }else{
            treeData.push({
                id:  sourceData[index].pointerID, pId:'0', name:sourceData[index].pointerName,
                title: sourceData[index].pointerName,type:0,open:false,checked:false
            });
        }
        var branchDatas=sourceData[index].branchModelV2s;

        for(var branchIndex in branchDatas ) {//遍历支路
            if(branchIndex==0 && isFirstChecked==false){
                isChecked=true;
                isFirstChecked=true;
            }else{
                isChecked=false;
            }

            var parentId = branchDatas[branchIndex].f_ParentId;
            if (parentId == '0') {
                parentId = sourceData[index].pointerID;
            }
            treeData.push({//type为1表示支路
                id: branchDatas[branchIndex].f_ServiceId, pId: parentId,
                name: branchDatas[branchIndex].f_ServiceName,
                title: branchDatas[branchIndex].f_ServiceName, type: 0, open: false, checked: isChecked
            });

        }
    }
    return treeData;
}

//获取选中的楼宇数据节点
function getSelectPointerID(zTreePointerOBJ){

    //var treeObj = $.fn.zTree.getZTreeObj("tree");
    var selectPointerIDs=[];
    var selectNodes= zTreePointerOBJ.getCheckedNodes();//获取选中的TreeNode节点

    console.log(selectNodes);
    for(var index in selectNodes){
        if(selectNodes[index].type==0)//区域
        {
            // console.log(selectNodes[index].children);
            $(selectNodes[index].children).each(function(index,nodeItem){//企业
                $( nodeItem.children).each(function (index,nodeItem){//楼宇
                    selectPointerIDs.push(nodeItem.id);
                });
            });
        }else if(selectNodes[index].type==1)//企业
        {
            $( selectNodes[index].children).each(function (index,nodeItem){//楼宇
                selectPointerIDs.push(nodeItem.id);
            });
        }else if(selectNodes[index].type==2)//楼宇
        {
            selectPointerIDs.push(selectNodes[index].id);
        }
    }
    return selectPointerIDs;
}


//生成支路版Ztree配置,只方法只支持 简单数据模式，即enable为true,所以传过来的数据需要已经转换好
//ztreeOBJ表示Ztree对象
//sourceData数据源
//isShowchk是否显示单选框或复选框，True表示显示，False表示不显示
//createChkStyle是单选框还是复选框，checkbox表示选框，radio表示单选框
function initPointerToBranchZtreeData(ztreeOBJ, sourceData, isShowchk, createChkStyle){
    var selectNodefocus="."+createChkStyle+"_true_full_focus";
    var setting = {
        check: {
            enable: isShowchk,
            chkStyle:createChkStyle,
            radioType: "all",
        },
        data: {
            key: {
                title: "title"
            },
            simpleData: {
                enable: true,
            }
        },
        view: {
            showIcon: false
        },
        callback: {
            onClick:function (event,treeId,treeNode){
                branchTreeOBJ.checkNode(treeNode,!treeNode.checked,false);
            },
            beforeClick:function(treeId,treeNode){
                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');
            },
            beforeCheck:function(treeId,treeNode){

                // treeOBJ.checkNode(treeNode,!treeNode.checked,false);
                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');
                // if(treeNode.checked==true){ }
                //return false;
            },
            onCheck:function(event,treeId,treeNode){

                $('#' + treeId).find(selectNodefocus).next('a').addClass('curSelectedNode');
            }
        }
    };

    ////判断是单选框还是复选框
    //if(createChkStyle !=""){
    //    setting.check.chkStyle = 'checkbox';
    //}
    branchTreeOBJ = $.fn.zTree.init(ztreeOBJ, setting, sourceData);
};

//生成分户版Ztree配置,只方法只支持 简单数据模式，即enable为true,所以传过来的数据需要已经转换好
//ztreeOBJ表示Ztree对象
//sourceData数据源
//isShowchk是否显示单选框或复选框，True表示显示，False表示不显示
//createChkStyle是单选框还是复选框，checkbox表示选框，radio表示单选框
function initOfficeZtreeCtrlData(ztreeOBJ, sourceData, isShowchk, createChkStyle){
    var selectNodefocus="."+createChkStyle+"_true_full_focus";
    var setting = {
        check: {
            enable: isShowchk,
            chkStyle:createChkStyle,
            radioType: "all",
        },
        data: {
            key: {
                title: "title"
            },
            simpleData: {
                enable: true,
            }
        },
        view: {
            showIcon: false
        },
        callback: {
            onClick:function (event,treeId,treeNode){
                officeTreeOBJ.checkNode(treeNode,!treeNode.checked,true);
            },
            beforeClick:function(treeId,treeNode){
                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');
            },
            beforeCheck:function(treeId,treeNode){
                // treeOBJ.checkNode(treeNode,!treeNode.checked,false);
                $('#' + treeId).find('.curSelectedNode').removeClass('curSelectedNode');
                // if(treeNode.checked==true){ }
                //return false;
            },
            onCheck:function(event,treeId,treeNode){
                $('#' + treeId).find(selectNodefocus).next('a').addClass('curSelectedNode');
            }
        }
    };

    ////判断是单选框还是复选框
    //if(createChkStyle !=""){
    //    setting.check.chkStyle = 'checkbox';
    //}
    officeTreeOBJ = $.fn.zTree.init(ztreeOBJ, setting, sourceData);
};


