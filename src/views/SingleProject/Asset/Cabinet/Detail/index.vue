<template>
    <AssetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="魔戒总览" lazy>
                <RingView></RingView>
            </el-tab-pane>
            <el-tab-pane label="魔戒列表" lazy>
                <RingList></RingList>
            </el-tab-pane>
            <el-tab-pane label="独立传感器" lazy>
                
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import RingView from './components/RingView'
    import RingList from './components/RingList'

    export default {
        components: {
            AssetDetail,
            RingView,
            RingList
        },
        data() {
            return {
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>