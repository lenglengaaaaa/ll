<template>
    <div class="wrap">
        <template v-if="type === 5">
            <ConForm :next="next" :pre="pre"/>
        </template>
        <template v-else>
            <MagicForm :next="next" :pre="pre"/>
        </template>
    </div>
</template>

<script>
    import {ConForm,MagicForm} from './components'

    export default {
        components: {
            ConForm,
            MagicForm
        },
        props: {
            next: Function,
            pre:Function
        },
        computed: {
            type() {
                return this.$store.state.app.appType 
            }
        },
    }
</script>

<style lang="scss" scoped>
    .wrap{
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>