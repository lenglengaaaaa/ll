<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item 
                :label="`设备EUI(请填写${form.commWay===0?15:16}位设备EUI)`" 
                prop="deviceEui"
                v-if="!form.isSingle"
            >
                <el-input 
                    v-model="form.deviceEui" 
                    :placeholder="form.commWay===0?'000000000000000':'0000000000000000'" 
                    :maxlength="form.commWay===0?15:16"
                    :disabled="editFlag"
                />
            </el-form-item>
        </template>
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
                    commWay:0,
                    isSon:1,
                    isSingle:0,
                },
                editFlag:false
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