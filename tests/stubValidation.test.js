const Validator = require('jsonschema').Validator;
const v         = new Validator();

const schemaDir      = `${__dirname}/../schema/`;
const stubDir        = `${__dirname}/../stubs`;
const validStubDir   = `${stubDir}/valid/`;
const inValidStubDir = `${stubDir}/invalid/`;

const fs = require('fs');

const schemaFiles      = fs.readdirSync(schemaDir);
const validStubFiles   = fs.readdirSync(validStubDir).map((el) => ({ name: el, sequence: 0x00 }));
const inValidStubFiles = fs.readdirSync(inValidStubDir).map((el) => ({ name: el, sequence: 0x00 }));

const parseJSON = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const assertStub = (absolutePath, fileName, schema, result) => {
    it(`${fileName}`, () => {
        const json = parseJSON(`${absolutePath}`);

        expect(v.validate(json, schema).valid).toBe(result);
    });
};
const dataProvider = schemaFiles.map((f) => {
    const regex = new RegExp(`^${f.replace(`.schema.json`, ``)}`);

    const invalid = [];
    inValidStubFiles.forEach((el) => {
        if (regex.test(el.name)) {
            el.sequence |= 0x01;

            invalid.push(el);
        }
    });

    const valid = [];
    validStubFiles.forEach((el) => {
        if (regex.test(el.name)) {
            el.sequence |= 0x01;

            valid.push(el);
        }
    });

    return {
        schemaFile: f,
        stubs: {
            invalid: invalid,
            valid: valid
        }
    }
});

describe(`every stub should have a schema`, () => {
    validStubFiles.forEach((f) => {
        it(`${f.name}`, () => {
            expect(f.sequence).toBeGreaterThan(0)
        });
    });

    inValidStubFiles.forEach((f) => {
        it(`${f.name}`, () => {
            expect(f.sequence).toBeGreaterThan(0)
        });
    });
});

describe(`validate stubs against schemas`, () => {
    dataProvider.forEach((el) => {
        describe(`${el.schemaFile}`, () => {
            const schema = parseJSON(`${schemaDir}/${el.schemaFile}`);

            describe(`:: should be valid`, () => {
                el.stubs.valid.forEach((f) => assertStub(`${validStubDir}/${f.name}`, f.name, schema, true))
            });
            describe(`:: should be invalid`, () => {
                el.stubs.invalid.forEach((f) => assertStub(`${inValidStubDir}/${f.name}`, f.name, schema, false));
            });
        })
    });
});
