export const generateRandom = () => {
    const constrains = 'abcdefghijk0123456789'
    let random = ''
    for (let index = 0; index < 15; index++) {
        if (index == 4 || index == 10) {
            random += "-"
        }
        else {
            const gRandom = constrains[Math.floor(Math.random() * 21)]
            random += gRandom
        }
    }
    return random
}
export const generateCLuterName = () => {
    const constrains = 'abcdefghijk0123456789'
    let random = ''
    for (let index = 0; index < 5; index++) {
        const gRandom = constrains[Math.floor(Math.random() * 21)]
        random += gRandom
    }
    return random
}