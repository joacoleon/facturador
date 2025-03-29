<template>
    <v-container>
        <h1>Conceptos</h1>
        <v-breadcrumbs :items="items">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
        <v-card>
            <v-skeleton-loader :loading="isLoading" height="545" type="list-item, table-tbody, table-tfoot" class="p-3">
                <v-data-table density="compact" :headers="headers" :items="concepts" :search="search"
                    :sort-by="[{ key: 'name', order: 'asc' }]">
                    <template v-slot:top>
                        <v-toolbar>
                            <v-spacer v-if="!mobile"></v-spacer>
                            <v-text-field density="compact" variant="outlined" :class="['bg-white', { 'ml-5': mobile }]"
                                hide-details single-line append-inner-icon="mdi-magnify"
                                v-model="search"></v-text-field>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="300px">
                                <template v-slot:activator="{ props }">
                                    <v-btn prepend-icon="mdi-plus" v-bind="props">
                                        {{ mobile ? 'Nuevo' : 'Nuevo concepto' }}
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-form ref="conceptForm" v-model="conceptValidForm" @submit.prevent>
                                        <v-card-title>
                                            <span class="text-h5">{{ saveConceptFormTitle }}</span>
                                        </v-card-title>
                                        <v-skeleton-loader :loading="isSaving" height="263" type="list-item@2, actions">
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12">
                                                        <v-text-field density="compact" variant="outlined"
                                                            v-model="selectedConcept.name" label="Nombre"
                                                            :rules="conceptNameRules" required>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-select density="compact" variant="outlined"
                                                            v-model="selectedConcept.category"
                                                            :items="conceptCategories" label="Categoria"
                                                            item-title="name" required>
                                                        </v-select>
                                                    </v-col>
                                                </v-row>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="primary" variant="text"
                                                        @click="closeSaveConceptModal">
                                                        Cancelar
                                                    </v-btn>
                                                    <v-btn type="submit" color="primary" variant="tonal"
                                                        @click="saveConcept">
                                                        Guardar
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-container>
                                        </v-skeleton-loader>
                                    </v-form>
                                </v-card>
                            </v-dialog>

                            <v-dialog v-model="statusDialog" max-width="640px">
                                <v-card>
                                    <v-container>
                                        <v-card-title class="text-wrap text-center"><span class="text-subtitle-1">
                                                Estas seguro de {{ selectedConcept.isActive ? 'desactivar' : 'activar'
                                                }} el
                                                concepto</span> {{ selectedConcept.name }}<span
                                                class="text-subtitle-1">?</span>
                                        </v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" variant="text"
                                                @click="closeChangeConceptStatusModal">Cancelar</v-btn>
                                            <v-btn color="primary" variant="tonal" @click="saveConceptStatus">Guardar</v-btn>
                                        </v-card-actions>
                                    </v-container>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.isActive="{ value }">
                        <p density="compact" size="small" :class="value ? 'text-green' : 'text-red'">
                            {{ value ? 'Activo' : 'Inactivo' }}
                        </p>
                    </template>
                    <template v-slot:item.edit="{ item }: any">
                        <v-tooltip text="Editar" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" @click="openSaveConceptModal(item)">
                                    mdi-pencil
                                </v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.activate="{ item }: any">
                        <v-tooltip text="Activar" location="top" v-if="!item.isActive">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="success" size="small"
                                    @click="openChangeConceptStatusModal(item)">
                                    mdi-check-bold
                                </v-icon>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Desactivar" location="top" v-if="item.isActive">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="red" size="small"
                                    @click="openChangeConceptStatusModal(item)">
                                    mdi-close-thick
                                </v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                    <template v-slot:no-data>
                        <div v-if="getConceptsServiceError">
                            <v-container>
                                <v-icon color="grey" size="100">mdi-alert-circle-outline</v-icon>
                                <p class="my-3">Ocurrio un error. Volve a intentar luego.</p>
                                <v-btn color="primary" size="small" @click="init()">
                                    Reintentar
                                </v-btn>
                            </v-container>
                        </div>
                        <div v-else-if="search">
                            <v-container>
                                <p class="mb-3">No se encontraron resultados para: <b>{{ search }}</b>.</p>
                                <v-btn color="primary" @click="init()">
                                    Resetear
                                </v-btn>
                            </v-container>
                        </div>
                        <div v-else>
                            <v-container>
                                <p>Tenes que dar de alta conceptos para visualizarlos en esta lista.</p>
                            </v-container>
                        </div>
                    </template>
                </v-data-table>
            </v-skeleton-loader>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import ApiHelper from '@/commons/ApiHelper';
import { useDisplay } from 'vuetify';

// #region VARIABLES
const { mobile } = useDisplay();

const items = ref([
    {
        title: 'Inicio',
        disabled: false,
        href: '/',
    },
    {
        title: 'Conceptos',
        disabled: true,
        href: '/concepts',
    }
]);
const search = ref("");
const concepts = ref<object[]>([]); //TODO -> Probar: const concepts = ref([]);
const dialog = ref(false);
const statusDialog = ref(false);
const headers = ref<object[]>([
    { title: 'Nombre', key: 'name', sortable: true },
    { title: 'Categoria', key: 'category', sortable: true },
    { title: 'Estado', key: 'isActive', sortable: true },
    { title: 'Editar', key: 'edit', sortable: false, align: "center", width: "10%" },
    { title: 'Activar / Desactivar', key: 'activate', sortable: false, align: "center", width: "10%" }
]);
const selectedConceptIndex = ref(-1);
const selectedConcept = ref({
    name: '',
    category: null,
    isActive: true
});
const defaultConcept = ref({
    name: '',
    category: null,
    isActive: true
});
const isSaving = ref(false);
const isLoading = ref(false);

const conceptCategories = [
    { id: 1, name: "Productos" },
    { id: 2, name: "Servicios" },
    { id: 3, name: "Productos y Servicios" }
];

// VALIDATION
const conceptForm = ref();
const conceptValidForm = ref(false);
const conceptNameRules = ref([
    (value: any) => {
        if (value) return true
        return 'El nombre es obligatorio.'
    }
]);

//ERROR HANDLING
const getConceptsServiceError = ref(false);
// #endregion

// #region CREATED
init();
// #endregion

// #region METHODS
async function init() {
    search.value = "";
    await getConcepts();
}

async function getConcepts() {
    getConceptsServiceError.value = false;
    isLoading.value = true;
    ApiHelper.get('concept/list')
        .then((response) => {
            concepts.value = response.data;
        }).catch((e) => {
            console.log(e);
            getConceptsServiceError.value = true;
        }).finally(() => {
            isLoading.value = false;
        })
}

async function saveConcept() { //Guarda, ya sea edicion o nuevo
    if (await validateConceptForm()) { //Si el form es valido
        if (selectedConceptIndex.value > -1) { //Si el index es mayor a -1, quiere decir que es una edicion
            editConcept();
        } else { //Si el index no es mayor a -1, quiere decir que es una categoria nueva
            newConcept();
        }
    }
}

async function validateConceptForm() {
    const { valid } = await conceptForm.value.validate();
    return valid;
}

async function editConcept() {
    isSaving.value = true;

    ApiHelper.put('concept/update', selectedConcept.value)
        .then(async (response) => {
            if (response.status == 200) {
                closeSaveConceptModal();
                await getConcepts();
            }
        }).catch((e) => {
        }).finally(() => {
            isSaving.value = false;
        })
}

async function newConcept() {
    isSaving.value = true;
    ApiHelper.post('concept/add', selectedConcept.value)
        .then(async (response) => {
            if (response.status == 200) {
                closeSaveConceptModal();
                await getConcepts();
            }
        }).catch((e) => {
            console.log(e);
        }).finally(() => {
            isSaving.value = false;
        })
}

async function saveConceptStatus() {
    if (selectedConcept.value.isActive) {
        await disableItem();
    } else {
        await enableItem();
    }
}

async function enableItem() {
    ApiHelper.put('concept/activate', selectedConcept.value)
        .then(async (response) => {
            if (response.status == 200) {
                closeChangeConceptStatusModal();
                await getConcepts();
            }
        }).catch((e) => {
            console.log(e);
        })
}

async function disableItem() {
    ApiHelper.put('concept/deactivate', selectedConcept.value)
        .then(async (response) => {
            if (response.status == 200) {
                closeChangeConceptStatusModal();
                await getConcepts();
            }
        }).catch((e) => {
            console.log(e);
        })
}

function openSaveConceptModal(item: any) { //Se llama al tocar el lapiz
    selectedConceptIndex.value = concepts.value.indexOf(item); //editedIndex es igual al index de la categoria que le paso por parametro
    selectedConcept.value = Object.assign({}, item);
    dialog.value = true;
}

function openChangeConceptStatusModal(item: any) {
    selectedConceptIndex.value = concepts.value.indexOf(item); //editedIndex es igual al index de la categoria que le paso por parametro
    selectedConcept.value = Object.assign({}, item);
    statusDialog.value = true;
}

function closeSaveConceptModal() { //Se llama despues de editar, agregar o cancelar
    dialog.value = false;
    nextTick(() => {
        selectedConcept.value = Object.assign({}, defaultConcept.value);
        selectedConceptIndex.value = -1;
    })
}

function closeChangeConceptStatusModal() {
    statusDialog.value = false;
    nextTick(() => {
        selectedConcept.value = Object.assign({}, defaultConcept.value);
        selectedConceptIndex.value = -1;
    })
}

// #endregion

// #region COMPUTED
const saveConceptFormTitle = computed(() => {
    return selectedConceptIndex.value === -1 ? 'Nuevo concepto' : 'Editar concepto'
})
// #endregion

// #region WATCHES
watch(dialog, val => { //TODO -> Ver para que sirve esto
    val || closeSaveConceptModal()
})
// #endregion
</script>

<style scoped>
.v-toolbar-title {
    /* Para sacarle el espacio a la derecha y poder alinear el text-field */
    flex: none;
}

/*::v-deep(th) {
    background-color: red;

    When using scoped sometimes it is required to use ::v-deep(...) wrapper because 
    scoped styles try to be smart and apply to only the classes used in the template 
    but the algorithm won't resolve classes hidden inside components. I suggest ::v-deep(.v-table) > .v-table__wrapper > ... 
}*/
</style>