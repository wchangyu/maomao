$(function(){

    //存放当前编辑的单元格
    var thisTd = '';

    //存放初始的表格值
    var primaryArr = [];

    //存放编辑之后的表格值
    var changeArr = [];

    //存放修改了的表格
    var modifyArr = [];

    //获取模板
    getTemplate();

    /*-------------------------------点击事件---------------------------------------*/

    $('.table').on('click','td',function(){

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

        }else if( $(thisTd).attr('datetype') == 5 ){}

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

        //loadding
        $('#theLoading').modal('show');

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

        for(var i=0;i<primaryArr.length;i++){

            for( var j in primaryArr[i] ){

                for(var k in changeArr[i]){

                    if(j == k && primaryArr[i][j] != changeArr[i][k]){

                        modifyArr.push(changeArr[i]);

                    }

                }

            }

        }

        //调用编辑接口
        editFun();

    })


    /*-------------------------------调用模板---------------------------------------*/

    //获取表格结构
    function getTemplate(){

        $.ajax({

            type:'post',

            url: sessionStorage.apiUrlPrefix + 'PRTb/GetPRTableDs',

            data:{

                instanceID:'1528338164'

            },

            timeout:_theTimes,

            //发送数据之前
            beforeSend:_beforeSendFun,

            //发送数据完成之后
            complete:_completeFun,

            success:function(result){

                drawTable(result);

            },

            error:_errorFun

        })

    }

    //编辑表格方法
    function editFun(){

        var prm = {

            instanceID:'1528338164',

            modifycells:modifyArr

        }

        $.ajax({

            type:'post',

            url:sessionStorage.apiUrlPrefix + 'PRTb/ModifyPRTableCellText',

            data:prm,

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

    //获取到数据绘制表格
    function drawTable(result){

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

                for(var j=0;j<result.tbodys[i].length;j++){

                    tbodyStr += '<td></td>';

                }

                tbodyStr += '</tr>';

                $('.table').find('tbody').append(tbodyStr);

            }

            //填数据

            var trs = $('.table').find('tbody').children('tr');

            //遍历行
            for(var i=0;i<result.tbodys.length;i++){

                //将获取到的row信息存放到原始对象中


                //遍历单元格
                for( var j=0;j<result.tbodys[i].length;j++ ){

                    //属性值
                    var tdValue = JSON.parse(result.tbodys[i][j]);

                    primaryArr.push(tdValue);

                    //单元格dom
                    var trsDom = trs.eq(i).children('td').eq(j);

                    //绑定值（首先判断类型1、枚举）
                    if(tdValue.datetype == 1){

                        //枚举类型
                        //解析字符串

                        var jsonEnums = eval('(' + tdValue.enums + ')');

                        for(var k=0;k<jsonEnums.length;k++){

                            if(jsonEnums[k]['key'] == tdValue.value ){

                                trsDom.html(jsonEnums[k]['value']);

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

})