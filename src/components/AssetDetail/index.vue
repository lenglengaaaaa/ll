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
    @import '@/styles/assetDetail.scss';
</style>