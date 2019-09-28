<template>
    <cc-table
        title="告警"
        :data="data"
        :total="total"
        :getList="getList"
    >   
        <template #header>
            <div class="alarmTool">
                <el-select v-model="value" placeholder="请选择" @change="changeStaus">
                    <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
                <el-date-picker
                    v-model="time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :clearable='false'
                    @change="changeTime"
                />
            </div>
        </template>
        <template>
            <el-table-column
                label="设备名称"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>row.deviceName||'---'"
            />
            <el-table-column
                label="设备EUI"
                align="center"
                sortable
                show-overflow-tooltip
                :formatter="(row)=>row.deviceEui||'---'"
            />
            <el-table-column
                label="告警详情"
                align="center"
            >
                <template slot-scope="scope" >
                    <span class="red">
                        {{scope.row.decodeHex}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="处理状态"
                align="center"
            >
                <template slot-scope="scope" >
                    <el-tag :type="!scope.row.status?'danger':'success'">
                        {{diffStatus(scope.row.status)}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="告警时间"
                align="center"
                :formatter="(row)=>this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')"
            />
        </template>
        <template #operation>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="linkTo(scope.row)"
                    >
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </template>
    </cc-table>
</template>

<script>
    import { mapActions } from 'vuex'
    
    export default {
        data() {
            return {
                time:[],
                value:null,
                status:[
                    {value:null,label:'全部'},
                    {value:0,label:'未处理'},
                    {value:1,label:'已处理'},
                    {value:2,label:'不予处理'},
                    {value:3,label:'延期处理'},
                ],
                data: [],
                total:0,
                params:{
                    projectId:JSON.parse(sessionStorage.getItem('project')).id,
                    size:20,    
                    current:1,   
                    status:null
                }
            }
        },
        methods: {
            ...mapActions('overall',[
                'getAlarmList', 
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                return this.getAlarmList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            linkTo(row) {
                sessionStorage.setItem('obj',JSON.stringify(row));
                this.$router.push({name:'Detail'})
            },
            //切换状态回调
            changeStaus(val){
                this.getList({
                    status:val
                })
            },
            //切换时间回调
            changeTime(time){
                const [startTime,endTime] =time;
                this.time = [startTime,endTime];
                this.getList({
                    startTime,
                    endTime
                })
            },
            diffStatus(status){
                const obj = {
                    0:'未处理',
                    1:'已处理',
                    2:'不予处理',
                    3:'延期处理'
                }
                return obj[status];
            }
        },
    }
</script>

<style lang="scss">
    .red{
        color: red;
    }
    .alarmTool{
        .el-select{
            padding-right: 20px;
            .el-input__inner{
                max-width: 150px !important;
            }
        }
        .el-input__inner{
            max-width: 300px !important;
        }
    }
</style>