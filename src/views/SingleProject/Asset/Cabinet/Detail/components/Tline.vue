<template>
    <div class="DATA_DETAIL">
        <div class="wrap">
            <div class="seletGroup">
                <el-form label-position="top">
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

<style lang="scss" scoped>
    @import '@/styles/dataDetail.scss';

    .DATA_DETAIL{
        .wrap{
            #line{
                height: 300px !important;
            }   
        }
        
    }
    
</style>