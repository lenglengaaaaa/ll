<template>
    <div class="DATA_DETAIL">
        <div class="wrap">
            <div class="seletGroup">
                <el-form label-position="left">
                    <el-form-item label="时间段:">
                        <el-date-picker
                            v-model="time"
                            type="date"
                            placeholder="选择日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="icon">
                    <i class="el-icon-download"></i>
                </div>
            </div>
            <LineChart text="1.1#杆受点侧(电流曲线图)"></LineChart>
            <LineChart text="1.1#杆受点侧(温度曲线图)"></LineChart>
        </div>
    </div>
</template>

<script>
    import {LineChart} from '@/components/Charts'

    export default {
        components: {
            LineChart,
        },
        data() {
            return {
                time: new Date(),
            }
        },
        
    }
</script>

<style lang="scss">
    .DATA_DETAIL{
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 15px 0;
        .wrap{
            width: 98%;
            #line{
                height: 300px !important;
            }  
            .seletGroup{
                padding-bottom: 20px;
                display: flex;
                align-items: center;
                .el-form{
                    width: 100%;
                    .el-form-item{
                        margin: 0;
                    }
                }
                .icon{
                    i{
                        cursor: pointer;
                        background: #ecefef;
                        padding: 5px;
                        border-radius: 5px;
                    }
                }
            }
        }
    }
</style>