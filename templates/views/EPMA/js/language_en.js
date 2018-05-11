
$(function(){

    var _Lhref = window.location.href;

    var _Lname = _Lhref.split('/')[_Lhref.split('/').length-1];

    //数据总览
    if(_Lname == 'main.html'){

        //整体能效

        //冷量单价
        $('#spanEPrice_Misc').html('RTH');
        //冷站输出冷量
        $('#lznowlvMisc').html('RT');
        //冷站散热量
        $('#lzsrlvMisc').html('RT');
        //冷站输入功率
        $('#lznowp').next().html('RT');

        //分项实时能效
        //右上角说明（单位）
        $('#itemizeMisc').html('KW/RT');

        //实时数据
    }else if(_Lname == 'monitor.html'){

        //单位都是后台返回的无法处理

        //能效日历
    }else if( _Lname == 'calendar.html' ){

        //冷战能效日历
        $('#cmisc').html('RTH');

        //冷量单价
        $('#lluntil').html('RTH');

        //能效对比

        //冷量
        $('#eer_com_c_misc').html('RTH');

        //冷量单价
        $('#eer_com_cpirceV_misc').html('RTH');

        //参数分析
    }else if( _Lname == 'abbr.html' ){

        //无
        //能效对比
    }else if( _Lname == 'compare.html' ){

        //无
        //负荷分析
    }else if( _Lname == 'rate.html' ){

        //无
        //能效排名
    }else if( _Lname == 'rank.html' ){

        //无

        //计费方案
    }else if( _Lname == 'epgr.html' ){

        $('.Luntil').html('RTH')

    }

})

