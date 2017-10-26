$(function(){
    var _prm = window.location.search;
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //获得用户名
    var _userIdNum = sessionStorage.getItem('userName');

    //获得用户名
    var _userIdName = sessionStorage.getItem('realUserName');
    //图片ip
    var _urlImg = 'http://211.100.28.180/ApService/dimg.aspx';
    var splitPrm = _prm.split('&');
    var _gdCode = splitPrm[0].split('=')[1];
    //var _gdState = splitPrm[1].split('=')[1];
    var _gdCircle = splitPrm[1].split('=')[1];
    //弹出框信息绑定vue对象
    var app33 = new Vue({
        el:'#myApp33',
        data:{
            picked:'',
            telephone:'',
            person:'',
            place:'',
            section:'',
            matter:'',
            sections:'',
            remarks:'',
            wxbeizhu:'',
            rwlx:4,
            sbSelect:'',
            sbLX:'',
            sbMC:'',
            sbBM:'',
            azAddress:'',
            whether:'',
            gdly:''
        }
    });
    var _imgNum = 0;
    //表格初始换
    $('#personTable1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'hiddenButton'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                class:'checkeds',
                "targets": -1,
                "data": 'wxRQZ',
                render:function(data, type, row, meta){
                    if(data == 1){
                        return "<div class='checker'><span class='checked'><input type='checkbox' disabled='disabled'></span></div>"
                    }else{
                        return "<div class='checker'><span><input type='checkbox' disabled='disabled'></span></div>"
                    }
                }
            },
            {
                title:'执行人员',
                data:'wxRName'
            },
            {
                title:'工号',
                data:'wxRen'
            },
            {
                title:'联系电话',
                data:'wxRDh'
            }
        ]
    });
    $('#personTables1').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": false,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'hiddenButton'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'备件编码',
                data:'wxCl'
            },
            {
                title:'备件名称',
                data:'wxClName'
            },
            {
                title:'数量',
                data:'clShul'
            }
        ]
    });
    var prm = {
        "gdCode": _gdCode,
        //"gdZht": _gdState,
        "wxKeshi": "",
        "userID": _userIdNum,
        "userName":_userIdName,
        'gdCircle':_gdCircle
    }
    $.ajax({
        'type':'post',
        'url':_urls + 'YWGD/ywGDGetDetail',
        'data':prm,
        'success':function(result){
            //赋值
            var progressBarList = $('.progressBarList');
            //绑定弹窗数据
            if(result.gdJJ == 1){
                $('.inpus').removeAttr('checked');
                $('#ones').click();
            }else{
                $('.inpus').removeAttr('checked');
                $('#twos').click();
            }
            $('.otime').val(result.gdFsShij);
            app33.telephone = result.bxDianhua;
            app33.person = result.bxRen;
            app33.place = result.wxDidian;
            app33.section = result.bxKeshi;
            app33.matter = result.wxShiX;
            app33.sections = result.wxKeshi;
            app33.remarks = result.bxBeizhu;
            app33.wxbeizhu = result.wxBeizhu;
            app33.sbSelect = result.wxShebei;
            app33.sbLX = result.dcName;
            app33.sbMC = result.dName;
            app33.sbBM = result.ddName;
            app33.azAddress = result.installAddress;
            app33.rwlx = result.gdLeixing;
            _imgNum = result.hasImage;
            app33.gdly = result.gdCodeSrc;
            datasTable($('#personTable1'),result.wxRens);
            datasTable($('#personTables1'),result.wxCls);
            //所有处理过程
            logInformation(0);
            //所有框不可编辑
            $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');
            $('#myApp33').find('textarea').attr('disabled',true);
            $('#myApp33').children('li').eq(0).children('.input-blockeds').addClass('disabled-block');
        },
        'error':function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    })
    //弹窗切换表格效果
    $('.table-title span').click(function(){
        $('.table-title span').removeClass('spanhover');
        $(this).addClass('spanhover');
        $('.tableHover').hide();
        $('.tableHover').eq($(this).index()).show();

    });
    $('#viewImage').on('click',function(){
        $('.showImage').show();
        if(_imgNum){
            var str = '';
            for(var i=0;i<_imgNum;i++){
                str += '<img class="viewIMG" src="' +
                    replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=' + i +
                    '">'
            }
            $('.showImage').html('');
            $('.showImage').append(str);
            $('.showImage').show();
        }else{
            $('.showImage').html('没有图片');
            $('.showImage').show();
        }
    })
    $('.showImage').on('click','.viewIMG',function(){
        //moTaiKuang($('#myModal4'),'图片详情','flag');
        _moTaiKuang($('#myModal4'), '图片详情', 'flag', '' ,'', '');
        var imgSrc = $(this).attr('src')
        $('#myModal4').find('img').attr('src',imgSrc);
    })
    //dataTables表格填数据
    function datasTable(tableId,arr){
        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    //模态框自适应
    function _moTaiKuang(who, title, flag, istap ,meg, buttonName) {
        who.modal({
            show: false,
            backdrop: 'static'
        })
        who.find('.modal-title').html(title);
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight) / 2;
        who.find('.modal-dialog').css({'margin-top': markBlockTop});
        if (flag) {
            who.find('.btn-primary').hide();
        } else {
            who.find('.btn-primary').show();
            who.find('.modal-footer').children('.btn-primary').html(buttonName);
        }
        if(istap){
            who.find('.modal-body').html(meg);
        }
    }
    //IP替换
    function replaceIP(str,str1){
        var ip = /http:\/\/\S+?\//;  /*http:\/\/\S+?\/转义*/
        var res = ip.exec(str1);  /*211.100.28.180*/
        str = str.replace(ip,res);
        return str;
    }
    //获取日志信息（备件logType始终传2）
    function logInformation(logType){
        var gdLogQPrm = {
            "gdCode": _gdCode,
            "logType": logType,
            "userID": _userIdNum,
            "userName": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywDGGetLog',
            data:gdLogQPrm,
            success:function(result){
                if(logType == 2){
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.deal-with-list').empty();
                    $('.deal-with-list').append(str);
                }else if(logType == 1){
                    var str = '';
                    for(var i=0;i<result.length;i++){
                        str += '<li><span class="list-dot"> </span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;' + result[i].logTitle + '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }else{
                    var str = '';
                    for(var i =0;i<result.length;i++){
                        str += '<li><span class="list-dot" ></span>' + result[i].logDate + '&nbsp;&nbsp;' + result[i].userName + '&nbsp;&nbsp;'+ result[i].logTitle + '&nbsp;&nbsp;' + result[i].logContent+ '</li>';
                    }
                    $('.processing-record ul').empty();
                    $('.processing-record ul').append(str);
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})