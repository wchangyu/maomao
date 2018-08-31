$(function(){

    var href = window.location.search;

    var prm = '';

    if(href != ''){

        prm = href.split('=')[1];

    }

    var instanceID = prm;

    var objArr = [

        //主机搭配图
        {
            id:'1535701832',
            type:'AI'
        },
        //温度重设表
        {
            id:'1535707552',
            type:'AI'
        },
        //时间表
        {
            id:'AI-03',
            type:'AI-time'
        },
        //程序表
        {
            id:'auto-01',
            type:'auto-time'
        }

    ]

    //通过判断type 来确定是否显示
    for(var i=0;i<objArr.length;i++){

        if(prm == objArr[i].id){

            //确定当前选中的是哪个表
            //控制显示
            var type = objArr[i].type;

            if(type == 'AI' || type == 'AITime' ){

                //显示第一个菜单

                $('#AIBar').show();

                //显示当前的tab
                var currentTab = $('#AIBar').children('li');

                currentTab.removeClass('tab-bar-active');

                for(var j=0;j<currentTab.length;j++){

                    var id = '';

                    if(currentTab.eq(j).attr('data-attr')){

                        id = currentTab.eq(j).attr('data-attr');

                        if(id == prm){

                            currentTab.eq(j).addClass('tab-bar-active');

                        }

                    }

                }

                if(type == 'AI'){

                    $('#time-table').hide();

                }else if('AI-time'){

                    $('#time-table').show();

                }


            }else if(type == 'auto' || type == 'autoTime'){

                //显示第二个菜单
                $('#autoBar').show();

                ////显示当前的tab
                var currentTab = $('#autoBar').children('li');

                for(var j=0;j<currentTab.length;j++){

                    var id = '';

                    if(currentTab.eq(j).attr('data-attr')){

                        id = currentTab.eq(j).attr('data-attr');

                        if(id == prm){

                            currentTab.eq(j).addClass('tab-bar-active');

                        }

                    }

                }

                if(type == 'auto'){

                    $('#time-table').hide();

                }else if('auto-time'){

                    $('#time-table').show();

                }

            }

        }

    }


    /*------------------------------------------变量------------------------------------*/

    //存放当前编辑的单元格
    var thisTd = '';

    //存放初始的表格值
    var primaryArr = [];

    //存放编辑之后的表格值
    var changeArr = [];

    //存放修改了的表格
    var modifyArr = [];

    /*-------------------------------------------按钮事件-------------------------------*/

    //点击单元格出现编辑窗口
    $('#table1').on('click','td',function(){

        //模态框初始化
        //标题清空
        $('#field-con').html('');

        //label清空
        $('.option-body').find('label').html('');

        //控件清空
        $('.bodyContr').empty();

        //提示清空
        $('#formatTip').html('');

        var thisDom = $(this)['context'];

        thisTd = $(this);

        //modal显示
        _moTaiKuang($('#option-Modal'), '修改<span id="field-con" style="font-weight: bold"></span>内容', false, '' ,'', '确定');

        //判断当前点击的修改的列名称
        //记录当前的index值
        var ths = $('.table').find('th');

        var titleCon = ths.eq($(this).index()).html();

        $('#field-con').html(titleCon);

        //label内容
        $('.option-body').find('label').html(titleCon);

        //判断类型，是输入还是select
        var datetype = $(thisDom).attr('datetype');

        //模态框body中插入的控件类型
        var controlStr = '';

        //枚举类型
        if(datetype == 1){

            //获取到字符串
            var str = $(thisDom).attr('enums');

            //解析
            var jsonStr = eval('(' + str + ')');

            controlStr += '<select id="changeCon">';

            for(var i=0;i<jsonStr.length;i++){

                controlStr += '<option value="' + jsonStr[i].key + '">' + jsonStr[i].value + '</option>>'

            }

            controlStr += '<</select>';

        }else{

            controlStr += '<input type="text">'

        }

        $('.bodyContr').empty().append(controlStr);

        //将内容自动填入控件内
        var thisValue = $(thisDom).attr('value');

        $('.bodyContr').children().val(thisValue);

    })

    //点击确定之后，赋值
    $('#option-Modal').find('.btn-primary').click(function(){

        //将当前编辑的内容赋值到表格中
        var changeValue = $('.bodyContr').children().val();

        //标识验证是否通过
        var passFlag = false;

        //首先要验证一下格式
        //double类型
        if( $(thisTd).attr('datetype') == 2 ){

            var reg = /^[-\+]?\d+(\.\d+)?$/;

            if(!reg.test(changeValue)){

                $('#formatTip').html('请填写数字类型数据');

            }else{

                //验证大小（最大最小值）
                //最小值
                var min = Number($(thisTd).attr('min'));

                //最大值
                var max = Number($(thisTd).attr('max'));

                if( min <=Number(changeValue) && Number(changeValue)<= max ){

                    //double验证通过

                    passFlag = true;

                }else{

                    $('#formatTip').html('请填写数字介于' + min + '到' + max + '之间！');

                }

            }

            //dateTime类型

        }else{

            passFlag = true;

        }

        if(passFlag){

            //首先判断是枚举类型或者其他
            var attrType = $(thisTd).attr('datetype');

            if(attrType == 1){

                //获取内容文本
                var changeText = $('.bodyContr').children().children('option:selected').html();

                $(thisTd).html(changeText);

            }else{

                $(thisTd).html(changeValue);

            }

            //其次改变该单元格的属性值
            $(thisTd).attr('value',changeValue);

            //模态框消失
            $('#option-Modal').modal('hide');

        }

    })

    //点击编辑
    $('#edit-button').click(function(){

        //获取修改之后的表格值
        var trs = $('.table tbody').children('tr');

        //初始化数组
        changeArr.length = 0;

        modifyArr.length = 0;

        //遍历tr
        for(var i=0;i<trs.length;i++){

            //遍历单元格
            var trChs = trs.eq(i).children();

            for(var j=0;j<trChs.length;j++){

                var obj = {};

                for(var k in trChs[j]['attributes']){

                    var reg = /^[0-9]*$/;

                    if(reg.test(k)){

                        //将属性拼接字符串
                        var attrName = trChs[j]['attributes'][k].nodeName;

                        var attrValue = trChs[j]['attributes'][k].nodeValue;

                        obj[attrName] = attrValue;

                    }

                }

                changeArr.push(obj);


            }

        }

        //通过比较原始数据和改变后的数据来确定哪些数据是改变的

        //console.log('编辑');

        for(var i=0;i<changeArr.length;i++){

            for(var j=0;j<primaryArr.length;j++){

                if( primaryArr[j].colid == changeArr[i].colid && primaryArr[j].rowid == changeArr[i].rowid){

                    //比较相同单元的value
                    if(primaryArr[j].value != changeArr[i].value){

                        modifyArr.push(changeArr[i]);

                    }


                }

            }



        }

        //调用编辑接口
        editFun();

    })

    //点击下发
    $('#confirm-button').click(function(){

        sendInstruction();

    })

    //选项
    $('#AIBar').on('click','.ai-tab',function(){

        $('#AIBar').find('.ai-tab').removeClass('tab-bar-active');

        //样式修改
        $(this).addClass('tab-bar-active');

        //instancc修改

        instanceID = $(this).attr('data-attr');

        getTemplate();

    })

    /*-------------------------------------------其他方法-------------------------------*/

    getTemplate();

    //获取表格结构
    function getTemplate(){

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'PRTb/GetPRTableDs',

            data:{

                instanceID:instanceID

            },

            timeout:_theTimes,

            //发送数据之前
            beforeSend:function(){

                $('#AI-content').showLoading();

            },

            //发送数据完成之后
            complete:function(){

                $('#AI-content').hideLoading();

            },

            success:function(result){

                //console.log(result);

                drawTable(result);

            },

            error:_errorFun

        })

    }

    //获取到数据绘制表格
    function drawTable(result){

        primaryArr = []

        //清空表格
        $('.table').find('thead').empty();

        $('.table').find('tbody').empty();

        if(result.code == 0){

            //绘表格

            //表头
            var theadStr = '<tr>';

            for(var i=0;i<result.theads.length;i++){

                theadStr += '<th>' + result.theads[i] + '</th>';

            }

            theadStr += '</tr>';

            //插入表格
            $('.table').find('thead').append(theadStr);

            //表格数据
            for(var i=0;i<result.tbodys.length;i++){

                var tbodyStr = '<tr>';

                for(var j=0;j<result.theads.length;j++){

                    tbodyStr += '<td></td>';

                }

                tbodyStr += '</tr>';

                $('.table').find('tbody').append(tbodyStr);

            }

            //将返回的数组转化为对象
            for(var i=0;i<result.tbodys.length;i++){

                for(var j=0;j<result.tbodys[i].length;j++){

                    var obj = JSON.parse(result.tbodys[i][j])

                    primaryArr.push(obj);

                }

            }

            //遍历属性，将值赋给单元格
            for(var k=0;k<primaryArr.length;k++){

                var tdValue = primaryArr[k];

                var trNum = tdValue.rowid;

                var tdNum = tdValue.colid;

                var datetype = tdValue.datetype;

                var trsDom = $('#table1 tbody').find('tr').eq(trNum).find('td').eq(tdNum);

                if(datetype == 1){

                    if(tdValue.enums){

                        var jsonEnums = eval('(' +tdValue.enums + ')');

                        for(var z=0;z<jsonEnums.length;z++){

                            if(tdValue['value'] == 1){

                                trsDom.html('开');

                            }else if(tdValue['value'] == 0){


                                trsDom.html('关');

                            }else{

                                trsDom.html('');

                            }

                        }

                    }

                }else{

                    trsDom.html(tdValue.value);

                }

                //绑定属性
                for(var z in tdValue){

                    trsDom.attr(z,tdValue[z]);

                }

            }

        }else{

            var meg = '';

            if(result.msg == ''|| result.msg == null){

                meg = '请求失败';

            }else{

                meg = result.msg;

            }

            //提示错误
            _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,meg, '');

        }

    }

    //编辑表格方法
    function editFun(){

        var prm = {

            instanceID:instanceID,

            modifycells:modifyArr

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'PRTb/ModifyPRTableCellText',

            data:prm,

            beforeSend:function(){

                $('#AI-content').showLoading();

            },

            complete:function(){

                $('#AI-content').hideLoading();

            },

            timeout:_theTimes,

            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //编辑成功
                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'编辑成功！', '');

                    setTimeout(function(){

                        //刷新数据
                        getTemplate();

                    },500);

                }else{

                    var meg = '';

                    if(result.msg == ''|| result.msg == null){

                        meg = '请求失败';

                    }else{

                        meg = result.msg;

                    }

                    //提示错误
                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,meg, '');

                }


            },

            error:_errorFun

        })

    }

    //下发指令
    function sendInstruction(){

        var prm = {

            instanceID:instanceID

        }

        $.ajax({

            //发送方式
            type:'post',

            //url
            url:sessionStorage.apiUrlPrefix + 'PRTb/PRTbCtrlCOMM',

            //timeout
            timeout:_theTimes,

            //参数
            data:prm,

            beforeSend:function(){

                $('#AI-content').showLoading();

            },

            complete:function(){

                $('#AI-content').hideLoading();

            },

            //成功
            success:function(result){

                $('#theLoading').modal('hide');

                if(result.code == 0){

                    //编辑成功
                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,'下发成功！', '');

                    setTimeout(function(){

                        //刷新数据
                        getTemplate();

                    },500);

                }else{

                    var meg = '';

                    if(result.msg == ''|| result.msg == null){

                        meg = '请求失败';

                    }else{

                        meg = result.msg;

                    }

                    //提示错误
                    _moTaiKuang($('#tip-Modal'), '提示', true, 'istap' ,meg, '');

                }


            },

            //失败
            error: _errorFun

        })

    }

})