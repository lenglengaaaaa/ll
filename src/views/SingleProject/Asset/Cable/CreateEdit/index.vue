<template>
    <cc-assetEdit
        :form="form"
        :hasCable="false"
        :hasMap="false"
        :create="create"
        :edit="edit"
        :type="5"
    >
        <template>
            <el-form-item label="所属电缆通道" prop="cablePass">
                <el-select v-model="form.cablePass">
                    <el-option 
                        v-for="item in channelMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
        </template>
    </cc-assetEdit>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        data() {
            return {
                form: {
                    parentId:''
                },
                channelMenus:[]
            }
        },
        mounted () {
            const projectId = JSON.parse(sessionStorage.getItem('project')).id;
            this.getCableChannelMenu(projectId).then(res=>{
                if(!res)return;
                this.channelMenus = res ;
            })
        },
        created () {
            const data = JSON.parse(sessionStorage.getItem('assetObj')).data;
            this.form={
                ...this.form,
                ...data
            };
        },
        methods: {
            ...mapActions('asset',[
                'getLineMenu',
                'createLine', 
                'updateLine'
            ]),
            ...mapActions('mini',[
                "getCableChannelMenu",
            ]),
            create(obj) {
                this.createLine(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CableList'})
                })
            },
            edit(obj){
                this.updateLine(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CableList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>