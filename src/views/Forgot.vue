<template>
  <div>
    <h1 class="subheading grey--text">Recuperar senha</h1>

    <v-container fluid>
      <v-layout align-center justify-center row>
        <v-flex xs12 lg6>
          <v-card flat color="grey lighten-4">
            <v-form>
              <v-text-field prepend-icon="person" name="email" label="Email" v-model="email"></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="recoverPass()">Redefinir Senha</v-btn>
              </v-card-actions>
            </v-form>
            <v-alert
              :value="alert.status"
              :type="alert.message[0]"
              transition="slide-y-transition"
            >
              {{alert.message[1]}}
            </v-alert>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      alert: {
        status: false,
        message: ''
      }
    }
  },
  methods: {
    recoverPass() {
      axios({url: 'http://localhost:3000/forgot', data: {email: this.email}, method: 'POST'})
      .then((resp) => {
        this.alert.message = ['success', resp.data];
        this.alert.status = true;
      })
      .catch((err) => {
        this.alert.message = ['error', 'Não existe nenhum usúario cadastrado com este email.'];
        this.alert.status = true;
      })
    }
  }
}
</script>
