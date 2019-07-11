<template>
    <CreateEdit
        :form="form"
        :hasCable="false"
        :create="create"
        :edit="edit"
    >
        <template>
            <el-form-item label="所属主线缆" prop="lineId">
                <el-select v-model="form.lineId" >
                    <el-option label="主线缆一" value="0"></el-option>
                </el-select>
            </el-form-item>
        </template>
    </CreateEdit>
</template>

<script>
    import CreateEdit from '@/components/CreateEdit'
    import {mapActions} from 'vuex'

    export default {
        components: {
            CreateEdit,
        },
        data() {
            return {
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
        methods: {
            ...mapActions('asset',[
                'createTrap', 
                'updateTrap'
            ]),
            create(obj) {
                this.createTrap(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CoverList'})
                })
            },
            edit(obj){
                this.updateTrap(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CoverList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>