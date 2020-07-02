<template>
    <el-popover
        placement="bottom-end"
        v-model="noticeVisible"
        popper-class="header-popper"
    >
        <el-tabs :stretch="true" v-model="activeName">
            <el-tab-pane label="告警信息" name="notice">
                <div class="notice-container">
                    <div class="notice-list">
                        <div 
                            class="notice-list-box" 
                            v-if="alarmBox.length" 
                        >
                        <!-- v-infinite-scroll="load"
                        infinite-scroll-immediate -->
                            <div class="notice-item" v-for="(item,index) in alarmBox" :key="index" @click="viewDetail(item)">
                                <div class="notice-item-avatar">
                                    <img class="notice-item-avatar-icon" src="@images/notice.png" />
                                </div>
                                <div class="notice-item-content">
                                    <h4 class="notice-item-content-title">
                                        <strong>设备名称: </strong>{{item.devName}}
                                        <div>
                                            <strong>设备类型: </strong>
                                            <span>{{item.equipType || '未知'}}</span>
                                        </div>
                                        <div>
                                            <strong>所属项目: </strong>
                                            <span :style="{fontWeight:'bold'}">{{item.projectName || '未知'}}</span>
                                        </div>
                                        <div >
                                            <strong>告警信息: </strong>
                                            <span class="notice-item-content-title-msg">{{item.alertMsg}}</span>
                                        </div>
                                        <div v-if="item.position">
                                            <strong>经纬度: </strong>
                                            <span>{{item.position}}</span>
                                        </div>
                                    </h4>
                                    <div class="notice-item-content-description">
                                        {{moment(item.time)}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <cc-empty v-else text=""></cc-empty>
                    </div>
                    <div class="notice-list-bottomBar">
                        <div >
                            <el-switch
                                v-model="alarmFlag"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="通知"
                                inactive-text="关闭"
                            >
                            </el-switch>
                        </div>
                        <div @click="clearBox">
                            清空通知
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div
            class="icon-item"
            slot="reference"
        >   
            <el-badge 
                :is-dot="alarmBox.length?true:false"
            >
                <i class="el-icon-bell" title="告警信息"/>
            </el-badge>
        </div>
    </el-popover>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'notice-list',
        data() {
            return {
                noticeVisible: false,
                activeName:'notice',
                // count:0,
                // data:[]
            }
        },
        computed: {
            ...mapState('overall',[
                'alarmBox'
            ]),
            alarmFlag:{
                get(){
                    return this.$store.state.app.alarmFlag ;
                },
                set(){
                    this.$store.dispatch('app/switchAlarm');
                }
            }
        },
        methods: {
            // 考虑到数据不断的新增,不是固定不变,无限滚动不适用
            // load(){
            //     if(this.alarmBox.length <= this.count) return;
            //     this.count += 10;
            //     this.data = this.alarmBox.slice(0,this.count);
            // },
            moment(time) {
                return this.$moment(time).format('YYYY-MM-DD HH:mm:ss');
            },
            clearBox(){
                this.$store.dispatch('overall/saveAlarm',[])
            },
            viewDetail(item){
                const { warnInfoId , projectName , projectId } = item;
                sessionStorage.setItem('project',JSON.stringify({ id:projectId, name:projectName }));
                sessionStorage.setItem('obj',JSON.stringify({...item,id:warnInfoId}));
                this.$router.push({name:'AlarmDetail',params:{warnInfoId}})
            },
        },
    }
</script>

<style lang="scss"> 
    .header-popper {
        user-select: none;
        padding: 0 !important;
        .el-tabs__nav.is-stretch {
            padding-top: 5px;
        }
        .el-tabs {
            width: 320px;
        }
        .el-tabs__header{
            margin-bottom: 0px;
        }
    }
    .el-badge__content.is-fixed {
        top: 3px;
        right: 12px;
    }

    .notice-container {
        @include flex(column);
        .notice-list-box {
            max-height: 400px;
            overflow: auto;
            .notice-item {
                box-sizing: border-box;
                width: 100%;
                padding: 15px 24px;
                border-bottom: 1px solid #e8e8e8;
                overflow: hidden;
                cursor: pointer;
                transition: all .3s;
                @include flex(row);
                align-items: center;
                &:last-child {
                    border-bottom: 0;
                }
                &-avatar {
                    margin-right: 16px;
                    &-icon {
                        display: block;
                        @include wh(32px);
                    }
                }
                &-content {
                    &-title {
                        margin: 0px;
                        color: rgba(0,0,0,.65);
                        font-size: 14px;
                        font-weight: 400;
                        line-height: 22px;
                        &-msg{
                            color: red;
                        }
                    }
                    &-description {
                        color: rgba(0,0,0,.45);
                        font-size: 14px;
                        line-height: 22px;
                    }
                }
                &:hover {
                    background: #e6f7ff;
                }
            }
        }
        .notice-list-bottomBar {
            height: 46px;
            line-height: 46px;
            @include flex(row);
            > div {
                flex: 1;
                display: inline-block;
                cursor: pointer;
                transition: all .3s;
                color: rgba(0,0,0,.65);
                text-align: center;
                border-top: 1px solid #e8e8e8;
                &:first-child {
                    border-right: 1px solid #e8e8e8;
                }
                &:hover {
                    color: rgba(0,0,0,.85);
                }
            }
        }
    }
</style>
