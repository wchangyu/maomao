$(function(){
    var _prm = window.location.search;
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    var splitPrm = _prm.split('&');
    var _gdCode = splitPrm[0].split('=')[1];
    var _userID = splitPrm[1].split('=')[1];
    var _userName = splitPrm[2].split('=')[1];
    var _gdState = splitPrm[3].split('=')[1];
    var _gdCircle = splitPrm[3].split('=')[1];
    //弹出框信息绑定vue对象
    var app33 = new Vue({
        el:'#myApp33',
        data:{
            picked:'0',
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
            azAddress:''
        },
        methods:{
            radios:function(){
                $('.inpus').click(function(a){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            }
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
                title:'材料分析',
                data:'wxCl'
            },
            {
                title:'维修材料',
                data:'wxClName'
            },
            {
                title:'数量',
                data:'clShul'
            },
            {
                title:'使用人',
                data:' '
            }
        ]
    });
    var prm = {
        "gdCode": _gdCode,
        "gdZht": _gdState,
        "wxKeshi": "",
        "userID": _userID,
        "userName":_userName,
        'gdCircle':_gdCircle
    }
    $.ajax({
        'type':'post',
        'url':_urls + 'YWGD/ywGDGetDetail',
        'data':prm,
        'success':function(result){
            console.log(result);
            //赋值
            var indexs = result.gdZht;
            if(0<indexs && indexs<8){
                $('.progressBar').children('li').css({'color':'#333333'});
                $('.processing-record ul').children('.record-list').hide();
                for(var i=0;i<indexs;i++){
                    $('.progressBar').children('.progressBarList').eq(i).css({'color':'#db3d32'});
                    $('.processing-record ul').children('.record-list').eq(i).show();
                }
            }else{
                $('.progressBar').children('.progressBarList').css({'color':'#333333'});
                $('.processing-record ul').children('.record-list').hide();
            }
            //绑定弹窗数据
            if(result.gdJJ == 1){
                $('.inpus').parent('span').removeClass('checked');
                $('#ones').parent('span').addClass('checked');
            }else{
                $('.inpus').parent('span').removeClass('checked');
                $('#twos').parent('span').addClass('checked');
            }
            //app33.picked = result.gdJJ;
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
            _zhixingRens = result.wxRens;
            _fuZeRen = result.gdWxLeaders;
            _imgNum = result.hasImage;
            //进度条赋值
            //待下发记录时间
            progressContent(0,0,result.gdShij);
            //待下发相关人员
            progressContent(0,2,result.bxRen);
            //调度下发时间
            progressContent(1,0,result.shouLiShij);
            //调度下发人员
            progressContent(1,2,result.shouLiRen);
            //分派时间
            progressContent(2,0,result.paiGongShij);
            //分派人
            progressContent(2,2,result.paigongUser);
            //开始执行时间
            progressContent(3,0,result.jiedanShij);
            var ddRen = '';
            for(var i=0;i<result.wxRens.length;i++){
                ddRen += result.wxRens[i].wxRName;
                if(i!=result.wxRens.length-1){
                    ddRen += ','
                }
            }
            //执行人
            progressContent(3,2,ddRen);
            //等待时间
            progressContent(4,0,result.dengShij);
            //等待人
            progressContent(4,2,ddRen);
            //完工时间
            progressContent(5,0,result.wanGongShij);
            //完工人
            progressContent(5,2,ddRen);
            //关闭时间
            progressContent(6,0,result.guanbiShij);
            //关单人
            progressContent(6,2,ddRen);
            //查看执行人员
            datasTable($("#personTable1"),result.wxRens);
            //维修材料
            datasTable($("#personTables1"),result.wxCls);
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
        if(_imgNum){
            var str = '';
            for(var i=0;i<_imgNum;i++){
                str += '<img class="viewIMG" src="http://211.100.28.180/ApService/dimg.aspx?gdcode=' + _gdCode + '&no=' + i +
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
        moTaiKuang($('#myModal4'),'图片详情','flag');
        var imgSrc = $(this).attr('src')
        $('#myModal4').find('img').attr('src',imgSrc);
    })
    //进度条赋值
    function progressContent(elIndex,childrenIndex,time){
        $('.processing-record ul').children('li').eq(elIndex).children('div').eq(childrenIndex).children('.record-content').html(time);
    }
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
    function moTaiKuang(who,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        //$('#myModal2').find('.modal-body').html('起止时间不能为空');
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    }
})