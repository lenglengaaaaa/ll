<template>
    <div class="CREATE_EDIT">
        <el-form 
            label-position="top" 
            label-width="100px" 
            :model="form" 
            :rules="rules" 
            ref="magicForm"
            :style="{maxHeight:'calc(100vh - 170px)'}"
        >
            <el-form-item label="资产名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入资产名称"></el-input>
            </el-form-item>
            <el-form-item label="资产编号" prop="number">
                <el-input v-model="form.number" placeholder="请输入资产编号"></el-input>
            </el-form-item>
            <slot></slot>
            <el-form-item label="资产详情">
                <el-input v-model="form.detail" placeholder="请输入资产详情"></el-input>
            </el-form-item>
            <el-form-item label="位置信息" prop="location" class="address">
                <el-cascader :options="options" v-model="form.city"></el-cascader>
                <el-input v-model="form.location" placeholder="请输入设备位置信息"></el-input>
            </el-form-item>
            <el-form-item label="资产经纬度" class="map">
                <MapSingle 
                    vid="newApply"
                    :position="form.position"
                    :get="getPostion"
                />
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submit" >
                    {{!editFlag?'创建完成':'编辑完成'}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {MapSingle} from '@/components/Maps'
    import {options} from '@/utils/options'

    export default {
        components: {
            MapSingle
        },
        props: {
            form: {
                type: Object,
                default: ()=>{}
            },
            rules:{
                type:Object,
                default:()=>{}
            },
            create:Function,
            edit:Function
        },
        data() {
            return {
                options:options,
            }
        },
        computed: {
            editFlag(){
                return JSON.parse(sessionStorage.getItem('assetObj')).editFlag;
            }
        },
        methods: {
            submit() {
                this.$refs.magicForm.validate((valid) => {
                    if (valid) {
                        if(!editFlag){
                            this.create()
                        }else{
                            this.edit()
                        }
                    } else {
                        return false;
                    }
                });
            },
            getPostion(lng,lat){
                this.form ={
                    ...this.form,
                    position:[lng,lat]
                }
            },
        },
    }
</script>

<style lang="scss">
    @import '@/styles/form.scss';
    .CREATE_EDIT{
        width: 100%;
        display: flex;
        justify-content: center;
        .el-form{
            max-height: calc(100vh - 170px);
        }
    }
</style>