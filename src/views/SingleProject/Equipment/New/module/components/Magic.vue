<template>
    <cc-equipForm
        :form="form"
        :next="next" 
        :pre="pre"
    >
        <template>
            <el-form-item :label="`装置EUI(请填写${form.communicationTechnology===1?15:16}位装置EUI)`" prop="eui">
                <el-input 
                    v-model="form.eui" 
                    :placeholder="form.communicationTechnology==1? '000000000000000': '0000000000000000'" 
                    :maxlength="form.communicationTechnology==1? 15: 16"
                    :disabled="editFlag"
                />
            </el-form-item>
            <el-form-item label="所属井盖" prop="transformerOrTrap">
                <el-select v-model="form.transformerOrTrap">
                    <el-option 
                        v-for="item in trapMenus"
                        :key="item.id"
                        :label="item.name" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
        </template>
    </cc-equipForm>
</template>

<script>
    import {resetSingle} from '@/utils/methods'
    import { mapActions } from 'vuex'

    export default {
        props: {
            next:Function,
            pre:Function
        },
        data() {
            return {
                projectId:0,
                editFlag:false,
                form: {
                    communicationTechnology:1,
                    magicFestivalName:"",
                    address:"",
                    eui:"",
                    transformerOrTrap:"",
                    assetsType:1,
                    positionInformation:""
                },
                trapMenus:[],
            }
        },
        mounted () {
            const { id } = JSON.parse(sessionStorage.getItem('project'));
            const { data, editFlag } = JSON.parse(sessionStorage.getItem('equipObj'));
            this.projectId = id;
            this.editFlag = editFlag;
            this.form={
                ...this.form,
                eui: data.deviceEui,
                transformerOrTrap: data.trapId,
                ...data,
            };
            this.getTrapMenu(id).then(res=>{
                if(!res)return;
                this.trapMenus = res ;
            });
        },
        methods: {
            ...mapActions('mini',[
                'getTrapMenu'
            ])
        },
    }
</script>

<style lang="scss" scoped>

</style>