<template>
  <div class="main--ordens">
    <!-- Div com os elementos de filtro -->
    <div class="busca">
      <div class="filtros">
        <div class="selects">
          <select v-model="filtro.colaborador" id="colaborador">
            <option value="" selected>Colaboradores</option>
            <option v-for="colaborador in colaboradores" :key="colaborador.id" :value="colaborador.nome">{{ colaborador.nome }}</option>
          </select>
          <select v-model="filtro.cliente" id="cliente">
            <option value="" selected>Clientes</option>
            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.nome">{{ cliente.nome }}</option>
          </select>
          <select v-model="filtro.status" id="status">
            <option value="" selected>Status</option>
            <option value="Aberta" selected>Aberta</option>
            <option value="Finalizada" selected>Finalizada</option>
          </select>
        </div>
        <div class="datas">
          <input type="date" v-model="filtro.dataInicio" id="inicio">
          <input type="date" v-model="filtro.dataFim" id="inicio">
          <div @click="limparFiltros"><span class="material-icons limpar--filtro">delete_outline</span></div>
        </div>
      </div>
      <div class="ordenacao">
        <div class="button" @click="cliente(ordenaCliente = !ordenaCliente)"><span class="material-icons">unfold_more</span>Cliente</div>
        <div class="button" @click="colaborador(ordenaColaborador = !ordenaColaborador)"><span class="material-icons">unfold_more</span>Colaborador</div>
        <div class="button" @click="data(ordenaData = !ordenaData)"><span class="material-icons">unfold_more</span>Data</div>
      </div>
    </div>

    <!-- Div onde fica a tabela com as ordens de serviços abertas -->
    <div class="lista--ordens"> 
      <div class="tabela">
        <b-table
          id="my-list"
          sticky-header="500px"
          responsive
          hover
          striped
          ref="tblOrdens"
          :items="filtroOrdens"
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
          selectable
          clearSelected
          @row-clicked="rowClicked($event)"
        ></b-table>
      </div>
      <div class="paginacao">
        <b-pagination
          align="center"
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-list"
          pills
        ></b-pagination>
      </div>
    </div>

    <!-- Modal de detalhes da ordem de serviço -->
    <b-modal id="modalDescricao" hide-footer size="sm" title="Descrição" no-close-on-backdrop>
      <div class="modal--descricao">
        <div class="descricao">{{ ordemModal.descricao }}</div>

        <div class="autor">
          <div><span>O.S. foi aberta por:</span><i>{{ ordemModal.autor }}</i></div>
        </div>
        <div class="btn--finalizar">
          <b-button v-if="ordemModal.status === 'Aberta'" @click="finalizarOrdem(ordemModal.id)">Finalizar O.S.</b-button>
        </div>
      </div>
    </b-modal>

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

      perPage: 10,
      currentPage: 1,

      ordenaCliente: false,      //método para ordenar por cliente
      ordenaColaborador: false, //método para fazer a ordenação por colaborador
      ordenaData: false,       // método para fazer a ordenação pela data

      modalAdicionar: false, //modal de adicionar novas ordens
      
      usuario: {
        nome: '',
        perfil: ''
      },

      // Objeto que ultilazara para filtrar os dados
      filtro: {
        colaborador: '',
        cliente: '',
        status: '',
        dataInicio: '',
        dataFim: ''
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

      ordemModal: [], //insformações que seram passada para o modal de descrição

      // Array de objetos que carrega os dados do banco
      ordens:[],
      colaboradores:[],
      clientes:[],

      fields: [
        {
          key: 'data',
          label: 'Data'
        },
        {
          key: 'titulo',
          label: 'Titulo'
        },
        {
          key: 'colaborador',
          label: 'Colaborador'
        },
        {
          key: 'cliente',
          label: 'Cliente'
        },
        {
          key: 'status',
          label: 'Status',
        }
      ],
    }
  },

  methods: {

    rowClicked(ordem) {
      this.$bvModal.show('modalDescricao')
      this.$refs['tblOrdens'].clearSelected()

      this.ordemModal = ordem
    },

    // Método que faz o tratamento da data para fazer o filtro por periodo
    converteData(data = new Date()) {
      let dataSplit = data.split('/')

      const novaData = new Date(parseInt(dataSplit[2], 10),
                  parseInt(dataSplit[1], 10) - 1,
                  parseInt(dataSplit[0], 10));
      return novaData;
    },

    // Método para abrir o modal de adicionar ordem de serviço
    abrirModal() {
      this.modalAdicionar = !this.modalAdicionar;
      this.getLocation()
      this.listarColaboradores()
      this.listarClientes()
    },

    // Método para limpar os filtros
    limparFiltros() {
      this.filtro.colaborador = '';
      this.filtro.cliente = '';
      this.filtro.status = '';
      this.filtro.dataInicio = '';
      this.filtro.dataFim = '';
    },

    // Função para limpar o formulário de cadastro de novas ordens
    limparForm() {
      this.ordem.titulo = '';
      this.ordem.descricao = '';
      this.ordem.colaborador = '';
      this.ordem.cliente = '';
      this.ordem.latitude = '';
      this.ordem.longitude = '';
    },

    // Função para pegar a latitude e longitude do local de onde foi aberta a ordem de serviço
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

    // Função para ordenação dos dados pelo nome do cliente
    cliente() {
      if(this.ordenaCliente) {
        this.ordens = this.ordens.sort((a, b) => {
          if(a.cliente > b.cliente) {
            return -1
          }else {
            return true
          }
        })
      } else {
        this.ordens = this.ordens.sort((a, b) => {
          if(a.cliente < b.cliente) {
            return -1
          }else {
            return true
          }
        })
      } 
    },

    // Função para ordenação dos dados pelo nome do colaborador
    colaborador() {
      if(this.ordenaColaborador) {
        this.ordens = this.ordens.sort((a, b) => {
          if(a.colaborador > b.colaborador) 
            return -1
          if(a.colaborador < b.colaborador)
            return 1
          return 0
        })
      } else {
        this.ordens = this.ordens.sort((a, b) => {
          if(a.colaborador < b.colaborador) 
            return -1
          if (a.colaborador > b.colaborador)
            return 1
          return 0
        })
      }
    },

    // Função para ordenação dos dados pela data
    data() {
      if(this.ordenaData) {
        this.ordens = this.ordens.sort((a, b) => {
          if(a.data > b.data) {
            return -1
          }else {
            return true
          }
        })
      } else {
        this.ordens = this.ordens.sort((a, b) => {
          if(a.data < b.data) {
            return -1
          }else {
            return true
          }
        })
      } 
    },

    // Função para fazer a busca e listar as ordens de serviços do banco
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

    // Função que faz o post no banco de dados com os dados do formulário das novas ordens
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
          usuario: this.usuario.nome,

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

    this.listarOrdens()
    this.listarColaboradores()
    this.listarClientes()

    if (localStorage.nome) {
      this.usuario.nome = localStorage.nome
    }
    if (localStorage.perfil) {
      this.usuario.perfil = localStorage.perfil
    }
    
  },

  computed: {

    rows() {
        return this.filtroOrdens.length
    },

    // Método para fazer o filtro dos registros de Ordem de Serviço
    filtroOrdens() {

      let valores = []

      // Filtro de Ordem de Serviço por Colaborador
      valores = this.ordens.filter((item) => {
        if(this.filtro.colaborador === ''){ return item }

        return item.colaborador === this.filtro.colaborador
      })

      // Filtro de Ordem de Serviço por Cliente
      valores = valores.filter((item) => {
        if(this.filtro.cliente === ''){ return item }

        return item.cliente === this.filtro.cliente
      })

      // Filtro de Ordem de Serviço por Status
      valores = valores.filter((item) => {
        if(this.filtro.status === ''){ return item }

        return item.status === this.filtro.status
      })

      // Filtro de Ordem de Serviço por Data

      valores = valores.filter((item) => {

        const dataAtual = new Date()
        const dataI = this.filtro.dataInicio.split('-').reverse().join('/')
        const dataF = this.filtro.dataFim.split('-').reverse().join('/')
  
        let dataInicial = this.converteData(dataI)
        let dataFinal = this.converteData(dataF)

        if(this.filtro.dataInicio === '' && this.filtro.dataFim === ''){ return item }

        if(this.filtro.dataInicio !== '' && this.filtro.dataFim === ''){
          if(this.converteData(item.data) >= dataInicial){
            return item
          }
        }
        if(this.filtro.dataInicio === '' && this.filtro.dataFim !== ''){
          if(this.converteData(item.data) <= dataFinal){
            return item
          }
        }
        if(this.filtro.dataInicio !== '' && this.filtro.dataFim !== ''){
          if(this.converteData(item.data) >= dataInicial && this.converteData(item.data) <= dataFinal){
            return item
          }
        }
      })
      
      return valores
    }
  }
}
</script>


<style>

  .main--ordens {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    -webkit-touch-callout: none;  /* iPhone OS, Safari */
    -webkit-user-select: none;    /* Chrome, Safari 3 */
    -khtml-user-select: none;     /* Safari 2 */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* IE10+ */
    user-select: none;            /* Possível implementação no futuro */
    cursor: default;
  }

  .busca {
    display: flex;
    flex-direction: column;
  }
  .filtros {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .filtros select {
    width: 120px;
    text-align: center;
    margin-right: 20px;
    font-size: 14px;
    padding: 0 2px;
    border-radius: 5px;
    border: 1px solid #b3aeae;
  }
  .filtros .datas {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .filtros input {
    width: 140px;
    text-align: center;
    margin-right: 20px;
    font-size: 14px;
    padding: 0 2px;
    border-radius: 5px;
    border: 1px solid #b3aeae;
  }
  .filtros .limpar--filtro {
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s;
  }
  .filtros .limpar--filtro:hover {
    transform: scale(1.1);
  }

  .ordenacao {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
  .ordenacao .button {
    height: 30px;
    padding: 0 5px 0 0;
    display: flex;
    margin-right: 20px;
    align-items: center;
    justify-content: center;
  }
  .ordenacao .button span {
    font-size: 17px;
    font-weight: bold;
  }

  /* Css do modal de descrição da ordem de serviço */
  .modal--descricao .descricao {
    margin-bottom: 15px;
  }
  .modal--descricao .autor span{
    font-size: 14px;
    font-weight: bold;
    margin-right: 10px;
  }

  /* Css dos cards de Ordem de serviço */
  
  .lista--ordens {
    display: flex;
    flex-direction: column;
  }
  .lista--ordens .tabela {
    height: 500px;
    width: 98vw;
  }
  .page-link {
    color: #252525;
  }
  .page-link:hover {
    color: #252525;
  }
  .page-item {
    color: #252525 !important;
  }
  .page-item.active .page-link {
    background-color: #252525;
    border-color: #f5f5f5;
  }

  /* Css do modal de adicionar uma nova ordem */
  .conteudo--modal {
    -webkit-touch-callout: none;  /* iPhone OS, Safari */
    -webkit-user-select: none;    /* Chrome, Safari 3 */
    -khtml-user-select: none;     /* Safari 2 */
    -moz-user-select: none;       /* Firefox */
    -ms-user-select: none;        /* IE10+ */
    user-select: none;            /* Possível implementação no futuro */
    cursor: default;
  }
  .conteudo--modal .titulo--modal {
    display: flex;
    justify-content: space-between;
  }
  .conteudo--modal .titulo--modal span {
    font-weight: bold;
    color: #252525;
    cursor: default;
  }
  .conteudo--modal .titulo--modal .btn--fechar {
    cursor: pointer;
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
    border: 1px solid #b3aeae;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 10px;
  }
  .input-container select {
    border: 1px solid #b3aeae;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 10px;
  }
  .input-container textarea {
    height: 150px;
    border: 1px solid #b3aeae;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 10px;
    resize: none;
  }
  .input-container textarea::-webkit-scrollbar {
    width: 5px;
  }

  .input-container textarea::-webkit-scrollbar-track {
    background: #f5f5f5;
  }

  .input-container textarea::-webkit-scrollbar-thumb {
    width: 5px;
    background-color: #252525;
    border-radius: 20px;
  }
  
  .conteudo--modal .btn--salvar {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }


  /* Css do botão flutuante na tela */
  .flutuante {
    position: fixed;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
    height: 40px;
    width: 40px;
  }
  .flutuante span {
    font-size: 50px;
    transition: all 0.5s;
    background-color: #f5f5f5;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .flutuante span:hover {
    transform: scale(1.2);
  }


  /* Css que faz a responsividade dos itens do componente */
  @media only screen and (max-width: 280px) {

    .busca {
      flex-direction: column;
    }
    .filtros {
      flex-direction: column;
    }
    .filtros .selects {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
    }
    .filtros .selects select{
      width: 30%;
    }
    .filtros .datas {
      width: 90%;
      margin: 10px auto;
      display: flex;
      justify-content: space-around;
    }
    .filtros .datas input {
      height: 25px;
      width: 42%;
      font-size: 14px;
    }
    .filtros .datas .limpar--filtro {
      font-size: 25px;
    }

    .ordenacao {
      margin-top: 10px;
      justify-content: center;
    }
    .ordenacao .button {
      transform: scale(0.8);
    }

    .lista--ordens .ordem {
      width: 95%;
    }

    .titulo--ordem {
      font-size: 17px;
    }

    .colaborador--ordem {
      font-size: 14px;
    }

    .cliente--ordem {
      font-size: 14px;
    }

    .status--ordem {
      font-size: 14px;
    }

    .flutuante span {
      height: 30px;
      width: 30px;
    }	
  }

  @media only screen and (min-width: 281px) and (max-width: 420px) {

    .busca {
      flex-direction: column;
    }
    .filtros {
      flex-direction: column;
    }
    .filtros .selects {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
    }
    .filtros .selects select{
      width: 30%;
    }
    .filtros .datas {
      width: 90%;
      margin: 10px auto;
      display: flex;
      justify-content: space-around;
    }
    .filtros .datas input {
      height: 25px;
      width: 42%;
      font-size: 14px;
    }
    .filtros .datas .limpar--filtro {
      font-size: 25px;
    }

    .ordenacao {
      margin-top: 10px;
      justify-content: center;
    }
    .ordenacao .button {
      transform: scale(0.8);
    }


    .flutuante span {
      height: 20px;
      width: 20px;
      font-size: 30px;
    }
  }

  @media only screen and (min-width: 421px) and (max-width: 768px) {

    .busca {
      flex-direction: column;
    }
    .filtros {
      flex-direction: column;
    }
    .filtros .selects {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
    }
    .filtros .selects select{
      width: 30%;
    }
    .filtros .datas {
      width: 90%;
      margin: 10px auto;
      display: flex;
      justify-content: space-around;
    }
    .filtros .datas input {
      height: 25px;
      width: 42%;
      font-size: 14px;
    }
    .filtros .datas .limpar--filtro {
      font-size: 25px;
    }

    .ordenacao {
      margin-top: 10px;
      justify-content: center;
    }
    .ordenacao .button {
      transform: scale(0.8);
    }

    .lista--ordens .ordem {
      height: 180px;
      border-radius: 5px;
      background: linear-gradient(225deg, #ffffff, #dddddd);
      box-shadow:  -20px 20px 20px #d0d0d0,
                    20px -20px 20px #ffffff;
    }
    .filtros {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .filtros select {
      width: 30%;
      margin: 0;
    }
    .flutuante span {
      height: 30px;
      width: 30px;
      font-size: 40px;
    }
  }
</style>