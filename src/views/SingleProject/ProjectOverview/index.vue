<template>
    <div>
        <div>
            <ChartRow />
        </div>
        <div>
            <el-card class="box-card">
                <div slot="header" class="clearfix"  >
                    <span>设备地图</span>
                </div>
                <div>
                    <Map 
                        vid="apply"
                        :zoom="14"
                    />
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {ChartRow} from '@/components/Row'
    import {Map} from '@/components/Maps'

    export default {
        components: {
            ChartRow,
            Map
        },
        data() {
            return {
            }
        },
    }
</script>

<style lang="scss" scoped>
    .box-card{
            background: #fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .el-card__header{
                padding: 8px 15px;
            }
            .clearfix{
                font-size: 16px;
                color: #171717;
            }
        }
</style>