<template>
    <div class="create_edit">
        <el-dialog
            :title="editFlag?`编辑${title}`:`创建${title}`"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
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
            width: 600px;
            max-width: 90%;
            .el-dialog__header{
                padding: 12px 20px;
                display: flex;
                align-items: center;
                background-color: #eee;
                .el-dialog__title{
                    color: #869198;
                    font-size: 16px;
                }
            }
            .el-dialog__body{
                .el-form{
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