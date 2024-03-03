
const dictionaries = {
    en: import('./en.json').then((module) => module.default),
    fr: import('./fr.json').then((module) => module.default),
}

// export const getDictionary = async (local) => dictionaries[local]

export function getDictionary(local){
    
    return dictionaries[local]
}