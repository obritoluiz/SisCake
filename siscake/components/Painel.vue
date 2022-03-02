<template>
  <div class="main--painel">
    <div class="card--painel" v-for="dado in dados" :key="dado.dia">
      <div class="titulo--card"><p><span>Dia</span>{{ dado.dia }}</p></div>
      <div class="descricao--card">
        <p>{{ dado.qtde }} <span v-if="dado.qtde === 1"> ordem aberta</span><span v-else >ordens abertas</span></p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
  data() {
    return {
     
      dados: []

    }
  },

  methods: {
    
    async listarDados() {
      const response = await this.$axios.get('dadospainel').then(response => {

        this.dados = response.data;
      }).catch(erro => {
        console.log(erro)
      });
    },

  },

  mounted() {
    this.listarDados();
  },

}

</script>

<style>
  
  .main--painel {
    width: 95%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .card--painel {
    width: 150px;
    height: 150px;
    background-color: #f5f5f5;
    color: #252525;
    border-radius: 10px;
    margin: 10px;
  }
  .titulo--card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 30%;
    background-color: #c4bebe;
    color: #252525;
    border-radius: 10px 10px 0 0;
  }
  .titulo--card p {
    margin-top: 20px;
    font-weight: 500;
  }
  .titulo--card span {
    margin-right: 5px;
  }

  .descricao--card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 70%;
    color: #252525;
    border-radius: 0 0 10px 10px;
  }

</style>