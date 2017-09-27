$(function(){
    //受理时间
    _timeYMDComponentsFun($('.datatimeblock'));

    //维修班组数组
    var _wxArr = [];

    //车间
    var _cheArr = [];

    //车间
    influencingUnit();
    //_getProfession('YWGD/ywGDGetWxBanzuStation',$('#yxdw'),'stations','departNum','departName');

    //表格初始化
    var col=[
        {
            title:'序号',
            className:'sn',
            render:function(data, index, row, meta){
                return meta.row + 1;
            }

        },
        {
            title:'平台',
            data:'gdCodeSrc',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '路局'
                }else{
                    return '江铁实业'
                }
            }
        },
        {
            title:'原因分类',
            data:'dengyyStr'
        },
        {
            title:'工单号',
            data:'gdCode2'
        },
        {
            title:'系统名称',
            data:'wxShiX'
        },
        {
            title:'车间',
            data:'wxKeshiParent'
        },
        {
            title:'车站',
            data:'wxKeshi'
        },
        {
            title:'受理时间',
            data:'shouLiShij'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'最新处理情况',
            data:'lastUpdateInfo'
        }
    ];
    //序列号计算
    //var drawCallback = function (){
    //    var api = this.api();
    //    //var startIndex= api.context[0]._iDisplayStart;//获取到本页开始的条数
    //    //api.column(0).nodes().each(function(cell, i) {
    //    //
    //    //    //此处 startIndex + i + 1;会出现翻页序号不连续，主要是因为startIndex 的原因,去掉即可。
    //    //    //cell.innerHTML = startIndex + i + 1;
    //    //
    //    //    cell.innerHTML =  i + 1;
    //    //
    //    //});
    //    console.log(api);
    //    //var lengths = $('#scrap-datatables').children('tbody').children('tr').length;
    //    //var num=0;
    //    //for(var i=0;i<lengths;i++){
    //    //    num ++;
    //    //    $('#scrap-datatables').children('tbody').children('tr').eq(i).children('td').eq(0).html(num);
    //    //}
    //}
    _tableInit($('#scrap-datatables'),col,'1','flag','','');

    //等待原因数组
    var _ddArr = [];
    //表格数据
    dengyy();
    /*-------------------------------------按钮方法------------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect()
    })

    //重置按钮功能
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');
        var inputs = parents.find('input');
        inputs.val('');
        //时间置为今天
        //$('.datatimeblock').val(_initStart);
        $('.returnZero').val(0);
        $('.returnEmpty').val('');
    })

    /*-------------------------------------其他方法-------------------------------------------*/
    //条件查询
    function conditionSelect(){
        if($('.datatimeblock').eq(0).val() == ''){
            slrealityStart = ''
        }else{
            slrealityStart = moment($('.datatimeblock').eq(0).val()).format('YYYY/MM/DD') + ' 00:00:00';
        }
        if($('.datatimeblock').eq(1).val() == ''){
            slrealityEnd = ''
        }else{
            slrealityEnd = moment($('.datatimeblock').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }
        //if($('.datatimeblock').eq(2).val() == ''){
        //    bhrealityStart = ''
        //}else{
        //    bhrealityStart = moment($('.datatimeblock').eq(2).val()).format('YYYY/MM/DD') + ' 00:00:00';
        //}
        //if($('.datatimeblock').eq(3).val() == ''){
        //    bhrealityEnd = ''
        //}else{
        //    bhrealityEnd = moment($('.datatimeblock').eq(3).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        //}

        var prm2 ={
            gdCode2:$('#gdcode').val(),
            gdSt:slrealityStart,
            gdEt:slrealityEnd,
            //gdGuanbiSt:bhrealityStart,
            //gdGuanbiEt:bhrealityEnd,
            gdZht:$('#gdzt').val(),
            gdJJ:$('#gdlx').val(),
            dlNum:$('#line').val(),
            gdLeixing:$('#rwlx').val(),
            userID:_userIdNum,
            userName:_userIdName,
            isCalcTimeSpan:1,
            wxShiXNum:$('#xtlx').val(),
            gdCodeSrc:$('#gdly').val()
        };
        var userArr = [];
        var cheArr = [];
        if($('#yxdw').val() != ''){
            for(var i=0;i<_cheArr.length;i++){
                if( $('#yxdw').val() == _cheArr[i].departNum ){
                    for(var j = 0;j<_cheArr[i].wxBanzus.length;j++){
                        userArr.push(_cheArr[i].wxBanzus[j].departNum);
                    }
                }
            }
            prm2.wxKeshis = userArr;
        }else if($('#yxdw').val() == ''){
            for(var i=0;i<_cheArr.length;i++){
                for(var j=0;j<_cheArr[i].wxBanzus.length;j++){
                    userArr.push(_cheArr[i].wxBanzus[j].departNum);
                }
            }
            //prm2.wxKeshis = userArr;
        }else{
            prm2.wxKeshi = $('#userClass').val();

        }
        if( $('#line').val() != '' && $('#station').val() == ''){
            var values = $('#line').val();
            for(var i=0;i<_lineArr.length;i++){
                if( values == _lineArr[i].dlNum ){
                    for(var j=0;j<_lineArr[i].deps.length;j++){
                        cheArr.push(_lineArr[i].deps[j].ddNum);
                    }
                }
            }
            prm2.bxKeshiNums = cheArr;
        }else if($('#line').val() == '' && $('#station').val() == ''){
            for(var i=0;i<_lineArr.length;i++){
                for(var j=0;j<_lineArr[i].deps.length;j++){
                    cheArr.push(_lineArr[i].deps[j].ddNum);
                }

            }
            prm2.bxKeshiNums = cheArr;
        }else{
            prm2.bxKeshiNum = $('#station').val();
        }
        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDRptGetZh2',
            data:prm2,
            async:false,
            success:function(result){
                _datasTable($("#scrap-datatables"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //等待原因分类
    function dengyy(){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDengdyy',
            data:{
                userID:_userIdNum,
                userName:_userIdName
            },
            timeout:_theTimes,
            success:function(result){
                console.log('111111111111111111111111');
                _ddArr.length = 0;
                for(var i=0;i<result.length;i++){
                    _ddArr.push(result[i]);
                    conditionSelect();
                };
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获得所有维保组、维修班组
    function influencingUnit(){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetWxBanzuStation',
            data:{
                userID : _userIdNum,
                userName :_userIdName
            },
            timeout:_theTimes,
            success:function(result){
                //console.log(result);
                _wxArr = [];
                _cheArr = [];
                //车站
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.stations.length;i++){
                    _cheArr.push(result.stations[i]);
                    str += '<option value="' + result.stations[i].departNum +
                        '">' + result.stations[i].departName + '</option>'
                }
                $('#yxdw').empty().append(str);
                //维修班组
                for(var i=0;i<result.wxBanzus.length;i++){
                    _wxArr.push(result.wxBanzus[i]);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }
})