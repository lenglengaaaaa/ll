<template>
    <div class="create_edit" >
        <el-dialog
            :title="editFlag?`编辑${title}`:`创建${title}`"
            :visible.sync="dialogVisible"
            @close="close"
        >
            <slot></slot>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            title:String,
            visible:Boolean,
            editFlag:Boolean,
            close:Function,
        },
        data() {
            return {
                dialogVisible: false
            }
        },
        watch: {
            visible(flag) {
                return this.dialogVisible = flag
            }
        },
    }
</script>

<style lang="scss">
    .create_edit{
        .el-dialog{
            border-radius: 10px;
            width: 600px;
            max-width: 90%;
            margin-top:2vh !important;
            .el-dialog__header{
                border-radius: 10px 10px 0px 0px;
                padding: 12px 20px;
                display: flex;
                align-items: center;
                background-color: #eee;
                .el-dialog__title{
                    color: #869198;
                }
            }
            .el-dialog__body{
                padding: 15px 20px;
                .el-form{
                    .el-form-item{
                        margin-bottom: 10px;
                    } 
                    .el-input__inner{
                        border-radius: 0px;
                        height: 35px;
                        line-height: 35px;
                    }
                    .el-select,.el-cascader{
                        width: 100%;
                    }
                }
                .submit{
                    padding-top: 20px;
                    text-align: center;
                }
            }
        }
    }
</style>