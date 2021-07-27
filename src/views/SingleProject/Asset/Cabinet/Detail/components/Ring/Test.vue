<template>
    <div class="ring_test">
        <el-row :gutter="20">
            <el-col :span="14" :xs="24">
                <div class="left_box">
                    <ul>
                        <li v-for="(item,index) in switchList" :key="item.switchId" >
                            <div class="title">
                                <el-tooltip effect="dark" :content="item.switchAddress" placement="bottom">
                                    <span 
                                        @click="selectOutLine(index,item)" 
                                        :class="highlight===index&&'active'"
                                    >
                                        {{item.switchName}}
                                    </span>
                                </el-tooltip>
                            </div>
                        </li>
                    </ul>
                    <el-table
                        :data="data"
                        border
                        stripe
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                    >
                        <el-table-column
                            label="设备地址域"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>(row && row.deviceAdress) || '-'"
                        />
                        <el-table-column
                            label="名称"
                            align="center"
                            show-overflow-tooltip
                            :formatter="(row)=>(row && row.deviceName) || '-'"
                        />
                        <el-table-column
                            label="相序"
                            align="center"
                            width="60"
                            :formatter="(row)=>(row && row.outLineName) || '-'"
                        />
                        <el-table-column
                            label="标准数量(分钟差/采样周期)"
                            align="center"
                            prop="standard_count"
                        />
                        <el-table-column
                            label="实际数量"
                            align="center"
                            prop="real_count"
                        />
                        <el-table-column
                            label="丢包率"
                            align="center"
                            prop="packet_loss"
                        />
                    </el-table>
                </div>
            </el-col>
            <el-col :span="10" :xs="24">
                <div class="right_box">
                    <div>
                        <el-form 
                            label-position="top"
                            :model="form" 
                            class="form"
                        >   
                            <el-form-item label="时间选择">
                                <el-date-picker
                                    v-model="time"
                                    type="datetimerange"
                                    :default-time="['00:00:00', '23:59:59']"
                                    range-separator="至"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :clearable="false"
                                    @change="changeDate"
                                    :disabled="loading"
                                />
                            </el-form-item>
                            <el-form-item  label="采样周期(分,1-32)" >
                                <el-input-number 
                                    v-model="form.samplingPeriod" 
                                    :precision="0" 
                                    :min="1" 
                                    :max="32"
                                />
                            </el-form-item>
                            <el-form-item label="上报周期(倍,1-8)" >
                                <el-input-number 
                                    v-model="form.reportedPeriod" 
                                    :precision="0" 
                                    :min="1" 
                                    :max="8"
                                />
                            </el-form-item>
                            <el-form-item>
                                <el-button 
                                    type="primary" 
                                    @click="onSubmit"
                                    :disabled="loading"
                                >
                                    查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name:'Test',
        props: {
            switchList:{
                type:Array,
                default:()=>[]
            }
        },
        data() {
            return {
                highlight:0,
                data:[],
                time: [
                    this.$moment().subtract(0, 'days').format('YYYY-MM-DD 00:00:00'), 
                    this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                ],
                loading:false,
                form: {
                    samplingPeriod: 1,
                    reportedPeriod: 5
                },
                switchId:''
            }
        },
        mounted () {
            const { switchId, outLineList } = this.switchList[0];
            this.switchId = switchId;
            this.getRingHistory(switchId);
        },
        methods: {
            ...mapActions('equip',[
                'getRingHistoryData'
            ]),
            //选中出线
            selectOutLine(index,item) {
                if(index === this.highlight) return;
                this.highlight = index;
                this.switchId = item.switchId;
                this.getRingHistory(item.switchId);
            },
            //切换日期
            changeDate(date){
                if(!date)return;
                this.time = [date[0],date[1]];
            },
            onSubmit() {
                this.getRingHistory(this.switchId);
            },
            getRingHistory(switchId){
                this.loading = true;

                const [ startTime, endTime ] = this.time;
                this.getRingHistoryData({
                    deviceType: 36,
                    queryId:switchId,
                    startTime,
                    endTime
                }).then(res=>{
                    const { history } = res;
                    if( !res || !history ) return;

                    const outLineList = this.switchList.filter(item=>item.switchId == switchId)[0].outLineList;
                    this.data = outLineList.reduce((pre,cur)=>{
                        const currentCount = history.filter(item =>item.outLineName === cur.outLineName)[0].dataList.length;
                        //标准数量
                        const standardCount = this.getStandardCount();

                        
                        //丢包率 (实际数量 - 标准数量)/实际数量
                        const packet_loss = 
                            currentCount - standardCount > 0 ?
                            '0%':
                            // +(`${(standardCount - currentCount)/standardCount}`.match(/^\d+(?:\.\d{0,2})?/))*100 + '%'
                            (+(`${(standardCount - currentCount)/standardCount}`.match(/^\d+(?:\.\d{0,2})?/))*100).toFixed(2) + '%'

                        return [
                            ...pre,
                            {
                                ...cur,
                                standard_count:standardCount,
                                real_count:currentCount,
                                packet_loss
                            }
                        ]
                    },[])
                }).finally(res=>{
                    this.loading = false;
                })
            },
            //获取标准数量
            getStandardCount(){
                const [ startTime, endTime ] = this.time;

                //获取两个时间的分钟差
                const diff_minutes = Math.ceil(this.$moment(endTime).diff(startTime,'minutes'));

                /**
                 * 采样周期:每多少分钟采集一条节点数据; 
                 * 上报周期:上传多少条数据;
                 * 例如采样周期为32,上报周期为8,
                 * 每"32*8=256"分钟上报一次,每次数据中有8(上报周期)*4(个节点)节点数据.
                 * @param samplingPeriod 采样周期
                 */
                const { samplingPeriod } = this.form;

                // 两个时间的分钟差 / 采样周期
                return Math.ceil(diff_minutes / samplingPeriod) ;
            }
        },
    }
</script>

<style lang="scss" scoped>
    .ring_test{
        .left_box{
            ul{
                display: flex;
                flex-wrap: wrap;
                li{
                    margin-bottom: 10px;
                }
            }
            .title{
                span{
                    font-size: 0.8rem;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 5px 10px;
                    display: inline-block;
                    border-radius: 5px;
                    text-align: center;
                    width: 110px;
                }
                .active{
                    color: #fff;
                    background-color: rgb(54, 169, 225);
                }
            }
            @media screen and (max-width: 870px) {
                ul{
                    flex-wrap: wrap;
                }
            }
        }
        .right_box{}
    }
</style>