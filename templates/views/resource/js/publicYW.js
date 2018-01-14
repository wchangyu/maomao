
/*-----------------------------------------------------变量---------------------------------------------*/

//线路的id:
var _LlineArr = [];

//线路数据
_LlineData();

//获取车站

if($('#station').length != 0){

    _getProfession('YWGD/ywGDGetWxBanzuStation',$('#station'),'wxBanzus','departNum','departName');

}

var _LworkshopObj = {};

//获取车间,维修班组
_LCJData();

/*----------------------------------------------------按钮事件------------------------------------------*/

//线点、车站联动
$('#linePoint').on('change',function(){

    for(var i=0;i<_LlineArr.length;i++){

        if($('#linePoint').val() == _LlineArr[i].dlNum){

            //车站联动
            var str = '<option value="">请选择</option>';

            for(var j=0;j<_LlineArr[i].deps.length;j++){

                str += '<option value="' + _LlineArr[i].deps[j].ddNum +
                    '">' + _LlineArr[i].deps[j].ddName + '</option>';

            }

            $('#station').empty().append(str);

        }

    }

})

//车间、班组联动
$('#workshop').on('change',function(){

    var str = '<option value="">请选择</option>';

    for(var i=0;i<_LworkshopObj.wxBanzus.length;i++){

        if($('#workshop').val() == _LworkshopObj.wxBanzus[i].parentNum){

            str += '<option value="' + _LworkshopObj.wxBanzus[i].departNum  +
                '">' + _LworkshopObj.wxBanzus[i].departName +
                '</option>'

        }

    }

    $('#group').empty().append(str);

})


/*----------------------------------------------------方法----------------------------------------------*/

//线路
function _LlineData(){

    $.ajax({

        type:'post',
        url:_urls + 'YWGD/ywGetDLines',
        data:{

            userID:_userIdNum,

            userName:_userIdName
        },
        timeout:_theTimes,
        success:function(result){

            var str ='<option value="">请选择</option>';

            _LlineArr.length = 0;

            for(var i=0;i<result.length;i++){

                str += '<option value="' + result[i].dlNum +
                    '">' + result[i].dlName + '</option>';

                _LlineArr.push(result[i]);

            }

            $('#linePoint').empty().append(str);

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }

    })

}

//车间、维修班组
function _LCJData(){

    $.ajax({

        type:'post',
        url:_urls + 'YWGD/ywGDGetWxBanzuStation',
        data:{

            userID:_userIdNum,

            userName:_userIdName
        },
        timeout:_theTimes,
        success:function(result){

            var str ='<option value="">请选择</option>';

            var str1 = '<option value="">请选择</option>';

            _LworkshopObj = result;

            //车间
            for(var i=0;i<result.stations.length;i++){

                str += '<option value="' + result.stations[i].departNum +
                    '">' + result.stations[i].departName + '</option>'

            }

            for(var i=0;i<result.wxBanzus.length;i++){

                str1 += '<option value="' + result.wxBanzus[i].departNum +
                    '">' + result.wxBanzus[i].departName + '</option>'

            }

            $('#workshop').empty().append(str);

            $('#group').empty().append(str1);

        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }

    })

}