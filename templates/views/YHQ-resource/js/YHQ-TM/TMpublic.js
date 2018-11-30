function _getTMStatus(data){

    var str = '';

    if(data == 10){

        str = '待下发'

    }else if(data == 20){

        str = '待分派'

    }else if(data == 30){

        str = '待执行'

    }else if(data == 40){

        str = '运送中'

    }else if(data == 50){

        str = '等待资源'

    }else if(data == 60){

        str = '待关单'

    }else if(data == 70){

        str = '任务关闭'

    }else if(data == 110){

        str = '申诉'

    }else if(data == 999){

        str = '任务取消'

    }

    return str;

}