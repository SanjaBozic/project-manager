
<template>
    <div class="card">
        <Menubar :model="items" />
        <ToggleSwitch v-model="checked" @click="toggleDarkMode()">
        <template #handle="{ checked }">
            <i :class="['!text-xs pi', { 'pi-moon': checked, 'pi-sun': !checked }]" />
        </template>
      </ToggleSwitch>
    </div>
</template>

<script setup>
import { Menubar } from "primevue";
import { ref } from "vue";
import "@/assets/main-navigation.css"
import { ToggleSwitch } from "primevue";

let checked = ref(false);
const toggleDarkMode = () =>  {
  document.documentElement.classList.toggle('dark-mode');
}

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
