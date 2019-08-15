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
            <el-tab-pane label="数据视图" lazy>
                <DataDetail
                    :assetType="2"
                    :hasLine="true"
                />
            </el-tab-pane>
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import EquipList from '@/components/EquipList'
    import DataDetail from '@/components/DataDetail'
    import { mapActions } from 'vuex'
    
    export default {
        components: {
            AssetDetail,
            EquipList,
            DataDetail
        },
        data() {
            return {
                equipList: [],
                params:{
                    projectId:JSON.parse(sessionStorage.getItem('project')).id,
                    current:1,
                    size:50
                }
            }
        },
        created () {
            const {name,trapName,id} =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title=name||trapName;
            this.getEquip(id);
        },
        methods: {
            ...mapActions('equip',[
                'getEquipList',
            ]),
            //获取设备列表
            getEquip(trapId){
                this.getEquipList({
                    ...this.params,
                    trapId,
                }).then(res=>{
                    if(!res)return;
                    this.equipList = res.data
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>