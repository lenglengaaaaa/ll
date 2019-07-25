<template>
    <AssetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="设备列表" lazy>
                <EquipList />
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import EquipList from '@/components/EquipList'
    
    export default {
        components: {
            AssetDetail,
            EquipList
        },
        created () {
            const obj =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title=obj.name||obj.trapName
        },
    }
</script>

<style lang="scss" scoped>

</style>