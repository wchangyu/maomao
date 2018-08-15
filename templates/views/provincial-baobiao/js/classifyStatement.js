/**
 * Created by admin on 2018/7/19.
 */
$(function(){

    //年份动态计算
    changeSelectYears();

    //获取后台数据
    GetClassifyCollect();

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //改变汇总类型选框
    $('#collect-type').on('change',function(){

        //获取当前类型
        var thisVal = $(this).val();

        var thisArr = [];

        var selectHtml = "";

        //半年报
        if(thisVal == 1){

            thisArr = halfYearMessageArr;

        //季报
        }else if(thisVal == 2){

            thisArr = quarterMessageArr;

        //月报
        }else if(thisVal == 3){

            thisArr = monthMessageArr;


        }

        $(thisArr).each(function(i,o){

            selectHtml += "<option>"+o+"</option>"
        });

        //页面赋值
        $('#choose-type-message').html(selectHtml);

        //年报
        if(thisVal == 0){

            $('#choose-type-message').hide();
        }else{

            $('#choose-type-message').show();
        }


    });

    //点击保存按钮给后台提交数据
    $('.top-sure').on('click',function(){

        PostCollectReportList();

    });

});

//定义半年报汇总信息
var halfYearMessageArr = ['上半年','下半年'];

//定义季报汇总信息
var quarterMessageArr = ['第一季度','第二季度','第三季度','第四季度'];

//定义月报汇总信息
var monthMessageArr = ['1','2','3','4','5','6','7','8','9','10','11','12'];

//传递给后台的方式
var ajaxType1 = 'post';

var ajaxType2 = 'get';

//存储的后台数据
var getMessage;

//存储当前数据
var thisMessage = [];

//获取后台数据
function GetClassifyCollect(){

    var id = window.location.href.split('id=')[1];

    if(!id){

        id = 0;
    }

    //传递给后台的数据
    var prm = {

        PK :id
    };

    var url = 'ProvincialReport/GetClassifyCollect';

    //定义传递给后台的回调函数
    var successFun = function (result){

        console.log(result);

        getMessage = result;

        //对数据进行深拷贝
        deepCopy(result.collectContents,thisMessage);


        //拼接页面中的字符串
        var tableHtml = "";

        //综合机构名称
        $('.organization-name').val(result.f_DepartName);

        //电话号码
        $('.phone-number').val(result.f_Phone);

        //单位负责人
        $('.unitPrincipal').val(result.unitPrincipal);

        //填表人
        $('.preparer').val(result.preparer);

        //填报日期
        $('.selectDate').val(result.selectDate.split(" ")[0]);

        $(result.collectContents).each(function(i,o) {

            //指标名称
            var normName = o.normName;

            //计量单位
            var measureUnit = o.measureUnit;

            //代码
            var code = o.code;

            //合计
            var f_Total = o.f_Total;

            //国家机关
            var f_Country = o.f_Country;

            //事业单位小计
            var f_Subtotal = o.f_Subtotal;

            //事业单位教育
            var f_Education = o.f_Education;

            //事业单位科技
            var f_Technology = o.f_Technology;

            //事业单位文化
            var f_Culture = o.f_Culture;

            //事业单位卫生
            var f_Sanitation = o.f_Sanitation;

            //事业单位体育
            var f_Physical = o.f_Physical;

            //事业单位其他
            var f_Other = o.f_Other;

            //团体组织
            var f_Group = o.f_Group;

            //当前索引
            var f_Order = o.f_Order;

            tableHtml += "<tr>"+

                           "<td style='text-align: center;border:1px solid black;' class='fitst-td' data-id='"+f_Order+"'>"+normName+"</td>"+

                            "<td style='text-align: center;border:1px solid black;' data-name=''>"+measureUnit+"</td>"+

                            "<td style='text-align: center;border:1px solid black;'>"+code+"</td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Total' value='"+f_Total+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Country' value='"+f_Country+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Subtotal'  value='"+f_Subtotal+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Education'  value='"+f_Education+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Technology'  value='"+f_Technology+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Culture'  value='"+f_Culture+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Sanitation'  value='"+f_Sanitation+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Physical'  value='"+f_Physical+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Other'  value='"+f_Other+"'/></td>"+

                            "<td style='text-align: center;border:1px solid black;'><input type='text' class='td-input' data-name='f_Group' value='"+f_Group+"'/></td>";
        });


        //页面赋值
        $('#entry-datatables tbody').html(tableHtml);

        //记录用户数据的数据
        changeData();

    };

    //调用数据
    _mainAjaxFun(ajaxType2,url,prm,successFun);
}

//给后台提交数据
function PostCollectReportList(){

    var id = window.location.href.split('id=')[1];

    if(!id){

        id = 0;
    }


    //检查数据
    examineData();

    if(!examineData()){

        return false;

    };

    var url = 'ProvincialReport/PostCollectReportList';

    //传递给后台的数据
    var prm = getMessage;

    prm.userID = _userIdNum;

    //年份
    prm.f_YearDT = $('#years').val();

    //年份标识
    prm.f_YearFlag = $('#collect-type').val();

    //部门名称
    var f_DepartName = $('.organization-name').val();

    prm.f_DepartName = f_DepartName;

    //部门电话
    var f_Phone = $('.phone-number').val();

    prm.f_Phone = f_Phone;

    //单位负责人
    prm.unitPrincipal = $('.unitPrincipal').val();

    //填表人
    prm.preparer =$('.preparer').val();

    //填报日期
    prm.selectDate =$('.selectDate').val();

    prm.collectContents = thisMessage;

    if(id != 0){

        prm.pK_ClassifyCollect = id;
    }
    //console.log(prm.collectContents);

    //定义传递给后台的回调函数
    var successFun = function (result){

        console.log(result);

        //拼接页面中的字符串
        var tableHtml = "";

    };

    //调用数据
    _mainAjaxFun(ajaxType1,url,prm,successFun);

}


//页面select年份动态计算
function changeSelectYears(){

    //获取当前年份
    var curYear = parseInt(moment().format('YYYY'));

    //定义给页面select中赋值的字符串
    var yearHtml = "";

    for(var i=0; i<5; i++){

        var year = curYear - i;

        yearHtml += "<option>"+year+"</option>";

    }

    $('#years').html(yearHtml);

}

//记录用户数据的数据
function changeData(){

    //用户输入数据时
    $('.td-input').on('blur',function(){

        var id = $(this).parents('tr').find('.fitst-td').attr('data-id');

        //获取当前属性名称
        var name = $(this).attr('data-name');

        var dom = $(this);

        $(thisMessage).each(function(i,o){
            //
            if(id == o.f_Order){


                o[name] = dom.val();

                return false;
            }

        });


    });
}

//判断页面中数据是否符合规范
function examineData(){

    var length = $('.td-input').length;

    for(var i=0; i<length; i++){

        var dom = $('.td-input').eq(i);

        //获取当前数据
        var thisVal = dom.val();

        if(thisVal != ""){

            //console.log(isNaN(thisVal));

            //如果输入的不是数字
            if(isNaN(thisVal)){
                console.log(thisVal)

                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请输入正确数据', '');

                getFocus1(dom);

                return false;
            }
        }
    }

    return true;
}

//关闭提示弹窗后给input获得焦点
function getFocus1(dom){

    $('#myModal2').one('click','.btn-default',function(){
        dom.focus();
    });
}
