<template>
    <AssetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="魔戒总览">
                
            </el-tab-pane>
            <el-tab-pane label="魔戒列表">
                
            </el-tab-pane>
            <el-tab-pane label="独立传感器">
                
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'

    export default {
        components: {
            AssetDetail
        },
        data() {
            return {
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>