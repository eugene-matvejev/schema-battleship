const Validator = require('jsonschema').Validator;
const v = new Validator();

const schemaDir      = `${__dirname}/../schema/`;
const mockDir        = `${__dirname}/../mock`;
const validMockDir   = `${mockDir}/valid/`;
const inValidMockDir = `${mockDir}/invalid/`;

const fs = require('fs');

const schemaFiles      = fs.readdirSync(schemaDir);
const validMockFiles   = fs.readdirSync(validMockDir).map(filename => { return {filename: filename, sequence: 0x00} });
const inValidMockFiles = fs.readdirSync(inValidMockDir).map(filename => { return {filename: filename, sequence: 0x00} });

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

    return {
        schemaFile: filename,
        mocks: {
            invalid: inValidMockFiles.map(filename => {
                if (regex.test(filename.filename)) {
                    filename.sequence |= 0x01;

                    return filename.filename;
                }
            }),
            valid: validMockFiles.map(filename => {
                if (regex.test(filename.filename)) {
                    filename.sequence |= 0x01;

                    return filename.filename;
                }
            })
        }
    }
});

describe(`validate mocks against schemas`, () => {
    dataProvider.forEach(el => {
        describe(`:: ${el.schemaFile}`, () => {
            const schema = parseJSON(`${schemaDir}/${el.schemaFile}`);

            describe(`:: should be valid`, () => {
                el.mocks.valid.forEach(file => assertMock(`${validMockDir}/${file}`, file, schema, true))
            });
            describe(`:: should be invalid`, () => {
                el.mocks.invalid.forEach(file => assertMock(`${inValidMockDir}/${file}`, file, schema, false));
            });
        })
    });
});
