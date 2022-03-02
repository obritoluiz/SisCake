<template>
  <div class="main--colaboradores">
    <div class="titulo">
      <span>Colaboradores</span>
      
      <div class="novo--colaborador">

        <b-button @click="modalShow = !modalShow"> + </b-button>

        <b-modal v-model="modalShow" hide-header hide-footer size="sm">
          <div class="conteudo--modal">
            <span>Cadastrar novo colaborador:</span>
            <form @submit.prevent="novocolaborador">
              <div class="input-container">
                <label class="label" for="nome">Nome:</label>
                <input class="input" type="text" v-model="colaborador.nome" id="nome" placeholder="Digite o nome do colaborador" required >
              </div>
              <div class="input-container">
                <label class="label" for="email">Email:</label>
                <input class="input" type="text" v-model="colaborador.email" id="email" placeholder="Digite o email do novo colaborador" required >
              </div>
              <div class="input-container">
                <label class="label" for="password">Senha:</label>
                <input class="input" type="password" v-model="colaborador.senha" id="password" placeholder="Digite a senha do novo colaborador" required >
              </div>
              <div class="input-container">
                <label class="label" for="perfil">Perfil:</label>
                <b-form-select v-model="selected" :options="options" required></b-form-select>
              </div>
              <div class="btn--salvar">
                <button><b-icon class="icone" icon="file-earmark-arrow-up-fill"/>Salvar</button>
              </div>
            </form>
          </div>
        </b-modal>

      </div>
    </div>
    <div class="lista--colaboradores" v-for="colaborador in colaboradores" :key="colaborador.id">
      <div class="item">
        <div>{{ colaborador.nome }}</div>
        <div class="perfil--lista">{{ colaborador.perfil }}</div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  
  data() {
    return {
      modalShow: false,

      colaborador: {
        nome: '',
        email: '',
        senha: '',
        perfil: ''
      },
      selected: null,
      options: [
        { value: null, text: 'Escolha o perfil do colaborador' },
        { value: 'coordenador', text: 'Coordenador' },
        { value: 'colaborador', text: 'Colaborador' }
      ],

      colaboradores:[]
    }
  },

  mounted() {
    this.listarcolaboradores()
  },
  
  methods: {

    async listarcolaboradores() {
      const response = await this.$axios.get('colaboradores').then(response => {
        this.colaboradores = response.data
      }).catch(erro => {
        console.log(erro)
      })
    },

    async novocolaborador() {
      if(this.colaborador.nome != '') {
        await this.$axios.post('registrocolaborador', {
          nome: this.colaborador.nome,
          email: this.colaborador.email,
          senha: this.colaborador.senha,
          perfil: this.selected
        });
        this.listarcolaboradores()
        this.colaborador.nome = '';
        this.colaborador.email = '';
        this.colaborador.senha = '';
        this.selected = null;
        this.modalShow = !this.modalShow;
      } else {
        return
      }
      
    }
    
  },

  
}

</script>

<style scoped>
  .main--colaboradores {
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
  .titulo .novo--colaborador {
    width: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .lista--colaboradores {
    width: 95%;
    margin-top: 10px;
  }
  .lista--colaboradores .item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border-bottom: 3px solid #f5f5f5;
    cursor: pointer;
    transition: all 0.5s;
  }
  .lista--colaboradores .item:hover {
    background-color: #f5f5f5;
  }
  .lista--colaboradores .item .perfil--lista {
    width: 100px;
    padding-left: 10px;
    border-left: 1px solid #252525;
  }

  .conteudo--modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .conteudo--modal span {
    font-size: 19px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  .input-container label {
    font-weight: 500;
  }
  .input-container input {
    height: 35px;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #dbd9d9;
  }
  .btn--salvar {
    margin-top: 60px;
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