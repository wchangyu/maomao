//医废状态
function _YFstatus(value){

    if(value == 10){

        return '运送中'

    }else if(value == 20){

        return '库存中'

    }else if(value == 30){

        return '已出库'

    }else if(value == 100){

        return '报警';

    }else if(value == 999){

        return '取消'

    }

}