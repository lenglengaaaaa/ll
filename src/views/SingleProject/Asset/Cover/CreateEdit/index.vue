<template>
    <cc-equipEdit
        :form="form"
        :hasCable="false"
        :create="create"
        :edit="edit"
        :type="4"
    >
        <template>
            <el-form-item label="附属线缆">
                <el-cascader 
                    v-model="form.lineId"
                    :options="options" 
                    :show-all-levels="false"
                    clearable
                    :props="{
                        multiple:true,
                        children:'childList',
                        value:'id',
                        label:'name',
                        emitPath:false
                    }"
                />
            </el-form-item>
        </template>
    </cc-equipEdit>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        data() {
            return {
                options:[],
                form: {}
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
            this.getLineTree(projectId).then(res=>{
                if(!res)return;
                this.options=res;
            });
        },
        methods: {
            ...mapActions('asset',[
                'getLineTree',
                'createTrap', 
                'updateTrap'
            ]),
            create(obj) {
                const result = {
                    ...obj,
                    lineIds:obj.lineId
                }
                delete result.lineId
                this.createTrap(result).then(res=>{
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