<template>
  <div class="main--telacolaborador">
    <div class="titulo--page">
      <h1><b-icon class="icone" icon="file-earmark"/>Ordens de serviços em Aberto</h1>
    </div>
    <div class="ordens--colaborador">
      <div class="ordem" v-for="ordem in ordensUsuario" :key="ordem.id">
        <div class="titulo--os">{{ ordem.titulo }}</div>
        <div class="cliente--os"><span>Cliente:</span>{{ ordem.cliente }}</div>
        <div class="data--os"><span>Aberta em</span>{{ ordem.data }}</div>
        <div class="div--detalhes">
          <b-button class="btn--detalhes" @click="$bvModal.show('ordem' + ordem.id)">+ Detalhes</b-button>
        </div>
        <b-modal :id="'ordem' + ordem.id" title="Descrição" hide-footer size="sm" no-close-on-backdrop>
          <div class="descricao--os">{{ ordem.descricao }}</div>
          <div class="btn--finalizar">
            <b-button @click="finalizarOrdem(ordem.id)">Finalizar O.S.</b-button>
          </div>
        </b-modal>
      </div>
    </div>

    <!-- Div onde fica o botão flutuante -->
    <div
      v-b-popover.hover.top="'Adicionar nova ordem de serviço'"
      class="flutuante"
      @click="abrirModal">
      <span class="material-icons"> add_box </span>
    </div>

    <!-- Modal de adicionar nova ordem -->
    <div>
      <b-modal v-model="modalAdicionar" hide-header hide-footer size="sm" no-close-on-backdrop>
        <div class="conteudo--modal">
          <div class="titulo--modal">
            <span>Cadastrar nova ordem</span>
            <span class="btn--fechar material-icons" @click="modalAdicionar = !modalAdicionar; limparForm()">close</span>
          </div>
          <b-form @submit="novaOrdem">
            <div class="input-container">
              <label for="nome">Titulo:</label>
              <input type="text" v-model="ordem.titulo" id="titulo" placeholder="Digite o titulo da ordem de serviço" required >
            </div>
            <div class="input-container">
              <label for="descricao">Descrição:</label>
              <textarea v-model="ordem.descricao" id="descricao" placeholder="Digite a descrição da ordem de serviço" required wrap="hard"/>
            </div>
            <div class="input-container">
              <label for="colaborador">Colaborador:</label>
              <select v-model="ordem.colaborador" id="colaborador" required>
                <option value="" disabled selected>--Selecione--</option>
                <option v-for="colaborador in colaboradores" :key="colaborador.id" :value="colaborador.nome">{{colaborador.nome}}</option>
              </select>
            </div>
            <div class="input-container">
              <label for="cliente">Cliente:</label>
              <select v-model="ordem.cliente" id="perfil" required>
                <option value="" disabled selected>--Selecione--</option>
                <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.nome">{{cliente.nome}}</option>
              </select>
            </div>
            
            <div class="btn--salvar">
              <b-button type="submit" ><b-icon class="icone" icon="file-earmark-arrow-up-fill"/>Salvar</b-button>
            </div>
          </b-form>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  
  data() {
    return {

      modalAdicionar: false, //modal de adicionar novas ordens

      usuario: {
        nome: '',
        perfil: ''
      },

      // Objeto que será enviado para o servidor para cadastrar nova ordem
      ordem: {
        titulo: '',
        descricao: '',
        colaborador: '',
        cliente: '',
        latitude: '',
        longitude: ''
      },

      ordens: [], // Array de ordens de serviço
      clientes: [], // Array de clientes
      colaboradores: [] // Array de colaboradores
      

    }
  },

  methods: {

    limparForm() {
      this.ordem.titulo = '';
      this.ordem.descricao = '';
      this.ordem.colaborador = '';
      this.ordem.cliente = '';
      this.ordem.latitude = '';
      this.ordem.longitude = '';
    },

    abrirModal() {
      this.modalAdicionar = !this.modalAdicionar;
      this.getLocation()
    },

    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },

    showPosition(position) {
      this.ordem.latitude = position.coords.latitude
      this.ordem.longitude = position.coords.longitude
    },

    async listarOrdens() {
      const response = await this.$axios.get('ordens').then(response => {

        this.ordens = response.data

      }).catch(erro => {
        console.log(erro)
      });
    },

    // Função para fazer a busca e listar os colaboradores cadastrados no banco
    async listarColaboradores() {
      const response = await this.$axios.get('colaboradores').then(response => {

        this.colaboradores = response.data
      }).catch(erro => {
        console.log(erro)
      });
    },

    // Função para fazer a busca e listar os clientes cadastrados no banco
    async listarClientes() {
      const response = await this.$axios.get('clientes').then(response => {
        this.clientes = response.data
      }).catch(erro => {
        console.log(erro)
      });
    },

    // Função para criar uma nova ordem de serviço
    async novaOrdem(event) {
      event.preventDefault()

      if(this.ordem.titulo != '') {
        await this.$axios.post('registroordem', {

          titulo: this.ordem.titulo,
          descricao: this.ordem.descricao,
          colaborador: this.ordem.colaborador,
          cliente: this.ordem.cliente,
          latitude: this.ordem.latitude,
          longitude: this.ordem.longitude,
          status: 'Aberta',
          usuario: this.usuario.nome

        })

        this.listarOrdens()
        this.limparForm()

        this.$bvToast.toast('Ordem cadastrada com sucesso', {
          title: 'Usuário cadastrado',
          variant: 'success',
          autoHideDelay: 2000,
          solid: true
        })

        this.modalAdicionar = !this.modalAdicionar;
      
      } else {
        return
      }
    },

    // Função para atualizar a ordem de serviço para finalizada
    async finalizarOrdem(ordem) {
      
      try {
        await this.$axios.put('ordem', {
          id: ordem,
          status: 'Finalizada'
        })

        this.$bvModal.hide('modalDescricao')
        this.listarOrdens()

        this.$bvToast.toast('Ordem finalizada com sucesso', {
          title: 'Ordem finalizada',
          variant: 'success',
          autoHideDelay: 2000,
          solid: true

        })
   
      } catch (error) {

        this.$bvModal.hide('modalDescricao')
        this.listarOrdens()

        this.$bvToast.toast('Erro, Ordem não atualizada', {
          title: 'Erro',
          variant: 'warning',
          autoHideDelay: 3000,
          solid: true
        })
      }
    },
  },

  mounted() {

    // Pegando o nome do usuário logado no sistema
    if (localStorage.nome) {
      this.usuario.nome = localStorage.nome
    }
    if (localStorage.perfil) {
      this.usuario.perfil = localStorage.perfil
    }

    this.listarOrdens()
    this.listarColaboradores()
    this.listarClientes()

    console.log(this.usuario.nome)
  },

  computed: {

    // Função para filtrar as ordens de serviço do colaborador logado no sistema
    ordensUsuario() {

      let valores = []
      console.log(this.usuario.nome)

      valores = this.ordens.filter((item) => {
        return item.colaborador === this.usuario.nome
      })

      valores = valores.filter((item) => {
        return item.status === 'Aberta'
      })

      return valores
    }

  }

  

}
</script>

<style>

  .titulo--page  {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px auto;
    font-family: 'Roboto', sans-serif;
  }
  .titulo--page h1 {
    font-size: 20px;
    font-weight: bold;
    color: #252525;
    background-color: #f5f5ff55;
    padding: 10px;
    border-radius: 5px;
    background: #f5f5ff;
    box-shadow: inset 20px 20px 60px #d0d0d9,
            inset -20px -20px 60px #ffffff;
  }

  .ordens--colaborador {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ordens--colaborador .ordem {
    height: 250px;
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f5f5f5;
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    background: linear-gradient(145deg, #dddddd, #ffffff);
    box-shadow:  20px 20px 60px #d0d0d0,
                -20px -20px 60px #ffffff;
  }
  .ordem .titulo--os {
    font-weight: bold;
  }
  .ordem .cliente--os span {
    font-weight: bold;
    margin-right: 5px;
  }
  .ordem .data--os span {
    font-weight: bold;
    margin-right: 5px;
  }
  .ordem .div--detalhes {
    display: flex;
    justify-content: flex-end;
  }
  .ordem .btn--detalhes {
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    margin-top: 10px;
    cursor: pointer;
  }
  .descricao--os {
    margin: 20px 0;
  }
  .btn--finalizar {
    display: flex;
    justify-content: flex-end;
  }

</style>