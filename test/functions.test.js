import { expect } from 'chai'
import { getCard } from '../src/functions'

describe('Cards', () => {
    it('gets a random card object from list based on index of GameStates', () => {
        expect(getCard(1)).to.be.an('object')
    })
})