export { default as Clientes } from '../..\\components\\Clientes.vue'
export { default as Colaboradores } from '../..\\components\\Colaboradores.vue'
export { default as NavMenu } from '../..\\components\\NavMenu.vue'
export { default as Ordens } from '../..\\components\\Ordens.vue'
export { default as Painel } from '../..\\components\\Painel.vue'
export { default as TelaColaborador } from '../..\\components\\TelaColaborador.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
