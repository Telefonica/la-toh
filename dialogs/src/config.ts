import * as joi from '@hapi/joi';

const configurationSchema: joi.SchemaMap = {
    LA_TOH_API_MOCK: joi.boolean().default(true), // to use mock
    LA_TOH_API_BASE_URL: joi.string().default('http://localhost:8080'),
    LA_TOH_API_GET_HEROES: joi.string().default('/api/heroes'),
    LA_TOH_API_GET_VILLAINS: joi.string().default('/api/villains'),
};

export default configurationSchema;
