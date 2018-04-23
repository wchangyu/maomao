$(function(){

    /*---------------------------------------------------变量---------------------------------------------------*/

    //存放车间数组
    var _stationArr = [];

    //存放维修班组数组
    var _wxArr = [];

    //车间和车站
    WxBanzuStation();

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //设备vue对象
    var deveVue = new Vue({

        el:'#myApp33',
        data:{
            //设备编码（旧）
            sbbm:'',
            //设备名称
            mingcheng:'',
            //拼音简码
            pinyin:'',
            //设备编码（新）
            xsbbm:'',
            //出厂编号
            bianhao:'',
            //产地
            chandi:'',
            //状态
            zhuangtai:'',
            //安装位置
            weizhi:'',
            //品牌
            pingpai:'',
            //规格型号
            guige:'',
            //供应商
            gongyingshang:'',
            //生产商
            shengchanshang:'',
            //使用年限
            nianxian:'',
            //保修期
            baoxiu:''
        }

    });

    //存放所有列表中的数据
    var _allDateArr = [];

    //车务段
    DevList('YWDev/ywDMGetDAs',$('#quyu'),$('#sbqy'),'daNum','daName');

    //车站（条件选择）
    addStationDom($('#bumen').parent());

    //所有车站的数组
    var _allDataBM = [];
    //设备类别数组
    var _allDataLX = [];

    //车站（新增）
    _ajaxFun('YWDev/ywDMGetDDs', _allDataBM, $('#sbbm'), 'ddName', 'ddNum');

    //设备系统
    DevList('YWDev/ywDMGetDSs',$('#xitong'),$('#sbxt'),'dsNum','dsName');

    //设备类别
    DevList('YWDev/ywDMGetDCs',$('#leixing'),$('#sblx'),'dcNum','dcName',_allDataLX);

    //记录当前选中的设备的id
    var _thisRowID = null;

    //记录当前选中的设备的编码
    var _thisRowBM = null;

    //标识当前窗口是不是新增窗口
    var _deng = false;

    //二维码地址
    var _erweimaPath = 'http://ip/ApService/showQR.aspx';

    //获取车务段与车站对应的父子关系
    var _relativeArr2 = [];

    getSelectContent('YWDev/GetDevAreaGroupDep',_relativeArr2);

    function getSelectContent(url,arr){

        $.ajax({
            type: 'get',
            url: _urls + url,
            timeout: theTimes,
            success: function (data) {

                $(data).each(function(i,o){
                    arr.push(o);
                })
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //console.log(textStatus);

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                }else{

                }

            }
        });
    };

    //获取设备系统与设备类型对应的父子关系
    var _relativeArr1 = [];

    getSelectContent('YWDev/GetDevSysGroupClass', _relativeArr1);

    /*--------------------------------------------------表格初始化-----------------------------------------------*/

    //表格
    var mainCol = [

        {
            title:'编号',
            data:'id',
            visible: false,
            className:'ids'
        },
        {
            title:'设备名称',
            data:'dName',
            className:'dName'
        },
        {
            title:'设备编码',
            data:'dNum',
            className:'dNum hidden',
            render:function timeForma(data){
                return '<span>'+data+'</span>'
            }
        },
        {
            title:'设备编码',
            data:'dNewNum'

        },
        {
            title:'规格型号',
            data:'spec'
        },
        {
            title:'所属'+ __names.department,
            data:'ddName'
        },
        {
            title:'安装位置',
            data:'installAddress'
        },
        {
            title:'设备系统',
            data:'dsName'
        },
        {
            title:'设备类别',
            data:'dcName'
        },
        {
            title:'安装时间',
            data:'installDate',
            render:function timeForma(data){
                return data.split(' ')[0].replace(/-/g,'/');
            }
        },
        {
            title:'保修年限',
            data:'maintain'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "class":'caozuo',
            "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
            "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>" +
            "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
        }

    ];

    var excelCol = [1,3,4,5,6,7,8,9,10]

    _tableInit($('#browse-datatables'),mainCol,1,true,'','','',excelCol);

    /*--------------------------------------------------按钮事件-------------------------------------------------*/
    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【重置】
    $('.resites').click(function(){

        $('.condition-query').eq(0).find('input').val('');

        $('.condition-query').eq(0).find('select').val('');

    })

    //【新增】
    $('.creatButton').click(function(){

        //标识当前是新增窗口，
        _deng = true;

        //loadding图显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');

        //类
        $('#myModal').find('.modal-footer').children('.btn-primary').removeClass('shanchu').removeClass('bianji').addClass('dengji');

        //是否可操作
        abledOption();

        //查看我二维码按钮消失
        $('.viewImage').hide();

        //loadding图消失
        $('#theLoading').modal('hide');
    })

    //【打印】
    $('#print').click(function(){

        $(".print-table").print({
            //Use Global styles
            globalStyles : false,
            //Add link with attrbute media=print
            mediaPrint : true,
            //Custom stylesheet
            stylesheet : "http://fonts.googleapis.com/css?family=Inconsolata",
            //Print in a hidden iframe
            iframe : false,
            //Don't print this
            noPrintSelector : ".avoid-this",
            //Add this at top
            prepend : "Hello World!!!<br/>",
            //Add this on bottom
            append : "<br/>Buh Bye!",
            //Log to console when printing is done via a deffered callback
            deferred: $.Deferred().done(function() { console.log('Printing done', arguments); })
        });

    })

    //表格【查看】
    $('#browse-datatables').on('click','.option-see',function(){

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'),'查看',true,'','','');

        //数据绑定
        bindData($(this));

        //是否可操作
        disabledOption();

        //查看我二维码按钮显示
        $('.viewImage').show();

    })

    //表格【编辑】
    $('#browse-datatables').on('click','.option-edite',function(){

        //loadding图显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'),'编辑','','','','保存');

        //数据绑定
        bindData($(this));

        //是否可操作
        abledOption();

        //类
        $('#myModal').find('.modal-footer').children('.btn-primary').removeClass('shanchu').removeClass('dengji').addClass('bianji');

        //loadding图消失
        $('#theLoading').modal('hide');

        //查看我二维码按钮显示
        $('.viewImage').show();

    })

    //表格【删除】
    $('#browse-datatables').on('click','.option-delete',function(){

        //loadding图显示
        $('#theLoading').modal('show');

        //初始化
        detailInit();

        //模态框
        _moTaiKuang($('#myModal'),'确定要删除吗？','','','','删除');

        //数据绑定
        bindData($(this));

        //是否可操作
        disabledOption();

        //类
        $('#myModal').find('.modal-footer').children('.btn-primary').removeClass('bianji').removeClass('dengji').addClass('shanchu');

        //loadding图消失
        $('#theLoading').modal('hide');

        //查看我二维码按钮显示
        $('.viewImage').show();

    })

    //【登记确定】按钮
    $('#myModal').on('click','.dengji',function(){

        buttonOption('YWDev/ywDAddDev',true,'新增成功！','新增失败！');

    })

    //【编辑确定】按钮
    $('#myModal').on('click','.bianji',function(){

        buttonOption('YWDev/ywDUptDev',true,'编辑成功！','编辑失败！');

    })

    //【删除确定】按钮
    $('#myModal').on('click','.shanchu',function(){

        buttonOption('YWDev/ywDDelDev',false,'删除成功！','删除失败！');

    })

    //【二维码】
    $('.viewImage').click(function(){

        if(_deng){

            $('.QRcode').empty();

        }else{

            if( $('.QRcode').children().length == 0 ){

                $('.QRcode').empty();

                $('.QRcode').show();

                var str = '<img src="' + _replaceIP(_erweimaPath,_urls) + '?asc=' + _thisRowBM +
                    '"' + 'style="width:100px;height:100px;"' +
                    '>';

                $('.QRcode').append(str);

            }else{

                $('.QRcode').empty();

                $('.QRcode').hide();
            }

        }

    });

    //模态框消失的时候，_deng置为false
    $('#myModal').on('hide.bs.modal',function(){

        _deng = false;

    })

    //车务段、车站联动（条件选择）
    $('#quyu').change(function(){

        var value = $('#quyu').val();
        $('#bumen').parent().next().find('.add-select-block').hide();
        $('#bumen').parent().next().find('.add-input-select').find('span').html('全部');
        $('#bumen').parent().next().find('.add-input-select').find('span').attr('values','');
        $('.AbcSearch li').removeClass('action');
        $('.AbcSearch li').eq(0).addClass('action');

        if(value == ''){
            var str = '<option value="">全部</option>';
            $(_allDataBM).each(function(i,o){

                str += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>'
            });
            $('#bumen').html('');
            $('#bumen').html(str);
            //显示根据拼音选择车站选框
            stationArr = _allDataBM;
            classifyArrByInitial(stationArr,0);
            return false;
        }


        $(_relativeArr2).each(function(i,o){

            if(value == o.daNum){
                var pushArr = o.devDeps;
                stationArr = pushArr;
                classifyArrByInitial(stationArr,0);
                var str = '<option value="">全部</option>';
                $(pushArr).each(function(i,o){

                    str += '<option value="'+ o.ddNum+'">'+ o.ddName+'</option>'
                });
                //console.log(str);
                $('#bumen').html('');
                $('#bumen').html(str);
                return false;
            }
        });

    })

    //系统、类别联动（条件选择）
    $('#xitong').change(function(){

        var value = $('#xitong').val();
        if(value == ''){
            var str = '<option value="">全部</option>';
            $(_allDataLX).each(function(i,o){

                str += '<option value="'+ o.dcNum+'">'+ o.dcName+'</option>'
            });
            $('#leixing').html('');
            $('#leixing').html(str);
            return false;
        }

        $(_relativeArr1).each(function(i,o){

            if(value == o.dsNum){
                var pushArr = o.devClasss;
                var str = '<option value="">全部</option>';
                $(pushArr).each(function(i,o){

                    str += '<option value="'+ o.dcNum+'">'+ o.dcName+'</option>'
                });
                //console.log(str);
                $('#leixing').html('');
                $('#leixing').html(str);
                return false;
            }
        });
    });

    //车务段、车站联动（模态框）
    $('#sbqy').change(function(){

        var str = '<option value="">请选择</option>';

        if($('#sbqy').val() == ''){

            for(var i=0;i<_allDataBM.length;i++){

                str += '<option value="' + _allDataBM[i].ddNum + '">' + _allDataBM[i].ddName + '</option>';

            }

            $('#sbbm').empty().append(str);

        }else{

            var LstationArr = getAllContent($('#sbqy').val(),_relativeArr2,false);

            for(var i=0;i<LstationArr.length;i++){

                str += '<option value="' + LstationArr[i].value + '">' + LstationArr[i].text + '</option>';

            }

            $('#sbbm').empty().append(str);

        }

    })

    //系统、类别联动（模态框）
    $('#sbxt').change(function(){

        var str = '<option value="">请选择</option>';

        //根据选中的系统id联动类别
        if($('#sbxt').val() == ''){

            for(var i=0;i<_allDataLX.length;i++){

                str += '<option value="' + _allDataLX[i].dcNum + '">' + _allDataLX[i].dcName + '</option>';

            }

            $('#sblx').empty().append(str);

        }else{

            var classArr = getAllContent($('#sbxt').val(),_relativeArr1,true);

            for(var i=0;i<classArr.length;i++){

                str += '<option value="' + classArr[i].value + '">' + classArr[i].text + '</option>';

            }

            $('#sblx').empty().append(str);

        }

    })

    /*--------------------------------------------------其他方法-------------------------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }

        //开始时间
        var realityStart = '';

        //结束时间
        var realityEnd = '';

        if( filterInput[3] == ''){
            realityStart = ''
        }else{
            realityStart = filterInput[3] + ' 00:00:00';
        }
        if( filterInput[3] == '' ){
            realityEnd = ''
        }else{
            realityEnd = moment(filterInput[4]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }
        var id1 = $('#chejian').val();
        var id2 = $('#banzu').val();

        var departNums = getPostTrain(id1,id2);

        var flag = departNums[0];
        if(!flag){
            departNums = [];
        }

        var prm =   {
            //开始时间
            'st':realityStart,
            //结束时间
            'et':realityEnd,
            //设备名称
            'dName':filterInput[0],
            //规格型号
            'spec':filterInput[1],
            //设备编码
            //'dNum':filterInput[2],
            //车务段
            'daNum':$('#quyu').val(),
            //车站
            //'ddNum':$('#bumen').val(),
            'ddNum':$('.add-input-select').children('span').attr('values'),
            //设备系统
            'dsNum':$('#xitong').val(),
            //设备类别
            'dcNum':$('#leixing').val(),
            //设备状态
            'status':$('#zhuangtai').val(),
            //车间
            'departNums':departNums,
            //新的设备编码
            'dNewNum':$('#bianhao').val(),
            //用户id
            'userID':_userIdNum
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){

                var str = '';

                for(var i=0;i<result.length;i++){

                    var  valueStr = '<div class="print-block-cel suo"> <div class="table-title1">设备（设施）标识牌</div> <div class="table-img1"> <img src="../resource/img/jt-logo.png" alt=""> <span>江铁实业</span> </div> <div class="title-word1">' + result[i].ddName +
                        '</div> <div class="content-block"> <div class="row-list"> <div class="row-two-left">设备名称</div> <div class="row-two-right">' + result[i].dName +
                        '</div> </div> <div class="row-list"> <div class="row-two-left">使用位置</div> <div class="row-two-right">' + result[i].installAddress +
                        '</div> </div> <div class="three-block"> <div class="three-left"> <div class="row-list"> <div class="row-three-left">规格型号</div> <div class="row-three-right">' + result[i].spec +
                        '</div> </div> <div class="row-list"> <div class="row-three-left">启用日期</div> <div class="row-three-right">' + installTime(result[i].installDate) +
                        '</div> </div> <div class="row-list"> <div class="row-three-left">管理单位</div> <div class="row-three-right">' + result[i].daName +
                        '</div> </div> <div class="row-list"> <div class="row-three-left">产权单位</div> <div class="row-three-right">南昌铁路局</div> </div> <div class="row-list"> <div class="row-three-left">维护单位</div> <div class="row-three-right">江西铁路实业发展有限公司</div> </div> </div> <div class="img-block"> <img  src="' + _replaceIP(_erweimaPath,_urls) + '?asc=' + result[i].dNum +
                        '" alt="" > </div> </div> <div class="row-list" style="border-bottom: none"> <div class="row-two-left">报修电话：018-29999 </div> <div class="row-two-right">设备编码：<span>' + result[i].dNum +
                        '</span> </div> </div> </div> </div>'

                    //开始的标签
                    if(i == 0){

                        str += '<div class="print-block">' +  valueStr

                    }else if(i == result.length - 1){

                        str += valueStr;

                    }else if(i % 6 == 0 ){

                        str += '<div class="clearfix noprint"></div></div><div class="PageNext"></div><div class="print-block">' + valueStr

                    }else{

                        str += valueStr

                    }

                }

                $('.print-table').empty().append(str);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }
        })
    }

    //车间和维修班组
    function WxBanzuStation(){

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:{
                userID:_userIdNum
            },
            success:function(result){

                if(result){

                    if(result.stations){

                        _stationArr.length = 0;

                        var str = '<option value="">全部</option>';

                        for(var i=0;i<result.stations.length;i++ ){

                            _stationArr.push(result.stations[i]);

                            str += '<option value="' + result.stations[i].departNum + '">' + result.stations[i].departName + '</option>';

                        }

                        $('#chejian').empty().append(str);


                    }

                    if(result.wxBanzus){

                        _wxArr.length = 0;

                        var str = '<option value="">全部</option>';

                        for(var i=0;i<result.wxBanzus.length;i++){

                            _wxArr.push(result.wxBanzus[i]);

                            str += '<option value="' + result.wxBanzus[i].departNum + '">' + result.wxBanzus[i].departName + '</option>';

                        }

                        $('#banzu').empty().append(str);

                    }

                }


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //设备
    function DevList(url,el1,el2,attrNum,attrName,arr){

        var prm ={
            //当前用户id
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName,
        };
        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(arr){

                    arr.length = 0;

                    for(var i=0;i<result.length;i++){

                        arr.push(result[i]);

                    }

                }

                var str = '<option value="">全部</option>';

                var str1 = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i][attrNum] + '">' + result[i][attrName] + '</option>';

                    str1 += '<option value="' + result[i][attrNum] + '">' + result[i][attrName] + '</option>'
                }

                el1.empty().append(str);

                el2.empty().append(str1);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    }

    //初始化
    function detailInit(){

        //设备编码（旧）
        deveVue.sbbm = '';
        //设备名称
        deveVue.mingcheng = '';
        //拼音简码
        deveVue.pinyin = '';
        //设备编码（新）
        deveVue.xsbbm = '';
        //出厂编号
        deveVue.bianhao = '';
        //车务段
        $('#sbqy').val('');
        //车站
        $('#sbbm').val('');
        //设备系统
        $('#sbxt').val('');
        //设备类别
        $('#sblx').val('');
        //产地
        deveVue.chandi = '';
        //状态
        deveVue.zhuangtai = '';
        //安装位置
        deveVue.weizhi = '';
        //品牌
        deveVue.pingpai = '';
        //规格型号
        deveVue.guige = '';
        //供应商
        deveVue.gongyingshang = '';
        //生产商
        deveVue.shengchanshang = '';
        //使用年限
        deveVue.nianxian = '';
        //保修期
        deveVue.baoxiu = '';
        //购置日期
        $('#gouzhi').val('');
        //安装日期
        $('#anzhuang').val('');
        //设备原值
        $('#yuanzhi').val('');
        //描述
        $('#miaoshu').val('');
        //查看二维码
        $('.QRcode').hide();

    }

    //可操作
    function abledOption(){

        $('#myApp33').find('input').attr('disabled',false).removeClass('disabled-block');

        $('#myApp33').find('input').parent().removeClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#myApp33').find('textarea').attr('disabled',false).removeClass('disabled-block');

        $('.lujing').attr('disabled',false).removeClass('disabled-block');

        //上传图片部分按钮隐藏
        $('#uploader').show();
    }

    //不可操作
    function disabledOption(){

        $('#myApp33').find('input').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('input').parent().addClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('textarea').attr('disabled',true).addClass('disabled-block');

        $('.lujing').attr('disabled',true).addClass('disabled-block');

        //上传图片部分按钮隐藏
        $('#uploader').hide();

    }

    //获取要传递给后台的维修班组集合
    function getPostTrain(id1,id2){
        var postArr = [];
        //维修班组为全部时
        if(id2 == 0){
            //如果车间为全部时
            if(id1 == 0){
                return [];
            }else{
                $(DPartArr).each(function(i,o){
                    if(o.departNum == id1){
                        $(o.wxBanzus).each(function(i,o){
                            postArr.push(o.departNum);
                        })

                    }
                });
            }
        }else{
            postArr.push(id2);
        }

        return postArr
    }

    //提交更改后跳转到当前页
    function jumpNow(tableId,arr){

        if(arr.length > 0){
            arr.reverse();
        }

        var dom ='#'+ tableId[0].id + '_paginate';
        //console.log(dom);
        var txt = $(dom).children('span').children('.current').html();

        _datasTable(tableId,arr);
        var num = txt - 1;
        var dom = $(dom).children('span').children().eq(num);
        //console.log(txt);
        //console.log(dom);
        dom.click();
    };

    //数据绑定
    function bindData($this){

        //样式
        $('#browse-datatables tbody').children('tr').removeClass('tables-hover');

        $this.parents('tr').addClass('tables-hover');

        //确定编码
        var $thisNum = $this.parents('tr').find('.dNum').children('span').html();

        _thisRowBM = $thisNum;

        for(var i=0;i<_allDateArr.length;i++){

            if(_allDateArr[i].dNum == $thisNum){
                //当前设备id
                _thisRowID = _allDateArr[i].id;
                //设备编码（旧）
                deveVue.sbbm = _allDateArr[i].dNum;
                //设备编码（新）
                deveVue.xsbbm = _allDateArr[i].dNewNum;
                //设备名称
                deveVue.mingcheng = _allDateArr[i].dName;
                //拼音简码
                deveVue.pinyin = _allDateArr[i].dPy;
                //出厂编号
                deveVue.bianhao = _allDateArr[i].factoryNum;
                //车务段
                $('#sbqy').val(_allDateArr[i].daNum);
                //车站
                $('#sbbm').val(_allDateArr[i].ddNum);
                //设备系统
                $('#sbxt').val(_allDateArr[i].dsNum);
                //设备类别
                $('#sblx').val(_allDateArr[i].dcNum);
                //产地
                deveVue.chandi = _allDateArr[i].devOrigin;
                //状态
                deveVue.zhuangtai = _allDateArr[i].status;
                //安装位置
                deveVue.weizhi = _allDateArr[i].installAddress;
                //品牌
                deveVue.pingpai = _allDateArr[i].brand;
                //规格型号
                deveVue.guige = _allDateArr[i].spec;
                //供应商
                deveVue.gongyingshang = _allDateArr[i].supName;
                //生产商
                deveVue.shengchanshang = _allDateArr[i].prodName;
                //使用年限
                deveVue.nianxian = _allDateArr[i].life;
                //保修期
                deveVue.baoxiu = _allDateArr[i].maintain;
                //购置日期
                $('#gouzhi').val(timeForma(_allDateArr[i].purDate));
                //安装日期
                $('#anzhuang').val( timeForma(_allDateArr[i].installDate));
                //设备原值
                $('#yuanzhi').val(_allDateArr[i].devMoney);
                //描述
                $('#miaoshu').val(_allDateArr[i].description);
                //路径
                //文件路径
                var pathName = '';
                var pathArr = _allDateArr[i].docPath.split('\\');
                for(var j=0;j<pathArr.length;j++){
                    pathName = pathArr[j]
                }
                $('.lujing').html(pathName);
            }

        }

    }

    //登记、编辑、删除功能flag = true,登记，编辑，flag = false删除
    function buttonOption(url,flag,successMeg,errorMeg){

        if(flag){

            var prm = {

                //设备名称
                'dName':deveVue.mingcheng,
                //设备编码
                'dNum':deveVue.sbbm,
                //拼音简码
                'dPy':deveVue.pinyin,
                //出厂编号
                'factoryNum':deveVue.bianhao,
                //车务段编码
                'daNum':$('#sbqy').val(),
                //车务段名称
                'daName':($('#sbqy').val() == '')?'':$.trim($('#sbqy option:selected').html()),
                //车站编码
                'ddNum':$('#sbbm').val(),
                //车站名称
                'ddName':($('#sbbm').val() == '')?'':$.trim($('#sbbm option:selected').html()),
                //设备系统
                'dsNum':$('#sbxt').val(),
                //设备系统名称
                'dsName':($('#sbxt').val() == '')?'':$.trim($('#sbxt option:selected').html()),
                //设备类别
                'dcNum':$('#sblx').val(),
                //设备类别名称
                'dcName':($('#sblx').val() == '') ? '' : $.trim($('#sblx option:selected').html()),
                //产地
                'devOrigin':deveVue.chandi,
                //状态
                'status':deveVue.zhuangtai,
                //安装位置
                'installAddress':deveVue.weizhi,
                //品牌
                'brand':deveVue.pingpai,
                //规格型号
                'spec':deveVue.guige,
                //供应商
                'supName':deveVue.gongyingshang,
                //生产商
                'prodName':deveVue.shengchanshang,
                //使用年限
                'life':deveVue.nianxian,
                //保修期
                'maintain':deveVue.baoxiu,
                //购置日期
                'purDate':$('#gouzhi').val(),
                //安装日期
                'installDate':$('#anzhuang').val(),
                //设备原值
                'devMoney':$('#yuanzhi').val(),
                //描述
                'description':$('#miaoshu').val(),
                //设备编码（新）
                'dNewNum':deveVue.xsbbm,
                //文件路径
                'docPath':$('.lujing').html(),
                //当前用户
                'userID':_userIdNum

            }

            if(_thisRowID){

                prm.id = _thisRowID

            }

        }else{

            var prm = {

                //id
                'id':_thisRowID,
                //编码
                'dNum':deveVue.sbbm,
                //当前用户
                'userID':_userIdNum

            }

        }

        $.ajax({

            type:'post',
            url:_urls + url,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

                //if($('.modal-backdrop').length > 0){
                //
                //    $('div').remove('.modal-backdrop');
                //
                //    $('#theLoading').hide();
                //}

            },
            data:prm,
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,successMeg, '');

                    conditionSelect();

                    $('#myModal').modal('hide');

                }else{

                    conditionSelect();

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,errorMeg, '');

                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //清除loadding
                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'超时!', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请求失败!', '');

                }

            }

        })



    }

    //时间格式处理
    function timeForma(time){
        return time.split(' ')[0].replace(/-/g,'/');
    }

    //动态获取指定的设备类型或者车务段
    function getAllContent(id,arr,flag){
        var getArr = [];
        if(flag){
            $(arr).each(function(i,o){

                if(id == o.dsNum){
                    var pushArr = o.devClasss;
                    $(pushArr).each(function(i,o){
                        var obj = {};
                        obj.text = o.dcName;
                        obj.value = o.dcNum;
                        getArr.push(obj)
                    });
                    return getArr;
                }
            });
        }else{
            $(arr).each(function(i,o){

                if(id == o.daNum){
                    var pushArr = o.devDeps;
                    $(pushArr).each(function(i,o){
                        var obj = {};
                        obj.text = o.ddName;
                        obj.value = o.ddNum;
                        getArr.push(obj)
                    });
                    return getArr;
                }
            });
        }
        return getArr

    }

    //安装时间处理

    function installTime(str){

        return str.split(' ')[0]

    }

    /*-----------------------------------------------------文件上传--------------------------------------------*/

    //文件上传
    var $list=$("#thelist");//上传区域

    var $btn =$("#ctlBtn");//上传按钮

    //初始化设置
    var uploader = WebUploader.create({
        //选完文件是否上传
        /*auto:true,*/
        //swf的路径
        swf:'webuploader/Uploader.swf',
        //文件接收服务端
        server: _urls + 'YWDev/ywDevFileUploadProgress',
        pick: {
            id:'#picker',
            //multiple:false
        },
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        //添加多个
        //fileNumLimit:1,
        //thumb
        thumb:false,
        //是否可选择同一文件
        duplicate:true
    });

    uploader.on( 'beforeFileQueued',function(file){
        if( uploader.getFiles().length >0){
            //就不要再往队列里添加了
            uploader.reset();
            uploader.addFiles( file );
        }
    } );

    //添加东西之后判断是否能预览，如果是图片能预览，否则反之，
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<div class="info">' + file.name + '</div>' +
                '<p class="state">等待上传...</p>' +
                '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.html( $li );
    });

    //文件上传进度
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );
    });

    //文件成功，失败处理
    uploader.on( 'uploadSuccess', function( file,response ) {
        _currentPath = response;
        $('.lujing').html(_currentPath);
        $( '#'+file.id ).find('p.state').text('已上传');
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错');
    });

    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });

    $btn.click(function(){
        uploader.upload();
    })

})