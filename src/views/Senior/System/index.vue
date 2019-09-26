<template>
    <cc-table
        title="系统操作"
        :data="data"
        :total="total"
        :getList="getList"
        :hasAdd="false"
        :hasOpera="false"
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
                prop="name"
                label="操作名称"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope" >
                    <span>
                        {{scope.row.name==='create'?'创建':
                            scope.row.name==='update'?'修改':
                                scope.row.name==='delete'?'删除':'其他'}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="ip"
                label="操作IP"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                prop="operationTerrace"
                label="操作方式"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope" >
                    <span>
                        {{scope.row.operationTerrace===0?'web端':
                            scope.row.operationTerrace===1?'IOS':
                                scope.row.operationTerrace===2?'Android':
                                scope.row.operationTerrace===3?'API接口'
                                :'其他'}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="detail"
                label="操作详情"
                align="center"
                show-overflow-tooltip
            />
            <!-- <el-table-column
                prop="accountAction"
                label="执行的命令"
                align="center"
                show-overflow-tooltip
            /> -->
            <el-table-column
                prop="isSuccess"
                label="是否执行成功"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope" >
                    <el-tag
                        :type="scope.row.isSuccess? 'success' : 'danger'"
                        disable-transitions
                    >
                        {{scope.row.isSuccess?'成功':'失败'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="creator"
                label="操作用户"
                align="center"
                show-overflow-tooltip
            />
            <el-table-column
                label="操作时间"
                align="center"
                show-overflow-tooltip
                :formatter="(row)=>this.$moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')"
            />
        </template>
    </cc-table>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        data() {
            return {
                time:[],
                value:0,
                status:[
                    {value:0,label:'全部'},
                    {value:1,label:'创建'},
                    {value:2,label:'修改'},
                    {value:3,label:'删除'},
                    {value:4,label:'其他'},
                ],
                data: [],
                total:0,
                params:{
                    type:0,
                    size:20,    
                    current:1,   
                }
            }
        },
        mounted () {
            this.getList();
        },
        methods: {
            ...mapActions('overall',[
                'getOperationList', 
            ]),
            getList(obj={}){
                const data = {
                    ...this.params,
                    ...obj
                }
                this.params = data ;
                this.getOperationList(data).then(res=>{
                    if(!res)return;
                    const {data,page} = res;
                    this.data = data;
                    this.total = page.total;
                })
            },
            //切换状态回调
            changeStaus(val){
                this.getList({ type:val });
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
        },
    }
</script>

<style lang="scss" scoped>
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