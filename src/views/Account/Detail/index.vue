<template>
    <div class="account_detail">
        <div class="wrap">
            <div class="avatar">
                <el-upload
                    class="avatar-uploader"
                    action="http://47.92.235.125:8888/e_view/file/upload/image"
                    :headers="{'jtoken':token}"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <div>
                <div class="info" v-for="i in options" :key="i.value">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="title">
                                {{i.title}}
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="value">
                                {{i.value}}
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                imageUrl: 'http://47.92.235.125:90/eiot/c9e80d63ebf94c15a3960e1df8219323.jpg',
                options:[
                    {title:'用户名',value:'',sign:'userName'},
                    {title:'账号',value:'',sign:'name'},
                    {title:'手机号码',value:'',sign:'phoneNum'},
                    {title:'邮箱',value:'',sign:'email'},
                ],
                token:this.$store.state.user.token,
            };
        },
        created () {
            this.getAccountDetail()
        },
        computed: {
            userDetail() {
                return JSON.parse(sessionStorage.getItem('userDetail'));
            }
        },
        methods: {
            //获取用户信息
            getAccountDetail(){
                const userDetail = this.userDetail;
                this.imageUrl = userDetail.imagePath;
                this.options.reduce((pre,current)=>{
                    for(let i in userDetail){
                        if(current.sign === i){
                            current.value = userDetail[i];
                        }
                    }
                    return {
                        ...pre,
                        current
                    }
                },{})
            },
            handleAvatarSuccess(res, file) {
                const {id,imageId} = this.userDetail;
                this.imageUrl = URL.createObjectURL(file.raw);
                this.$store.dispatch('user/updateAvatar',{
                    id:imageId,
                    accountId:id,
                    name:'xxx',
                    imagePath:res.data
                })
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        },
    }
</script>

<style lang="scss">
    .account_detail{
        padding-top: 50px;
        width: 100%;
        display: flex;
        justify-content: center;
        .wrap{
            width:400px;
            max-width: 100%;
            padding: 15px;
            background:#fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            .avatar{
                text-align: center;
                padding: 10px 0;
                .el-upload{
                    border: 1px solid #22a7f0 !important;
                }
                .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .avatar-uploader .el-upload:hover {
                    border-color: #409EFF;
                }
                .avatar-uploader-icon {
                    border-radius: 50%;
                    font-size: 1.75rem;
                    color: #8c939d;
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    text-align: center;
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                    display: block;
                    padding: 0;
                }
            }
            .info{
                font-size: 1rem;
                padding: 15px 0 ;
                .title{
                    font-weight: bold;
                    padding: 5px 10px;
                }
                .value{
                    background: #d6dcdf;
                    padding: 5px 0 5px 20px;
                }
            }
        }
    }
</style>