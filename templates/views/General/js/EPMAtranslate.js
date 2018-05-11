
var _chineseArr = ['冷量(KW)','冷机功率(KW)','散热量(KW)','热不平衡率(%)','冷机','冷冻泵','冷却泵','冷却塔','冷站能效','冷站总电','冷站总冷'];

var _EnglishArr = ['Coolant output capacity','Coolant power','Heat Dissipating index','Thermal unbalance rate','Chiller',

                    'Condensate pump','Coolant pump','Coolant tower','Energy efficiency of cold station','Total power of cold station',

                    'Cold station total cooling '

                    ];

function __setTranslate(dataArr){

    var arr = [];

    for(var i=0;i<_chineseArr.length;i++){

        for(var j=0;j<dataArr.length;j++){

            if(dataArr[j] == _chineseArr[i]){

                arr.push(_EnglishArr[i]);

            }

        }

    }

    return arr;

}