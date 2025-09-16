<script setup lang="ts">
import { reactive } from "vue";
import { Form } from '@primevue/forms';
import { InputText, Message,  Button} from "primevue";

const initialValues = reactive({
    username: ''
});

const resolver = ({ values }) => {
    const errors = {};

    if (!values.username) {
        errors.username = [{ message: 'Username is required.' }];
    }

    return {
        values,
        errors
    };
};

const onFormSubmit = ({ valid }) => {
    if (valid) {
        console.log('nice');
    }
};
</script>

<template>
    <div class="card">
        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
            <div class="flex flex-col gap-1">
                <InputText name="username" type="text" placeholder="Username" fluid />
                <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error?.message }}</Message>
            </div>
            <Button type="submit" severity="secondary" label="Submit" />
        </Form>
    </div>
</template>


