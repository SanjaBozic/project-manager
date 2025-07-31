
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
                <ToggleSwitch v-model="checked" @click="toggleDarkMode()">
                    <template #handle="{ checked }">
                        <i :class="['!text-xs pi', { 'pi-moon': checked, 'pi-sun': !checked }]" />
                    </template>
                </ToggleSwitch>
            </template>
        </Menubar>

    </div>
</template>

<script setup lang="ts">
import { Menubar } from "primevue";
import { onMounted, ref } from "vue";
import "@/assets/main-navigation.css"
import { ToggleSwitch } from "primevue";
import { useLocalStorage } from '@/composables/useLocalStorage';

/*THEME SETUP START */

const isDark = useLocalStorage<boolean>('darkMode', false);

let checked = ref(isDark.value);

const toggleDarkMode = () =>  {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark-mode');
}

onMounted(() => {
  if (isDark.value) {
    document.documentElement.classList.add('dark-mode')
  }
})

/*THEME SETUP END */

const items = ref([
    {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar'
    },
    {
        label: 'Work Items',
        icon: 'pi pi-objects-column'
    },
    {
        label: 'Backlogs',
        icon: 'pi pi-th-large',
    },
    {
        label: 'Sprints',
        icon: 'pi pi-stop'
    }
]);
</script>
