<template>
  <div class="collections">
    <h1 class="subheading grey--text">Coleções</h1>

    <v-container class="my-5">

      <v-card flat v-for="collection in collections" :key="collection.name">
        <v-layout row wrap :class="`pa-3 project ${status(collection.status)}`"  @click="goToItems(collection.id)">
          <v-flex xs12 md6>
            <div class="caption grey--text">Nome da coleção</div>
            <div>{{ collection.name }}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Criado em</div>
            <div>{{ collection.created_at}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Total de tens</div>
            <div>{{ collection.total }}</div>
          </v-flex>
          <v-flex xs2 sm4 md2>
            <div class="right">
              <v-chip small :class="`${status(collection.status)} white--text caption my-2`">{{ status(collection.status)}}</v-chip>
            </div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
    </v-container>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'home',
  data() {
    return {
      dialog: false,
      collections: [],
    }
  },
  methods: {
    getCollections() {
      let user = JSON.parse(localStorage.getItem('user'))
      axios({url: 'http://localhost:3000/get-collections', data: {id: user.id}, method: 'POST' })
      .then(resp => {
        this.collections = resp.data;
        if (this.collections.length == 0) this.$router.push('/create-collection')
      })
    },
    goToItems(id) {
      this.$router.push(`/items/${id}`)
    },
    status(code) {
      if (code == 0) {return 'incompleta'}
      else if (code == 1) {return 'completa'}
    },
  },
  created() {
    this.getCollections();
  }
}
</script>

<style>
.project.completa {
  border-left: 4px solid #3cd1c2;
}
.project.incompleta {
  border-left: 4px solid orange;
}
.v-chip.completa {
  background: #3cd1c2;
}
.v-chip.incompleta {
  background: #ffaa2c;
}
</style>