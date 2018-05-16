
//获取楼宇
function _pointerData(){

        var pointer = JSON.parse(sessionStorage.getItem('pointers'));

        var str = '';

        for(var i=0;i<pointer.length;i++){

            str += '<option value="' + pointer[i].pointerID + '">' + pointer[i].pointerName + '</option>';

        }

        $('#pointer').empty().append(str);

        $('#pointer').val(sessionStorage.PointerID);


    }

//获取能源站
function _areaData(el,callFun){

        $.ajax({

            type:'get',

            url:_urls + 'MultiAreaHistory/GetChillAREAs',

            success:function(result){

                if(result.length>0){

                    var str  = '';

                    for(var i=0;i<result.length;i++){

                        if(i == 0){

                            str += '<option value="' + result[i].tag + '" data-attr="' + result[i].item + '" selected>' + result[i].name + '</option>';

                        }else{

                            str += '<option value="' + result[i].tag + '" data-attr="' + result[i].item + '">' + result[i].name + '</option>';

                        }

                    }

                    el.empty().append(str);

                    callFun();

                }

            },

            error:_errorFun

        })

    }

$(function(){

    //导出
    $('.excelButton').click(function(){

        _exportExecl($('.table'));

    })

    //打印
    $('#print').click(function(){

        _printFun($(".table"));

    })

})