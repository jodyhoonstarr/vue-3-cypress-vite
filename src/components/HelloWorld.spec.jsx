import {mount} from '@cypress/vue'
import HelloWorld from './HelloWorld.vue'

// Preferred
// Equivalent to the below example (JS-only)
// but JSX lets you add styles easily (like resize: both, etc)
describe('JSX Button Counter', () => {
  it('emits an event (with aliases)', () => {
    const spy = cy.spy().as('testEvent')

    mount(() => <HelloWorld onTestEvent={ spy } msg="Hello Cypress!" />)
      .get('#customButton')
      .click()

      // Two ways to make assertions on a spy
      // Option 1: Using the "as" aliass defined on the spy (better DX, prints out named spy in Command Log)
      // Option 2: Asserting on the "spy" directly
      .get('@testEvent').should('have.been.called') 
      .should(() => expect(spy).to.have.been.called) 
  })
})

// Vue compiles methods onto "attrs" in Vue 3.
describe('Using Vue-specific attrs', () => {
  it('emits an event', () => {
    const spy = cy.spy()
    mount(HelloWorld, {
      attrs: { onTestEvent: spy },
      props: { msg: 'Hello Cypress!' }
    })
      .get('#customButton')
      .click()
      .should(() => expect(spy).to.have.been.called)
  })
})

// Long-form, explains how to get a reference to vueWrapper
// Using Vue Test Util's #emitted
describe('Vue Test Utils Counter', () => {
  beforeEach(() => {
    // propsData => props
    // https://next.vue-test-utils.vuejs.org/migration/#propsdata-is-now-props
    mount(HelloWorld, { props: { msg: 'Hello Cypress!' } })

      // cy.get('@wrapper') returns Vue Test Utils wrapper
      // Cypress.vueWrapper is the result of VTU mounting the component
      // Cypress.vue is the Vue instance that was mounted
      .as('wrapper')
  })

  it('renders a message', () => {
    cy.get('h1').contains('Hello Cypress!')
  })

  it('emits "testEvent" event on click', () => {
    cy.get('#customButton')
      .click()
      .get('@wrapper')

      // Use cy.should instead of cy.then so that your assertions retry
      // https://docs.cypress.io/api/commands/should
      // Doign this solves the kinds of issues you'd have in Vue Test Utils that require $nextTick
      .should(wrapper => {
        expect(wrapper.emitted('testEvent')).to.have.length(1)
      })
  })
})
