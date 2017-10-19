/**
 * Created by admin on 2017/10/16.
 */
var ABC = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

var ABC1 = ['A','B','C','D','E'];
var ABC2 = ['F','G','H','I','J'];
var ABC3 = ['K','L','M','N','O'];
var ABC4 = ['P','Q','R','S','T'];
var ABC5 = ['U','V','W','X','Y','Z'];

//定义要插入的元素
var stationHtml = '<div class="add-input-father" style="margin-left:10px">' +
    '    <div class="add-input-block" style="margin-left:0">' +
    '        <div type="text" class="add-input add-input-select" style="">' +
    '            <span>全部</span>' +
    '            <div class="add-input-arrow"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="add-select-block" style="">' +
    '        <div class="com_hotresults" id="thetable" style="width:440px">' +
    '            <div class="ac_title">' +
    '                <span>请根据拼音首字母进行选择</span>' +
    '                <button>查看全部</button>' +
    '                <a class="ac_close" style="cursor:pointer" title="关闭" onclick=""></a>' +
    '            </div>' +
    '            <ul class="AbcSearch clx" id="abc">' +
    '                <li index="1" method="liHotTab" onclick="" id="nav_list1" class="action">全部</li>' +
    '                <li index="2" method="liHotTab" onclick="" id="nav_list2" class="">ABCDE</li>' +
    '                <li index="3" method="liHotTab" onclick="" id="nav_list3" class="">FGHIJ</li>' +
    '                <li index="4" method="liHotTab" onclick="" id="nav_list4" class="">KLMNO</li>' +
    '                <li index="5" method="liHotTab" onclick="" id="nav_list5" class="">PQRST</li>' +
    '                <li index="6" method="liHotTab" onclick="" id="nav_list6" class="">UVWXYZ</li>' +
    '            </ul>' +
    '            <div id="ul_list2" style="height: 270px; display: block;overflow-y: auto"></div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

function addStationDom(dom){
    dom.after(stationHtml);
    dom.hide();

    $('.add-input-block').on('click',function(){
        $('.add-select-block').toggle();
    });
    $('.AbcSearch').on('click','li',function(){
        $('.AbcSearch li').removeClass('action');
        $(this).addClass('action');
        var index = $(this).index();
        classifyArrByInitial(stationArr,index);
    })

    $('.ac_close').on('click',function(){

        $('.add-select-block').hide();
    });

    $('.ac_title button').on('click',function(){
        $('.add-input-select span').html('全部');
        $('.add-input-select span').attr('values','');
        $('#bumen').val('');
        $('.add-select-block').hide();
        //e.stopPropagation();
    });
}

var ABCArr = [ABC,ABC1,ABC2,ABC3,ABC4,ABC5];

//获得用户名
var _userIdName = sessionStorage.getItem('userName');
//获取本地url
var _urls = sessionStorage.getItem("apiUrlPrefixYW");


ajaxFun();
 stationArr = [];

function ajaxFun(){
    var prm = {
        'userID':_userIdName,
        'ddName':''
    }
    $.ajax({
        type:'post',
        url:_urls + 'YWDev/ywDMGetDDs',
        data:prm,
        success:function(result){
            //给select赋值
            //console.log(result);

            $(result).each(function(i,o){

                stationArr.push(o);
            });
            classifyArrByInitial(result,0);
        }
    })
}

//根据首字母对数组分类
function classifyArrByInitial(arr,num){
//			新建存放根据首字母分类后数据的数组
    var classifyArr = [];
    var curArr = ABCArr[num];
    //新建存放拼接好的字符串的数组
    var showString = '';

    $(curArr).each(function(i,o){

        var obj = {};
        obj.key = o;
        obj.value = [];
        classifyArr.push(obj);
    });

    $(arr).each(function(i,o){
        //获取首字母
        var initial = o.ddPy.split('')[0];
        //判断当前首字母是否符合要求
        var index = curArr.indexOf(initial);
        if(index != -1){
            classifyArr[index].value.push(o);
        }

    });
//			console.log(classifyArr);

    $(classifyArr).each(function(i,o){
        //获取当年的首字母
        var initial = o.key;
        var dataArr = o.value;
        if(dataArr.length == 0){
            return true;
        }

        //console.log(dataArr);
        //根据拼音顺序对车站进行排序
        dataArr.sort(function(a,b){
            if(b.ddPy > a.ddPy){
                return -1
            }else{
                return 1
            }

        });

        showString += '<ul class="popcitylist" style="overflow: auto; max-height: 260px; ">';
        showString += '<li class="ac_letter">'+initial+'</li>';

        $(dataArr).each(function(i,o){
            showString += '<li class="ac_even openLi" values="'+ o.ddNum+'" title="'+o.ddName+'" data="'+ o.ddPy+'">' +o.ddName+'</li>';
            if(i == dataArr.length -1){
                showString += '</ul>'
            }
        });

    });

    $('#ul_list2').html(showString);
//			console.log(showString);

    $('.ac_even').off('click');
    $('.ac_even').on('click',function(){
        $('.add-input-select span').html($(this).html());
        $('.add-input-select span').attr('values',$(this).attr('values'));
        $('#bumen').val($(this).attr('values'));
        //console.log($(this).attr('values'));
        //console.log($(this));
        $('.add-select-block').hide();

    })

}

