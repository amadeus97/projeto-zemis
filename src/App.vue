<template>
  <v-app class="grey lighten-4">
    <v-toolbar app color="deep-purple lighten-1">
      <v-toolbar-title class="headline text-uppercase white--text">
        <span>Projeto</span>
        <span class="font-weight-light">Zemis</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn v-if="isLoggedIn" flat class=" white--text" to="/">Coleções</v-btn>
      <v-btn v-if="isLoggedIn" flat class="white--text" router to="/create-collection">Criar Coleção</v-btn>     
      <v-btn v-if="isLoggedIn" flat class="white--text" router to="/profile">Perfil</v-btn>
      <v-btn v-if="isLoggedIn" flat class="white--text" @click="logout">
        <span class="mr-2">Sair</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>

      <v-btn v-if="!isLoggedIn" flat class="white--text" router to="/login">
        <span class="mr-2">Entrar</span>
        <v-icon right>person</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content class="mx-4 mt-2 mb-4">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        listItems: [
          { title: 'Coleções', route: '/'},
        ]
      }
    },
    computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    },
    created: function () {
      this.$http.interceptors.response.use(undefined, function (err) {
        return new Promise(function (resolve, reject) {
          if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
            this.$store.dispatch(logout)
          }
          throw err;
        });
      });
    }
  }
</script>