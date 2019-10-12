<template>
    <section class="apply_main">
        <div class="bar">
            <i :class="isCollapse?'el-icon-s-fold':'el-icon-s-unfold'" @click="toggleSideBar"/>
            <Breadcrumb />
        </div>
        <div class="main">
            <transition name="fade-transform" mode="out-in">
                <router-view />
            </transition>
        </div>
    </section>
</template>

<script>
    import Breadcrumb from '@/components/Breadcrumb'

    export default {
        components: {
            Breadcrumb,
        },
        data() {
            return {
                bread: [],
                flag:false,
                client:null
            }
        },
        created () {
            if(!sessionStorage.getItem('project'))return;
            this.client = this.$mqtt.connect(`topic_warning_${this.projectId}`);
            this.$mqtt.listen(this.client,res=>{
                console.log(res,'告警信息')
                const {address,alertMsg,devName,time,lng,lat} = res;
                this.$notify({ 
                    duration: 30000,
                    title: '告警信息',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    message: `
                        <div class="noti">
                            <div>设备名称 : <strong>${devName}</strong></div>
                            <div>设备地址域 : <strong>${address}</strong></div>
                            <div>告警信息 : <strong class="red">${alertMsg}</strong></div>
                            ${(lng||lat)?`<div>经纬度 : <strong >${lng},${lat}</strong></div>`:''}
                            <div>告警时间 : <strong>${moment(time).format('YYYY-MM-DD HH:mm:ss')}</strong></div>
                            <div class="tip">注 :点击查看详情</div>
                        </div>
                    `,
                    onClick:this.checkDetail.bind(this,res)
                });
                this.$store.dispatch('app/saveAlarm',[
                    res,
                    ...this.$store.state.app.alarmBox
                ])
            })
        },
        mounted () {
            const screen = this.$store.state.app.device;
            this.fitScreen(screen)
        },
        destroyed () {
            this.client&&this.client.end();
        },
        watch: {
            '$store.state.app.device'(screen){
                this.fitScreen(screen)
            },
            '$store.state.app.sidebar.opened'(flag) {
                const type = this.$store.state.app.device;
                if(type ==='mobile')return;
                $('.apply_main').css({width:!flag?'calc(100% - 54px)':'calc(100% - 210px)'})
            },
            //暂时用于无权限监听关闭mqtt
            $route(to,from){
                if(to.redirectedFrom==='/senior'){
                    this.client&&this.client.end();
                }
            },
        },
        computed: {
            isCollapse() {
                return !this.$store.state.app.sidebar.opened
            },
            projectId(){
                return JSON.parse(sessionStorage.getItem('project')).id;
            },
        },
        methods: {
            checkDetail(item){
                const result = {
                    ...item,
                    id:item.warnInfoId
                }
                sessionStorage.setItem('obj',JSON.stringify(result));
                this.$router.push({name:'AlarmDetail'})
            },
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            fitScreen(screen){
                if(screen ==='mobile'){
                    $('.apply_main').css({width:''})
                } 
                if(screen ==='desktop'){
                    const fold = this.$store.state.app.sidebar.opened;
                    $('.apply_main').css({width:!fold?'calc(100% - 54px)':'calc(100% - 210px)'})
                }
            }
        },
    }
</script>

<style lang="scss">
    @media screen and (max-width: 870px) {
        .apply_main{
            .bar{
                margin: 0 0 15px 0 !important;
            }
        }
    }
    .apply_main{
        width: 100%;
        // height: 100%;
        .bar{
            background: #fff;
            box-shadow: 0 1px 1px hsla(204,8%,76%,.8);
            height: 50px;
            margin: 15px;
            padding: 0 15px;
            display: flex;
            align-items: center;
            .el-icon-s-fold,.el-icon-s-unfold{
                cursor: pointer;
                font-size: 20px;
            }
            .el-breadcrumb{
                padding-left: 10px;
            }
        }
        .main{
            padding:0 15px 15px;
            height: calc(100vh - 145px);
            overflow: scroll;
        }
    }

    .el-notification__group{
        cursor: pointer;
        .el-notification__title{
            font-size: 20px;
        }
        .noti{
            & > div{
                padding: 5px 0;
                font-size: 15px;
                text-align: left;
            }
            .red{
                color:red
            }
            .tip{
                font-size: 14px;
                font-weight: bolder;
            }
        }
    }
    
</style>