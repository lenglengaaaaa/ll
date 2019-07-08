<template>
    <AssetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="魔节" lazy>
                <Magic></Magic>
            </el-tab-pane>
            <el-tab-pane label="线缆温度传感器" lazy>
                <Tline></Tline>
            </el-tab-pane>
            <el-tab-pane label="独立传感器" lazy>
                
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import Magic from './components/Magic'
    import Tline from './components/Tline'
    
    export default {
        components: {
            AssetDetail,
            Magic,
            Tline
        },
    }
</script>

<style lang="scss" scoped>

</style>