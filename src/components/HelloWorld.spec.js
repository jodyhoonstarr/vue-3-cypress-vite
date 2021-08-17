import {mountCallback} from '@cypress/vue'
import HelloWorld from './HelloWorld.vue'


describe('ButtonCounter', () => {
  beforeEach(mountCallback(HelloWorld, {
    propsData: {
      msg: 'Hello Cypress!',
    },
  }))

  it('renders a message', () => {
    cy.get('h1').contains('Hello Cypress!')
  })

  it('emits "testEvent" event on click', () => {
    const spy = cy.spy()
    Cypress.vue.$on('testEvent', spy)
    cy.get('#customButton')
        .click()
        .then(() => {
          expect(spy).to.be.called
        })
  })

})
