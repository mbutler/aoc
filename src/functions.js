import { Cards } from './cards'
import { GameStates } from './states'

/**
 * Get a random card object based on index of GameStates.
 * @memberof Functions
 * @param {number} index - number corresponding to GameState array
 * @return {object} - card object
 */
export function getCard(index) {
    const state = GameStates[index]
    const list = Cards[state]
    if (list !== undefined) {
        const rand = Math.floor(Math.random() * Math.floor(list.length))
        const card = Cards[state][rand]
        return card
    }
}

/**
 * Add and return a character container with stats
 * @memberof Functions
 * @param {object} scene - object
 * @param {number} x  - coordinate of container
 * @param {number} y  - coordinate of container
 * @param {string} key  - name of image key from preload
 * @param {object} content - data object about character
 * @return {object} A container object of the character
 */
export function addCharacter(scene, x, y, key, content) {
    const character = scene.add.container()
    character.name = content.name
    const characterName = scene.add.text(x + 20, y + 15, content.name, {
        fontSize: 40,
        color: "white"
    })
    let characterHealth = scene.add.text(x + 60, y + 85, "Health: " + content.health, {
        fontSize: 20,
        color: "white",
        wordWrap: {
            width: 175
        }
    })
    characterHealth.name = "characterHealthText"
    const characterSkills = scene.add.text(x + 60, y + 115, "Skills: " + content.skills, {
        fontSize: 20,
        color: "white",
        wordWrap: {
            width: 175
        }
    })
    const bio = scene.add.text(x + 58, y + 75, "", {
        fontSize: 15,
        color: "white",
        wordWrap: {
            width: 175
        }
    })
    const background = scene.add.sprite(x, y, key).setOrigin(0, 0).setInteractive()
    character.setDataEnabled()
    character.setData(content)
    background.on('pointerdown', () => {
        console.log(character.name)
        console.log("Health: " + character.data.values.health)
        toggleCharacterSelection(character)
    }, this)
    character.add([background, characterName, characterHealth, characterSkills])
    return character
}

function toggleCharacterSelection(character) {
    const children = character.list
    let sprite
    children.forEach(child => {
        if (child.type == "Sprite") {
            sprite = child
        }
    })

    if (character.data.values.is_selected == false) {
        character.data.set("is_selected", true)
        sprite.setAlpha(0.5)
    } else {
        character.data.set("is_selected", false)
        sprite.setAlpha(1)
    }
}

/**
 * Updates Character health in container data as well as text
 * @memberof Functions
 * @param {object} character - A character container object
 * @param {number} newHealth - the new value to set for character's health
 * @return {object} A container object of the character
 */
function updateCharacterHealth(character, newHealth) {
    const children = character.list
    character.data.set("health", newHealth)
    children.forEach(child => {
        if (child.name == "characterHealthText") {
            child.setText("Health: " + newHealth)
        }
    })
    return character
}

/**
 * Returns a character container based on name
 * @memberof Functions
 * @param {object} scene - A Phaser scene with characterList
 * @param {string} characterName - the character's name
 * @return {object} A container object of the character
 */
export function getCharacterByName(scene, characterName) {
    const characterList = scene.characterList.children.entries
    let character = {}
    characterList.forEach(member => {
        if (member.name == characterName) {
            character = member
        }
    })
    return character
}