import { mapActions } from 'vuex';
import _ from 'lodash';
import { downFile} from '@/utils/methods'


export default {
    data() {
        return {
            time: [
                this.$moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'), 
                this.$moment().format('YYYY-MM-DD 23:59:59')
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
        ...mapActions('equip',[
            'getMagicHistoryData',
            'getTrapLineHistory',
            'getSensorHistoryData',
            'gets800HistoryData',
            'getMagicHistoryExecl',
            'getTrapHistoryExecl',
            'getS800HistoryExecl',
            'getSensorHistoryExecl',
        ]),
        //下载
        download: _.throttle(function(){
            if(!this.callJudge()) return;
            const msg = this.$message({
                iconClass:"el-icon-loading",
                dangerouslyUseHTMLString: true,
                message:`<strong class="loadingMsg">历史数据下载中...</strong>`,
                duration:0
            });
            const {id,trapId} = this.assetObj;
            const startTime = this.time[0];
            const endTime = this.time[1];
            this.callFun({
                assetId:trapId||id,
                assetType:this.assetType,
                startTime,
                endTime,
                key:this.value
            }).then(res=>{
                if(!res)return;
                msg.close();
                downFile(res);
            })
        },5000),
        //根据this.sign使用不同判断条件
        callJudge(){
            switch (this.sign) {
                case 'Magic':
                    return (this.magicData && this.magicData.bat) && this.timeArray.length ;
                case 'Tline':
                    return this.lineData.length && this.timeArray.length ;
                case 'S800':
                    return this.sEightData.length && this.timeArray.length;
                case 'Sensor':
                    return this.sensorData.length && this.timeArray.length;
                default:
                    console.log('null')
            }
        },
        //根据this.sign调用不同函数
        callFun(params){
            const { assetId, startTime , endTime } = params;
            switch (this.sign) {
                case 'Magic':
                    return this.getMagicHistoryExecl({
                        ...params,
                        deviceAddress:this.currentMagic.address,
                    });
                case 'Tline':
                    return this.getTrapHistoryExecl({
                        queryId:assetId,
                        startTime,
                        endTime,
                        key:this.value
                    });
                case 'S800':
                    return this.getS800HistoryExecl(params);
                case 'Sensor':
                    return this.getSensorHistoryExecl(params);
                default:
                    console.log('null')
            }
        },
        //切换变量
        changeParam(val){
            this.currentValue = this.allData[val] || [];
        },
    }
}