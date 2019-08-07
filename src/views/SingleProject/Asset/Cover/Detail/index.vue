<template>
    <AssetDetail
        :table="false"
    >
        <template>
            <el-tab-pane label="设备列表" lazy>
                <EquipList 
                    :data="equipList"
                />
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import EquipList from '@/components/EquipList'
    import { mapActions } from 'vuex'
    
    export default {
        components: {
            AssetDetail,
            EquipList
        },
        data() {
            return {
                equipList: []
            }
        },
        created () {
            const obj =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title=obj.name||obj.trapName
            this.getEquipList({
                trapId:obj.id,
                current:1,
                size:50
            }).then(res=>{
                if(!res)return;
                this.equipList = res.data
            })
        },
        methods: {
            ...mapActions('equip',[
                'getEquipList',
            ]),
        },
    }
</script>

<style lang="scss" scoped>

</style>