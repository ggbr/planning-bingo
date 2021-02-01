<template>
    <div class="columns is-centered">
        <div class="column is-full">
                <img  width="250" alt="Vue logo" src="./assets/bingo.png">
            <div v-if="admin == null">
                <button v-on:click="setAdmin(true)">Sou PO ou quem manda</button>
                <button v-on:click="setAdmin(false)">Sou Qualquer outra coisa</button>
            </div>
        
            <BingoComponent admin="1" v-if="admin == 1"/>
            <BingoComponent admin="0" v-if="admin == 0"/>
        </div>
    </div>
  
</template>

<script>
import BingoComponent from './components/BingoComponent.vue'

export default {
  name: 'App',
  data: function() {
    return  {
      admin: null,
    }
  },
  components: {
    BingoComponent
  },
  methods: {
           
    setAdmin(bol) {
        this.admin = bol;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #ecf0f1;
}
</style>
