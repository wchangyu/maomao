$(function(){

    var col = [

        {
            title:'知识标题',
            data:'ZSBT'
        },
        {
            title:'分类',
            data:'FL'
        },
        {
            title:'摘要',
            data:'ZY'
        },
        {
            title:'关键词',
            data:'GJC'
        },
        {

            title:'附件个数',
            data:'FJGS'

        },
        {
            title:'录入时间',
            data:'LRSJ'
        }


    ]

    _tableInit($('#table'),col,1,true,'','','','');

    var arr = [

        {

            "ZSBT":"风机盘管处理步骤、耗时表",
            "FL":"",
            "ZY":"风机盘管处理步骤、耗时表",
            "GJC":"风机盘管处理步骤、耗时表",
            "FJGS":"1",
            "LRSJ":"2017/9/29 16:38:27"

        },
        {

            "ZSBT":"视频监控系统常见十六种故障的解决方法",
            "FL":"",
            "ZY":"综合视频监控系统",
            "GJC":"综合视频监控系统",
            "FJGS":"0",
            "LRSJ":"2017/9/20 14:54:49"

        },
        {

            "ZSBT":"水冷螺杆式冷水机组的常见故障及解决方法",
            "FL":"",
            "ZY":"空调系统",
            "GJC":"空调系统",
            "FJGS":"0",
            "LRSJ":"2017/9/20 14:53:24"

        },
        {

            "ZSBT":"LED显示屏故障排除及维护问题",
            "FL":"",
            "ZY":"导向系统",
            "GJC":"导向系统",
            "FJGS":"1",
            "LRSJ":"2017/9/20 14:16:06"

        },
        {

            "ZSBT":"中央空调的维护和保养",
            "FL":"",
            "ZY":"空调系统",
            "GJC":"空调系统",
            "FJGS":"1",
            "LRSJ":"2017/9/20 14:13:54"

        },
        {

            "ZSBT":"消防报警系统常见故障与排除",
            "FL":"",
            "ZY":"消防系统",
            "GJC":"消防系统",
            "FJGS":"1",
            "LRSJ":"2017/9/20 14:10:34"

        },
        {

            "ZSBT":"火灾自动报警系统",
            "FL":"",
            "ZY":"消防系统",
            "GJC":"消防系统",
            "FJGS":"1",
            "LRSJ":"2017/9/20 14:08:51"

        }


    ]

    _datasTable($('.table'),arr);

})