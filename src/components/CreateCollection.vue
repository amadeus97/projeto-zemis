<template>
  <div class="home">
    
    <v-container fluid>
      <v-layout align-center justify-center row>
        <v-flex xs12 lg6>
          <v-card flat color="grey lighten-4">
            <v-form>
              <v-text-field name="name" label="Nome" v-model="name"></v-text-field>
              <v-text-field name="total" label="Total de items" v-model="total"></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="createCollection">Criar Coleção</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'home',
  data() {
    return {
      name: '',
      total: ''
    }
  },
  methods: {
    createCollection() {
      let name = this.name 
      let total = this.total
      let user = JSON.parse(localStorage.getItem('user'))
      axios({url: 'http://localhost:3000/insert-collection', data: {name, total, owner: user.id}, method: 'POST' })
      this.$router.push('/');
    }
  }
}
</script>