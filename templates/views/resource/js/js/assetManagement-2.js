$(function(){

    /*------------------------------------------------------变量-------------------------------------------*/

    //所有设备的数组
    var _allDateArr = [];

    //所有车站的数组
    var _allDataBM = [];

    //所有类别的数组
    var _allDataLX = [];

    //车务段
    _getProfession('YWDev/ywDMGetDAs',$('#quyu'),false,'daNum','daName');

    //车站
    _ajaxFun('YWDev/ywDMGetDDs', _allDataBM, $('#sbbm'), 'ddName', 'ddNum');

    //字母查询形式的车站
    addStationDom($('#bumen').parent());

    //设备系统
    _getProfession('YWDev/ywDMGetDSs',$('#xitong'),false,'dsNum','dsName');

    //设备类别
    _ajaxFun('YWDev/ywDMGetDCs',_allDataLX,$('#leixing'),'dcName','dcNum');

    //获取车务段与车站对应的父子关系
    var _relativeArr2 = [];

    getSelectContent('YWDev/GetDevAreaGroupDep',_relativeArr2);

    //获取设备系统与设备类型对应的父子关系
    var _relativeArr1 = [];

    getSelectContent('YWDev/GetDevSysGroupClass', _relativeArr1);

    //事件插件
    _timeYMDComponentsFun($('.datatimeblock'));

    /*------------------------------------------------------表格初始化-------------------------------------*/

    var mainCol = [

        {
            title:'编号',
            data:'id',
            className:'ids',
            visible: false
        },
        {
            class:'checkeds',
            "targets": -1,
            "data": null,
            "defaultContent": "<div class='checker'><span><input type='checkbox'></span></div>"
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
            title:'所属车站',
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
        }

    ];

    _tableInit($('#scrap-datatables'),mainCol,1,true,'','','','');

    conditionSelect();

    /*------------------------------------------------------按钮事件--------------------------------------*/

    //车务段、车站联动
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

    //设备系统、设备类别联动
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

    //【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //【报废】
    $('#baofei').click(function(){

        var checked = $('#scrap-datatables tbody').children('.tables-hover');

        if(checked.length == 0 ){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请选择需要报废的设备！', '');

        }else{

            _moTaiKuang($('#myModal3'), '提示', '', 'istap' ,'确定要报废这些设备吗？', '报废');

            //类
            $('#myModal3').find('.modal-footer').children('.btn-primary').removeClass('recovery').addClass('scrap');

        }

    })

    //【恢复正常】
    $('#huifu').click(function(){

        var checked = $('#scrap-datatables tbody').children('.tables-hover');

        if(checked.length == 0 ){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请选择需要恢复的设备！', '');

        }else{

            _moTaiKuang($('#myModal3'), '提示', '', 'istap' ,'确定要恢复这些设备吗？', '恢复');

            //类
            $('#myModal3').find('.modal-footer').children('.btn-primary').removeClass('scrap').addClass('recovery');

        }

    })

    //【报废确定按钮】
    $('#myModal3').on('click','.scrap',function(){

        var checked = $('#scrap-datatables tbody').children('.tables-hover');

        var arr = [];

        for(var i=0;i<checked.length;i++){

            arr.push(checked.eq(i).find('.dNum').children().html());

        }

        var prm = {
            //选中的设备编码数组
            devNums:arr,
            //报废参数
            status:3,
            //当前用户名
            userID:_userIdNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWDev/ywDOptDev',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    conditionSelect();

                    $('#myModal3').modal('hide');

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'报废设备成功！', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'报废设备失败！', '');
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        })

    })

    //【恢复确定按钮】
    $('#myModal3').on('click','.recovery',function(){

        var checked = $('#scrap-datatables tbody').children('.tables-hover');

        var arr = [];

        for(var i=0;i<checked.length;i++){

            arr.push(checked.eq(i).find('.dNum').children().html());

        }

        var prm = {
            //选中的设备编码数组
            devNums:arr,
            //报废参数
            status:1,
            //当前用户名
            userID:_userIdNum
        }

        $.ajax({

            type:'post',
            url:_urls + 'YWDev/ywDOptDev',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            timeout:_theTimes,
            success:function(result){

                if(result == 99){

                    conditionSelect();

                    $('#myModal3').modal('hide');

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'恢复设备成功！', '');

                }else{

                    _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'恢复设备失败！', '');
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    myAlter("超时");
                }else{
                    myAlter("请求失败！");
                }

            }
        })

    })

    //表格点击事件
    $('#scrap-datatables tbody').on('click','tr',function(){

        if($(this).hasClass('tables-hover')){

            $(this).removeClass('tables-hover');

            $(this).find('input').parent('span').removeClass('checked');

        }else{

            $(this).addClass('tables-hover');

            $(this).find('input').parent('span').addClass('checked');

        }

    })



    /*------------------------------------------------------其他方法--------------------------------------*/
    //车务段所对应的的车站数组
    function getSelectContent(url,arr){

        $.ajax({
            type: 'get',
            url: _urls + url,
            timeout: _theTimes,
            success: function (data) {

                $(data).each(function(i,o){
                    arr.push(o);
                })
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {


                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                }else{

                }

            }
        });
    };

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
            //设备名称
            'dName':filterInput[0],
            //规格型号
            'spec':filterInput[1],
            //设备状态
            'status':$('#zhuangtai').val(),
            //车务段
            'daNum':$('#quyu').val(),
            //车站
            'ddNum':$('.add-input-select').children('span').attr('values'),
            //设备系统
            'dsNum':$('#xitong').val(),
            //设备类别
            'dcNum':$('#leixing').val(),
            //开始时间
            'st':realityStart,
            //结束时间
            'et':realityEnd,
            //车间
            'departNums':departNums,
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

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            success:function(result){

                for(var i=0;i<result.length;i++){

                    _allDateArr.push(result[i]);
                }

                jumpNow($('#scrap-datatables'),result);
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
})