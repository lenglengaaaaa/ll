<template>
    <div class="selectApply">
        <el-form label-position="top" label-width="100px" :model="form" :rules="rules" ref="appForm">
            <el-form-item label="设备类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择设备类型">
                    <el-option 
                        v-for="item in types" 
                        :key="item.value" 
                        :label="item.label" 
                        :value="item.value"
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
    export default {
        props: {
            next:Function
        },
        data() {
            return {
                types:[
                    {label:'魔节',value:0},
                    {label:'线缆温度传感器',value:1},
                    {label:'红外门禁传感器',value:2},
                    {label:'液位传感器',value:3},
                    {label:'烟感传感器',value:4},
                    {label:'集中器',value:5},
                    {label:'魔戒',value:6},
                ],
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
        methods: {
            submit() {
                this.$refs.appForm.validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('app/setType',this.form.type)
                        this.next()
                    } else {
                        console.log('error submit!!');
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