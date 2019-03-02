<template>
  <div class="collections">
    <h1 class="subheading grey--text">Atualizar informações do Perfil</h1>

    <v-container fluid>
      <v-layout align-center justify-center row>
        <v-flex xs12 lg6>
          <v-card flat color="grey lighten-4">
            <v-form>
              <v-text-field prepend-icon="person" label="Nome" v-model="name"></v-text-field>
              <v-text-field prepend-icon="mail" label="Email" v-model="email"></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="updateProfile()">Atualizar Perfil</v-btn>
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
  data() {
    return {
      name: '',
      email: '',
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    updateProfile() {
      if (this.name != '' && this.email != '') {
        axios({
        url: 'http://localhost:3000/update-profile',
        data: {
          name: this.name,
          email: this.email,
          id: this.user.id
        },
        method: 'POST'
        })
        .then((resp) => {
          this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
        })
      }
    }
  }
}
</script>