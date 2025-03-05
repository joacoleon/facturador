import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import router from '@/router';

export const useAuthStore = defineStore('authStore', () => {
    const user = ref<User | null>(null);

    const getIdToken = async (): Promise<string | null> => {
        console.log("getIdToken")
        if (user.value) {
            return await user.value.getIdToken(true);
        }
        return null;
    };

    const autoLogin = () => {
        onAuthStateChanged(auth, (firebaseUser) => {
            user.value = firebaseUser;
        });
    }

    const getCurrentUser = () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
    };

    const logout = async () => {
        await signOut(auth);
        user.value = null;
        router.push({ name: 'login' });
    }

    return { user, getIdToken, autoLogin, logout, getCurrentUser };
})