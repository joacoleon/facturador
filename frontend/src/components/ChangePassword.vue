<template>
    <v-container>
        <v-dialog persistent v-model="changePasswordDialog" max-width="300px">
            <v-card>
                <v-card-title class="text-center">Cambiar contraseña</v-card-title>
                <v-form ref="changePasswordForm" v-model="changePasswordValidForm">
                    <div v-if="!emailWasSent">
                        <p class="px-2 mb-3 text-body-2 font-weight-light text-grey text-center">Recibiras un correo
                            electronico
                            para
                            proceder con el cambio de contraseña.</p>
                        <v-card-text>
                            <v-row dense justify="center">
                                <v-col cols="12">
                                    <v-text-field density="compact" variant="outlined" label="Email" v-model="email"
                                        :rules="emailRules" required></v-text-field>
                                </v-col>
                                <p class="text-error">{{ changePasswordErrorMessage }}</p>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-btn block class="bg-info" @click="resetPassword()">
                                        Enviar correo
                                    </v-btn>
                                </v-col>
                                <v-col class="text-center pt-0">
                                    <v-btn class="text-none" color="primary" text="Volver" variant="text"
                                        density="compact" size="small" @click="$router.go(-1)"></v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </div>
                    <div v-else>
                        <div class="text-center mb-3">
                            <v-icon color="success" icon="mdi-check-circle-outline" size="50"></v-icon>
                        </div>
                        <p class="px-2 mb-3 text-body-2 font-weight-light text-grey text-center">El correo electronico
                            ha sido
                            enviado.
                            Seras redireccionado al inicio de sesión.</p>
                        <v-progress-linear v-model="progress" color="success"></v-progress-linear>
                    </div>
                </v-form>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { auth } from '@/config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, shallowRef } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();

const email = ref("");
const emailWasSent = ref(false);
const changePasswordDialog = shallowRef(true);

const progress = ref(0);
const interval = ref(0);

const changePasswordErrorMessage = ref("");

//VALIDATION
const changePasswordForm = ref();
const changePasswordValidForm = ref(false);
const emailRules = ref([
    (value: any) => {
        if (value) return true
        return 'El email es obligatorio.'
    }
]);

async function validateChangePasswordForm() {
    const { valid } = await changePasswordForm.value.validate();
    return valid;
}

const resetPassword = async () => {
    if (await validateChangePasswordForm()) {
        await sendPasswordResetEmail(auth, email.value)
            .then(() => {
                emailWasSent.value = true;
                clearInterval(interval.value)
                interval.value = setInterval(() => {
                    progress.value += 1

                    if (progress.value >= 100) {
                        clearInterval(interval.value);
                        authStore.logout();
                    }
                }, 70);
            }).catch((e) => {
                switch (e.code) {
                    case "auth/invalid-email":
                        changePasswordErrorMessage.value = "Ingresa un correo electronico valido."
                        break;
                    case "auth/user-not-found":
                        changePasswordErrorMessage.value = "No se encontro un usuario con el correo electronico ingresado."
                        break;
                    default:
                        changePasswordErrorMessage.value = "Hubo un error. Espera unos minutos e intenta nuevamente."
                        break;
                }
            })
    }
}
</script>