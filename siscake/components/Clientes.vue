<template>
  <div class="main--clientes">
    <div class="titulo">
      <span>Clientes</span>
      
      <div class="novo--cliente">

        <b-button @click="modalShow = !modalShow"> + </b-button>

        <b-modal v-model="modalShow" hide-header hide-footer size="sm">
          <div class="conteudo--modal">
            <span>Cadastrar novo cliente:</span>
            <form @submit.prevent="novoCliente">
              <div class="input-container">
                <label class="label" for="nome">Cliente:</label>
                <input class="input" type="text" v-model="cliente.nome" id="nome" placeholder="Digite o nome do cliente" required >
              </div>
              <div class="btn--salvar">
                <button><b-icon class="icone" icon="file-earmark-arrow-up-fill"/>Salvar</button>
              </div>
            </form>
          </div>
        </b-modal>

      </div>
    </div>
    <div class="lista--clientes" v-for="cliente in clientes" :key="cliente.id">
      <div class="item">
        <span>{{ cliente.nome }}</span>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  
  data() {
    return {

      modalShow: false,

      cliente: {
        nome: ''
      },

      clientes:[]
    }
  },
  
  methods: {

    async listarClientes() {
      const response = await this.$axios.get('clientes').then(response => {
        this.clientes = response.data
      }).catch(erro => {
        console.log(erro)
      })
    },

    async novoCliente() {
      if(this.cliente.nome != '') {
        await this.$axios.post('registrocliente', { nome: this.cliente.nome});
        this.listarClientes()
        this.cliente.nome = '';
        this.modalShow = !this.modalShow;
      } else {
        return
      }
    },    
  },
  
  mounted() {

    this.listarClientes()
    
  }
}

</script>

<style scoped>
  .main--clientes {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 95%;
    margin: 0 auto;
  }
  .titulo {
    height: 50px;
    width: 95%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    border-radius: 10px;
    background-color: #f5f5f5;
    color: #252525;
  }
  .titulo span {
    width: 95%;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
  .titulo .novo--cliente {
    width: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .lista--clientes {
    width: 95%;
    margin-top: 10px;
  }
  .lista--clientes .item {
    padding: 10px;
    border-radius: 10px;
    border-bottom: 3px solid #f5f5f5;
    cursor: pointer;
    transition: all 0.5s;
  }
  .lista--clientes .item:hover {
    background-color: #f5f5f5;
  }

  .conteudo--modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .conteudo--modal span {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
  }
  .input-container label {
    font-weight: 500;
  }
  .input-container input {
    height: 35px;
    width: 90%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #252525;
  }
  .btn--salvar {
    margin-top: 20px;
  }
  .btn--salvar button {
    height: 35px;
    border-radius: 10px;
    border: none;
    background-color: #252525;
    color: #f5f5f5;
    font-weight: 500;
    cursor: pointer;
  }

</style>