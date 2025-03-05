<template>
    <v-container>
        <v-dialog persistent v-model="loginDialog" max-width="300px">
            <v-card>
                <v-card-title class="text-center">Iniciar sesión</v-card-title>
                <v-form ref="loginForm" v-model="loginValidForm" @submit.prevent>
                    <v-card-text>
                        <v-row dense justify="center">
                            <v-col cols="12">
                                <v-text-field density="compact" variant="outlined" label="Email" v-model="email"
                                    :rules="emailRules" required></v-text-field>
                            </v-col>
                            <v-col cols="12" class="mb-0 pb-0">
                                <v-text-field density="compact" variant="outlined" label="Contraseña" v-model="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append-inner="showPassword = !showPassword" :rules="passwordRules"
                                    required></v-text-field>
                            </v-col>
                            <p class="text-error">{{ loginErrorMessage }}</p>
                            <v-col class="text-center mt-3 pt-0">
                                <v-btn class="text-none" color="primary" text="Olvide mi contraseña" variant="text"
                                    density="compact" size="small" @click="goToChangePassword"></v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="text-center pt-0">
                                <v-btn block class="bg-info" @click="login">
                                    Ingresar
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-form>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, shallowRef } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import router from '@/router';

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loginDialog = shallowRef(true);
const loginErrorMessage = ref("");

//VALIDATION
const loginForm = ref();
const loginValidForm = ref(false);
const emailRules = ref([
    (value: any) => {
        if (value) return true
        return 'El email es obligatorio.'
    }
]);
const passwordRules = ref([
    (value: any) => {
        if (value) return true
        return 'La contraseña es obligatoria.'
    }
]);

async function validateLoginForm() {
    const { valid } = await loginForm.value.validate();
    return valid;
}

const login = async () => {
    if (await validateLoginForm()) {
        console.log("login");
        await signInWithEmailAndPassword(auth, email.value, password.value)
            .then((result) => {
                authStore.user = result.user;
                loginDialog.value = false;
                router.push({ name: 'home' });
            }).catch((e) => {
                switch (e.code) {
                    case "auth/invalid-email":
                        loginErrorMessage.value = "Ingresa un correo electronico valido."
                        break;
                    case "auth/invalid-credential":
                        loginErrorMessage.value = "Correo electronico y/o contraseña incorrectos."
                        break;
                    default:
                        loginErrorMessage.value = "Hubo un error. Espera unos minutos e intenta nuevamente."
                        break;
                }
            });
    }
}

const goToChangePassword = async () => {
    router.push({ name: 'changePassword' });
}
</script>