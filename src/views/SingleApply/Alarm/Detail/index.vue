<template>
    <div class="Alarm_Detail">
        <div class="wrap">
            <div class="top">
                top
            </div>
            <div class="center">
                center
            </div>
            <div class="footer">
                footer
                <MapSingle 
                    vid="alarmDetail"
                    :position="position"
                    :flag="false"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import {MapSingle} from '@/components/Maps'

    export default {
        components: {
            MapSingle,
        },
        data() {
            return {
                position:[113.991244,22.5959]
            }
        },
    }
</script>

<style lang="scss" scoped>
    .Alarm_Detail{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        .wrap{
            width: 1200px;
            max-width: 100%;
            max-height: calc(100vh - 150px);
            overflow: scroll;
            background: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) ;
            
        }
    }
</style>