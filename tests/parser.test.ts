
import { parse } from "../src/parser";
const testFile = "absence 1.0" + "\n" +
"discord 230026 5daed8b3074c0568692b22000f2f9ca2c5d672c4" + "\n" +
"module 222" + "\n" +
"fun l to initialize in index.js"

const parsed = parse(testFile)
describe("file header", () => {
    const info = parsed.info
    test("absence version should be 1.0", () => 
        expect(1.0).toBe(info.absenceVersion)
    )

    test("discord build number should be 230026", () => 
        expect(info.discord.buildNumber).toBe(230026)
    )

    test("discord build hash should be \"5daed8b3074c0568692b22000f2f9ca2c5d672c4\"", () => 
        expect(info.discord.buildHash).toBe("5daed8b3074c0568692b22000f2f9ca2c5d672c4")
    )
})

describe("modules", () => {
    const modules = parsed.modules
    test("should have one module", () => expect(modules.length).toBe(1))

    describe("functions", () => {
        const module = modules[0]
        test("module should have one function", () => expect(module.functions.length).toBe(1))

        test("module id should be \"222\"", () => expect(module.hash).toBe("222"))

        const func = module.functions[0]
        
        test("original name should be \"l\"", () => expect(func.originalName).toBe("l"))

        test("new name should be \"initialize\"", () => expect(func.newName).toBe("initialize"))

        test("mapped file should be \"index.js\"", () => expect(func.file).toBe("index.js"))
    })
})