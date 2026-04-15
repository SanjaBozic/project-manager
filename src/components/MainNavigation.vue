
<script setup lang="ts">
import { Menubar } from 'primevue';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import '@/assets/style/main-navigation.css';
import { ToggleSwitch } from 'primevue';
import { MENU_ITEMS } from '@/config/navigation';
import { useTheme } from '@/composables/useTheme';

const { checked } = useTheme();

const items = computed(() =>
  MENU_ITEMS.map(item => ({
    ...item,
    // Remove command since we'll use RouterLink
  }))
);
</script>

<template>
    <div class="card">
        <Menubar :model="items">
            <template #start>
                <div class="main-nav__title">Project Manager</div>
            </template>
            <template #item="{ item, props }">
                <RouterLink 
                  v-slot="{ href, navigate }" 
                  :to="item.to" 
                >
                    <a 
                      class="flex items-center" 
                      :href="href" 
                      v-bind="props.action"
                      @click="navigate"
                    >
                        <i v-if="item.icon" :class="[item.icon]"></i>
                        <span>{{ item.label }}</span>
                    </a>
                </RouterLink>
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
