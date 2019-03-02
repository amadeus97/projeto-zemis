<template>
  <div>
    <h1 class="subheading grey--text">Entrar em uma conta existente</h1>

    <v-container fluid>
      <v-layout align-center justify-center row>
        <v-flex xs12 lg6>
          <v-card flat color="grey lighten-4">
            <v-form>
              <v-text-field prepend-icon="person" name="email" label="Email" v-model="email"></v-text-field>
              <v-text-field prepend-icon="lock" name="password" label="Senha" type="password" v-model="password"></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="login">Login</v-btn>
              </v-card-actions>
              <v-layout>
                <v-spacer></v-spacer>
                <v-btn flat small color="grey" router to="/forgot">Recuperar Senha</v-btn>
                <v-btn flat small color="grey" router to="/register">Cadastrar</v-btn>
              </v-layout>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
	data(){
		return {
			email : "",
			password : ""
		}
	},
	methods: {
		login: function () {
			let email = this.email 
			let password = this.password
			this.$store.dispatch('login', { email, password })
			.then(() => this.$router.push('/'))
			.catch(err => console.log(err))
		}
	}
}
</script>