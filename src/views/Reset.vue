<template>
  <div>
    <h1 class="subheading grey--text">Redefinir senha</h1>

    <v-container fluid>
      <v-layout align-center justify-center row>
        <v-flex xs12 lg6>
          <v-card flat color="grey lighten-4">
            <v-form>
              <v-text-field prepend-icon="lock" label="Senha" v-model="password" type="password"></v-text-field>
              <v-text-field prepend-icon="lock" label="Confirmar senha" v-model="confirmPass" type="password"></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="updatePassword()">Redefinir Senha</v-btn>
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
  props: ['token'],
  data() {
    return {
      password: '',
      confirmPass: '',
      alert: {
        status: false,
        message: ['error', 'As senhas fornecidas não coincidem.']
      }
    }
  },
  methods: {
    updatePassword() {
      let password = this.password;
      if (password == this.confirmPass) {
        axios({url: `http://localhost:3000/reset/${this.token}`, data: {password}, method: 'POST'})
        .then((resp) => {
          this.$router.push(`/login`)
        })
      } else {
        this.alert.status = true;
      }
    }
  }
}
</script>
