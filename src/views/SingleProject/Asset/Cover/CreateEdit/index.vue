<template>
    <cc-assetEdit
        :form="form"
        :hasCable="false"
        :create="create"
        :edit="edit"
        :type="4"
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
                form: {},
                channelMenus:[]
            }
        },
        created () {
            const data = JSON.parse(sessionStorage.getItem('assetObj')).data;
            this.form={
                ...this.form,
                ...data
            };
        },
        mounted () {
            const projectId = JSON.parse(sessionStorage.getItem('project')).id;
            this.getCableChannelMenu(projectId).then(res=>{
                if(!res)return;
                this.channelMenus = res ;
            })
        },
        methods: {
            ...mapActions('asset',[
                'getLineTree',
                'createTrap', 
                'updateTrap'
            ]),
            ...mapActions('mini',[
                "getCableChannelMenu",
            ]),
            create(obj) {
                this.createTrap(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CoverList'})
                })
            },
            edit(obj){
                const result = {
                    ...obj,
                    lineIds:obj.lineId
                }
                delete result.lineId
                this.updateTrap(result).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CoverList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>