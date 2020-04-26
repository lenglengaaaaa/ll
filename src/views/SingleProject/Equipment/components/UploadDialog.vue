<template>
    <div class="uploadDialog">
        <el-dialog
            title="批量上传"
            :visible="visible"
            :before-close="handleClose"
            destroy-on-close
            :close-on-click-modal="false"
            center
        >
            <el-steps :active="active" align-center finish-status="success">
                <el-step title="设备选择" />
                <el-step title="上传" />
            </el-steps>
            <div v-if="active == 1" class="selectBox">
                <el-select v-model="value" placeholder="请选择">
                    <el-option label="低压传感器（魔戒）" :value="36"/>
                </el-select>
            </div>
            <div v-if="active == 2" class="uploadBox">
                <div class="uploadBox_top">
                    <span class="msg">上传模板下载 :&nbsp;</span>
                    <el-button type="primary" icon="el-icon-download" size="small" @click="downTemplate">模板下载</el-button>
                </div>
                <div  class="uploadBox_bottom">
                    <span class="msg">文件选择( 按要求填写excel信息 ) :&nbsp;</span>
                    <el-upload
                        class="upload-fnc"
                        ref="upload"
                        :action="upload_api"
                        :file-list="fileList"
                        :auto-upload="false"
                        :on-exceed="handleExceed"
                        :limit="1"
                        :on-success="handleSuccess"
                    >   
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="next" :type="active==2?'success':'primary'">
                    {{active==2?'上传':'下一步'}}
                </el-button>
                <el-button @click="closeDialog">
                    关闭
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { api } from '@/utils/API'

    export default {
        name:'UploadDialog',
        props: {
            visible: Boolean,
            close:Function
        },
        data() {
            return {
                active:1,
                value:36,
                fileList:[],
                upload_api:api.ring_batch_upload,
            };
        },
        methods: {
            handleClose(done) {
                this.active = 1;
                done();
                this.close();
            },
            next(){
                if(this.active < 2){
                    this.active++
                }else{
                    this.$refs.upload.submit();
                }
            },
            downTemplate(){
                window.location.href = '/static/template/ring_template.xlsx'
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            closeDialog(){
                this.active = 1;
                this.close();
            },
            handleSuccess(res, file){
                const { code, message, data } = res;
                if( code === 200 ){
                    this.$message.success(message);
                }else{
                    this.$message.error(`${data?data:''}, ${message}`);
                }
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，可上传完成后删除文件再次上传`);
            },
        }
    }
</script>

<style lang="scss">
    .uploadDialog{
        .el-dialog{
            border-radius: 10px;
            width: 400px;
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
                .selectBox{
                    padding-top: 40px;
                    text-align: center;
                }
                .uploadBox{
                    padding-top: 30px;
                    &_top,&_bottom{
                        .msg{
                            font-weight: bold;
                            color: #000;
                            display: inline-block;
                            padding: 8px;
                            background: #eeeeee;
                            border-radius: 5px;
                        }
                    }
                    &_top{
                        padding-bottom: 10px;
                        display: flex;
                        align-items: center;
                        .msg{
                            margin-right: 5px;
                        }
                    }
                    
                    &_bottom{
                        .msg{
                            margin-bottom: 5px;
                        }
                        .upload-fnc{
                            .el-upload{
                                width: 100%;
                                .el-button{
                                    width: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>