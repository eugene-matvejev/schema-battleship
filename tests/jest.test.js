const Validator = require('jsonschema').Validator;
const v         = new Validator();

const schemaDir      = `${__dirname}/../schema/`;
const mockDir        = `${__dirname}/../mock`;
const validMockDir   = `${mockDir}/valid/`;
const inValidMockDir = `${mockDir}/invalid/`;

const fs = require('fs');

const schemaFiles      = fs.readdirSync(schemaDir);
const validMockFiles   = fs.readdirSync(validMockDir).map(el => ({ name: el, sequence: 0x00 }));
const inValidMockFiles = fs.readdirSync(inValidMockDir).map(el => ({ name: el, sequence: 0x00 }));

const parseJSON = (path) => {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
};
const assertMock = (absolutePath, fileName, schema, result) => {
    it(`${fileName}`, () => {
        const json = parseJSON(`${absolutePath}`);

        expect(v.validate(json, schema).valid).toBe(result);
    });
};
const dataProvider = schemaFiles.map(filename => {
    const regex = new RegExp(`^${filename.replace(`.schema.json`, ``)}`);

    const invalid = [];
    inValidMockFiles.forEach(el => {
        if (regex.test(el.name)) {
            el.sequence |= 0x01;

            invalid.push(el);
        }
    });
    const valid = [];
    validMockFiles.forEach(el => {
        if (regex.test(el.name)) {
            el.sequence |= 0x01;

            valid.push(el);
        }
    });

    return {
        schemaFile: filename,
        mocks: {
            invalid: invalid,
            valid: valid
        }
    }
});

describe(`validate mocks against schemas`, () => {
    dataProvider.forEach(el => {
        describe(`:: ${el.schemaFile}`, () => {
            const schema = parseJSON(`${schemaDir}/${el.schemaFile}`);

            describe(`:: should be valid`, () => {
                el.mocks.valid.forEach(el => assertMock(`${validMockDir}/${el.name}`, el.name, schema, true))
            });
            describe(`:: should be invalid`, () => {
                el.mocks.invalid.forEach(el => assertMock(`${inValidMockDir}/${el.name}`, el.name, schema, false));
            });
        })
    });
});

describe(`every mock should have a schema`, () => {
    validMockFiles.forEach((file) => {
        it(`${file.name}`, () => {
            expect(file.sequence).toBeGreaterThan(0)
        });
    });

    inValidMockFiles.forEach((file) => {
        it(`${file.name}`, () => {
            expect(file.sequence).toBeGreaterThan(0)
        });
    });
});
