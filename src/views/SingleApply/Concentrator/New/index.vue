<template>
    <div class="create_container">
        <div class="step">
            <el-steps :active="active" finish-status="success" simple>
                <el-step title="添加设备"></el-step>
                <el-step title="激活设备"></el-step>
            </el-steps>
        </div>
        <div class="content">
            <template v-if="active==0">
                <AddApply :next="next"></AddApply>
            </template>

            <template v-else-if="active===1">
                <ActApply :next="next"></ActApply>
            </template>

        </div>
    </div>
</template>

<script>
    import {AddApply,ActApply} from './components'

    export default {
        components: {
            AddApply,
            ActApply
        },
        data() {
            return {
                active: 0
            };
        },
        created () {
        },
        methods: {
            next() {
                if (this.active++ > 0){
                    this.$message({
                        message: '设备激活完成 , 添加设备成功',
                        type: 'success'
                    });
                    this.$router.push({name:'ConList'})
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 992px) {
        .create_container{
            .step{
                width: 100% !important;
            }
        }
    }
    .create_container{
        display: flex;
        flex-direction: column;
        align-items: center;
        .step{
            width: 60%;
        }
        .content{
            width: 100%;
            margin-top: 50px;
            display: flex;
            justify-content: center;
        }
    }
</style>