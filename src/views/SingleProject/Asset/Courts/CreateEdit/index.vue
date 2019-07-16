<template>
    <CreateEdit
        :form="form"
        :create="create"
        :edit="edit"
        :type="0"
    >
        <template>
            <el-form-item label="台区类型">
                <el-select v-model="form.courtsType">
                    <el-option label="开闭所变压器" value="开闭所变压器"></el-option>
                    <el-option label="柱上变压器" value="柱上变压器"></el-option>
                    <el-option label="室内变压器" value="室内变压器"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="变压前电压">
                <el-input v-model="form.beforeVoltage" placeholder="请输入变压前电压"></el-input>
            </el-form-item>
            <el-form-item label="变压后电压">
                <el-input v-model="form.afterVoltage" placeholder="请输入变压后电压"></el-input>
            </el-form-item>
            <el-form-item label="电流等级">
                <el-input v-model="form.electricityLevel" placeholder="请输入电流等级"></el-input>
            </el-form-item>
            <el-form-item label="电压等级">
                <el-input v-model="form.covoltageLevel" placeholder="请输入电压等级"></el-input>
            </el-form-item>
            <el-form-item label="所属断路柜">
                <el-input v-model="form.cutoff" placeholder="请输入所属断路柜"></el-input>
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
                form: {
                    courtsType:"开闭所变压器"
                }
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
                'createCourts', 
                'updateCourts'
            ]),
            create(obj) {
                this.createCourts(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CourtsList'})
                })
            },
            edit(obj){
                this.updateCourts(obj).then(res=>{
                    if(!res)return
                    this.$router.push({name:'CourtsList'})
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>