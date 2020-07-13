<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <!-- <template>
            <el-form-item label="所属资产类型">
                <el-select v-model="form.assetType" @change="assetTypeChange">
                    <el-option label="井盖" :value="0"></el-option>
                    <el-option label="台区" :value="1"></el-option>
                </el-select>
            </el-form-item>
        </template> -->
    </cc-equipForm>
</template>

<script>
    import { mapActions } from 'vuex';
    //电缆定位桩

    export default {
        name:'CablePile',
        props: {
            next:Function,
            pre:Function
        },
        data() {
            return {
                form: {
                    commWay:0
                }
            }
        },
        mounted () {
            const { id } = JSON.parse(sessionStorage.getItem('project'));
            const { data, editFlag } = JSON.parse(sessionStorage.getItem('equipObj'));
            this.projectId = id;
            this.editFlag = editFlag;
            this.form={
                ...this.form,
                ...data
            };
        },
    }
</script>

<style lang="scss" scoped>

</style>