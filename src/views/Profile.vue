<template>
  <div class="collections">
    <h1 class="subheading grey--text">Perfil</h1>

    <v-container fluid>
      <v-layout align-center justify-center row>
        <v-flex xs12 lg6>
          <v-card flat color="grey lighten-4">
            <div>
              <span class="headline grey--text">Nome:</span> <span class="headline grey--text">{{user.name}}</span><br>
              <span class="headline grey--text">Email:</span> <span class="headline grey--text">{{user.email}}</span><br>
              <v-btn class="grey white--text" @click="updateProfile()">alterar perfil</v-btn>
            </div>
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
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    updateProfile() {
      this.$router.push('/update-profile')
    }
  }
}
</script>