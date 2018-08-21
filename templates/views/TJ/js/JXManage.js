$(function(){

    var col = [

        {
            title:'维修部门',
            data:'WXBM'
        },
        {
            title:'任务量',
            data:'RWL'
        },
        {
            title:'很满意',
            data:'HMY'
        },
        {
            title:'满意',
            data:'MY'
        },
        {
            title:'一般',
            data:'YB'
        },
        {
            title:'差',
            data:'C'
        },
        {
            title:'很差',
            data:'HC'
        },
        {
            title:'未评价',
            data:'WPJ'
        },
        {
            title:'评价率',
            data:'PJL'
        },
        {
            title:'满意率',
            data:'MYL'
        }

    ]

    _tableInit($('#table'),col,1,true,'','','','');

    var arr = [

        {
            "WXBM":"水电班",
            "RWL":"235",
            "HMY":"4",
            "MY":"0",
            "YB":"0",
            "C":"0",
            "HC":"0",
            "WPJ":"231",
            "PJL":"1.70%",
            "MYL":"1.70%"

        },
        {
            "WXBM":"设备监控组",
            "RWL":"158",
            "HMY":"2",
            "MY":"1",
            "YB":"0",
            "C":"0",
            "HC":"1",
            "WPJ":"154",
            "PJL":"2.53%",
            "MYL":"1.90%"

        },
        {
            "WXBM":"设备维修科",
            "RWL":"40",
            "HMY":"1",
            "MY":"1",
            "YB":"0",
            "C":"0",
            "HC":"0",
            "WPJ":"39",
            "PJL":"2.50%",
            "MYL":"2.50%"

        },
        {
            "WXBM":"爱玛客",
            "RWL":"24",
            "HMY":"1",
            "MY":"0",
            "YB":"0",
            "C":"0",
            "HC":"0",
            "WPJ":"23",
            "PJL":"4.17%",
            "MYL":"4.17%"

        },
        {
            "WXBM":"后勤处（物业）",
            "RWL":"13",
            "HMY":"1",
            "MY":"0",
            "YB":"0",
            "C":"0",
            "HC":"0",
            "WPJ":"13",
            "PJL":"0.00%",
            "MYL":"0.00%"

        },
        {
            "WXBM":"后勤处（物业）",
            "RWL":"13",
            "HMY":"1",
            "MY":"0",
            "YB":"0",
            "C":"0",
            "HC":"0",
            "WPJ":"13",
            "PJL":"0.00%",
            "MYL":"0.00%"

        }


    ]

    _datasTable($('#table'),arr);

})