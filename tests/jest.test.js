const Validator = require('jsonschema').Validator;
const v = new Validator();

const schemaDir = `${__dirname}/../schema/`;
const validMockDir = `${__dirname}/../mock-valid/`;
const inValidMockDir = `${__dirname}/../mock-invalid/`;

const fs = require('fs');

const schemaFiles = fs.readdirSync(schemaDir);
const validMockFiles = fs.readdirSync(validMockDir);
const inValidMockFiles = fs.readdirSync(inValidMockDir);

const readJSONFile = (path) => {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
};
const assertMock = (absolutePath, fileName, schema, routeAlias, criteria) => {
    const regex = new RegExp(`^${routeAlias}`);

    if (regex.test(fileName)) {
        it(`${fileName}`, () => {
            const json = readJSONFile(`${absolutePath}`);

            expect(v.validate(json, schema).valid).toBe(criteria);
        });
    }
};
describe(`validate mocks against schemas`, () => {
    schemaFiles.forEach(schemaFile => {
        describe(`:: ${schemaFile}`, () => {
            const routeAlias = schemaFile.replace(`.schema.json`, ``);
            const schema = readJSONFile(`${schemaDir}/${schemaFile}`);

            describe(`:: should be valid`, () => {
                validMockFiles.forEach(file => assertMock(`${validMockDir}/${file}`, file, schema, routeAlias, true));
            });
            describe(`:: should be invalid`, () => {
                inValidMockFiles.forEach(file => assertMock(`${inValidMockDir}/${file}`, file, schema, routeAlias, false));
            });
        })
    });
});
