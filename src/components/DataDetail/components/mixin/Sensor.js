import {LineChart} from '@/components/Charts'

export default {
    components: {
        LineChart,
    },
    props: {
        assetType: Number,
    },
    data() {
        return {
            options: [
                    {value: 'co',label: '一氧化碳'}, 
                    {value: 'infrared',label: '红外数据'}, 
                    {value: 'liquid',label: '液位数据'}, 
                    {value: 'batteryA',label: '电池电流'}, 
                    {value: 'shake',label: '震动数据'}, 
                    {value: 'node433',label: '433M节点参数'}, 
                    {value: 'signal',label: '信号强度'}, 
                    {value: 'CBTemp',label: '板子自身温度'}
                ],
            value: 'co',
            time: [
                this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), 
                this.$moment().format('YYYY-MM-DD')
            ],
            allData:[],
            timeArray:[],
            currentValue:[],
        }
    },
    computed: {
        assetObj() {
            return JSON.parse(sessionStorage.getItem('obj'));
        }
    },
    methods: {
        //切换变量
        changeParam(val){
            this.currentValue = this.allData[val];
        },
        //切换日期
        changeDate(date){
            this.time = [date[0],date[1]];
            this.getS800History();
        },
        //匹配名称&单位
        match(name,flag){
            let design;
            let unit;
            switch (name) {
                case 'co':
                    design = "一氧化碳";
                    unit = "%"
                    break;
                case 'infrared':
                    design = "红外数据";
                    unit = ""
                    break;
                case 'liquid':
                    design = "液位数据";
                    unit = ""
                    break;
                case 'batteryA':
                    design = "电池电流";
                    unit = "V"
                    break;
                case 'shake':
                    design = "震动数据";
                    unit = ""
                    break;
                case 'node433':
                    design = "433M子节点参数更新状态";
                    unit = ""
                    break;
                case 'signal':
                    design = "信号强度";
                    unit = "dbm"
                    break;
                case 'CBTemp':
                    design = "板子自身温度";
                    unit = "℃"
                    break;
                default:
                    break;
            }
            if(flag) return design;
            return unit
        },
        //获取数据状态
        getStatus(name,value){
            let status;
            switch (name) {
                case 'infrared':
                    value.value==0?status='正常':status='有人'
                    break;
                case 'liquid':
                    value.value==0?status='正常':status='进水'
                    break;
                case 'shake':
                    value.value==1?status='震动':status='静止'
                    break;
                case 'node433':
                    value.value==1?status='成功':status='失败'
                    break;
                default:
                    status = value.value
                    break;
            }
            return status;
        },
        //infrared & liquid :0正常 ,1异常
        //shake : 1异常 2正常
        //node433 :1正常 ,2异常
        renderColor(name,value){
            const arr = ['infrared','liquid','shake','node433'];
            if(!arr.includes(name))return'';
            if(name==='infrared'||name==='liquid'||name==='shake'){
                if(value.value==1) return '#f56c6c';
            }
            if(name==='node433'){
                if(value.value==2) return '#f56c6c';
            }
        }
    }
}