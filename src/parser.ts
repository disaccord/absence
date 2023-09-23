type AbsenceMappings = {
    info: AbsenceInfo,
    modules: AbsenceModule[]
}

type AbsenceModule = {
    hash: string,
    functions: AbsenceFunction[]
}

type AbsenceFunction = {
    originalName: string,
    newName: string,
    file: string
}

type AbsenceInfo = {
    absenceVersion: number,
    discord: DiscordInformation
}

type DiscordInformation = {
    buildNumber: number,
    buildHash: string
}

const HEADER_REGEX = /absence (\d\.\d)\ndiscord (\d+) ([A-Fa-f0-9]{40})\n/gs

function parseHeader(input: string): AbsenceInfo {
    const headerMatch = HEADER_REGEX.exec(input)!!
    return {
        absenceVersion: parseInt(headerMatch[1]),
        discord: {
            buildNumber: parseInt(headerMatch[2]),
            buildHash: headerMatch[3]
        }
    }
}

function parseModules(input: string): AbsenceModule[] {
    const modules: AbsenceModule[] = []

    let currentModule: AbsenceModule | null = null
    input.split("\n").forEach((line) => {
        const moduleHeaderRegex = /module (.*)/
        const functionDefinition = /fun (.*) to (.*) in (.*)/
        if(moduleHeaderRegex.test(line)) {
            if(currentModule != null) modules.push(currentModule)
            const match = moduleHeaderRegex.exec(line)!!
            currentModule = {
                hash: match[1],
                functions: []
            }
        } else if(functionDefinition.test(line)) {
            const match = functionDefinition.exec(line)!!
            const functionMapping: AbsenceFunction  = {
                originalName: match[1],
                newName: match[2],
                file: match[3]
            }
            currentModule?.functions.push(functionMapping)
        }
    })
    if(currentModule != null) modules.push(currentModule)

    return modules
}

export function parse(input: string): AbsenceMappings {
    const info = parseHeader(input)
    const modules = parseModules(input)
    return {
        info,
        modules
    }
}

