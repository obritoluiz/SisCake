<template>
  <div>
    <b-navbar toggleable="lg" class="barra--nav">
      <b-navbar-brand class="txt--logo" href="#">interHUBX</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      
      <b-collapse id="nav-collapse" is-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <b-avatar size="25" ></b-avatar>
              <span>{{ usuario.nome }}</span>
            </template>
            <b-dropdown-item @click="logout()">Sair</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  
  data() {
    return {
      usuario: {
        nome: '',
        perfil: ''
      },
    }
  },

  mounted() {
    if (!localStorage.nome) {
      this.$router.push('/login')
    }
    if (localStorage.nome) {
      this.usuario.nome = localStorage.nome
    }
    if (localStorage.perfil) {
      this.usuario.perfil = localStorage.perfil
    }
  },
  methods: {
    logout() {
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Sintony:wght@700&display=swap');

  .barra--nav {
    background-color: #f5f5f5;
    color: #282828;
  }
  .txt--logo {
    font-family: 'Sintony', sans-serif;
  }

</style>