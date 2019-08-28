<template>
    <el-row :gutter="15" type="flex">
        <el-col :span="8" v-for="item in rows" :key="item.icon" :xs="24">
            <div class="grid-content" @click="rowClick(item.path)">
                <div class="msg">
                    <div>
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="item.icon"></use>
                        </svg>
                    </div>
                    <div>
                        <span class="name">{{item.name}}</span>
                        <span>
                            {{item.has}}/{{item.total}}
                        </span>
                    </div>
                </div>
                <div class="progress">
                    <el-progress :percentage="item.has/item.total*100" :show-text="false"></el-progress>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        props: {
            rows:{
                type:Array,
                default:()=>[]
            }
        },
        methods:{
            rowClick(path){
                this.$router.push(path)
            },
        }
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .el-row{
                flex-direction: column;
        }
    }
    .el-row {
        margin-bottom: 20px;
        .grid-content {
                padding:30px 20px;
                min-height: 36px;
                background: #fff;
                margin-bottom: 20px;
                cursor: pointer;
                box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
                .msg{
                    display: flex;
                    div{
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        align-items: center;
                        justify-content: center;
                        .icon {
                            width: 4em;
                            height: 4em;
                        }
                        .name{
                            font-size: 1.5rem;
                        }
                        span{
                            padding: 15px 0;
                        }
                    }
                }
                .progress{
                    padding: 20px;
                }
            }
    }
</style>