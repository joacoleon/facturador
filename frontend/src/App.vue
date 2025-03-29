<template>
  <v-app>
    <div v-if="userLogged">
      <v-navigation-drawer disable-resize-watcher v-model="showSidebar" app>
        <v-list>
          <v-list-item v-for="(item, index) in menuItems" :key="index" :value="index" :to="{ name: item.name }" :title="item.title"
            :prepend-icon="item.icon">
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app>
        <div class="app-bar-container">
          <div class="flex-1-1-0">
            <v-app-bar-title class="ml-sm-5">
              <v-app-bar-nav-icon class="hidden-sm-and-up" @click="showSidebar = !showSidebar"></v-app-bar-nav-icon>
              Facturador
            </v-app-bar-title>
          </div>

          <div class="d-none d-md-flex justify-center flex-1-1-0">
            <v-btn :active="false" v-for="(item, index) in menuItems" :key="index" :value="index" :to="{ name: item.name }"
              :prepend-icon="item.icon">
              {{ item.title }}
              <v-menu activator="parent" open-on-hover v-if="item.subitems">
                <v-list>
                  <v-list-item v-for="(subitem, index) in item.subitems" :key="index" :value="index" :to="{ name: subitem.name }">
                    <v-list-item-title>{{ subitem.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </div>
          <div class="d-flex justify-end flex-1-1-0">
            <v-btn class="mx-5 text-none">
              <span class="hidden-xs">{{ authStore.user?.displayName }}</span>
              <v-badge dot inline color="success">
                <v-avatar class="mr-1" color="red" size="30">
                  <span class="text-h7">{{ userInitials }}</span>
                </v-avatar>
              </v-badge>
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item value="1" class="text-center" :to="{ name: 'changePassword' }">
                    <v-list-item-title>Cambiar contraseña</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="2" class="text-center">
                    <v-btn variant="outlined" class="text-primary" density="comfortable"
                      @click="authStore.logout">Cerrar
                      sesión</v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </div>
        </div>
      </v-app-bar>
    </div>

    <v-main app class="bg-grey-lighten-4">
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore';
import ApiHelper from './commons/ApiHelper';
import { computed, ref } from 'vue';

// #region VARIABLES
const authStore = useAuthStore();
const showSidebar = ref(false);
const menuItems = ref([
  { title: 'Inicio', icon: 'mdi-home-outline', name: "home" },
  { title: 'Clientes', icon: 'mdi-account-outline', subitems: [{ title: "Alta de cliente", name: "newClient" }, { title: "Buscar cliente", name: "searchClient" }] },
  { title: 'Facturas', icon: 'mdi-invoice-fast-outline', subitems: [{ title: "Facturar", name: "newClient" }, { title: "Buscar factura", name: "newClient" }] },
  { title: 'Otros', icon: 'mdi-table-edit', subitems: [{ title: "Conceptos", name: "concepts" }] },
]);
// #endregion

// #region CREATED
init();
// #endregion

// #region METHODS
function init() {
  authStore.autoLogin();
}
// #endregion

// #region COMPUTED
const userLogged = computed(() => {
  return authStore.user;
})

const userInitials = computed(() => {
  return authStore.user?.displayName?.split(" ").map((n)=>n[0]).join("");
})
// #endregion

</script>

<style>
.app-bar-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 100%;
}
</style>
