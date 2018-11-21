/**
 * Created by admin on 2018/7/24.
 */

var maptype = {
    '年': 'Year',
    '月': 'Month'
}
var selecttype = 'Month';

//定义表格中人数的标题名称
var tablePeopleTitle = '用能人数';

    //改变时间
$('.user-search .choose-time').on('click',function(){
    $('.user-search .choose-time').removeClass('chooses');
    $(this).addClass('chooses');
    //获取当前日期类型
    var dataType = $(this).html();
    selecttype = maptype[dataType]
    _selectTime(dataType);
});


//获取楼宇下全部区域位置
var getAllPositionType = function(){

    var pointerArr = JSON.parse(sessionStorage.pointers);

    //存放全部单位类型
    var allPositionType = [];

    var _allPositionTypeArr = unique(pointerArr,'districtID');

    $(_allPositionTypeArr).each(function(i,o){

        var obj= {

            districtName: o.districtName,
            districtID: o.districtID
        };

        allPositionType.push(obj);
    });

    return allPositionType;

};

//日历时间
function _selectTime(dataType){

    $('.time-show').hide();

    $('.chooseDate').val('');

    $('.end-time-choose').hide();

    if(dataType == '月'){
        _monthDate($('.chooseDate'));
        //获取上月
        var date = moment().format('YYYY-MM');
        $('.min').val(date);
        $('.max').val(date);
    }else if(dataType == '年'){
        _yearDate($('.chooseDate'));
        //获取上年
        var date = moment().format('YYYY');
        $('.min').val(date);
        $('.max').val(date);
    }
}

//获取能耗
function getEnergyTypes(){

    //获取全部能耗信息
    var allEnergyTypeArr = JSON.parse(sessionStorage.allEnergyType).alltypes;

    var html = "";

    $(allEnergyTypeArr).each(function(i,o){

        if(i == 0){

            html += "<span class='onClick' data-id='"+ o.etid+"'>"+ o.etname+"</span>";
        }else{

            html += "<span class='' data-id='"+ o.etid+"'>"+ o.etname+"</span>";
        }

    });

    $('.right-choose-energy').html(html);
}

//展示日期类型 用户选择日期类型
function getShowDateType(dateType){

    //定义展示日期类型
    var showDateType = '';

    //定义用于选择日期类型
    var selectDateType = '';

    if(!dateType){
        dateType = $('.time-options-1').html();
    }

    if(dateType == '日'){

        showDateType = "Hour";
        selectDateType = "Day"

    }else if(dateType == '周'){

        showDateType = "Day";
        selectDateType = "Week"

    }else if(dateType == '月'){

        showDateType = "Day";
        selectDateType = "Month"

    }else if(dateType == '年'){

        showDateType = "Month";
        selectDateType = "Year"

    }else if(dateType == '自定义'){

        showDateType = "Custom";
        selectDateType = "Custom"
    }

    return [showDateType,selectDateType]
};

//获取开始结束时间
function getPostTime1(dateType){

    //定义开始时间
    var startTime = '';

    if($('.min').length > 0){

        startTime = $('.min').val();

    }
    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = startTime;

        endTime = moment(startTime).add('1','days').format('YYYY/MM/DD');

    }else if(dateType == '周'){

        startTime = startTime;

        endTime = moment(startTime).add('7','days').format('YYYY/MM/DD');

    }else if(dateType == '月'){

        startTime = startTime + '/01';
        endTime = moment(startTime).add('1','months').startOf('month').format('YYYY/MM/DD');

    }else if(dateType == '年'){

        endTime = (parseInt(startTime) + 1) + '/01/01';
        startTime = startTime + '/01/01';

    }else if(dateType == '自定义'){


        startTime = startTime;
        endTime = moment($('.max').val()).add('1','days').format('YYYY/MM/DD');
    }


    return [startTime,endTime]
};

//获取仅选择日月年时的时间
function getPostTime11(dateType){

    //定义开始时间
    var startTime = moment().format('YYYY/MM/DD');

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = startTime;

        endTime = moment(startTime).add('1','days').format('YYYY/MM/DD');

    }else if(dateType == '周'){

        startTime = startTime;

        endTime = moment(startTime).add('7','days').format('YYYY/MM/DD');

    }else if(dateType == '月'){

        startTime = moment(startTime).startOf('month').format('YYYY/MM/DD');

        endTime = moment(startTime).add('1','months').startOf('month').format('YYYY/MM/DD');

    }else if(dateType == '年'){

        endTime = moment(startTime).add('1','years').startOf('year').format('YYYY/MM/DD');

        startTime = moment(startTime).startOf('year').format('YYYY/MM/DD');

    }

    return [startTime,endTime]
};

//获取省级平台楼宇信息 flag 2表示复选框
function GetProvincialEnterpriseTree(flag,fun,dom){

    //console.log(postPointerID);
    $.ajax({
        type:'get',
        url:_urls + 'Provincial/GetProvincialEnterpriseTree',
        async:false,
        data:{
            userID:_userIdNum
        },
        success:function(result){

            //console.log(result);
            getBranchZtree(result.paralProvicncTree,flag,getProvincialZNodes,dom);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    })

};

//获取省级平台zTree树的数据
function getProvincialZNodes(EnItdata){

    var zNodes = new Array();

    var aaa = [];

    var theNum = 0;

    var theNum1= 0;

    $(EnItdata).each(function(i,o){


        var ifOpen = false;

        var ifCheck = false;

        if(o.parentOBJID == 0 && theNum == 0){

            ifOpen = true;

            ifCheck = true;

            theNum ++;

        }else if(o.returnType == 2 && theNum1 == 0){

            ifOpen = true;

            ifCheck = false;

            theNum1 ++;

        }else if(o.returnOBJID == 0){

            ifOpen = true;
        }

        zNodes.push({ id:  o.returnOBJID, pId:o.parentOBJID, name:o.returnOBJName,title: o.returnOBJName,type: o.returnType,open:ifOpen,checked:ifCheck});

    });

    return zNodes;

}

//获取省级平台下的全部单位
function recursion(dataArr,resultArr){

    $(dataArr).each(function(i,o) {

        if(o.type == 2){

            resultArr.push(o.id);
        }

        var childrenArr = o.children;

        if (childrenArr && childrenArr.length > 0) {

            recursion(childrenArr, resultArr);
        }

    })
};

//获取省级平台下的全部单位信息
function recursion1(dataArr,resultArr){

    $(dataArr).each(function(i,o) {

        if(o.type == 2){

            var obj = {

                id : o.id,
                name : o.name
            };

            resultArr.push(obj);
        }

        var childrenArr = o.children;

        if (childrenArr && childrenArr.length > 0) {

            recursion1(childrenArr, resultArr);
        }

    })
};


