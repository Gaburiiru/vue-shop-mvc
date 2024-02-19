<template>
  <v-carousel cycle hide-delimiter-background show-arrows-on-hover>
    <template v-slot:prev="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on">fas fa-chevron-circle-left</v-icon>
    </template>
    <template v-slot:next="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on">fas fa-chevron-circle-right</v-icon>
    </template>
    <v-carousel-item v-for="(slide, i) in slides" :key="i">
      <v-sheet :color="colors[i]" height="100%" class="rounded-b-xl pa-2">
        <v-row class="fill-height" align="center" justify="center">
          <div id="text" class="text-center white--text">{{ slide }}</div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  props: {
    slides: Array,
  },
  data() {
    return {
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4",
      ],
    };
  },
};
</script>
<style>
#text {
  font-size: 3rem;
}

@media screen and (max-width: 1000px) {
  #text {
    font-size: 2rem;
  }
}

@media screen and (max-width: 600px) {
  #text {
    font-size: 1.5rem;
  }
}
</style>