<template>
  <div class="collections">
    <span class="subheading grey--text">Items da coleção '{{ collection.name }}'</span>
    <v-btn small color="warning white--text" @click="deleteCollection()">Apagar</v-btn>
    <v-btn small color="success white--text" @click="updateCollection()">{{!this.collection.status?'Completa':'Incompleta'}}</v-btn>

    <v-container class="my-5">
      <v-card flat v-for="item in items" :key="item.id">
        <v-layout row align-center justify-center wrap class="pa-3">
          <v-flex xs1>
            <div class="caption grey--text">#</div>
            <div>{{ item.order_num }}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption grey--text">Nome</div>
            <div>{{ item.name }}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption grey--text">Criado em</div>
            <div>{{ item.created_at }}</div>
          </v-flex>
          <v-flex xs2>
            <v-btn class="grey white--text" @click="deleteItem(item.id)">Delete</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
      <v-card flat>
        <v-layout row align-center justify-center wrap class="pa-3">
          <v-flex xs1>
            <v-text-field label="N°" v-model="item.order"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field label="Nome" v-model="item.name"></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-btn class="grey white--text" @click="insertItem()">Adicionar</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'home',
  props: ['id'],
  data() {
    return {
      items: '',
      item: {
        order: '',
        name: ''
      },
      collection: {
        name: '',
        total: '',
        status: ''
      }
    }
  },
  methods: {
    getItems() {
      axios({url: 'http://localhost:3000/get-items', data: {id: this.id}, method: 'POST' })
      .then(resp => {
        this.items = resp.data;
      })
    },
    insertItem() {
      let order = this.item.order 
      let name = this.item.name
      axios({url: 'http://localhost:3000/insert-item', data: {order, name, collection:this.id}, method: 'POST' })
      location.reload()
    },
    deleteItem(id) {
      axios({url: 'http://localhost:3000/delete-item', data: {id}, method: 'DELETE' })
      location.reload();
    },
    deleteCollection() {
      axios({url: 'http://localhost:3000/delete-collection', data: {id: this.id}, method: 'DELETE' })
      this.$router.push('/');
    },
    updateCollection() {
      axios({url:'http://localhost:3000/update-status',data:{id: this.id,status:!this.collection.status?1:0},method:'PUT'})
      location.reload();
    }
  },
  created() {
    this.getItems();
    axios({url: 'http://localhost:3000/get-collection', data: {id: this.id}, method: 'POST'})
    .then(res => {
      this.collection.name = res.data.name;
      this.collection.total = res.data.total;
      this.collection.status = res.data.status;
    })
  }
}
</script>