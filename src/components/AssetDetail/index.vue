<template>
    <div class="ASSET_DETail">
        <el-tabs type="border-card" >
            <el-tab-pane :label="label" v-if="table">
                <el-table
                    :data="data"
                    border
                    stripe
                    height="77.5vh"
                    max-height="77.5vh"
                    header-cell-class-name="table_header"
                >   
                    <slot name="column" />
                </el-table>
            </el-tab-pane>
            <slot></slot>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        props: {
            table:{
                type:Boolean,
                default:true
            },
            label:String,
            data: {
                type: Array,
                default:()=> []
            },
        },
        data() {
            return {
            }
        },
    }
</script>

<style lang="scss">
    .ASSET_DETail{
        height: 100%;
        .el-tabs{
            .el-tabs__content{
                height: calc(100vh - 215px);
                max-height: calc(100vh - 215px);
                overflow: scroll;
                .el-tab-pane{
                    height: 100%;
                }
            }
        }
    }
</style>