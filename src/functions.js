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
 * Renders the card object to the screen and data
 * @memberof Functions
 * @param {object} scene - The current Phaser scene
 * @return {object} - card Text object
 */
export function renderCard(scene) {
    const currentCard = getCard(scene.gameStats.data.values.gameState)
    scene.gameStats.data.set("card", currentCard)
    let targets = currentCard.targets.toString()
    if (currentCard.targets.length == 0) { targets = "They" }
    let cardText, cardInstructions
    if (currentCard.type == "care") {
        cardInstructions = ` Select a total of ${currentCard.numTargets} characters with a skill of ${currentCard.skill}.`
    } else {
        cardInstructions = ` ${targets} receive ${currentCard.value}.`
    }
    cardText = scene.add.text(58, 275, currentCard.text + cardInstructions, {
        fontSize: 40,
        color: "red",
        backgroundColor: "white",
        wordWrap: {
            width: 650
        }
    })    
    return cardText
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
        toggleCharacterSelection(character, scene)
        console.log("targets validated? " + validateTargets(scene))
    }, this)
    character.add([background, characterName, characterHealth, characterSkills])
    return character
}

/**
 * Toggles the visual selection and is_selected in container data
 * @memberof Functions
 * @param {object} character - a character's container object
 * @param {object} scene - optional scene object to return array of selected characters
 * @return {array} An array of currently selected character containers
 */
export function toggleCharacterSelection(character, scene) {
    const children = character.list
    let sprite, characterList
    let selected = []
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
    if (scene !== undefined) {
        characterList = scene.characterList.children.entries
        characterList.forEach(member => {
            if (member.data.values.is_selected == true) {
                selected.push(member)
            }
        })
        console.log(selected)
        return selected
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
function getCharacterByName(scene, characterName) {
    const characterList = scene.characterList.children.entries
    let character = {}
    characterList.forEach(member => {
        if (member.name == characterName) {
            character = member
        }
    })
    return character
}

/**
 * Checks if character has a skill
 * @memberof Functions
 * @param {object} character - A character container
 * @param {string} skill - A skill text from a card
 * @return {boolean} Whether the character has the skill or not
 */
function checkSkills(character, skill) {
    const characterSkill = character.data.values.skills
    if (characterSkill.includes(skill)) {
        return true
    } else {
        return false
    }
}

/**
 * Checks if selections are valid based on charactes and current card
 * @memberof Functions
 * @param {object} scene - A Phaser scene with characterList
 * @return {boolean} Whether the selections are valid based on card
 */
export function validateTargets(scene) {
    const characterList = scene.characterList.children.entries
    const currentCard = scene.gameStats.data.values.card
    const skill = currentCard.skill
    let count = 0
    let status = false
    characterList.forEach(character => {
        if (character.data.values.is_selected == true) {
            count++
            if (count == currentCard.numTargets && checkSkills(character, skill)) {
                status = true
            } else {
                status = false
            }
        }
    })
    return status
}