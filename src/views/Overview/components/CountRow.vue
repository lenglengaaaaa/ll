<template>
    <el-row :gutter="15" type="flex">
        <el-col :span="8" v-for="item in rows" :key="item.icon" :xs="24">
            <div class="grid-content" @click="rowClick(item.path)">
                <div class="card-panel">
                    <div>
                        <div :class="iconClass(item.className)">
                            <svg-icon 
                                :iconClass="item.icon" 
                                className="icon"
                            />
                        </div>
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
            iconClass(className) {
                return `card-panel-icon-wrapper ${className}`
            }
        },
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
                .card-panel{
                    display: flex;
                    .card-panel-icon-wrapper{
                        padding:16px;
                        border-radius: 6px;
                    }
                    div{
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        align-items: center;
                        justify-content: center;
                        .icon {
                            width: 4.5em;
                            height: 4.5em;
                        }
                        .name{
                            font-size: 1.5rem;
                            font-weight: bold;
                        }
                        span{
                            padding: 15px 0;
                        }
                    }
                    .icon-gateway{
                        color: #f4516c;
                    }
                    .icon-project{
                        color:#36a3f7;
                    }
                    .icon-equip{
                        color: #34bfa3;
                    }
                }
                .progress{
                    padding: 20px;
                    margin-top: 20px;
                }
                &:hover{
                    .card-panel-icon-wrapper{
                        color:#fff;
                    }
                    .icon-gateway{
                        background: #f4516c;
                    }
                    .icon-project{
                        background:#36a3f7;
                    }
                    .icon-equip{
                        background: #34bfa3;
                    }
                }
            }
    }
</style>