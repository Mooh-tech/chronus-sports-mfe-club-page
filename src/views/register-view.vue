<template>
  <div class="row boxed-row">

    <div class="col-6 register-area m-auto">
      <h2 class="text-center mb-4">Registro</h2>
      <p class="mb-4">
        Fique atento as dados que serão cadastrados, eles serão utilizados para gerar p seu Painel de Controle na
        Plataforma CHRONUS Sports.
      </p>
      <hr>
      <p>
        Informações gerais
      </p>
      <div class="row">
        <CommomInput v-model="store.form.nomeCompleto" col-size="12" type="text" id="name" label="Nome completo:*"
          placeholder="Nome completo*" :is-disabled="store.loading" />
        <div class="col-12">
          <div class="form-floating mb-3">
            <select class="form-select" id="genero" aria-label="Gênero" v-model="store.form.genero">
              <option selected>Selecione uma opção</option>
              <option value="1">Masculino</option>
              <option value="2">Feminino</option>
              <option value="3">Outro</option>
              <option value="4">Prefiro não informar</option>
            </select>
            <label for="genero">Gênero</label>
          </div>
        </div>
        <CommomInput v-model="store.form.cpf" col-size="6" type="text" id="cpf" label="CPF:*" placeholder="CPF*"
          :is-disabled="store.loading" />
        <CommomInput v-model="store.form.rg" col-size="6" type="text" id="rg" label="RG:*" placeholder="RG*"
          :is-disabled="store.loading" />
        <CommomInput v-model="store.form.dataNascimento" col-size="6" type="date" id="dataNascimento"
          label="Data de Nascimento:*" placeholder="dataNascimento*" :is-disabled="store.loading" />
        <CommomInput v-model="store.form.telefone" col-size="6" type="text" id="telefone" label="Telefone:*"
          placeholder="telefone*" :is-disabled="store.loading" />
        <CommomInput v-model="store.form.email" col-size="12" type="email" id="email" label="E-mail:*"
          placeholder="email*" :is-disabled="store.loading" />
        <CommomInput v-model="store.form.senha" col-size="6" type="password" id="senha" label="Senha:*"
          placeholder="senha*" :is-disabled="store.loading" />
        <CommomInput v-model="store.form.confirmarSenha" col-size="6" type="password" id="confirmarSenha"
          label="Confirmar senha:*" placeholder="confirmarSenha*" :is-disabled="store.loading" />
      </div>
      <p>
        Endereço
      </p>
      <div class="row">
        <div class="col-6">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="cep" placeholder="00000-000" v-model="store.form.cep"
              @input="handleCepInput" :disabled="store.loading || store.loadingCep" maxlength="9">
            <label for="cep">CEP*</label>
            <div v-if="store.loadingCep" class="spinner-border spinner-border-sm mt-1" role="status">
              <span class="visually-hidden">Buscando CEP...</span>
            </div>
          </div>
        </div>

        <!-- Logradouro -->
        <commom-input v-model="store.form.logradouro" col-size="12" type="text" id="logradouro" label="Logradouro*"
          placeholder="Rua, Avenida..." :is-disabled="store.loading || store.loadingCep" />

        <!-- Número -->
        <commom-input v-model="store.form.numero" col-size="12" type="text" id="numero" label="Número*"
          placeholder="123" :is-disabled="store.loading" />

        <!-- Complemento -->
        <commom-input v-model="store.form.complemento" col-size="12" type="text" id="complemento" label="Complemento"
          placeholder="Apto 45, Bloco B..." :is-disabled="store.loading" />

        <!-- Bairro -->
        <commom-input v-model="store.form.bairro" col-size="6" type="text" id="bairro" label="Bairro*"
          placeholder="Centro" :is-disabled="store.loading || store.loadingCep" />

        <!-- Cidade -->
        <commom-input v-model="store.form.cidade" col-size="6" type="text" id="cidade" label="Cidade*"
          placeholder="São Paulo" :is-disabled="store.loading || store.loadingCep" />
      </div>
      <button @click="store.enviarFormulario" :disabled="!store.isFormValid || store.loading"
        class="chronus-btn chronus-btn-view-product">
        <span v-if="store.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
        {{ store.loading ? 'Registrando...' : 'Registrar' }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRegisterStore } from '@/stores/'
import { watch } from 'vue'
import CommomInput from '@/components/commom-input.vue'

const store = useRegisterStore()

const handleCepInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return
  
  let valor = target.value.replace(/\D/g, '') // Remove caracteres não numéricos
  
  // Aplica máscara
  if (valor.length > 5) {
    valor = valor.substring(0, 5) + '-' + valor.substring(5, 8)
  }
  
  // Atualiza o valor no store
  store.form.cep = valor
}

// Watch para buscar CEP automaticamente
watch(() => store.form.cep, (novoCep) => {
  const cepLimpo = novoCep.replace(/\D/g, '')
  if (cepLimpo.length === 8) {
    store.buscarCep(cepLimpo)
  }
})
</script>
<style scoped>
.chronus-btn {
  font-family: 'Inter';
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  display: block;
  text-transform: uppercase;
  padding: 1.25rem 1rem;
  border-radius: 1.25rem;
  opacity: .75;
  color: #FFFFFF;
  transition: opacity .3s;
  border: none;
  display: block;
  width: 100%;
  cursor: pointer;
}

.chronus-btn:hover {
  opacity: 1;
}

.chronus-btn-view-product {
  background: linear-gradient(322.68deg, #803EB4 36.47%, #4F25CC 92.31%);

}
</style>