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
            <el-tab-pane label="设备列表" lazy>
                <EquipList 
                    :data="equipList"
                />
            </el-tab-pane>  
            <el-tab-pane label="数据视图" lazy>
                <DataDetail
                    :assetType="0"
                />
            </el-tab-pane>
            <el-tab-pane label="数据模拟" lazy>
                <Simulate />
            </el-tab-pane>
            
        </template>
    </AssetDetail>
</template>

<script>
    import AssetDetail from '@/components/AssetDetail'
    import RingView from './components/RingView'
    import RingList from './components/RingList'
    import Simulate from './components/Simulate'
    import EquipList from '@/components/EquipList'
    import DataDetail from '@/components/DataDetail'
    import { mapActions } from 'vuex'

    export default {
        components: {
            AssetDetail,
            RingView,
            RingList,
            Simulate,
            EquipList,
            DataDetail
        },
        data() {
            return {
                equipList:[],
                params:{
                    size:50,
                    current:1,
                    type:1
                }
            }
        },
        created () {
            const {id,name} =JSON.parse(sessionStorage.getItem("obj"));
            this.$route.meta.title=name;
            this.getEquipList(id);
        },
        methods: {
            ...mapActions('equip',[
                'getEquipInAsset',
            ]),
            //获取设备列表
            getEquipList(chestId){
                this.getEquipInAsset({
                    ...this.params,
                    chestId
                }).then(res=>{
                    if(!res)return;
                    this.equipList = res;
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>