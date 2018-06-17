/**
 * Created by admin on 2018/06/05.
 */
$(function(){

    //获取一键诊断包含的分类及其具体的操作项
    getOneKeyDiagItemType();

    //开始诊断按钮
    $('.diagnose-btn button').on('click',function(){

        //判断按钮状态
        if(ifDiag == false){

            //清空选中的一键诊断信息列表
            diagnoseArr.length = 0;

            ifDiag = true;

            //当前按钮信息改变
            $(this).html('取消');

            //显示诊断进程
            $('.diagnose-course').show();

            $('.diagnose-course .right-content b').html('发现0条问题.....');

            $('.diagnose-course .right-content font').html('正在诊断能耗问题');

            //清空诊断信息
            diagHtml = "";

            //清空页面中存放诊断信息的容器
            $('#content-container').html('');

            //定义某种分类下总问题条数
            curDiagProblemCount = 0;

            //定义所有分类下总问题条数
            curDiagProblemAccount = 0;

            //控制是否继续诊断的开关
            ifContinueDiag = true;

            //清空存放诊断结果的数据
            diagSpecificArr.length = 0;

            //获取到当前选中的分类编码
            for(var i=0; i<4;i++){

                var dom = $('.energy-diagnose1').eq(i).find('.bottom-choose');

                //判断当前是否显示
                if(!dom.is(":hidden")){

                    //获取到当前的分类编码
                    var diagTypeNum = $('.energy-diagnose1').eq(i).attr('data-id');

                    $(allDiagnoseArr).each(function(i,o){

                        if(o.diagTypeNum == diagTypeNum){

                            diagnoseArr.push(o)
                        }
                    })
                }
            }

            //console.log(diagnoseArr);

            //开始诊断
            getExecuteOneKeyDiagItem(0,0);

        }else{

            ifDiag = false;

            //当前按钮信息改变
            $(this).html('重新诊断');

            //取消继续诊断
            ifContinueDiag = false;

            //改变诊断进程中的显示
            $('.diagnose-course .right-content font').html('已停止继续诊断');

        }
    });

    //点击折叠按钮时
    $('#content-container').on('click','.right-arrow',function(){
        //如果当前为折叠状态
        if($(this).hasClass('up-arrow')){

            $(this).removeClass('up-arrow');

        }else{

            $(this).addClass('up-arrow');
        }
        //动态显示或隐藏下方的诊断问题容器
        $(this).parents('.specific-problem').find('.bottom-problem').toggle();
    });

    //点击勾选不同的诊断内容
    $('.energy-diagnose1').on('click',function(){

        //获取到当前的勾选图片的dom
        var dom = $(this).find('.bottom-choose');

        //控制图片显示隐藏
        dom.toggle();
    });

});
//存放一键诊断信息
var diagnoseArr = [];

var allDiagnoseArr = [];

//定义是否诊断的判断信息
var ifDiag = false;

//用于获取诊断类型
var indexItem = 0;

//用于获取当前类型下的具体诊断内容
var indexDiag = 0;

//定义某种分类下总问题条数
var curDiagProblemCount = 0;

//定义所有分类下总问题条数
var curDiagProblemAccount = 0;

//控制是否继续诊断的开关
var ifContinueDiag = true;

//获取一键诊断包含的分类及其具体的操作项
function getOneKeyDiagItemType(){

    $.ajax({
        type: 'get',
        url: sessionStorage.apiUrlPrefix + 'OneKeyDiag/GetStationOneKeyDiagItemType',
        success: function (result) {

            //console.log(result);

            //将获取到的信息添加到信息数组中
            $(result).each(function(i,o){

                allDiagnoseArr.push(o);

                //获取到当前的分类编码
                var diagTypeNum = o.diagTypeNum;

                //获取到上方对应的dom
                var dom = $('.energy-diagnose1').eq(i);

                dom.attr('data-id',diagTypeNum);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })
};

var count = 0;


//定义添加到页面中的内容
var diagHtml = "";

//获取能耗诊断信息
//indexItem用于获取诊断类型(如能耗诊断，能效诊断) indexDiag用于获取当前类型下的具体诊断内容
function getExecuteOneKeyDiagItem(indexItem,indexDiag){

    //当前要传递给后台需诊断的项目
    var　diagObj = diagnoseArr[indexItem].oneKeyDiagItems[indexDiag];

    //获取当前的一键诊断分类编码
    var diagTypeNum = diagnoseArr[indexItem].diagTypeNum;

    //定义要跳转的页面
    var postHtml= 'javascript:;';

    //如果是能耗诊断
    if(diagTypeNum == 'EnergyDiag'){

        //楼宇定额诊断
        if(diagObj.diagItemNum == 'PointerDingE'){

            postHtml= "pointerDingEDetailData.html?id=";

            //支路能耗增长变快诊断
        }else if(diagObj.diagItemNum == 'BranchEnergyRise'){

            postHtml= "branchEnergyRise.html?id=";

            //支路能耗突变诊断
        }else if(diagObj.diagItemNum == 'BranchEnergyMutation'){

            postHtml= "pointerDingEDetailData.html?id=";

        }else{

            //支路能耗夜间用量偏高
            if(diagObj.diagItemNum == 'DayNightRise'){

                postHtml= "energyDetailData.html?flag=1&&id=";
            }

            postHtml= "officeDingEDetailData.html?id=";

        }

    //如果是环境品质诊断
    }else  if(diagTypeNum == 'EnvironDiag'){

        postHtml= "getEnvironDetailData.html?id=";
    }

    //如果是第一项，需添加头部信息
    if(indexDiag == 0){

        diagHtml += '  <div class="specific-problem energy-problem">' +

            '<h3>'+diagnoseArr[indexItem].diagTypeName+'' +
            '<span>正在诊断中......</span>' +
            '<font class="right-arrow"></font>'+
            '</h3>' +

            '<div class="bottom-problem">';

    };

    //给页面中添加诊断信息
    $('#content-container').html(diagHtml);


    //如果是子系统诊断
    if(diagTypeNum == 'SubsystemDiag'){

        diagHtml += '</div></div>';

        //给页面中添加诊断信息
        $('#content-container').html(diagHtml);

        //找到存放问题个数的元素位置并赋值
        $('#content-container .specific-problem').eq(indexItem ).find('h3 span').html('发现'+0 +'个' + diagnoseArr[indexItem].diagTypeName + "问题");

        //对此分类下的问题进行折叠
        $('#content-container .specific-problem').eq(indexItem ).find('h3 .right-arrow').addClass('up-arrow');

        $('#content-container .specific-problem').eq(indexItem ).find('.bottom-problem').toggle();

        //如果不是最后一个诊断类型
        if(indexItem < diagnoseArr.length - 1) {

            //改变诊断进程中的显示
            $('.diagnose-course .right-content font').html('正在诊断' + diagnoseArr[indexItem+1].diagTypeName + '问题');

        }

        //获取到页面中的字符串
        diagHtml = $('#content-container').html();

        indexItem ++ ;

        //全部分类都已诊断完毕，退出函数
        if(indexItem > diagnoseArr.length - 1){

            //console.log('已完成');
            //改变上方按钮
            $('.diagnose-btn').hide();

            //改变诊断进程中的显示
            $('.diagnose-course .right-content b').html('共诊断出'+curDiagProblemAccount+'个问题');
            $('.diagnose-course .right-content font').html('诊断完毕');

            return false;
        }

        //继续获取诊断信息
        getExecuteOneKeyDiagItem(indexItem,0);

        return false;

    }

    //传递数据
    $.ajax({
        type: 'post',
        url: sessionStorage.apiUrlPrefix + 'OneKeyDiag/ExecuteOneKeyDiagItem',
        timeout:_theTimes,
        data:diagObj,
        success: function (result) {
            count ++ ;
            //console.log(result);
            //console.log(count);

            //是否继续获取能耗诊断信息
            if(ifContinueDiag  == false){
                //找到存放问题个数的元素位置并赋值
                $('#content-container .specific-problem').eq(indexItem).find('h3 span').html('暂发现'+curDiagProblemCount +'个' + diagnoseArr[indexItem].diagTypeName + "问题");

                return false;
            }

            //页面添加诊断问题信息
            $(result).each(function(i,o){
                //console.log(o);

                if(o.returnOBJID == ''){
                    //如果当前还没有诊断信息
                    if(curDiagProblemCount == 0){

                        diagHtml +=   '<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 ">' +
                            '<ul>'+
                            '<li>'+ o.oneKeyDiagDesc+'</li>';

                        //当前是5的倍数需要把上面的div闭合 并开始新的div
                    }else if(curDiagProblemCount % 5 == 0){

                        diagHtml +=   '</ul></div><div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 ">' +
                            '<ul>'+
                            '<li>' +
                            ''+ o.oneKeyDiagDesc+'' +
                            '</li>';

                    }else{

                        diagHtml +=  '<li>' +
                            ''+ o.oneKeyDiagDesc+'' +
                            '</li>';
                    }

                    //记录当前分类下已出现问题个数
                    curDiagProblemCount ++;
                    //记录所有问题总个数
                    curDiagProblemAccount++;
                    //给存放所有诊断结果的数组中添加数据
                    var obj = o;
                    //给诊断结果添加唯一标识
                    obj.indexId = curDiagProblemAccount;
                    //加入数组
                    diagSpecificArr.push(obj);

                    return true;
                }

                //如果当前还没有诊断信息
                if(curDiagProblemCount == 0){

                    diagHtml +=   '<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 ">' +
                        '<ul>'+
                        '<li><a target="_blank" href="'+ postHtml+ curDiagProblemAccount+'">'+ o.oneKeyDiagDesc+'</a></li>';

                    //当前是5的倍数需要把上面的div闭合 并开始新的div
                }else if(curDiagProblemCount % 5 == 0){

                    diagHtml +=   '</ul></div><div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 ">' +
                        '<ul>'+
                        '<li>' +
                        '<a  target="_blank"  href="'+ postHtml+ curDiagProblemAccount+'">'+ o.oneKeyDiagDesc+'</a>' +
                        '</li>';

                }else{

                    diagHtml +=  '<li>' +
                        '<a  target="_blank"  href="'+ postHtml+ curDiagProblemAccount+'">'+ o.oneKeyDiagDesc+'</a>' +
                        '</li>';
                }

                //记录当前分类下已出现问题个数
                curDiagProblemCount ++;
                //记录所有问题总个数
                curDiagProblemAccount++;
                //给存放所有诊断结果的数组中添加数据

                var obj = o;
                //给诊断结果添加唯一标识
                obj.indexId = curDiagProblemAccount;
                //加入数组
                diagSpecificArr.push(obj);
            });

            //把数据添加到session中
            sessionStorage.diagSpecific = JSON.stringify(diagSpecificArr);

            //获取到当前分类下需诊断项目个数
            var diagItemLength = diagnoseArr[indexItem].oneKeyDiagItems.length;

            //如果当前项目不是该分类下最后一个 且不是设备安全诊断
            if(indexDiag < diagItemLength - 1 && indexItem != 2){

                //诊断项目加一
                indexDiag ++;

            }else{

                //诊断项目归零
                indexDiag = 0;

                //闭合当前项目
                diagHtml += '</ul>' + '</div>' +
                        //清除浮动
                    '<div class="clearfix">' + '</div></div></div>';

                //诊断类型加一
                indexItem ++;
            }

            //给页面中添加诊断信息
            $('#content-container').html(diagHtml);

            //对一个分类诊断完成后，计算出此分类下的问题个数放入页面中
            if(indexDiag == 0){

                //找到存放问题个数的元素位置并赋值
                $('#content-container .specific-problem').eq(indexItem - 1).find('h3 span').html('发现'+curDiagProblemCount +'个' + diagnoseArr[indexItem-1].diagTypeName + "问题");

                //对此分类下的问题进行折叠
                $('#content-container .specific-problem').eq(indexItem - 1).find('h3 .right-arrow').addClass('up-arrow');

                $('#content-container .specific-problem').eq(indexItem - 1).find('.bottom-problem').toggle();
                //如果不是最后一个诊断类型
                if(indexItem <= diagnoseArr.length - 1){

                    //改变诊断进程中的显示
                    $('.diagnose-course .right-content font').html('正在诊断' +diagnoseArr[indexItem].diagTypeName +'问题');

                }

                //获取到页面中的字符串
                diagHtml = $('#content-container').html();

                //当前项目下的问题个数归零
                curDiagProblemCount = 0;
            }

            //问题总数
            $('.diagnose-course .right-content b').html('已发现'+curDiagProblemAccount+'个问题');

            //全部分类都已诊断完毕，退出函数
            if(indexItem > diagnoseArr.length - 1){
                console.log('已完成');
                //改变上方按钮
                $('.diagnose-btn').hide();

                //改变诊断进程中的显示
                $('.diagnose-course .right-content b').html('共诊断出'+curDiagProblemAccount+'个问题');
                $('.diagnose-course .right-content font').html('诊断完毕');

                return false;
            }

            //继续获取诊断信息
            getExecuteOneKeyDiagItem(indexItem,indexDiag);


        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    })
}
