/**
 * Created by admin on 2017/5/23.
 */
$('.chooseDate-month').datepicker(
    {
        startView: 1,
        maxViewMode: 2,
        minViewMode:1,
        language:  'zh-CN',
        todayHighlight: 1,
        format: 'yyyy-mm'
    }
);
//选择日期插件
$('.chooseDate').datepicker(
    {
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy-mm-dd'
    }
);