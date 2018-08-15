/**
 * Created by admin on 2018/6/20.
 */

//定义页面中子系统诊断配置
var showSubsystemDataArr = [

    {
        id:'1',
        name:'重要用电支路供电三相电压考核',
        diagItemNum:'ThreeVoltage',
        url :'OneKeyDiag/GetThreeVoltageDetailData',
        echartName1:'当前数据',
        echartName2:'指标数据'
    },
    {
        id:'2',
        name:'重要用电支路供电电压考核',
        diagItemNum:'ElecVoltage',
        url :'OneKeyDiag/GetElecVoltageDetailData',
        echartName1:'当前数据',
        echartName2:'指标数据'
    },
    {
        id:'3',
        name:'重要用电支路供电频率偏差考核',
        diagItemNum:'ElecFrequency',
        url :'OneKeyDiag/GetElecFrequencyDetailData',
        echartName1:'当前数据',
        echartName2:'指标数据'
    },
    {
        id:'4',
        name:'变电所动环温度偏高考核',
        diagItemNum:'RotarySysDiag',
        url :'OneKeyDiag/GetDevTypeRotarySysDetailData',
        echartName1:'当前数据',
        echartName2:'指标数据'
    },
    {
        id:'5',
        name:'某设备某监测点报警',
        diagItemNum:'DevTypeSysEnum',
        iflegend:1,
        url :'OneKeyDiag/GetDevTypeSysEnumDetailData',
        echartName1:'当前数据',
        echartName2:'指标数据'
    }
];

//获取当前诊断类型下某个配置项的id
function getConfigId(dataArr,diagItemNum){

    var id = 1;

    //遍历配置数据
    $(dataArr).each(function(i,o){

        if(o.diagItemNum == diagItemNum){

            id = o.id;

            return false;
        }

    });

    return id;
}