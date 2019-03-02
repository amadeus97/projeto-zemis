<template>
  <div>
    <h1 class="subheading grey--text">Cadastrar novo usúario</h1>

    <v-container fluid>
      <v-layout align-center justify-center row>
        <v-flex xs12 lg6>
          <v-card flat color="grey lighten-4">
            <v-form>
              <v-text-field prepend-icon="person" name="name" label="Nome" v-model="name"></v-text-field>
              <v-text-field prepend-icon="email" name="email" label="Email" v-model="email"></v-text-field>
              <v-text-field prepend-icon="lock" name="password" label="Senha" type="password" v-model="password"></v-text-field>
              <v-text-field prepend-icon="lock" name="password-confirm" label="Confirm Password" type="password" v-model="password_confirmation"></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="register">Cadastrar</v-btn>
              </v-card-actions>
              <v-layout>
                <v-spacer></v-spacer>
                <v-btn flat small color="grey" router to="/login">Entrar</v-btn>
              </v-layout>
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
export default {
  data() {
    return {
      name : "",
      email : "",
      password : "",
      password_confirmation : "",
      is_admin : null,
      alert: {
        status: false,
        message: ['error', 'As senhas fornecidas não coincidem.']
      }
    }
  },
  methods: {
    register: function () {
      if (this.password == this.password_confirmation) {
        let data = {
          name: this.name,
          email: this.email,
          password: this.password,
          is_admin: this.is_admin
        }
        this.$store.dispatch('register', data)
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err))
      } else {
        this.alert.status = true
      }
    }
  }
}
</script>
