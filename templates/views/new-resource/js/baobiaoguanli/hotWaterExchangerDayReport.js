$(function(){

    /*------------------------------时间插件--------------------------*/

    var nowTime = moment().format('YYYY/MM/DD');

    //默认时间
    $('.datatimeblock').val(nowTime);

    //时间插件初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //导出时间
    var excelTime = nowTime;

    //记录获取到的设备的数组
    var _allData = [];

    //获取楼宇
    _pointerData();

    //获取能源站
    areaData();


    /*------------------------------按钮事件---------------------------*/

    $('#selected').click(function(){

        tableInit();

        conditionSelect($('#pointer').val());

    })

    //切换设备
    $('#dev').change(function(){

        $('#theLoading').modal('show');

        //表格初始化

        tableInit();

        dataByName($('#dev').children('option:selected').html());

        $('#theLoading').modal('hide');

    })

    /*----------------------------其他方法-----------------------------*/

    function conditionSelect(pointer){

        var prm = {

            //楼宇id
            pId:pointer,

            //能源站
            AREA:$('#area').val(),

            //时间
            sp:$('.datatimeblock').val()

        };

        _mainAjaxFun('post','MultiReportRLgs/GetReportRHRBRLgs',prm,successFun);


    }

    function successFun(result){

        if(result.code == 0){

            _allData.length = 0;

            //首先将设备的下拉框赋值

            var str = '';

            for(var i=0;i<result.master.length;i++){

                str += '<option>' + result.master[i].eqname + '</option>';

                _allData.push(result.master[i]);

            }

            $('#dev').empty().append(str);

            //根据名称，获取表格数据
            dataByName($('#dev').val());

        }


    }

    function dataByName(name){

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].eqname == name){

                //报表名称
                $('#table-titleH').html(_allData[i].report_Name);
                //数据时间
                $('.data-time').html(_allData[i].report_Dt);
                //导出时间
                excelTime = moment().format('YYYY/MM/DD');
                $('.derive-time').html(excelTime);
                //位置
                $('#location').html(_allData[i].location);
                //设备
                $('#eqName').html(_allData[i].eqname);
                //循环数据
                if(_allData[i].report_list.length>0){

                    //将属性重新排列

                    var str = '';

                    for(var j=0;j<_allData[i].report_list.length;j++){

                        str += '<tr>';

                        //遍历属性，生成td j是属性
                        for(var k in _allData[i].report_list[j] ){

                            str += '<td>' + _allData[i].report_list[j][k] +'</td>';

                        }

                        str +='</tr>'


                    }

                    $('.table').find('tbody').empty().append(str);

                }

            }

        }

    }

    //获得能源站
    function areaData(){

        $.ajax({

            type:'get',

            url:_urls + 'MultiAreaHistory/GetChillAREAs',

            success:function(result){

                if(result.length>0){

                    var str  = '';

                    for(var i=0;i<result.length;i++){

                        if(result[i].grp == 'H'){

                            str += '<option value="' + result[i].tag + '" data-attr="' + result[i].item + '">' + result[i].name + '</option>';

                        }

                    }

                    $('#area').empty().append(str);

                    conditionSelect(sessionStorage.PointerID);

                }

            },

            error:_errorFun

        })

    }

    //表格初始化
    function tableInit(){

        //报表名称
        $('#table-titleH').html('');
        //数据时间
        $('.data-time').html('');
        //导出时间
        $('.derive-time').html('');
        //位置
        $('#location').html('');
        $('#eqName').html('');
        //表格初始化
        $('.table tbody').empty();

    }

})