<template>
    <div>
        <div class="magicList">
            <el-row :gutter="20">
                <el-col :span="6" v-for="(value,name) in magicData" :key="name" :xs="12">
                    <div >
                        <Gauge 
                            :value="{name,value}"
                        />
                    </div>
                </el-col>
            </el-row>
            
        </div>
        <el-divider content-position="left">魔节历史数据</el-divider>
        <div>
            <div class="seletGroup">
                <el-form label-position="top">
                    <el-form-item label="环境变量:">
                        <el-select v-model="value" @change="changeParam">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间段:">
                        <el-date-picker
                            v-model="time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :clearable="false"
                            @change="changeDate"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="icon">
                    <i class="el-icon-download"></i>
                </div>
            </div>
            <LineChart
                id="MagicLine"
                :value="currentValue"
                :timeArray="timeArray"
            />
        </div>
    </div>
</template>

<script>
    import {Gauge,LineChart} from '@/components/Charts'
    import { mapActions } from 'vuex'

    export default {
        components: {
            Gauge,
            LineChart
        },
        props: {
            magicData: {
                type: Object,
                default: ()=>{}
            },
        },
        data() {
            return {
                options: [
                        {value: "temp",name: '环境温度'}, 
                        {value: "hum",name: '环境湿度'}, 
                        {value: "o2",name: '氧气含量'}, 
                        {value: "h2s",name: '硫化氢'}, 
                        {value: "co",name: '一氧化碳'}, 
                        {value: "ch4",name: '烷类'}, 
                        {value: "o3",name: '臭氧'}, 
                        {value: "bat",name: '电池电压'}
                    ],
                value: "temp",
                time: [new Date(), new Date()],
                allData:[],
                timeArray:[],
                currentValue:[]
            }
        },
        computed: {
            assetObj() {
                return JSON.parse(sessionStorage.getItem('obj'));
            }
        },
        methods: {
            ...mapActions('equip',[

            ]),
            //切换变量
            changeParam(val){
                // this.currentValue = this.allData[val];
            },
            //切换日期
            changeDate(date){
                this.time = [new Date(date[0]),new Date(date[1])];
                // this.getLineHistory();
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>