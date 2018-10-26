$(function(){

    var col = [

        {
            title:'设备编号',
            data:'SBBH'
        },
        {
            title:'设备名称',
            data:'SBMC'
        },
        {
            title:'类别',
            data:'LB'
        },
        {
            title:'品牌',
            data:'PP'
        },
        {
            title:'核心参数',
            data:'HXCS'
        },
        {
            title:'采购时间',
            data:'CGSJ'
        },
        {
            title:'安装位置',
            data:'AZWZ'
        },
        {
            title:'状态',
            data:'ZT'
        },
        {
            title:'LCEM',
            data:'',
            render:function(data, type, full, meta){

                var str = '<a href="LCEMJump.html"><img class="jump" src="img/LCEM.png" style="display: inline-block;width: 20px;height: 20px;"></a>'

                return str

            }

        },
        {
            title:'厂家电话',
            data:'Tel'
        }

    ]

    _tableInit($('#table'),col,'2','','','','','');

    var obj = [

        {
            "SBBH":"C1",
            "SBMC":"冷水机组",
            "LB":"制冷空调",
            "PP":"约克",
            "HXCS":"1100RT COP=6.5",
            "CGSJ":"2017.8",
            "AZWZ":"1#冷站",
            "ZT":"在用",
            "Tel":"15125439645"
        },
        {
            "SBBH":"C2",
            "SBMC":"冷水机组",
            "LB":"制冷空调",
            "PP":"约克",
            "HXCS":"1100RT COP=6.5",
            "CGSJ":"2017.8",
            "AZWZ":"2#冷站",
            "ZT":"停用",
            "Tel":"15125439645"
        },
        {
            "SBBH":"K1",
            "SBMC":"精密空调",
            "LB":"制冷空调",
            "PP":"艾默生",
            "HXCS":"G=12000m³/h，Q=150KW",
            "CGSJ":"2017.8",
            "AZWZ":"1#机房",
            "ZT":"在用",
            "Tel":"13121554589"
        },
        {
            "SBBH":"K2",
            "SBMC":"精密空调",
            "LB":"制冷空调",
            "PP":"艾默生",
            "HXCS":"G=12000m³/h，Q=150KW",
            "CGSJ":"2017.8",
            "AZWZ":"1#机房",
            "ZT":"在用",
            "Tel":"13121554589"
        },
        {
            "SBBH":"K3",
            "SBMC":"精密空调",
            "LB":"制冷空调",
            "PP":"艾默生",
            "HXCS":"G=12000m³/h，Q=150KW",
            "CGSJ":"2017.8",
            "AZWZ":"1#机房",
            "ZT":"在用",
            "Tel":"13121554589"
        },
        {
            "SBBH":"K4",
            "SBMC":"精密空调",
            "LB":"制冷空调",
            "PP":"艾默生",
            "HXCS":"G=12000m³/h，Q=150KW",
            "CGSJ":"2017.8",
            "AZWZ":"1#机房",
            "ZT":"在用",
            "Tel":"13121554589"
        }

    ]

    _datasTable($('#table'),obj);

})