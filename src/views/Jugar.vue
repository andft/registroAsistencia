<template>
    <CardInicio titulo="¡¡A Jugar entonces, NO?!!, pero...., si estas preparado, dale, TE ESPERO !!" class="column justify-center items-center">
        <div class="column q-gutter-xl">
            <div class="column justify-center">
                <div><img :src="LocoJugar" alt=""></div>
                <div><BotonIniciar to="/categorias">AH JUGARRRR !!</BotonIniciar></div>
            </div>
        </div>
    </CardInicio>
</template>

<script setup>
import BotonIniciar from "../components/BotonIniciar.vue";
import CardInicio from "../components/CardInicio.vue";
import LocoJugar from "../assets/LocoJugar.png";
</script>

<style scoped></style>