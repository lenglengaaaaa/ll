<template>
    <div class="noPermission_wrap">
        <div class="box">
            <div class="box_top">访问受限</div>
            <div class="box_center">
                <el-alert
                    description='抱歉,您无权访问该平台所有功能模块,请联系管理员获取权限。点击 " 重新登录 " 返回登录页面。'
                    type="info"
                    show-icon
                    :closable="false"
                >
                </el-alert>
            </div>
            <div class="box_bottom">
                <el-button type="primary" size="medium" @click="logout">重新登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {}
    },
    methods: {
        logout() {
            this.$store.dispatch('user/logout');
        }
    },
}
</script>

<style lang="scss" scoped>
    .noPermission_wrap{
        width: 100%;
        height: 100vh;
        background: #f1f1f1;
        display: flex;
        justify-content: center;
        align-items: center;
        .box{
            width: 500px;
            background-color: #fff;
            box-shadow: 0 0 20px 0 rgba(0,0,0,.25);
            &_top,&_bottom{
                padding: 20px 0;
                margin: 0 20px;
            }
            &_top{
                font-weight: 700;
                font-size: 13px;
                border-bottom: 1px solid #e5e5e5;
            }
            &_center{
                padding: 20px;
                .el-alert__title{
                    color: #313744;
                }
            }
            &_bottom{
                border-top: 1px solid #e5e5e5;
                text-align: center;
            }
        }
    }
</style>
