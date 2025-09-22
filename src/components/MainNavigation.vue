
<script setup lang="ts">
    import { Menubar } from "primevue";
    import { ref } from "vue";
    import "@/assets/style/main-navigation.css"
    import { ToggleSwitch } from "primevue";
    import { MENU_ITEMS } from '@/data/menuItems.ts';
    import { useTheme } from '@/composables/useTheme';

    const { checked } = useTheme();
    const items = ref([...MENU_ITEMS]);
</script>

<template>
    <div class="card">
        <Menubar :model="items">
            <template #start>
                <div class="main-nav__title">Project Manager</div>
            </template>
            <template #item="{ item, props }">
                <a class="flex items-center" v-bind="props.action">
                    <i v-if="item.icon" :class="[item.icon]"></i>
                    <span>{{ item.label }}</span>
                </a>
            </template>
            <template #end>
                <ToggleSwitch v-model="checked">
                    <template #handle="{ checked }">
                    <i :class="['!text-xs pi', { 'pi-moon': checked, 'pi-sun': !checked }]" />
                    </template>
                </ToggleSwitch>
            </template>
        </Menubar>

    </div>
</template>
