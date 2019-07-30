<template>
    <div class="selectApply">
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="appForm">
            <el-form-item label="设备类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择设备类型">
                    <el-option 
                        v-for="item in types" 
                        :key="item.id" 
                        :label="item.value" 
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="submit">
                <el-button type="primary" @click="submit" >
                    下一步
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        props: {
            next:Function
        },
        data() {
            return {
                types:[],
                form:{
                    type: '',
                },
                rules: {
                    type: [
                        { required: true, message: '请选择设备类型', trigger: 'change' },
                    ],
                }
            }
        },
        mounted () {
            this.getEquipTypeMenu().then(res=>{
                if(!res) return;
                this.types = res;
            });
        },
        methods: {
            ...mapActions('equip',[
                'getEquipTypeMenu', 
            ]),
            submit() {
                this.$refs.appForm.validate((valid) => {
                    if (valid) {
                        sessionStorage.setItem('appType',this.form.type);
                        this.next()
                    } else {
                        return false;
                    }
                });
            }
        },
    }
</script>

<style lang="scss">
    .selectApply{
        width: 100%;
        display: flex;
        justify-content: center;
        .el-form{
            width:500px;
            max-width: 100%;
            padding: 15px;
            margin-bottom: 5px;
            background:#fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .el-form-item{
                .el-form-item__label{
                    padding: 10px 0;
                }
            }
            .el-select{
                width: 100%;
            }
            .submit{
                padding-top: 20px;
                text-align: center;
            }
        }
    }
</style>