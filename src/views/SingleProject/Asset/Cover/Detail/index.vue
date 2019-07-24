<template>
    <AssetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="设备数据总览" lazy>
                <EquipDetail />
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import EquipDetail from '@/components/EquipDetail'
    
    export default {
        components: {
            AssetDetail,
            EquipDetail
        },
        created () {
            const obj =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title=obj.name||obj.trapName
        },
    }
</script>

<style lang="scss" scoped>

</style>