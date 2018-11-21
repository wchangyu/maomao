
//flag 真（全部） 假（请选择）
function _TMcategory(el,flag){

    _mainAjaxFunCompleteNew('post','YHQTM/TmxmClassGetAll','',false,function(result){

        if(result.code == 99){

            var str = '';

            if(flag){

                str += '<option value="">全部</option>'

            }else{

                str += '<option value="">请选择</option>'

            }

            for(var i =0;i<result.data.length;i++){

                var data = result.data[i];

                str += '<option value="' + data.tmclassnum + '">' + data.tmclassname + '</option>';

            }

            el.empty().append(str);

        }

    })

}